import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { CommonService } from 'src/app/services/common.service';
import { LoaderService } from 'src/app/services/loader.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { CommonDialogForReportsComponent } from '../common-dialog-for-reports/common-dialog-for-reports.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MobileNoValidator } from '../../common-validation/form-validations.directive';
import { DashDialogComponent } from './../../dashboard/dash-dialog/dash-dialog.component';

@Component({
  selector: 'app-employee-summary',
  templateUrl: './employee-summary.component.html',
  styleUrls: ['./employee-summary.component.scss']
})
export class EmployeeSummaryComponent implements OnInit {
// public myForm = new FormGroup({
//   // mobileNumber: new FormControl("",[Validators.required , MobileNoValidator])
// })

// get mobileNo() {
//   return this.myForm.get("mobileNumber");
// }
  @Output() EmpId = new EventEmitter();
  displayedColumns: string[] =[ 
      "sNo",
      "totalRetiree",
      "ifms2",
      "psnNotInitiated",
     
      "essPending",
      "essApproved",
  
    ];

     displayedColumnsForRoleWiseReport: string[] = [
       "sNo",
       "empName",
      //  "employeeCode",
      //  "roleId",
      //  "ofcId",
         "ofcName",
         "srvcCatName",
         "subSrvcCatName",
         "dor",
         "zoneoffc",
         "payCommName",
        //  "treasCode",
        //  "reqId",
        //  "TempId",
         "status",
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
  // employeeSummaryList:any;
  roleWiseReportName: string = "";
  employeeSummaryRoleWiseList: any;
  office_id_selection_flag:any;               
  zoneFlag                :any;
  isNavigate: boolean;
  departmentId : any
  isDate: any = 0;
  filterDetails: { month: any; year: any; zone: any; deptName: any; deptId: any; officeName: any; officeId: any; selectedZone: any; };

  // errorMessage: string;
  constructor(public dialog: MatDialog,  
    private _Service: PensionServiceService, 
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router:Router,
    private load:LoaderService,
    private commonService: CommonService,
    private tokenInfo:TokenManagementService) 
    { 
       this.encryptMode = true;
    }
    reportYear:any;
    reportmonth:any;
    psnmonth:any[]=[];
    psnYear:any[]=[];
    // getMonthYear()

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
        this.filterDetails = {month: month, year: year, zone: zone, deptName: deptName, deptId: deptId,  officeName: offcName, officeId: offcId, selectedZone: selectedZone}
        this.reviceParamsfilter({month: month, year: year, zone: zone, deptName: deptName, departmentControl: {v_DEPT_ID: deptId}, officeName: offcName, officeId: offcId, selectedZone: selectedZone})
        } 
        else {
          this.isNavigate = false;

          
              console.log("this.userdetails",this.userdetails)
          
          
               let date=new Date();
               console.log("month",date.getFullYear())
              //  const reportmonth=(date.getMonth()+1).toString();
              //  const reportYear=(date.getFullYear()).toString();
              const reportmonth="0";
               const reportYear="0";
               this.reviceParamsfilter({month: reportmonth, year: reportYear, zone: 0});
        } 
    });



     this.config.storeDetails("employeeCode",'')
     this.config.storeDetails("employeeId",'')
     this._Service.url="Inbox >  employeeSummaryList"
    
  }


  
  reviceParamsfilter(data:any){

    
    this.reportmonth = data?.month
    this.reportYear  = data?.year
    this.zoneFlag     = data?.zone
    this.isDate = data?.isDate
    this.departmentId = data?.departmentControl?.v_DEPT_ID ? data.departmentControl.v_DEPT_ID : "";
    this.isShow = false

    if(data?.officeID){
      this.office_id_selection_flag = true
    }else {
      this.office_id_selection_flag = false
    }
    this.employeeSummary();
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
    this.employeeSummary();
  }


  employeeSummary()
  {
    this.error = "";
  let data = {
    "flag"      :"1",
    "isRole"    :    Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
    "officeId"  :  Number(this.zoneFlag) ? this.zoneFlag : this.userdetails.officeid,
    'inYear'    :this.reportYear,
    'inMonth'   :this.reportmonth,
    "deptId"     :this.departmentId ? this.departmentId  : 0,
    "isDate" : this.isDate
  }
  this.load.show();
      this._Service.postPension('getEssPsnSummaryReport', data).subscribe({
      next: (res:any) => {
      this.load.hide();
        console.log("res",res?.data[0])
       
        if (res) {
            if(res?.data) { 
               res.data[0]["sNo"] = "1";
               let data = res?.data
                  this.dataSource = new MatTableDataSource(data);
             
                  
    
            } else {
              this.dataSource = new MatTableDataSource([""]);
            } 
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


  
  employeeSummaryRoleWiseReport(inPendingRole: string, reportName: string) {
    const isRole = this.zoneFlag ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid;
    const officeId= this.zoneFlag ? this.zoneFlag : this.userdetails.officeid;
    

this.dialog.open(CommonDialogForReportsComponent, {
  // panelClas: 'dialog-w-30',
  // height:'80%',
  // minWidth:'90%',
  // header: 'ABC',
  data: {
    displayedColumnsForRoleWiseReport: this.displayedColumnsForRoleWiseReport,
    name:"Employee Summary",
    inPendingRole,
    reportName,
    isRole,
    officeId,
    inYear: this.reportYear.toString(),
    inMonth:this.reportmonth.toString(),
    flag : "1",
    departmentId : this.departmentId ? this.departmentId : 0,
    isDate: this.isDate
  }
})


  
  }

 

  generateExcelOrPDFData() {
    const employeeSummaryList: any[] = [];
    const filteredData = this.dataSource.filteredData;
    const dataHeaderArray = [
      {
        sNo: "S.No",
        totalRetiree: "Total Employee",
        psnNotInitiated: "Not Initiated by Pensioner",
        ifms2: "IFPMS 2.0 Process",
        essPending: "Pending at ESS",
        essApproved: "Approved",
  
      
      } 
    ];


    // "sNo",
    // "totalRetiree",
    // "ifms2",
    // "psnNotInitiated",
   
    // "essPending",
    // "essApproved",


    for(const eachData of filteredData) {
      let eachObj: any = {}
      eachObj["sNo"] = eachData.sNo;
      eachObj["totalRetiree"] = eachData.totalRetiree;
      eachObj["ifms2"] = eachData.ifms2;
      eachObj["psnNotInitiated"] = eachData.psnNotInitiated;
      eachObj["essPending"] = eachData.essPending;
      eachObj["essApproved"] = eachData.essApproved;
      employeeSummaryList.push(eachObj);
    }
    return [employeeSummaryList, dataHeaderArray];
  }

  exportToPdf(id: string, name: string){
    
      if(this.dataSource.filteredData && name === "Pension ESS Summary."){
        let [employeeSummaryList, dataHeaderArray] = this.generateExcelOrPDFData()
      this.load.show()
      this.commonService.downloadPdf(`#${id}`,name, name, employeeSummaryList, dataHeaderArray)
      this.load.hide()    
      }
  }


  exportToExcel(name: string){
    
    if(this.dataSource.filteredData && name === "Pension ESS Summary.") {
      let [employeeSummaryList, dataHeaderArray] = this.generateExcelOrPDFData()
      this.load.show()
      this.commonService.exportTOExcel(employeeSummaryList, dataHeaderArray,name)
      this.load.hide();
    }
  }

 
  detailPensionessReport(flag:number,title?:any){
    let payload = {
      'inYear'    :this.reportYear,
      'inMonth'   :this.reportmonth,
      "flag"    : flag,
      "isRole"  : Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) : this.userdetails.roleid ,
      "officeId": Number(this.zoneFlag) ?  this.zoneFlag :  this.userdetails.officeid,
      "deptId"  :  this.departmentId ? this.departmentId  : 0,
      "isDate" : this.isDate
  }
  
  // countGpoCpoPpo
  

    this._Service.postPension('getEssPsnDetailsReport',payload).subscribe({
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
               reportName:title
           },
           });

      },
      error:(err:any)=>{

      },
      complete: ()=>{
      
      }
    })
  }
}