
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
  selector: 'app-revised-pensioner-list',
  templateUrl: './revised-pensioner-list.component.html',
  styleUrls: ['./revised-pensioner-list.component.scss']
})
export class RevisedPensionerListComponent implements OnInit {

  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = ['employeeCode','name','designationName','dateOfJoining','dateOfRetirement',"reason","document","Initiate Pension",'Action'];
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
    this._Service.configMenu = { url: "Inbox  >  Revised Pensioner List" };
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
"officeId":this.userdetails.officeid,

"serviceCategoryId":1500,
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
    this.config.storeDetails("reqId","");
    this.config.storeDetails("transid","")
    this.config.storeDetails("taskRoleId","")
    this.config.storeDetails("wfProcessId","")
    this.config.storeDetails("pkEsignData","");
    this.config.storeDetails("esigntype","");
    this.config.storeDetails("approverSubmitData","");
    
  this.router.navigate(
    ['/pension/revised/revised-pension'],
    {queryParams: {r:"wqSqurs"}}
  ); 

    //  localStorage.setItem("employeeCode",employeeCode)
    //  localStorage.setItem("employeeId",employeeId)
    //  localStorage.setItem("psnType",psnType)
     
  }
  changeInitiateOffice(data:any)
  {
  
  }
  View_ESSPension(data:any){

    this.dialog.open(RevisedPensionerDetailsComponent, { panelClass: 'dialog-w-60', data: { message: data,isShow:1 } , disableClose: false }).afterClosed()
    .subscribe((data:any) => {
      
     
    });
     
  }
  getDocId(row:any)
  {
  
    let data = {
  "inMstType":27,
  "inValue":0,
  "inValue2":0,
  "inValue3":row.employeeCode
  }
  
    this._Service.postho('allmstdata', data).subscribe((res:any) => {
      console.log("res",res)
     if(res.status=='SUCCESS')
     {
      if(res.data!=null)
      {
        let picdata=JSON.parse(res.data);
        let pkdoc:any
        console.log(picdata)
        picdata.forEach((element:any) => {
          if(element.vdocTypeId=='34')
          {
            pkdoc=element.vdmsDocId
          }
        });
        this.common.Previewbydocid(pkdoc,'pension/revised/revised-pension-list');
      }
     }
  
    })
  }
  
}
