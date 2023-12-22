import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { PensionServiceService } from './pension-service.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectMultiService {
  constructor(
    @Inject(DOCUMENT)
    private document: Document,private service:PensionServiceService
  ) {}

  public postRedirect(params: any) {

    const form = this.document.createElement("form");
    console.log('....params',params);
    form.method = "POST";
    form.target = "_top";
    form.action = this.service.redirectMultiEsignUrl;
    form.enctype="application/x-www-form-urlencoded";
    form.name= "upload_V3_2Form";
   
      const text1 = this.document.createElement("textarea");
      text1.rows=20;
      text1.cols=100;
      text1.name='txnref';
      text1.hidden=true;
      text1.textContent=params
      console.log(text1)
      form.append(text1);



    this.document.body.appendChild(form);
    form.submit();
  }
}