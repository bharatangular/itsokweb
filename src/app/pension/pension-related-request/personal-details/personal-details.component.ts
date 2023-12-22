import { DatePipe, } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiEssService } from 'src/app/services/api-ess.service';

import { SnackbarService } from 'src/app/services/snackbar.service';
import { NgxImageCompressService } from 'ngx-image-compress';
@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
  providers: [DatePipe],
})

export class PersonalDetailsComponent implements OnInit {
  @Input() EmpDetails: any = {};
  @Input() config: any = {};
  @Output() EmpData = new EventEmitter();
  @Output() persoData = new EventEmitter();
  @Output() JanaadhaarUser = new EventEmitter();
  @Output() dateOfBirth = new EventEmitter();
  @Input() userAction: Array<any> = [];
  @Input() personal: Subject<boolean>;
  personalDetails: any;
  janaadhaarList: Array<any> = [];
  genderList: Array<any> = [];
  bloodGroupList: Array<any> = [];
  maritalStatusList: Array<any> = [];
  disabilityTypeList: Array<any> = [];
  nationalityList: Array<any> = [];
  casteCategoryList: Array<any> = [];
  religionList: Array<any> = [];
  stateList: Array<any> = [];
  districtList: Array<any> = [];
  cityList: Array<any> = [];
  minorityList: Array<any> = [];
  disabilityCategorylist: any;
  IsMatrialMa = false;
  dobdata: any;
  docList: Array<any> = [];
  IsFirst = true;
  isSaveEnable = false;
  searchIcon = false;
  action = '';
  empId: any;
  isEnabletoday: boolean = true;
  isEnablefut: boolean = false;
  isPayManager:boolean=true;
  uploadSelfPic:boolean=true;
  constructor(private formbuilder: FormBuilder,
    private apiService: ApiEssService,
    private snackbar: SnackbarService,
    private datePipe: DatePipe,
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private imageCompress: NgxImageCompressService
  ) { }
  @Input() picData: any;

