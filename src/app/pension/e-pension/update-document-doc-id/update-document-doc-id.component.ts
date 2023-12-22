import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-update-document-doc-id',
  templateUrl: './update-document-doc-id.component.html',
  styleUrls: ['./update-document-doc-id.component.scss']
})
export class UpdateDocumentDocIdComponent implements OnInit {
  empCode:any;
  empCodeList:any[]=[];
  pensionsetList:any[]=[];
  constructor(public _Service:PensionServiceService,public common:CommonService) { }

  ngOnInit(): void {
  }
  fetchData()
  {
this.getOldPensionDetails();
  }
  count=0;
  autoprocess()
  {
if(this.empCodeList.length)
{
  if(this.empCodeList.length>this.count)
this.empCode=this.empCodeList[this.count];
this.count++;
this.getOldPensionDetailsAuto()
}
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
this.frData={
  'reportPath':this.pensionData.reportPathFR,
  'name':"task_data_id",
  'value':this.pensionData.taskDataId,
  'docName':this.pensionData.docNameFR,
  'pensionerId':this.pensionData.psnId,
  'redirectUrl':"e-Pension/updatedocid"
}
 this.PKData={
  'reportPath':this.pensionData.reportPathPK1,
  'name':"pensioner_id",
  'value':this.pensionData.psnId,
  'docName':this.pensionData.docNamePK,
  "pensionerId":this.pensionData.psnId,
  'redirectUrl':"e-Pension/updatedocid"
}
this.PKSData={
  'reportPath':this.pensionData.reportPathPK2,
  'name':"pensioner_id",
  'value':this.pensionData.psnId,
  'docName':this.pensionData.docNamePKS,
  'pensionerId':this.pensionData.psnId,
  'redirectUrl':"e-Pension/updatedocid"
}
console.log(this.pensionData)

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
  getOldPensionDetailsAuto()
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
this.frData={
  'reportPath':this.pensionData.reportPathFR,
  'name':"task_data_id",
  'value':this.pensionData.taskDataId,
  'docName':this.pensionData.docNameFR,
  'pensionerId':this.pensionData.psnId,
  'redirectUrl':"e-Pension/updatedocid"
}
 this.PKData={
  'reportPath':this.pensionData.reportPathPK1,
  'name':"pensioner_id",
  'value':this.pensionData.psnId,
  'docName':this.pensionData.docNamePK,
  "pensionerId":this.pensionData.psnId,
  'redirectUrl':"e-Pension/updatedocid"
}
this.PKSData={
  'reportPath':this.pensionData.reportPathPK2,
  'name':"pensioner_id",
  'value':this.pensionData.psnId,
  'docName':this.pensionData.docNamePKS,
  'pensionerId':this.pensionData.psnId,
  'redirectUrl':"e-Pension/updatedocid"
}
console.log(this.pensionData)
this.autoPensionKitEsign()
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
  autoPensionKitEsign()
  {
    this.common.directEsign(this.PKData,34);
    setTimeout(()=>{
     this.autoprocess()
    },3000);
  }
 alertEmpCode()
 {
  if(this.empCode=='' || this.empCode==null)
    {
      alert("Please insert employee code.")
      return
    }
 }

  allEsign()
  {
 this.alertEmpCode();
    this.common.directEsign(this.frData,36);
    setTimeout(()=>{
      this.common.directEsign(this.PKData,34);
    },800);
    setTimeout(()=>{
      this.common.directEsign(this.PKSData,261);
    },1600)
  }
  countset=0
  autoprocesspensionSet()
  {
    if(this.empCodeList.length)
{
  if(this.pensionsetList.length>this.countset)
this.empCode=this.pensionsetList[this.countset];
this.countset++;
this.getOldPensionDetailsAutoset()
}
  }
  getOldPensionDetailsAutoset()
  {
    
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
this.getsinglereportJson()
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
  getsinglereportJson()
  {
    
    
    let data={
      "reportPath":this.pensionData.reportPathPS,
      "format": "pdf",
      "params": [
        {
          "name": "task_data_id",
          "value": this.pensionData.taskDataId
        }
      ]
    }
    console.log('data',data);
    this._Service.postOr('report/singlereport',data).subscribe((res:any)=>{
      if(res.data)
      {
        this.uploadpensionSet(res.data.report.content);
      }
    })
  }
  uploadpensionSet(base64:any)
  {
    let redendom=Math.floor(Math.random() * (3 - 1 + 1) + 1)
    let docname:string=this.empCode+redendom+'.pdf'
    let data={
      "type": "pdf",
      "sourceId": 2,
      "docAttributes": [
         
      ],
      "data": [
          {
              "docTypeId": 35,
              "docTypeName": "pdf",
              "docName": docname,
              "docTitle": docname,
              "content": base64
          }
      ]
  }
  console.log('data',data)
  this._Service.postOr("wcc/uploaddocs",data).subscribe((res:any)=>{
    setTimeout(() => {
      this.autoprocesspensionSet()
    }, 1000);
    if(res.data)
    {
      this.common.updateDocId(35,res.data.document[0].docId,this.pensionData);
    }
  })
  }
}
