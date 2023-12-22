

  import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { DatePipe } from '@angular/common';
import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FamilyDetailsPopupComponent } from 'src/app/family-details-popup/family-details-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatStepper } from '@angular/material/stepper';
import { CommonDialogComponent } from '../../common-dialog/common-dialog.component';
import { AppConfig } from 'src/app/app.config';
import { TokenManagementService } from 'src/app/services/token-management.service';

interface City {
  value: string,
  viewValue: string
}
interface gap {
  date: string;
}
interface count {
  sum: number;
}
interface document {
  file: string;
}
interface document_id {
  id: number;
}
interface progress {
  ind: number;
}
interface document_id_list {
  document_name: string;
  size: string,
  id: number
}
export interface PeriodicElement {
  name: string;
  title: number;
  sex: string;
  symbol: string;
  imagePath: string;
  relation: string;
  main: string;
  alternate: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { title: 1, imagePath: './assets/images/oldman_image.jpg', name: 'Hydrogen', sex: 'Male', relation: 'Husband', main: '50%', alternate: '0%', symbol: './assets/images/icon_download.svg' },
  { title: 2, imagePath: './assets/images/oldman_image.jpg', name: 'Helium', sex: 'Female', relation: 'Daughter', main: '0%', alternate: '0%', symbol: './assets/images/icon_download.svg' },
  { title: 3, imagePath: './assets/images/ashok-national.svg', name: 'Lithium', sex: 'Female', relation: 'Dauthter', main: '0%', alternate: '50%', symbol: './assets/images/icon_download.svg' },
  { title: 4, imagePath: './assets/images/ashok-national.svg', name: 'Beryllium', sex: 'Male', relation: 'Son', main: '50%', alternate: '0%', symbol: './assets/images/icon_download.svg' },
];


