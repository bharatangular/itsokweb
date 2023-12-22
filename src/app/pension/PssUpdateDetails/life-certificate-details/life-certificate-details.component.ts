import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//import moment from 'moment';
import { Subject } from 'rxjs';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { debounceTime, of, startWith, switchMap } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DashboardService } from 'src/app/services/dashboard.service'; 
import { AppConfig } from 'src/app/app.config';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { MatDialog } from '@angular/material/dialog';
import { PdfPreviewComponent } from '../../e-pension/pdf-preview/pdf-preview.component';
import { LoaderService } from 'src/app/services/loader.service';
import { RedirectService } from 'src/app/services/redirect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EsignModalComponent } from '../../esign-modal/esign-modal.component';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Console } from 'console';
@Component({
  selector: 'app-life-certificate-details',
  templateUrl: './life-certificate-details.component.html',
  styleUrls: ['./life-certificate-details.component.scss']
})

export class LifeCertificateDetailsComponent implements OnInit { 
    dataSource: MatTableDataSource<any> = new MatTableDataSource;
  config1=new AppConfig();
  familyDetails: any;

  PainshanDetails:any;
  ProfileDetls:any;
  index: number = 0;
  datePipe: any;
  date: Date;
  alternateSchemeList: Array<any> = [];
  FamilyRelationAlllist: Array<any> = [];
  pensionerDtls:any;
  familyDetailsData:any;
  action = ''; 
  userDetails:any;
  LifeCertifict!: FormGroup; 
  formGroup !: FormGroup;
  Summary !: FormGroup;
  serachingKey:any;
  imageUrl: any = "assets/images/userImg.png";
  picData:any='';
  dmsDocId:any;
 // isvisible:boolean=false;
  // iseSin:boolean=false;
  empinfo: any = {};
  ButtonView:any="Generate"
  //dialog:any;
  private paginator1!: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator1 = mp;
    this.dataSource.paginator = this.paginator1;
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort;

  displayedColumns: any = ['SNo','sso_Id','nameEn', 'pensionerId','dob','employeeId','employeeCode','ppoNo', "Action"];

  constructor(private formbuilder: FormBuilder,
    public load:LoaderService,
    public redirectService:RedirectService,
    public api:PensionServiceService, 
    private snackbar: SnackbarService, 
    private dashboardService:DashboardService, 
    public dialog: MatDialog,
    private essService:ApiEssService,
    public routers:Router,
    public actRoute:ActivatedRoute,
    private tokenInfo:TokenManagementService,
    ) 
   { this.date = new Date(); }
   
  

