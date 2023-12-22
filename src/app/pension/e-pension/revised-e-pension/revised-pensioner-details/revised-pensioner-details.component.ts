import {ChangeDetectorRef, Component,Inject,Input,OnInit} from '@angular/core';
import { PensionServiceService } from 'src/app/services/pension-service.service'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-revised-pensioner-details',
  templateUrl: './revised-pensioner-details.component.html',
  styleUrls: ['./revised-pensioner-details.component.scss']
})
export class RevisedPensionerDetailsComponent implements OnInit {

 
  jointImageUrl: any = '/assets/images/jointImg.jfif';
  imageUrl: any = '/assets/images/userImg.png';
  personalDetail: any;
  serviceDetails: any;
  empInfo: any;
  empDetails: any;
  Personaldetail: any;
  editFile: boolean = true;
  removeUpload: boolean = false;
  employeeId:any;
  isShow:any;
  constructor(
    public _dialog: MatDialog,    
    private cd: ChangeDetectorRef,
    private _Service: PensionServiceService,
    @Inject(MAT_DIALOG_DATA) public data: {message: any,isShow:any},
    private dialogRef: MatDialogRef<RevisedPensionerDetailsComponent>
    )
     { 
      
      
    }

 
 
    documentList:any[]=[];
  ngOnInit(): void {
console.log(this.data)

    this.isShow=this.data.isShow;
   if(this.isShow==1)
   {
    let  data={"requestId":null,"empCode":this.data.message.employeeCode};
    this._Service.postho("getEmployeeDetails",data).subscribe((res:any)=>{
   
      if(res.personalDetails)
      {
        this.empDetails=JSON.parse(res.personalDetails);
        console.log("this.empDetails",this.empDetails);
        this.jointPic(this.empDetails.personalDetails.jointPhotoId);
        this.showPic(this.empDetails.personalDetails.selfPhotoId); 
        // this.initialData=JSON.parse(res.personalDetails);
      let documentList=this.empDetails?.documents;
      console.log(documentList)
        if(documentList)
      {
        documentList.forEach((element:any) => {
          if(element.dmsDocId!='' && element.docTypeId!="32" && element.docTypeId!="33")
          {
            this.documentList.push(element)
          }
        });
      }
      }
    })
   }else if(this.isShow==2)
   {
    this.empDetails= this.data.message;
    this.jointPic(this.empDetails.personalDetails.jointPhotoId);
    this.showPic(this.empDetails.personalDetails.selfPhotoId); 
    // this.initialData=JSON.parse(res.personalDetails);
  let documentList=this.empDetails?.documents;
  console.log(documentList)
    if(documentList)
  {
    documentList.forEach((element:any) => {
      if(element.dmsDocId!='' && element.docTypeId!="32" && element.docTypeId!="33")
      {
        this.documentList.push(element)
      }
    });
  }
   }
   
   
  }

  jointPic = (id:any) =>{
    let data = {
      "type": "ess",
      "sourceId": 2,
      "docs": [
        {
          "docId":id
        }
      ]
    }
    console.log("single report data", data)
    this._Service.postOr("wcc/getfiles", data).subscribe((res: any) => {
      //console.log("res", res.data.document[0].content);
      if (res.data.document[0].content) {
        this.jointImageUrl="data:image/jpeg;base64,"+res.data.document[0].content;
      }
    })
  }

  picData:any='';
  showPic = (id:any) =>{
    let data = {
      "type": "ess",
      "sourceId": 2,
      "docs": [
        {
          "docId":id
        }
      ]
    }
    console.log("single report data", data)
    this._Service.postOr("wcc/getfiles", data).subscribe((res: any) => {
      console.log("res", res.data.document[0].content);
      if (res.data.document[0].content) {
        this.imageUrl="data:image/jpeg;base64,"+res.data.document[0].content;
      }
    })
  }
  base64Pdf:any
  pdfSrc:any;
  showpreview(DocId:any)
  {
    let data={
      "type": "pdf",
      "sourceId": 2,
      "docs": [
        {
         
          "docId":  DocId
        }
      ]
    }
    let url="getpdffiles";
  
  this._Service.postNewEsign(url,data).subscribe((res:any)=>
  {
  
    res=JSON.parse(res)
    console.log("res",res.data.document[0].content);
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
  
    }else{
      alert("Some error occured.")
    }
  })
  }
  uploadFile(event: any) {

    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.editFile = false;
        this.removeUpload = true;
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }



}


