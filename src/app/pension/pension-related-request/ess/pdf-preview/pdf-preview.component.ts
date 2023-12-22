import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss']
})
export class PdfPreviewComponent implements OnInit {
  base64data:any;
  isPdf:boolean=false;
  
  constructor(private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: {message: any},
    public router:Router,public dialog:MatDialog) { }

  ngOnInit(): void {
    this.preview();
  }
  pdfSrc:any
  downloadPdf()
  {
    let data=this.data.message.base64Pdf;
    let data2:any[]=data.split('base64,');
    const byteArray = new Uint8Array(
      atob(data2[1])
        .split("")
        .map(char => char.charCodeAt(0))
    );
    this.pdfSrc = "";
    const file = new Blob([byteArray], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    this.pdfSrc = fileURL;
    const pdfWindow = window.open("");
    pdfWindow!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");
  }
  preview()
  {
   
   let base=this.data.message.base64Pdf;

let maindata:any[]=base.split(",");

console.log("maindata",maindata)

if(maindata[0].includes("image"))
{
  this.base64data=this.data.message.base64Pdf; 
}else if(maindata[0].includes("pdf")){
  this.isPdf=true;
  this.base64data = maindata[0] +","+ (this.sanitizer.bypassSecurityTrustResourceUrl(maindata[1]) as any).changingThisBreaksApplicationSecurity;
console.log("base64",this.base64data);   
  if(top?.document.getElementById('ifrm'))
  {
    top.document.getElementById('ifrm')?.setAttribute("src", this.base64data);
  }
}
 
 
  }
  redirectToBack()
  {
this.router.navigate([this.data.message.redirectUrl]);
this.router.navigate(
  [this.data.message.redirectUrl],
  { queryParams: {} }
);
this.dialog.closeAll();
  }
}
