import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { CommonService } from 'src/app/services/common.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
// import {JsonEditorOptions} from "@maaxgr/ang-jsoneditor";
@Component({
  selector: 'app-ess-report',
  templateUrl: './ess-report.component.html',
  styleUrls: ['./ess-report.component.scss']
})
export class EssReportComponent implements OnInit {
  config:AppConfig=new AppConfig();
  requestId:any;
  constructor(  @Inject(DOCUMENT) private document: Document,public _Service:PensionServiceService,public common:CommonService) {
    // this.editorOptions = new JsonEditorOptions()
    // this.editorOptions.modes = ['code', 'text', 'tree', 'view'];

    
    this.visibleData = this.initialData;
   }
  // public editorOptions: JsonEditorOptions;
  public initialData: any;
  public visibleData: any;
  ngOnInit(): void {
    this._Service.configMenu = { url: "Inbox > Upload Photo" };
    this.userDetails=this.config.getUserDetails();
   
  }
  showJson(d: Event) {
    this.initialData = d;
  }
  taskdataId:any;
  getJson(i:any)
  { let data:any
    if(i==1)
    {
      if(this.empCode=='' || this.empCode==null)
      {
        alert("Enter Employee Code.");
        return
      }
      data={"empCode":this.empCode,'requestId':null}

    }else if(i==2)
    {
      if(this.requestId=='' || this.requestId==null)
      {
        alert("Enter request id.");
        return
      }
      data={"requestId":this.requestId,"empCode":null}

    }
    
    
    this._Service.postho("getEmployeeDetails",data).subscribe((res:any)=>{
      console.log("res",res);
      if(res.personalDetails)
      {
        this.data=res.personalDetails
        // this.initialData=JSON.parse(res.personalDetails);
        this.taskdataId=res.taskDataId;
      }
    })
  }
  data:any;
  selfPic:any
  jointPic:any
  userDetails:any;
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
      picdata.forEach((element:any) => {
        if(element.vdocTypeId=='33')
        {
          this.selfPic=element.vdmsDocId
          this.showPic(this.selfPic,1)
        }else if(element.vdocTypeId=='32')
        {
          this.jointPic=element.vdmsDocId
          this.showPic(this.jointPic,2)
        }
      });
    }else
    {
      alert("Employee details not found")
    }
   }

  })
}