  ngOnInit(): void {
    this.empinfo = this.tokenInfo.empinfoService;
    console.log("emptoken",this.empinfo); 
    this.userDetails = this.config1.getUserDetails();

    
    // this.actRoute.queryParams.subscribe(params => {
    //   var esignRes = params['status'];
    //   var id = params['id'];      
    //   if (esignRes) {
    //     if (id) {
    //       this.getEsignData(id);
    //     }
    //   }
    // });
    console.log("bhag ke jaa  deatials leke aa>>>>----", this.userDetails)
    this.LifeCertifict = this.formbuilder.group({
      ppoNumber: new FormControl('', Validators.required),
    });

    this.getLifeCertifictdetails()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  esignData:any;
  getEsignData(id: any) {
    let data = {
      "trxnNo": id,
      "databaseKey": "3"
    }
    let url = "esignTransaction";
    this.api.postNewEsign(url, data).subscribe((res: any) => {
      this.esignData = JSON.parse(res);    
      if (this.esignData.responseStatus == '1') {
        this.submitAfterEsign(this.esignData.docId);
            let data = {
              "esignRes": "SUCCESS",
              "transId": id,
              "redirectUrl": "pension/Inbox",
              "bill": "0"
            }
            this.dialog.open(EsignModalComponent, { panelClass: 'dialog-w-30', data: { message: data }, disableClose: true  });
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


////// Filter_ by Serch /// Start //   
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log("Searching key is>>>>---",filterValue)

    this.dataSource.filter = filterValue;

    // this.serachingKey=filterValue;
  }
////// Filter_ by Serch /// End  //


// Get Psn  Details List  //
getLifeCertifictdetails(){ 
  var url = 'lifeCertificateDetails';
  console.log ("assignmentId>>>>----",this.userDetails.assignmentid)

    //var data = { "assignmentId": 57698};  
    var data = { "assignmentId": this.userDetails.assignmentid};  
    this.api.postPssRequest(data,url).subscribe((res: any) => {
      console.log("result>>>", res);
      this.PainshanDetails =res.data;  
      console.log(this.PainshanDetails)
      this.dataSource = new MatTableDataSource(this.PainshanDetails);  
    // this.getProfileDdetails();
    // this.isvisible=true;           
    })    
  }  

previewFiles(row: any){
  console.log(row.pensionerId) 

     console.log(this.PainshanDetails.pensionerId) 

     if(!row.pensionerId || row.pensionerId=='N/A'){
       alert("Preview Not Available")
       return
     }
     let dmsDocId=row.dmsDocId;
     if(dmsDocId =row.dmsDocId)
     {
     let data={
       "type": "pension",
       "sourceId": 2,
       "docs": [
         {
           "docId": row.docId
         }
       ]
     }
     console.log("single report data",data)
     this.api.postOr("wcc/getfiles", data).subscribe((res: any)=>{      
       console.log("res",res);
       if(res.data.document[0].content)  
       {
         let data={
           "base64Pdf":res.data.document[0].content,
           "redirectUrl":"pensioner/selfservice/pensionselfservice/MyDashboard"
           //"redirectUrl":"pensioner/pssdashboard"
           }      
             console.log("data",data);
         this.dialog.open(PdfPreviewComponent,{  width: '70%', data: {message: data },  disableClose: false});
         this.ButtonView="Preview"
       }
 })
 }else
   {
       alert("Preview Not Available")
   }
 }

// View Details Used By Psn_ID  Satart // 
    View = (index: number) => {
      this.index = index;        
      const data = this.PainshanDetails[index];
      console.log("asda",data)         
    }

    ///  Get Profile Details By Peinshan_Id // Start //  
    getProfileDdetails(){         
      console.log("Profile details ka Data Lao londee >>>>", this.PainshanDetails[0].pensionerId)   
      var url = 'getPainshanDetails';
      var data = { "pensionerId":  this.PainshanDetails[0].pensionerId,}; 
     
      this.api.postPssRequest(data,url).subscribe((res: any) => {
        console.log("result>>>", res);
        this.ProfileDetls=res.data[0]; 
        this.showPic(this.ProfileDetls.employeePhotoGraph)
            console.log("Profile details ka Data Lao londee >>>>", this.ProfileDetls)    
          })  
      }   
    ///  Get Profile Details By Peinshan_Id // End  //  


    showPic = (id:any) =>{
      let data = {        
        "type": "pension",
        "sourceId": 2,
        "docs": [
          {
            "docId":id
          }
        ]
      }
      console.log("single report data", data) 
      this.api.postOr("wcc/getfiles", data).subscribe((res: any) => {
        //console.log("res", res.data.document[0].content);
        if (res.data.document[0].content) {
          this.imageUrl="data:image/jpeg;base64,"+res.data.document[0].content;
        }       
      })
    }
 


  
 // Get Certificate by Painshan Id Fiste // Start //
 getLifeCertifictById(){ 
     //console.log(this.PainshanDetails[0].pensionerId)
     console.log ("pensionerId>>>>----",this.PainshanDetails[0].pensionerId);
     console.log("preview", this.pkEsignData); 
     if(!this.PainshanDetails[0].pensionerId || this.PainshanDetails[0].pensionerId =='N/A'){
       alert("Preview Not Available")
       return
     }
     let path= "/Pension/Life_Certificate/life_cert_report.xdo";
     let data = {
      "reportPath": path,
      "format": "pdf",
      "params": [
        {
          "name":'PENSIONER_ID',
          "value":this.PainshanDetails[0].pensionerId         
        }
      ]
    }
    this.essService.postIntegration("report/singlereport",data).subscribe((res:any)=>{      
      console.log("res abe dikha janaa tuu",res);      
      if(res.data.report.content)  
      {
        let data={
          "base64Pdf":res.data.report.content,
          "redirectUrl": "pension/pss/LifeOtherCertificate"         
          }      
            console.log("data",data);
        this.dialog.open(PdfPreviewComponent,{  width: '70%', data: {message: data },  disableClose: false});
        // this.iseSin=true; 
        this.ButtonView="Preview"
      }
 })   
 }

  pkEsignData(arg0: string, pkEsignData: any) {
    throw new Error('Method not implemented.');
  }
  // Get Certificate by Painshan Id Fiste // End // 


 
  esignRequest() {    
    let time1=new Date();   
    let purl: string = this.routers['location']._platformLocation.location.origin;
    let fileName = "life" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf";
    let mainUrl = purl + "/pension/#" + "/pension/pss/LifeOtherCertificate";
    let data = {
      "reportPath":  "/Pension/Life_Certificate/life_cert_report.xdo",
      "name":"PENSIONER_ID",
      "value":this.PainshanDetails[0].pensionerId,
      "url": mainUrl,
      "contextPath": "3",
      "cordX": 400,
      "cordY": 35,
      "assignmentId": this.userDetails.assignmentid,
      "docTypeId": "281",
      "docName": fileName,
      "roleId": "6",
      "requestId": "0",
      "processId": "0"
    }
    console.log("esignXmlRequest", data);
    let url = "sendrequest";
    this.load.show();
    this.api.postNewEsign(url, data).subscribe((res: any) => {
      console.log("res", res);
      this.load.hide();      
      setTimeout(() => {
        this.Submitlifecertificate();
      }, 300);
      setTimeout(() => {
        this.redirectService.postRedirect(res);
      }, 600);
    },(error)=>{
      this.load.hide();
      alert("Error in E-Sign Service.Please try after some time.")
    })
  }

 config:AppConfig=new AppConfig();


  Submitlifecertificate(){      
  let uploadData={
    "empCode": this.ProfileDetls.employeeCode,
    "psnId": Number(this.ProfileDetls.pensionerId),
     "docitem": [
     {
       "docTypeId": 281,
       "createUid": this.empinfo.userId,
       "createAid": this.empinfo.aid,          
         "dmsdocid":0,
         }
     ]
   }   
   console.log("uploadData ",uploadData)
   this.config.storeDetails("lifeSubmitData",JSON.stringify(uploadData));    
  }



submitAfterEsign(docId:any)
{
  let uploadData=JSON.parse(this.config.getDetails('lifeSubmitData'));
  console.log("data",uploadData);
// let data=uploadData['docitem']
// console.log("data",data);
  uploadData['docitem'][0]['dmsdocid']=docId  
  this.api.getPsnDetailsView('updatephotoid',uploadData).subscribe((res: any) => { 
    if(res.status ='SUCCESS' && res.data.status=="Success"){
      if((res.data.msg=='Data Save Successfully')==true)
      {
        console.log("after uploade document id",res)
        let data1 =res;                 
      }  
     }
    }); 
}

}















