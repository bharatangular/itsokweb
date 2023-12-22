import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import {Observable,of} from 'rxjs';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';
@Component({
  selector: 'app-upcoming-retirements',
  templateUrl: './upcoming-retirements.component.html',
  styleUrls: ['./upcoming-retirements.component.scss']
})
export class UpcomingRetirementsComponent implements OnInit {
  @Output() dataParms  = new EventEmitter<any>();
  @Output() totalRetirements  = new EventEmitter<any>();
  departmentList        :any;
  departmentID          :any = 0;
  officeID              :any = 0;
  officeList            :any;
  employeeList          :any = [];
  filterEmplist         :any = []
  upcomingRetirementData:any;
  myControl             = new FormControl("0");
  offcmyControl         = new FormControl("0");
  filteredOptions       !: any;
  $filterdOfficelist    !: Observable<any>;
  userdetails:any;
  config:AppConfig=new AppConfig()
  constructor(private dashboardService : PensionServiceService) { }

  ngOnInit(): void {
    this.userdetails=this.config.getUserDetails();
    // this.getDeptList()
    this.getEmployeeDetailsForDashboard()
    this.upcomingRetireMentDetailsByMonthWise()
   
    
   
  }
  private _filter(value: any) {
    
   if(isNaN(value)) 
    return this.departmentList && this.departmentList.filter((option:any) => option.v_dept_name.toLowerCase().includes(value ));
    else {
    return this.departmentList && this.departmentList.filter((option:any) => option.v_DEPT_ID == value );
    }
  }
  private _filteroffc(value: any) {
    if(isNaN(value)) 
    return this.officeList && this.officeList.filter((option:any) => option.v_ofc_name.toLowerCase().includes(value  ));
    else {
      return this.officeList && this.officeList.filter((option:any) => option.v_OFC_ID == value );
      }
  }
  
  resetUpcomingEmployee(){
    this.offcmyControl.reset()
    this.myControl.reset()
    this.filterEmplist = this.employeeList;
  }
  displayFn(departmanet :any){
   return departmanet ? departmanet.v_dept_name : "";
  }
  displayofFn(offc :any){
    return offc ? offc.v_ofc_name : "";
   }



  // getDeptList(){

  //   this.dashboardService.getDeptList('getDeptList',{}).subscribe({
  //     next:(res:any)=>{
  //       if(res && res.status == 'SUCCESS'){
  //        this.departmentList = res.data 

  //       this.filteredOptions = this.myControl.valueChanges
  //       .pipe(
  //        startWith(""),
  //        map(value => (value ? this._filter(value) : this.departmentList))
     
  //   );
  //       }

  //     },
  //     error:(err:any)=>{

  //     },
  //     complete: ()=>{
  //       // 
  //     }
  //   })
  // }



  
  // getOfficeDetailsByDeptId(event?: Event){
  //   this.dataParms.emit({dept_id:this.myControl.value.v_DEPT_ID, offc_id:this.offcmyControl.value.v_OFC_ID})
  //   let payload = {
  //     "deptId": this.myControl.value.v_DEPT_ID
  // }
  
  //   this.dashboardService.getOfficeDetailsByDeptId('getOfficeDetailsByDeptId',payload).subscribe({
  //     next:(res:any)=>{       
  //       this.officeList = res?.data
  //       this.$filterdOfficelist = this.offcmyControl.valueChanges
  //        .pipe(
  //        startWith(""),
  //        map(value => (value ? this._filteroffc(value) : this.officeList))
     
  //   );
  //     },
  //     error:(err:any)=>{

  //     },
  //     complete: ()=>{
        
  //     }
  //   })
  // }


  getEmployeeDetailsForDashboard(){
    this.dataParms.emit({dept_id:this.myControl.value.v_DEPT_ID, offc_id:this.offcmyControl.value.v_OFC_ID})
    let payload = {
      "isRole"  : 99,
      "officeId": 904,

  }

  this.dashboardService.getEmployeeDetailsForDashboard('getEmployeeDetailsForDashboard',payload).subscribe({
    next:(res:any)=>{
     this.employeeList = []
      this.employeeList = res?.data
      this.filterEmplist = this.employeeList;
    },
    error:(err:any)=>{

    },
    complete: ()=>{
      
    }
  })
}



filterEmploye(){
  this.filterEmplist = this.employeeList.filter((item:any)=>{
    this.offcmyControl.value.v_ofc_name == item.ofcName
  })

}

upcomingRetireMentDetailsByMonthWise(){
let payload =  {
    // "deptId": this.myControl.value.v_DEPT_ID ? this.myControl.value.v_DEPT_ID : 0,
    "isRole"  :this.userdetails.roleid,
    "officeId":this.userdetails.officeid
    // "officeId": this.offcmyControl.value.v_OFC_ID ? this.offcmyControl.value.v_OFC_ID :0
}

  this.dashboardService.upcomingRetireMentDetailsByMonthWise('upcomingRetireMentDetailsByMonthWise',payload).subscribe({
    next:(res:any)=>{
      // console.log(res, " upcomingRetireMentDetailsByMonthWise")
     
      this.upcomingRetirementData = res?.data
      this.totalRetirements.emit({total_Retirement:this.upcomingRetirementData?.totalEmp ? this.upcomingRetirementData?.totalEmp : 0})
    },
    error:(err:any)=>{

    },
    complete: ()=>{
      
    }
  })
}





}
