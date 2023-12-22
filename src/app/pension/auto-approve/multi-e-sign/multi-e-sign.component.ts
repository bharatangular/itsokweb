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
import { AutoApproveDialogComponent } from '../auto-approve-dialog/auto-approve-dialog.component';


@Component({
  selector: 'app-multi-e-sign',
  templateUrl: './multi-e-sign.component.html',
  styleUrls: ['./multi-e-sign.component.scss']
})
export class MultiESignComponent implements OnInit {

 
  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = ['employeeCode','name','designationName','dateOfJoining','dateOfRetirement','Action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
  constructor(public dialog: MatDialog, 
    private _Service: PensionServiceService, 
    private modalService: NgbModal,
    private _snackBar: MatSnackBar,
    private router:Router,
    private load:LoaderService,
    private tokenInfo:TokenManagementService) {
    this.encryptMode = true;
  }
  ngOnInit(): void {

    this.empinfo=this.tokenInfo.empinfoService;
   this.userdetails=this.config.getUserDetails();
   console.log("this.userdetails",this.userdetails)

    this.getMonthlyDetail();
    // localStorage.setItem("employeeCode",'')
    // localStorage.setItem("employeeId",'')
    this.config.storeDetails("employeeCode",'')
    this.config.storeDetails("employeeId",'')
this._Service.url="Inbox >  PensionerList"
  }
// aa
  getMonthlyDetail(){

    let data = {
  "ddoId":null,
 "officeId":null,
//"serviceCategoryId":null,
  //"departmentId":null
  //"officeId": this.userdetails.officeid,
  "serviceCategoryId":99,
  "departmentId":this.userdetails.assignmentid
  }
  this.load.show();
  this._Service.postUpcomingpension(data, "getUpcomingPensionersList").subscribe({
    //this._Service.postRequestpension(data, "getToBeRetiringEmployeeListByDeptId").subscribe({
      next: (res) => {
        this.load.hide();
        if (res.status === "SUCCESS") {
          if (res == '') {
            alert("Not Record Found");
          }
          else {

            this.dataSource = new MatTableDataSource(res.data);
            this.dataSource.paginator = this.paginator;
          }
        }
      },
      error: (err) => {
        this.load.hide();
        console.log(err);
        this.error = err
      
      }
    })
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  View_ESSPension(employeeCode:any,employeeId:any,psnType:any,empOfficeId:any,traseCode:any,assignmentId:any,dor:any){
    let data={
      "employeeCode":employeeCode,
      "employeeId":employeeId,
      "psnType":psnType,
      "officeId":empOfficeId,
      "traseCode":traseCode,
      "assignmentId":assignmentId,
      "dor":dor
    }
    this.dialog.open(AutoApproveDialogComponent, { width: '70%', data: { message: data }, disableClose: false }).afterClosed()
    .subscribe((data:any) => {
      this.getMonthlyDetail();

    });
     
  }

}
