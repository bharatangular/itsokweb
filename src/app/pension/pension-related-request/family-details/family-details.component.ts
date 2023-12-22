import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import * as moment from 'moment';

import { Subject } from 'rxjs';
import { ApiEssService } from 'src/app/services/api-ess.service';

import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.component.html',
  styleUrls: ['./family-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FamilyDetailsComponent implements OnInit {
  @Input() EmpFamily: any;
  @Input() JanUserList: any;
  @Input() config: any = {};
  @Output() EmpData = new EventEmitter();
  @Output() JanaadhaarUser = new EventEmitter();
  @Input() userAction: Array<any> = [];
  @Input() personal: Subject<boolean>;

  familyDetails: any;
  alternateNominee: any;
  today = new Date();
  getRelationList: Array<any> = [];
  getGenderList: Array<any> = [];
  getMaritalStatusList: any;
  frmNominee: any;
  getSchemeTypeList: any;
  getSchemeTypeListnew:any[]=[]
  EmployeeFamilyDetails: any = { familyDetails: [], nomineeDetails: [] }
  EmployeeAlternateyDetails: any = { alternateNominee: [] }
  IsEdit = false;
  index: number = 0;
  janaadhaarList: Array<any> = [];
  datePipe: any;
  date: Date;
  isSaveEnable = false;
  alternateSchemeList: Array<any> = [];
  FamilyRelationAlllist: Array<any> = [];
  action = '';
  constructor(private formbuilder: FormBuilder, private apiService: ApiEssService, private snackbar: SnackbarService,) {
    this.date = new Date();
  }
  
  ngOnInit(): void {
    this.familyDetails = this.formbuilder.group({
      name: ['', Validators.required],
      relationship: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      dob: ['', Validators.required],
      physicallyDisabled: [0, Validators.required],
      percentageOfDisability: new FormControl({ value: '' }),
      dependent: [0, Validators.required],
      employed: [0, Validators.required],
      janAadharId: ['',],
      memberId: [''],
      govEmployee: [0],
      employeeId: [''],
      familyMemId: [0],
      familyActive: [1]
    });

    this.frmNominee = this.formbuilder.group({
      schemes: ['', Validators.required],
      nameOfNominee: [''],
      relation: ['', Validators.required],
      share: ['', Validators.required],
      familyMemId: ['', Validators.required],
      schemeNomId: [0],
      nomineeActive: [1]
    })


    this.alternateNominee = this.formbuilder.group({
      name: [''],
      memberId: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      dob: ['', Validators.required],
      janAadharId: ['',],
      scheme: ['', Validators.required],
      nameOfNominee: [''],
      relation: ['', Validators.required],
      share: ['', Validators.required],
      Exsit: [true],
    });

    this.getRelation();
    this.getGender();
    this.getMaritalStatus();
    this.getSchemeType();
    this.getAlternateScheme();
    this.getFamilyRelationAll()

    if (this.config.isView) {
      this.familyDetails.disable();
      this.frmNominee.disable();
    }
    // this.config.isModified === true ? this.isSaveEnable = true : this.isSaveEnable = false;
    this.personal.subscribe(v => { 
      this.saveDraft();
    });
  }
  

  ngOnChanges(changes: any) {
    console.log(changes)
    if (changes.hasOwnProperty('EmpFamily')) {
      this.EmployeeFamilyDetails = changes.EmpFamily.currentValue;
console.log(this.EmployeeFamilyDetails)
      console.log("family details", this.EmployeeFamilyDetails)
    }
    this.config.isModified === true ? this.isSaveEnable = true : this.isSaveEnable = false;
    if (changes.hasOwnProperty('JanUserList')) {
      const data = changes.JanUserList.currentValue || [];
      data.forEach((user: any) => {
        this.EmployeeFamilyDetails.familyDetails.push({
          name: user.nameEng,
          memberId: user.jan_mid,
          dob:user.dob!=null?new Date(user.dob):"",
          janAadharId: user.janaadhaarId,
          relationship: 0,
          gender: 0,
          maritalStatus: '',
          physicallyDisabled:user.physicallyDisabled!=null?user.physicallyDisabled:'0',
        
          // disabilityId: false,
          // disabilityPercentage: '',
          dependent: false,
          employed: false
        })

      });
     
    }
  }

  modify() {
    this.familyDetails.enable();
    this.frmNominee.enable();
    this.config.isView = false;
    this.isSaveEnable = true;
  }



  getRelation = () => {
    this.apiService.postmdm('getFamilyRelation', {}).subscribe({
      next: (res) => {
        this.getRelationList = res.data;
      }
    })
  }
  getGender = () => {
    this.apiService.postmdm('getGender', {}).subscribe({
      next: (res) => {
        this.getGenderList = res.data;
      }
    })
  }
  getMaritalStatus = () => {
    this.apiService.postmdm('getMaritalStatus', {}).subscribe({
      next: (res) => {
        this.getMaritalStatusList = res.data;
      }
    })
  }
  getSchemeType = () => {

    this.apiService.postmdm('getSchemeType', {}).subscribe({
      next: (res) => {
        let data=res.data;
        this.getSchemeTypeList = res.data;
        let newdocumentlist:any = data.filter((item:any) => item.schNomId == "7")[0];
        this.getSchemeTypeListnew.push(newdocumentlist)
          newdocumentlist = data.filter((item:any) => item.schNomId == "5")[0];
          this.getSchemeTypeListnew.push(newdocumentlist)
           newdocumentlist = data.filter((item:any) => item.schNomId == "6")[0];
            this.getSchemeTypeListnew.push(newdocumentlist);
            console.log("getSchemeTypeListnew",this.getSchemeTypeListnew)
      }
    })

  }

  getFamilyRelationAll = () => {
    this.apiService.postmdm('getFamilyRelationAll', {}).subscribe({
      next: (res) => {

        this.FamilyRelationAlllist = res.data;
      }
    })

  }

  // alternate 
  getAlternateScheme = () => {
    this.apiService.postmdm('getAlternateScheme', {}).subscribe({
      next: (res) => {

        this.alternateSchemeList = res.data;
      }
    })

  }


  Nomineemember(status: any) {
    debugger
    this.alternateNominee.patchValue({
      Exsit: status,
    })


  }
  getScheme = (id: number) => {
    if (id !== undefined)
      return this.getSchemeTypeList.filter((x: any) => x.schNomId == id)[0]?.schNomNameEn;     
  }

  saveFamily() {
    console.log(this.familyDetails)
 
    if (this.familyDetails.invalid) { 
      alert("Please ensure that all fields are filled correctly and completely")
      return }
  
    if (this.IsEdit) {
      const family = this.EmployeeFamilyDetails.familyDetails[this.index];
      
      this.EmployeeFamilyDetails.familyDetails[this.index] = {
        ...this.familyDetails.value,
        familyMemId: family.familyMemId,
        familyActive: 1,
        isNew: family.isNew
      };
      if(this.EmployeeFamilyDetails?.nomineeDetails.length)
      {
            this.EmployeeFamilyDetails.nomineeDetails.forEach((element:any,i:any) => {
          if(element.familyMemId==family.familyMemId)
          {
           
            this.EmployeeFamilyDetails.nomineeDetails[i].nameOfNominee=this.familyDetails.value.name
          }
        });
      }
     
      this.familyDetails.reset();
    } else {
      const id = this.getRandom();
      this.EmployeeFamilyDetails.familyDetails.push({
        ...this.familyDetails.value,
        familyMemId: id,
        familyActive: 1,
        isNew: 1
      });
      this.familyDetails.reset();
    }
    this.IsEdit = false;
    this.familyDetails.reset();
    console.log(this.EmployeeFamilyDetails)
  }

  edit = (index: number) => {
    
    this.IsEdit = true;
    this.index = index;
    const data = this.EmployeeFamilyDetails.familyDetails[index];
    console.log("asda",data)
   
      if(data.physicallyDisabled=='1')
      {
        this.familyDetails.controls['percentageOfDisability'].setValidators([Validators.required]);
        this.familyDetails.controls['percentageOfDisability'].updateValueAndValidity();
      }else
      {
        data.physicallyDisabled=='0'
      }
    this.getJanaadhaar(data.janAadharId)
    this.familyDetails.patchValue({ ...data,
      memberId:data.familyMemId })
      // if(data.dependent=='2' || data.dependent=='')
      // {
       
      //   this.familyDetails.patchValue({dependent:0})
      // }
      if(data.relationship=='5' || data.relationship=='8')
      {
        this.familyDetails.patchValue({maritalStatus:1})
      }
      
  }
  remove = (index: number) => {
    // const data = this.EmployeeFamilyDetails.familyDetails[index];
    // console.log(data)
    // if (data.isNew === 0) {
    //   data.familyActive = 0
    // } else {
      this.EmployeeFamilyDetails.familyDetails.splice(index, 1);
    // }
  }

  getGenderName = (id: number) => {
    if (id !== undefined && id !== 0 && id !== null)
      return this.getGenderList.filter((x: any) => x.genId == id)[0]?.genNameEn;
  }

  getRelationName = (id: number) => {
    if (id !== undefined && id !== 0 && id !== null )
      return this.getRelationList.filter((x: any) => x.relationId == id)[0]?.rNameEn;
  }
  getRelationNameFamily = (id: number) => {
    if (id !== undefined && id !== 0 && id !== null)
      return this.getRelationList.filter((x: any) => x.relationId == id)[0]?.rNameEn;
  }
  getRelationByName = (id: number) => {
    if (id !== undefined && id !== 0 && id !== null)
      return this.FamilyRelationAlllist.filter((x: any) => x.relationId == id)[0]?.relationNameEn;
  }

  getFamilyList(data:any){
   
    return data.filter((item:any)=> item.familyActive === 1);
  }

  geNomineeList(data:any){
    if(data === null) {data = [], this.EmployeeFamilyDetails.nomineeDetails = []}
    return data.filter((item:any)=> item.nomineeActive === 1);
  }
  getRelationList1:any;
  getrelationList(event:any)
  {
      this.getRelationList1=this.EmployeeFamilyDetails.familyDetails.filter((item:any)=>item.familyMemId==event);
      console.log("getRelationList1",this.getRelationList1)
      this.frmNominee.patchValue({relation:this.getRelationList1[0].relationship})
  }

 
addNominee:boolean=true;
isNomSch:boolean=false;

  saveNominee() {
    let addNomData:any;
    
   this.isNomSch=false;
    if(this.frmNominee.value.share>100)
    {
     this.frmNominee.patchValue({
       share:""
     })
     this.addNominee=false;
     this.snackbar.show("Please Enter Share value between 1 to 100","danger")
     return
    }
    if(this.frmNominee.value.share<1)
    {
     this.frmNominee.patchValue({
       share:""
     })
     this.addNominee=false;
     this.snackbar.show("Please Enter Share value between 1 to 100","danger")
     return
    }
    if(this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).length>=1){
    
      let schNomList=this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).filter((x:any)=>x.schemes==this.frmNominee.value.schemes)
      console.log("schNomList",schNomList);
      if(schNomList.length>=1)
      {
        let totalShare:any=0;
        for(let r of schNomList)
        { 
          
          totalShare=totalShare+r.share;  
               
          if(r.familyMemId==this.frmNominee.value.familyMemId && !this.IsEdit)
          {
            this.isNomSch=true;
            addNomData=r;
            
          }
         
        }
       
        if(this.IsEdit)
        {
          
          totalShare=totalShare-this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[this.index].share;
         
        }  
       
        if(Number(totalShare)>100)
        {
          this.addNominee=false;
          this.snackbar.show("Scheme Share limit cannot be exceed above 100%","danger")
          return;
        }
       
      }
    }
    

    if(this.addNominee)
    {
      const empFam  = this.EmployeeFamilyDetails.familyDetails.filter((item:any)=>item.familyMemId === this.frmNominee.value.familyMemId)[0];

      if (this.IsEdit) {
       
        this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[this.index].share = this.frmNominee.value.share
        this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[this.index].nameOfNominee= this.getFamilyList(this.EmployeeFamilyDetails?.familyDetails).filter((x:any)=>x.familyMemId==this.frmNominee.value.familyMemId)[0].name
        console.log("nomineeDetails1",this.EmployeeFamilyDetails.nomineeDetails)
        this.IsEdit=false;
      } else if(this.isNomSch)
      {
       for(let i=0;i<this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).length;i++)
       {
        if(
          addNomData==this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[i]
        )
        {
          
          this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[i].share= this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[i].share+this.frmNominee.value.share;
          this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[i].nameOfNominee= this.getFamilyList(this.EmployeeFamilyDetails?.familyDetails).filter((x:any)=>x.familyMemId==this.frmNominee.value.familyMemId)[0].name
          
          console.log("nomineeDetails2",this.EmployeeFamilyDetails.nomineeDetails)
        }
       }
      }
      else {
        console.log(this.frmNominee.value)
        this.EmployeeFamilyDetails.nomineeDetails.push({
           ...this.frmNominee.value, 
           nameOfNominee: empFam.name,
           schemeNomId: 0, 
           nomineeActive: 1,
           isNew: 1 
          })
      }
      this.IsEdit = false;
      this.frmNominee.patchValue({
        schemes: [''],
        nameOfNominee: [''],
        relation: [''],
        share: [''],
        familyMemId: ['']
      })
    }
    
  }

  edit1 = (index: number) => {
    this.IsEdit = true;
    this.index = index;
    const data = this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[index];

    this.frmNominee.patchValue({ ...data })
    this.getrelationList(Number(data.familyMemId))
    this.frmNominee.patchValue({familyMemId:data.familyMemId,relation:data.relation  })
    
  }
  remove1 = (index: number,item:any) => {
   

   for(let i=0;i<this.EmployeeFamilyDetails.nomineeDetails.length;i++)
   {
    if(this.EmployeeFamilyDetails.nomineeDetails[i]==item)
    {
      console.log("aa",this.EmployeeFamilyDetails.nomineeDetails)
        this.EmployeeFamilyDetails.nomineeDetails.splice(i,1)
        console.log("bb",this.EmployeeFamilyDetails.nomineeDetails)
    }
    this.IsEdit=false
   }

    // if (data.isNew === 1) {
      // console.log("nomineeDetails1",this.EmployeeFamilyDetails.nomineeDetails)
      // console.log("nomineeDetails2",this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails))
      // this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).splice(index, 1);
      // console.log("nomineeDetails3",this.EmployeeFamilyDetails.nomineeDetails)
      // console.log("nomineeDetails4",this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails))
    //   data.familyActive = 0
    // } else {
    //   data.nomineeActive = 0
    // }
  }


  onItemChange(event: any) {
    if (event.value == false) {
      this.familyDetails.controls['percentageOfDisability'].disable();

    }
    else {
      this.familyDetails.controls['percentageOfDisability'].enable();

    }
  }

  onItemChanges(event: any) {
    if (event.value == false) {
      this.familyDetails.controls['govEmployee'].disable();
    }
    else {
      this.familyDetails.controls['govEmployee'].enable();
    }
  }
  checkShare(i:any)
  {
    this.addNominee=true
   if(i>100)
   {
    this.frmNominee.patchValue({
      share:""
    })
    this.snackbar.show("Please Enter Share value between 1 to 100","danger")
    return
   }
   if(i<1)
   {
    this.frmNominee.patchValue({
      share:""
    })
    this.snackbar.show("Please Enter Share value between 1 to 100","danger")
    return
   }
    
    if(this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).length>=1){
     
      let schNomList=this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).filter((x:any)=>x.schemes==this.frmNominee.value.schemes)
      console.log("schNomList",schNomList);
      if(schNomList.length>=1)
      {
        let totalShare:any=0;
        for(let r of schNomList)
        {
          totalShare=totalShare+r.share;
          
        }
        if(this.IsEdit)
          {
            
            totalShare=totalShare-this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[this.index].share;
            console.log("totalshare1",totalShare)
          }  
        totalShare=totalShare+Number(i);

        console.log("totalshare",totalShare)
        if(Number(totalShare)>100)
        { this.frmNominee.patchValue({
          share:""
        })
        this.snackbar.show("Scheme Share limit cannot be exceed above 100%","danger")
          return;
        }
       
      }
    }
   

   
   
  }

  savealternateNominee() {
    if (this.alternateNominee.invalid) { return }
    const data = this.EmployeeAlternateyDetails.alternateNominee.filter((x: any) => x.schemes === this.alternateNominee.value.schemes);
    // var oldest_person = data.reduce((a:number, b:number) => a.schemes > b.Age ? a : b );

    if (this.IsEdit) {

      this.EmployeeAlternateyDetails.alternateNominee[this.index] = this.alternateNominee.value;
    } else {
      this.EmployeeAlternateyDetails.alternateNominee.push(this.alternateNominee.value);
    }
    this.IsEdit = false;
    this.alternateNominee.reset();

  }

  editAlternate = (index: number) => {
    this.IsEdit = true;
    index = index;
    const data = this.EmployeeAlternateyDetails.alternateNominee[index];

    this.frmNominee.patchValue({ ...data })
  }
  removeAlternate = (index: number) => {
    this.EmployeeAlternateyDetails.alternateNominee.splice(index, 1);
  }

  checkValidateFamily() {
    this.EmployeeFamilyDetails.familyDetails.forEach((item: any) => {
      if (item.name == '' || item.relationship == null || item.relationship == 0 || item.dob == '' || item.gender == null || item.gender == 0 || item.maritalStatus == null || item.maritalStatus == 0) {
        this.snackbar.show('Please add Family Details and Nominee Details', 'danger');
      }
    });
  }

  getRandom() {
    return Math.floor(Math.random() * 10000000000);
  }

