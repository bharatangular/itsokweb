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
  selector: 'app-mark-emp-de-dialog',
  templateUrl: './mark-emp-de-dialog.component.html',
  styleUrls: ['./mark-emp-de-dialog.component.scss']
})
export class MarkEmpDeDialogComponent implements OnInit {

  // constructor() { }

  // ngOnInit(): void {
  // }
  fileName:any;
  file:any
  DEEmpForm : any = FormGroup;
  loading = false;
  isSubmitted: boolean = false;
  submitData: any = {};
  empDetails: any = {};
  pendingIssue:boolean = false;
  userDetails:any={};
  config: AppConfig = new AppConfig();
  transId:any;
  reqid:any;
  isdeTypeShow:boolean=false;
  docId:any=0
  constructor(
    private _Service: PensionServiceService,
    private fb:FormBuilder,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private load: LoaderService,
    private redirectService:RedirectService,
    private snackbar:CommonService,
    private routers: Router,
    private _snackBar: MatSnackBar,
    private common:CommonService,
    @Inject(MAT_DIALOG_DATA) public data: { empDetail: {},empDe:boolean },
    @Inject(MAT_DIALOG_DATA) public messagedata: {message: any},
    private dialogRef: MatDialogRef<MarkEmpDeDialogComponent>

  ) {
      console.log("data",this.data);

      if(this.data.empDetail){
        this.empDetails =  this.data.empDetail;
      }

      if(this.data.empDetail){
        this.DEEmpForm = this.fb.group({ 
          employeeId: new FormControl(this.empDetails['employeeId'].toString()),
          isde: new FormControl('',Validators.required),
          remarkde: new FormControl('',Validators.required),
          deType: new FormControl(''),
          // pendingIssue: new FormControl(null,Validators.required),
          // deOrCourt: new FormControl(null,Validators.required),
          // deCourtdate:new FormControl({ value: null, disabled: false }, [
          //   Validators.required,
          //   Validators.maxLength(12),
          // ])
        });  
      }
    }


  ngOnInit(): void {
    this.userDetails = this.config.getUserDetails();
    this.transId = this.config.getDetails("transid");
    this.reqid = this.config.getDetails("reqId");
    console.log(this.data.empDetail);
    // this.DEEmpForm.controls['deOrCourt'].disable()
    // this.DEEmpForm.controls['deCourtdate'].disable()
    console.log( this.routers['location']._platformLocation.location.origin)
  }

  get relieveEmpFormControl() {
    return this.DEEmpForm.controls;
  }
  selectFile(event: any)
  {
 

    this.file = event.target.files[0];
    let ex2:any[]=this.file.name.split("."); 
    console.log("size",this.file.size/1024)
    if(ex2[1].includes('PDF') || ex2[1].includes('pdf')  )
    {
      
    } else
    {
      alert("Only PDF file format allowed")
      return;
    } 

    if((this.file.size/1024)>2048)
    {
      alert("Max 2 MB file size allowed")
      return;
    }
  
  }
  uploadFile() {

   if(this.file)
   {
    if(this.DEEmpForm.valid){
    if(confirm('Are you sure you want to submit')){
    let time1 = new Date();
    let ex2:any[]=this.file.name.split("."); 
    this.fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() +"."+ex2[1];
    this.fileName = this.fileName.replace(" ", "")
  
    const docTypeId = "20"
    const reader = new FileReader();
    var data4: any;
    reader.onloadend = () => {
      //console.log(reader.result);

      data4 = reader.result;
      let data5 = data4.toString()
      data5 = data5.replace("data:application/pdf;base64,", "")
      let data = {
        "type": "pension",
        "sourceId": 2,
        "docAttributes": [

        ],
        "data": [
          {
            "docTypeId": docTypeId,
            "docTypeName": "pdf",
            "docName": this.fileName,
            "docTitle": "Certificate",
            "content": data5
          }
        ]
      }
      this.isLoading=true;
      this._Service.postOr("wcc/uploaddocs", data).subscribe((res: any) => {

        let data =
        {
          "docTypeId": docTypeId,
          "dmsDocId": res.data.document[0].docId,
          "docName": "Accounts Personnel Certificate",
        }

        if (res.data.document[0].docId) {
      this.docId=res.data.document[0].docId
          this.submitEmployeeDe()
        
        } else {
          alert("Some error occured.")
        }

      },(error)=>{
        this.isLoading=false;
        alert("Error in Upload document")
      })
    };
    reader.readAsDataURL(this.file);
  }
}else{
  alert("Please check all fields")
}
   }else{
    alert("Please select DE document.")
   }
  
  }
  
