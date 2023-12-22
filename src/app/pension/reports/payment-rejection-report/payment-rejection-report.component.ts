
import { Component, ElementRef, OnInit, ViewChild ,AfterViewInit, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';

import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import * as CryptoJS from 'crypto-js';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-payment-rejection-report',
  templateUrl: './payment-rejection-report.component.html',
  styleUrls: ['./payment-rejection-report.component.scss']
})
export class PaymentRejectionReportComponent implements OnInit {
  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = ['employeeCode','name','deptName','designationName','homeDistrictName','dateOfBirth','dateOfJoining','dateOfRetirement'];
  dataSource!: MatTableDataSource<any>;
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
  isShow=true;

  encryptMode: boolean= false;
  textToConvert: any;
  password: any;
  conversionOutput: any;
  userdetails:any;
  config:AppConfig=new AppConfig()
  pensionerList:any;
  constructor(public dialog: MatDialog, 
    private _Service: PensionServiceService, 
    private modalService: NgbModal,
    private _snackBar: MatSnackBar,
    private router:Router,
    private load:LoaderService,
    private commonService: CommonService,
    private tokenInfo:TokenManagementService) 
    { 
       this.encryptMode = true;
    }

  ngOnInit(): void {

    this.empinfo=this.tokenInfo.empinfoService;
    this.userdetails=this.config.getUserDetails();
    console.log("this.userdetails",this.userdetails)
 this.getMonthYear();
    
     // localStorage.setItem("employeeCode",'')
     // localStorage.setItem("employeeId",'')
     this.config.storeDetails("employeeCode",'')
     this.config.storeDetails("employeeId",'')
     this._Service.url="Inbox >  PensionerList"
    
  }
  reportYear:any;
  reportmonth:any;
psnmonth:any[]=[];
psnYear:any[]=[];
getMonthYear()
{
  this._Service.postUpcomingpension({}, "getYearMonth").subscribe((res:any)=>{
console.log("res",res.data)
this.psnmonth=res.data;

this.psnYear = [...new Map(this.psnmonth.map((item:any) =>
  [item['psnYear'], item])).values()];

  let date=new Date();
  console.log("month",date.getFullYear())
  this.reportmonth=date.getMonth()+1;
  this.reportYear=date.getFullYear();
  this.upcomingPensioner();
  });

}
reset()
{
  let date=new Date();
  console.log("month",date.getFullYear())
  this.reportmonth=date.getMonth()+1;
  this.reportYear=date.getFullYear();
  this.upcomingPensioner();
}
  upcomingPensioner()
  {

    let data = {
  "ddoId":null,
  "officeId":null,
 // "officeId": this.userdetails.officeid,
  "serviceCategoryId":null,
  "departmentId":null
  }
  this.load.show();
  this._Service.postUpcomingpension(data, "getUpcomingPensionersList").subscribe({
      next: (res) => {
        this.load.hide();
        if (res.status === "SUCCESS") {
          if (res == '') {
            alert("Not Record Found");
          }
          else {

            this.dataSource = new MatTableDataSource(res.data);
            console.log(this.dataSource , "this.dataSource" )
            this.dataSource.paginator = this.paginator;

              this.pensionerList=res.data;

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
  ngAfterViewInit() {
  
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToPdf(){

    // this.commonService.exportToPdf(this.el.nativeElement);
    this.load.show()
    this.commonService.downloadPdf("#Payment_Rejection","Payment Rejection", "Payment Rejection Report")
    this.load.hide()
  }

    
  exportToExcel(){
    // this.commonService.getResData=this.pensionerList;
    // this.commonService.exportToExcel();
    const pensionerList = JSON.parse(this.pensionerList);
    this.load.show()
    this.commonService.ExportTOExcel(pensionerList,"Payment Rejection")
    this.load.hide();
  }

 
  
}
