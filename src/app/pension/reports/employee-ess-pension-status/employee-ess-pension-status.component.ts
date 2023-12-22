
import { Component, ElementRef, OnInit, ViewChild ,AfterViewInit, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import * as CryptoJS from 'crypto-js';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { CommonService } from 'src/app/services/common.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-employee-ess-pension-status',
  templateUrl: './employee-ess-pension-status.component.html',
  styleUrls: ['./employee-ess-pension-status.component.scss']
})
export class EmployeeEssPensionStatusComponent implements OnInit {
  @Output() EmpId = new EventEmitter();
  displayedColumns    : string[] = ["sNo","empCode","empName", "deptName", "officeName" , "dob","dor",'zoneName'  ];
  displayedColumns3    : string[] = ["sNo","empCode","empName", "deptName", "officeName" , "dob","dor",'zoneName' ,"status",'pendingFrmDate' , 'totalPendingDays' ];
  displayedColumns1     : string[] = ["sNo","empCode","empName" ,"dob","dor" ,"deptName",'ofcName',  'zoneName',"status","mobile","pensingHoMaker","pendingHoChecker","pensingHOOapprov","objection_remarks_all" ,'pendingAuditorZonal','pendingAaoZonal','pendingZoneAppvr','pendingFrmDate' , 'totalPendingDays'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('content', { static: false }) el!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datalist: any = [];
  showerror: boolean = false;
  error: string = '';
  empinfo: any;
  isShow=true;
  encryptMode: boolean= false;  
  userdetails:any;
  config:AppConfig=new AppConfig()
  selected = '';
  zoneFlag: any;
  office_id_selection_flag?: boolean;
  departmentId : any
  DataEmployess =  [{label:'Not Initiated ESS',id:2}, {label:'ESS In-Process',id:3},{label:'Pension In-Process',id:4} ];
  employeeEssPension =2
  isDate: any = 0;
  constructor(public dialog: MatDialog, 
    
    private load:LoaderService,
    private tokenInfo:TokenManagementService,
    private ApiUrlService: PensionServiceService,
    private _snackBar: MatSnackBar,
    public _dialog: MatDialog,
    private routers: Router,
    private date: DatePipe,
    private commonService: CommonService) {  this.encryptMode = true;}

  ngOnInit(): void {

    this.empinfo=this.tokenInfo.empinfoService;
    this.userdetails=this.config.getUserDetails();
    let date=new Date();
    // const reportmonth=(date.getMonth()+1).toString();
    // const reportYear=(date.getFullYear()).toString();
    const reportmonth="0";
    const reportYear="0";
    this.reviceParamsfilter({month: reportmonth, year: reportYear, zone: 0, isDate: this.isDate})    
  }
  reportYear:any;
  reportmonth:any;
  psnmonth:Array<any>=[]
  psnYear:Array<any>=[]

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
this.employeeEssPension = 2
// this.enhancePensionDtls();
this.detailPensionessReport(this.employeeEssPension)
}
  enhancePensionDtls()
  {
    
      let data = {
        "reportType":"1",
        "isRole":    this.zoneFlag ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
        "officeId":  this.zoneFlag ? this.zoneFlag : this.userdetails.officeid,
        'inYear':this.reportYear.toString(),
        'inMonth':this.reportmonth.toString(),
        "deptId"     :this.departmentId ? this.departmentId  : 0,
        "isDate" : this.isDate
      }


      this.load.show()
      this.ApiUrlService.getUpcomPsnReport('getpensioncommonreportbyreporttype', data).subscribe({
        next: (res) => {
        let data: any[]=[];
        if(res && res.status == 'SUCCESS' && res.data){
          if(res.data.errorMessage) {
            data = [];
          } else {
            data = JSON.parse(res.data)
            for(let eachDataIndex in data) {
              data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
              data[eachDataIndex]["empNameAndCode"] = `${data[eachDataIndex]["name"]} (${data[eachDataIndex]["empCode"]})` 
            }   
          }
        } else {
          data = [];
        }
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
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
  
  reviceParamsfilter(data:any){
    
    this.reportmonth = data?.month
    this.reportYear  = data?.year
    this.zoneFlag     = data?.zone
    this.isDate = data?.isDate

    this.departmentId = data?.departmentControl?.v_DEPT_ID ? data.departmentControl.v_DEPT_ID : "";
    if(data?.officeID){
      this.office_id_selection_flag = true
    }else {
      this.office_id_selection_flag = false
    }
    
    // this.enhancePensionDtls();
    this.detailPensionessReport(this.employeeEssPension)
  }
  









  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  generateExcelOrPdfData() {
    const enhancePsnList: any[] = [];
    const filteredData = this.dataSource.filteredData;
    const dataHeaderArray = [
    {
      sNo: "S.No.",
      empNameAndCode: "Name",
      // name:   ,
      refNo: "Ref No",
      // empCode:   ,
      ppoNo: "PPO No",
      dob: "Date of Birth",
      accountNo: "Account No",
      psnAmt: "PSN Amount",
      death_date:"PSN Death Date",
      familyPsnName: "Family PSN Name",
      familyPsnAmt: "Family PSN Amount",
      enhancePsnEnd: "Enhance PSN End",
      enhancePsnAmt: "Enhance PSN Amount",
          } 
  ];
  for(const eachData of filteredData) {
    let eachObj: any = {}
    eachObj["sNo"] = eachData.sNo;
    eachObj["empNameAndCode"] = eachData?.empNameAndCode ?? "" ;
    eachObj["refNo"] = eachData?.refNo ?? "";
    eachObj["ppoNo"] = eachData?.ppoNo ?? "" ;
    eachObj["dob"] = eachData?.dob ?? "";
    eachObj["accountNo"] = eachData?.accountNo ?? "";
    eachObj["psnAmt"] = eachData?.psnAmt ?? "";
    eachObj["death_date"] = eachData?.death_date ?? "";
  eachObj["familyPsnName"] = eachData?.familyPsnName ?? "";
  eachObj["familyPsnAmt"] = eachData?.familyPsnAmt ?? "";
  eachObj["enhancePsnEnd"] = eachData?.enhancePsnEnd ?? "";
  eachObj["enhancePsnAmt"] = eachData?.enhancePsnAmt ?? "";
  enhancePsnList.push(eachObj)
  // eachObj["sNo"] = eachData.sNo;
  // eachObj["sNo"] = eachData.sNo;
}
return [enhancePsnList, dataHeaderArray];
  }

  exportToPdf(id: string, name: string){
    if(this.dataSource && this.dataSource?.filteredData && this.dataSource.filteredData.length){
      let  [enhancePsnList, dataHeaderArray] = this.generateExcelOrPdfData()
    this.load.show();
    this.commonService.downloadPdf(`#${id}`, name, name,  enhancePsnList, dataHeaderArray)
    this.load.hide();
    }
}
    
  exportToExcel(name: string){
    if(this.dataSource && this.dataSource?.filteredData && this.dataSource.filteredData.length){
      let  [enhancePsnList, dataHeaderArray] = this.generateExcelOrPdfData();

      this.load.show();
      this.commonService.exportTOExcel(enhancePsnList,dataHeaderArray, name);
      this.load.hide();
    } 
  }



  detailPensionessReport(flag:number){
    let payload = {
      "inMonth" : ""+this.reportmonth,
      "inYear"  : ""+this.reportYear,
      "flag"    : flag,
      "isRole"  : Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) : this.userdetails.roleid ,
      "officeId": Number(this.zoneFlag) ?  this.zoneFlag :  this.userdetails.officeid,
      "deptId"  :  this.departmentId ? this.departmentId  : 0,
      "isDate" : this.isDate
  }
  
    this.load.show()
    this.ApiUrlService.postemploye('getNewEmpEssDetailsSummaryReport',payload).subscribe({
      next:(res:any)=>{
        let data: any[]=[];
        console.log(res?.data, "res?.data")
        if(res  && res?.data){
          data = res?.data
            for(let eachDataIndex in data) {
              data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
             
              
          }
        } 
        if(this.employeeEssPension ==3){
          this.transformKeys(data,'officeName','ofcName')
          this.transformKeys(data,'officeId','ofcId')
        }
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      

      },
      error:(err:any)=>{
        this.load.hide()
      },
      complete: ()=>{
        this.load.hide()
      }
    })
  }

  selectedEmpPensionProcess(){
    let flag :any;
    // if(this.employeeEssPension==''){

    // } else if(){

    // } else if(){

    // }
    if(this.employeeEssPension == 4 ){
      this.getPsnDetailsObjectionReport()
    } else 
    this.detailPensionessReport(this.employeeEssPension)
  }



  


  getPsnDetailsObjectionReport(){
    let payload = {
      "inMonth" : ""+this.reportmonth,
      "inYear"  : ""+this.reportYear,
      "flag"    : 1,
      "isRole"  : Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) : this.userdetails.roleid ,
      "officeId": Number(this.zoneFlag) ?  this.zoneFlag :  this.userdetails.officeid,
      "deptId"  :  this.departmentId ? this.departmentId  : 0
  }
  
  
this.load.show()
    this.ApiUrlService.postPension('getPsnDetailsObjectionReport',payload).subscribe({
      next:(res:any)=>{
        let data: any[]=[];
        console.log(res?.data, "res?.data")
        if(res  && res?.data){
          data = res?.data
            for(let eachDataIndex in data) {
              data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
             
              
          }
        } 
        console.log(data, "data")
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      

      },
      error:(err:any)=>{
        this.load.hide()
      },
      complete: ()=>{
        this.load.hide()
      }
    })
  }



   transformKeys(object:any, newKey:any, oldKey:any) {
    if(Array.isArray(object)){
        object.map((item) => {
            this.transformKeys(item, newKey, oldKey)
        })
    }
    if(typeof object === 'object' && !Array.isArray(object)){
        Object.keys(object).forEach(key => {
            if (typeof object[key] === 'object') {
                this.transformKeys(object[key], newKey, oldKey)
            }
            if (key === oldKey) {
                object[newKey] = object[key]
                delete object[key]
            }
        })
    }
}
}
