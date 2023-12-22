import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';

import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { DateAdapter } from '@angular/material/core';

import { ApiEssService } from 'src/app/services/api-ess.service';
import * as moment from 'moment';
// import { MatSelectFilterModule } from 'mat-select-filter';
@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.Default

})
export class ServiceDetailsComponent implements OnInit {
  @Input() EmpDetails: any = {};
  @Input() dateOfBirth: any;
  @Input() config: any = {};
  @Output() EmpData = new EventEmitter();
  @Output() ServiceUser = new EventEmitter();
  @Input() userAction: Array<any> = [];
  @Input() personal: Subject<boolean>;
  serviceDetails: any;
  today = new Date();
  entitalmentList: Array<any> = [];
  getEmployeeTypeList: Array<any> = [];
  getServiceCategoryList: Array<any> = [];
  getSubServiceCategoryList: Array<any> = [];
  getServiceQuotaList: Array<any> = [];
  departmentList: Array<any> = [];
  designationList: Array<any> = [];
  officerTypeList: Array<any> = [];
  timeTypeList: Array<any> = [];
  serviceStatus: Array<any> = [];
  subServiceStatus: Array<any> = [];
  docList: Array<any> = [];
  designationAsPerServiceCadrelist: Array<any> = [];
  dob = '';
  data: any
  panelOpenState = false;
  isSaveEnable = false;
  action = '';
  isEnablefut:boolean=false;
  isPayManager:boolean=true
  constructor(private formbuilder: FormBuilder, private apiService: ApiEssService, private datePipe: DatePipe,private dateAdapter: DateAdapter<Date>) {
     
  }

ngOnInit(): void {
    
  this.serviceDetails = this.formbuilder.group({
    entitlementStatus: new FormControl('', Validators.required),
    serviceQuota: new FormControl('', Validators.required),
    serviceCategory: new FormControl('', Validators.required),
    employeeType: new FormControl('', Validators.required),
    subServiceCategory: new FormControl('', Validators.required),
    officerTypeId: new FormControl('', Validators.required),
    parentDepartment: new FormControl('', Validators.required),
    currentDepartment: new FormControl('', Validators.required),
    currentDesignation: new FormControl('', Validators.required),
    appointedAs: new FormControl('', Validators.required),
    appointmentOrderNo: new FormControl('', ),
    appointmentOrderDate: new FormControl('', Validators.required),
    orderIssuingAuthority: new FormControl(''),
    appointingAuthority: new FormControl('', Validators.required),
    dateOfJoiningRegularService: new FormControl('', Validators.required),
    dateOfPresentDesignation: new FormControl('', Validators.required),
    dateOfJoiningPresentDDO: new FormControl('', Validators.required),
    joiningDate: new FormControl('', Validators.required),
    joiningTime: new FormControl('', Validators.required),
    pranType: new FormControl({ value: '', disabled: this.isEnablefut }),
    gpfNO: new FormControl({ value: '', disabled: this.isEnablefut }),
    stateInsuranceNumber: new FormControl({ value: '', disabled: this.isEnablefut }),
    rghsNO: new FormControl({ value: '', disabled: this.isEnablefut }),
    beltNo: new FormControl({ value: '', disabled: this.isEnablefut }),
    pliNo: new FormControl({ value: '', disabled: this.isEnablefut }),
    iasCpneNo: new FormControl({ value: '', disabled: this.isEnablefut }),
    pPANNo: new FormControl({ value: '', disabled: this.isEnablefut }),
    areYouExServiceMan: new FormControl(0, Validators.required),
    areYouGettingPensionFromThePreviousMilitaryService: new FormControl(0, Validators.required),
    areYouGettingCivilServicePension: new FormControl(0, Validators.required),
    retirementDate: new FormControl('', Validators.required,),
    ppoNo: new FormControl(''),
    pensionAmount: new FormControl(''),
    documentList: new FormControl([]),
    serviceStatus: new FormControl('', Validators.required),
    subServiceStatus: new FormControl('', Validators.required),
    designationAsPerServiceCadre: new FormControl('', Validators.required),
    civilppoNo:new FormControl(''),
    civilpensionAmount:new FormControl(''),
    areYouPromAdv:new FormControl(''),
    benefitYears:new FormControl(''),
  });

  this.getEntitalment();
  this.getServiceCategory();
  this.getServiceQuota();
  this.getDesignation();
  this.getDepartment();
  this.getOfficerType();
  this.getServiceStatus();
  this.getTimeType();
  this.getDesignationAsPerServiceCadre();
  if (this.config.isView) {
    this.serviceDetails.disable();
  }
  this.config.isModified === true ? this.isSaveEnable = true : this.isSaveEnable = false;
  this.personal.subscribe(v => { 
    this.onSubmit();
  });
}
areYouPromAdv()
{
 
}
selectedStates = this.serviceStatus;
onKey(value:any) { 
  this.selectedStates = this.search(value);
  }
  search(value: string) { 
    let filter = value.toLowerCase();
    return this.serviceStatus.filter(option => option.toLowerCase().startsWith(filter));
  }
// private readonly pponoV: ValidatorFn = c => {
//   return this.isExSerMan && this.areGettingPensionTMilitaryService ? Validators.required(c) : Validators.nullValidator(c);
// }

// private readonly CivilpponoV: ValidatorFn = c => {
  
//   return this.areGettingCivilService ? Validators.required(c) : Validators.nullValidator(c);
// }
pponoV()
{
  if(this.isExSerMan && this.areGettingPensionTMilitaryService)
  {
    this.serviceDetails?.controls['ppoNo'].setValidators([Validators.required]);
    this.serviceDetails?.controls['pensionAmount'].setValidators([Validators.required]);
  }else
  {
    this.serviceDetails?.controls['ppoNo'].clearValidators();
    this.serviceDetails?.controls['pensionAmount'].clearValidators();
  }
  this.serviceDetails?.controls['ppoNo'].updateValueAndValidity();
  this.serviceDetails?.controls['pensionAmount'].updateValueAndValidity();
}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  
  
}
CivilpponoV()
{
  if(this.areGettingCivilService)
  {
    this.serviceDetails?.controls['civilppoNo'].setValidators([Validators.required]);
    this.serviceDetails?.controls['civilpensionAmount'].setValidators([Validators.required]);
  }else
  {
    this.serviceDetails?.controls['civilppoNo'].clearValidators();
    this.serviceDetails?.controls['civilpensionAmount'].clearValidators();
  }
  this.serviceDetails?.controls['civilppoNo'].updateValueAndValidity();
  this.serviceDetails?.controls['civilpensionAmount'].updateValueAndValidity();
}