  roleid: any;
  ngOnInit(): void {
    this.roleid = sessionStorage.getItem('roleId')
    console.log('roleid', this.roleid)
    this.personalDetails = this.formbuilder.group({
      employeeCategory: [true, Validators.required],
      employeeId: new FormControl({ value: '', disabled: true }),
      janAadharId: ['', Validators.compose([Validators.minLength(10)])],
      memberId: ['', Validators.required],
      firstName: ['', Validators.required,],
      middleName: new FormControl(null),
      lastName: ['', this.config.registrationType === 1 ? Validators.required : null],
      height: [],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      fatherName: ['', Validators.required],
      motherName: ['', Validators.required],
      spouseName: new FormControl(null),
      mobileNumber: ['', Validators.required],
      //emailID: new FormControl(null, Validators.compose([Validators.maxLength(50)])),
      emailID: ['null', [Validators.required,Validators.compose([Validators.maxLength(50)]) ,Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      socialCategory: ['', Validators.required],
      dob: ['', Validators.required],
      identificationMark:[null],
      // identificationMark: new FormControl(null, Validators.compose([Validators.minLength(2), Validators.maxLength(100)])),
      bloodGroup: [''],
      typeOfDisability: ['',],
      homeDistrict: ['', Validators.required],
      homeTown: ['', Validators.required],
      belongsToMinority: [0, Validators.required],
      disabilityStatus: [0, Validators.required,],
      nationality: [1002, Validators.required],
      percentageOfDisability: new FormControl(null, Validators.compose([Validators.min(40), Validators.max(100)])),
      religion: ['', Validators.required],
      aadharRefNo: new FormControl(null),
      passport: new FormControl(null),
      pan: new FormControl(null, Validators.compose([Validators.pattern('^[A-Za-z]{5}[0-9]{4}[A-Za-z]$')])),
      minorityCategory: new FormControl({ value: null }),
      homeState: ['', Validators.required],
      documentList: new FormControl(null),
      disabilityCategory: new FormControl(null),
      dobInWord: new FormControl({ value: null, disabled: true }),
      employeePhoto: new FormControl(),
      employeeCode: ['']
    })

    this.getGender();
    this.getBloodGroup();
    this.getMaritalStatus();
    this.getDisabilityType();
    this.getNationality();
    this.getCasteCategory();
    this.getReligion();
    this.getState();
    this.getMinorityList();
    this.getDisabilityCategory();

    if (this.config.registrationType === 2) {
      // this.personalDetails.controls.firstName.disable();
      // this.personalDetails.controls.gender.disable();
      this.personalDetails.controls.dob.disable();
      // this.personalDetails.controls.fatherName.disable();
    }
    // console.log("userAction",this.userAction.length)
    this.config.isModified ? this.isSaveEnable = true : this.isSaveEnable = false;

    this.personal.subscribe(v => {
      this.onSubmit();
    });
  }



  ngOnChanges(changes: any) {
    if (!changes.EmpDetails?.firstChange) {
      const data = changes.EmpDetails?.currentValue;
      console.log("data", data)
      this.personalDetails.patchValue({ ...data });

      if(data?.isemployeePhoto)
      {
        this.uploadSelfPic=false;
      }
      this.getDistrict();
      this.getCity();
      if (data?.janAadharId > 0) {
        this.getJanaadhaar(data?.janAadharId)
      }

      console.log("usraction", this.userAction.length);

      // if(data?.employeeCode)
      // {
      //   // this.personalDetails.patchValue({ employeeCode: data.employeeCode });
      //   this.personalDetails.patchValue({ employeeId: data.employeeCode }); 

      // }
      // else
      // {
      //   if(data?.employeeId)
      //   // this.personalDetails.patchValue({ employeeId: data.employeeId });
      //   this.personalDetails.patchValue({ employeeCode: data.employeeId });
      // }

      if (data?.belongsToMinority == "1") {
        this.personalDetails.patchValue({ minorityCategory: data.minorityCategory });

      }
      // if(this.userAction.length != 0)
      // {
      //  // console.log("usraction",this.userAction.length);
      //   this.personalDetails.patchValue({ employeeId: data.employeeCode });            
      // }
      // else
      // {
      //   this.personalDetails.patchValue({ employeeId: data.employeeId });
      // }
      this.config.isModified ? this.isSaveEnable = true : this.isSaveEnable = false;
      if (data?.documentList)
        this.docList = data.documentList;
      this.docList = this.docList?.filter(item => item.documentName != "Employee Photo");
      console.log("docList", this.docList)
      if (data?.employeeId)
        this.empId = data.employeeId;

      if (this.IsFirst) {
        this.getJanaadhaar(parseInt(this.personalDetails.value.janAadharId));
        this.getDistrict();
        this.getCity();
        this.IsFirst = false;
      }
      this.changedob();
    }

  }

  // private readonly minorityCategoryV: ValidatorFn = c => {
  //   return this.ismin ? Validators.required(c) : Validators.nullValidator(c);
  // }
  //4807772669
  //4811103420
  getJanaadhaar = (value: any) => {


    this.apiService.postIfms('janaadhaar/familyinfo', { janAadharId: value, enrId: 0, aadharId: 0 }).subscribe({
      next: (res:any) => {
        const data = res.root.personalInfo.member;
        console.log("list", data)
        if (Array.isArray(data)) {
          this.janaadhaarList = data;
        } else {
          this.janaadhaarList = [];
          this.janaadhaarList.push(data);
        }
        this.JanaadhaarUser.emit(this.janaadhaarList);
      }
    })

  }


  getPanInfo = (event: any) => {
    return;
    // if (event.length === 10) {
    //   this.apiService.postIfms('pan/paninfo', { panNumber: this.personalDetails.value.pan }).subscribe({
    //     next: res => {
    //       if (!res.IsSuccess) {
    //         this.snackbar.show(res.Message, 'danger');
    //       } else {
    //         this.snackbar.show('Pan number Verified', 'success')
    //       }
    //     }
    //   })

    // }

  }
  isHead: boolean = false
  changeMember = () => {

    const data = this.janaadhaarList.filter((x: any) => x.jan_mid == 0 ? x.hof_jan_m_id : x.jan_mid === this.personalDetails.value.memberId)[0];
    console.log(data)
    //  if(this.personalDetails.value.memberId==0)
    //  {
    //    this.isHead=true;
    //    this.personalDetails.patchValue({memberId:data.hof_jan_m_id})
    //  }else
    //  {
    //   this.isHead=false;
    //   this.personalDetails.patchValue({memberId:data.jan_mid})
    //  }




  }


  // 853280326999
  verifyAadhaar = (event: any) => {
    this.apiService.postIfms('aadhaar/tokenization', { aadhaarNo: this.personalDetails.value.aadharRefNo }).subscribe({
      next: (res:any) => {
        this.personalDetails.patchValue({
          aadharRefNo: res.DSMTokanize.RefNo
        });
      }
    })
  }

  registrationType(type: any) {
    type.value === true ? this.config.registrationType = 1 : this.config.registrationType = 2
    type.value === true ? this.personalDetails.controls.employeeId.disable() : this.personalDetails.controls.employeeId.enable();

  }

  modify() {
    this.personalDetails.enable();
    this.isSaveEnable = true;
    this.personalDetails.controls.dobInWord.disable();
    this.config.isModified = false
  }
  ismin: boolean = false;
  onItemChange(event: any) {
    if (event.value == false) {
      this.ismin = false;
      this.personalDetails.patchValue({ minorityCategory: '' });
      this.personalDetails.controls['minorityCategory'].disable();
      this.personalDetails.get("minorityCategory").clearValidators();
      this.personalDetails.get('minorityCategory').updateValueAndValidity();
    }
    else {
      this.ismin = true;
      this.personalDetails.controls['minorityCategory'].enable();
      this.personalDetails.get("minorityCategory").addValidators([Validators.required]);
      this.personalDetails.get('minorityCategory').updateValueAndValidity();
    }
  }
  userAction1: any
  getGender = () => {

    this.apiService.postmdm('getGender', {}).subscribe({
      next: (res) => {
        this.genderList = res.data;
      }
    })
  }
  getBloodGroup = () => {
    this.apiService.postmdm('getBloodGroup', {}).subscribe({
      next: (res) => {
        this.bloodGroupList = res.data;
      }
    })
  }

  getMaritalStatus = () => {
    this.apiService.postmdm('getMaritalStatus', {}).subscribe({
      next: (res) => {
        this.maritalStatusList = res.data;
      }
    })
  }
  getDisabilityType = () => {
    this.apiService.postmdm('getDisabilityType', {}).subscribe({
      next: (res) => {
        this.disabilityTypeList = res.data;
      }
    })
  }
  getNationality = () => {
    let data = [{
      countryId: 1002,
      countryNameEn: "Indian",
      countryNameHi
        :
        "भारत"
    }]
    this.nationalityList = data;
    this.personalDetails.patchValue({
      nationality: this.nationalityList[0].countryId
    })
    // this.apiService.postmdm('getNationality', {}).subscribe({
    //   next: (res) => {
    //     this.nationalityList = res.data;
    //     let data:any;
    //     let index:any
    //     this.nationalityList.filter((x:any,index1:number)=>x.countryId==1002)
    //     // this.nationalityList.splice(index,1);
    //     // this.nationalityList.unshift(data);
    //     console.log(this.nationalityList)
    //   }
    // })
  }
  nationalityChange() {
    // this.personalDetails.patchValue({
    //   homeState:"",
    //   homeDistrict:"",
    //   homeTown:""
    // })
  }
  checkRange() {

    if (this.personalDetails.value.percentageOfDisability < 40 || this.personalDetails.value.percentageOfDisability > 100) {
      alert("Please enter value between 40 to 100");
      this.personalDetails.patchValue({
        percentageOfDisability: ""
      })
    }
  }
  getState = () => {
    this.apiService.postmdm('getState', {}).subscribe({
      next: (res) => {
        this.stateList = res.data;
      }
    })
  }

  getDistrict = () => {
    this.apiService.postmdm('getDistrict', { stateId: this.personalDetails.value.homeState }).subscribe({
      next: (res) => {
        this.districtList = res.data;
      }
    })
  }
  getCity = () => {
    this.apiService.postmdm('getCity', { districtId: this.personalDetails.value.homeDistrict }).subscribe({
      next: (res) => {
        this.cityList = res.data;
      }
    })
  }

  getCasteCategory = () => {
    this.apiService.postmdm('getCasteCategory', {}).subscribe({
      next: (res) => {
        this.casteCategoryList = res.data;
      }
    })
  }
  getMinorityList = () => {
    this.apiService.postmdm('getMinorityList', {}).subscribe({
      next: (res) => {
        this.minorityList = res.data;
      }
    })
  }

  getReligion = () => {
    this.apiService.postmdm('getReligion', {}).subscribe({
      next: (res) => {
        this.religionList = res.data;
      }
    })
  }
  getDisabilityCategory = () => {
    this.apiService.postmdm('getDisabilityCategory', {}).subscribe({
      next: (res) => {
        this.disabilityCategorylist = res.data;
      }
    })
  }
  //getDocList
  changeSoc = (data: any) => {
    if (data.value === 6 || data.value === 'true') {
      this.personalDetails.patchValue({ belongsToMinority: 'true' });
      this.personalDetails.get('minorityCategory').addValidators([Validators.required]);
      this.personalDetails.get('minorityCategory').updateValueAndValidity();
    } else {
      this.personalDetails.patchValue({ belongsToMinority: 'false' });
      this.personalDetails.get('minorityCategory').clearValidators();
      this.personalDetails.get('minorityCategory').updateValueAndValidity();
    }
  }

  onChangeMarital = (data: any) => {
    if (data.value === 1) {
      // this.personalDetails.get('spouseName').addValidators([Validators.required]);
      // this.personalDetails.get('spouseName').updateValueAndValidity();
      this.IsMatrialMa = false
    } else {
      // this.personalDetails.get('spouseName').clearValidators();
      // this.personalDetails.get('spouseName').updateValueAndValidity();
      this.IsMatrialMa = true;
      // this.personalDetails.patchValue({ spouseName: '' })
    }
  }

  changeDS = (data: any) => {
    console.log(data)
    if (data.value === 1) {
      this.personalDetails.get('typeOfDisability').addValidators([Validators.required]);
      this.personalDetails.get('typeOfDisability').updateValueAndValidity();
      this.personalDetails.get('percentageOfDisability').addValidators([Validators.required]);
      this.personalDetails.get('percentageOfDisability').updateValueAndValidity();
      this.personalDetails.get('disabilityCategory').addValidators([Validators.required]);
      this.personalDetails.get('disabilityCategory').updateValueAndValidity();
    } else {
      this.personalDetails.get('typeOfDisability').clearValidators();
      this.personalDetails.get('typeOfDisability').updateValueAndValidity();
      this.personalDetails.get('percentageOfDisability').clearValidators();
      this.personalDetails.get('percentageOfDisability').updateValueAndValidity();
      this.personalDetails.get('disabilityCategory').clearValidators();
      this.personalDetails.get('disabilityCategory').updateValueAndValidity();
      this.personalDetails.patchValue({ percentageOfDisability: null, typeOfDisability: null, disabilityCategory: null })
    }
  }

  changedob() {

    if (!this.personalDetails.value.dob) { return };

    const dobword = this.dobToWordConvert(this.datePipe.transform(this.personalDetails.value.dob, 'dd-MM-yyyy'));
    this.personalDetails.patchValue({ dobInWord: dobword });
    this.dateOfBirth.emit(this.personalDetails.value.dob);
    this.personalDetails.controls.dobInWord.disable();

  }

  dobToWordConvert = (dt: any) => {

    const dob = dt.split('-');
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const final = this.toWords(dob[0]) + " " + months[parseInt(dob[1]) - 1] + " " + this.toWords(dob[2]);
    return final;
  }

  toWords(s: any) {
    const dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const th = ['', 'thousand', 'million', 'billion', 'trillion'];
    s = s.toString(); s = s.replace(/[\, ]/g, ''); if (s != parseFloat(s)) return 'not a number'; let x = s.indexOf('.'); if (x == -1) x = s.length; if (x > 15) return 'too big'; let n = s.split(''); let str = ''; let sk = 0; for (let i = 0; i < x; i++) { if ((x - i) % 3 == 2) { if (n[i] == '1') { str += tn[Number(n[i + 1])] + ' '; i++; sk = 1; } else if (n[i] != 0) { str += tw[n[i] - 2] + ' '; sk = 1; } } else if (n[i] != 0) { str += dg[n[i]] + ' '; if ((x - i) % 3 == 0) str += 'hundred '; sk = 1; } if ((x - i) % 3 == 1) { if (sk) str += th[(x - i - 1) / 3] + ' '; sk = 0; } } if (x != s.length) { let y = s.length; str += 'point '; for (let i = x + 1; i < y; i++) str += dg[n[i]] + ' '; } return str.replace(/\s+/g, ' ');
  }
  getDocument = (data: any) => {
    this.docList = data;
    console.log("doclist", this.docList)
  }

  imageUrl: any;

  uploadFile1(event: any) {

    let time1 = new Date();
    const file = event.target.files[0];
    if ((file.size / 1024) > 500) {
      alert("Max 500KB file size allowed")
      return;
    }
    let ex2: any[] = file.name.split(".");
   // ex2[1] == 'jpg' || ex2[1] == 'JPG' ||
    if ( ex2[1] == 'jpeg' || ex2[1] == 'JPEG') {

    } else {
      alert("Only  jpeg formats are allowed");
      return;
    }

    //const fileName = "doc" + time1.getHours() + time1.getMilliseconds().toString() + "." + ex2[1];
    const fileName =  "doc" + time1.getDate() + (time1.getMonth()+1) +time1.getFullYear() + time1.getHours() +time1.getMinutes() + time1.getMilliseconds().toString()+"."+ex2[1];

    var data4: any;
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(reader.result);
      // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      data4 = reader.result;
      let data5 = data4.toString()
      let data6: any[] = [];
      data6 = data5.split("base64,")

      //console.log(data4);
      let data1 = {
        "type": "image",
        "sourceId": 2,
        "docAttributes": [

        ],
        "data": [
          {
            "docTypeId": "1",
            "docTypeName": "photo",
            "docName": fileName,
            "docTitle": "essdoc",
            "content": data6[1]
          }
        ]
      }
      //console.log("data", data1);


      this.apiService.postOr("wcc/uploaddocs", data1).subscribe({
        next: (res:any) => {
          console.log("res", res);


          if (res.data.document[0].docId) {
            this.personalDetails.patchValue({
              employeePhoto: res.data.document[0].docId,

            })

            this.imageUrl = data5;

            alert("Your photo has been uploaded successfully.")
          } else {
            alert("Sorry, an error has occurred. Please try again later")
          }
        }, error: err => {
          this.snackbar.show(err?.error?.description || 'Server Error', 'danger');
        }
      })
    };
    reader.readAsDataURL(file);
  }

  // getDocumentFile = (id: number) => {
  //   this.apiService.postdoc('getDocumentByDocumentId', { documentId: id }).subscribe({
  //     next: res => {
  //       if (res.status == 'SUCCESS') {
  //         console.log(res.data.documentContent)
  //       } else {
  //         this.snackbar.show('Somthing went wrong', 'danger');
  //       }
  //     }, error: err => {
  //       this.snackbar.show(err.error.description, 'danger')
  //     }
  //   })
  // }
  saveOffline() {
    console.log(this.personalDetails.value)
    if (this.personalDetails.invalid) { return }

    console.log("personalDetails", this.personalDetails.value)
    delete this.personalDetails.value.dobInWord;
    const personalData = this.personalDetails.getRawValue();
    delete personalData.dobInWord;
    let data: any = []
    for (let i = 0; i < this.docList.length; i++) {
      let data2 = {
        "dmsDocumentId": this.docList[i].dmsDocumentId,
        "docTypeId": this.docList[i].docTypeId,
        "documentName": this.docList[i].documentName
      }
      data.push(data2);
    }
    console.log("documentList", data)
    personalData['documentList'] = data;

    // this.persoData.emit(personalData);
    this.apiService.postmst('personalDetail/validate', personalData).subscribe({
      next: res => {
        console.log("status", res.status)
        if (res.status == 'SUCCESS') {
          const data = { step: 1, value: personalData, action: this.action }
          // this.EmpData.emit(data);         
          this.persoData.emit(personalData);
        } else if (res.status == 'FAILURE') {

        }
      }, error: err => {


        console.log(JSON.stringify(err))
        return;
      }
    })
  }
  isLoadingSPic:boolean=false
 
  uploadFile(event: any) {
  

    const file = event.target.files[0];

    if (file) {
        const fileType = file.type;

        if (fileType.includes('pdf')) {

            alert("Selected file is a PDF");

        } 
        else if (fileType.includes('image')) {

            const reader = new FileReader();

            reader.onloadend = (e: any) => {
              console.log("Old file", file);

                const maxSize = 200 * 1024; // 100KB in bytes
                let quality = 75; // Initial quality setting

                const compressRecursive = () => {
                    const base64String = e.target.result;
                    this.imageCompress
                        .compressFile(base64String, -1, quality, quality) // third argument is ratio, forth argument is quality
                        .then(compressedImage => {
                            const blob = this.dataURItoBlob(compressedImage);
                            const compressedSize = blob.size;
                            if (compressedSize <= maxSize) {
                                const jpegFile = new File([blob], file.name, {
                                    type: 'image/jpeg'
                                });
                                this.displayConvertedFile(jpegFile);
                            } else {
                                quality -= 5;
                                compressRecursive();
                            }
                        });
                }
                compressRecursive();
            };
            reader.readAsDataURL(file);

        } 
        else {

            alert("Selected file is not a PDF or image");

        }
    }

}
dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: 'image/jpeg' });
}
displayConvertedFile(file: File) {
  console.log("New file",file);
  let ex2: any[] = file.name.split(".");
  let time1 = new Date();
  const fileName =  "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".jpeg" ;

  var data4: any;
  const reader = new FileReader();
  //return;
  reader.onloadend = () => {
      data4 = reader.result;
      let data5 = data4.toString()
      let data6: any[] = [];
      data6 = data5.split("base64,")

      //console.log(data6);
      let data1 = {
          "type": "image",
          "sourceId": 2,
          "docAttributes": [

          ],
          "data": [{
              "docTypeId": "1",
              "docTypeName": "photo",
              "docName": fileName,
              "docTitle": "essdoc",
              "content": data6[1]
          }]
      }
      //console.log("data", data1);
     
      this.isLoadingSPic=true
     
      this.apiService.postOr("wcc/uploaddocs", data1).subscribe((res: any) => {
          //console.log("res", res);
          console.log("res", res);
         
  this.isLoadingSPic=false
  
  

    if (res.data.document[0].docId) {
      this.personalDetails.patchValue({
        employeePhoto: res.data.document[0].docId,

      })

      this.imageUrl = data5;

      alert("Your photo has been uploaded successfully.")
    } else {
      alert("Sorry, an error has occurred. Please try again later")
    }
  

      },(error)=>{
        this.isLoadingSPic=false
        alert("Some Error Occured")
      })
  };
  reader.readAsDataURL(file);



}
  onSubmit = () => {

    if (this.personalDetails.value.belongsToMinority == "0") {
      this.personalDetails.patchValue({
        minorityCategory: ""
      })
    } else {
      this.personalDetails.get("minorityCategory").addValidators([Validators.required]);
      this.personalDetails.get('minorityCategory').updateValueAndValidity();
    }
    // console.log(this.personalDetails.value)
    if (this.personalDetails.invalid) {
      this.personalDetails.markAllAsTouched()
      alert("Please ensure that all fields are filled correctly and completely");
      return;
    }
    // this.personalDetails.value.documentList = this.docList;
    // console.log("personalDetails",this.personalDetails.value)
    delete this.personalDetails.value.dobInWord;
    let personalData = this.personalDetails.getRawValue();

    // console.log("personalDetails2",personalData)
    delete personalData.dobInWord;
    let data4: any = []
    console.log(this.docList)
    let isJoint = 0;
    if (this.docList) {

      for (let i = 0; i < this.docList.length; i++) {
        let data2 = {
          "dmsDocumentId": this.docList[i].dmsDocumentId,
          "docTypeId": this.docList[i].docTypeId,
          "documentName": this.docList[i].documentName
        }
        if (this.docList[i].docTypeId == 32) {
          isJoint = 1;
        }
        data4.push(data2);
      }
      if( this.IsMatrialMa == false){
      if (isJoint == 0) {
        alert("Please upload a joint photograph if you are married. If you are not married, please upload a single photograph");
        return;
      }}
      console.log("documentList", data4)
      personalData['documentList'] = data4;
    }

    if(personalData['gender'])
    {
      if(this.genderList)
      {
        personalData['genderName']=this.genderList.filter((x:any)=>x.genId==personalData['gender'])[0]?.genNameEn
      }
    }
   
    if(personalData['maritalStatus'])
    {
      if(this.maritalStatusList)
      {
    personalData['maritalStatusName']=this.maritalStatusList.filter((x:any)=>x.mStatusId==personalData['maritalStatus'])[0]?.mStatusName;}}
    if(personalData['homeState'])
    {
      if(this.stateList)
      {
    personalData['homeStateN']=this.stateList.filter((x:any)=>x.stateId==personalData['homeState'])[0]?.stNameEn}}
    if(personalData['homeDistrict'])
    {
      if(this.districtList)
      {
    personalData['homeDistrictN']=this.districtList.filter((x:any)=>x.distId==personalData['homeDistrict'])[0]?.distNameEn}}
    if(personalData['homeTown'])
    {
      if(this.cityList)
      {
    personalData['homeTownN']=this.cityList.filter((x:any)=>x.cityId==personalData['homeTown'])[0]?.cityNameEn}}
    if(personalData['socialCategory'])
    {
      if(this.casteCategoryList)
      {
    personalData['socialCategoryN']=this.casteCategoryList.filter((x:any)=>x.categoryId==personalData['socialCategory'])[0]?.catNameEn}}
    if(personalData['religion'])
    {
      if(this.religionList)
      {
    personalData['religionN']=this.religionList.filter((x:any)=>x.religionId==personalData['religion'])[0]?.religionNameEn}}
    if(personalData['minorityCategory'])
    {
      if(this.minorityList)
      {
    personalData['minorityCategoryN']=this.minorityList.filter((x:any)=>x.minorCatId==personalData['minorityCategory'])[0]?.MinorCatNameEn}}
    if(personalData['disabilityStatus']=='1')
    {
      if(personalData['typeOfDisability'])
      {
        if(this.disabilityTypeList)
        {
      personalData['typeOfDisabilityN']=this.disabilityTypeList.filter((x:any)=>x.disabilityId==personalData['typeOfDisability'])[0]?.disTypeEn }}
      if(personalData['disabilityCategory'])
      {
        if(this.disabilityCategorylist)
        {
      personalData['disabilityCategoryN']=this.disabilityCategorylist.filter((x:any)=>x.disabilityCatId==personalData['disabilityCategory'])[0]?.disabilityCatName }}
    }
    
    const data = { step: 1, value: personalData, action: this.action, validate: true }
    console.log("data111", personalData)
    this.persoData.emit(personalData);

    this.EmpData.emit(data);


//     this.apiService.postmst('personalDetail/validate', personalData).subscribe({
//       next: res => {
//         if (res.status == 'SUCCESS') {




//         }
//       }, error: err => {
// console.log(err.error.data)
//         this.snackbar.show(JSON.stringify(err.error.data), "danger")
//       }
//     })
  }

}
