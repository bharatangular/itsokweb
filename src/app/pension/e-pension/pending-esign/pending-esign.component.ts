
import { Component, ElementRef, OnInit, ViewChild ,AfterViewInit, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConfig } from 'src/app/app.config';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { PdfPreviewComponent } from '../pdf-preview/pdf-preview.component';
import { RedirectService } from 'src/app/services/redirect.service';
import { LoaderService } from 'src/app/services/loader.service';
import { EsignModalComponent } from '../../esign-modal/esign-modal.component';
import { TokenManagementService } from 'src/app/services/token-management.service';

@Component({
  selector: 'app-pending-esign',
  templateUrl: './pending-esign.component.html',
  styleUrls: ['./pending-esign.component.scss']
})
export class PendingEsignComponent implements OnInit {
  isFr:boolean=false;
  isPK:boolean=false;
  displayedColumns: string[] = ['Request ID','employeeCode','employeeName',"preview",'fr'];
  dataSource!: MatTableDataSource<any>;
  userDetails:any={"role":"",
  "roleid" :"",
 "assignmentid":""};
 empinfo: any;
 config: AppConfig = new AppConfig();

  constructor(public dialog: MatDialog, 
    private _Service: PensionServiceService, 
    private modalService: NgbModal,
    private _snackBar: MatSnackBar,
    private router:Router,
    private redirectService:RedirectService,
    private load:LoaderService,
    public actRoute:ActivatedRoute,
    private tokenInfo:TokenManagementService) {
    
   }