ngOnChanges(changes: any) {
  console.log(changes)
  console.log( changes.EmpDetails?.currentValue)
  if ( !changes.EmpDetails.firstChange) {
    const data = changes.EmpDetails.currentValue;
    console.log("data",data)
    this.serviceDetails.patchValue({ ...changes.EmpDetails.currentValue });
    console.log("data  this.serviceDetails", this.serviceDetails)
    // let appointmentOrderDate:any=""
    let dateOfPresentDesignation:any=""
    let joiningDate:any=""
    let retirementDate:any=""
    let dateOfJoiningRegularService:any=""
    let dateOfJoiningPresentDDO:any=""
    // if(data?.appointmentOrderDate)
    // appointmentOrderDate=new Date(data.appointmentOrderDate)
    if(data?.dateOfPresentDesignation)
    dateOfPresentDesignation=new Date(data.dateOfPresentDesignation)

    if(data?.joiningDate)
     joiningDate=new Date(data.joiningDate)

     if(data?.retirementDate)
     retirementDate=new Date(data.retirementDate)

     if(data?.dateOfJoiningRegularService)
    dateOfJoiningRegularService=new Date(data.dateOfJoiningRegularService)

    if(data?.dateOfJoiningPresentDDO)
    dateOfJoiningPresentDDO=new Date(data.dateOfJoiningPresentDDO)
    
    this.serviceDetails.patchValue({ 
      dateOfPresentDesignation:dateOfPresentDesignation,
      joiningDate:joiningDate,
      retirementDate:retirementDate,
      dateOfJoiningRegularService:dateOfJoiningRegularService,
      dateOfJoiningPresentDDO:dateOfJoiningPresentDDO});
   
    this.getSubServiceCategory();
    this.getSubServiceStatus();
    /*if(this.config.registrationType === 2 && changes.EmpDetails.currentValue){
       this.dob = changes.EmpDetails.currentValue.dob;
     } */
     this.docList=data?.documentList;
     this.areYouExServiceMan();
    this.areYouGettingPensionFromThePreviousMilitaryService();
     this.areYouGettingCivilServicePension()
  }
 
  
  if (changes.hasOwnProperty('dateOfBirth')) {
    this.dob = changes.dateOfBirth.currentValue;
  }
  this.config.isModified === true ? this.isSaveEnable = true : this.isSaveEnable = false;
  if(this.serviceDetails?.value.areYouExServiceMan=='1')
  {
    this.isExSerMan=true;
  }
  if(this.serviceDetails?.value.areYouGettingPensionFromThePreviousMilitaryService=='1')
  {
    this.areGettingPensionTMilitaryService=true;
  }
   if(this.serviceDetails?.value.areYouGettingCivilServicePension=='1')
  {
    this.areGettingCivilService=true;
  }
  this.CivilpponoV();
  this.pponoV();
}
getDocument = (data: any) => {
  this.docList = data;
  console.log("doclist",this.docList)
}
modify() {
  this.serviceDetails.enable();
  this.isSaveEnable = true;
  this.config.isModified = false
}
getEntitalment = () => {
  if(this.serviceDetails.value.serviceCategory!='')
  {
    this.apiService.postmdm('getEntitlementDetails', { servicecatId: this.serviceDetails.value.serviceCategory }).subscribe({
      next: (res) => {
        this.entitalmentList = res.data;
      }
    })
  }
  
}

