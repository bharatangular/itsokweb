import { Component, OnInit, ViewChild , Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from 'src/app/services/loader.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
//import { MarkEmpRelieveDialogComponent } from '../pension/mark-emp-relieve-dialog/mark-emp-relieve-dialog.component';
import { AppConfig } from 'src/app/app.config';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { MarkEmpDeDialogComponent } from '../mark-emp-de-dialog/mark-emp-de-dialog.component';


@Component({
  selector: 'app-mark-employee-de',
  templateUrl: './mark-employee-de.component.html',
  styleUrls: ['./mark-employee-de.component.scss']
})
export class MarkEmployeeDeComponent implements OnInit {

  // constructor() { }

  // ngOnInit(): void {
  // }

  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = ['employeeCode','name','designationName','dateOfJoining','dateOfRetirement','deptName','Amount','Commencement','totalDcrgAmt','Action',];
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
  config:AppConfig=new AppConfig();
  currentDate: any;
  userdetails:any;
  
  constructor(public dialog: MatDialog, private _Service: PensionServiceService,private _snackBar: MatSnackBar,private tokenInfo:TokenManagementService,
    private load:LoaderService,private datePipe: DatePipe) {
          this.encryptMode = true;
  }
  ngOnInit(): void {
    this._Service.configMenu = { url: "Mark Employee DE" };
    this.userdetails=this.config.getUserDetails();
    console.log("this.userdetails",this.userdetails)
    this._Service.getCurrentDate()
    console.log(this._Service.currentDate)
    this.currentDate =new Date(this._Service.currentDate);
    // this.currentDate.setHours(0,0,0,0)
  //  this.currentDate= this.datePipe.transform(d,'dd-MMM-yyyy')
   console.log(this.currentDate)
    this.empinfo=this.tokenInfo.empinfoService;
    this.getDEList();
    // this.getMonthlyDetail()
    // localStorage.setItem("employeeCode",'')
    // localStorage.setItem("employeeId",'')
    this.config.storeDetails("employeeCode",'')
    this.config.storeDetails("employeeId",'')
    this._Service.url="Inbox >  PensionerList"
  }
  transformDate(date1:any)
  {
    if(date1!=''){
      let date2=new Date(date1)
    
      return date2;
    }else
    {
      return ""
    }
   
  }
  checkDate(row:any)
  {
    if(this.transformDate(row.dateOfRetirement) <= this.currentDate)
    {
      return true
    }else
    {
      return false
    }
  }
  getMonthlyDetail(){

    let data = {
      "ddoId":null,      
      "officeId": null,
      //"serviceCategoryId":null,
      // "officeId": this.userdetails.officeid,
       "serviceCategoryId":97,
      "departmentId":null
  }
  this._Service.postUpcomingpension(data, "getUpcomingPensionersList").subscribe({
      next: (res) => {
  
        if (res.status === "SUCCESS") {
          if (res == '') {
            this._snackBar.open('Error occurred :- ', 'Record not found', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          }
          else {
            this.dataSource = new MatTableDataSource(res.data);
            this.dataSource.paginator = this.paginator;
           
           
          }
        }
      },
      error: (err) => {
        console.log(err);
        this.error = err
        this._snackBar.open('Error occurred :- ', this.error, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    })
  }
getDEList()
{
  let data = {
   
    "officeId": this.userdetails.officeid
    //  "officeId": "17866"
}
this._Service.getUpcomPsnReport( "markdelist",data).subscribe({
    next: (res) => {

      if (res.status === "SUCCESS") {
        if (res == '') {
          this._snackBar.open('Error occurred :- ', 'Record not found', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
        else {
          this.dataSource = new MatTableDataSource(res.data);
          this.dataSource.paginator = this.paginator;
         
         
        }
      }
    },
    error: (err) => {
      console.log(err);
      this.error = err
      this._snackBar.open('Error occurred :- ', this.error, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
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

  relieveEmployee(empDetail: any){
    this.dialog.open(MarkEmpDeDialogComponent, { panelClass: 'dialog-w-30', data: { empDetail: empDetail,empDe:true }, height: '60%', width: '80%' }).afterClosed()
    .subscribe((data:any) => {
      this.getDEList();

    });;
  }


  // downloadPdf(base64String:any, fileName:any) {
  //   const source = `data:application/pdf;base64,${base64String}`;
  //   const link = document.createElement("a");
  //   link.href = source;
  //   link.download = `${fileName}.pdf`
  //   link.click();
  // }
  // onClickDownloadPdf(){
  
  //   this.downloadPdf(base64String,"sample");
  // }


}
