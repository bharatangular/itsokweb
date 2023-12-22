import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { CommonService } from 'src/app/services/common.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.scss']
})
export class UploadPhotoComponent implements OnInit {
config:AppConfig=new AppConfig();
  constructor(public _Service:PensionServiceService,public common:CommonService, private imageCompress: NgxImageCompressService) { }

  ngOnInit(): void {
    this._Service.configMenu = { url: "Inbox > Upload Photo" };
    this.userDetails=this.config.getUserDetails();
  }
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

  dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: 'image/jpeg' });
  }

  
  uploadFile(event: any, i: any) {
    if(this.empCode=='' || this.empCode==null)
    {
      alert("Please insert employee code.")
      return
    }


    const file = event.target.files[0];

    if (file) {
        const fileType = file.type;

        if (fileType.includes('pdf')) {

            alert("Selected file is a PDF");

        } 
        else if (fileType.includes('image')) {

            const reader = new FileReader();

            reader.onloadend = (e: any) => {
              console.log("Old file", file);

                const maxSize = 100 * 1024; // 100KB in bytes
                let quality = 75; // Initial quality setting

                const compressRecursive = () => {
                    const base64String = e.target.result;
                    this.imageCompress
                        .compressFile(base64String, -1, quality, quality) // third argument is ratio, forth argument is quality
                        .then(compressedImage => {
                            const blob = this.dataURItoBlob(compressedImage);
                            const compressedSize = blob.size;
                            if (compressedSize <= maxSize) {
                                const jpegFile = new File([blob], file.name, {
                                    type: 'image/jpeg'
                                });
                                this.displayConvertedFile(jpegFile, i);
                            } else {
                                quality -= 5;
                                compressRecursive();
                            }
                        });
                }
                compressRecursive();
            };
            reader.readAsDataURL(file);

        } 
        else {

            alert("Selected file is not a PDF or image");

        }
    }

}

displayConvertedFile(file: File, i: any) {
  console.log("New file",file);
  let ex2: any[] = file.name.split(".");
  let time1 = new Date();
  const fileName = "doc" + time1.getHours() + time1.getMilliseconds().toString() + "." + ex2[1];

  var data4: any;
  const reader = new FileReader();
  //return;
  reader.onloadend = () => {
      data4 = reader.result;
      let data5 = data4.toString()
      let data6: any[] = [];
      data6 = data5.split("base64,")

      //console.log(data6);
      let data1 = {
          "type": "image",
          "sourceId": 2,
          "docAttributes": [

          ],
          "data": [{
              "docTypeId": "1",
              "docTypeName": "photo",
              "docName": fileName,
              "docTitle": "essdoc",
              "content": data6[1]
          }]
      }
      //console.log("data", data1);

      this._Service.postOr("wcc/uploaddocs", data1).subscribe((res: any) => {
          //console.log("res", res);

          if (res.status == "S") {

              if (res.data.document[0].docId) {
                  if (i == 1) {

                      this.imageUrl = data5;
                      let uploadData = {
                          "empCode": this.empCode,
                          "psnId": this.PensionerDetails?.psnId,
                          "docitem": [{
                                  "docTypeId": 33,
                                  "createAid": this.userDetails.assignmentid,
                                  "dmsdocid": res.data.document[0].docId,
                              }

                          ]

                      }
                      //console.log("uploadData", uploadData)

                      this.common.updateDocIdnew(uploadData)

                  } else if (i == 2) {
                      this.jointUrl = data5;
                      let uploadData = {
                          "empCode": this.empCode,
                          "psnId": this.PensionerDetails?.psnId,
                          "docitem": [{
                                  "docTypeId": 32,
                                  "createAid": this.userDetails.assignmentid,
                                  "dmsdocid": res.data.document[0].docId,
                              }

                          ]

                      }

                      this.common.updateDocIdnew(uploadData)
                  }

                  alert("Your photo has been uploaded successfully.")
              }
          } else {
              alert("Sorry, an error has occurred. Please try again later")
          }

      })
  };
  reader.readAsDataURL(file);



}
  // uploadFile(event: any,i:any) {
  //   if(this.empCode=='' || this.empCode==null)
  //   {
  //     alert("Please insert employee code.")
  //     return
  //   }
  //   let time1 = new Date();
  //   const file =  event.target.files[0];
  //   if((file.size/1024)>500)
  //   {
  //     alert("Max 500KB file size allowed")
  //     return;
  //   }
  //   let ex2:any[]=file.name.split("."); 
   
  //   if(ex2[1]=='jpg' || ex2[1]=='JPG' || ex2[1]=='jpeg' || ex2[1]=='JPEG' )
  //   {
      
  //   }else
  //   {
  //     alert("Only jpg and jpeg formats are allowed");
  //     return;
  //   }
  
  //   const fileName = "doc" + time1.getHours() + time1.getMilliseconds().toString()+"."+ex2[1];
   
    
  //   var data4: any;
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     console.log(reader.result);
  //     // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
  //     data4 = reader.result;
  //     let data5 = data4.toString()
  //     let data6:any [] = [];
  //     data6=data5.split("base64,")

  //     //console.log(data4);
  //     let data1 = {
  //       "type": "image",
  //       "sourceId": 2,
  //       "docAttributes": [

  //       ],
  //       "data": [
  //         {
  //           "docTypeId": "1",
  //           "docTypeName": "photo",
  //           "docName": fileName,
  //           "docTitle": "essdoc",
  //           "content": data6[1]
  //         }
  //       ]
  //     }
  //     //console.log("data", data1);
      
      
  //     this._Service.postOr("wcc/uploaddocs", data1).subscribe((res: any) => {
  //         console.log("res", res);
       
  //     if(res.status=="S")
  //     {
       
  //       if (res.data.document[0].docId) {
  //         if(i==1)
  //         {
            
  //           this.imageUrl=data5;
  //                   let uploadData={"empCode": this.empCode,
  //         "psnId": this.PensionerDetails.psnId,
  //         "docitem": [
  //          {
  //             "docTypeId": 33,
  //             "createAid": this.userDetails.assignmentid,
  //              "dmsdocid": res.data.document[0].docId,
  //              }
       
  //          ]
       
  //      }
  //     console.log("uploadData",uploadData)
    
  //      this.common.updateDocIdnew(uploadData)
           
  //         }else if(i==2)
  //         {
  //           this.jointUrl=data5;
  //           let uploadData={"empCode": this.empCode,
  //         "psnId": this.PensionerDetails.psnId,
  //         "docitem": [
  //          {
  //             "docTypeId": 32,
  //             "createAid": this.userDetails.assignmentid,
  //              "dmsdocid": res.data.document[0].docId,
  //              }
       
  //          ]
       
  //      }
           
        
      
  //        this.common.updateDocIdnew(uploadData)
  //         }
                    
                    
                    
  //           alert("Your photo has been uploaded successfully.")
  //         } 
  //     }else {
  //       alert("Sorry, an error has occurred. Please try again later")
  //     }
         
        
      
  //     })
  //   };
  //   reader.readAsDataURL(file);
  // }
  fetchDetails()
  {
    
    if(this.empCode=='' || this.empCode==null)
    {
      alert("Please insert employee code.")
      return
    }
   this.getPensionerDetails();
    this.getDocId()
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
  directEsign()
  {
    
      this.common.directEsign(this.PKData,34);
 
    setTimeout(()=>{
      this.common.directEsign(this.PKSData,261);
    },1000)
  }
}