getEmployeeType = () => {
  this.apiService.postmdm('getEmployeeType', { serviceStatusId: this.serviceDetails.value.serviceStatus, subServiceStatusId: this.serviceDetails.value.subServiceStatus }).subscribe({
    next: (res) => {
      this.getEmployeeTypeList = res.data;
    }
  })
}

getServiceCategory = () => {
  this.apiService.postmdm('getServiceCategory', {}).subscribe({
    next: (res) => {
      const data = res.data
      this.getServiceCategoryList = res.data;
    }
  })

}

empServiceDetails = () => {
  const data = {
    serviceCategory: this.serviceDetails.value.serviceCategory,
    subServiceCategory: this.serviceDetails.value.subServiceCategory
  }
  this.ServiceUser.emit(data);
  this.getDateOfRetirement();
  this.getDesignationAsPerServiceCadre();
//  this.getDepartment();
}

getSubServiceCategory = () => {
  this.serviceDetails.value.serviceCategory === 1 ? this.serviceDetails.patchValue({ gazetted: 0 }) : this.serviceDetails.patchValue({ gazetted: '' })
  this.apiService.postmdm('getSubServiceCategory', { serviceCategoryId: this.serviceDetails.value.serviceCategory }).subscribe({
    next: (res) => {
      this.getSubServiceCategoryList = res.data;
      this.getEmployeeType();
      this.empServiceDetails();
    }
  })

  this.getEntitalment();
}
onKey1(value:any) { 
  // alert(value)
  // this.selectedStates = this.performFilter(value);
  // console.log("this.selectedStates",this.selectedStates)
  }
  
  // Filter the states list and send back to populate the selectedStates**
  search2(value: string) { 
    let filter = value;
    return this.departmentList.filter(option => option.startsWith(filter));
  }
  performFilter(filterBy: string){
    if (filterBy) {
        // filterBy = filterBy.toLocaleLowerCase();
        return this.departmentList.filter((movie: any) =>
            movie.title.indexOf(filterBy) !== -1);
    } else {
        return this.departmentList;
    }
}
getServiceQuota = () => {
  this.apiService.postmdm('getServiceQuota', {}).subscribe({
    next: (res) => {
      this.getServiceQuotaList = res.data;
    }
  })
}

