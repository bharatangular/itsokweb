import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { error } from 'console';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { AppConfig } from 'src/app/app.config';
import { TokenManagementService } from 'src/app/services/token-management.service';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  displayedColumns: string[] = ['Request ID','Initiator','Request Description','Created Date','Received From','Remarks','Action'];
  dataSource!: MatTableDataSource<any>;
  dr_Master!: FormGroup
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datalist: any = [];
  countDetail: any;
  inboxData: any = [];
  outboxData: any = [];
  draftData: any = [];
  showerror: boolean = false;
  pensionerbtn: boolean = false;
  pensionerBtn: boolean = false;
  error: string = '';
  empinfo: any;
  userinfo: any;
  makerToken:any;
  isShow=true;
  wfProcessId:any;
 roleList:any;
 userDetails:any={"role":"",
 "roleid" :"",
"assignmentid":""};
btn:boolean=false;
 selectedrole:any;
 ssoimg:any;
 config: AppConfig = new AppConfig();
  constructor(public dialog: MatDialog, private _Service: PensionServiceService, private modalService: NgbModal, private formbuilder: FormBuilder
    , private _snackBar: MatSnackBar,private router:Router,private tokenInfo:TokenManagementService) {

  }
  ngOnInit(): void {
    this._Service.url="Inbox"
    this.config.storeDetails("reqId",'')
    this.config.storeDetails("transid",'')
    this.config.storeDetails("taskRoleId",'')
    this.config.storeDetails("wfProcessId",'')
  
   this.userDetails = this.config.getUserDetails();
   console.log(this.userDetails);
   this.empinfo=this.tokenInfo.empinfoService;;
   this.userinfo =this.userDetails;
 
    this.getRoleNew();
    this.getInboxDetail(this.empinfo?.aid,this.userDetails.roleid, 'INBOX');
    
    this.getCount(this.empinfo?.aid,this.userDetails.roleid);
    this.ssoimg=sessionStorage.getItem("ssoimg");
    if(!this.ssoimg)
    {
      this.ssoimg="assets/images/male-avatar.png"
    }
  }
  getRoleNew()
  {
      var url="getuserpayeerolebyassignmentid";
    var data={
      "assignmentId":this.empinfo?.aid           
    };

    this._Service.postho(url,data).subscribe((res: any) => {
      
      console.log("rolelist11",res);
      if(res.status=='SUCCESS')
      {
    this.userDetails=this.config.getUserDetails();
    this.roleList=res.data;
console.log("");

  if(!this.userDetails.role && this.roleList.length>0)
  {
    this.userDetails['role']=this.roleList[0]?.payeeRoleName;
    this.userDetails['roleid']=this.roleList[0]?.payeeRoleId;   
    this.userDetails['officeid']=this.roleList[0]?.levelValueId;
    this.userDetails['treasCode']=this.roleList[0]?.treasCode;
    this.userDetails['treasName']=this.roleList[0]?.treasName;
    
    this.userDetails['assignmentid']=this.empinfo?.aid;
    console.log("userDetails",this.userDetails);
  
    this.selectedrole = this.roleList[0]?.payeeRoleName;
   
    this.config.storeUserDetails(this.userDetails);
    console.log("this.selectedrole",this.selectedrole);
   window.location.reload();
  }else{
    this.selectedrole=this.userDetails.role;
    console.log("this.selectedrole",this.selectedrole);
    
  }
   // localStorage.setItem('role', this.roleList[0].payeeRoleName);
  // localStorage.setItem('roleid',this.roleList[0].payeeRoleId);
  // localStorage.setItem('assignmentid',this.roleList[0].assignmentId);
   
  //  this.rolecount = this.roleList.length;
  //  if(this.rolecount < 1)
  //  {
  //   this.dialog.open(UnauthorizedUserDialogComponent,{ panelClass: 'dialog-w-30', data: {message: "You don't have any role in Payee Management."},  disableClose: true});
  //  }
  //console.log("this.selectedrole",this.selectedrole);    
      }
    })
  }
  getDecodedAccessToken(makerToken: string): any {

    try {
      let mytoken = jwt_decode(makerToken);
      this.config.storeDetails('userInfo', JSON.stringify(mytoken));
      this.empinfo=this.tokenInfo.empinfoService;

    }
    catch (Error) {
      return null;
    }
  }
  msg:any="Received From"
  getInboxDetail(id:any,roleid:any,type:any) {
    if(type=="OUTBOX")
    {
      this.btn=true
      this.msg="Send To";
    }else
    {
      this.btn=false
      this.msg="Received From"
    }
    let data = {
      assignmentId:id,
      roleId:roleid,
      type:type
    }
    this._Service.requestApplication(data, "inbox").subscribe({
      next: (res) => {
        if (res.status === "SUCCESS") {
          if (res == '') {
            alert("Not Record Found");
          }
          else {
            this.inboxData = res;
            this.dataSource = new MatTableDataSource(this.inboxData.data);
            this.dataSource.paginator = this.paginator;
            if(type==='OUTBOX'){
              this.isShow=false;
            }else{
              this.isShow=true;
            }
          }
        }
      },
      error: (err) => {
        this.inboxData.data=[]
        this.dataSource = new MatTableDataSource(this.inboxData.data);
      }
    })
  }

  getCount(aid:any,roleid:any){
    let data = {
      assignmentId:aid,
      roleId:roleid
    }

    this._Service.requestApplication(data, "getRequestCount").subscribe({
      next: (res) => {
        if (res.status === "SUCCESS") {
          if (res == '') {
            alert("Not Record Found");
          }
          else {
            this.countDetail = res.data;
          }
        }
      },
      error: (err) => {
        console.log(err);
        let countDetail={
          "inboxCount":0,
          "outboxCount":0
        }
        countDetail.inboxCount=0;
        countDetail.outboxCount=0;
        this.countDetail = countDetail;
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

  openDialog() {
    this.dialog.open(CommonDialogComponent,
      {
        panelClass: 'dialog-w-50', autoFocus: false
        , data: {
          message: 'DRMaster'
        }
      }
    );
  }

  openDialog1(){
    //alert("welcome to Mr. Tushar Taneja")
  }
  open(item: any) {
    this.modalService.open(item);
  }

  close(i: number) {}
  // showDRDdl(e: any) {
  //   if (e.target.value == '12') {
  //     this.DdlShow = true;
  //   } else {
  //     this.DdlShow = false;
  //   }
  // }



  View_History(reqId:any){
    this.dialog.open(CommonDialogComponent,
      {
        maxWidth: '60vw',
        maxHeight: 'auto',
        width: '100%',
        panelClass: 'dialog-w-50', autoFocus: false
        , data: {
          message: 'View History',id:1,reqId:reqId.toString()
        }
      }
    );
  }
  View_Objection(reqId:any){
    this.dialog.open(CommonDialogComponent,
      {
        maxWidth: '60vw',
        maxHeight: 'auto',
        width: '100%',
        panelClass: 'dialog-w-50', autoFocus: false
        , data: {
          message: 'View Objection',id:20,reqId:reqId.toString()
        }
      }
    );
  }
  View_Document(reqId:any){
    this.dialog.open(CommonDialogComponent,
      {
        maxWidth: '60vw',
        maxHeight: 'auto',
        width: '100%',
        panelClass: 'dialog-w-50', autoFocus: false
        , data: {
          message: 'View Documents',id:21,reqId:reqId.toString()
        }
      }
    );
  }
  ViewRevisedPensionerList()
  {
    this.router.navigate(['pension/revised/revised-pension-list'])
  }
  View_Profile(requestID:any,taskTranId:any,taskRoleId:any,data:any){

    this.View_pensionerlist1();

    this.config.storeDetails("reqId",requestID);
    this.config.storeDetails("transid",taskTranId)
    this.config.storeDetails("taskRoleId",taskRoleId)
    this.config.storeDetails("wfProcessId",this.wfProcessId)
    this.config.storeDetails("pkEsignData","");
    this.config.storeDetails("esigntype","");
    this.config.storeDetails("approverSubmitData","");
    if(data.processID==1)
    {
      if(this.userDetails.roleid=='1')
      {
       
        this.router.navigate(
          ['/pension/e-Pension/Profile'],
          {queryParams: {m:"qweraZaS"}}
        ); 
        
      }else
      {
        this.router.navigate(['/pension/e-Pension/Profile']);
      }
    }else if(data.processID==2)
    {
      if(this.userDetails.roleid=='1')
      {
       
        this.router.navigate(
          ['/pension/revised/revised-pension'],
          {queryParams: {m:"qweraZaS"}}
        ); 
        
      }else
      {
        this.router.navigate(['/pension/revised/revised-pension']);
      }
    }
   
    
  }

  View_pensionerlist1(){

let data ={

    "formID":1,
    "assignmentId":this.empinfo.aid
}

    this._Service.requestApplication(data, "getWorkflowID").subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.wfProcessId=res.data.wfProcessId;
        }
      },
      error: (err) => {
        console.log(err);
        // this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      }
    })





  }
  View_pensionerlist(){
    if ((this.userDetails.roleid == "1")) {
      this.router.navigate(
        ['/pension/e-Pension/PensionerList']
      );

    }else{
    
     
      // alert("")
    }
let data ={
    "formID":1,
    "assignmentId":this.empinfo.aid
}

    this._Service.requestApplication(data, "getWorkflowID").subscribe({
      next: (res) => {
        if ((res.status = 200)) {

          this.wfProcessId=res.data.wfProcessId;
        
         
        }
      },
      error: (err) => {
        console.log(err);
        // this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      }
    })





  }

  updateRequest() {
    this.dialog.open(CommonDialogComponent,
      {
        panelClass: 'dialog-w-50', autoFocus: false
        , data: {
          message: 'Request',id:2
        }
      }
    );

  }

}