getSchemeName(schemeid:any)
{
return this.getSchemeTypeList.filter((x:any)=>x.schNomId==schemeid)[0].schNomNameEn
}
  saveDraft = () => {
   console.log(this.EmployeeFamilyDetails.nomineeDetails)
   for(let r of this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails))
   {
    let schNomList=this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).filter((x:any)=>x.schemes==r.schemes)
      console.log("schNomList",schNomList);
      if(schNomList.length>=1)
      {
        let totalShare:any=0;
        for(let r of schNomList)
        {
          totalShare=totalShare+r.share;
    
        }
        if(totalShare!=100)
        {
          let msg="Scheme "+this.getSchemeName(r.schemes)+" Nominee Share not equal to 100%";
          this.snackbar.show(msg,"danger")
          return;
        }
      }
   }
   let count=0;

  for(let r of this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails))
  {
    for(let j of this.EmployeeFamilyDetails.familyDetails)
    {
      if(r.familyMemId==j.familyMemId)
      {

        count=count+1
        
      }
    }
  
  }
  console.log(this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails))
  let isArrears=this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).filter((x:any)=>x.schemes==7)[0]?.familyMemId;
  let isCommutation=this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).filter((x:any)=>x.schemes==5)[0]?.familyMemId; 
  let isGratuity=this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).filter((x:any)=>x.schemes==6)[0]?.familyMemId;
