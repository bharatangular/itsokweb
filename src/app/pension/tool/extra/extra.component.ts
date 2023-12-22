import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { RedirectMultiService } from 'src/app/services/redirect-multi.service';

@Component({
  selector: 'app-extra',
  templateUrl: './extra.component.html',
  styleUrls: ['./extra.component.scss']
})
export class ExtraComponent implements OnInit {

  constructor(public _Service:PensionServiceService,public redirectMultiService:RedirectMultiService,private actRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.actRoute.queryParams.subscribe(params => {

      var esignRes = params['status'];
      var id = params['id'];
      
      if (esignRes) {
        if (id) {

          this.getEsignData(id);

        }
      }

    });
  }
  esignData:any;
  getEsignData(id: any) {

    let data = {
      "trxnNo": id,
      "databaseKey": "3"
    }
    let url = "esignTransaction";

    this._Service.postNewEsign(url, data).subscribe((res: any) => {


      this.esignData = JSON.parse(res);
      console.log("esignData",this.esignData)
      if (this.esignData.responseStatus == '1') {

      
        let docData={
          'jsonData':JSON.parse(this.esignData.multiPDF)
        }
        console.log("docData",docData)
        this._Service.getPensionerDetail(docData,"updateMultiDoc").subscribe((res:any)=>
        {
        },(error)=>{
            
          alert("error in Update doc service Service.")
         
        })


      
      } else {
       
      }
     
    })
  }
  esignRequest() {
    
    let time1 = new Date();
    let mainUrl = window.location.origin + "pension/#" + "/pension/tool/extra";
    let pk = "pk" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf";
    let ppo = "ppo" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf";
    let cpo = "cpo" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf";
    let gpo = "gpo" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf";
    let data = {
      "url": mainUrl,
      "databaseKey": "3",
      "cordX": 400,
      "cordY": 35,
      "assignmentId": "58175",
      "roleId": "3",
      "requestId": 0,
      "processId": 2,
      "pdfReqList": [
        {
          "reportPath": "/Pension/Pension_Kit/Report/PENSION_KIT_RPT.xdo",
          "name": "pensioner_id",
          "value": 1641035,
          "docTypeId": "34",
          "docName": pk,
        
        },
        {
          "reportPath": "/Pension/Pension_Kit/Report/PENSION_PPO.xdo",
          "name": "pensioner_id",
          "value": 1641035,
          "docTypeId": "51",
          "docName": ppo,
        },
        {
          "reportPath": "/Pension/Pension_Kit/Report/PENSION_CPO.xdo",
          "name": "pensioner_id",
          "value": 1641035,
          "docTypeId": "52",
          "docName": cpo,
        },
        {
          "reportPath": "/Pension/Pension_Kit/Report/PENSION_GPO.xdo",
          "name": "pensioner_id",
          
          "value": 1641035,
          "docTypeId": "53",
          "docName": gpo,
        }
      ]
    }
    console.log("esignXmlRequest", data);

    let url = "sendrequestmulti";

    this._Service.postMultiEsign(url, data).subscribe((res: any) => {

      res = JSON.parse(res)
      console.log("res", res);
      setTimeout(() => {
        this.redirectMultiService.postRedirect(res.signedRef);
      }, 300);
    }, (error) => {

      alert("Error in E-Sign Service.Please try after some time.")
    })

  }
}
