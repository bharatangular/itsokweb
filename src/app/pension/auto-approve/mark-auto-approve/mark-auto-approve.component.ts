import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
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
import { PensionInitiateOfficeComponent } from '../../e-pension/pension-initiate-office/pension-initiate-office.component';
import { MarkEmpDeDialogComponent } from '../../mark-de/mark-emp-de-dialog/mark-emp-de-dialog.component';
import { ViewPensionEssComponent } from '../../e-pension/view-pension-ess/view-pension-ess.component';
import { CommonDialogComponent } from '../../common-dialog/common-dialog.component';

@Component({
  selector: 'app-mark-auto-approve',
  templateUrl: './mark-auto-approve.component.html',
  styleUrls: ['./mark-auto-approve.component.scss'],
})
export class MarkAutoApproveComponent implements OnInit {
  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = [
    'employeeCode',
    'name',
    'designationName',
    'dateOfJoining',
    'dateOfRetirement',
    'Stop Auto Approve',
    'Action',
  ];
  displayedColumns1: string[] = [
    'employeeCode',
    'name',
    'designationName',
    'dateOfJoining',
    'dateOfRetirement',
    'Release Auto Approve',
  ];
  dataSource!: MatTableDataSource<any>;
  dataSource1!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  datalist: any = [];
  countDetail: any;
  inboxData: any = [];
  psnmonth:any[]=[];
  psnYear:any[]=[];

  showerror: boolean = false;
  error: string = '';
  empinfo: any;
  isShow = true;
  selectedDate:Date;

  encryptMode: boolean = false;
  stopList:any = [];
  textToConvert: any;
  password: any;
  currentMonth:number;
  currentYear:number;
  conversionOutput: any;
  userdetails: any;
  config: AppConfig = new AppConfig();
  reportYear: any;
  reportmonth: any;
  pensionerList: any;
  selectedTabValue=0;
  constructor(
    public dialog: MatDialog,
    private _Service: PensionServiceService,
    private modalService: NgbModal,
    private _snackBar: MatSnackBar,
    private router: Router,
    private load: LoaderService,
    private tokenInfo: TokenManagementService,
    private cd: ChangeDetectorRef,
  ) {
    this.encryptMode = true;
    const currentDate = new Date();
    this.currentMonth = currentDate.getMonth() + 1;
    this.currentYear = currentDate.getFullYear();
  }


  ngOnInit(): void {
    this._Service.configMenu = { url: 'Stop Auto Approve' };
    this.empinfo = this.tokenInfo.empinfoService;
    this.userdetails = this.config.getUserDetails();
    console.log('this.userdetails ========>', this.userdetails);
    this.getMonthYear();
    let data ={index:0}
    // this.getMonthlyDetail();
    this.changeTab(data);
    // this.stopPensionerList();
    // localStorage.setItem("employeeCode",'')
    // localStorage.setItem("employeeId",'')
    this.config.storeDetails('employeeCode', '');
    this.config.storeDetails('employeeId', '');
  }

