
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
import { PensionInitiateOfficeComponent } from '../pension-initiate-office/pension-initiate-office.component';

@Component({
  selector: 'app-pensioner-list',
  templateUrl: './pensioner-list.component.html',
  styleUrls: ['./pensioner-list.component.scss']
})

export class PensionerListComponent implements OnInit {


  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = ['employeeCode','name','designationName','dateOfJoining','dateOfRetirement',"Initiate Pension",'Action'];
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
  // "officeId": this.userdetails.officeid,
  "serviceCategoryId":null,
  "departmentId":null
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
console.log("pensioner list",res.data)
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

  View_Profile(employeeCode:any,employeeId:any,psnType:any,psnTypeId:any){
    this.config.storeDetails("employeeCode",employeeCode)
    this.config.storeDetails("employeeId",employeeId)
    this.config.storeDetails("psnType",psnType)
    this.config.storeDetails("psnTypeId",psnTypeId)
    this.config.storeDetails("pkEsignData","");
    this.config.storeDetails("esigntype","");
    this.config.storeDetails("approverSubmitData","");
     this.router.navigate(['/pension/e-Pension/Profile']);
    //  localStorage.setItem("employeeCode",employeeCode)
    //  localStorage.setItem("employeeId",employeeId)
    //  localStorage.setItem("psnType",psnType)
     
  }
  changeInitiateOffice(data:any)
  {
    this.dialog.open(PensionInitiateOfficeComponent, { panelClass: 'dialog-w-60', data: { message: data } , disableClose: true }).afterClosed()
    .subscribe((data:any) => {
      this.getMonthlyDetail();
     
    });;
  }
  View_ESSPension(employeeCode:any,employeeId:any,psnType:any){
    this.config.storeDetails("employeeCode",employeeCode)
    this.config.storeDetails("employeeId",employeeId)
    this.config.storeDetails("psnType",psnType)
    this.config.storeDetails("pkEsignData","");
    this.config.storeDetails("esigntype","");
    this.config.storeDetails("approverSubmitData","");
     this.router.navigate(['/pension/e-Pension/ViewESSPension']);
    //  localStorage.setItem("employeeCode",employeeCode)
    //  localStorage.setItem("employeeId",employeeId)
    //  localStorage.setItem("psnType",psnType)
     
  }

}
