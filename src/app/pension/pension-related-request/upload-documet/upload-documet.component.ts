import { error } from '@angular/compiler/src/util';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { log } from 'console';
import { AnyNsRecord } from 'dns';

import { SnackbarService } from 'src/app/services/snackbar.service';
import { PdfPreviewComponent } from '../ess/pdf-preview/pdf-preview.component';

import * as FileSaver from 'file-saver';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { NgxImageCompressService } from 'ngx-image-compress';
@Component({
  selector: 'app-upload-documet',
  templateUrl: './upload-documet.component.html',
  styleUrls: ['./upload-documet.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadDocumetComponent implements OnInit {
  @ViewChild('uploadFile') myInputVariable: ElementRef;
  @Input() DocumentList: any;
  @Input() config: any = {};
  @Input() subProcessId: any;
  @Input() userAction: any;
  @Input() isDis:any=1;
  @Input() IsSaveEnable: boolean =true;
  @Output() EmpDocument = new EventEmitter();
  files: any;
  frmDoc!: FormGroup;
  DocumentTypedata: Array<any> = [];
  documentList: Array<any> = [];
  isLoading:boolean=false;
  constructor(private apiService: ApiEssService, private snackbar: SnackbarService,private dialog:MatDialog, private imageCompress: NgxImageCompressService) { }

  ngOnInit(): void {
   

    let data ={
      "subProcessId":this.subProcessId,
     }
    this.apiService.postmdm('getDocList', data).subscribe({
      next: (res:any) =>{
        this.DocumentTypedata = res.data;
        this.DocumentTypedata=this.DocumentTypedata.filter((x:any)=>x.docTypeId!=23)   
        this.DocumentTypedata=this.DocumentTypedata.filter((x:any)=>x.docTypeId!=28)
        this.DocumentTypedata=this.DocumentTypedata.filter((x:any)=>x.docTypeId!=29)
        this.DocumentTypedata = this.DocumentTypedata.filter(item => item.docTypeId != 33);  
        this.saveList=this.DocumentTypedata
       console.log("this.saveList",this.saveList)
      //delete this.personalDetails.value.dobInWord;
             
      //console.log("DocumentTypedata11",this.DocumentTypedata)
      }
    })
    this.frmDoc = new FormGroup({
      docTypeId: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      description: new FormControl('')
    })
    if (this.config.isView) {
      this.frmDoc.disable();
    }
 
  }
  saveList:any
  ngOnChanges(changes:any){    

    changes.hasOwnProperty('IsSaveEnable')
    if(changes.hasOwnProperty('DocumentList')){
      this.documentList = changes.DocumentList.currentValue;
     
    
     console.log(" this.documentList", this.documentList )
    }
    // console.log("userAction",this.userAction.length)
    if(changes.hasOwnProperty('userAction')){
      // this.frmDoc?.enable();
     
    } else{
      // this.frmDoc?.disable();  
    }
   
      console.log(" this.DocumentTypedata14", this.DocumentTypedata)
    if(this.isDis=="0")
    {
      
      this.saveList= this.DocumentTypedata;
      this.DocumentTypedata=this.DocumentTypedata.filter((x:any)=>x.docTypeId!=24)
      console.log(" this.DocumentTypedata1", this.DocumentTypedata)
    }else{
      
      this.DocumentTypedata= this.saveList;
      console.log(" this.DocumentTypedata2", this.DocumentTypedata)
    }
  }

  getDocName = (id:number) =>{
      if(id && id!=33 && this.DocumentTypedata)
      {
        return this.DocumentTypedata.filter((x: any) => x.docTypeId == id)[0]?.docName;
      }
        
  }

  selectFile(files: any) {
    this.files = files.target.files[0];
    // files.target.value = null;
  }

  // saveDoc = () => {
    
  //   if (this.frmDoc.invalid) { return }
  //   const data = this.frmDoc.value;
  //   data.documentName = this.files.name;
  //   const fromData = new FormData();
  //   fromData.append('file', this.files);
  //   fromData.append('docTypeId', this.frmDoc.value.docTypeId);
  //   this.apiService.postdoc('uploadFileInWcc', fromData).subscribe({
  //     next: res =>{
  //       if(res.status == 'SUCCESS'){
  //         data.dmsDocumentId = res.data.dmsDocumentId;
  //         if(this.documentList == null){this.documentList=[]};
  //       this.documentList.push(data);
  //       this.EmpDocument.emit(this.documentList);
  //       }
  //     }, error: err =>{
  //       this.snackbar.show(err?.error?.description || 'Server Error', 'danger');
  //     }
  //   })
  // }
  fileSize:any="2MB";
  file:any;
  fileName:any;
  IsDoc:boolean=false
  uploadDoc() {   
    if (this.frmDoc.invalid) { return }
    const data = this.frmDoc.value;
    console.log("data",this.files.name);      
    let ex2:any[]=this.files.name.split("."); 
    console.log("size",this.files.size/1024)
    if(this.frmDoc.value.docTypeId!="32")
    {

    if((this.files.size/1024)>2048)
    {
      alert("Max 2 MB file size allowed")
      return;
    }
  }
    // if(this.frmDoc.value.docTypeId=="32")
    // {
    //   if((this.files.size/1024)>500)
    // {
    //   alert("Max 500KB file size allowed");
    //   return;
    // }
    //   if(ex2[1].includes('jpg') || ex2[1].includes('JPG') || ex2[1].includes('jpeg') || ex2[1].includes('JPEG')  )
    // {
      
    // } else
    // {
    //   alert("Only jpg, jpeg , png  file formats allowed")
    //   return;
    // } 
    // }else
    // {
    //   if(ex2[1].includes('jpg') || ex2[1].includes('JPG') || ex2[1].includes('jpeg') || ex2[1].includes('JPEG') || ex2[1].includes('png') || ex2[1].includes('PNG') || ex2[1].includes('PDF') || ex2[1].includes('pdf'))
    //   {
        
    //   } else
    //   {
    //     alert("Only jpg, jpeg , png , pdf file formats allowed")
    //     return;
    //   } 
    // } 
    if(this.documentList!=null)
    {
    for(let i=0;i<this.documentList.length;i++)
    {
      if(this.documentList[i].docTypeId==Number(data.docTypeId))
      {
        alert("This Document already uploaded.");
        return
      }
    }
  }
 
  if(this.frmDoc.value.docTypeId!="32")
  {
    this.isLoading=true;
    data.documentName = this.files.name;       
    let time1 = new Date();
    this.file =  this.files;    
    this.fileName = 'doc'+ time1.getDate() + (time1.getMonth()+1) +time1.getFullYear() + time1.getHours() +time1.getMinutes() + time1.getMilliseconds().toString()+"."+ex2[1];
    var docTypeId = this.frmDoc.value.docTypeId
    const reader = new FileReader();
    var data4: any;
    reader.onloadend = () => {
      console.log(reader.result);
      // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
     
      data4 = reader.result;
      let data5 = data4.toString()
      // console.log("data4",data4);
      let data6:any[]=data5.split(",")
      console.log("data6",data6.length)
   
      let time=new Date();
    let data7=data6[0].replace("data:","");
    data7=data7.replace(";base64","");
    data7=data7.replace("/","_")
    console.log(data7)
       let ex2:any[]=this.fileName.split("."); 
       let fileName =  'doc'+ time1.getDate() + (time1.getMonth()+1) +time1.getFullYear() + time1.getHours() +time1.getMinutes() + time1.getMilliseconds().toString()+"."+ex2[1];
      console.log("data5",data5);
      let data1 = {
        "type": data6[0],
        "sourceId": 2,
        "docAttributes": [

        ],
        "data": [
          {
            "docTypeId": docTypeId,
            "docTypeName": "essdoc",
            "docName": fileName,
            "docTitle": "essdoc",
            "content":data6[1]
          }
        ]
      }
      console.log("data", data1); 

   
  
      this.apiService.postOr("wcc/uploaddocs", data1).subscribe({
        next: (res:any) =>{
          console.log("res", res);
          this.isLoading=false;
          this.myInputVariable.nativeElement.value = '';
          if (res.data.document[0].docId) {
            data.dmsDocumentId = res.data.document[0].docId;
            if(this.documentList == null){this.documentList=[]};
            data['docTypeId']=Number(data['docTypeId']);
          this.documentList.push(data);
          this.EmpDocument.emit(this.documentList); 
          console.log("document_list", this.documentList);
            this.IsDoc = true;
            ("Your Document has been uploaded successfully")
          } else {
            alert("Sorry, an error has occurred. Please try again later")
          }
          this.frmDoc.patchValue({
            docTypeId:"",
            
          });
          
        }, error: err =>{
          this.isLoading=false;
          this.snackbar.show(err?.error?.description || 'Server Error', 'danger');
        }
      })
    };
    reader.readAsDataURL(this.file);
  }else
  {
    this.uploadFile()
  }
  }

 
  uploadFile() {
    const file = this.files
    if (file) {
        const fileType = file.type;
        if (fileType.includes('pdf')) {
            alert("Selected file is a PDF");
        } 
        else if (fileType.includes('image')) {
            const reader = new FileReader();
            reader.onloadend = (e: any) => {
              console.log("Old file", file);
                const maxSize = 200 * 1024; // 100KB in bytes
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
                                this.displayConvertedFile(jpegFile);
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
dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: 'image/jpeg' });
}
displayConvertedFile(file: File) {
  const data = this.frmDoc.value;
  console.log("New file",file);
  let ex2: any[] = file.name.split(".");
  let time1 = new Date();
  const fileName =  "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".jpeg" ;

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
      this.isLoading=true;
      this.apiService.postOr("wcc/uploaddocs", data1).subscribe((res: any) => {
     
         
          this.isLoading=false;
          this.isLoading=false;
          this.myInputVariable.nativeElement.value = '';
          if (res.data.document[0].docId) {
            data.dmsDocumentId = res.data.document[0].docId;
            if(this.documentList == null){this.documentList=[]};
            data['docTypeId']=Number(data['docTypeId']);
          this.documentList.push(data);
          this.EmpDocument.emit(this.documentList); 
          console.log("document_list", this.documentList);
            this.IsDoc = true;
            ("Your Document has been uploaded successfully")
          } else {
            alert("Sorry, an error has occurred. Please try again later")
          }
          this.frmDoc.patchValue({
            docTypeId:"",
            
          });
        
      },(error)=>{
        this.isLoading=false;
        alert("Some Error Occured")
      })
  };
  reader.readAsDataURL(file);



}
  remove = (index: number) =>{
    this.documentList.splice(index, 1);
  }
  resetDoc()
  {
    if(this.frmDoc.value.docTypeId=="32")
    {
      this.fileSize="500KB"
    }else{
      this.fileSize="2MB"
    }

    this.myInputVariable.nativeElement.value = "";
    this.file=null;
    this.files=null;
  }
  ///getDocList
  getDocumentFile = (id:any) =>{
    let data = {
      "type": "data",
      "sourceId": 2,
      "docs": [
        {
          "docId": id.dmsDocumentId
        }
      ]
    }
    console.log("single report data", data)
    this.apiService.postOr('wcc/getfiles', data).subscribe({
      next: (res:any) =>{
        console.log("res",res.data.document[0].docName)
        let extension:any
                       if(id.docTypeId==32)
                       {
                        extension="data:image/jpeg;base64,"
                       }else
                       {
                        extension="data:application/pdf;base64,"
                       }
        
                       let ex2:any[]=res.data.document[0].docName.split("-"); 
                       
                        ex2[0]=ex2[0].toString().replace("_","/");
                        
                       console.log("file exeeee",res.data.document[0].content);
                       let mainData=extension+res.data.document[0].content;
                       console.log("mainData",mainData)
                  // const a = document.createElement('a');
                  // a.href =  mainData;
                  // console.log("a.href",a.href);
                  // a.download = res.data.document[0].docName;
                  // a.click();
                  let data = {
                    "base64Pdf": mainData,
                    "redirectUrl": "/ess/profileUpdate",
                  }
                  console.log("data", data);
        
                  this.dialog.open(PdfPreviewComponent, { width: '70%', data: { message: data }, disableClose: false });
                  
          
      }, error: err =>{
        this.snackbar.show(err.error.description, 'danger')
      }
    })
  }

  
}
