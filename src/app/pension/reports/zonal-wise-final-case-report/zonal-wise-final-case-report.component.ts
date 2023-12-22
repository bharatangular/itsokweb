import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportsModule } from '../reports.module';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfig } from 'src/app/app.config';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { LoaderService } from 'src/app/services/loader.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-zonal-wise-final-case-report',
  templateUrl: './zonal-wise-final-case-report.component.html',
  styleUrls: ['./zonal-wise-final-case-report.component.scss']
})
export class ZonalWiseFinalCaseReportComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'sNo',
    'name',
    'pensionerId', 
    'department',
    'designation',
  'dateOfRetirement',
  'ofcName',
  'treasCode',
  'zoneName',
  'ppoNo',
  'ppoAmt',
    'gpoNo',
    'gpoAmt',
    'cpoNo',
    'cpoAmt',
    'receivedDate'
  ];
  dataSource!: MatTableDataSource<any>;

  userdetails:any;
  pendingPensionlist:any;
  config:AppConfig=new AppConfig()
  selected  = ''
  zonalwiseFinalCaseReportList: any = [];
  error: any = "";
  zoneFlag: any;
  departmentId:any
  office_id_selection_flag?: boolean;
  isDate: any = 0;
  constructor(private ApiUrlService: PensionServiceService,
    private loader:LoaderService, 
    private commonService: CommonService
    
    ) { }

  ngOnInit(): void {
    this.userdetails=this.config.getUserDetails();
  let date=new Date();
  console.log("month",date.getFullYear())
  // const reportmonth=(date.getMonth()+1).toString();
  // const reportYear=(date.getFullYear()).toString();
  const reportmonth="0";
  const reportYear="0";
  this.reviceParamsfilter({month: reportmonth, year: reportYear, zone: 0, isDate: this.isDate})
  
  }

reportYear:any;
reportmonth:any;
psnmonth:any[]=[];
psnYear:any[]=[];

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
  this.getZonalWiseFinalCaseReport();
}
  getZonalWiseFinalCaseReport(){
   
    let data = {
      "reportType":"4",
       "isRole":  Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
      "officeId":  Number(this.zoneFlag)? this.zoneFlag : this.userdetails.officeid,
      'inYear':this.reportYear.toString(),
      'inMonth':this.reportmonth.toString(),
      "deptId"     :this.departmentId ? this.departmentId  : 0,
      "isDate" : this.isDate
    }
    this.loader.show()
       this.ApiUrlService.getUpcomPsnReport('getpensioncommonreportbyreporttype', data).subscribe({
        next: (res) => {
          
          console.log('res',res)
    let data: any[]=[];
    if(res && res.status == 'SUCCESS' && res.data){
      if(res.data.errorMessage) {
        data = [];
      } else {
        data = JSON.parse(res.data)
        for(let eachDataIndex in data) {
            data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
            data[eachDataIndex].gpoNo = data[eachDataIndex].gpoNo.split(",")[0]
            data[eachDataIndex].cpoNo = data[eachDataIndex].cpoNo.split(",")[0]
        }
        this.zonalwiseFinalCaseReportList = data.map( obj=> {
          const {sNo, ...restObj } = obj;
          return restObj
        });        console.log('this.firstPensionnList',this.zonalwiseFinalCaseReportList)
      }
    } else {
      data = [];
    }
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  },  error: (err) => {
    this.loader.hide();
    console.log(err);
    this.error = err
  
  }, complete: ()=> {
    this.loader.hide()
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
    this.getZonalWiseFinalCaseReport();
  }

  applyFilter(event: Event) {
    
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
   generateExcelOrPdfData() {
    const zonalwiseFinalCaseReportList: any[] = [];
    const filteredData = this.dataSource.filteredData;
    const dataHeaderArray = [
    {
      sNo: "S.No.",
      name: "Name",
      pensionerId: "Pensioner Id", 
      department: "Department",
      designation: "Designation",
      dateOfRetirement: "Date Of Retirement",
      ofcName : "Office Name",
      treasCode: "Treasury Code",
      zoneName: "Zone Name",
      ppoNo: "PPO No",
      ppoAmt: "PPO Amount",
      gpoNo: "GPO No",
      gpoAmt: "GPO Amount",
      cpoNo: "CPO No",
      cpoAmt: "CPO Amount",
      receivedDate: "Received Date",
          } 
  ];
  for(const eachData of filteredData) {
    let eachObj: any = {}
    eachObj["sNo"] = eachData.sNo;
    eachObj["name"] = eachData?.name ?? "" ;
    eachObj["pensionerId"] = eachData?.pensionerId ?? "";
    eachObj["department"] = eachData?.department ?? "" ;
    eachObj["designation"] = eachData?.designation ?? "";
    eachObj["dateOfRetirement"] = eachData?.dateOfRetirement ?? "";
    eachObj["ofcName"] = eachData?.ofcName ? eachData?.ofcName + '(' + eachData?.ofcId + ')' : "";
    eachObj["treasCode"] = eachData?.treasCode ?? "";
    eachObj["zoneName"] = eachData?.zoneName ?? "";
    eachObj["ppoNo"] = eachData?.ppoNo ?? "";
    eachObj["ppoAmt"] = eachData?.ppoAmt ?? "";
    eachObj["gpoNo"] = eachData?.gpoNo ?? "";
    eachObj["gpoAmt"] = eachData?.gpoNo ?? "";
    eachObj["cpoNo"] = eachData?.cpoNo ?? "";
    eachObj["cpoAmt"] = eachData?.cpoAmt ?? "";
    eachObj["receivedDate"] = eachData?.receivedDate ?? "";
    zonalwiseFinalCaseReportList.push(eachObj);
}
return [zonalwiseFinalCaseReportList, dataHeaderArray]
   }

   exportToPdf(id: string, name: string){
    if(this.zonalwiseFinalCaseReportList.length){
      let [zonalwiseFinalCaseReportList, dataHeaderArray] = this.generateExcelOrPdfData();
    this.loader.show()
    this.commonService.downloadPdf(`#${id}`,name, name,zonalwiseFinalCaseReportList, dataHeaderArray)
    this.loader.hide()    
    }
  }

  exportToExcel(name: string){
    if(this.dataSource && this.dataSource?.filteredData && this.dataSource.filteredData.length){
      let [zonalwiseFinalCaseReportList, dataHeaderArray] = this.generateExcelOrPdfData();
    this.loader.show();
    this.commonService.exportTOExcel(zonalwiseFinalCaseReportList, dataHeaderArray, name);
    this.loader.hide();   
    } 
  }

  // applyFilter(event: Event) {
    
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
   //"assignmentid":this.userdetails.assignmentid
  // /#/jobs/{{element.jobId}}/job-maintenance/general
}