  deChange()
  {   

    this.isdeTypeShow=true;

   // alert(this.DEEmpForm.value.isde);
        
    if(this.DEEmpForm.value.isde=="1")
    {
      this.isdeTypeShow=true;
    this.getDeType();
    }else{
      this.isdeTypeShow=false;
    }
   // this.DEEmpForm.deType='';
  }

  isLoading:boolean=false
 
  submitEmployeeDe(){
    this.isSubmitted = true;
    // this.load.show();
    this.submitData = this.DEEmpForm.value;
    this.submitData['createdBy']=this.userDetails.assignmentid;
    if(this.docId==0)
    {
      alert("Please upload DE document");
      return
    }
    this.submitData['docId']=this.docId;
    
    console.log("submitData==>",this.submitData);
   

    if(this.DEEmpForm.value.employeeId==null || this.DEEmpForm.value.employeeId==undefined){
      this._snackBar.open('error :- ','something went wrong please try again', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });

      return;
    }

    console.log('this.submitData>>>>>>>',this.submitData);
   
      
        // this._Service.postPssRequest(this.submitData, "markrelive").subscribe({
          if(this.data.empDe)
          {
            this._Service.getPensionerDetail(this.submitData, "markdeautoprocess").subscribe({
              next: (res) => {
                // this.load.hide();
                if (res.status.toLowerCase() == "success") {
                  // alert(res.message);
                  //this._snackBar.show(res.data, 'Success');
                  
                  this._snackBar.open('Success :- ',res.data.message, {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                  });
  
                  let updaterelivePost={
                    "isRelive":"",              
                    "isDe":"Y",              
                    "deType":this.DEEmpForm.value.deType,              
                    "employeeId": this.empDetails['employeeId'].toString(),              
                }
                  this._Service.postUpcomingpension(updaterelivePost, "updaterelive").subscribe((res:any)=>{
                    this.isLoading=false;
                  },(error)=>{
                    this.isLoading=false;
                  });
  
                  this.DEEmpForm.reset();
                  this.isSubmitted = false;             
                
                }else{
                  this._snackBar.open('error :- ',res.message, {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                  });
                  // this.snackbar.show(res.message, 'alert');
                  // alert(res.message);
                }
              },
              error: (err) => {
                // this.load.hide();
                this.isLoading=false;
                this._snackBar.open('error :- ',err.message, {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                });
                // alert("Something went wrong");
               // this.snackbar.show('Something went wrong', 'alert');
                let errorObj = {
                  message: err.message,
                  err: err,
                  response: err
                }
              }
            })
          }else
          {
            let updaterelivePost={
              "isRelive":"",              
              "isDe":"Y",              
              "deType":this.DEEmpForm.value.deType,              
              "employeeId": this.empDetails['employeeId'].toString(),              
          }
            this._Service.postUpcomingpension(updaterelivePost, "updaterelive").subscribe((res:any)=>{
              if (res.status.toLowerCase() == "success") {
                // alert(res.message);
                //this._snackBar.show(res.data, 'Success');
                this.isLoading=false;
                this._snackBar.open('Success :- ',res.data.message, {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                });
            }else{
              this._snackBar.open('error :- ',res.message, {
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
            }
          },(error)=>
          {
            this.isLoading=false;
          });

            this.DEEmpForm.reset();
            this.isSubmitted = false;   
          }
         
      
    
    this.dialogRef.close({ data: "Y" });
    // this.dialog.closeAll();
  }

 




  

  detypelist:any;
  getDeType() {

    
    let data ={
    
    }

    this._Service.postdetype(data, "getDeTypes").subscribe({
      next: (res) => {
        if (res.status = 200) {
      
this.detypelist=res.data;
console.log(this.detypelist)

        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }
    })
  }

 


}
