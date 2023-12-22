import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiEssService } from 'src/app/services/api-ess.service';


@Component({
  selector: 'app-preview-pension-ess',
  templateUrl: './preview-pension-ess.component.html',
  styleUrls: ['./preview-pension-ess.component.scss']
})
export class PreviewPensionEssComponent implements OnInit {
  jointImageUrl:any='assets/images/male-avatar.jpg';
  imageUrl:any='assets/images/male-avatar.jpg';
 personalDetail:any;
 serviceDetail:any;
 payEntitlement:any;
 familyDetails:any;
 nominiDetails:any;
 getRelationList:any;
 getGenderList:any;
 getSchemeTypeList:any;
 PdocumentList:any;
  constructor(   @Inject(MAT_DIALOG_DATA) public data: {message: any,empData:any},public apiService:ApiEssService,public api:ApiEssService,private dialogRef: MatDialogRef<PreviewPensionEssComponent>,public date:DatePipe) { }

  ngOnInit(): void {
    this.getRelation();
    this.getGender();
    this.getSchemeType();
    console.log("data",this.data.empData)
    this.personalDetail=this.data.empData?.employeePersonalDetail;
    this.serviceDetail=this.data.empData?.employeeServiceDetails;
    this.payEntitlement=this.data.empData?.payEntitlementDetails;
    this.familyDetails=this.data.empData?.employeeFamilyDetails?.familyDetails;
    this.nominiDetails=this.data.empData?.employeeFamilyDetails?.nomineeDetails;
    console.log("this.familyDetails",this.familyDetails)
    this.showPic(this.personalDetail?.employeePhoto,1);
    let jPic= this.personalDetail?.documentList?.filter((x:any)=>x.docTypeId==32)[0].dmsDocumentId
    this.showPic(jPic,2);
   if(this.personalDetail?.documentList.length>0)
   {
    this.PdocumentList=this.personalDetail?.documentList.filter((x:any)=>x.docTypeId!=32);
    console.log("PdocumentList",this.PdocumentList)
   
   }
  }
  geNomineeList(data:any){
    if(data === null) {data = [], this.nominiDetails = []}
    return data.filter((item:any)=> item.nomineeActive === 1);
  }
  getRelation = () => {
    this.apiService.postmdm('getFamilyRelation', {}).subscribe({
      next: (res) => {
        this.getRelationList = res.data;
      }
    })
  }
  getGenderName = (id: number) => {
    if (id !== undefined && id !== 0 && id !== null)
      return this.getGenderList.filter((x: any) => x.genId == id)[0]?.genNameEn;
  }

  getRelationName = (id: number) => {
    if (id !== undefined && id !== 0 && id !== null )
      return this.getRelationList.filter((x: any) => x.relationId == id)[0]?.rNameEn;
  }
  getGender = () => {
    this.apiService.postmdm('getGender', {}).subscribe({
      next: (res) => {
        this.getGenderList = res.data;
      }
    })
  }
  getScheme = (id: number) => {
    if (id !== undefined)
      return this.getSchemeTypeList.filter((x: any) => x.schNomId == id)[0]?.schNomNameEn;     
  }
  getSchemeType = () => {

    this.apiService.postmdm('getSchemeType', {}).subscribe({
      next: (res) => {
        let data=res.data;
        this.getSchemeTypeList = res.data;
       
      }
    })

  }
  base64Pdf: any;
  pdfSrc: any;
  showpreview(DocId: any) {
    let data = {
      type: 'pdf',
      sourceId: 2,
      docs: [
        {
          docId: DocId,
        },
      ],
    };
    let url = 'getpdffiles';

    this.api.postNewEsign(url, data).subscribe((res: any) => {
      res = JSON.parse(res);
      console.log('res', res.data.document[0].content);
      this.base64Pdf = res.data.document[0].content;
      if (this.base64Pdf) {
        const byteArray = new Uint8Array(
          atob(this.base64Pdf)
            .split('')
            .map((char) => char.charCodeAt(0))
        );
        this.pdfSrc = '';
        const file = new Blob([byteArray], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.pdfSrc = fileURL;
        const pdfWindow = window.open('');
        pdfWindow!.document.write(
          "<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>"
        );
      } else {
        alert('Some error occured.');
      }
    });
  }
  showPic = (id:any,i:any) =>{
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
    this.apiService.postOr('wcc/getfiles', data).subscribe({
      next: (res:any) =>{
       
         
          data=  res.data.document[0].content;
          if(i==1)
          this.imageUrl="data:image/jpeg;base64,"+data;
          if(i==2)
          this.jointImageUrl="data:image/jpeg;base64,"+data;
         // console.log("pic Data",this.picData)
       
      }, error: err =>{
        
      }
    })
  }
  stepc = 0;
  nextStepc() {
   
   this.stepc++;
 }
 prevStepc() {
   this.stepc--;
 }
}
