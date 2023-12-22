import { Component, OnInit, ViewChild , Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from 'src/app/services/loader.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { MarkEmpRelieveDialogComponent } from '../../mark-emp-relieve-dialog/mark-emp-relieve-dialog.component';
import { AppConfig } from 'src/app/app.config';
import { TokenManagementService } from 'src/app/services/token-management.service';
@Component({
  selector: 'app-mark-employee-relieve',
  templateUrl: './mark-employee-relieve.component.html',
  styleUrls: ['./mark-employee-relieve.component.scss'],
})
export class MarkEmployeeRelieveComponent implements OnInit {
  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = ['employeeCode','name','designationName','dateOfJoining','dateOfRetirement','deptName','Action'];
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
    this.userdetails=this.config.getUserDetails();
    console.log("this.userdetails",this.userdetails)
    this._Service.getCurrentDate()
    console.log(this._Service.currentDate)
    this.currentDate =new Date(this._Service.currentDate);
    // this.currentDate.setHours(0,0,0,0)
  //  this.currentDate= this.datePipe.transform(d,'dd-MMM-yyyy')
   console.log(this.currentDate)
    this.empinfo=this.tokenInfo.empinfoService;
    this.getMonthlyDetail();
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
    this.load.show();
    let data = {
      "ddoId":null,
       "officeId": this.userdetails.officeid,
      //"officeId": null,
      "serviceCategoryId":98,
      "departmentId":null
  }
  this._Service.postUpcomingpension(data, "getUpcomingPensionersList").subscribe({
      next: (res) => {
        this.load.hide();
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
    this.dialog.open(MarkEmpRelieveDialogComponent, { panelClass: 'dialog-w-30', data: { empDetail: empDetail }, height: '60%', width: '80%' });
  }

}