showPic = (id: any,i:any) => {
  let data = {
    "type": "ess",
    "sourceId": 2,
    "docs": [
      {
        "docId": id
      }
    ]
  }
  console.log("single report data", data)
  this._Service.postOr("wcc/getfiles", data).subscribe((res: any) => {
    console.log("res", res.data.document[0].content);
    if (res.data.document[0].content) {
      if(i==1)
      this.imageUrl = "data:image/jpeg;base64," + res.data.document[0].content;
      else if(i==2)
      this.jointUrl = "data:image/jpeg;base64," + res.data.document[0].content;
    }
  })
}
  
  empCode:any;
  imageUrl:any
  jointUrl:any
  picData:any
  jointData:any
  uploadFile(event: any,i:any) {
    if(this.empCode=='' || this.empCode==null)
    {
      alert("Please insert employee code.")
      return
    }
    
    let time1 = new Date();
    const file =  event.target.files[0];
    if((file.size/1024)>500)
    {
      alert("Max 500KB file size allowed")
      return;
    }
    let ex2:any[]=file.name.split("."); 
   
    if(ex2[1]=='jpg' || ex2[1]=='JPG' || ex2[1]=='jpeg' || ex2[1]=='JPEG' )
    {
      
    }else
    {
      alert("Only jpg and jpeg formats are allowed");
      return;
    }
  
    const fileName = "doc" + time1.getHours() + time1.getMilliseconds().toString()+"."+ex2[1];
   
    
    var data4: any;
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(reader.result);
      // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      data4 = reader.result;
      let data5 = data4.toString()
      let data6:any [] = [];
      data6=data5.split("base64,")

      //console.log(data4);
      let data1 = {
        "type": "image",
        "sourceId": 2,
        "docAttributes": [

        ],
        "data": [
          {
            "docTypeId": "1",
            "docTypeName": "photo",
            "docName": fileName,
            "docTitle": "essdoc",
            "content": data6[1]
          }
        ]
      }
      //console.log("data", data1);
      
      
      this._Service.postOr("wcc/uploaddocs", data1).subscribe((res: any) => {
          console.log("res", res);
       
      if(res.status=="S")
      {
      
        if (res.data.document[0].docId) {

          if(i==1)
          {
            
            this.imageUrl=data5;
       
            let json=JSON.parse(this.data);
            json.personalDetails.selfPhotoId=res.data.document[0].docId;
           
            let count=0
       
            json.documents.forEach((element:any) => {
              if(element.docTypeId==33)
              {
                json.documents[i].dmsDocId=res.data.document[0].docId;
                count==1;
              }
            });
          if(count==1)
          {
            let selfPic = {
              "dmsDocId": res.data.document[0].docId,
              "docName": "Self Photograph",
              "docTypeId": 33
            }
            
            json.documents.push(selfPic)
          }
          
       this.data=JSON.stringify(json)
       
      
          }else if(i==2)
          {
            this.jointUrl=data5;
            let json=JSON.parse(this.data);
            json.personalDetails.jointPhotoId=res.data.document[0].docId;
        // this.initialData=json;
       
       
       let count=0
       
          json.documents.forEach((element:any) => {
            if(element.docTypeId==32)
            {
              json.documents[i].dmsDocId=res.data.document[0].docId;
              count==1;
            }
          });
        if(count==1)
        {
          
          let jointPic = {
            "dmsDocId": res.data.document[0].docId,
            "docName": "Joint Photograph",
            "docTypeId": 32
          }
          json.documents.push(jointPic)
        }
        this.data=JSON.stringify(json)
          }
                    
                    
                    
            alert("Your photo has been uploaded successfully.")
          } 
      }else {
        alert("Sorry, an error has occurred. Please try again later")
      }
         
        
      
      })
    };
    reader.readAsDataURL(file);
  }
  uploadFilejava(event: any) {
    // if(this.empCode=='' || this.empCode==null)
    // {
    //   alert("Please insert employee code.")
    //   return
    // }
    let time1 = new Date();
    const file =  event.target.files[0];
    if((file.size/1024)>500)
    {
      alert("Max 500KB file size allowed")
      return;
    }
    let ex2:any[]=file.name.split("."); 
   
    if(ex2[1]=='jpg' || ex2[1]=='JPG' || ex2[1]=='jpeg' || ex2[1]=='JPEG' )
    {
      
    }else
    {
      alert("Only jpg and jpeg formats are allowed");
      return;
    }
    const fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + "." + ex2[1];
    // const fileName = "doc" + time1.getHours() + time1.getMilliseconds().toString()+"."+ex2[1];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", fileName);
    this._Service.postOr("wcc/uploadfile",formData).subscribe((res:any)=>{
      console.log("res",res)
    })
    // var data4: any;
    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   console.log(reader.result);
    //   // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
    //   data4 = reader.result;
    //   let data5 = data4.toString()
    //   let data6:any [] = [];
    //   data6=data5.split("base64,")

    //   //console.log(data4);
    //   let data1 = {
    //     "type": "image",
    //     "sourceId": 2,
    //     "docAttributes": [

    //     ],
    //     "data": [
    //       {
    //         "docTypeId": "1",
    //         "docTypeName": "photo",
    //         "docName": fileName,
    //         "docTitle": "essdoc",
    //         "content": data6[1]
    //       }
    //     ]
    //   }
    //   //console.log("data", data1);
      
      
    //   this._Service.postOr("wcc/uploaddocs", data1).subscribe((res: any) => {
    //       console.log("res", res);
       
    //   if(res.status=="S")
    //   {
       
    //     if (res.data.document[0].docId) {
    //       if(i==1)
    //       {
            
    //         this.imageUrl=data5;
    //                 let uploadData={"empCode": this.empCode,
    //       "psnId": this.PensionerDetails.psnId,
    //       "docitem": [
    //        {
    //           "docTypeId": 33,
    //           "createAid": this.userDetails.assignmentid,
    //            "dmsdocid": res.data.document[0].docId,
    //            }
       
    //        ]
       
    //    }
    //   console.log("uploadData",uploadData)
    
    //    this.common.updateDocIdnew(uploadData)
           
    //       }else if(i==2)
    //       {
    //         this.jointUrl=data5;
    //         let uploadData={"empCode": this.empCode,
    //       "psnId": this.PensionerDetails.psnId,
    //       "docitem": [
    //        {
    //           "docTypeId": 32,
    //           "createAid": this.userDetails.assignmentid,
    //            "dmsdocid": res.data.document[0].docId,
    //            }
       
    //        ]
       
    //    }
           
        
      
    //      this.common.updateDocIdnew(uploadData)
    //       }
                    
                    
                    
    //         alert("Your photo has been uploaded successfully.")
    //       } 
    //   }else {
    //     alert("Sorry, an error has occurred. Please try again later")
    //   }
         
        
      
    //   })
    // };
    // reader.readAsDataURL(file);
  }
  updateJson()
  {
    this.initialData=JSON.parse(this.data)
  }
submitData()
{
 
  let data={
    "data":JSON.parse(this.data),
    "taskDataId":this.taskdataId
  }
  console.log("submit data",data);
  this._Service.postho("updateEmployeeDetails",data).subscribe((res:any)=>{
    console.log("res",res);
    if(res.data)
    {
      alert(res.data)
    }else
    {
      alert("Some Error occur")
    }
  })
}
  PensionerDetails:any
  frData:any;
  PKData:any;
  PKSData:any;
  getPensionerDetails()
  {
    let sendData:any;
    let data ={
      "ppoNo":"0",
      "empCode":this.empCode,
      "psnId":"0",
      "empId":"0"
    }

    this._Service.postdetype(data, "getpsndetailsbyids").subscribe({
      next: (res) => {
        if (res.status = 200) {
      
this.PensionerDetails=res.data;
this.frData={
  'reportPath':this.PensionerDetails.reportPathFR,
  'name':"task_data_id",
  'value':this.PensionerDetails.taskDataId,
  'docName':this.PensionerDetails.docNameFR,
  'pensionerId':this.PensionerDetails.psnId,
  'redirectUrl':"e-Pension/uploadPhoto"
}
 this.PKData={
  'reportPath':this.PensionerDetails.reportPathPK1,
  'name':"pensioner_id",
  'value':this.PensionerDetails.psnId,
  'docName':this.PensionerDetails.docNamePK,
  "pensionerId":this.PensionerDetails.psnId,
  'redirectUrl':"e-Pension/uploadPhoto"
}
this.PKSData={
  'reportPath':this.PensionerDetails.reportPathPK2,
  'name':"pensioner_id",
  'value':this.PensionerDetails.psnId,
  'docName':this.PensionerDetails.docNamePKS,
  'pensionerId':this.PensionerDetails.psnId,
  'redirectUrl':"e-Pension/uploadPhoto"
}

        }
      },
      error: (err) => {
 
       
      }
    })
  }
  
}
