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

@Component({
  selector: 'app-zone-office-wise-pendency-report',
  templateUrl: './zone-office-wise-pendency-report.component.html',
  styleUrls: ['./zone-office-wise-pendency-report.component.scss']
})
export class ZoneOfficeWisePendencyReportComponent implements OnInit {
@Output() EmpId = new EventEmitter();
displayedColumns: string[] =[ 
    "sNo",
    "zoneName",
    "psnNotInitiated",
    "pendingAtHo",
    "pendingHoObjection",
    // "pendingHoChecker",
    // "pendingHodApprover",
    // "rejectedHodApprvr",
    "pendingAuditorZone",
    "pendingAaozone",
    
    "pendingZoneApprvr",
    "autoApproved",
  ];



    //  displayedColumnsForRoleWiseReport: string[] = [
    //    "sNo",
    //    "empOfcName",
    //    "employeeCode",
    //    "pendingCurrAssignment",
    //    "pendingSso",
    //   //  "requestId",
    //    "pendingAtname",
    //   //  "tempId",
    //    "status",
    //    "Action"
    //    //  "employeeId": "1137240",
    // ];
 

    displayedColumnsForRoleWiseReport: string[] =  ["sNo", "empCode","empName" ,"deptName" , "officeName" ,"dob", "dor" ,"zoneName","status"
        ,"Action"];
dataSource!: MatTableDataSource<any>;
dataSourceForRoleWiseReport!: MatTableDataSource<any>;
@ViewChild('content', { static: false }) el!: ElementRef;
// @ViewChild(MatPaginator) paginator!: MatPaginator;
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
zoneOfficeList:any;
roleWiseReportName: string = "";
employeeSummaryRoleWiseList: any;
office_id_selection_flag:any;               
zoneFlag                :any;
reportYear:any;
reportmonth:any;
psnmonth:any[]=[];
psnYear:any[]=[];
  isNavigate: boolean;
  departmentId :any;
  isDate: any = 0;
  filterDetails: { month: any; year: any; zone: any; deptName: any; deptId: any; officeName: any; officeId: any; selectedZone: any; };

constructor(public dialog: MatDialog,  
  private _Service: PensionServiceService, 
  private _snackBar: MatSnackBar,
  private router:Router,
  private route: ActivatedRoute,
  private load:LoaderService,
  private commonService: CommonService,
  private tokenInfo:TokenManagementService) 
  { 
     this.encryptMode = true;
  }

ngOnInit(): void {

  this.empinfo=this.tokenInfo.empinfoService;
  this.userdetails=this.config.getUserDetails();

  // getNewPsnSummaryReportZoneWise


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
               this.reviceParamsfilter({month: reportmonth, year: reportYear, zone: 0, isDate: this.isDate})
               // this.zoneOfficeWisePendancyReport();
             
               // this.getMonthYear();     
      } 
  });




   this.config.storeDetails("employeeCode",'')
   this.config.storeDetails("employeeId",'')
   this._Service.url="Inbox >  zoneOfficeList"
  
}


reviceParamsfilter(data:any){
  
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
  this.zoneOfficeWisePendancyReport();
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
  this.zoneOfficeWisePendancyReport();
}