getDepartment = () => {
  // const data = {
  //   inType: 2,
  //   srvcDesgId:  this.serviceDetails.value.designationAsPerServiceCadre,
  //   deptId: null
  // }
 
  const data =
  {
    "inType": 2,
    srvcCatId: this.serviceDetails.value.serviceCategory,
    subSrvcCatId: this.serviceDetails.value.subServiceCategory,
    srvcDesgId:  this.serviceDetails.value.designationAsPerServiceCadre
}

  //getServiceDesgPayMap

    this.apiService.postmdm('getDepartment', {}).subscribe({
      // this.apiService.postlmdm('getServiceDesgPayMap', data).subscribe({
    next: (res) => {
      this.departmentList = res.data;
      this.departmentList.sort((a, b) => a.deptNameEn.localeCompare(b.deptNameEn));
      this.selectedStates=this.departmentList
    }
  })
}

getGazettedNonGazetted= () => {

const data =
{
  "inType": 2,
  srvcCatId: this.serviceDetails.value.serviceCategory,
  subSrvcCatId: this.serviceDetails.value.subServiceCategory,
  srvcDesgId:  this.serviceDetails.value.designationAsPerServiceCadre
}
this.apiService.postlmdm('getServiceDesgPayMap', data).subscribe({
next: (res) => {
  this.officerTypeList = res.data;
 
}
})


}



getDesignation = () => {
  this.apiService.postmdm('getDesignation', {}).subscribe({
    next: (res) => {
      this.designationList = res.data;
      this.designationList.sort((a, b) => a.desgDescEn.localeCompare(b.desgDescEn));
    }
  })
}
isJudge:boolean=false;
designationChange()
{
 
  if(
    this.serviceDetails.value.currentDesignation==3294
    || this.serviceDetails.value.currentDesignation==2942
    || this.serviceDetails.value.currentDesignation==1325
    || this.serviceDetails.value.currentDesignation==931
    || this.serviceDetails.value.currentDesignation==639
  )
  {
    this.isJudge=true;
  }else
  {
    this.isJudge=false;
  }
}
getTimeType = () => {
  this.apiService.postmdm('getTimeType', {}).subscribe({
    next: (res) => {
      this.timeTypeList = res.data;
    }
  })
}

getOfficerType = () => {
  this.apiService.postmdm('getOfficerType', {}).subscribe({
    next: (res) => {
      this.officerTypeList = res.data;
    }
  })
}

getServiceStatus = () => {
  this.apiService.postmdm('getServiceStatus', {}).subscribe({
    next: (res) => {
      this.serviceStatus = res.data;
    }
  })
}
dateChange1(event:any)
{
 
  // alert( moment(this.serviceDetails.value.appointmentOrderDate).format('YYYY-MM-DD').toString());
}
getSubServiceStatus = () => {
  this.apiService.postmdm('getSubServiceStatus', { serviceStatusId: this.serviceDetails.value.serviceStatus }).subscribe({
    next: (res) => {
      this.subServiceStatus = res.data;
     
    }
  })
}

ChangeServiceStatus()
{
  this.serviceDetails.patchValue({
    subServiceStatus:"",
    employeeType:""
  })
  this. getSubServiceStatus();

}
ChangeserviceCategory()
{
  this.serviceDetails.patchValue({
    subServiceCategory:"",
    designationAsPerServiceCadre:""
  })
  this. getSubServiceCategory();
}
getDesignationAsPerServiceCadre = () => {
  const data = {
    inType: 1,
    srvcCatId: this.serviceDetails.value.serviceCategory,
    subSrvcCatId: this.serviceDetails.value.subServiceCategory
    // srvcDesgId: 0,
    // deptId: null
  }



this.apiService.postlmdm('getServiceDesgPayMap', data).subscribe({
  //  this.apiService.postmdm('getDesignationAsPerServiceCadre', {}).subscribe({
    next: (res) => {
      this.designationAsPerServiceCadrelist = res.data;
      this.designationAsPerServiceCadrelist.sort((a, b) => a.serviceDesignationName.localeCompare(b.serviceDesignationName));  
      this.getDepartment();
    }
  })
}



