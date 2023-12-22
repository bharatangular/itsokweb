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
  selector: 'app-pension-user-list',
  templateUrl: './pension-user-list.component.html',
  styleUrls: ['./pension-user-list.component.scss']
})
export class PensionUserListComponent implements OnInit {


  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = [
    'sNo',
    //'deptId',
    'deptName',
    'officeName',
    'ssoId',
    'displayName',
    'taskRoleName'
    ];

  dataSource!: MatTableDataSource<any>;
  dataSourceForRoleWiseReport!: MatTableDataSource<any>;
  @ViewChild('content', { static: false }) el!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
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

  pensionSummaryData:any;
  filterDetails: { month: any; year: any; zone: any; deptName: any; deptId: any; officeName: any; officeId: any; selectedZone: any; };

  deptId: any = 0;
  officeId: any = 0;
 
  officeData: any = [];
  isDate: any = 0;

  constructor(
    public dialog: MatDialog, 
    private _Service: PensionServiceService, 
    private modalService: NgbModal,
    private _snackBar: MatSnackBar,  
    private route: ActivatedRoute,
    private router:Router,
    private loader:LoaderService,
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
      // if(passedData && passedData.isNavigate) {
      // this.isNavigate = true;
      //   const year = passedData.year;
      //   const month = passedData.month;
      //   this.office_id_selection_flag= passedData.office_id_selection_flag === "true" ? true : false;
      //   const zone = passedData.zone ?passedData.zone : 0;
      //   const  selectedZone  = passedData.selectedZone ? passedData.selectedZone : 0;
      //   const deptName = passedData.deptName ? passedData.deptName : "";
      //   const deptId = passedData.deptId ? passedData.deptId : "";
      //   const offcName = passedData.offcName ? passedData.offcName : "";
      //   const offcId = passedData.offcId ? passedData.offcId : "";
      //   this.filterDetails = {month: month, year: year, zone: zone, deptName: deptName, deptId: deptId,  officeName: offcName, officeId: offcId, selectedZone: selectedZone}
      //   this.reviceParamsfilter({month: month, year: year, zone: zone, deptName: deptName, departmentControl: {v_DEPT_ID: deptId}, officeName: offcName, officeId: offcId, selectedZone: selectedZone})
      //   } 
      //   else {
      //     this.isNavigate = false;
      //     console.log("this.userdetails",this.userdetails)
      //      this.checkOfficeId()
      //      let date=new Date();
      //      console.log("month",date.getFullYear())
      //      const reportmonth=(date.getMonth()+1).toString();
      //      const reportYear=(date.getFullYear()).toString();
      //      this.reviceParamsfilter({month: reportmonth, year: reportYear, zone: 0});
      //   } 
    });


    
     this.config.storeDetails("employeeCode",'')
     this.config.storeDetails("employeeId",'')
     this._Service.url="Inbox >  PensionerList"


     this.reviceParamsfilter({officeId: 0, deptId: 0})
     this.pensionUserList();
    
  }
  
  applyFilter(event: Event) {
    
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  reset(data: any)
  {
    
    this.deptId = data?.departmentControl?.v_DEPT_ID ? data.departmentControl.v_DEPT_ID : 0;
    this.officeId = data?.officeControl?.offcId ? data.officeControl.offcId : 0;
    this.pensionUserList();
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
    //this.pensionSummary();

      }
    },

  })
  }

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
    this.deptId = data?.departmentControl?.v_DEPT_ID ? data.departmentControl.v_DEPT_ID : 0;
    this.officeId = data?.officeControl?.offcId ? data.officeControl.offcId : 0;
    this.pensionUserList();
  }

  generateExcelOrPDFData() {
    const pensionerList: any[] = [];
      const filteredData = this.dataSource.filteredData;
      const dataHeaderArray = [
       {
        sNo: "S.No",
        //deptId: "Department ID",
        deptName: "Department Name (Department ID)",
        officeName: "Office Name",
        ssoId: "SSO Id",
        displayName: "Display Name",
        taskRoleName: "Role Name",
      } 
    ];

   
  for(const eachData of filteredData) {
    let eachObj: any = {}
      eachObj["sNo"] = eachData.sNo;
      //eachObj["deptId"] = eachData.deptId;
      eachObj["deptName"] = eachData.deptName + '(' + eachData.deptId + ')';
      eachObj["officeName"] = eachData.officeName + '(' + eachData.officeId + ')';
      eachObj["ssoId"] = eachData.ssoId;
      eachObj["displayName"] = eachData.displayName;
      eachObj["taskRoleName"] = eachData.taskRoleName;
      pensionerList.push(eachObj)

  }

  return [pensionerList, dataHeaderArray]
  }

  exportToPdf(id: string, name: string){
    if(this.dataSource && this.dataSource?.filteredData && this.dataSource.filteredData.length){
      let [pensionerList, dataHeaderArray] = this.generateExcelOrPDFData()
     this.loader.show()
    this.commonService.downloadPdf(`#${id}`,name, name, pensionerList, dataHeaderArray)
    this.loader.hide()    
    }
  }

  exportToExcel(){
    if(this.dataSource && this.dataSource?.filteredData && this.dataSource.filteredData.length){ 
      let [pensionerList, dataHeaderArray] = this.generateExcelOrPDFData()
    this.loader.show();
    this.commonService.exportTOExcel(pensionerList, dataHeaderArray, "Pension User List");
    this.loader.hide();   
    } 
  }

  


 
total(auto:any,normal:any){
  return Number(auto ?auto:0 )+Number(normal?normal:0)
}


totalautonormal(flag:number){
  let payload = {
    "inMonth" : ""+this.reportmonth,
      "inYear"  : ""+this.reportYear,
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


pensionUserList(){
  let payload = {
    "officeId":this.officeId,
    "deptId":this.deptId
}

// let payload = {
//   "officeId":0,
//   "deptId":7
// }


this.loader.show()
  this._Service.postPensionUserList('getPensionUserList',payload).subscribe({
    next:(res:any)=>{
      let data 
      if(res?.data)
      data = res?.data
      for(let eachDataIndex = 0; eachDataIndex< data.length ; eachDataIndex++) {
        let eachObj = {"sNo" : Number(eachDataIndex) + 1}
        data[eachDataIndex] = {["sNo"]: Number(eachDataIndex) + 1, ...data[eachDataIndex]}


      }
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    error:(err:any)=>{
      this.loader.hide()
    },
    complete: ()=>{
      this.loader.hide()
    }
  })
}

}


