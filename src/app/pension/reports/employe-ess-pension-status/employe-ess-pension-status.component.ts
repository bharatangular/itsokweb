
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
import { log } from 'console';

@Component({
  selector: 'app-employe-ess-pension-status',
  templateUrl: './employe-ess-pension-status.component.html',
  styleUrls: ['./employe-ess-pension-status.component.scss']
})
export class EmployeEssPensionStatusComponent implements OnInit {
  @Output() EmpId = new EventEmitter();



  // "autoApprove": "0",
  // "PendingAuditor": "0",
  // "stoppedCases": "0",
  // "essApproved": "0",
  // "pendingHo": "0",
  // "ddoCode": "24791",
  // "essNotInited": "1",
  // "pendingHoobjection": "0",
  // "psnNotInited": "0",
  // "essPending": "0",
  // "normalApprove": "0",
  // "pendingZoneApprover": "0",
  // "ifms2": "0",
  // "pendingAaoZonal": "0",
  // "treasCode": "0902"



  // "stoppedCases": "0",
  // "essApproved": "0",
  // "essNotInited": "1",



  // displayedColumns     : string[] = ["sNo","empCode","empName" ,"dob","dor" ,"deptName",'ofcName',  'zoneName',"pensingHoMaker","pendingHoChecker","pensingHOOapprov","objection_remarks_all" ,'pendingAuditorZonal','pendingAaoZonal','pendingZoneAppvr','pendingFrmDate' , 'totalPendingDays'];

  displayedColumns    : string[] = ["sNo","empCode", "empName", "dob","dor", "ofcName", "deptName", 'zoneName' ,'ifms2', 'stoppedCases', 'essNotInited', 'essPending', 'essStatus', 'essPendingAt', 'psnNotInited', 'pendingHo', 'pendingHoObjection', 'PendingAuditor', 'pendingAaoZonal' , 'pendingZoneApprover', 'pensionStatus', 'psnPendingAt', 'psnApproved', 'autoApprove', 'normalApprove', 'psnKitStatus', 'remarks'   ];
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
  // enhancePsnList: any= [];
  selected = '';
  zoneFlag: any;
  office_id_selection_flag?: boolean;
  departmentId : any
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
    console.log("this.userdetails",this.userdetails)
   

    let date=new Date();
    console.log("month",date.getFullYear())
    // const reportmonth=(date.getMonth()+1).toString();
    // const reportYear=(date.getFullYear()).toString();
    const reportmonth = "0";
    const reportYear = "0";
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

this.enhancePensionDtls();
}