zoneOfficeWisePendancyReport() {
  this.error = "";
// let data = {
//   "flag":"1",
//   'inYear':this.reportYear.toString(),
//   'inMonth':this.reportmonth.toString(),
// }
// "reportType":"4",
let data = {
  
   "isRole":  Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
  "officeId":  Number(this.zoneFlag)? this.zoneFlag : this.userdetails.officeid,
  'inYear':this.reportYear.toString(),
  'inMonth':this.reportmonth.toString(),
  // "deptId"     :this.departmentId ? this.departmentId  : 0,
  "flag":"4",
  "isDate": this.isDate

}
this.load.show();
// this.dataSource.data = [];
// getPsnSummaryReportZoneWise
    this._Service.getUpcomPsnReport('getNewPsnSummaryReportZoneWise', data).subscribe({
    next: (res:any) => {
      
    this.load.hide();
      console.log("res",res)
      let data:any[]=[];
    if(res && res.status == 'SUCCESS' && res.data){
     if(this.userdetails.roleid ==99){
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
        
        this.zoneOfficeList = data.map( obj=> {
          const {sNo, ...restObj } = obj;
          return restObj
        })
        console.log('this.zoneOfficeList',this.zoneOfficeList)
      }
    } else {
      data = [];
    }
    this.dataSource = new MatTableDataSource(data);
    // this.dataSource.paginator = this.paginator;

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



zoneOfficeRoleWiseReport(inPendingRole: string, reportName: string, selectedRowData: any) {
  
  const officeId= this.zoneFlag ? this.zoneFlag : selectedRowData.zoneId;

  this.dialog.open(CommonDialogForReportsComponent, {
      data: {
        displayedColumnsForRoleWiseReport: this.displayedColumnsForRoleWiseReport,
        name:"Zonal User Wise Pendency Report",
        inPendingRole,
        reportName,
        officeId,
        departmentId:this.departmentId,
        inYear: this.reportYear.toString(),
        inMonth:this.reportmonth.toString(),
        flag : inPendingRole,
        zoneId: selectedRowData.zoneId,
        isDate: this.isDate
      }
  })
}

//     "sNo",
//     "zoneName",
//     "psnNotInitiated",
//     "pendingAtHo",
//     "pendingHoObjection",
//     // "pendingHoChecker",
//     // "pendingHodApprover",
//     // "rejectedHodApprvr",
//     "pendingAuditorZone",
//     "pendingAaozone",
    
//     "pendingZoneApprvr",
//     "autoApproved",



generateExcelOrPdfData() {
  const zoneOfficeList: any[] = [];
  const filteredData = this.dataSource.filteredData;
const dataHeaderArray = [
{
sNo: "S.NO.",
zoneName: "Zone Name",
psnNotInitiated : "	Not Initiated at HoO",
pendingAtHo: "	Pending at HoO",
pendingHoObjection: "	Objection from Pension Office",
pendingAuditorZone: "	Pending at Auditor Zonal",
pendingAaozone: "	Pending at AAO Zonal",
pendingZoneApprvr: "	Pending at Approver Zonal",
autoApproved: "	Approved at Zonal"



// pendingHodMaker: "Pending at HOD Maker",
// pendingHoChecker: "Pending at HOD Checker",
// pendencyZone: "Total of Zones(Pendency)",
// pensingAaoZonal: "Pending at AAO Zonal",
// pendingAuditor: "Pending at Auditor Zonal",
// pendingZoneApprover: "Pending at Zonal (Approver)",
// approved: "Approved at Zonal",
} 

];
for(const eachData of filteredData) {
let eachObj: any = {}
eachObj["sNo"] = eachData.sNo;
eachObj["zoneName"] = eachData?.zoneName?? "0" ;
eachObj["psnNotInitiated"] = eachData?.psnNotInitiated?? "0" ;
eachObj["pendingAtHo"] = eachData?.pendingAtHo?? "0" ;
eachObj["pendingHoObjection"] = eachData?.pendingHoObjection?? "0" ;
eachObj["pendingAuditorZone"] = eachData?.pendingAuditorZone?? "0" ;
eachObj["pendingAaozone"] = eachData?.pendingAaozone?? "0" ;
eachObj["pendingZoneApprvr"] = eachData?.pendingZoneApprvr?? "0" ;
eachObj["autoApproved"] = eachData.autoApproved ? this.total(eachData.autoApproved,eachData.normalApproved) : "0"


// eachObj["pendingHodMaker"] = eachData?.pendingHodMaker?? 0 ;
// eachObj["pendingHoChecker"] = eachData?.pendingHoChecker?? 0 ;

// eachObj["pendencyZone"] = eachData?.pendencyZone?? 0 ;

// eachObj["pensingAaoZonal"] = eachData?.pensingAaoZonal?? 0 ;


// // eachObj["pendingAaoZonal"] = eachData?.pendingAaoZonal?? 0 ;
// eachObj["pendingAuditor"] = eachData?.pendingAuditor?? 0 ;
// eachObj["pendingZoneApprover"] = eachData?.pendingZoneApprover?? 0 ;
// eachObj["approved"] = eachData?.approved?? 0 ;
zoneOfficeList.push(eachObj);
}
    return [zoneOfficeList, dataHeaderArray] 
 
}

exportToPdf(id: string, name: string){
  
    if(this.zoneOfficeList && name === "Zone user wise pendency"){
    let [zoneOfficeList, dataHeaderArray] = this.generateExcelOrPdfData();
    this.load.show()
    this.commonService.downloadPdf(`#${id}`, name, name, zoneOfficeList, dataHeaderArray)
    this.load.hide()    
    }
  }


exportToExcel(name: string){
  
  if(this.dataSource.filteredData && name === "Zone user wise pendency") {
    // zoneOfficeList.push(this.zoneOfficeList)
    let [zoneOfficeList, dataHeaderArray] = this.generateExcelOrPdfData();
    this.load.show()
    this.commonService.exportTOExcel(zoneOfficeList, dataHeaderArray,name)
    this.load.hide();
  }
}


total(auto?:any,normal?:any){
  return Number(auto ?auto:0 )+Number(normal?normal:0)
}

}