@Component({
  selector: 'app-edit-emp-profile',
  templateUrl: './edit-emp-profile.component.html',
  styleUrls: ['./edit-emp-profile.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]

})

export class EditEmpProfileComponent implements OnInit {
  userDetails:any={"role":"",
  "roleid" :"",
 "assignmentid":""};
config:AppConfig=new AppConfig();

  isDisabled: boolean = true;
  is_Disabled: boolean = true;
  //#region  BANK/TREASURY VARIABLES
  Banklist: any = [];
  //#endregion BANK/TREASURY VARIABLES

  serviceRecordForm !: FormGroup;
  //#region LOAN AND ADVANCE
  loanAndAdvancesDetails: any;
  payload_summary: any;
  //#endregion LOAN AND ADVANCE

  //#region CALCULATION VARIABLES
  Calculations_Pay_Details: any;
  Calculations_Pension_Details: any;
  Calculations_Commutation_Details: any;
  Calculations_ARD_Details: any;
  //#endregion CALCULATION VARIABLES

  //#region DOCUMENT UPLOAD VARIABLES
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  files: any[] = [];
  RetirementOrderfiles: any[] = [];
  Govt_files: any[] = [];
  No_DE_files: any[] = [];
  Bank_files: any[] = [];
  No_DuesFile: any[] = [];
  Single_files: any[] = [];
  Single_files1: any[] = [];
  NSDL_files: any[] = [];
  Accommodation_File: any[] = [];
  Joint_files: any[] = [];

  url: any;
  id1: any;
  id: any;
  File_name: any;
  doc_list: any[] = [];
  doc_list1: any[] = [];
  show: boolean = false
  Retirementshow: boolean = true;
  Govt_show: boolean = true;
  No_DE_show: boolean = true;
  Bank_show: boolean = true;
  NODue_show: boolean = true;
  Single_show: boolean = true;
  NSDL_show: boolean = true;
  Joint_show: boolean = true;
  Accommodation_show: boolean = true;
  show_doc: any;
  idList: any;
  //#endregion DOCUMENT UPLOAD VARIABLES

  currentItem = 'Television';
  message: string = "Are you sure?"
  hide = true;

  //#region STEPPER

  conditionForm !: FormGroup;
  commutationDetails!: FormGroup;
  formARD!: FormGroup;
  //#endregion STEPPER

  //#region FILE
  // jointImageUrl: any = "../assets/images/joint1.jpg";
  // imageUrl: any = "../assets/images/photo_man.jpg";

  // Remove "/" before Assets for deployment
  // jointImageUrl: any = "../assets/images/joint1.jpg";
  jointImageUrl: any = "assets/images/jointImg.jfif";
  // imageUrl: any = "../assets/images/photo_man.jpg";
  imageUrl: any = "assets/images/userImg.png";

  signimageUrl: any = "assets/images/signature.png";
  editFile: boolean = true;
  removeUpload: boolean = false;
  @ViewChild('fileInput') el!: ElementRef;
  //#endregion FILE


  Personaldetail: any;
  ServiceDetails: any;
  residenceAddress: any;

  interests: City[] = [];

  Request_Confirmation !: FormGroup;
  formGroup !: FormGroup;
  Summary !: FormGroup;

  status: string = 'Deactive';
  drmaster: boolean = false;

  dateOfBirth: any;
  residenceArray: any[] = [];
  officeArray: any[] = [];
  DepartmentAddress: any[] = [];
  serviceRecordarry: any[] = [];
  serviceRecord_arry: any[] = [];
  serviceRecord_arry_List: any[] = [];
  serviceRecordarry1: any[] = [];
  serviceRecordupdate: any[] = [];
  record: string = '';
  record1: any;

  error: string = '';
  showerror: boolean = false;
  schemeIdForCommutation = 5;
  schemeIdForGratuity = 6;
  schemeIdForArrears = 7;
  empinfo: any;
  makerToken: any;
  reqid: any;
  transId: any;
  taskRoleId: any;
  employeeCode: any;
  employeeId: any;
  action: any;
  adApproveFlag: any;
  tasklist: any;
  Remark_Details: any;
  EDIT: any;
  FORWARD: any;
  REVERT: any;
  serviceRecordData: any;
  rid: any;
  Condition: boolean = true;
  treasury: any;

  datalist: any;
  serviceCatData: any[] = [];
  serviceCatData1: any[] = [];
  addEditServiceRecordslist: any[] = [];
  serviceSubCatData: any[] = [];

  gapArray: gap[] = [];
  isShowNomineeDetails = false;
  gapData: any = [];
  date_Data: count[] = [];
  PersonalDetail_Document: document[] = [];
  document_list: any[] = [];

  RangeChange1: any;
  RangeChange: any;
  reqId: any;
  aid: any;
  confirm: boolean = false;
  isDeStatus: boolean = false;
  isPenalty: boolean = false;

  isMaker = false;
  isCheckerOrApprover = false;
  makerId: any;
  btnlabel: string = 'Proceed';
  is_doc_show: boolean = false;
  //#region CONSTRUCTOR
  constructor(
    private formbuilder: FormBuilder,
    private _Service: PensionServiceService,
    private cd: ChangeDetectorRef,
    private datepipe: DatePipe,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private ActivatedRoute: ActivatedRoute,
    private routers: Router, private http: HttpClient,
    private date: DatePipe,
    private tokenInfo:TokenManagementService
  ) {

  }
  //#endregion CONSTRUCTOR
  date11: any;
  displayedColumns: string[] = ['title', 'imagePath', 'name', 'sex', 'relation', 'main', 'alternate', 'symbol'];
  dataSource = ELEMENT_DATA;

  ngOnInit(): void {
    this.userDetails = this.config.getUserDetails();
    this._Service.stringSubject.subscribe((data:any) =>
    {
      console.log("data.employeeCode",data.employeeCode);

      this.employeeCode=data.employeeCode
      this.employeeId =data.employeeId

    }
  )
    this.progress = 0;
    this.Complete = 0;
    this.reqid = this.ActivatedRoute.snapshot.paramMap.get('reqId');
    this.transId = this.ActivatedRoute.snapshot.paramMap.get('transid');
    this.taskRoleId = this.ActivatedRoute.snapshot.paramMap.get('taskRoleId');
    this.employeeCode = this.ActivatedRoute.snapshot.paramMap.get('employeeCode');
    this.employeeId = this.ActivatedRoute.snapshot.paramMap.get('employeeId');

    this.empinfo = this.tokenInfo.empinfoService;
    this.treasury = this.config.getDetails('treasury_name');
    if (this.empinfo.roleId == 49) {
      this.btnlabel = 'Next';
    } else {
      this.btnlabel = 'Proceed';
    }

    if (this.empinfo.aid === "58233") {
      this.isMaker = true;
      this.isCheckerOrApprover = false;
      this.fetchPersonaldetail();
      this.fetchServicesdetail();
      this.fetchAddressesEmp();
      this.getFamilyDetails();
      this.getNomination();
     // this.getPension_Commutation();
      this.Bank_Detail();
      this.fetchpersonalEmp();
      this.getAllUploadedDocumentDetailsByEmployeeCode();
      this.getLoanAndAdvancesDetails();
      this.get_Service_Records();
    } else {
      this.isCheckerOrApprover = true;
      this.isMaker = false;
      this.getTaskDetail(this.transId);

    }

    this.Request_Confirmation = this.formbuilder.group({
      Remarks: new FormControl(''),
      pepperoni: new FormControl(''),
      extracheese: new FormControl(''),
      mushroom: new FormControl(''),

    });
    this.Summary = this.formbuilder.group({
      is_agree: new FormControl(''),

    });


    this.conditionForm = this.formbuilder.group({
      condition_1: new FormControl(''),
      condition_1_Date: new FormControl(''),
      condition_1_Amount: new FormControl(''),
      condition_2: new FormControl(''),
      condition_3: new FormControl(''),
      condition_4: new FormControl(''),
      condition_5: new FormControl(''),
      condition_6: new FormControl(''),
      condition_7: new FormControl(''),
      condition_8: new FormControl(''),
      condition_9: new FormControl(''),
      condition_9_StartDate: new FormControl(''),
      condition_9_EndDate: new FormControl(''),
      condition_9_FromtDate: new FormControl(''),
      condition_9_TotDate: new FormControl(''),
      condition_10: new FormControl(''),
      condition_10_Amount: new FormControl(''),
      condition_10_Amount2: new FormControl(''),
      condition_11: new FormControl(''),
      condition_12: new FormControl(''),
      condition_12_Amount: new FormControl(''),
    });

    this.commutationDetails = this.formbuilder.group({
      budgetHead: new FormControl(''),
      effectiveDate: new FormControl(''),
      Commutation_Amount: new FormControl(''),
      Commutation_Factor: new FormControl(''),
      Commutation_Value: new FormControl(''),

    });

    this.formARD = this.formbuilder.group({
      additional_Allowance_Amt: new FormControl(''),
      recoveryTypeAmount: new FormControl(''),
      DeductionTypeAmount: new FormControl(''),

      // New FormControls
      recoveryType: new FormControl(''),
      recoveryAmount: new FormControl(''),
      recoveryHead: new FormControl(''),
      deductionType: new FormControl(''),
      deductionAmount: new FormControl(''),
      deductionHead: new FormControl(''),
      allowanceType: new FormControl(''),
      allowanceAmount: new FormControl(''),
      allowanceHead: new FormControl(''),
      withHeldReason: new FormControl(''),
      withHeldAmount: new FormControl(''),

    });
    this.serviceRecordForm = this.formbuilder.group({
      category: new FormControl(''),
      subCategory: new FormControl(''),
      serviceLength: new FormControl(''),
      qualifyingService: new FormControl(''),
      nonQualifyingService: new FormControl(''),
      totalNonQualifyService: new FormControl(''),
      de_Status: new FormControl(''),
      deType: new FormControl(''),
      start_Date: new FormControl(''),
      end_Date: new FormControl(''),
      penalty: new FormControl(''),
      remark: new FormControl(''),
      nonQualifyingServicestart_Date: new FormControl(''),
      nonQualifyingServiceend_Date: new FormControl(''),
      DEstart_Date: new FormControl(''),
      DEend_Date: new FormControl(''),
    });


    if (this.empinfo.aid !== "58233") {
      this.conditionForm.disable();
    }


    this._Service.userActivated.subscribe((data: any) => {
      this.serviceRecord_arry_List = [];
      this.serviceRecord_arry_List.push(data)

      for (let D of this.serviceRecord_arry) {
        for (let p of this.serviceRecord_arry_List) {
          if (p.id == D.id) {


            this.serviceRecord_arry = this.serviceRecord_arry_List;
            this.getPension_Commutation();
            if (this.serviceRecord_arry[0].DE_Status == 1) {
              this.destatus = true;
            } else {
              this.destatus = false;
            }
            // let data1 ={
            //   get(id:any): any {
            //     return p.id
            //   },
            // }
            //          this.serviceRecord_arry.forEach((data) => {
            //           if(data1.get(data.id) && (data.id === data1.get(data.id).id)) {
            //
            //             //data.Qualifying_Service = data1.get(data.id).Qualifying_Service;
            //             this.serviceRecord_arry.push(data);
            //           }
            //         });

          }
        }
      }
    })

    this._Service.userActivated1.subscribe((data: any) => {

      this.serviceRecord_arry.push(data)

    })




  }



  get_Service_Records() {

    let data =
    {
      "employeeId": this.employeeId
    }

    this._Service.postRequestpension(data, 'getOtherServiceDetailsByEmployeeId').subscribe({
      next: (response) => {
        if (response.status = 200) {
          this.serviceRecord = response.data;
          let data = {

        "totalServiceLength": this.serviceRecord.totalServiceDuration,
        "qualifyingService": '',
        "qualifyingServiceOtherOrganisationDate" :'',
        "nonQualifyingService": '',
        "nonQualifyingServiceDate":'',
        "totalQualifyingService":'',
        "deStatus":'',
        "deType":'',
        "deStartDate":'',
        "deEendDate":'',
        "penalty": '',
        "penaltyType": '',
        "remark": '',
        "id": 1,
        "totalNoOfDays":this.serviceRecord.totalNoOfDays,

          }

          this.serviceRecord_arry.push(data);


          //   if(this.serviceRecord_arry.DE_Status==0){
          //  this.destatus=true;
          //   }else{
          //     this.destatus=false;
          //   }


        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }

    });

  }




  //#region STEPPER
  step = 0;
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {

    this.step++;
  }

  prevStep() {

    this.step--;


  }

  // ****************************************************************

  stepFamily = 0;
  setStepFamily(index: number) {
    this.stepFamily = index;
  }
  nextStepFamily() {
    this.stepFamily++;
  }
  prevStepFamily() {
    this.stepFamily--;
  }

  // ****************************************************************

  stepc = 0;
  setStepc(index: number) {
    this.stepc = index;
  }
  nextStepc() {
    this.stepc++;
  }
  prevStepc() {
    this.stepc--;


  }

  //#endregion STEPPER

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  //#region PROFILE

  // ****************************PERSONAL DETAIL****************************************
  uploadFile(event: any) {

    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;

        this.editFile = false;
        this.removeUpload = true;
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }

  // Function to remove uploaded file
  removeUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.imageUrl = 'https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg';
    this.editFile = true;
    this.removeUpload = false;

  }

  fetchPersonaldetail() {
    let data = {
      employeeId: this.employeeId
    }
    this._Service.postRequestpension(data, 'getPersonaldetailsByEmpCode').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.Personaldetail = res.data[0];
          let dd = res.data[0].dateOfBirth
          let datatime = dd.toString().substring(0, dd.length - 5);
          this.dateOfBirth = this.datepipe.transform(datatime, 'dd/MM/yyyy')

        }
      },
      error: (err) => {
        this.error = err;
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
        //   this.showerror=true;
        //  alert(this.error)
      }

    });
  }

  // ****************************SERVICE DETAIL****************************************
  dateValue: any
  fetchServicesdetail() {
    let data = {
      employeeId: this.employeeId
    }
    this._Service.postRequestpension(data, 'getServicedetailsByEmpCode').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.ServiceDetails = res.data;
          // this.ServiceDetails = res.data[0];
          // this.dateValue = res.data[0].dateTypes[0].dateValue;
        }
      },
      error: (err) => {


        this.error = err;
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
        //   this.showerror=true;
        //  alert(this.error)
      }
    });
  }

  // ****************************ADDRESS DETAIL****************************************
  iconCA: any;
  iconPA: any;
  iconOA: any;
  EMPAddress: any;
  EMP_doc: any;
  fetchAddressesEmp() {

    this.residenceArray = [];
    this.officeArray = [];
    this.DepartmentAddress = [];
    let data = {
      employeeId: this.employeeId
    };
    this._Service.postRequestpension(data, 'getAddressDetailsByEmployeeId').subscribe({
      next: (res) => {

        this.EMPAddress = res.data;
        let product: any;
        this.residenceAddress = res.data.employeeAddresses;
        this.officeArray = res.data.officeAddresses;
        this.iconOA = 'apartment'
        for (product of this.residenceAddress) {
          if (product.commType == 'C') {
            this.residenceArray.push(product);
            this.iconCA = 'person_pin_circle'
          }
          else if (product.commType == 'P') {
            this.DepartmentAddress.push(product);
            this.iconPA = 'account_box';
          }
        }
      },
      error: (err) => {


        this.error = err;
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
        //   this.showerror=true;
        //  alert(this.error)
      },
    });
  }

  //#endregion PROFILE





  //#region FAMILY DETAILS AND NOMINATION

  getFamilyDetails() {
    let data = {
      "employeeId": this.employeeId
    }

    this._Service.postRequestpension(data, 'getFamilyDetailsByEmployeeId').subscribe({
      next: (response) => {
        if (response.status = 200) {
          this.familyDetails = response.data;
        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }

    });
  }

  gratuity_Arr: any[] = [];
  commutation_Arr: any[] = [];
  arrear_Arr: any[] = [];

  getNomination() {
    let data = {
      "employeeId": this.employeeId
    }
    this._Service.postRequestpension(data, 'getSchemeNomineeDetails').subscribe({
      next: (response) => {
        if (response.status = 200) {
          this.nominee = response.data;
          let product: any;
          for (product of this.nominee) {

            if (product.schemeName == 'Commutation') {
              this.commutation_Arr.push(product);
              this.iconCA = 'person_pin_circle'

            } else if (product.schemeName == 'Arrears') {
              this.arrear_Arr.push(product);

            } else if (product.schemeName == 'Gratuity') {

              this.gratuity_Arr.push(product);

            }
          }
        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }

    });
  }
  getPension_Commutation() {
  
    let data = {
        "employeeCode": this.employeeCode,
        "withheldAmount":450,
        "deductionAmount":520,
        "recoveryAmount":230,
        "allowanceAmount":450,
        "qualifyingService":this.serviceRecord_arry[0].qualifyingService,
        "nonQualifyingService":this.serviceRecord_arry[0].nonQualifyingServiceDate,
    }

    
    this._Service.postRequestpension(data, 'getPensionDetailsByEmployeeCode').subscribe({
      next: (response) => {
        if (response.status = 200) {
          
          this.Pension_Commutation = response.data;
          this.commutationDetails.patchValue({
            Commutation_Amount: this.Pension_Commutation.commutationAmount,
            Commutation_Factor: this.Pension_Commutation.commutedFactor,
            Commutation_Value: this.Pension_Commutation.pensionCommuted,

          });
        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }

    });


  }
  openDialog(field: any) {
    const updatePopup = this.dialog.open(FamilyDetailsPopupComponent, {
      // maxWidth: '65vw',
      // maxHeight: '90vh',
      // height: '100%',
      // width: '100%',
      height: "auto",
      width: "calc(100% - 40%)",

      panelClass: 'full-screen-modal'
      , autoFocus: false,
      data: {
        parentPage: field
      }
    });


    updatePopup.afterClosed().subscribe(result => {
      console.log(result.data.value.memberName);
      console.log("Data After Stringify : " + JSON.stringify(result.data.value));
      if (result) {
        console.log("User wants Update than,if block redirect(family-nominee.component.ts) : " + JSON.stringify(result.data.value));
        this.familyDetails.nameEn = result.data.value.memberName;
        console.log("Family Details name " + this.familyDetails.nameEn);

        let data = {
          "employeeCode": this.employeeCode,
          "familyMemId": 2,
          "relationshipId": 5,
          "nameEn": this.familyDetails.nameEn
        }


        this._Service.postRequestAddress(data, 'updateFamilyDetails').subscribe({
          next: (response) => {
            if (response.status = 200) {
              this.getFamilyDetails();
            }
          },
          error: (err) => {
            let errorObj = {
              message: err.message,
              err: err,
              response: err
            }
          }

        });

      }

    });


  }


  //#endregion FAMILY DETAILS AND NOMINATION
  serviceRecord: any;
  de: any;
  file: any;
  fileName: any;
  datarecord: any;
  show1: string = 'A';
  destatus: boolean = true;




  onChange(event: any) {

    this.file = event.target.files[0];
    this.fileName = event.target.files[0].name;
    const employeeId = this.employeeId
    const docTypeId = "17"
    this._Service.saveDocument(this.file, employeeId, docTypeId).subscribe(result => {
      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.document_list.push(data);
      alert("File uploaded successfully")
    });
  }

  removeFile() {
    this.file = null;
    this.fileName = '';
  }

  // ********************Martial_Status
  file1: any;
  MartialStatus: any;
  // Martial_Status(file:File) {
  //   const formData = new FormData();
  //     formData.append('file', file.data);

  //     file.inProgress = true;

  //   // this.file1 = file.files[0];
  //   // this.MartialStatus = file.files[0].name;
  //   // this.PersonalDetail_Document.push(this.MartialStatus)
  //   this._Service.saveDocument(formData).subscribe(res=>{

  //   });
  // }
  UploadMartialStatus(event: any) {
    this.MartialStatus = event.target.files[0].name;
    this.file1 = event.target.files[0];
    const employeeId = this.employeeId
    const docTypeId = "23"
    this._Service.saveDocument(this.file1, employeeId, docTypeId).subscribe(result => {

      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.document_list.push(data);
      alert("File uploaded successfully")
    });
  }
  removeMartial_Status() {
    this.file1 = null;
    this.MartialStatus = '';
  }

  // ********************Disabled
  file2: any;
  Disabledfile: any;

  onChangeDisabled(event: any) {

    this.file2 = event.target.files[0];
    this.Disabledfile = event.target.files[0].name;
    const employeeId = this.employeeId
    const docTypeId = "24"

    this._Service.saveDocument(this.file2, employeeId, docTypeId).subscribe(result => {

      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.document_list.push(data);
      console.log(this.document_list);

      alert("File uploaded successfully")
    });

  }

  removeDisabled() {
    this.file2 = null;
    this.Disabledfile = '';
  }
  // ********************Disabled
  file3: any;
  Retirementfile: any;

  onRetirement(event: any) {

    this.file3 = event.target.files[0];
    this.Retirementfile = event.target.files[0].name;
    const employeeId = this.employeeId
    const docTypeId = "15"
    this._Service.saveDocument(this.file3, employeeId, docTypeId).subscribe(result => {
      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.document_list.push(data);
      alert("File uploaded successfully")
    });
  }

  removeRetirement() {
    this.file3 = null;
    this.Retirementfile = '';

  }
  // ********************Disabled
  file4: any;
  Chequefile: any;

  onChangeCheque(event: any) {

    this.file4 = event.target.files[0];
    this.Chequefile = event.target.files[0].name;
    const employeeId = this.employeeId
    const docTypeId = "18"
    this._Service.saveDocument(this.file4, employeeId, docTypeId).subscribe(res => {
      let data =
      {
        "docTypeId": docTypeId,
        "documentId": res.data.dmsDocumentId,
        "docName": res.data.uploadStatusMessage,
      }
      this.document_list.push(data);
      alert("File uploaded successfully")
    });
  }

  removeCheque() {
    this.file3 = null;
    this.Chequefile = '';

  }


  ViewCertificate() {

  }
  familyDetails: any;
  nominee: any;

  Pension_Commutation: any;

  fetchpersonalEmp() {
    let data = {
      "employeeId": this.employeeId
    }
    this._Service.postRequestpension(data, 'getEmployeePayDetails').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.Calculations_Pay_Details = res.data;

        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err,
        };
      },
    });
  }

  open(item: any) {
    this.modalService.open(item);
    // this.get_Task_Detail();
    this.Remark();
  }

  close(i: number) {

  }

  //#region BANK/TREASURY DETAIL
  Bank_Detail() {
    let data = {
      "employeeId": this.employeeId
    }
    this._Service.postRequestpension(data, "getBankdetailsByEmpCode").subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.Banklist = res.data[0];
          // localStorage.setItem('bank-details', JSON.stringify(res.data[0]))
          this.config.storeDetails('bank-details', JSON.stringify(res.data[0]))
        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }

      }
    })
  }
  //#endregion BANK/TREASURY DETAIL

  //#region DOCUMENTS UPLOADED
  documentlist: any
  getAllUploadedDocumentDetailsByEmployeeCode() {
    let data = {
      "subModuleId": 4,
      "processId": 1,
      "employeeId": this.employeeId
    }
    this._Service.postRequestpension(data, 'getDocsDtlsBySubId').subscribe((res) => {
      if (res.status = 200) {

        this.documentlist = res.data
        for (let i = 0; i < res.data.length; i++) {
          if (i % 2 == 0) {

            this.doc_list.push(res.data[i]);
            // this.Single_files.push(res.data[i]);

          }
          else {

            this.doc_list1.push(res.data[i]);
            //this.Single_files1.push(res.data[i]);

          }
        }
      }
      this.File_name = res.data[0].documentName
      let filename = {
        "progress": 0,
        "lastModified": 1672922117392,
        "lastModifiedDate": "Thu Jan 05 2023 18:05:17 GMT+0530 (India Standard Time)",
        "name": res.data[0].documentName,
        "size": 4250,
        "type": "image/jpeg",
        "webkitRelativePath": "",
      }
    })
  }

  /**
    * on file drop handler
    */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  Pdf: string = '';
  fileBrowseHandler(event: any) {
    this.prepareFilesList(event.target.files);

  }



  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {

    for (const item of files) {
      for (let i = 0; i < this.files.length; i++) {

        if (this.files[i].name === item.name) {
          this._snackBar.open('Error occurred :- ', 'File is already Exist', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });

          return;
        }

      }
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);

  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: any, decimals: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  // ********************Strat Retirement Order***********************************

  RetirementOrder1(event: any) {

    this.RetirementOrderList(event.target.files);
  }
  RetirementOrderList(files: Array<any>) {

    for (const item of files) {
      item.progress = 0;
      this.RetirementOrderfiles.push(item);
      this.Retirementshow = false;
    }
    this.RetirementuploadFilesSimulator(0);

  }
  Files_Delete(index: number) {
    this.RetirementOrderfiles.splice(index, 1);
    this.Retirementshow = true;
  }
  RetirementuploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.RetirementOrderfiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.RetirementOrderfiles[index].progress === 100) {
            clearInterval(progressInterval);
          } else {
            this.RetirementOrderfiles[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ************************************

  // ********************Strat Retirement Order***********************************

  GovtBrowseHandler(event: any) {
    this.GovtList(event.target.files);
  }
  GovtList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;


      this.Govt_files.push(item);
      this.Govt_show = false;
    }
    this.GovtuploadFilesSimulator(0);

  }
  Govt_Delete(index: number) {
    this.Govt_files.splice(index, 1);
    this.Govt_show = true;
  }
  GovtuploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.Govt_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.Govt_files[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.Govt_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ************************************

  // ********************Strat Retirement Order***********************************

  No_DE_Certificate(event: any) {
    this.No_DE_CertificateList(event.target.files);
  }
  No_DE_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.No_DE_files.push(item);
      this.No_DE_show = false;
    }
    this.No_DESimulator(0);
  }
  No_DE_Delete(index: number) {
    this.No_DE_files.splice(index, 1);
    this.No_DE_show = true;
  }
  No_DESimulator(index: number) {
    setTimeout(() => {
      if (index === this.No_DE_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.No_DE_files[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.No_DE_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************
  // ********************Strat Retirement Order***********************************

  Bank_Passbook(event: any) {
    this.Bank_CertificateList(event.target.files);
  }
  Bank_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.Bank_files.push(item);
      this.Bank_show = false;
    }
    this.Bank_Simulator(0);
  }
  Bank_PassbookDelete(index: number) {
    this.Bank_files.splice(index, 1);
    this.Bank_show = true;
  }
  Bank_Simulator(index: number) {
    setTimeout(() => {
      if (index === this.Bank_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.Bank_files[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.Bank_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************

  // ********************Strat Retirement Order***********************************

  NoDues_Certificate(event: any) {
    this.NoDues_CertificateList(event.target.files);
  }
  NoDues_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.No_DuesFile.push(item);
      this.NODue_show = false;
    }
    this.NoDues_Simulator(0);
  }
  NoDues_PassbookDelete(index: number) {
    this.No_DuesFile.splice(index, 1);
    this.NODue_show = true;
  }
  NoDues_Simulator(index: number) {
    setTimeout(() => {
      if (index === this.No_DuesFile.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.No_DuesFile[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.No_DuesFile[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************

  // ********************Strat Retirement Order***********************************



  Singleon(event: any, docTypeId: any) {


    this.Single_CertificateList(event.target.files);
    this.id = docTypeId
    this.Single_files1.push(docTypeId);
    for (let p of this.Single_files) {

      if (p.docTypeId === docTypeId) {

        this.id = 15
      }
    }


    //this.addProductlist(event.target.files);
  }

  // addProductlist(product:any) {
  //   let added = false;
  //
  //   for (let p of this.doc_list) {
  //     if (p.docTypeId === product.docTypeId) {
  //       p.qty += 1;
  //       added = true;
  //       break;
  //     }
  //   }
  //   if (!added) {
  //     product.qty = 1;
  //     this.cart.push(product);
  //   }
  //
  // // this.cartItemCount.value + 1
  //  this.cartItemCount.next(this.cartItemCount.value + 1);


  // }


  Single_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;

      this.Single_files.push(item);
    }
    this.Single_Simulator(0);
  }
  Single_Delete(index: number) {
    this.Single_files.splice(index, 1);
  }



  Single_Simulator(index: number) {
    setTimeout(() => {
      if (index === this.Single_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.Single_files[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.Single_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }







  // ********************END Retirement Order ***********************************

  // ********************Strat Retirement Order***********************************

  Singleon1(event: any, id: any) {

    this.id1 = id
    this.idList = id + 2;
    this.Single_CertificateList1(event.target.files);
    // for (let i = 0; i < this.doc_list.length; i++) {
    //
    //   if (this.doc_list[i].documentName === id) {
    //     this.show_doc = 1
    //   }
    //   else{
    //     this.show_doc = 0
    //   }

    // }
  }
  Single_CertificateList1(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.Single_files1.push(item);
      this.Single_show = false;
    }
    // this.Single_Simulator1(0);
  }
  Single_Delete1(index: number) {

    this.Single_files1.splice(index, 1);
    this.Single_show = true;
    this.id1 = ''
  }
  Single_Simulator1(index: number) {
    setTimeout(() => {
      if (index === this.Single_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.Single_files[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.Single_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************
  // ********************Strat Retirement Order***********************************



  Government_files: any[] = [];
  Government_show: boolean = true;
  Gfile: any;
  Government_On(event: any) {
    this.Government_CertificateList(event.target.files);

    this.Gfile = event.target.files[0];
    const employeeId = this.employeeId
    const docTypeId = "16"

    this._Service.saveDocument(this.Gfile, employeeId, docTypeId).subscribe(result => {

      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.document_list.push(data);
      // console.log(this.document_list);
      // alert("File uploaded successfully");

      // localStorage.setItem("doc_Id", result.data.dmsDocumentId)
      this.config.storeDetails("doc_Id", result.data.dmsDocumentId)
    });
    this.updateProgress1();
  }
  Government_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.Government_files.push(item);
      this.Government_show = false;
    }
    // this.NSDL_Simulator(0);
  }
  Government_Delete(index: number) {
    this.Government_files.splice(index, 1);
    this.Government_show = true;
  }




  // ********************Strat Retirement Order***********************************


  CPF_files: any[] = [];
  CPF_show: boolean = true;
  fileCPF: any;
  CPF_On(event: any) {
    this.CPF_CertificateList(event.target.files);
    this.fileCPF = event.target.files[0];
    const employeeId = this.employeeId
    const docTypeId = "22"

    this._Service.saveDocument(this.fileCPF, employeeId, docTypeId).subscribe(result => {

      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.document_list.push(data);
      // console.log(this.document_list);
      // alert("File uploaded successfully");
      this.updateProgress2();
    });
  }
  CPF_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.CPF_files.push(item);
      this.CPF_show = false;
    }
    // this.NSDL_Simulator(0);
  }
  CPF_Delete(index: number) {
    this.CPF_files.splice(index, 1);
    this.CPF_show = true;
  }




  Dues_files: any[] = [];
  Dues_show: boolean = true;
  fileDues: any;
  Dues_On(event: any) {
    this.Dues_CertificateList(event.target.files);
    this.fileDues = event.target.files[0];
    const employeeId = this.employeeId
    const docTypeId = "19"

    this._Service.saveDocument(this.fileDues, employeeId, docTypeId).subscribe(result => {

      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.document_list.push(data);
      // console.log(this.document_list);
      // alert("File uploaded successfully");
    });
    this.updateProgress3();
  }
  Dues_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.Dues_files.push(item);
      this.Dues_show = false;
    }
    // this.NSDL_Simulator(0);
  }
  Dues_Delete(index: number) {
    this.Dues_files.splice(index, 1);
    this.Dues_show = true;
  }



  fileSig: any;
  Signature_files: any[] = [];
  Signature_show: boolean = true;
  Signature_On(event: any) {
    this.Signature_CertificateList(event.target.files);
    this.fileSig = event.target.files[0];
    const employeeId = this.employeeId
    const docTypeId = "20"

    this._Service.saveDocument(this.fileSig, employeeId, docTypeId).subscribe(result => {

      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.document_list.push(data);
      // console.log(this.document_list);
      // alert("File uploaded successfully");
    });

    this.updateProgress4();
  }
  Signature_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.Signature_files.push(item);
      this.Signature_show = false;
    }
    // this.NSDL_Simulator(0);
  }
  Signature_Delete(index: number) {
    this.Signature_files.splice(index, 1);
    this.Signature_show = true;
  }


  fileNSDL: any;
  NSDL1_files: any[] = [];
  NSDL1_show: boolean = true;
  NSDL1_On(event: any) {
    this.NSDL1_CertificateList(event.target.files);
    this.fileNSDL = event.target.files[0];
    const employeeId = this.employeeId
    const docTypeId = "21"

    this._Service.saveDocument(this.fileNSDL, employeeId, docTypeId).subscribe(result => {

      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.document_list.push(data);
      // console.log(this.document_list);
      // alert("File uploaded successfully");
    });
    this.updateProgress();
  }
  NSDL1_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.NSDL1_files.push(item);
      this.NSDL1_show = false;
    }
    // this.NSDL_Simulator(0);
  }
  NSDL1_Delete(index: number) {
    this.NSDL1_files.splice(index, 1);
    this.NSDL1_show = true;
  }








  NSDL_On(event: any) {
    this.NSDL_CertificateList(event.target.files);
  }
  NSDL_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.NSDL_files.push(item);
      this.NSDL_show = false;
    }
    // this.NSDL_Simulator(0);
  }
  NSDL_Delete(index: number) {
    this.NSDL_files.splice(index, 1);
    this.NSDL_show = true;
  }

  NSDL_Simulator(index: number) {
    setTimeout(() => {
      if (index === this.NSDL_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.NSDL_files[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.NSDL_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************

  // ********************Strat Retirement Order***********************************

  Joint_On(event: any) {
    this.Joint_CertificateList(event.target.files);
  }
  Joint_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.Joint_files.push(item);
      this.Joint_show = false;
    }
    this.Joint_Simulator(0);
  }
  Joint_Delete(index: number) {
    this.Joint_files.splice(index, 1);
    this.Joint_show = true;
  }
  Joint_Simulator(index: number) {
    setTimeout(() => {
      if (index === this.Joint_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.Joint_files[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.Joint_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************
  // ********************Strat Retirement Order***********************************

  Accommodation_On(event: any) {
    this.AccommodationList(event.target.files);
  }
  AccommodationList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.Accommodation_File.push(item);
      this.Accommodation_show = false;
    }
    this.Accommodation_Simulator(0);
  }
  Accommodation_delete(index: number) {
    this.Accommodation_File.splice(index, 1);
    this.Accommodation_show = true;
  }
  Accommodation_Simulator(index: number) {
    setTimeout(() => {
      if (index === this.Accommodation_File.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.Accommodation_File[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.Accommodation_File[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************


  //#endregion DOCUMENTS UPLOADED

  //#region LOAN AND ADVANCE
  getLoanAndAdvancesDetails() {
    let data = {
      "employeeId": parseInt(this.employeeId)
    }
    this._Service.postRequestpension(data, 'getLoanDetailsByEmployeeId').subscribe({
      next: (response) => {
        if (response.status = 200) {
          this.loanAndAdvancesDetails = response.data;
          // let dd = response.data[0].loanDate
          // let datatime = dd.toString().substring(0,dd.length-5);
          // this.dateOfBirth=this.datepipe.transform(datatime  , 'dd/MM/yyyy')

          // localStorage.setItem('Loans-Advance', JSON.stringify(response.data[0]))
          this.config.storeDetails('Loans-Advance', JSON.stringify(response.data[0]))
        }
      },
      error: (err) => {


        this.error = err;
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
        //   this.showerror=true;
        //  alert(this.error)
      }

    });
  }

  // file preview function
  onPreviewFile() {

  }

  loanAdvance(field: any, title: any, btnText: any) {
    this.dialog.open(CommonDialogComponent,
      {
        panelClass: 'dialog-w-50', autoFocus: false
        ,
        height: "auto",
        width: "calc(100% - 50%)",
        data: {
          message: title,
          field: field,
          id: 7,
          btnText: btnText
        }
      }
    );
  }
  //#endregion LOAN AND ADVANCE

  get_Task_Detail() {

    let data = {
      "taskId": this.transId
    }
    this._Service.requestApplication(data, "task").subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.tasklist = res.data

          this.FORWARD = res.data.actionData[0].actionLabel;
          this.REVERT = res.data.actionData[1].actionLabel;
        }
      },
      error: (err) => {
        console.log(err);
        this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      }
    })
  }


  Remark() {

    if (this.empinfo.aid == 58233) {
      this.taskRoleId = 1
    }
    let data = {
      "roleId": this.taskRoleId
    }
    this._Service.requestApplication(data, 'getRemarksSuggestion').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.Remark_Details = res.data;

        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err,
        };
      },
    });
  }

  selectRemark(remark_id: any) {
    this.Request_Confirmation.patchValue({
      Remarks: remark_id.remarks
    })

  }
  Qualifying_Service = ''
  Non_Qualifying_Service = ''
  Type_DE = ''
  De_Start_Date = ''
  De_Completion_Date = ''


  addServiceRecord(field: any, title: any) {

    this.dialog.open(CommonDialogComponent,
      {
        panelClass: 'dialog-w-50', autoFocus: false
        ,
        height: "auto",
        width: "calc(100% - 50%)",

        data: {

          message: title,
          field: field,
          id: 6,
          // joiningDate:this.ServiceDetails.DOJ
        }
      }
    );




  }






  documentList: any;
  document: any;
  get_Detail_Document(name: any, id: any) {

    if (id == 1) {
      this.document = parseInt(this.config.getDetails("doc_Id")!);
    }
    else {

      for (let p of this.EMP_doc) {
        if (p.docTypeId == id) {
          this.document = p.documentId
          console.log(p.documentId);
        }
      }
    }
    let data = {
      "documentId": this.document
    }

    this._Service.postRequestpension(data, "getDocumentByDocumentId").subscribe({
      next: (res) => {
        if (res.status = 200) {
          // let file = new Blob([res.data.documentContent], { type: 'application/pdf' });
          // var fileURL = URL.createObjectURL(file);
          // window.open(fileURL);

          this.documentList = res.data.documentContent;

          this.downloadPdf(this.documentList, name);
          console.log(this.documentList)
        }
      },
      error: (err) => {
        console.log(err);
        this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      }
    })
  }


  downloadPdf(base64String: any, fileName: any) {

    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.pdf`
    link.click();
    window.URL.revokeObjectURL(link.href);
    window.open(link.href, '_blank');
  }


  visible: any;
  years: any;
  months: any;
  days: any;
  years1: any;
  months1: any;
  days1: any;
  visibleId: any = 0;
  visibleId1: boolean = false;
  visibleId2: boolean = false;
  visibleId3: boolean = false;

  dateGap: any;
  dateOne: any;
  dateTwo: any;
  diffDays: any;
  totalDay: number = 0;

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    this.is_Disabled = false;
    this.diffDays = []

    this.dateOne = new Date(dateRangeStart.value);
    this.dateTwo = new Date(dateRangeEnd.value);


    let timeDiff = Math.abs(this.dateOne.getTime() - this.dateTwo.getTime());


    this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    this.date_Data.push({
      sum: this.diffDays
    });
    var total = 0
    for (var i = 0; i < this.date_Data.length; i++) {
      total += this.date_Data[i].sum;
    }

    this.totalDay = total;
    var years = Math.floor(this.totalDay / 365);
    var months = Math.floor(this.totalDay % 365 / 30);
    var days = Math.floor(this.totalDay % 365 % 30);
    this.years = years;
    this.months = months;
    this.days = days;

    this.serviceRecordForm.patchValue({
      totalNonQualifyService: (this.years) + ' years ' + (this.months) + ' months ' + (this.days) + ' days '
    });

    setTimeout(() => {                           // <<<---using ()=> syntax
      this.serviceRecordForm.controls['nonQualifyingServicestart_Date'].reset();
      this.serviceRecordForm.controls['nonQualifyingServiceend_Date'].reset();
    }, 100);
    if (this.date_Data.length > 1) {
      this.addAnothergap();

    }

  }

  addAnothergap() {

    this.serviceRecordForm.controls['nonQualifyingServicestart_Date'].reset();
    this.serviceRecordForm.controls['nonQualifyingServiceend_Date'].reset();

    this.dateGap = this.date.transform(this.dateOne, 'MM/dd/yyyy') + ' - ' + this.date.transform(this.dateTwo, 'MM/dd/yyyy');
    let added = false;
    for (let t of this.gapArray)
      if (t.date === this.dateGap) {
        added = true;
        alert("already")
        break;
      }
    if (!added) {
      this.gapArray.push({
        date: this.dateGap
      });

      this.isShowNomineeDetails = true;
    }

  }

  date1: string = '';
  date2: string = '';
  dd: any;
  dddd: any;
  remove_File(index: any, obj: any) {
    this.gapArray.splice(index, 1);

    var splitted = obj.date.toString().split(" - ");
    this.date1 = splitted[0];
    this.date2 = splitted[1];


    for (let t of this.gapArray)
      if (t.date !== obj.date) {
        this.dateOne = new Date(this.date1);
        this.dateTwo = new Date(this.date2);
        let timeDiff = Math.abs(this.dateOne.getTime() - this.dateTwo.getTime());

        this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        this.date_Data.push({
          sum: (-this.diffDays)
        });
        var total = 0
        for (var i = 0; i < this.date_Data.length; i++) {
          total += this.date_Data[i].sum;
        }

        this.totalDay = total;
        var years = Math.floor(this.totalDay / 365);
        var months = Math.floor(this.totalDay % 365 / 30);
        var days = Math.floor(this.totalDay % 365 % 30);
        this.years = years;
        this.months = months;
        this.days = days;

        this.serviceRecordForm.patchValue({
          totalNonQualifyService: (this.years) + ' years ' + (this.months) + ' months ' + (this.days) + ' days '
        });
      }

    if (this.gapArray.length == 0) {
      this.serviceRecordForm.patchValue({
        totalNonQualifyService: ''
      });
      this.isShowNomineeDetails = false;
      this.date_Data.splice(index);


    }
  }









  addEditServiceRecords() {



    alert("Service Record Add Successfully")

  }
  // if(this.message=="Add Service Records"){

  // }
  // {else{
  // let data = {
  //   "category": this.serviceRecordForm.value.category,
  //   "subCategory": this.serviceRecordForm.value.subCategory,
  //   "serviceLength": this.serviceRecordForm.value.serviceLength,
  //   "qualifyingService": this.serviceRecordForm.value.qualifyingService,
  //   "totalNonQualifyService": this.serviceRecordForm.value.totalNonQualifyService,
  //   "de_Status": this.serviceRecordForm.value.de_Status,
  //   "deType": this.serviceRecordForm.value.deType,
  //   "penalty": this.serviceRecordForm.value.penalty,
  //   "remark": this.serviceRecordForm.value.remark,
  //   "DEstart_Date": this.serviceRecordForm.value.DEstart_Date,
  //   "DEend_Date": this.serviceRecordForm.value.DEend_Date,
  //   "message": this.message,
  // }

  // localStorage.setItem('UpdateServiceRecordslist', JSON.stringify(data));
  //alert("Service Record Update Successfully")
  //}
  //}

  getServiceSubCategory(event: any) {
    this.serviceSubCatData = [];
    let data = {
      serviceCategoryId: event
    }
    this._Service.postRequestAddress(data, "getAllSubServiceCategoryByServiceCategoryId").subscribe({
      next: (res) => {
        if (res.status = 200) {
          if (res.data === "No Data Found!") {
          } else {
            this.serviceSubCatData = res.data;
          }
        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }
    })
  }


  showHideFields(val: any) {
    if (val === 1) {
      this.isDeStatus = true;
    } else {
      this.isDeStatus = false;
    }
  }
  showHideRemark(val: any) {
    if (val === 1) {
      this.isPenalty = true;
    } else {
      this.isPenalty = false;
    }
  }

  ppo_number: any;
  onSubmit_Final_Maker(action: any) {
    
    let commutation_data = {
      "budgetHead": this.commutationDetails.value.budgetHead,
      "effectiveDate": this.commutationDetails.value.effectiveDate,
      "commutationAmount": this.commutationDetails.value.Commutation_Amount,
      "commutationFactor": this.commutationDetails.value.Commutation_Factor,
      "commutationValue": this.commutationDetails.value.Commutation_Value,

    }

    let Deductions_Details = {

      "additionalAmount": this.formARD.value.additional_Allowance_Amt,
      "recoveryAmount": this.formARD.value.recoveryTypeAmount,
      "deductionAmount": this.formARD.value.DeductionTypeAmount,
    }
    // let document_Details = {
    //   "docTypeId":this.document_list[0].docTypeId,
    //   "dmsDocumentId":this.document_list[0].doc.data.dmsDocumentId,
    //   "uploadStatusMessage":this.document_list[0].doc.data.uploadStatusMessage,
    // }
    this.document_list

    let condition_data = {

      "condition_1": this.conditionForm.value.condition_1,
      "condition_1_Date": this.conditionForm.value.condition_1_Date,
      "condition_1_Amount": this.conditionForm.value.condition_1_Amount,
      "condition_2": this.conditionForm.value.condition_2,
      "condition_3": this.conditionForm.value.condition_3,
      "condition_4": this.conditionForm.value.condition_4,
      "condition_5": this.conditionForm.value.condition_5,
      "condition_6": this.conditionForm.value.condition_6,
      "condition_7": this.conditionForm.value.condition_7,
      "condition_8": this.conditionForm.value.condition_8,
      "condition_9": this.conditionForm.value.condition_9,
      "condition_9_StartDate": this.conditionForm.value.condition_9_StartDate,
      "condition_9_EndDate": this.conditionForm.value.condition_9_EndDate,
      "condition_9_FromtDate": this.conditionForm.value.condition_9_FromtDate,
      "condition_9_TotDate": this.conditionForm.value.condition_9_TotDate,
      "condition_10": this.conditionForm.value.condition_10,
      "condition_10_Amount": this.conditionForm.value.condition_10_Amount,
      "condition_10_Amount2": this.conditionForm.value.condition_10_Amount2,
      "condition_11": this.conditionForm.value.condition_11,
      "condition_12": this.conditionForm.value.condition_12,
      "condition_12_Amount": this.conditionForm.value.condition_12_Amount,
    }
    let payload_summary = {
      "emp_Id": this.Personaldetail.nameEn,
      "empName": this.Personaldetail.employeeId

    }



    let data = {
      "request_data": {
        "processId": "1",
        "taskSeq": "",
        "processTaskSeq": "",
        "taskTranId": this.transId,
        "requestId": this.reqid,
        "requestDesc": "",
        "initiator": this.empinfo.aid,
        "person_id": this.empinfo.userId,
        "person_name": this.empinfo.displayName,
        "action": action,
        "remarks": this.Request_Confirmation.controls['Remarks'].value,
        "payloadChangeFlag": "Y",
        "adApproveFlag": ""
      },
      "payload": {

        "personalDetails": this.Personaldetail,
        "serviceDetails": this.ServiceDetails,
        "addressDetails": this.EMPAddress,
        "familyDetails": this.familyDetails,
        "nominationDetails": this.nominee,
        "serviceRecords": this.serviceRecord_arry,
        "loansAdvance": this.loanAndAdvancesDetails,
        "calculationsPayDetails": this.Calculations_Pay_Details,
        "calculationsAdditionalAllowanceRecovery": Deductions_Details,
        "calculationsPensionDetails": this.Pension_Commutation,
        "calculationsCommutationDetailsNomination": commutation_data,
        "bankTreasuryDetails": this.Banklist,
        "documents": this.documentlist,
        "conditionList": condition_data,
        "documentDetails": this.document_list,
        "payloadSummary": payload_summary,
        "employeeId":this.Personaldetail.employeeId,
        "employeeCode":this.Personaldetail.employeeCode,
        "createdByAid":this.empinfo.aid,
        "createdByUserId":this.empinfo.userId,
        "payeeId":this.Personaldetail.payeeId,




      }
    }

    this._Service.requestApplication(data, 'action').subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.rid = res.request_id
          this.modalService.dismissAll();
          this.dialog.open(CommonDialogComponent,
            {
              panelClass: 'dialog-w-50', autoFocus: false
              , data: {
                message: 'success', reqId: this.rid, id: 4, aid: this.empinfo.aid
              }
            }
          );
        }
      },
      error: (err) => {


        // this.error = err;
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
        //   this.showerror=true;
        //  alert(this.error)
      },
    });
  }


  document_id: document_id[] = [];
  document_id_list: document_id_list[] = [];

  getTaskDetail(taskId: any) {

    let data = {
      "taskId": taskId
    }
    this._Service.requestApplication(data, "task").subscribe({
      next: (res) => {
        if (res.status = 200) {

          this.tasklist = res.data.actionData

          this.FORWARD = res.data.actionData[0].actionLabel;
          this.REVERT = res.data.actionData[1].actionLabel;

          this.familyDetails = res.data.payload.Family_Details;
          this.Personaldetail = res.data.payload.Personal_detail;
          this.ServiceDetails = res.data.payload.Service_Details;
          this.nominee = res.data.payload.Nomination_Details;
          this.Pension_Commutation = res.data.payload.Calculations_Pension_Details;
          this.Banklist = res.data.payload.Bank_Treasury_Details;
          this.Calculations_Pay_Details = res.data.payload.Calculations_Pay_Details;
          this.Calculations_ARD_Details = res.data.payload.Calculations_Additional_Allowance_Recovery;
          this.Calculations_Commutation_Details = res.data.payload.Calculations_Commutation_Details_Nomination;
          this.loanAndAdvancesDetails = res.data.payload.Loans_Advance;
          this.document_list = res.data.payload.document_list
          this.payload_summary = res.data.payload.payload_summary
          this.serviceRecord_arry = res.data.payload.Service_Records;
          //this.serviceRecordarry.push(this.serviceRecord);

          this.documentlist = res.data.payload.Documents;
          this.nominee = res.data.payload.Nomination_Details;
          let product1: any;
          for (product1 of this.nominee) {

            if (product1.schemeName == 'Commutation') {
              this.commutation_Arr.push(product1);
              this.iconCA = 'person_pin_circle'

            } else if (product1.schemeName == 'Arrears') {
              this.arrear_Arr.push(product1);

            } else if (product1.schemeName == 'Gratuity') {

              this.gratuity_Arr.push(product1);

            }
          }

          for (let i = 0; i < res.data.payload.Documents.length; i++) {
            if (i % 2 == 0) {
              this.doc_list.push(res.data.payload.Documents[i]);
            }
            else {
              this.doc_list1.push(res.data.payload.Documents[i]);
            }
          }
          this.conditionForm.setValue(res.data.payload.condition_List);


          this.EMP_doc = res.data.payload.document_Details;

          this.EMPAddress = res.data.payload.Address_Details
          this.residenceAddress = res.data.payload.Address_Details.employeeAddresses;
          this.officeArray = res.data.payload.Address_Details.officeAddresses;
          this.iconOA = 'apartment'
          let product: any;
          for (product of this.residenceAddress) {
            if (product.commType == 'C') {
              ;
              this.residenceArray.push(product);
              // console.log("this.residenceArray",this.residenceArray);

              this.iconCA = 'person_pin_circle'
            }
            // else  if (product.commType == 'O'){
            //   ;
            //   this.officeArray.push(product);
            //   this.iconOA='apartment'
            // }
            else if (product.commType == 'P') {

              this.DepartmentAddress.push(product);
              this.iconPA = 'account_box';
            }
          }



          for (let D of this.documentlist) {
            for (let p of this.EMP_doc) {
              if (p.docTypeId == D.docTypeId) {
                this.document_id.push(
                  { id: p.docTypeId })

                this.document_id_list.push(
                  {
                    document_name: D.docName,
                    size: '215',
                    id: D.docTypeId
                  })
                console.log(this.document_id_list);

              }
            }
          }
        }
      },
      error: (err) => {
        console.log(err);
        this.error = err
      }
    })
  }





  onSubmit_Final(action: any) {

    let commutation_data = {
      "budgetHead": this.Calculations_Commutation_Details.budgetHead,
      "effectiveDate": this.Calculations_Commutation_Details.effectiveDate,
      "Commutation_Amount": this.Pension_Commutation.commutationAmount,
      "Commutation_Factor": this.Pension_Commutation.commutedFactor,
      "Commutation_Value": this.Pension_Commutation.pensionCommuted,

    }

    let Deductions_Details = {

      "Additional_Amount": this.Calculations_ARD_Details.Additional_Amount,
      "Recovery_Amount": this.Calculations_ARD_Details.Recovery_Amount,
      "Deduction_Amount": this.Calculations_ARD_Details.Deduction_Amount,
    }

    let condition_data = {

      "condition_1": this.conditionForm.value.condition_1,
      "condition_1_Date": this.conditionForm.value.condition_1_Date,
      "condition_1_Amount": this.conditionForm.value.condition_1_Amount,
      "condition_2": this.conditionForm.value.condition_2,
      "condition_3": this.conditionForm.value.condition_3,
      "condition_4": this.conditionForm.value.condition_4,
      "condition_5": this.conditionForm.value.condition_5,
      "condition_6": this.conditionForm.value.condition_6,
      "condition_7": this.conditionForm.value.condition_7,
      "condition_8": this.conditionForm.value.condition_8,
      "condition_9": this.conditionForm.value.condition_9,
      "condition_9_StartDate": this.conditionForm.value.condition_9_StartDate,
      "condition_9_EndDate": this.conditionForm.value.condition_9_EndDate,
      "condition_9_FromtDate": this.conditionForm.value.condition_9_FromtDate,
      "condition_9_TotDate": this.conditionForm.value.condition_9_TotDate,
      "condition_10": this.conditionForm.value.condition_10,
      "condition_10_Amount": this.conditionForm.value.condition_10_Amount,
      "condition_10_Amount2": this.conditionForm.value.condition_10_Amount2,
      "condition_11": this.conditionForm.value.condition_11,
      "condition_12": this.conditionForm.value.condition_12,
      "condition_12_Amount": this.conditionForm.value.condition_12_Amount,
    }




    let data = {
      "request_data": {
        "processId": "1",
        "taskSeq": "",
        "processTaskSeq": "",
        "taskTranId": this.transId,
        "requestId": this.reqid,
        "requestDesc": "",
        "initiator": this.empinfo.aid,
        "person_id": this.empinfo.userId,
        "person_name": this.empinfo.displayName,
        "action": action,
        "remarks": this.Request_Confirmation.controls['Remarks'].value,
        "payloadChangeFlag": "Y",
        "adApproveFlag": ""
      },
      "payload": {

        "Personal_detail": this.Personaldetail,
        "Service_Details": this.ServiceDetails,
        "Address_Details": this.EMPAddress,
        "Family_Details": this.familyDetails,
        "Nomination_Details": this.nominee,
        "Service_Records": this.serviceRecord_arry,
        "Loans_Advance": this.loanAndAdvancesDetails,
        "Calculations_Pay_Details": this.Calculations_Pay_Details,
        "Calculations_Additional_Allowance_Recovery": Deductions_Details,
        "Calculations_Pension_Details": this.Pension_Commutation,
        "Calculations_Commutation_Details_Nomination": commutation_data,
        "Bank_Treasury_Details": this.Banklist,
        "Documents": this.documentlist,
        "condition_List": this.conditionForm.value,//condition_data,
        "document_Details": this.EMP_doc,
        "payload_summary": this.payload_summary,

      }
    }

    this._Service.requestApplication(data, 'action').subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.rid = res.request_id

          if (res.wfComplete == 1) {
            this.ppo_number = res.psn_details.ppo_no
          } else {
            this.ppo_number = 1
          }
          this.modalService.dismissAll();
          this.dialog.open(CommonDialogComponent,
            {
              panelClass: 'dialog-w-50', autoFocus: false
              , data: {
                message: 'success', reqId: this.rid, id: 4, aid: this.empinfo.aid, ppo_no: this.ppo_number
              }
            }
          );
        }
      },
      error: (err) => {


        this.error = err;
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
        //   this.showerror=true;
        //  alert(this.error)
      },
    });
  }

  // steprid=1;
  //   selectionChange(id:any) {
  //    this.steprid=2;
  //    if(id==1){
  //   this._Service.bankActivated.next(1)
  //    }
  //    if(id==2){
  //   this._Service.bankActivated1.next(2)
  //    }

  //   }

  progress: number = 0;
  noOfFiles: number = 35;
  completed: boolean = false;
  uploadProgress = 0;

  delay(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
  async updateProgress() {
    this.completed = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay(35);
      this.progress = Math.round(i * n);
      console.log(i);
    }
    this.completed = true;
  }


  progress1: number = 0;
  noOfFiles1: number = 35;
  completed1: boolean = false;


  delay1(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
  async updateProgress1() {
    this.completed1 = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay1(35);
      this.progress1 = Math.round(i * n);
      console.log(i);
    }
    this.completed1 = true;
  }

  progress2: number = 0;
  noOfFiles2: number = 35;
  completed2: boolean = false;


  delay2(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
  async updateProgress2() {
    this.completed2 = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay2(35);
      this.progress2 = Math.round(i * n);
      console.log(i);
    }
    this.completed2 = true;
  }


  progress3: number = 0;
  noOfFiles3: number = 35;
  completed3: boolean = false;


  delay3(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
  async updateProgress3() {
    this.completed3 = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay3(35);
      this.progress3 = Math.round(i * n);
      console.log(i);
    }
    this.completed3 = true;
  }


  progress4: number = 0;
  noOfFiles4: number = 35;
  completed4: boolean = false;


  delay4(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
  async updateProgress4() {
    this.completed4 = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay4(35);
      this.progress4 = Math.round(i * n);
      console.log(i);
    }
    this.completed4 = true;
  }




  onSubmit_Final_ESS(action: any) {

    let commutation_data = {
      "budgetHead": this.Calculations_Commutation_Details.budgetHead,
      "effectiveDate": this.Calculations_Commutation_Details.effectiveDate,
      "Commutation_Amount": this.Pension_Commutation.commutationAmount,
      "Commutation_Factor": this.Pension_Commutation.commutedFactor,
      "Commutation_Value": this.Pension_Commutation.pensionCommuted,

    }

    let Deductions_Details = {

      "Additional_Amount": this.Calculations_ARD_Details.Additional_Amount,
      "Recovery_Amount": this.Calculations_ARD_Details.Recovery_Amount,
      "Deduction_Amount": this.Calculations_ARD_Details.Deduction_Amount,
    }



    let data = {
      "request_data": {
        "processId": "1",
        "taskSeq": "",
        "processTaskSeq": "",
        "taskTranId": this.transId,
        "requestId": this.reqid,
        "requestDesc": "",
        "initiator": this.empinfo.aid,
        "person_id": this.empinfo.userId,
        "person_name": this.empinfo.displayName,
        "action": action,
        "remarks": this.Request_Confirmation.controls['Remarks'].value,
        "payloadChangeFlag": "Y",
        "adApproveFlag": ""
      },
      "payload": {

        "personalDetails": this.Personaldetail,
        "serviceDetails": this.ServiceDetails,
        "Address_Details": this.EMPAddress,

        "Family_Details": this.familyDetails,
        "Nomination_Details": this.nominee,

        "Service_Records": this.serviceRecord_arry,

        "Loans_Advance": this.loanAndAdvancesDetails,

        "Calculations_Pay_Details": this.Calculations_Pay_Details,
        "Calculations_Additional_Allowance_Recovery": Deductions_Details,
        "Calculations_Pension_Details": this.Pension_Commutation,
        "Calculations_Commutation_Details_Nomination": commutation_data,
        "Bank_Treasury_Details": this.Banklist,
        //  "Documents":this.documentlist,
        //  "condition_List":condition_data,
        //  "document_Details":this.EMP_doc,
        "payload_summary": this.payload_summary,
        "summary": this.Summary.value.is_agree,

      }
    }

    this._Service.requestApplication(data, 'action').subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.rid = res.request_id

          this.modalService.dismissAll();
          this.dialog.open(CommonDialogComponent,
            {
              panelClass: 'dialog-w-50', autoFocus: false
              , data: {
                message: 'success', reqId: this.rid, id: 14, aid: this.empinfo.aid, ppo_no: 0
              }
            }
          );
        }
      },
      error: (err) => {


        this.error = err;
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
        //   this.showerror=true;
        //  alert(this.error)
      },
    });
  }



  Complete: any;
  Comp: any;
  progressFiles: progress[] = [];
  fil: any;
  onStepChange(stepper: MatStepper) {
    
    this.fil = stepper.selectedIndex
    this.progressFiles.push({
      ind: this.fil
    })

    this.Comp = 12.50;
    
    for (let p of this.progressFiles) {
      if (p.ind == this.fil) {
        this.progress1 = this.progress1 + this.Comp;
        this.Complete = (this.Complete + 13);
        if (this.Complete > 100) {
          this.Complete = 100
          this.progress1 = 100
        }
      }
    }
    
    if (this.fil == 7) {
      stepper.next();
    }
  }
  moveToSelectedTab(tabName: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
  }

}
