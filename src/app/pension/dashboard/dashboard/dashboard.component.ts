import { Component,  OnInit,AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { ChangeDetectionStrategy } from "@angular/core";  // import
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DashDialogComponent } from '../dash-dialog/dash-dialog.component';
import { forkJoin } from 'rxjs';

interface Food {
  value: string;
  viewValue: string;
}

interface Car {
  value: string;
  viewValue: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,

  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,AfterContentChecked  {
  pensionMonth            : any    = (new Date().getMonth() +1).toString();
  pensionYear             : any = (new Date().getFullYear()).toString();
  // pensionMonth            : any    = "0";
  // pensionYear             : any = "0";
  psnMonthYearDataList: any =[];
  psnYearList             : any;
  totalPensionKit         : any =[];
  countGpoCpoPpoflag      : any = 1;
  countGpoCpoPpoData      : any;
  departmentList          : any;
  HOO_pensionMonth        : any = new Date().getMonth() +1;
  bill_Month              : any = new Date().getMonth() +1;
  departmentName          : any;
  officeName              : any;
  officeId                : any;
  departmentId: any;
  selectedZone: any;
;
  paramsDeptOffc          : any = {
    dept_id  : null,
    offc_id  : null
  };
  pensionZonalOfficeData   :any;
  pensionZonalOfficeData_Ho:any;
  pensionApplicationData  :any;
  zonal_pensionMonth      :any   = new Date().getMonth() +1;
  payment_CPO_GPO_Month   :any   = new Date().getMonth() +1;
  bills_CPO_GPO_Month     :any   = new Date().getMonth() +1;
  bills_CPO_GPO_Year      :Number = new Date().getFullYear();
  pnsn_zonal_Month        :any   = new Date().getMonth() +1;
  userdetails:any;
  zoneList                :any;
  pensn_application_year  : Number = new Date().getFullYear();
  pensn_zonal_year        : Number = new Date().getFullYear();
  pensn_Ho_year           : Number = new Date().getFullYear();
  payment_CPO_GPO_Year    : Number = new Date().getFullYear();
  payment_CPO_GPO_Zone    :any;
  pensn_app_status_zone   : any;
  pensn_zoneoffice_zone_hoo   :any;
  pensn_zoneoffice_zone   :any;
  bills_CPO_GPO_Zone      :any;
  bills_CPO_GPO_Data      :any;
  payment_CPO_GPO_Data    :any;
  zoneFlag                :any;
  total_retirement        :any;
  upcomingRetirementData  :any;
  office_id_selection_flag:any; 
  completedRequests  = 0;
  totalPensionKitesign  : any;
  isDate: any = 1;
  config:AppConfig=new AppConfig()
   flagValues = [1, 4, 5, 6];
   pendingBills: any;
  constructor(
    private dateAdapter: DateAdapter<Date>,
    private cd : ChangeDetectorRef,
    private router: Router, 
    private loader:LoaderService,
    private dialog: MatDialog,
    private dashboardService : PensionServiceService) {
      this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy

   }

  ngOnInit(): void {
    this.userdetails=this.config.getUserDetails();
    // console.log(this.userdetails, "this.userdetails")
    this.dashboardService.configMenu = { url: "Dashboard" ,report:true};

   this.loader.show()
   this.countGpoCpoPpo()
   this.countGpoCpoPpo2()
   this.getPensionApplicationStatus()
   this.getStatusAtPensionZonalOffice()
   this.getbillcount('1');
   this.getbillcount('3');
   this.getbillcountPayment()
   this.upcomingRetireMentDetailsByMonthWise()
   this.pensionkitesign()
 
    this.pensionSummary()

    this.getEssPsnSummaryReport()
  }


 
countInrpcoessZonal(){
 return (this.dashboarData?.pendingZoneApprvr ? Number(this.dashboarData?.pendingZoneApprvr) : 0) + (this.dashboarData?.pendingAaozone ? Number(this.dashboarData?.pendingAaozone) : 0) + (this.dashboarData?.pendingAuditorZone ? Number(this.dashboarData?.pendingAuditorZone) : 0)
}
 
  getStatusAtPensionZonalOffice(){
    let payload = {
      "inMonth"  :this.pensionMonth,
      "inYear"   : this.pensionYear,
      "flag"     :   "1",
      "isRole"   :  Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
      "officeId" :  Number(this.zoneFlag) ? this.zoneFlag : this.userdetails.officeid,
      "deptId"  :  this.departmentId ? this.departmentId  : 0,
      "isDate": this.isDate
  }

  // getStatusAtPensionZonalOffice
  

    this.dashboardService.getStatusAtPensionZonalOffice('getNewPsnSummaryReport',payload).subscribe({
      next:(res:any)=>{
      
        this.pensionZonalOfficeData = res?.data
        this.completedRequests++;
        this.checkAllRequestsCompleted() 
      },
      error:(err:any)=>{
        this.completedRequests++;
        this.checkAllRequestsCompleted()
      },
      complete: ()=>{     
        // this.loader.hide()  
      }
    })
  
  }

  /**
   * @param pensionApplicationData as Pension-ESS Status data
   * @returns notIntiated value
   */
  calculateNinitiatedPension(pensionApplicationData:any){
    let notIntiated = (Number(pensionApplicationData.totalEmp) - (Number(pensionApplicationData.pending) + Number(pensionApplicationData.submitted)))
    return notIntiated
  }



  /**
   * This method get Pension-ESS Status 
   */
  getPensionApplicationStatus(){
    let payload = {
    "inMonth"    :this.pensionMonth,     
    "inYear"     :this.pensionYear,
    "flag"       :"1",
    "isRole"     :Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
    "officeId"   :Number(this.zoneFlag) ? this.zoneFlag : this.userdetails.officeid,
    "deptId"  :  this.departmentId ? this.departmentId  : 0,
    "isDate" : this.isDate
}

// getPensionApplicationStatus
  this.dashboardService.postemploye('getNewEmpEssSummaryReport',payload).subscribe({
    next:(res:any)=>{
      this.pensionApplicationData = res?.data
     
      this.completedRequests++;
      this.checkAllRequestsCompleted()
    },
    error:(err:any)=>{
      this.completedRequests++;
      this.checkAllRequestsCompleted()
    },
    complete: ()=>{
    }
  })
  }


  

  /**
   * This method get total pension kit
   */
  countGpoCpoPpo(){
   
    let payload = {
      "inMonth" : this.pensionMonth,
      "inYear"  : this.pensionYear,
      "flag"    : "1",
      "isRole"  :  Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) : this.userdetails.roleid ,
      "officeId":  Number(this.zoneFlag) ?  this.zoneFlag :  this.userdetails.officeid,
      "deptId"  :  this.departmentId ? this.departmentId  : 0,
      "isDate" : this.isDate
  }
    this.dashboardService.countGpoCpoPpo('countGpoCpoPpo',payload).subscribe({
      next:(res:any)=>{

        if( res && res.status == 'SUCCESS'){
          if(res?.data){
          let resdata= JSON.parse(res?.data)
          if(resdata && resdata[0]?.totalPsnKit){
          this.totalPensionKit= resdata;
          }else {
            this.totalPensionKit =[]
            }
          }
        }
        this.completedRequests++;
        this.checkAllRequestsCompleted()
      },
      error:(err:any)=>{
        this.completedRequests++;
        this.checkAllRequestsCompleted()
      },
      complete: ()=>{
     
      }
    })
  }


/**
 * This method used for get cpo gpo ppo count
 */
  countGpoCpoPpo2(){
    let payload = {
      "inMonth" : this.pensionMonth,
      "inYear"  : this.pensionYear,
      "flag"    : "2",
      "isRole"  :  Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5??"" : 98??"") : this.userdetails.roleid??"" ,
      "officeId":  Number(this.zoneFlag) ?  Number(this.zoneFlag)??"" :  this.userdetails.officeid??"",
      "deptId"     :this.departmentId ? this.departmentId  : 0,
      "isDate": this.isDate
  }
    this.dashboardService.countGpoCpoPpo('countGpoCpoPpo',payload).subscribe({
      next:(res:any)=>{
        
        if(res && res.status == 'SUCCESS'){
          if(res?.data){
          let resdata= JSON.parse(res?.data)
          this.countGpoCpoPpoData =resdata;
    
          }else {
            this.countGpoCpoPpoData= []
          }
     
        }
        this.completedRequests++;
        this.checkAllRequestsCompleted()
      },
      error:(err:any)=>{
        this.completedRequests++;
        this.checkAllRequestsCompleted()
      },
      complete: ()=>{
     
      }
    })
  }


  //

  Inprocess(){
    return  (this.dashboarData?.pendingZoneApprvr  ? Number(this.dashboarData?.pendingZoneApprvr)  : 0) +  (this.dashboarData?.pendingAtHo ? Number(this.dashboarData?.pendingAtHo) : 0) + (this.dashboarData?.pendingAuditorZone ? Number(this.dashboarData?.pendingAuditorZone) : 0) + (this.dashboarData?.pendingAaozone ? Number(this.dashboarData?.pendingAaozone) :0)
  }

 

  notInitiatedHo(){
    return ( this.pensionApplicationData && this.pensionApplicationData?.approved ? this.pensionApplicationData?.approved : 0) - ((this.pensionZonalOfficeData?.pendingAtHo ? this.pensionZonalOfficeData?.pendingAtHo : 0) + (this.pensionZonalOfficeData?.objectionCases ? this.pensionZonalOfficeData?.objectionCases : 0) + (this.pensionZonalOfficeData?.epsnSetGnerated  ? this.pensionZonalOfficeData?.epsnSetGnerated  : 0))
  }
 
  pensionkitesign(){
    let payload = {
      "inMonth" : this.pensionMonth,
      "inYear"  : this.pensionYear,
      "flag"    : "8",
      "isRole"  :  Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5??"" : 98??"") : this.userdetails.roleid??"" ,
      "officeId":  Number(this.zoneFlag) ?  Number(this.zoneFlag)??"" :  this.userdetails.officeid??"",
      "deptId"     :this.departmentId ? this.departmentId  : 0,
      "isDate" : this.isDate
  }
    this.dashboardService.countGpoCpoPpo('countGpoCpoPpo',payload).subscribe({
      next:(res:any)=>{
        
        if( res && res.status == 'SUCCESS'){
          if(res?.data){
          let resdata= JSON.parse(res?.data)
          if(resdata && resdata[0]?.totalPsnKit){
          this.totalPensionKitesign= resdata;
          }else {
            this.totalPensionKitesign =[]
            }
          }
        
     
        }
        this.completedRequests++;
        this.checkAllRequestsCompleted()
      },
      error:(err:any)=>{
        this.completedRequests++;
        this.checkAllRequestsCompleted()
      },
      complete: ()=>{
     
      }
    })
  }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }


  reviceParams(data:any){
    this.paramsDeptOffc.dept_id = data.dept_id;
    this.paramsDeptOffc.offc_id = data.offc_id;


  }
  totalRetirementsrecive(data:any){
    this.total_retirement = data?.total_Retirement
   
  }


  reviceParamsfilter(data:any){
    console.log(data);
    this.pensionMonth    = data?.month
    this.pensionYear     = data?.year
    this.zoneFlag        = data?.zone
    this.selectedZone     = data?.selectedZone
    this.psnMonthYearDataList = data.psnMonthYearList;
    this.departmentName = data?.departmentControl?.v_dept_name ? data.departmentControl.v_dept_name : "";
    this.departmentId = data?.departmentControl?.v_DEPT_ID ? data.departmentControl.v_DEPT_ID : "";
    this.officeName = data?.officeControl?.officName ? data.officeControl.officName : "";
    this.officeId = data?.officeControl?.offcId ? data.officeControl.offcId : "";
    if(data?.officeID){
      this.office_id_selection_flag = true
    }else {
      this.office_id_selection_flag = false
    }
    this.isDate = data.isDate;

    this.loader.show()
    this.countGpoCpoPpo()
    this.countGpoCpoPpo2()
    this.getPensionApplicationStatus()
    this.getStatusAtPensionZonalOffice()
    this.getbillcount('1')
    this.getbillcount('3')
    this.getbillcountPayment()
    this.upcomingRetireMentDetailsByMonthWise()
    this.pensionkitesign()

    this.getEssPsnSummaryReport()
    this.pensionSummary()
  }
  

  getbillcount(reportType:any){
    let payload = {
      "inMonth"     :this.pensionMonth,
      "inYear"      :this.pensionYear,
      "reportType"  :reportType,
      "isRole"      :Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
      "officeId"    :Number(this.zoneFlag) ? this.zoneFlag : this.userdetails.officeid,
      "deptId"      :this.departmentId ? this.departmentId  : 0,
      "isDate" : this.isDate
    }
  this.dashboardService.postPension('getbillcount',payload).subscribe({
    next:(res:any)=>{
    
      if(reportType == '1'){
        this.bills_CPO_GPO_Data = res?.data;
      }

      if(reportType == '3'){
        this.pendingBills = res?.data[0]?.pendingBills;
      }

      this.completedRequests++;
      this.checkAllRequestsCompleted()
      
    },
    error:(err:any)=>{
      this.completedRequests++;
      this.checkAllRequestsCompleted()
    },
    complete: ()=>{   
      
    }
  })
  }

 

  getbillcountPayment (){
    let payload = {
      "inMonth"   :this.pensionMonth,
      "inYear"    : this.pensionYear,
      "reportType": "2",
      "isRole"    : Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
      "officeId"  : Number(this.zoneFlag) ? this.zoneFlag : this.userdetails.officeid,
      "deptId"     :this.departmentId ? this.departmentId  : 0,
      "isDate" : this.isDate
    }
  this.dashboardService.postPension('getbillcount',payload).subscribe({
    next:(res:any)=>{
      this.payment_CPO_GPO_Data = res?.data
      this.completedRequests++;
      this.checkAllRequestsCompleted()
    },
    error:(err:any)=>{
      this.completedRequests++;
      this.checkAllRequestsCompleted()
    },
    complete: ()=>{
      
    }
  })
  }

  //  applyFilter(data: any){
  //   this.pensionMonth = data?.month
  //   this.pensionYear  = data?.year
  //   this.zoneFlag     = data?.zone
  //   this.selectedZone     = data?.zone
  //   this.psnMonthYearDataList = data?.psnMonthYearList;
  //   this.departmentName = "";
  //   this.departmentId = "";
  //   this.officeName = "";
  //   this.officeId =  "";
   

  //   this.loader.show()
  //    this.countGpoCpoPpo()
  //    this.countGpoCpoPpo2()
  //    this.getPensionApplicationStatus()
  //   //  this.getStatusAtPensionZonalHoo()
  //    this.getStatusAtPensionZonalOffice()
  //    this.getbillcount()
  //    this.getbillcountPayment()
  //   //  this.detailReport()
  //    this.upcomingRetireMentDetailsByMonthWise()
     
  // }





  /**
   * upcomingRetireMentDetailsByMonthWise this service get upcoming retirment month and total employee retire in month
   */
  upcomingRetireMentDetailsByMonthWise(){
    let payload =  {
        "reportType" :"1",
        "inYear"     :this.pensionYear,
        "inMonth"    :this.pensionMonth,
        "isRole"     :Number(this.zoneFlag )?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
        "officeId"   :Number(this.zoneFlag) ? this.zoneFlag : this.userdetails.officeid,
        "deptId"     :this.departmentId ? this.departmentId  : 0,
        "isDate" : this.isDate
        
      
    }
      this.dashboardService.upcomingRetireMentDetailsByMonthWise('upcomingRetireMentDetailsByMonthWise',payload).subscribe({
        next:(res:any)=>{
         this.upcomingRetirementData = []
         this.total_retirement = 0
          this.upcomingRetirementData = res?.data 
            if(this.upcomingRetirementData?.length)
                    this.upcomingRetirementData=  this.upcomingRetirementData.sort(function(a:any,b:any){
                    return Number(a?.serialNo) - Number(b.serialNo);
                    })            
              if(this.upcomingRetirementData?.length){
                this.total_retirement = this.upcomingRetirementData[0]?.totalEmp
              } 
              this.completedRequests++;
              this.checkAllRequestsCompleted()
        },
        error:(err:any)=>{
          this.completedRequests++;
          this.checkAllRequestsCompleted()
        },
        complete: ()=>{
      
        }
      })
    }




    detailReport(flag:number,name?:any){
      let payload = {
        "inMonth" : this.pensionMonth,
        "inYear"  : this.pensionYear,
        "flag"    : flag,
        "isRole"  : Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) : this.userdetails.roleid ,
        "officeId": Number(this.zoneFlag) ?  this.zoneFlag :  this.userdetails.officeid,
        "deptId"  :  this.departmentId ? this.departmentId  : 0,
        "isDate" : this.isDate
    }
    
    // countGpoCpoPpo
      this.dashboardService.countGpoCpoPpo('getNewPsnDetailsSummaryReport',payload).subscribe({
        next:(res:any)=>{
          let data 
          if(res?.data){
          data = res?.data
          for(let eachDataIndex in data) {
            data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
          
          }
         
        }

         

        console.log(data, "test data as")  
             const dialogRef = this.dialog.open(DashDialogComponent, {
             data: {
                 data: data,
                 flag : flag,
                 detail: 'pss',
                 reportName: name
             },
             });
  
        },
        error:(err:any)=>{
  
        },
        complete: ()=>{
        
        }
      })
    }


    detailPensionessReport(flag:number,title?:any){
      
      let payload = {
        "inMonth" : this.pensionMonth,
        "inYear"  : this.pensionYear,
        "flag"    : flag,
        "isRole"  : Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) : this.userdetails.roleid ,
        "officeId": Number(this.zoneFlag) ?  this.zoneFlag :  this.userdetails.officeid,
        "deptId"  :  this.departmentId ? this.departmentId  : 0,
        "isDate" : this.isDate
    }
    
    // countGpoCpoPpo
    

      this.dashboardService.postemploye('getNewEmpEssDetailsSummaryReport',payload).subscribe({
        next:(res:any)=>{
          let data 
          if(res?.data){
          data = res?.data
        
          for(let eachDataIndex in data) {
            data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
          
          }  
        }
             const dialogRef = this.dialog.open(DashDialogComponent, {
             data: {
                 data: data,
                 flag : flag,
                 detail: 'ess',
                 reportName : title
             },
             });
  
        },
        error:(err:any)=>{
  
        },
        complete: ()=>{
        
        }
      })
    }

    public routerFunction(pensionMonth: any, pensionYear: any, zoneFlag: any,office_id_selection_flag: any, reportType: string, url: string, isDate?: any){
      // this.router.navigate(["/pension/upcomingPensions", {month: this.pensionMonth, year:this.pensionYear, zone: this.zoneFlag, office_id_selection_flag: this.office_id_selection_flag, isNavigate:true}])
      if(reportType === 'Commutation Request' ||  reportType === "Total Retirement" || reportType === "Pension-ESS Status" || reportType === "e-Pension Status at HO" || reportType === "e-Pension Status at Zonal" || reportType === "Number of Bills Generate, CPO, GPO") {
        const data = {month: this.pensionMonth, year: this.pensionYear, zone: this.zoneFlag, selectedZone: this.selectedZone, office_id_selection_flag: this.office_id_selection_flag, isNavigate:true, deptName: this.departmentName, deptId: this.departmentId, offcName: this.officeName, offcId: this.officeId, isDate: this.isDate}
        this.router.navigate([url],{state: data })
      }
      if(reportType === "Upcoming Retirements") {
        const monthYear = pensionMonth.split("-");
        const selectedMonth = monthYear[0].trim();
        const month = this.convertToTitleCase(selectedMonth);
        const year = monthYear[1].trim();
     
        const selectedMonthObj =  this.psnMonthYearDataList.find((eachMonthObj: any) => eachMonthObj.psnMonth.trim() === month && eachMonthObj.psnYear.trim() === year)
       
        const data = {month: selectedMonthObj.psnMonthNumber, year: selectedMonthObj.psnYear, zone: zoneFlag, selectedZone: this.selectedZone,  office_id_selection_flag: office_id_selection_flag, isNavigate:true,  deptName: this.departmentName, deptId: this.departmentId,  offcName: this.officeName, offcId: this.officeId, isDate: isDate}
        this.router.navigate([url], {state: data})
      }

      // if(type === "Pension-ESS Status") {
      //   const data = {month: this.pensionMonth, year: this.pensionYear, zone: this.zoneFlag, selectedZone: this.selectedZone, office_id_selection_flag: this.office_id_selection_flag, isNavigate:true, deptName: this.departmentName, deptId: this.departmentId, offcName: this.officeName, offcId: this.officeId}
      //   this.router.navigate(["/pension/upcomingPensions"],{state: data })
      // }
   
    }

    public convertToTitleCase(input: string) {
      return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    }
    
    getMontData(data:any){
      console.log(data);
      this.psnMonthYearDataList = data?.monthlist
    
    }

    /**
     * This method used for check all api is completed or not 
     */
    checkAllRequestsCompleted() {
      // console.log(this.completedRequests, "c")
      if (this.completedRequests === 8) {
        this.completedRequests = 0
          this.loader.hide()

          
      }
    }




    detailReportcpogpo(flag:number,name?:any){
      let payload = {
        "inMonth" : this.pensionMonth,
        "inYear"  : this.pensionYear,
        "flag"    : flag,
        "isRole"  : Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) : this.userdetails.roleid ,
        "officeId": Number(this.zoneFlag) ?  this.zoneFlag :  this.userdetails.officeid,
        "deptId"  :  this.departmentId ? this.departmentId  : 0,
        "isDate" : this.isDate
    }
    
    // countGpoCpoPpo
      this.dashboardService.countGpoCpoPpo('countGpoCpoPpo',payload).subscribe({
        next:(res:any)=>{
          let data 
          if(res?.data){
          data =  JSON.parse (res?.data)

     
          for(let eachDataIndex in data) {
            data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
          
          }  
        }
             const dialogRef = this.dialog.open(DashDialogComponent, {
             data: {
                 data: data,
                 flag : flag,
                 detail: 'cpogpo',
                 reportName: name
             },
             });
  
        },
        error:(err:any)=>{
  
        },
        complete: ()=>{
        
        }
      })
    }





    resultArray:any
    InprocessDetail(){
    
      const flagValues = [6, 9, 10,11];
      const apiObservables = flagValues.map((flag) => {
        return this.NoTInitiatedDetailnew(flag);
      });
  
      forkJoin(apiObservables).subscribe((results: any[]) => {
        this.resultArray = results;
        const mergedDataArray = this.resultArray.map((item:any) => item?.data).reduce((acc:any, val:any) => acc.concat(val), []);
       
        if(mergedDataArray)
        for(let eachDataIndex in mergedDataArray) {
          mergedDataArray[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
        
        }  

        const dialogRef = this.dialog.open(DashDialogComponent, {
          data: {
              data: mergedDataArray,
              flag : 10,
              detail: 'pss',
              reportName: "In-Process"
          },
          });
      });
    }


    NoTInitiatedDetail(flag:number){
      let payload = {
        "inMonth" : this.pensionMonth,
        "inYear"  : this.pensionYear,
        "flag"    : flag,
        "isRole"  : Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) : this.userdetails.roleid ,
        "officeId": Number(this.zoneFlag) ?  this.zoneFlag :  this.userdetails.officeid,
        "deptId"  :  this.departmentId ? this.departmentId  : 0,
        "isDate" : this.isDate
    }
    return this.dashboardService.countGpoCpoPpo('getNewPsnDetailsSummaryReport', payload);

    }



    NoTInitiatedDetailnew(flag:number){
      let payload = {
        "inMonth" : this.pensionMonth,
        "inYear"  : this.pensionYear,
        "flag"    : flag,
        "isRole"  : Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) : this.userdetails.roleid ,
        "officeId": Number(this.zoneFlag) ?  this.zoneFlag :  this.userdetails.officeid,
        "deptId"  :  this.departmentId ? this.departmentId  : 0,
        "isDate" : this.isDate
    }
    return this.dashboardService.postPension('getEssPsnDetailsReport', payload);

    }

    getCPOValue(data:any) {
      if (data) {
        const cpoData = data.find((item:any) => item?.billname === 'CPO');
        return cpoData ? cpoData?.totalBills : 0;
      }
      return 0;
    }

    getCPOBillError(data:any) {
      if (data) {
        const cpoData = data.find((item:any) => item?.billname === 'CPO');
        return cpoData ? cpoData?.errorBills : 0;
      }
      return 0;
    }

    getCPOStoppedError(data:any) {
      if (data) {
        const cpoData = data.find((item:any) => item?.billname === 'CPO');
        return cpoData ? cpoData?.stoppedBills : 0;
      }
      return 0;
    }
    
    getGPOValue(data:any) {
      if (data) {
        const gpoData = data.find((item:any) => item?.billname === 'GPO');
        return gpoData ? gpoData?.totalBills : 0;
      }
      return 0;
    }

    getGPOBillError(data:any) {
      if (data) {
        const gpoData = data.find((item:any) => item?.billname === 'GPO');
        return gpoData ? gpoData?.errorBills : 0;
      }
      return 0;
    }

    getGPOStoppedError(data:any) {
      if (data) {
        const gpoData = data.find((item:any) => item?.billname === 'GPO');
        return gpoData ? gpoData?.stoppedBills : 0;
      }
      return 0;
    }


    NoTInitiatedDetailHo(flag:number){
      let payload = {
        "inMonth" : this.pensionMonth,
        "inYear"  : this.pensionYear,
        "flag"    : flag,
        "isRole"  : Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) : this.userdetails.roleid ,
        "officeId": Number(this.zoneFlag) ?  this.zoneFlag :  this.userdetails.officeid,
        "deptId"  :  this.departmentId ? this.departmentId  : 0,
        "isDate" : this.isDate
    }
    return  this.dashboardService.postemploye('getNewEmpEssDetailsSummaryReport',payload)
    }




    zoneOfficeList : any
    zoneOfficeWisePendancyReport(flag:any, clolumnName?:any) {
    let data = {
       "isRole":  Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
      "officeId":  Number(this.zoneFlag)? this.zoneFlag : this.userdetails.officeid,
      'inYear':   this.pensionYear,
      'inMonth':   this.pensionMonth,
      // "deptId"     :this.departmentId ? this.departmentId  : 0,
      "flag":flag,
      "isDate" : this.isDate
    }
        this.dashboardService.getUpcomPsnReport('getNewPsnSummaryReportZoneWise', data).subscribe({
        next: (res:any) => {
          let data:any[]=[];
        if(res && res.status == 'SUCCESS' && res.data){
          if(this.userdetails.roleid == 99){
         const zoneArray = [{zoneName: "Jaipur", zoneId: "904"},
         {zoneName: "Ajmer", zoneId: "905"},{zoneName: "Jodhpur", zoneId: "906"},
         {zoneName: "Kota", zoneId: "909"},{zoneName: "Udaipur", zoneId: "907"},
         {zoneName: "Bikaner", zoneId: "908"},{zoneName: "Bharatpur", zoneId: "31239"}]
    for(const eachZone of zoneArray) {
      const zoneData = res.data.find((eachZoneObj: any) => (eachZoneObj?.zoneName ? eachZoneObj?.zoneName?.toLowerCase(): eachZoneObj?.zoneName) == (eachZone?.zoneName?.toLocaleLowerCase()))
          if(!zoneData) {
        const eachZoneObject: any = {}
        eachZoneObject["approvedZonal"]= "0";
        eachZoneObject["pendingAuditorZonal"] = "0";
        eachZoneObject["pendingHodApprover"] = "0";
        eachZoneObject["pendingHodChecker"] = "0";
        eachZoneObject["pendingHodMaker"] = "0";
        eachZoneObject["pendingzoneApprover"] = "0";
        eachZoneObject["rejectedHodApprover"] = "0";
        eachZoneObject["zoneId"] = eachZone.zoneId;
        eachZoneObject["zoneName"] = eachZone.zoneName;
        res.data.push(eachZoneObject)
        }
      }
    }
            data = res.data

            for(let eachDataIndex in data) {
              data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
            
            }

            const dialogRef = this.dialog.open(DashDialogComponent, {
              data: {
                  data: data,
                  flag : 2,
                  detail: 'zoneDetail',
                  columnName:clolumnName
              },
              });


        } else {
          data = [];
        }
      },
        error: (err) => {
        }, complete: ()=> {
        }
      })
    }





    billsCpoGpoDetail(flag:number, title?:any, type?:any){
      
      let payload = {
        "inMonth" : this.pensionMonth,
        "inYear"  : this.pensionYear,
        "flag"    : flag,
        "isRole"  : Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) : this.userdetails.roleid ,
        "officeId": Number(this.zoneFlag) ?  this.zoneFlag :  this.userdetails.officeid,
        "deptId"  :  this.departmentId ? this.departmentId  : 0,
        "isDate" : this.isDate
    }
    
    // countGpoCpoPpo
    


      this.dashboardService.postPension('getCpoGpoDetailsReport',payload).subscribe({
        next:(res:any)=>{
          let data 
          if(res?.data){
          data = res?.data;
         
            for(let eachDataIndex in data) {
              data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
            }
             const dialogRef = this.dialog.open(DashDialogComponent, {
             data: {
                 data: data,
                 flag : flag,
                 detail: 'cpogpodetail',
                 reportName  : title,
                 type: type
             },
             });
            }
  
        },
        error:(err:any)=>{
  
        },
        complete: ()=>{
        
        }
      })
    }

  NotInitatedHod(){
      const flagValues = [1, 2, 3];
      const apiObservables = flagValues.map((flag) => {
        return this.NoTInitiatedDetail(flag);
      });
      forkJoin(apiObservables).subscribe((results: any[]) => {
        this.resultArray = results;
        const mergedDataArray = this.resultArray.map((item:any) => item?.data).reduce((acc:any, val:any) => acc.concat(val), []);
         this.NoTInitiatedDetailHo(4).subscribe(res=>{
        const empIdsToRemove = res.data.map((item:any) => item?.empId);
         const filteredArray1 = mergedDataArray.filter((item1:any) => {
          return !empIdsToRemove.includes(item1.empId);

});
const dialogRef = this.dialog.open(DashDialogComponent, {
  data: {
      data: filteredArray1,
      flag : 10,
      detail: 'pss'
  },
  });
         })
        
      });
    }

    updatePsnDataReport (){
      this.dashboardService.postPension('updatePsnDataReport',{}).subscribe({
        next:(res:any)=>{
        }
      })
      }
    
      updateEmpReport (){
        this.dashboardService.postemploye('updateEmpReport',{}).subscribe({
          next:(res:any)=>{
          }
        })
        }






       
    
    
    
        resultArrayNoinited:any
      NotInitateDetail(){
          const flagValues = [1, 2, 3];
          const apiObservables = flagValues.map((flag) => {
            return this.NoTInitiatedDetail(flag);
          });
          forkJoin(apiObservables).subscribe((results: any[]) => {
            this.resultArrayNoinited = results;
            const mergedDataArray = this.resultArrayNoinited.map((item:any) => item?.data).reduce((acc:any, val:any) => acc.concat(val), []);
             this.NoTInitiatedDetailHo(4).subscribe(res=>{
              
            const empIdsToRemove = res?.data.map((item:any) => item?.empId);
             const filteredArray1 = mergedDataArray.filter((item1:any) => {
              return !empIdsToRemove.includes(item1.empId);
    
    }
    );
    
    this.NoTInitiatedDetailHo(2).subscribe((res:any)=>{
 
      let merged
      if(res?.data)
      
     merged=   filteredArray1.concat(res?.data)
 
      // const dialogRef = this.dialog.open(DashDialogComponent, {
      //   data: {
      //       data: merged,
      //       flag : 10,
      //       detail: 'pss'
      //   },
      //   });
    })
   
             })
            
          });
        }


        zoneOfficeWisePendancyReport1(flag:any, clolumnName?:any) {
          
          let data = {
             "isRole":  Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
            "officeId":  Number(this.zoneFlag)? this.zoneFlag : this.userdetails.officeid,
            'inYear':   this.pensionYear,
            'inMonth':   this.pensionMonth,
            "flag":flag,
            "isDate": this.isDate
          }
              this.dashboardService.getUpcomPsnReport('countGpoCpoPpo', data).subscribe({
              next: (res:any) => {
                let data:any[]=[];
              if(res && res.status == 'SUCCESS'){
                
                if (res && res?.data) {
                 
                  res.data = JSON.parse(res?.data);
                }
                let defaultData = []
                if(this.userdetails.roleid == 99){
                 
               const zoneArray = [{zoneName: "Jaipur", zoneid: "904"},
               {zoneName: "Ajmer", zoneid: "905"},{zoneName: "Jodhpur", zoneid: "906"},
               {zoneName: "Kota", zoneid: "909"},{zoneName: "Udaipur", zoneid: "907"},
               {zoneName: "Bikaner", zoneid: "908"},{zoneName: "Bharatpur", zoneid: "31239"}]
          for(const eachZone of zoneArray) {
            const zoneData = res?.data && res?.data.find((eachZoneObj: any) => (eachZoneObj?.zoneName ? eachZoneObj?.zoneName?.toLowerCase(): eachZoneObj?.zoneName) == (eachZone?.zoneName?.toLocaleLowerCase()))
                if(!zoneData) {
              const eachZoneObject: any = {}
              eachZoneObject["approvedZonal"]= "0";
              eachZoneObject["pendingAuditorZonal"] = "0";
              eachZoneObject["pendingHodApprover"] = "0";
              eachZoneObject["pendingHodChecker"] = "0";
              eachZoneObject["pendingHodMaker"] = "0";
              eachZoneObject["pendingzoneApprover"] = "0";
              eachZoneObject["rejectedHodApprover"] = "0";
              eachZoneObject["zoneId"] = eachZone.zoneid;
              eachZoneObject["zoneName"] = eachZone.zoneName;
             res?.data && res.data.push(eachZoneObject)
                  defaultData.push(eachZoneObject)
              }
            }
          }
                  data = res.data ? res.data :  defaultData
                  const dialogRef = this.dialog.open(DashDialogComponent, {
                    data: {
                        data: data,
                        flag : 2,
                        detail: 'zoneDetail1',
                        columnName:clolumnName
                    },
                    });
      
      
              } else {
                data = [];
              }
            },
              error: (err) => {
              }, complete: ()=> {
              }
            })
          }





          commutationRequestTotal: any;
          pensionSummary()
          {
          let data = { 
            "inType":"1",
            "isRole"    :    Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
            "officeId"  :  Number(this.zoneFlag) ? this.zoneFlag : this.userdetails.officeid,
            'inYear'    :this.pensionYear,
            'inMonth'   :this.pensionMonth,
            "deptId"     :this.departmentId ? this.departmentId  : 0,
            "isDate" : this.isDate
          }
          this.dashboardService.postPension("getRevisedCommutationReport",data).subscribe({
              next: (res:any) => {
                    if(res && res?.data) { 
                      this.commutationRequestTotal = res?.data[0]?.total
                    } 
                    else {
                      this.commutationRequestTotal = 0
                    }
                
              },
              error: (err) => {
              
              
              }, complete: ()=> {
               
              }
            })
          }




 dashboarData : any;
  getEssPsnSummaryReport(){
    let payload = {
      "inMonth" : this.pensionMonth,
      "inYear"  : this.pensionYear,
      "flag"    : "1",
      "isRole"  :  Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5??"" : 98??"") : this.userdetails.roleid??"" ,
      "officeId":  Number(this.zoneFlag) ?  Number(this.zoneFlag)??"" :  this.userdetails.officeid??"",
      "deptId"     :this.departmentId ? this.departmentId  : 0,
      "isDate" : this.isDate
  }
    this.dashboardService.postPension('getEssPsnSummaryReport',payload).subscribe({
      next:(res:any)=>{
        
        if(res && res.status == 'SUCCESS'){
          if(res?.data){
          
          this.dashboarData =res?.data[0];
          console.log(this.dashboarData, "dashboard data")
    
          }else {
            this.dashboarData= []
          }
     
        }
       
      },
      error:(err:any)=>{
       
      },
      complete: ()=>{
     
      }
    })
  }

  getEssPsnDetailsReport(flag:any,name?:any,detail?:any){
    let payload = {
      "inMonth" : this.pensionMonth,
      "inYear"  : this.pensionYear,
      "flag"    :  flag,
      "isRole"  :  Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5??"" : 98??"") : this.userdetails.roleid??"" ,
      "officeId":  Number(this.zoneFlag) ?  Number(this.zoneFlag)??"" :  this.userdetails.officeid??"",
      "deptId"     :this.departmentId ? this.departmentId  : 0,
      "isDate" : this.isDate
  }
    this.dashboardService.postPension('getEssPsnDetailsReport',payload).subscribe({
      next:(res:any)=>{
        
        if(res && res.status == 'SUCCESS'){
          if(res?.data){
          
          // this.dashboarData =res?.data[0];
          // console.log(this.dashboarData, "dashboard data")
            let data:any;


          if(res?.data){
            data = res?.data
          
            for(let eachDataIndex in data) {
              data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
            
            }  
          }
               const dialogRef = this.dialog.open(DashDialogComponent, {
               data: {
                   data: data,
                   flag : flag,
                   detail: detail,
                   reportName : name
               },
               });
    
          }else {
            this.dashboarData= []
          }
     
        }
       
      },
      error:(err:any)=>{
       
      },
      complete: ()=>{
     
      }
    })
  }




  zoneInprocessObjection(flag:any,clolumnName:any) {
  
  let data = {
    
    "inMonth" : this.pensionMonth,
    "inYear"  : this.pensionYear,
    "flag"    :  "5",
    "isRole"  :  Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5??"" : 98??"") : this.userdetails.roleid??"" ,
    "officeId":  Number(this.zoneFlag) ?  Number(this.zoneFlag)??"" :  this.userdetails.officeid??"",
    "isDate" : this.isDate
 
  
  }
  this.loader.show();
      this.dashboardService.getUpcomPsnReport('getNewPsnSummaryReportZoneWise', data).subscribe({
      next: (res:any) => {
        let data:any[]=[];
        if(res && res.status == 'SUCCESS' && res.data){
          if(this.userdetails.roleid == 99){
         const zoneArray = [{zoneName: "Jaipur", zoneId: "904"},
         {zoneName: "Ajmer", zoneId: "905"},{zoneName: "Jodhpur", zoneId: "906"},
         {zoneName: "Kota", zoneId: "909"},{zoneName: "Udaipur", zoneId: "907"},
         {zoneName: "Bikaner", zoneId: "908"},{zoneName: "Bharatpur", zoneId: "31239"}]
    for(const eachZone of zoneArray) {
      const zoneData = res.data.find((eachZoneObj: any) => (eachZoneObj?.zoneName ? eachZoneObj?.zoneName?.toLowerCase(): eachZoneObj?.zoneName) == (eachZone?.zoneName?.toLocaleLowerCase()))
          if(!zoneData) {
        const eachZoneObject: any = {}
        eachZoneObject["approvedZonal"]= "0";
        eachZoneObject["pendingAuditorZonal"] = "0";
        eachZoneObject["pendingHodApprover"] = "0";
        eachZoneObject["pendingHodChecker"] = "0";
        eachZoneObject["pendingHodMaker"] = "0";
        eachZoneObject["pendingzoneApprover"] = "0";
        eachZoneObject["rejectedHodApprover"] = "0";
        eachZoneObject["zoneId"] = eachZone.zoneId;
        eachZoneObject["zoneName"] = eachZone.zoneName;
        res.data.push(eachZoneObject)
        }
      }
    }
            data = res.data

            for(let eachDataIndex in data) {
              data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
            
            }

            const dialogRef = this.dialog.open(DashDialogComponent, {
              data: {
                  data: data,
                  flag : 2,
                  detail: 'zoneDetail',
                  columnName:clolumnName
              },
              });


        } else {
          data = [];
        }
  
    },
      error: (err) => {
        this.loader.hide();
    
      
      }, complete: ()=> {
        this.loader.hide()
      }
    })
  }
  
}



