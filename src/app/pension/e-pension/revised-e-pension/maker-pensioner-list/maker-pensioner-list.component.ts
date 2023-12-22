
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
import { PensionInitiateOfficeComponent } from '../../pension-initiate-office/pension-initiate-office.component';
import { RevisedPensionerDetailsComponent } from '../revised-pensioner-details/revised-pensioner-details.component';
import { CommonService } from 'src/app/services/common.service';



@Component({
  selector: 'app-maker-pensioner-list',
  templateUrl: './maker-pensioner-list.component.html',
  styleUrls: ['./maker-pensioner-list.component.scss']
})
export class MakerPensionerListComponent implements OnInit {

 
  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = ['Pensioner ID','employeeCode','name','designationName',"document","Initiate Pension",'Action'];
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
    private tokenInfo:TokenManagementService,
    public common:CommonService) {
    this.encryptMode = true;
  }
  ngOnInit(): void {
    this._Service.configMenu = { url: "Inbox  >  Maker Pensioner List" };
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
"inMstType": 4,
"officeId":this.userdetails.officeid
}
this.load.show();
this._Service.postdetype(data, "workMultiTask").subscribe({
  //this._Service.postRequestpension(data, "getToBeRetiringEmployeeListByDeptId").subscribe({
    next: (res) => {
      this.load.hide();
      if (res.status === "SUCCESS") {
        if (res == '') {
          alert("Not Record Found");
        }
        else {
console.log("pensioner list",res.data)
          this.dataSource = new MatTableDataSource(JSON.parse(res.data));
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

 
 
  View_ESSPension(data:any){

    this.dialog.open(RevisedPensionerDetailsComponent, { panelClass: 'dialog-w-60', data: { message: data,isShow:1 } , disableClose: false }).afterClosed()
    .subscribe((data:any) => {
      
     
    });
     
  }
  
  redirectToPensionESS(data1:any)
  {
    
    var data = {
     "pensionerId": data1.pensionerId,
    };   
    this._Service.postPssRequest( data,"getprofiledetails").subscribe((res: any) => {    
      if (res.data && res.data.length > 0) 
      {  
         
        console.log("Header Pensioner data ",res.data[0])
        this.config.storeDetails("pensionerData",JSON.stringify(res.data[0]))       
             
        this.config.storeDetails("maker",'1') 
        
        this.router.navigate(['pension/revised/pension-ess'])
        
       
      }        
     }) 
  }
}
