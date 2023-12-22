import { Component, ElementRef, OnInit, ViewChild ,AfterViewInit, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import * as CryptoJS from 'crypto-js';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { AutoApproveDialogComponent } from '../auto-approve-dialog/auto-approve-dialog.component';
import { RevisedAutoApprovedDialogComponent } from '../revised-auto-approved-dialog/revised-auto-approved-dialog.component';
import { CommonDialogComponent } from '../../common-dialog/common-dialog.component';
import { CommonService } from 'src/app/services/common.service';
import { EsignModalComponent } from '../../esign-modal/esign-modal.component';
@Component({
  selector: 'app-revised-pensioner-list',
  templateUrl: './revised-pensioner-list.component.html',
  styleUrls: ['./revised-pensioner-list.component.scss']
})
export class RevisedPensionerListComponent implements OnInit {


  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = ['requestId','employeeCode','name','pensionerId','ppono','dateOfRetirement','Old Pension Kit','Action'];
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
    public common:CommonService,
    public actRoute:ActivatedRoute) {
    this.encryptMode = true;
   
  }
  ngOnInit(): void {
    this._Service.configMenu = { url: "Inbox > Revised Pensioners" };
    this.empinfo=this.tokenInfo.empinfoService;
   this.userdetails=this.config.getUserDetails();
   console.log("this.userdetails",this.userdetails)
   this.actRoute.queryParams.subscribe(params => {

    var esignRes = params['status'];
    var id = params['id'];
    var makerRevert = params['m'];
   
    if (esignRes) {
      if (id) {

        this.getEsignData(id);

      }
    }

  });
   this.getRevisedPensionerList();
   
    // localStorage.setItem("employeeCode",'')
    // localStorage.setItem("employeeId",'')
    this.config.storeDetails("employeeCode",'')
    this.config.storeDetails("employeeId",'')
this._Service.url="Inbox >  PensionerList"
  }
  esignData:any;
  getEsignData(id: any) {

    let data = {
      "trxnNo": id,
      "databaseKey": "3"
    }
    let url = "esignTransaction";

    this._Service.postNewEsign(url, data).subscribe((res: any) => {


      this.esignData = JSON.parse(res);
      if (this.esignData.responseStatus == '1') {
        this.updateDocId(34)
        let data = {
          "esignRes": "SUCCESS",
          "transId": id,
          "redirectUrl": "pension/Inbox"
          
         
        }
      

        this.dialog.open(EsignModalComponent, { panelClass: 'dialog-w-30', data: { message: data } });
        

      
      } else {
        
          let data = {
            "esignRes": "failed",
            "type": "",
            "redirectUrl": "pension/Inbox",

          }
          this.dialog.open(EsignModalComponent, { panelClass: 'dialog-w-30', data: { message: data } });
        
      }
      //console.log("esignData", this.esignData);
    })
  }
  updateDocId(docTypeId: any) {
    let pensionerId = this.config.getDetails("pensionerId");
   
    let data = {
      "dmsDocId": this.esignData.docId,
      "pensionerId": pensionerId,
      "docTypeId": docTypeId
    }
    this._Service.postPssRequest(data, "pensionerdocument").subscribe({
      next: (res) => {
        //console.log("res", res);
        if (res.status == "SUCCESS") {
        } else {
          // alert("Something went wrong");
        }
      },
      error: (err) => {
        // alert("Something went wrong");
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }
    })
  }

// aa
  getMonthlyDetail(){

    let data = {
  "ddoId":null,
 "officeId":null,
"serviceCategoryId":null,
  "departmentId":null
  //"officeId": this.userdetails.officeid,
  // "serviceCategoryId":99,
  // "departmentId":this.userdetails.assignmentid
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
  forwardCommutation(data:any)
  {
    

  }
getRevisedPensionerList()
{
  let data:any;
  if(this.userdetails.roleid==3)
  {
    data={
      'officeId':this.userdetails.officeid,"inType":1
    }
  }else if(this.userdetails.roleid==6)
  {
    data={
      'officeId':this.userdetails.officeid,"inType":2
    }
  }
  this._Service.postPssRequest(data,"getrevisepensiondtls").subscribe((res:any)=>
  {
    console.log("res",res)
    if(res.data[0]?.msg=='no data available')
    {
      let data:any[]=[]
      this.dataSource = new MatTableDataSource(data);
    }else
    {
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
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


  View_ESSPension(employeeCode:any,employeeId:any,psnType:any,empOfficeId:any,traseCode:any,assignmentId:any,dor:any,item:any){
    let data={
      "employeeCode":employeeCode,
      "employeeId":employeeId,
      "psnType":psnType,
      "officeId":empOfficeId,
      "traseCode":traseCode,
      "assignmentId":this.userdetails.assignmentid,
      "dor":dor,
      "item":item,
    }
    this.dialog.open(RevisedAutoApprovedDialogComponent, { width: '60%', data: { message: data }, disableClose: true }).afterClosed()
    .subscribe((data:any) => {
      // this.getRevisedPensionerList();
      if(data=='Y')
      {
        this.router.navigate(['pension/e-Pension/hoApproveList'])
      }else
      {
        this.getRevisedPensionerList();
      }
     
    });
     
  }

}