total(auto:any,normal:any){
  return Number(auto ?auto:0 )+Number(normal?normal:0)
}

  enhancePensionDtls()
  {
      let data = {
        "flag":"16",
        "isRole":    this.zoneFlag ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
        "officeId":  this.zoneFlag ? this.zoneFlag : this.userdetails.officeid,
        'inYear':this.reportYear.toString(),
        'inMonth':this.reportmonth.toString(),
        "deptId"     :this.departmentId ? this.departmentId  : 0,
        "isDate" : this.isDate
      }
      this.load.show()
      this.ApiUrlService.postPension('getEssPsnDetailsReport', data).subscribe({
        next: (res) => {
        let data: any[]=[];
        if(res  && res?.data){
            data = res.data
            for(let eachDataIndex in data) {
              data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
              data[eachDataIndex]["empNameAndCode"] = `${data[eachDataIndex]["name"]} (${data[eachDataIndex]["empCode"]})` 
            }   
       
          }
       
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      },
     


      error: (err) => {
        this.load.hide();
      
      
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
    
    this.enhancePensionDtls();
  }
  









  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }





  // displayedColumns    : string[] = ["sNo","empCode", "deptName", "ofcName" , "dob","dor",'zoneName' ,
  // 'pendingAaoZonal' , 'pendingZoneApprover', 'stoppedCases',  ];


  // ["sNo","empCode", "empName", "dob","dor", "ofcName", "deptName", 
  // 'zoneName' ,'ifms2', 'stoppedCases', 'essNotInited', 'essPending', 'essStatus',
  //  'essPendingAt', 'psnNotInited', 'pendingHo', 'pendingHoObjection', 'PendingAuditor',
  //   'pendingAaoZonal' , 'pendingZoneApprover', 'psnPendingAt', 'psnApproved', 'autoApprove', 
  //   'normalApprove', 'psnKitStatus', 'remarks'   ];
  generateExcelOrPDFData() {
    const pensionerList: any[] = [];
      const filteredData = this.dataSource.filteredData;
      console.log(filteredData, "filteredData")
      const dataHeaderArray = [
       {
        sNo: "S.No",
        empCode: "Emp. Code",
        empName: "Emp. Name",
        dob: "DOB",
        dor: "DOR",
        ofcName: "Office Name",
        deptName: "Dept Name",
        zoneName: "Zone Name ",
        ifms2: "IFPMS 2.0 Process",
        stoppedCases: "Stopped Cases ",
        essNotInited: "ESS Not Initiated",
        essPending: "ESS Pending",
        essStatus: "ESS Status",
        essPendingAt: "ESS Pending At",
        psnNotInited: "PSN Not Initiated",
        pendingHo: "Pending at HoO",
        pendingHoObjection: "Pending at HoO - Objection",
        PendingAuditor: "Pending at auditor",
        pendingAaoZonal: "Pending at AAO Zonal",
        pendingZoneApprover: "Pending at Approver Zonal",
        pensionStatus: "Pension Status",
        psnPendingAt: "PSN Pending At",
        psnApproved: "PSN Approved",
        autoApprove: "Auto Approved",
        normalApprove: "Normal Approved",
        psnKitStatus: "PSN Kit Status",
        remarks: "Remarks"
        
      } 
    ];
  
  for(const eachData of filteredData) {
    let eachObj: any = {}
      eachObj["sNo"] = eachData.sNo;
      eachObj["empCode"] = eachData.empCode;
      eachObj["empName"] = eachData.empName;
      eachObj["dob"] = eachData.dob;
      eachObj["dor"] = eachData.dor;
      eachObj["ofcName"] = eachData.ofcName;
      eachObj["deptName"] = eachData.deptName;
      eachObj["zoneName"] = eachData.zoneName;
      eachObj["ifms2"] = eachData.ifms2;
      eachObj["stoppedCases"] = eachData.stoppedCases;
      eachObj["essNotInited"] = eachData.essNotInited;
      eachObj["essPending"] = eachData.essPending;
      eachObj["essStatus"] = eachData.essStatus;
      eachObj["essPendingAt"] = eachData.essPendingAt;
      eachObj["psnNotInited"] = eachData.psnNotInited;
      eachObj["pendingHo"] = eachData.pendingHo;
      eachObj["pendingHoObjection"] = eachData.pendingHoObjection;
      eachObj["PendingAuditor"] = eachData.PendingAuditor;
      eachObj["pendingAaoZonal"] = eachData.pendingAaoZonal;
      eachObj["pendingZoneApprover"] = eachData.pendingZoneApprover;
      eachObj["pensionStatus"] = eachData.pensionStatus ? eachData.pensionStatus : "NA";
      eachObj["psnPendingAt"] = eachData.psnPendingAt;
      eachObj["psnApproved"] = eachData.psnApproved;
      eachObj["autoApprove"] = eachData.autoApprove;
      eachObj["normalApprove"] = eachData.normalApprove;
      eachObj["psnKitStatus"] = eachData.psnKitStatus;
      eachObj["remarks"] = eachData.remarks;
      // eachObj["empCode"] = eachData.empCode;
      // eachObj["empName"] = eachData.empName;
      // eachObj["deptName"] = eachData.deptName;
      // eachObj["ofcName"] = eachData.ofcName 
      // eachObj["dob"] = eachData.dob ;
      // eachObj["dor"] = eachData.dor;
      // eachObj["zoneName"] = eachData.zoneName;
      // eachObj["ifms2"] = eachData.ifms2;
      // eachObj["psnNotInited"] = eachData.psnNotInited;
      // eachObj["essNotInited"] = eachData.essNotInited;
      // eachObj["essPending"] = eachData.essPending ;

      // eachObj["essApproved"] = eachData.essApproved;
      // eachObj["pendingHo"] = eachData.pendingHo;
      // eachObj["pendingHoObjection"] = eachData.pendingHoObjection;
      // eachObj["PendingAuditor"] = eachData.PendingAuditor ;

      // eachObj["pendingAaoZonal"] = eachData.pendingAaoZonal;
      // eachObj["pendingZoneApprover"] = eachData.pendingZoneApprover ;
      // eachObj["stoppedCases"] = eachData.stoppedCases ;
      pensionerList.push(eachObj)
  
  }
  
  return [dataHeaderArray, pensionerList]
  }

  exportToPdf(id: string, name: string){
    if(this.dataSource && this.dataSource?.filteredData && this.dataSource.filteredData.length){
      let  [enhancePsnList, dataHeaderArray] = this.generateExcelOrPDFData()
    this.load.show();
    console.log()
    this.commonService.downloadPdf(`#${id}`, name, name, dataHeaderArray, enhancePsnList, )
    this.load.hide();
    }
}
    
  exportToExcel(name: string){
    if(this.dataSource && this.dataSource?.filteredData && this.dataSource.filteredData.length){
      let  [enhancePsnList, dataHeaderArray] = this.generateExcelOrPDFData();
     console.log( dataHeaderArray, "dataHeaderArray") 
      this.load.show();
      this.commonService.exportTOExcel(dataHeaderArray,enhancePsnList, name);
      this.load.hide();
    } 
  }
}
