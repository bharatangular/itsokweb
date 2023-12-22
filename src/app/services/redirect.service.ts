import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { PensionServiceService } from "./pension-service.service";

@Injectable({
  providedIn: "root"
})
export class RedirectService {
  constructor(
    @Inject(DOCUMENT)
    private document: Document,private service:PensionServiceService
  ) {}

  public postRedirect(params: any) {

    const form = this.document.createElement("form");
    console.log('....params',params);
    form.method = "POST";
    form.target = "_top";
    form.action = this.service.redirectEsignUrl;
    form.enctype="multipart/form-data";
    const input = this.document.createElement("input");
      input.type = "hidden";
      input.name = "msg";
      input.value = params;
      console.log("input",input.name);
      form.append(input);



    this.document.body.appendChild(form);
    form.submit();
  }
}
