import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss'],
})
export class PdfPreviewComponent implements OnInit {
  base64data: any;
  constructor(
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: { message: any },
    public router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.preview();
  }
  preview() {
    let base = this.data.message.base64Pdf;
    this.base64data = 'data:application/pdf;base64,' + base;
    console.log('base64', this.base64data);
    this.base64data ='data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(base) as any).changingThisBreaksApplicationSecurity;
    if (top?.document.getElementById('ifrm')) {
      top.document.getElementById('ifrm')?.setAttribute('src', this.base64data);
    }
  }
  redirectToBack() {
    this.router.navigate([this.data.message.redirectUrl]);
    this.router.navigate([this.data.message.redirectUrl], { queryParams: {} });
    this.dialog.closeAll();
  }
}