  getMonthYear()
  {

    this._Service.postUpcomingpension({}, "getYearMonth").subscribe((res:any)=>{

  console.log("res",res.data)
  this.psnmonth=res.data;
  console.log("inside psn month ",this.psnmonth);

  this.psnYear = [...new Map(this.psnmonth.map((item:any) =>
    [item['psnYear'], item])).values()];

    let date=new Date();
    console.log("month",date.getFullYear())
    this.reportmonth=date.getMonth()+1;
    this.reportYear=date.getFullYear();
    this.upcomingPensioner();
    });

  }
  // aa
  getMonthlyDetail() {

        let data = {
      "ddoId":null,
     "officeId":null,
      // "officeId": this.userdetails.officeid,
      "serviceCategoryId":null,
      "departmentId":null
      }
      // postUpcomingpension

      this._Service.postUpcomingpension( data,"getUpcomingPensionersList").subscribe({
        //this._Service.postRequestpension(data, "getToBeRetiringEmployeeListByDeptId").subscribe({
          next: (res) => {
            this.load.hide();
            if (res.status === "SUCCESS") {
              if (res == '') {
                alert("Not Record Found");
              }
              else {
                this.load.show();
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

  changeTab(data1:any){



    // this.reset()


    console.log("current month ==============>" , this.currentMonth);
    console.log("current year =========>", this.currentYear);
    this.selectedTabValue = data1.index;
    console.log("data1========>",data1 );
    let data:any = {
      "ddoId":this.currentMonth,
      "officeId":this.currentYear,
       "departmentId":null
    }
    if(data1.index == 0)
    {
      data["serviceCategoryId"] = 1600
    }
    else{
      data["serviceCategoryId"] = 1700
    }

    this.load.show();
    this._Service.postUpcomingpension( data,"getUpcomingPensionersList").subscribe({
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

  upcomingPensioner()
  {

    let data:any = {
      "ddoId":this.currentMonth,
      "officeId":this.currentYear,
       "departmentId":null,

    }
    if(this.selectedTabValue == 0)
    {
      data["serviceCategoryId"] = 1600
    }
    else{
      data["serviceCategoryId"] = 1700
    }


  this.load.show();
  this._Service.postCumm( "getUpcomingPensionersList",data).subscribe({
      next: (res:any) => {

        console.log("res",res)
        this.load.hide();
        if (res.status === "SUCCESS") {
          if (res == '') {
            alert("Not Record Found");
          }
          else {
            if(res.data)
            {
              console.log("pensioner list",res.data)
              this.dataSource = new MatTableDataSource(res.data);
              this.dataSource.paginator = this.paginator;
            }else
            {
              let data:any[]=[]
              this.dataSource = new MatTableDataSource(data);
              console.log(this.dataSource , "this.dataSource" )
              this.dataSource.paginator = this.paginator;

            }


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

  reset()
  {

    let date=new Date();
    console.log("month",date.getFullYear())
    this.currentMonth=date.getMonth()+1;
    this.currentYear=date.getFullYear();
    this.upcomingPensioner();
  }
  // stopPensionerList(){

  //   let json = {
  //     "inType": 15
  //   }
  //   console.log(this.userdetails);
  //   this._Service.postNewEmployee("getPensionRevertEmpDetails",json).subscribe({
  //     //this._Service.postRequestpension(data, "getToBeRetiringEmployeeListByDeptId").subscribe({
  //       next: (res) => {
  //         this.load.hide();
  //         if (res.status === "SUCCESS") {
  //           if (res == '') {
  //             alert("Not Record Found");
  //           }
  //           else {
  //             this.load.show();
  //             console.log("pensioner list",res.data.data)
  //             this.dataSource = new MatTableDataSource(res.data.data);
  //             console.log("datasource ===============" ,this.dataSource)
  //             this.dataSource.paginator = this.paginator;
  //             this.stopList = res.data.data;
  //             console.log(this.stopList);
  //           }
  //         }
  //       },
  //       error: (err) => {
  //         this.load.hide();
  //         console.log(err);
  //         this.error = err

  //       }
  //     })
  // }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  View_Profile(employeeCode: any, employeeId: any, psnType: any) {
    this.config.storeDetails('employeeCode', employeeCode);
    this.config.storeDetails('employeeId', employeeId);
    this.config.storeDetails('psnType', psnType);

    this.config.storeDetails('pkEsignData', '');
    this.config.storeDetails('esigntype', '');
    this.config.storeDetails('approverSubmitData', '');
    this.router.navigate(['/pension/e-Pension/Profile']);
    //  localStorage.setItem("employeeCode",employeeCode)
    //  localStorage.setItem("employeeId",employeeId)
    //  localStorage.setItem("psnType",psnType)
  }
  changeInitiateOffice(data: any) {
    this.dialog
      .open(PensionInitiateOfficeComponent, {
        panelClass: 'dialog-w-60',
        data: { message: data },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((data: any) => {
        this.getMonthlyDetail();
      });
  }
  View_ESSPension(employeeCode: any, employeeId: any, psnType: any, row: any) {
    this.config.storeDetails('employeeCode', employeeCode);
    this.config.storeDetails('employeeId', employeeId);
    this.config.storeDetails('psnType', psnType);
    this.config.storeDetails('pkEsignData', '');
    this.config.storeDetails('esigntype', '');
    this.config.storeDetails('approverSubmitData', '');
    console.log('inside view calculation ', row);
    let data = {
      isdialog: true,
      empData: row,
    };
    this.dialog
      .open(ViewPensionEssComponent, {
        panelClass: 'dialog-w-30',
        data: { message: data },
        height: '70%',
        width: '80%',
      })
      .afterClosed()
      .subscribe((data: any) => {});
    //  this.router.navigate(['/pension/e-Pension/ViewESSPension']);
    //  localStorage.setItem("employeeCode",employeeCode)
    //  localStorage.setItem("employeeId",employeeId)
    //  localStorage.setItem("psnType",psnType)
  }
  openStopAutoApprove(data: any) {
    // console.log('json data', data);
    // const index =  this.dataSource.data.findIndex(item => item.employeeId === data.employeeId)
    // if(index>=0){
    //   this.dataSource.data.splice(index,1);
    //   this.dataSource.data = [...this.dataSource.data]
    // }
    // console.log(this.userdetails)
    this.dialog
      .open(CommonDialogComponent, {
        panelClass: 'dialog-w-50',
        autoFocus: false,
        height: 'auto',
        width: 'calc(100% - 50%)',
        data: {
          message: 'Stop Auto Process',
          id: 40,
          btnText: 'Stop',
          empData: data,
        },
      })
      .afterClosed()
      .subscribe((response) => {
        let data ={index:0}
        // this.getMonthlyDetail();
        this.changeTab(data);
        // this.stopPensioner
        console.log('json data', response);
      });
  }
  markDeEmployee(empDetail: any) {
    this.dialog
      .open(MarkEmpDeDialogComponent, {
        panelClass: 'dialog-w-30',
        data: { empDetail: empDetail, empDe: false },
        height: '60%',
        width: '80%',
      })
      .afterClosed()
      .subscribe((data: any) => {});
  }
  openMarkAutoApprove(row: any) {
    this.dialog
      .open(CommonDialogComponent, {
        panelClass: 'dialog-w-50',
        autoFocus: false,
        height: 'auto',
        width: 'calc(100% - 50%)',
        data: {
          message: 'Release Auto Process',
          id: 41,
          btnText: 'Release',
          empData: row,
        },
      })
      .afterClosed()
      .subscribe((response) => {
        let data ={index:1}
        // this.getMonthlyDetail();
        this.changeTab(data);
        console.log('json data', response);
      });
  }
}
