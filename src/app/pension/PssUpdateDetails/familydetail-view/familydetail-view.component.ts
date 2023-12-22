
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
//import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { debounceTime, of, startWith, switchMap } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { TokenManagementService } from 'src/app/services/token-management.service'; 
import { AppConfig } from 'src/app/app.config';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-familydetail-view',
  templateUrl: './familydetail-view.component.html',
  styleUrls: ['./familydetail-view.component.scss']
})


export class FamilydetailViewComponent implements OnInit {
 
  config1=new AppConfig();
  familyDetails: any;
  EmployeeFamilyDetails: any = { familyDetails: [], nomineeDetails: [] }
  EmployeeAlternateyDetails: any = { alternateNominee: [] }
  IsEdit = false;
  index: number = 0;
  datePipe: any;
  date: Date;
  alternateSchemeList: Array<any> = [];
  FamilyRelationAlllist: Array<any> = [];
  pensionerDtls:any;
  familyDetailsData:any;
  action = ''; 
  userDetails:any;
  familyDtlsrecord:any;
  NomineeDetailsList:any;
  Newjointphoto:any; 
  //NewEmpPhoto:any;
  jointImageUrl: any = "assets/images/jointImg.jfif";
  jointImageUrlNew: any = "assets/images/jointImg.jfif";
  imageUrl: any = "assets/images/userImg.png";
  imageUrlNew : any = "assets/images/userImg.png";
  signimageUrl: any = "assets/images/signature.png";
  picData:any='';
  picData1:any='';
  empinfo: any = {};
  PainshanDetails:any;
  ProfileDetls:any;
  pensionerId: any = '';
  


  constructor(private  activatedRoute: ActivatedRoute, private formbuilder: FormBuilder,public api:PensionServiceService, private snackbar: SnackbarService, private dashboardService:DashboardService,private tokenInfo:TokenManagementService,) 
   {
     this.date = new Date();


      this.activatedRoute.queryParams.subscribe((params: any)=>{
        this.pensionerId = params['pensionerid']
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>",this.pensionerId);
      })

      console.log(this.pensionerId);
    }
  

  ngOnInit(): void {  
    this.empinfo = this.tokenInfo.empinfoService;
     console.log("emptoken",this.empinfo); 
    this.userDetails = this.config1.getUserDetails();
    console.log("UserDetails Views >>>-- ", this.userDetails)
     //this.pensionerDtls= this.api.getPensionerDtls;  
    this.getfamilydetailsnew();
    this.getProfileDdetails();
  }


  // Get Family List  // 
getfamilydetailsnew(){    
  var url = 'getallfamilydtlspensionerwise';
  var data = {  "pensionerId": this.pensionerId, };
  //console.log ("pensionerId>>>>----",this.pensionerId)
  this.api.postPssRequest(data,url).subscribe((res: any) => {
    console.log("result>>>", res);
    this.EmployeeFamilyDetails.familyDetails=res.data;

        console.log("Family details ka Data Lao londee >>>>", this.EmployeeFamilyDetails.familyDetails.familyDetailsList)    
        console.log("Nominee Details List Ka Data Lao londee >>>>", this.EmployeeFamilyDetails.familyDetails.NomineeDetailsList) 
        console.log("New joint Photo ---->>>>", this.EmployeeFamilyDetails.familyDetails.JointPhoto.docitem[0].dmsdocid)    
        console.log("New Emp Photo ---- >>>>", this.EmployeeFamilyDetails.familyDetails.EmployeePhoto.docitem[0].dmsdocidEmp)   
           
        this.familyDtlsrecord=this.EmployeeFamilyDetails?.familyDetails?.familyDetailsList;
        this.NomineeDetailsList=this.EmployeeFamilyDetails?.familyDetails?.NomineeDetailsList;
        this.Newjointphoto=(this.EmployeeFamilyDetails.familyDetails.JointPhoto.docitem[0].dmsdocid);
        this.NewEmpPhoto=(this.EmployeeFamilyDetails.familyDetails.EmployeePhoto.docitem[0].dmsdocidEmp);
      
       // this.showNewPic(this.EmployeeFamilyDetails.familyDetails.JointPhoto.docitem[0].dmsdocid)
 
      
      })  
    }  



    NewEmpPhoto = (EmpPhotoid:any) =>{
      let data = {        
        "type": "pension",
        "sourceId": 2,
        "docs": [
          {
            "docId":EmpPhotoid
          }
        ]
      }
      console.log("single report data>>>>>>>-----", data) 
      this.api.postOr("wcc/getfiles", data).subscribe((res: any) => {
        //console.log("res", res.data.document[0].content);
        if (res.data.document[0].content) {
          this.imageUrlNew="data:image/jpeg;base64,"+res.data.document[0].content;
        }       
      })
    }







    
    ///  Get Profile Details By Peinshan_Id // Start //  
    getProfileDdetails(){         
      console.log("Profile details ka Data Lao londee >>>>", this.pensionerId)   
      var url = 'getprofiledetails';      
         var data = { "pensionerId": this.pensionerId,  };      
       console.log("pensionerId ;;;;;;;;;>>>",this.pensionerId );
      this.api.postPssRequest(data,url).subscribe((res: any) => {
        console.log("result>>>", res);
        this.ProfileDetls=res.data[0]; 
        this.showPic(this.ProfileDetls.employeePhotoGraph)
       // console.log("Old Show Pic  >>>>", this.ProfileDetls.employeePhotoGraph)   
        this.jointPic(this.ProfileDetls.jointPhotoGraph)       
        });  
      }   
    ///  Get Profile Details By Peinshan_Id // End  //  

    ///  Get Old Emp Photo By Peinshan_Id // Start  // 
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
    ///  Get Old Emp Photo By Peinshan_Id // End  //  

///  Get Joint Emp Photo By Peinshan_Id // Start  // 
    jointPic = (jointid:any) =>{
      console.log("",jointid)
      let data = {
        "type": "pension",
        "sourceId": 2,
        "docs": [
          {
            "docId":jointid
          }
        ]
      }
      console.log("single report data", data)
      this.api.postOr("wcc/getfiles", data).subscribe((res: any) => {      
        if (res.data.document[0].content) {
          this.jointImageUrl="data:image/jpeg;base64,"+res.data.document[0].content;
        }
      })
    }
///  Get Joint Emp Photo By Peinshan_Id // End  //  


//// Save Details By Appr. //// Start //  
    saveDraftApprove() {
      var postData={  
        "EmployeePhoto": this.EmployeeFamilyDetails.familyDetails.EmployeePhoto,
        "JointPhoto": this.EmployeeFamilyDetails.familyDetails.JointPhoto,
        "familyDetailsList":this.familyDtlsrecord,
        "NomineeDetailsList":this.NomineeDetailsList,
        "IsApproved": '1',
        "Aid": this.empinfo.aid,
        "Uid": this.empinfo.userId,      
       //"officeId":this.officeData.officeId,
      }
     console.log("postData==>>",postData);
     //return false;
     this.api.postPssRequest(postData,'submitfamilydtlsnew').subscribe((res: any) => { 
      console.log("result>>>", res);
      if(res.data){
        alert(res.data);
      }
      }); 
     return false;  
     }
 //// Save Details By Appr. //// End // 



 




}












