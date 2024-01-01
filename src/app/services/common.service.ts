import { Injectable } from '@angular/core';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { writeFile, utils, WorkBook, WorkSheet } from 'xlsx';
import { PensionServiceService } from './pension-service.service';
import { LoaderService } from './loader.service';
import { MatDialog } from '@angular/material/dialog';
import { PdfPreviewComponent } from '../pension/e-pension/pdf-preview/pdf-preview.component';
import * as ExcelJS from 'exceljs';
import { ItsokService } from './itsok.service';
import { ImagePreviewComponent } from '../itsok/image-preview/image-preview.component';

@Injectable({
  providedIn: 'root'

})

export class CommonService {
  //  @ViewChild('content', { static: false }) el!: ElementRef;
  getResData: any;
  public getGlobalId: any;
  docId: any
  constructor(public api: ItsokService,
    public _Service: PensionServiceService,
    public load: LoaderService,
    public dialog: MatDialog) { }

  exportToPdf(el: HTMLElement) {
    console.log(el);
    // const pdf = new jsPDF();
    //   const pdf = new jsPDF.default({
    //     orientation: "landscape",
    //     format: "a4",
    //   });
    //   // pdf.text("Reports",35,25),
    //   pdf.html(el,{
    //     callback: (pdf)=> {

    //       pdf.save("sample.pdf")
    //     },

    //     html2canvas: {
    //       scale: 0.18, // Adjust the scale if necessary
    //       },
    //      x: 12,
    //   //  y: 25,
    //     margin: 8,
    //   },

    //   )
    //   pdf.setFont('Italic');
    //       pdf.setFontSize(12);
    //       pdf.setTextColor('#e23131');
  }


