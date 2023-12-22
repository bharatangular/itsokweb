import { Component, ElementRef, OnInit, ViewChild ,AfterViewInit, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';

import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import * as CryptoJS from 'crypto-js';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { CommonService } from 'src/app/services/common.service';
import { CommonDialogForReportsComponent } from '../common-dialog-for-reports/common-dialog-for-reports.component';
import { DashDialogComponent } from './../../../pension/dashboard/dash-dialog/dash-dialog.component';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-revised-commutation-report',
  templateUrl: './revised-commutation-report.component.html',
  styleUrls: ['./revised-commutation-report.component.scss']
})
export class RevisedCommutationReportComponent implements OnInit {


  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = [
    'sNo',

    'total',
    'pendingAtHoApprover',
    'rejectedByHoApprover',
    'pendingAtZonalApprover',
    'zonalApproverRevertToHoApprover',
    
    'approvedByZonalApprover',
 
    
    ];

    // "approvedByZonalApprover": "0",
    // "total": "1",
    // "rejectedByHoApprover": "0",
    // "pendingAtHoApprover": "0",
    // "pendingAtZonalApprover": "1",
    // "zonalApproverRevertToHoApprover": "0"
    displayedColumnsForRoleWiseReport: string[] = [
      "sNo",
      'pendingCurrAssignment',
      'pendingSso',
      // 'requestId',
      // 'employeeId',
      // 'tempId',
      'pendingAtname',
      'employeeCode',
      'status'
    ];
  dataSource!: MatTableDataSource<any>;
  dataSourceForRoleWiseReport!: MatTableDataSource<any>;
  @ViewChild('content', { static: false }) el!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selected = '';
  datalist: any = [];
  countDetail: any;
  inboxData: any = [];

  showerror: boolean = false;
  error: string = '';
  empinfo: any;
  isShow=false;

  encryptMode: boolean= false;
  textToConvert: any;
  password: any;
  conversionOutput: any;
  userdetails:any;
  config:AppConfig=new AppConfig()
  // pensionerList:any[] = [];
  pensionerRoleWiseList:any[] = [];
  roleWiseReportName: string = "";
  zoneFlag: any;
  office_id_selection_flag?: boolean;
  isNavigate: boolean;
  departmentId :any;
  isDate: any = 0;

  pensionSummaryData:any;
  filterDetails: { month: any; year: any; zone: any; deptName: any; deptId: any; officeName: any; officeId: any; selectedZone: any; };
  constructor(
    public dialog: MatDialog, 
    private _Service: PensionServiceService, 
    private modalService: NgbModal,
    private _snackBar: MatSnackBar,  
    private route: ActivatedRoute,
    private router:Router,
    private load:LoaderService,
    private commonService: CommonService,
    private tokenInfo:TokenManagementService) 
    { 
       this.encryptMode = true;
    }
    public reportYear:any;
    public reportmonth:any;
    public psnmonth:any[]=[];
    public psnYear:any[]=[];

   
  ngOnInit(): void {

    this.empinfo=this.tokenInfo.empinfoService;
    this.userdetails=this.config.getUserDetails();



    this.route.paramMap.subscribe(params => {
      const passedData = window.history.state; 
      console.log(passedData)
      if(passedData && passedData.isNavigate) {
      this.isNavigate = true;
        const year = passedData.year;
        const month = passedData.month;
        this.office_id_selection_flag= passedData.office_id_selection_flag === "true" ? true : false;
        const zone = passedData.zone ?passedData.zone : 0;
        const  selectedZone  = passedData.selectedZone ? passedData.selectedZone : 0;
        const deptName = passedData.deptName ? passedData.deptName : "";
        const deptId = passedData.deptId ? passedData.deptId : "";
        const offcName = passedData.offcName ? passedData.offcName : "";
        const offcId = passedData.offcId ? passedData.offcId : "";
        const isDate = passedData.isDate || passedData.isDate == 0 ? passedData.isDate : 1;
        this.filterDetails = {month: month, year: year, zone: zone, deptName: deptName, deptId: deptId,  officeName: offcName, officeId: offcId, selectedZone: selectedZone}
        this.reviceParamsfilter({month: month, year: year, zone: zone, deptName: deptName, departmentControl: {v_DEPT_ID: deptId}, officeName: offcName, officeId: offcId, selectedZone: selectedZone, isDate:isDate})
        } 
        else {
          this.isNavigate = false;
          console.log("this.userdetails",this.userdetails)
           this.checkOfficeId()
           let date=new Date();
           console.log("month",date.getFullYear())
          //  const reportmonth=(date.getMonth()+1).toString();
          //  const reportYear=(date.getFullYear()).toString();
          const reportmonth="0";
           const reportYear="0";
           this.reviceParamsfilter({month: reportmonth, year: reportYear, zone: 0, isDate: this.isDate});
        } 
    });


    
     this.config.storeDetails("employeeCode",'')
     this.config.storeDetails("employeeId",'')
     this._Service.url="Inbox >  PensionerList"
    
  }
  
 

