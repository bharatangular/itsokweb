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
  selector: 'app-pss-life-certificate-report',
  templateUrl: './pss-life-certificate-report.component.html',
  styleUrls: ['./pss-life-certificate-report.component.scss']
})
export class PssLifeCertificateReportComponent implements OnInit {


  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = [
    'sNo',
    'empId',
    'empCode',
    'approveDate',
    'name',
    'pensionerId',
    'ppoNo',
    'document'
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
    public commonService: CommonService,
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
      ////console.log(passedData)
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
    //  this.pssLifeCertificate();
    
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
    this.pssLifeCertificate();
  }
  
  
  reviceParamsfilter(data:any){
    this.deptId = data?.departmentControl?.v_DEPT_ID ? data.departmentControl.v_DEPT_ID : 0;
    this.officeId = data?.officeControl?.offcId ? data.officeControl.offcId : 0;
    this.pssLifeCertificate();
  }

  generateExcelOrPDFData() {
    const pensionerList: any[] = [];
      const filteredData = this.dataSource.filteredData;
      const dataHeaderArray = [
       {
        sNo: "S.No",
        empId: "Emp Id",
        empCode: "Emp Code",
        approveDate: "Approve Date",
        name: "Name",
        pensionerId: "Pensioner Id",
        ppoNo: "PPO No",
      } 
    ];

   
  for(const eachData of filteredData) {
    let eachObj: any = {}
      eachObj["sNo"] = eachData.sNo;
      eachObj["empId"] = eachData.empId ;
      eachObj["empCode"] = eachData.empCode;
      eachObj["approveDate"] = eachData.approveDate;
      eachObj["name"] = eachData.name;
      eachObj["pensionerId"] = eachData.pensionerId;
      eachObj["ppoNo"] = eachData.ppoNo;
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
    this.commonService.exportTOExcel(pensionerList, dataHeaderArray, "Pss Life Certificate ");
    this.loader.hide();   
    } 
  }


pssLifeCertificate(){
  let payload = {}


this.loader.show()
  this._Service.postPssLifeCertificate('getPssLifeCertificateReport',payload).subscribe({
    next:(res:any)=>{
      console.log(res);
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
      console.log(err);
      this.loader.hide()
    },
    complete: ()=>{
      this.loader.hide()
    }
  })



  // this._Service.postPssLifeCertificate().subscribe((res: any) => {
  
  //     let data 
  //     if(res?.data)
  //     data = res?.data
  //     for(let eachDataIndex = 0; eachDataIndex< data.length ; eachDataIndex++) {
  //       let eachObj = {"sNo" : Number(eachDataIndex) + 1}
  //       data[eachDataIndex] = {["sNo"]: Number(eachDataIndex) + 1, ...data[eachDataIndex]}


  //     }
  //     this.dataSource = new MatTableDataSource(data);
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //     this.loader.hide()

  // });


}

}