if(isArrears==undefined)
{
  
  this.snackbar.show("Please Insert Nominee for 'Arrears' Scheme","danger");
  return;
}else if(isCommutation==undefined)
{
  this.snackbar.show("Please Insert Nominee for 'Commutation' Scheme","danger");
  
  return;
}else if(isGratuity==undefined)
{
  this.snackbar.show("Please Insert Nominee for 'Gratuity' Scheme","danger");
  return;
}
  if(count!=this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).length)
    {
      this.snackbar.show("Nominee Member not found into Family Details ","danger");
      return;
    }



    if (this.config.processId === 6) {
      if (this.EmployeeAlternateyDetails.alternateNominee.length > 0) {
        this.EmployeeFamilyDetails.alternateNominee = this.EmployeeAlternateyDetails.alternateNominee
      }
    }

    if (this.EmployeeFamilyDetails.familyDetails.length == 0 || this.EmployeeFamilyDetails.nomineeDetails.length == 0) {
      this.snackbar.show('Please add Family Details and Nominee Details', 'danger');
    }

    const fmList: any = [];
    const nmList: any = [];
    if (this.isSaveEnable) {
      this.EmployeeFamilyDetails.familyDetails.forEach((item: any) => {
        fmList.push({
          name: item.name,
          relationship: item.relationship,
          gender: item.gender,
          maritalStatus: item.maritalStatus,
          dob:moment( item.dob).format('YYYY-MM-DD').toString(),
          physicallyDisabled: item?.physicallyDisabled?item.physicallyDisabled:0,
          percentageOfDisability: item.percentageOfDisability,
          dependent: item.dependent,
          employed: item?.employed?item.employed:0,
          janAadharId: item.janAadharId?item.janAadharId:0,
          memberId: item.memberId,
          govEmployee: item?.govEmployee?item.govEmployee:0,
          employeeId: item?.govEmployee==1?item.employeeId:0,
          familyActive: item.familyActive,
          familyMemId: item.familyMemId,
          isNew: item.isNew
        })
      });
      this.EmployeeFamilyDetails.nomineeDetails.forEach((item: any) => {
        nmList.push({
          schemes: item.schemes,
          nameOfNominee: item.nameOfNominee,
          relation: item.relation,
          share: item.share,
          familyMemId: item.familyMemId,
          schemeNomId: item.schemeNomId,
          nomineeActive: item.nomineeActive
        })
      });
      this.EmployeeFamilyDetails = {
        familyDetails: fmList,
        nomineeDetails: nmList
      }
    }

    const data = { step: 4, value: this.EmployeeFamilyDetails, action: this.action ,validate:true}
    console.log(data.value)
    this.EmpData.emit(data);
    




    /* this.apiService.postmst('familyDetail/validate', this.EmployeeFamilyDetails).subscribe(res => {
      if (res.status == 'SUCCESS') {
        
      }
    }) */


  }

  //4807772669
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

  isDisabled:boolean=false
  disabledChange(i:any)
  {
    if(this.familyDetails.value.physicallyDisabled=='1')
    {
      this.isDisabled=true;
      this.familyDetails.controls['percentageOfDisability'].setValidators([Validators.required]);
    }else
    {
      this.isDisabled=false;
      this.familyDetails.controls['percentageOfDisability'].clearValidators();
    }
    this.familyDetails.controls['percentageOfDisability'].updateValueAndValidity();
      this.familyDetails.patchValue({
        percentageOfDisability:""
      })

  }
  checkRange()
  {

    if(this.familyDetails.value.percentageOfDisability<40 || this.familyDetails.value.percentageOfDisability>100)
    {
      alert("Please enter between 40 to 100");
      this.familyDetails.patchValue({
        percentageOfDisability:""
      })
    }
  }
  isHead:boolean=false
  changeMember = () => {
    this.isHead=false;
    const data = this.janaadhaarList.filter(x => x.jan_mid === this.familyDetails.value.memberId)[0];
    if(this.familyDetails.value.memberId==0)
    {
      this.isHead=true;
      this.familyDetails.patchValue({memberId:data.hof_jan_m_id})
    }
    const dobParts = data.dob.trim().split('/'); // Assuming date is separated by slashes
    const day = parseInt(dobParts[0], 10);
    const month = parseInt(dobParts[1], 10);
    const year = parseInt(dobParts[2], 10);
   const dob = new Date(year, month-1, day);
    this.familyDetails.patchValue({
      name: data.nameEng,
      fatherName: data.fnameEng,
      motherName: data.mnameEng,
      dob: dob,
      mobileNumber: data.mobile,
      aadharRefNo: data.aadhar,
      pan: data.panNo
      // gender: data.panNo
    });
   
  }
  changeAlternateMember = () => {
    const data = this.janaadhaarList.filter((x:any) => x.jan_mid==0?x.hof_jan_m_id:x.jan_mid === this.alternateNominee.value.memberId)[0];
    console.log(data)
   // const data = this.janaadhaarList.filter(x => x.jan_mid === this.alternateNominee.value.memberId)[0];
   



    // this.alternateNominee.patchValue({
    //   name: data.nameEng,
    //   fatherName: data.fnameEng,
    //   motherName: data.mnameEng,
    //   dob: new Date(data.dob),
    //   mobileNumber: data.mobile,
    //   aadharRefNo: data.aadhar,
    //   pan: data.panNo
    //   // gender: data.panNo
    // });

  }

}