  reset(data: any)
  {
    this.reportmonth = data?.month
    this.reportYear  = data?.year
    this.zoneFlag     = data?.zone
    this.departmentId = data?.departmentControl?.v_DEPT_ID ? data.departmentControl.v_DEPT_ID : "";
    this.isDate = data?.isDate
    if(data?.officeID){
      this.office_id_selection_flag = true
    }else {
      this.office_id_selection_flag = false
    }
    this.pensionSummary();
  }
  deptid:any;
  checkOfficeId()
  {
   let data = {
      "inMstType":28,
      "inValue":this.userdetails.officeid,
      "inValue2":0,
      "inValue3":""
      }
      
   console.log("check office",data);
   this._Service.postho('allmstdata', data).subscribe({
    next: (res:any) => {
      
      if (res.status = 200) {
       let data1 = JSON.parse(res.data);
        console.log("check res",data1)
       this.deptid=data1[0].departmentId;
    this.pensionSummary();

      }
    },

  })
  }


  pensionSummary()
  {
  let data = { 
    "inType":"1",
    "isRole"    :    Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
    "officeId"  :  Number(this.zoneFlag) ? this.zoneFlag : this.userdetails.officeid,
    'inYear'    :this.reportYear,
    'inMonth'   :this.reportmonth,
    "deptId"     :this.departmentId ? this.departmentId  : 0,
    "isDate" : this.isDate
  }    
  this.load.show();
  this._Service.postPension("getRevisedCommutationReport",data).subscribe({
      next: (res:any) => {
       
            if(res && res?.data) { 
              let data:any
              
             data = res?.data
          
              // debugger
              // console.log(res.data,"res.data")
          
              for(let eachDataIndex in data) {
                data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
              
              }
   
              this.dataSource = new MatTableDataSource( res.data);
              this.dataSource.paginator = this.paginator;
            }else {
              let data:any[]=[];
              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
              
            }
        
      },
      error: (err) => {
        this.load.hide();
        console.log(err);
        this.error = err
      
      }, complete: ()=> {
        this.load.hide()
      }
    })
  }

  // pensionSummaryRoleWiseReport(inPendingRole: string, reportName: string) {
  //   const isRole = this.zoneFlag ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid;
  //   const officeId= this.zoneFlag ? this.zoneFlag : this.userdetails.officeid;

  //   this.dialog.open(CommonDialogForReportsComponent, {
  //     data: {
  //       displayedColumnsForRoleWiseReport: this.displayedColumnsForRoleWiseReport,
  //       name:"Pension Summary",
  //       inPendingRole,
  //       reportName,
  //       isRole,
  //       officeId,
  //       inYear: this.reportYear.toString(),
  //       inMonth:this.reportmonth.toString(),
  //       flag : "1",
  //     }
  //   })
    
    
 
  // }

  detailReport(flag:number,title?:any){
    let payload = {
      "inType":flag,
      "isRole"    :    Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
      "officeId"  :  Number(this.zoneFlag) ? this.zoneFlag : this.userdetails.officeid,
      'inYear'    :this.reportYear,
      'inMonth'   :this.reportmonth,
      "deptId"     :this.departmentId ? this.departmentId  : 0,
      "isDate" : this.isDate
  }
  
  // countGpoCpoPpo
    this._Service.postPension('getRevisedCommutationReport',payload).subscribe({
      next:(res:any)=>{
        let data 
        if(res?.data){
        data = res?.data

        for(let eachDataIndex in data) {
          data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
        
        }
      }
      console.log(data, "data")
           const dialogRef = this.dialog.open(DashDialogComponent, {
           data: {
               data: data,
               flag : flag,
               detail: 'commutationRequest',
               reportName: title
           },
           });

      },
      error:(err:any)=>{

      },
      complete: ()=>{
      
      }
    })
  }


  
  
