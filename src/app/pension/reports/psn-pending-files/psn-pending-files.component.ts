import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportsModule } from '../reports.module';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfig } from 'src/app/app.config';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { LoaderService } from 'src/app/services/loader.service';
import { CommonService } from 'src/app/services/common.service';

export interface dataSource {
  deptName: string;
  makerCount: number;
  checkerCount: number;
  approverCount: number;
  auditorCount: number;
  aaoCount: number;
  adCount: number;
  zone: any;
}



@Component({
  selector: 'app-psn-pending-files',
  templateUrl: './psn-pending-files.component.html',
  styleUrls: ['./psn-pending-files.component.scss']
})
export class PsnPendingFilesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'sNo',
    'empNameAndCode',
    'designation',
    'pendingHodmaker',
    'pendingHodcheckr',
    'pendingHodApprovr',
    'pendingAuditrZonal', 
    'pendingAaozonal', 
 
    'pendingZoneApprvrZonal', 
    'PendingAdzonal'
  ];
  dataSource !: MatTableDataSource<any>;
  userdetails:any;
  pendingPensionlist:any;
  config:AppConfig=new AppConfig()
  selected  = ''
  // psnPendingFilesList: any;
  zoneFlag: any;
  office_id_selection_flag?: boolean;
  departmentId :any
  constructor(private ApiUrlService: PensionServiceService,
    private loader:LoaderService, 
    private commonService: CommonService
    
    ) { }

  ngOnInit(): void {
    this.userdetails=this.config.getUserDetails();
    console.log("this.userdetails",this.userdetails)
    // this.getMonthYear();
    
  let date=new Date();
  console.log("month",date.getFullYear())
  // const reportmonth=(date.getMonth()+1).toString();
  // const reportYear=(date.getFullYear()).toString();
  const reportmonth="0";
  const reportYear="0";
  this.reviceParamsfilter({month: reportmonth, year: reportYear, zone: 0, isDate: this.isDate})
  
  }

// {
// 	"assignmentId": "58238",
// 	"deptId": "0",
// 	"pageNo": "2"
// }
reportYear:any;
reportmonth:any;
psnmonth:any[]=[];
psnYear:any[]=[];
isDate: any = 0;


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
  this.pensionerDetails();
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
  this.pensionerDetails();
}
  pensionerDetails(){
    
   
    let data = {
      "reportType":"3",
   

      "isRole":    Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
      "officeId":  Number(this.zoneFlag) ? this.zoneFlag : this.userdetails.officeid,

      'inYear':this.reportYear.toString(),
      'inMonth':this.reportmonth.toString(),
      "deptId"     :this.departmentId ? this.departmentId  : 0,
      "isDate" : this.isDate
    }


       console.log(data)
       this.loader.show()
       this.ApiUrlService.getUpcomPsnReport('getpensioncommonreportbyreporttype', data).subscribe({
        next: (res) => {
          this.loader.hide()
let data: any[]=[];
if(res && res.status == 'SUCCESS' && res.data){
  if(res.data.errorMessage) {
    data = [];
  } else {
    const jsonData = JSON.parse(res.data)
    data = jsonData.psnInfo
    for(let eachDataIndex in data) {
      data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
      data[eachDataIndex]["empNameAndCode"] = `${data[eachDataIndex]["empName"]} (${data[eachDataIndex]["employeeCode"]})`
    }   
  }
} else {
  data = [];
}
this.dataSource = new MatTableDataSource(data);
this.dataSource.paginator = this.paginator;
}, error: (err) => {
  this.loader.hide()
      console.log(err)
      }
    })
  }





   applyFilter(event:any){

   }

   generateExcelOrPdfData() {
    const psnPendingFilesList: any[] = [];
    const filteredData = this.dataSource.filteredData;
  const dataHeaderArray = [
    {
      sNo: "S.No.",
      empNameAndCode: "Employee Name",
      designation: "Designation",
      pendingHodmaker: "Pending at HoO Maker",
      pendingHodcheckr: "Pending at HoO Checker",
      pendingHodApprovr: "Pending at HoO Approver",
      pendingAuditrZonal: "Pending at Auditor Zonal", 
      pendingAaozonal: "Pending at AAO Zonal", 
   
      pendingZoneApprvrZonal: "Pending at Approver Zonal", 
      PendingAdzonal: "Pending at AAO Zonal",
    } 
  ];
  for(const eachData of filteredData) {
    let eachObj: any = {}
    eachObj["sNo"] = eachData.sNo;
    eachObj["empNameAndCode"] = eachData?.empNameAndCode ?? "" ;
    eachObj["designation"] = eachData?.designation ?? "";
    eachObj["pendingHodmaker"] = eachData?.pendingHodmaker ?? "" ;
    eachObj["pendingHodcheckr"] = eachData?.pendingHodcheckr ?? "";
    eachObj["pendingHodApprovr"] = eachData?.pendingHodApprovr ?? "";
    eachObj["pendingAuditrZonal"] = eachData?.pendingAuditrZonal ?? "";
    eachObj["pendingAaozonal"] = eachData?.pendingAaozonal ?? "";
  
    eachObj["pendingZoneApprvrZonal"] = eachData?.pendingZoneApprvrZonal ?? "";
    eachObj["PendingAdzonal"] = eachData?.PendingAdzonal ?? "";
    psnPendingFilesList.push(eachObj)
}
return [psnPendingFilesList, dataHeaderArray ];
   }

   exportToPdf(id: string, name: string){
    if(this.dataSource && this.dataSource?.filteredData && this.dataSource.filteredData.length){
      let [psnPendingFilesList, dataHeaderArray ] = this.generateExcelOrPdfData()
      this.loader.show()
      this.commonService.downloadPdf(`#${id}`, name, name,  psnPendingFilesList, dataHeaderArray)
      this.loader.hide()    
    }
}



  exportToExcel(){
    
    if(this.dataSource && this.dataSource?.filteredData && this.dataSource.filteredData.length){
      let [psnPendingFilesList, dataHeaderArray ] = this.generateExcelOrPdfData()
      this.loader.show()
      this.commonService.exportTOExcel(psnPendingFilesList,dataHeaderArray, "Pending cases zone wise")
      this.loader.hide();
    }
  }


   //"assignmentid":this.userdetails.assignmentid
  // /#/jobs/{{element.jobId}}/job-maintenance/general
}
