import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { CommonService } from 'src/app/services/common.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-pending-multi-esign',
  templateUrl: './pending-multi-esign.component.html',
  styleUrls: ['./pending-multi-esign.component.scss']
})
export class PendingMultiEsignComponent implements OnInit {
  empCode:any;
  constructor(public _Service:PensionServiceService,public common:CommonService) { }
  userDetails:any;
  config:AppConfig=new AppConfig();
  ngOnInit(): void {
    this.userDetails=this.config.getUserDetails();
  }

  pensionData:any
  frData:any;
  PKData:any;
  PKSData:any
  getOldPensionDetails()
  {
    this.alertEmpCode();
    let data ={
      "ppoNo":"0",
      "empCode":this.empCode,
      "psnId":"0",
      "empId":"0"
    }

    this._Service.postdetype(data, "getpsndetailsbyids").subscribe({
      next: (res:any) => {
        if (res.status = 200) {
      
this.pensionData=res.data;
console.log(this.pensionData)
this.frData={
  'reportPath':this.pensionData.reportPathFR,
  'name':"task_data_id",
  'value':this.pensionData.taskDataId,
  'docName':this.pensionData.docNameFR,
  'pensionerId':this.pensionData.psnId,
  'redirectUrl':"e-Pension/updatedocid",
  "doctypeId":36,
  "assignmentid":this.userDetails.assignmentid,
  "empCode":this.empCode
}
 this.PKData={
  'reportPath':this.pensionData.reportPathPK1,
  'name':"pensioner_id",
  'value':this.pensionData.psnId,
  'docName':this.pensionData.docNamePK,
  "pensionerId":this.pensionData.psnId,
  'redirectUrl':"e-Pension/updatedocid",
  "doctypeId":34,
  "assignmentid":this.userDetails.assignmentid,
  "empCode":this.empCode
}
this.PKSData={
  'reportPath':this.pensionData.reportPathPK2,
  'name':"pensioner_id",
  'value':this.pensionData.psnId,
  'docName':this.pensionData.docNamePKS,
  'pensionerId':this.pensionData.psnId,
  'redirectUrl':"e-Pension/updatedocid",
  "doctypeId":261,
  "assignmentid":this.userDetails.assignmentid,
  "empCode":this.empCode
}

this.getDocId();
        }
      },
      error: (err:any) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }
    })
  }

 alertEmpCode()
 {
  if(this.empCode=='' || this.empCode==null)
    {
      alert("Please insert employee code.")
      return
    }
 }
 pkDocId:any=0;
 frDocId:any=0;
 pksDocId:any=0;
 getDocId()
 {
   if(this.empCode=='' || this.empCode==null)
   {
     alert("Please insert employee code.")
     return
   }
   let data = {
 "inMstType":27,
 "inValue":0,
 "inValue2":0,
 "inValue3":this.empCode
 }
 
   this._Service.postho('allmstdata', data).subscribe((res:any) => {
     console.log("res",res)
    if(res.status=='SUCCESS')
    {
     if(res.data!=null)
     {
       let picdata=JSON.parse(res.data);
       console.log(picdata)
       this.pkDocId=picdata.filter((x:any)=>x.vdocTypeId==34)[0]?.vdmsDocId;
       this.frDocId=picdata.filter((x:any)=>x.vdocTypeId==36)[0]?.vdmsDocId;
       this.pksDocId=picdata.filter((x:any)=>x.vdocTypeId==261)[0]?.vdmsDocId;
       console.log("this.pkDocId",this.pkDocId)
       console.log("this.frDocId",this.frDocId)
       console.log("this.pksDocId",this.pksDocId)
      
     }else
     {
       alert("Employee details not found")
     }
    }
 
   })
 }
  allEsign()
  {
    this.alertEmpCode();
    if(this.pkDocId==undefined || this.pkDocId==null)
    {
     this.common.directEsignInsert(this.PKData,34);
   
    }
    if(this.frDocId==undefined || this.frDocId==null)
    {
     setTimeout(()=>{
       this.common.directEsignInsert(this.frData,36);
     },800);
    }
    if(this.pksDocId==undefined || this.pksDocId==null)
    {
      setTimeout(()=>{
        this.common.directEsignInsert(this.PKSData,261);
      },1600)
    }







  
  }
}