  ngOnInit(): void {
    this._Service.configMenu = { url: "Pending Esign" };
    
    this.actRoute.queryParams.subscribe(params => {

      var esignRes = params['status']; 
      var id = params['id'];
      
      if (esignRes) {
        if (id) {

          this.getEsignData(id);

        }
      }

    });
    this.userDetails = this.config.getUserDetails();
    console.log(this.userDetails);
    this.empinfo=this.tokenInfo.empinfoService;
    this._Service.url="Inbox > E-Sign-Pending-List";
    this.getList();
  }
  esignData:any
  getEsignData(id:any)
  {
    let data={
      "trxnNo":id,      
      "databaseKey":"3"
    }
    let url="esignTransaction";

  this._Service.postNewEsign(url,data).subscribe((res:any)=>
  {


    this.esignData=JSON.parse(res);
    if(this.esignData.responseStatus=='1')
    { 
      let storeData=JSON.parse(this.config.getDetails("pensionerID"));
     
      console.log("storeData",storeData)
      
        this.updateDocId(storeData);
        let data = {
          "esignRes": "SUCCESS",
          "transId": id,
          "redirectUrl": "pension/e-Pension/pendingEsign",
          "bill":"0"
        }
        this.dialog.open(EsignModalComponent, { panelClass: 'dialog-w-30', data: { message: data } });
      
      // this.billProcess();
    }else
    {
      let data = {
        "esignRes": "failed",
        "type":"",
        "redirectUrl": "pension/e-Pension/pendingEsign",
        
      }
      this.dialog.open(EsignModalComponent, { panelClass: 'dialog-w-30', data: { message: data } });
    }
     
    //  alert("Esign Failed")
    
    console.log("esignData", this.esignData);
  })
  }
  updateDocId(data1:any)
  {
    let pensionerId=this.config.getDetails("pensionerId");
    let data={
      "dmsDocId":this.esignData.docId,
      "pensionerId":data1.pensionerID,
      "docTypeId":data1.docTypeID
    }
    this._Service.postPssRequest(data, "pensionerdocument").subscribe({
      next: (res) => {
        console.log("res",res);
        
        if (res.status == "SUCCESS") {
         
          
         
        }else{
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
  btn:boolean=true;
  changeEsign(type:any)
  {
   
if(type=='fr')
{

  this.btn=false
  this.dataSource = new MatTableDataSource(this.frData);
  console.log("frdata",this.frData)
}else if(type=='pk')
{
  this.btn=true
  this.dataSource = new MatTableDataSource(this.pkData);
  console.log("this.pkData",this.pkData)
}
  }
  frData:any[]=[];
  pkData:any[]=[]
  getList() {
    let data={
      "assignmentId":this.userDetails.assignmentid
    }
    this._Service.postPssRequest(data, "getpendinglist").subscribe({
      next: (res) => {
        res=JSON.parse(res.data)
          console.log("res",res);
          
       this.frData=res.filter((x:any)=>
       {
        if(x.docTypeID=='36')
        {
          return x;
        }
       })
       console.log("this.frData",this.frData)
       this.pkData=res.filter((x:any)=>
       {
        if(x.docTypeID=='34')
        {
          return x;
        }
       })
       console.log("this.pkData",this.pkData)   
            this.dataSource = new MatTableDataSource(this.pkData);
            // this.dataSource.paginator = this.paginator;
          
         
        
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  esignRequest(resData:any,type:any) {
//alert()
// localStorage.setItem("esigntype","")

this.config.storeDetails("esigntype","");
    let purl: string = this.router['location']._platformLocation.location.origin;
    let url2: string = this.router.url;
    var mainUrl:any = purl + "/pension/#" + "/pension/e-Pension/pendingEsign";
var data:any;
if(!this.btn){
  let storeData={
    "type":type,
    "docTypeID":resData.docTypeID,
    "pensionerID":resData.pensionerID
  }
  this.config.storeDetails("pensionerID",JSON.stringify(storeData))
   data = {
    "reportPath": resData.reportPathFR,
    "name": "task_data_id",
    "value": resData.taskDataId,
    "url": mainUrl,
    "contextPath": "3",
    "cordX": 400,
    "cordY": 35,
   "assignmentId": this.userDetails.assignmentid,
    "docTypeId": resData.docTypeId,
    "docName": resData.docNameFR,
   "roleId": "6",
    "requestId":resData.requestId,
    "processId":resData.processId
  }
  console.log("esignXmlRequest", data);
  let url = "sendrequest";
  this.load.show();
  this._Service.postNewEsign(url, data).subscribe((res: any) => {
    console.log("res", res);
    this.load.hide();
    this.redirectService.postRedirect(res);

  })
}else if(this.btn)
{
  let storeData={
    "type":type,
    "docTypeID":resData.docTypeID,
    "pensionerID":resData.pensionerID
  }
  this.config.storeDetails("pensionerID",JSON.stringify(storeData))
  data = {
    "reportPath": resData.reportPathPK,
    "name": "pensioner_id",
    "value": resData.pensionerID,
    "url": mainUrl,
    "contextPath": "3",
    "cordXvalue": 800,
    "cordYvalue": 0,
    "assignmentId": this.userDetails.assignmentid,
    "docTypeId": resData.docTypeId,
    "docName": resData.docNamePK,
   "roleId": "6",
    "requestId":resData.requestId,
    "processId":resData.processId
  }

    
    console.log("esignXmlRequest", data);
    let url = "sendrequest";
    this.load.show();
    this._Service.postNewEsign(url, data).subscribe((res: any) => {
      console.log("res", res);
      this.load.hide();
      this.redirectService.postRedirect(res);

    },(error)=>{
      this.load.hide();
      alert("Esign service have error")
    })
  }else{
    alert("E-sign done previouslly")
  }

}
isPreview:boolean=false;
Preview(data2:any)
{
  console.log("preview", data2);
  let data:any;
  if(!this.btn){
 data = {
    "reportPath":data2.reportPathFR,
    "format": "pdf",
    "params": [
      {
        "name": "task_data_id",
        "value": data2.taskDataId
      }
    ]
  }
}else if(this.btn)
{
  data = {
    "reportPath":data2.reportPathPK,
    "format": "pdf",
    "params": [
      {
       
        "name": "pensioner_id",
        "value": data2.pensionerID
      }
    ]
  }
}
  console.log("single report data", data)
  this.isPreview=true;
  this._Service.postOr("report/singlereport", data).subscribe((res: any) => {
    this.isPreview=false;
    console.log("res", res);
    if (res.data.report.content) {
      const byteArray = new Uint8Array(
        atob(res.data.report.content)
          .split("")
          .map(char => char.charCodeAt(0))
      );
      // this.pdfSrc = "";
      const file = new Blob([byteArray], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      // this.pdfSrc = fileURL;
      const pdfWindow = window.open("");
      pdfWindow!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");

    }else
    {
      alert("Data not get due to some error.")
    }
  },(error)=>{
    this.isPreview=false;
    alert("Service have problem.Try after some time.")
  })
}
}
