import { Component, OnInit, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { LoaderService } from 'src/app/services/loader.service';
import { RedirectService } from 'src/app/services/redirect.service';
import { AppConfig } from 'src/app/app.config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { error } from 'console';
@Component({
  selector: 'app-mark-emp-relieve-dialog',
  templateUrl: './mark-emp-relieve-dialog.component.html',
  styleUrls: ['./mark-emp-relieve-dialog.component.scss']
})
export class MarkEmpRelieveDialogComponent implements OnInit {  
  relieveEmpForm : any = FormGroup;
  loading = false;
  isSubmitted: boolean = false;
  submitData: any = {};
  empDetails: any = {};
  pendingIssue:boolean = false;
  userDetails:any={};
  config: AppConfig = new AppConfig();
  transId:any;
  reqid:any;
  docIdForPrev:any;
  base64Pdf:any;
  constructor(
    private _Service: PensionServiceService,
    private fb:FormBuilder,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private load: LoaderService,
    private redirectService:RedirectService,
    private snackbar:CommonService,
    private dialogRef: MatDialogRef<MarkEmpRelieveDialogComponent>,
    private routers: Router,

    @Inject(MAT_DIALOG_DATA) public data: { empDetail: {} }
  ) {
      console.log(this.data.empDetail);

      if(this.data.empDetail){
        this.empDetails =  this.data.empDetail;
      }

      if(this.data.empDetail){
        this.relieveEmpForm = this.fb.group({ 
          employeeId: new FormControl(this.empDetails['employeeId'].toString()),
          isRelive: new FormControl('Y'),
          remarkRelive: new FormControl('',Validators.required),
          pendingIssue: new FormControl(null,Validators.required),
          deOrCourt: new FormControl(null,Validators.required),
          deCourtdate:new FormControl({ value: null, disabled: false },
             [
            Validators.required,
            Validators.maxLength(12),
          ]),
          createdBy:new FormControl()
        });  
      }
    }


  ngOnInit(): void {
    this.userDetails = this.config.getUserDetails();
  console.log(this.userDetails.assignmentid)
    this.relieveEmpForm.patchValue({createdBy:  this.userDetails.assignmentid})

    this.transId = this.config.getDetails("transid");
    this.reqid = this.config.getDetails("reqId");
    console.log(this.data.empDetail);
    this.relieveEmpForm.controls['deOrCourt'].disable()
    this.relieveEmpForm.controls['deCourtdate'].disable()
    console.log( this.routers['location']._platformLocation.location.origin)
  }

  get relieveEmpFormControl() {
    return this.relieveEmpForm.controls;
  }

  // onFileSelected(event: any) {
  //   let currentdate=new Date();
  //   let file = event.target.files[0];
  //   let fileName = "Mark_Pension"+currentdate.getHours()+currentdate.getMinutes().toString();
  //   const docTypeId = "17"
  //   const reader = new FileReader();
  //   var data4:any;
  //   reader.onloadend = () => {
  //       let data={
  //         "type": "pension",
  //         "sourceId": 2,
  //         "docAttributes": [
              
  //         ],
  //         "data": [
  //             {
  //                 "docTypeId": 17,
  //                 "docTypeName": "Mark_Pension",
  //                 "docName": fileName,
  //                 "docTitle": "Certificate",
  //                 "content": reader.result
  //             }
  //         ]
  //     }
  //       this._Service.postOr("wcc/uploaddocs",data).subscribe((res:any)=>{
  //         console.log(res);

  //         this.relieveEmpForm.patchValue({
  //           docId: res.data.document[0].docId,
  //           docTypeId: res.data.document[0].docTypeId
  //         })
          
  //         this.submitData['docId'] = this.relieveEmpForm.controls['docId'].value;
  //         this.submitData['docTypeId'] = this.relieveEmpForm.controls['docTypeId'].value;
  //       })
  //   };
  //   reader.readAsDataURL(file);
  // }
  relieveWith(choose:string){
    if(choose =='no'){
      this.relieveEmpForm.controls['deOrCourt'].reset()
      this.relieveEmpForm.controls['deCourtdate'].reset()
      this.relieveEmpForm.controls['deOrCourt'].disable()
      this.relieveEmpForm.controls['deCourtdate'].disable()
    
      this.pendingIssue = false ; 
    }else{
      this.relieveEmpForm.controls['deOrCourt'].enable()
      this.relieveEmpForm.controls['deCourtdate'].enable()
      this.pendingIssue = true ; 
    }

  }
  submitEmployeeRetirement(){
    this.isSubmitted = true;
    this.load.show();
    this.submitData = this.relieveEmpForm.value;

    console.log(this.submitData);
    if(this.pendingIssue){
      let Date1 = this.relieveEmpForm.controls['deCourtdate'].value;
      let fDate = moment(Date1).format("YYYY-MM-DD");
     
      this.submitData.deCourtdate= fDate;
    
    }
    console.log('this.submitData>>>>>>>',this.submitData);
    if(this.relieveEmpForm.valid){
      if(confirm('Are you sure you want to submit')){
          this._Service.postPssRequest(this.submitData, "markrelive").subscribe({
            next: (res) => {
              this.load.hide();
              if (res.status.toLowerCase() == "success") {
                // alert(res.message);
                //this.snackbar.show(res.data, 'Success');
                this.relieveEmpForm.reset();
                this.isSubmitted = false;
                this.docApiCAll({})
              
              }else{
                // this.snackbar.show(res.message, 'alert');
                // alert(res.message);
              }
            },
            error: (err) => {
              this.load.hide();
              // alert("Something went wrong");
             // this.snackbar.show('Something went wrong', 'alert');
              let errorObj = {
                message: err.message,
                err: err,
                response: err
              }
            }
          })
      }
    }
  }

  docApiCAll(data:any){
      // localStorage.setItem("approverSubmitData",JSON.stringify(data))
      this.config.storeDetails("approverSubmitData", JSON.stringify(data))
      let url = "getrelivingdocuments";
      // let url = "http://172.22.36.214:9011/pension/v1.0/getrelivingdocuments";
      let data1 =
      {

        "employeeId":this.empDetails['employeeId'].toString()
    
    }

      this._Service.posthoReleive(url, data1).subscribe((res: any) => {
   
        let data = res.data;
        if(res.status ='SUCCESS' && res.data.status=="Success"){
          
          let purl: string = this.routers['location']._platformLocation.location.origin;
          let url2: string = this.routers.url;
          let mainUrl = purl + "/pension/#" + "/pension/e-Pension/Profile";
        
          let esigndata = {
            "reportPath": data.reportPath,
            "name": "employee_Id",
            "value": data.employeeId,
            "docTypeId": data.docTypeId,
            "docName": data.docName,
            "processId": "1",
            "mainurl": mainUrl,
            "requestId": this.reqid ? this.reqid : ""
          }
  console.log(esigndata)
          this.config.storeDetails("esigntype", "approver")
          this.esignRequest(esigndata,data);
        }else
        {
          alert(res.data.errorMessage)
          //this.snackbar.show(res.data.errorMessage, 'alert');
          this.dialogRef.close();

        }
  
       
      })
      
  }

 
  pdfpreview(data1:any) {
    let data = {
      "reportPath": data1.reportPath,
      "format": "pdf",
      "params": [
        {
          "name": "EMPLOYEE_ID",
          "value":  data1.employeeId
          // "value":  "2769002"
        }
      ]
    }
    console.log("single report data", data)
    this._Service.postOr("report/singlereport", data).subscribe((res: any) => {
      console.log(res);
      console.log("res", res.data.report.content);
      if (res.data.report.content) {
        const byteArray = new Uint8Array(
          atob(res.data.report.content)
            .split("")
            .map(char => char.charCodeAt(0))
        );
        console.log("byteArray",byteArray)
        const file = new Blob([byteArray], { type: "application/pdf" });
        console.log("file>>>>",file)
        const fileURL = URL.createObjectURL(file);
        const pdfWindow = window.open("");
        pdfWindow!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");

      }

     

    })
  }
  
  
  docIdPS:any
  pdfSrc:any
  getBaseData()
  {  
  let data = {
    "type": "pension",
    "sourceId": 2,
    "docs": [
      {
        "docId": this.docid
      }
    ]
  }
  console.log("single report data", data)
  this._Service.postOr("wcc/getfiles", data).subscribe((res: any) => {
    console.log("res", res.data.document[0].content);
    if (res.data.document[0].content) {
      let data = {
        "base64Pdf": res.data.document[0].content,
        "redirectUrl": "pension/e-Pension/Profile"
      }
      console.log("data", data);

      // this.dialog.open(PdfPreviewComponent, { width: '70%', data: { message: data }, disableClose: false });
      this.base64Pdf=res.data.document[0].content;
      if(this.base64Pdf)
      {const byteArray = new Uint8Array(
        atob(this.base64Pdf)
          .split("")
          .map(char => char.charCodeAt(0))
      );
      this.pdfSrc = "";
      const file = new Blob([byteArray], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      this.pdfSrc = fileURL;
      const pdfWindow = window.open("");
      pdfWindow!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");
    
      }

    }
  })
  

  }
  docid:any
  esignRequest(resData: any,data:any) {
    // let data = {
    //   "reportPath": resData.reportPath,
    //   "name": resData.name,
    //   "value": resData.value,
    //   "url": resData.mainurl,
    //   "contextPath": "3",
    //   "cordX": 800,
    //   "cordY": 0,
    //   "assignmentId": this.userDetails.assignmentid,
    //   "docTypeId": resData.docTypeId,
    //   "docName": resData.docName,
    //   "roleId": "6",
    //   "requestId": resData.requestId ? resData.requestId : "",
    //   "processId": resData.processId
    // }
    // console.log("esignXmlRequest", data);
    let data2 = {
      "reportPath":resData.reportPath,
      "name":"EMPLOYEE_ID",
       "value":resData.value,
       "sourceId":3,
       "processName":"PENSION_AUTO_PROCESS",
       "identifier":2,
       "identifierType":"DDO",
       "signName":"Addl Director Pension Pensioners Welfare.",
        "reason":"Approved",
        "location":"Jaipur",
         "searchText":"¥",
          "docName":resData.docName,
         "docTypeId":resData.docTypeId,
         "docId":0
     
    }
    console.log("esignXmlRequest", data2);
    this.docIdForPrev=resData.reportPath;
    // let url = "sendrequest";
    let url = "withOutOTPEsign";
    this.load.show();
    this._Service.postNewEsign(url, data2).subscribe((res: any) => {
    res=JSON.parse(res) 
    console.log("RES Data >>>>>",res) 
      let data1=JSON.parse(res.data)  
        //console.log("DocId==>>",data1.DocId);     
      this.docid=data1.DocId
      this. updateDocId(data1.DocId,data)       
      this.load.hide();      
    },(error)=>{
      this.load.hide();
    })
  
  }



  updateDocId(DocId:any,resData:any) {
    console
    let data = {
      "dmsDocId": DocId,
      "pensionerId": resData.pensionerId,
      "docTypeId":resData.docTypeId
    }
    this._Service.postPssRequest(data, "pensionerdocument").subscribe({
      next: (res) => {
        //console.log("res", res);
        
        if (res.status == "SUCCESS") {
          this.pdfpreview(resData);
        } else {
          alert(res.message );
        }
      // this.getBaseData()
   
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
}