  reviceParamsfilter(data:any){
    console.log(data?.isDate);
    this.reportmonth = data?.month
    this.reportYear  = data?.year
    this.zoneFlag     = data?.zone
    this.isDate = data?.isDate
    this.isShow = false
    this.departmentId = data?.departmentControl?.v_DEPT_ID ? data.departmentControl.v_DEPT_ID : "";
    if(data?.officeID){
      this.office_id_selection_flag = true
    }else {
      this.office_id_selection_flag = false
    }
    this.pensionSummary();
  }


 
  generateExcelOrPDFData() {
    const pensionerList: any[] = [];
      const filteredData = this.dataSource.filteredData;
      const dataHeaderArray = [
       {
        sNo: "S.No",
        pendingAtHo: "Pending at Ho",
        pendingAuditorZonal: "Pending at Auditor",
        pendingAaoZonal: "Pending at AAO Zonal",
        pendingZonalApprov: "Pending at Zonal(Approver)",
        autoApproved: "Approved at Zonal"
      } 
    ];

   
  for(const eachData of filteredData) {
    let eachObj: any = {}
      eachObj["sNo"] = eachData.sNo;
      eachObj["pendingAtHo"] = eachData.pendingAtHo;
      eachObj["pendingAuditorZonal"] = eachData.pendingAuditorZonal;
      eachObj["pendingAaoZonal"] = eachData.pendingAaoZonal;
      eachObj["pendingZonalApprov"] = eachData.pendingZonalApprov;
      eachObj["autoApproved"] = eachData.autoApproved + eachData.normalApproved;
      pensionerList.push(eachObj)

  }

  return [dataHeaderArray, pensionerList]
  }
  
  exportToPdf(id: string, name: string){
if(this.dataSource && this.dataSource.filteredData && this.dataSource.filteredData.length && name === "e-Pension summary."){
    let [dataHeaderArray, pensionerList] =  this.generateExcelOrPDFData()
    this.load.show();
    this.commonService.downloadPdf(`#${id}`,name, name, pensionerList,dataHeaderArray);
    this.load.hide();
  }
}

    
  exportToExcel(name: string){
    if(this.dataSource && this.dataSource.filteredData && this.dataSource.filteredData.length && name === "e-Pension summary."){
    let [dataHeaderArray, pensionerList] =  this.generateExcelOrPDFData()
     
      this.load.show();
    this.commonService.exportTOExcel(pensionerList,dataHeaderArray, name);
    this.load.hide();
  }
}

 
total(auto:any,normal:any){
  return Number(auto ?auto:0 )+Number(normal?normal:0)
}


totalautonormal(flag:number){
  let payload = {
    "inMonth" : this.reportmonth,
      "inYear"  : this.reportYear,
    "flag"    : flag,
    "isRole"  : Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) : this.userdetails.roleid ,
    "officeId": Number(this.zoneFlag) ?  this.zoneFlag :  this.userdetails.officeid,
    "deptId"  :  this.departmentId ? this.departmentId  : 0
}
return this._Service.countGpoCpoPpo('getNewPsnDetailsSummaryReport', payload);

}

resultArray:any
totalDetail(){
  const flagValues = [7,8];
  const apiObservables = flagValues.map((flag) => {
    return this.totalautonormal(flag);
  });
  forkJoin(apiObservables).subscribe((results: any[]) => {
    this.resultArray = results;
    const mergedDataArray = this.resultArray.map((item:any) => item?.data).reduce((acc:any, val:any) => acc.concat(val), []);
const dialogRef = this.dialog.open(DashDialogComponent, {
data: {
  data: mergedDataArray,
  flag : 10,
  detail: 'pss',
  reportName: "Approved at Zonal"
},
});
     })
    

}
sum(row:any){

return row.pendingAaoZonal + row.pendingAtHo  + row.pendingAuditorZonal + row.pendingZonalApprov + row.objectionCases
}



getPensionApplicationStatus(){
  let payload = {
  "inMonth"    :this.reportmonth,     
  "inYear"     :this.reportYear,
  "flag"       :"1",
  "isRole"     :Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
  "officeId"   :Number(this.zoneFlag) ? this.zoneFlag : this.userdetails.officeid,
  "deptId"  :  this.departmentId ? this.departmentId  : 0
}

// getPensionApplicationStatus
this._Service.postemploye('getNewEmpEssSummaryReport',payload).subscribe({
  next:(res:any)=>{
 

   if( res && res?.data && res?.data?.notInitiatedPension){
    this.pensionSummaryData[0]['notIniinited'] = res?.data?.notInitiatedPension
   
    this.dataSource = new MatTableDataSource( this.pensionSummaryData);
    this.dataSource.paginator = this.paginator;
   }
  },
  error:(err:any)=>{
  
  },
  complete: ()=>{
  }
})
}

}

