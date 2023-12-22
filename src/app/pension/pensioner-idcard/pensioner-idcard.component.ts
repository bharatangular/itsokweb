import {Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pensioner-idcard',
  templateUrl: './pensioner-idcard.component.html',
  styleUrls: ['./pensioner-idcard.component.scss']
})
export class PensionerIdcardComponent implements  OnInit{
  
  public qrdata: any = '';
  public qrCodeDownloadLink: SafeUrl;
  constructor(private sanitizer: DomSanitizer, private router: Router) {

    this.qrdata = 'https://ifms.rajasthan.gov.in/ifmssso/';
  }

  ngOnInit(): void {
    
  }

  onChangeURL(url: any): void {
    this.qrCodeDownloadLink = this.sanitizer.bypassSecurityTrustResourceUrl(url)
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = this.qrCodeDownloadLink.toString();
    link.setAttribute('visibility', 'hidden');
    link.click();
  }
}
