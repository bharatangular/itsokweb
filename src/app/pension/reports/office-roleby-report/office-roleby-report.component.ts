import { Component, ElementRef, OnInit, ViewChild ,AfterViewInit, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import 'jspdf-autotable';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-office-roleby-report',
  templateUrl: './office-roleby-report.component.html',
  styleUrls: ['./office-roleby-report.component.scss']
})
export class OfficeRolebyReportComponent implements OnInit {

  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = ['DEPT_NAME','OFFICE_NAME','PROCESS_NAME','PSN_ZONE_OFC_NAME','MAKER','CHECKER','APPROVER','AUDITOR','AAO','ZONALAPPROVER','ADAPPROVER','TOTAL_RQST'];
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
  enhancePsnList: any;
 
  constructor(public dialog: MatDialog, 
    private load:LoaderService,
    private tokenInfo:TokenManagementService,
    private ApiUrlService: PensionServiceService,
    private _snackBar: MatSnackBar,
    public _dialog: MatDialog,
    private routers: Router,
    private commonService: CommonService) { }

  ngOnInit(): void {
    
    this.empinfo=this.tokenInfo.empinfoService;
    this.userdetails=this.config.getUserDetails();
    console.log("this.userdetails",this.userdetails)
    this.getMonthYear();
   
  }
  reportYear:any;
  reportmonth:any;
psnmonth:any[]=[];
psnYear:any[]=[];
getMonthYear()
{
  this.ApiUrlService.postUpcomingpension({}, "getYearMonth").subscribe((res:any)=>{
console.log("res",res.data)
this.psnmonth=res.data;

this.psnYear = [...new Map(this.psnmonth.map((item:any) =>
  [item['psnYear'], item])).values()];

  let date=new Date();
  console.log("month",date.getFullYear())
  this.reportmonth=date.getMonth()+1;
  this.reportYear=date.getFullYear();
  this.enhancePensionDtls();
  });

}
reset()
{
  let date=new Date();
  console.log("month",date.getFullYear())
  this.reportmonth=date.getMonth()+1;
  this.reportYear=date.getFullYear();
  this.enhancePensionDtls();
}
  enhancePensionDtls()
  {

      let data = {
          "officeId" : this.userdetails.officeid,
          "processId" : "18",
          "deptId" : "",
          "psnZoneOfcId" : "",
          "actionTaken" : "",
          "flag" : ""
      }
 
  this.ApiUrlService.post('getrolewisereport', data).subscribe((res:any) => {
    console.log('aa',res.data)
    res=res.data
    this.enhancePsnList = JSON.parse(res.recordData)
    console.log( this.enhancePsnList)
     //console.log(res.data)
    this.dataSource = new MatTableDataSource(this.enhancePsnList);
    this.dataSource.paginator = this.paginator;

  })
  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToPdf(){
    this.commonService.exportToPdf(this.el.nativeElement);    
  }

  exportToExcel(){
    this.commonService.getResData=this.enhancePsnList;
    // this.commonService.exportToExcel();
  }

  // exportToExcel(): void {

  //   const worksheet: WorkSheet = utils.json_to_sheet(this.enhancePsnList);
  //   const workbook: WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
  //   const excelBuffer: any = writeFile(workbook, 'data.xlsx', { bookType: 'xlsx' });
  //   const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   FileSaver.saveAs(file, 'data.xlsx');
  // }

}