getDateOfRetirement = () => {
  const dob = this.datePipe.transform(this.dob, "yyyy-MM-dd");
  if (dob == null) { return }
  this.apiService.postlmdm('getDateOfRetirement', { subServiceCatId: this.serviceDetails.value.subServiceCategory, dateOfBirth: dob }).subscribe({
    next: (res) => {
      this.serviceDetails.patchValue({
        retirementDate: new Date(res.data.dateofretirement)
      })
    }
  })
}

changeSQ = (data: any) => {
  data.value === 4 ? this.serviceDetails.patchValue({ areYouExServiceMan: 1 }) : this.serviceDetails.patchValue({ areYouExServiceMan: 0 });
}



onSubmit = () => {
 

  // console.log(this.serviceDetails.value.appointmentOrderDate.toLocaleString())
  if (this.serviceDetails.invalid) { 
    alert("Please ensure that all fields are filled correctly and completely");
    return }
    let servicedata=this.serviceDetails.value;
    console.log("servicedata",servicedata)

    if(servicedata['serviceStatus']!='')
    {
      if(this.serviceStatus)
      {
    servicedata['serviceStatusN']=this.serviceStatus.filter((x:any)=>x.serviceStatusId==servicedata['serviceStatus'])[0]?.serviceStatusName;}}
    if(servicedata['subServiceStatus']!='')
    {
      if(this.subServiceStatus)
      {
    servicedata['subServiceStatusN']=this.subServiceStatus.filter((x:any)=>x.subServiceStatusId==servicedata['subServiceStatus'])[0]?.subServiceStatusName;}}
    if(servicedata['employeeType'])
    {
      if(this.getEmployeeTypeList)
      {
    servicedata['employeeTypeN']=this.getEmployeeTypeList.filter((x:any)=>x.statusId==servicedata['employeeType'])[0]?.statusName;}}
    if(servicedata['serviceCategory'])
    {
      if(this.getServiceCategoryList)
      {
    servicedata['serviceCategoryN']=this.getServiceCategoryList.filter((x:any)=>x.srvcCatId==servicedata['serviceCategory'])[0]?.srvcCatNameEn;}}
    if(servicedata['subServiceCategory'])
    {
      if(this.getSubServiceCategoryList)
      {
    servicedata['subServiceCategoryN']=this.getSubServiceCategoryList.filter((x:any)=>x.serviceSubCatId==servicedata['subServiceCategory'])[0]?.subServiceCatNameEn;}}
    if(servicedata['designationAsPerServiceCadre'])
    {
      if(this.designationAsPerServiceCadrelist)
      {
    servicedata['designationAsPerServiceCadreN']=this.designationAsPerServiceCadrelist.filter((x:any)=>x.cadreId==servicedata['designationAsPerServiceCadre'])[0]?.cadreNameEn;}}
    if(servicedata['entitlementStatus'])
    {
      if(this.entitalmentList)
      {
    servicedata['entitlementStatusN']=this.entitalmentList.filter((x:any)=>x.entId==servicedata['entitlementStatus'])[0]?.entStatus;}}
   
    servicedata['officerTypeIdN']=this.officerTypeList.filter((x:any)=>x.officerTypeId==servicedata['officerTypeId'])[0]?.officerType;
    if(servicedata['serviceQuota'])
    {
      if(this.getServiceQuotaList)
      {
    servicedata['serviceQuotaN']=this.getServiceQuotaList.filter((x:any)=>x.quotaId==servicedata['serviceQuota'])[0]?.quotaNameEn;}}
    if(servicedata['parentDepartment'])
    {
      if(this.departmentList)
      {
    servicedata['parentDepartmentN']=this.departmentList.filter((x:any)=>x.deptId==servicedata['parentDepartment'])[0]?.deptNameEn;}}
    if(servicedata['currentDepartment'])
    {
      if(this.selectedStates)
      {
    servicedata['currentDepartmentN']=this.selectedStates.filter((x:any)=>x.deptId==servicedata['currentDepartment'])[0]?.deptNameEn;}}
    if(servicedata['appointingAuthority'])
    {
      if(this.designationList)
      {
    servicedata['appointingAuthorityN']=this.designationList.filter((x:any)=>x.desgId==servicedata['appointingAuthority'])[0]?.desgDescEn;}}
    if(servicedata['appointedAs'])
    {
      if(this.designationList)
      {
    servicedata['appointedAsN']=this.designationList.filter((x:any)=>x.desgId==servicedata['appointedAs'])[0]?.desgDescEn;}}
    if(servicedata['currentDesignation'])
    {
      if(this.designationList)
      {
    servicedata['currentDesignationN']=this.designationList.filter((x:any)=>x.desgId==servicedata['currentDesignation'])[0]?.desgDescEn;}}
    if(servicedata['joiningTime'])
    {
      if(this.timeTypeList)
      {
    servicedata['joiningTimeN']=this.timeTypeList.filter((x:any)=>x.timeId==servicedata['joiningTime'])[0]?.timeType;}}
   

  const data = { step: 2, value: servicedata, action: this.action,validate:true }
  if(this.docList)
  {
data['value']['documentList']=this.docList;
  }

  // data['value']['appointmentOrderDate']=moment(this.serviceDetails.value.appointmentOrderDate).format('YYYY-MM-DD').toString();
  data['value']['dateOfPresentDesignation']=moment(this.serviceDetails.value.dateOfPresentDesignation).format('YYYY-MM-DD').toString()
  data['value']['joiningDate']=moment(this.serviceDetails.value.joiningDate).format('YYYY-MM-DD').toString()
  data['value']['retirementDate']=moment(this.serviceDetails.value.retirementDate).format('YYYY-MM-DD').toString()
  data['value']['dateOfJoiningRegularService']=moment(this.serviceDetails.value.dateOfJoiningRegularService).format('YYYY-MM-DD').toString()
  data['value']['dateOfJoiningPresentDDO']=moment(this.serviceDetails.value.dateOfJoiningPresentDDO).format('YYYY-MM-DD').toString()
 
 
  console.log("service data",data);

  this.EmpData.emit(data);
  
  
  
  // this.apiService.postEss('serviceDetail/validate', this.serviceDetails.value).subscribe(res => {
  //   if (res.status == 'SUCCESS') {
  //     const data = {step: 2, value: this.serviceDetails.value, action: this.action }
  //     this.EmpData.emit(data);

  //   }
  // }) 
}
isExSerMan:boolean=false
areYouExServiceMan()
{
  if(this.serviceDetails.value.areYouExServiceMan=='1')
  {
    this.isExSerMan=true;
  }else
  {
    this.isExSerMan=false;
    this.serviceDetails.patchValue({ppoNo:"",pensionAmount:""})
  }
  this.pponoV();
}
areGettingPensionTMilitaryService:boolean=false
areYouGettingPensionFromThePreviousMilitaryService()
{
  if(this.serviceDetails.value.areYouGettingPensionFromThePreviousMilitaryService=='1')
  {
    this.areGettingPensionTMilitaryService=true;
  }else
  {
    this.areGettingPensionTMilitaryService=false;
    this.serviceDetails.patchValue({ppoNo:"",pensionAmount:""})
  }
  this.pponoV();
}
areGettingCivilService:boolean=false
areYouGettingCivilServicePension()
{
  
  if(this.serviceDetails.value.areYouGettingCivilServicePension=='1')
  {
    this.areGettingCivilService=true;
  }else
  {
    this.areGettingCivilService=false;
    this.serviceDetails.patchValue({civilppoNo:"",civilpensionAmount:""})
  }
  this.CivilpponoV();
}
}
