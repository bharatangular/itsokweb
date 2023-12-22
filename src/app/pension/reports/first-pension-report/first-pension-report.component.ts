import { Component, ElementRef, OnInit, ViewChild ,AfterViewInit, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import 'jspdf-autotable';
import { CommonService } from 'src/app/services/common.service';
export interface firstPensioner {
  deptName: string;
 
}
@Component({
  selector: 'app-first-pension-report',
  templateUrl: './first-pension-report.component.html',
  styleUrls: ['./first-pension-report.component.scss']
})
export class FirstPensionReportComponent implements OnInit {
  @Output() EmpId = new EventEmitter();
  displayedColumns: string[] = [
    "sNo",
    'name',
    'pensionerId',
    'department',
    'designation',
    'dateOfRetirement',
    'ofcName',
    'treasCode',
    'zoneName',
    'ppoNo',
    'gpoNo', 
    'gpoAmt',
    'gpoPaymentStatus',
    'cpoNo',
    'cpoAmt',
    ];
  departmentId : any
  dataSource!: MatTableDataSource<any>;
  @ViewChild('content', { static: false }) el!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datalist: any = [];
  showerror: boolean = false;
  error: string = '';
  selected = '';
  empinfo: any;
  encryptMode: boolean= false;  
  userdetails:any;
  config:AppConfig=new AppConfig()
  firstPensionList: any = [];
  zoneFlag: any;
  office_id_selection_flag?: boolean;
  isNavigate: boolean;
  filterDetails: { month: any; year: any; zone: any; deptName: any; deptId: any; officeName: any; officeId: any; selectedZone: any; };
  totalDataLength: any = 100;
  isPdf: boolean = false;
  isDate: any = 0;
 
  constructor(public dialog: MatDialog, 
    private loader:LoaderService,
    private tokenInfo:TokenManagementService,
    private ApiUrlService: PensionServiceService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public _dialog: MatDialog,
    private routers: Router,
    private commonService: CommonService) { }

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
          // const reportmonth=(date.getMonth()+1).toString();
          // const reportYear=(date.getFullYear()).toString();
          const reportmonth="0";
          const reportYear="0";
          this.reviceParamsfilter({month: reportmonth, year: reportYear, zone: 0, isDate: this.isDate});
        } 
    });





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
this.firstPensionReport();
}
  firstPensionReport()
  {

    let data = {
      "reportType":"2",
      "isRole":    Number(this.zoneFlag) ?  (this.office_id_selection_flag ? '5' : '98') :this.userdetails.roleid,
      "officeId":  Number(this.zoneFlag) ? this.zoneFlag : this.userdetails.officeid,
      'inYear':this.reportYear.toString(),
      'inMonth':this.reportmonth.toString(),
      "deptId"     :this.departmentId ? this.departmentId  : 0,
      "isDate" : this.isDate
    }


    this.loader.show()
    this.ApiUrlService.getUpcomPsnReport('getpensioncommonreportbyreporttype', data).subscribe({
      next: (res) => {
        
let data: any[]=[];
        if(res && res.status == 'SUCCESS' && res.data){
          if(res.data.errorMessage) {
            data = [];
          } else {
            data = JSON.parse(res.data)
            
            // this.totalDataLength = data.length;
            for(let eachDataIndex = 0; eachDataIndex< data.length ; eachDataIndex++) {
              let eachObj = {"sNo" : Number(eachDataIndex) + 1}
              data[eachDataIndex] = {["sNo"]: Number(eachDataIndex) + 1, ...data[eachDataIndex]}
        
              data[eachDataIndex].gpoNo = data[eachDataIndex].gpoNo.split(",")[0]
              data[eachDataIndex].cpoNo = data[eachDataIndex].cpoNo.split(",")[0]
            }
     
          }
        } else {
          data = [];
        }
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;

      },
      
       
      error: (err) => {
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
    this.firstPensionReport();
  }

  
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }}
    generateExcelOrPdfData() {
      const filteredData = this.dataSource.filteredData;
      const firstPensionList: any[] = [];
      const dataHeaderArray = [
       {
        sNo:"S No.",
        name: "Name", 
        pensionerId: "Pensioner Id",
       
        department: "Department", 
        designation:"Designation",
        dateOfRetirement: "Date Of Retirement" , 
        ofcName: "Office Name",
        treasCode: 'Treasury Code',
        zoneName: 'Zone Name',
        ppoNo: "PPO No",
        gpoNo: "GPO No",
        gpoAmt: "GPO Amount",
        gpoPaymentStatus: "Payement Ref. No.",
        cpoNo: "CPO No",
        cpoAmt: "CPO Amount"    
      } 
    ];
  for(const eachData of filteredData) {
    let eachObj: any = {}
      eachObj["sNo"] = eachData.sNo;
      eachObj["name"] = eachData?.name ?? "" ;
      eachObj["pensionerId"] = eachData?.pensionerId ?? "";
      
      eachObj["department"] = eachData?.department ?? "";
      eachObj["designation"] = eachData?.designation ?? "";
      eachObj["dateOfRetirement"] = eachData?.dateOfRetirement ?? "";
      eachObj["ofcName"] = eachData?.ofcName ? eachData?.ofcName + '(' + eachData?.ofcId + ')' : "";
      eachObj["treasCode"] = eachData?.treasCode ?? "";
      eachObj["zoneName"] = eachData?.zoneName ?? "";
      eachObj["ppoNo"] = eachData?.ppoNo ?? "" ;
      eachObj["gpoNo"] = eachData?.gpoNo ?? "";
      eachObj["gpoAmt"] = eachData?.gpoAmt ?? "";
      eachObj["gpoPaymentStatus"] = eachData?.gpoPaymentStatus ?? "";
      eachObj["cpoNo"] = eachData?.cpoNo ?? "";
      eachObj["cpoAmt"] = eachData?.cpoAmt ?? "";
      firstPensionList.push(eachObj);
  }
  return [dataHeaderArray, firstPensionList]
  
    }

    exportToPdf(id: string, name: string){
    if(this.dataSource.filteredData.length){
      let [dataHeaderArray, firstPensionList] = this.generateExcelOrPdfData()
    this.loader.show()
    this.commonService.downloadPdf(`#${id}`, name, name,  firstPensionList, dataHeaderArray)
    this.loader.hide()    
}
  }

  exportToExcel(name: string){
    
    if(this.dataSource && this.dataSource?.filteredData && this.dataSource.filteredData.length){
      
    this.loader.show()
    let  [dataHeaderArray, firstPensionList] = this.generateExcelOrPdfData()
    this.commonService.exportTOExcel(firstPensionList, dataHeaderArray,"First Payment Report")
  this.loader.hide()  
  }
  }

 

}