  directEsign(data2: any, doctypeId: any) {
    let data = {
      "reportPath": data2.reportPath,
      "name": data2.name,
      "value": data2.value,
      "sourceId": 3,
      "processName": "PENSION_AUTO_PROCESS",
      "identifier": 2,
      "identifierType": "DDO",
      "signName": "Addl Director Pension Pensioners Welfare.",
      "reason": "Approved",
      "location": "Jaipur",
      "searchText": "¥",
      "docName": data2.docName,
      "docTypeId": doctypeId,
      "docId": 0
    }

    this.load.show();
    this._Service.postNewEsign("withOutOTPEsign", data).subscribe((res: any) => {
      res = JSON.parse(res)
      console.log(res)
      // console.log(res.data.document[0].docId);
      if (res.status == 'success') {
        let data1 = JSON.parse(res.data)
        console.log(data1)
        this.docId = data1.DocId;
        this.updateDocId(doctypeId, data1.DocId, data2)

      } else {
        alert("Some error occur.Try Again")
        this.load.hide();
      }


    })
  }
  directEsignInsert(data2: any, doctypeId: any) {
    let data = {
      "reportPath": data2.reportPath,
      "name": data2.name,
      "value": data2.value,
      "sourceId": 3,
      "processName": "PENSION_AUTO_PROCESS",
      "identifier": 2,
      "identifierType": "DDO",
      "signName": "Addl Director Pension Pensioners Welfare.",
      "reason": "Approved",
      "location": "Jaipur",
      "searchText": "¥",
      "docName": data2.docName,
      "docTypeId": doctypeId,
      "docId": 0
    }

    this.load.show();
    this._Service.postNewEsign("withOutOTPEsign", data).subscribe((res: any) => {
      res = JSON.parse(res)
      console.log(res)
      // console.log(res.data.document[0].docId);
      if (res.status == 'success') {
        let data1 = JSON.parse(res.data)
        console.log(data1)
        this.docId = data1.DocId;
        let uploadData = {
          "empCode": data2.empCode,
          "psnId": data2.pensionerId,
          "docitem": [
            {
              "docTypeId": data2.doctypeId,
              "createAid": data2.assignmentid,
              "dmsdocid": data1.DocId,
            }

          ]

        }
        this.updateDocIdnew(uploadData)

      } else {
        alert("Some error occur.Try Again")
        this.load.hide();
      }


    })
  }
  update: boolean = false
  updateDocId(docTypeId: any, docId: any, data2: any) {
    this.update = false;
    let data = {
      "dmsDocId": docId,
      "pensionerId": data2.pensionerId,
      "docTypeId": docTypeId
    }
    this._Service.postPssRequest(data, "pensionerdocument").subscribe({
      next: (res) => {


        this.load.hide();
        this.update = true

      },
      error: (err) => {
        // alert("Something went wrong");
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }
    })
  }
  Previewbydocid(docId: any, reportpath: any) {
    console.log("docid : new  " + docId);
    let data = {
      "type": 'pdf',
      "sourceId": 2,
      "docs": [
        {
          "docId": docId
        }
      ]
    }
    console.log("docid data", data)
    this.load.show();
    this._Service.postOr("wcc/getfiles", data).subscribe((res: any) => {
      if (res.status !== 'F') {
        if (res.data.document[0].content) {
          let data = {
            "base64Pdf": res.data.document[0].content,
            "redirectUrl": reportpath,
            // "type":ex2[1]
          }

          this.dialog.open(PdfPreviewComponent, { width: '70%', data: { message: data }, disableClose: false });
          this.load.hide();
        }
      }
      else {
        this.load.hide();
      }


    }, err => {
      this.load.hide();
    })
  }
  PreviewbydocidOndialog(docId: any) {
    console.log("docid : new  " + docId);
    let data = {
      "type": 'pdf',
      "sourceId": 2,
      "docs": [
        {
          "docId": docId
        }
      ]
    }
    console.log("docid data", data)
    this.load.show();
    this._Service.postOr("wcc/getfiles", data).subscribe((res: any) => {

      this.load.hide();
      if (res.data.document[0].content) {


        const byteArray = new Uint8Array(
          atob(res.data.document[0].content)
            .split("")
            .map(char => char.charCodeAt(0))
        );
        // this.pdfSrc = "";
        const file = new Blob([byteArray], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        // this.pdfSrc = fileURL;
        const pdfWindow = window.open("");
        pdfWindow!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");

      }




    }, err => {
      this.load.hide();
    })
  }
  sendSMS(dataSms: any) {

    let data = {
      "language": "ENG",
      "message": dataSms.msg,
      "mobList": dataSms.mobileNo,
      "templateId": dataSms.templateId,
      "msgType": "SMS"

    }
    this._Service.postOr("esanchaar/sendsmsotp", data).subscribe((res: any) => {
      console.log("res", res);



    })
  }
  picData: any = '';
  showPic = (id: any) => {
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
        this.picData = "data:image/jpeg;base64," + res.data.document[0].content;
      }
    })
  }
  Preview(data2: any) {
    console.log("preview", data2);
    let data: any;

    data = {
      "reportPath": data2.reportPath,
      "format": "pdf",
      "params": [
        {
          "name": data2.name,
          "value": data2.value
        }
      ]
    }

    console.log("single report data", data)
    this._Service.postOr("report/singlereport", data).subscribe((res: any) => {
      console.log("res", res.data.report.content);

      // const byteArray = new Uint8Array(
      //   atob(res.data.report.content)
      //     .split("")
      //     .map(char => char.charCodeAt(0))
      // );
      // // this.pdfSrc = "";
      // const file = new Blob([byteArray], { type: "application/pdf" });
      // const fileURL = URL.createObjectURL(file);
      // // this.pdfSrc = fileURL;
      // const pdfWindow = window.open("");
      // pdfWindow!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");
      if (res.data.report.content) {
        let data = {
          "base64Pdf": res.data.report.content,
          "redirectUrl": data2.redirectUrl
        }
        console.log("data", data);

        this.dialog.open(PdfPreviewComponent, { width: '70%', data: { message: data }, disableClose: false });

      }
    })
  }
  updateDocIdnew(data: any) {
    this._Service.requestApplication(data, 'updatephotoid').subscribe((res: any) => {
      console.log("res", res)
      this.load.hide();
    });
  }

  imagePreview(data: any) {
    this.dialog.open(ImagePreviewComponent, { width: 'auto', height: 'auto', data: { message: data, id: 1 }, disableClose: true }).afterClosed()
      .subscribe((data: any) => {
        console.log(data)

      });
  }
}
