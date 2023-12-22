import { Injectable } from '@angular/core';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { writeFile, utils, WorkBook, WorkSheet  } from 'xlsx';
import { PensionServiceService } from './pension-service.service';
import { LoaderService } from './loader.service';
import { MatDialog } from '@angular/material/dialog';
import { PdfPreviewComponent } from '../pension/e-pension/pdf-preview/pdf-preview.component';
import * as ExcelJS from 'exceljs';
import { ItsokService } from './itsok.service';

@Injectable({
  providedIn: 'root'

})

export class CommonService {
//  @ViewChild('content', { static: false }) el!: ElementRef;
  getResData:any;
  public getGlobalId:any;
  docId:any
  constructor(public api:ItsokService,
    public _Service:PensionServiceService,
    public load:LoaderService,
    public dialog:MatDialog) { }

  exportToPdf(el: HTMLElement){
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

   
  directEsign(data2:any,doctypeId:any)
  {
    let data={
  "reportPath": data2.reportPath,
  "name":data2.name,
  "value":data2.value,
  "sourceId":3,
  "processName":"PENSION_AUTO_PROCESS",
  "identifier":2,
  "identifierType":"DDO",
  "signName":"Addl Director Pension Pensioners Welfare.",
  "reason":"Approved",
  "location":"Jaipur",
  "searchText":"¥",
  "docName":data2.docName,
  "docTypeId":doctypeId,
  "docId":0
    }

    this.load.show();
    this._Service.postNewEsign("withOutOTPEsign", data).subscribe((res: any) => {
      res=JSON.parse(res)
      console.log(res)
    // console.log(res.data.document[0].docId);
    if(res.status=='success')
    {
      let data1=JSON.parse(res.data)
      console.log(data1)
      this.docId=data1.DocId;
        this.updateDocId(doctypeId,data1.DocId,data2)

    }else
    {
      alert("Some error occur.Try Again")
      this.load.hide();
    }


    })
  }
  directEsignInsert(data2:any,doctypeId:any)
  {
    let data={
  "reportPath": data2.reportPath,
  "name":data2.name,
  "value":data2.value,
  "sourceId":3,
  "processName":"PENSION_AUTO_PROCESS",
  "identifier":2,
  "identifierType":"DDO",
  "signName":"Addl Director Pension Pensioners Welfare.",
  "reason":"Approved",
  "location":"Jaipur",
  "searchText":"¥",
  "docName":data2.docName,
  "docTypeId":doctypeId,
  "docId":0
    }

    this.load.show();
    this._Service.postNewEsign("withOutOTPEsign", data).subscribe((res: any) => {
      res=JSON.parse(res)
      console.log(res)
    // console.log(res.data.document[0].docId);
    if(res.status=='success')
    {
      let data1=JSON.parse(res.data)
      console.log(data1)
      this.docId=data1.DocId;
      let uploadData={"empCode": data2.empCode,
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

    }else
    {
      alert("Some error occur.Try Again")
      this.load.hide();
    }


    })
  }
  update:boolean=false
  updateDocId(docTypeId: any,docId:any,data2:any) {
    this.update=false;
    let data = {
      "dmsDocId": docId,
      "pensionerId": data2.pensionerId,
      "docTypeId": docTypeId
    }
    this._Service.postPssRequest(data, "pensionerdocument").subscribe({
      next: (res) => {


          this.load.hide();
        this.update=true

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
  Previewbydocid(docId:any,reportpath:any)
  {
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
      if(res.status !== 'F'){
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
      else{
        this.load.hide();
      }
      
      
    }, err => {
      this.load.hide();
    })
  }
  PreviewbydocidOndialog(docId:any)
  {
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
  sendSMS(dataSms:any)
  {

    let data={
      "language":"ENG",
      "message":dataSms.msg,
      "mobList":dataSms.mobileNo,
      "templateId":dataSms.templateId,
      "msgType":"SMS"

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
  Preview(data2:any)
  {
    console.log("preview", data2);
    let data:any;

   data = {
      "reportPath":data2.reportPath,
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
        if(res.data.report.content)

        {
          let data={
            "base64Pdf":res.data.report.content,
            "redirectUrl":data2.redirectUrl
            }
  console.log("data",data);

           this.dialog.open(PdfPreviewComponent,{  width: '70%', data: {message: data },  disableClose: false});

      }
    })
  }
  updateDocIdnew(data:any)
  {
this._Service.requestApplication(data,'updatephotoid').subscribe((res: any) => {
  console.log("res",res)
  this.load.hide();
});
  }




  /**\
   * This method is used for download pdf
   * @id as table id
   */
  public downloadPdf(id:any,filename: string, heading? :any, jsonData?:any, tableHeaders?:any): void {

  const doc = new jsPDF({
    orientation: 'landscape',
});

  const xOffset = doc.internal.pageSize.width / 2;
  doc.text(heading, xOffset, 8, { align: 'center' });
  const footer = "http://pension.raj.nic.in ";
  const pageSize = doc.internal.pageSize;

  let tableData =[]

if(jsonData){
  const tableColumns =  Object.keys(tableHeaders[0]);

   tableData = jsonData.map((item: any) => {

    const rowData = tableColumns.map((column: any) => {

      const value = item[column];

      return value;
    });
    return rowData;
  });

  autoTable(doc, {
    head:tableHeaders ,
    body: tableData,
    margin: {
      top: 15,
      left: 0,
      right: 0,
      bottom: 15
    },
    styles: {
      fontSize: 6,
      font: 'helvetica',
    },
  });

  doc.save(filename + new Date().getTime() + '.pdf');
} else {
  autoTable(doc, {
      html: id,
      margin: {
          top: 15,
          left: 0,
          right: 0,
          bottom: 15
      },
      styles: {
        fontSize: 6,
        font: 'helvetica',

      },
  });

  doc.save(filename + new Date().getTime());
}
}









  /**
   *
   * @param data as data to be insert in sheet
   * @param fileName as file name to be download
   */
  ExportTOExcel(data: any[], fileName: string) {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(fileName);

    // Add headers
    const headers = Object.keys(data[0]);
    let headerRow =worksheet.addRow(headers);

    // Add data
    data.forEach((item) => {


      const row:any = [];
      headers.forEach((header,index) => {


        row.push(item[header]);
      });
      worksheet.addRow(row);
    });



    headerRow.eachCell(function (cell: ExcelJS.Cell, index) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2980ba' },

      };
      cell.font =  {
        color: {argb: "ffffff"},
        bold:true
      }
      cell.alignment = { horizontal: 'center' };
      cell.border = {
        top:   { style: "thin" },
        left:  { style: "thin" },
        bottom:{ style: "thin" },
        right: { style: "thin" }

      };
      worksheet.getColumn(index).width =  headers[index - 1].length < 20 ? 20 : headers[index - 1].length;


    });



    // Generate Excel file
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      // FileSaver(blob, `${fileName+ new Date().getTime()}.xlsx`);
    });
    this.load.hide()
  }


  exportTOExcel(data: any[], headersArray: any[], fileName: string) {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(fileName);

    // Add headers
    // const headers = headersArray;
    const headersKey = Object.keys(headersArray[0]);
    const headersValue = Object.values(headersArray[0]);
    let headerRow =worksheet.addRow(headersValue);

    // Add data
    data.forEach((item) => {


      const row:any = [];
      headersKey.forEach((header,index) => {


        row.push(item[header]);
      });
      worksheet.addRow(row);
    });



    headerRow.eachCell(function (cell: ExcelJS.Cell, index) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2980ba' },

      };
      cell.font =  {
        color: {argb: "ffffff"},
        bold:true
      }
      cell.alignment = { horizontal: 'center' };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }

      };
      worksheet.getColumn(index).width =  headersKey[index - 1].length < 20 ? 20 : headersKey[index - 1].length;


    });



    // Generate Excel file
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      // FileSaver(blob, `${fileName+ new Date().getTime()}.xlsx`);
    });
    this.load.hide()
  }

// itsok services

previewImage(medId:any)
{
  let data={
    "medId":medId
  }
  this.api.postisok("medicineImage",data).subscribe((res:any)=>{
    console.log("res",res);
    let imageUrl=this.api.imageUrl+res[0]?.image
    console.log("imageUrl",imageUrl);
  })
//   console.log("blob",data)  
// var reader = new FileReader();
// reader.readAsDataURL(data.data); 
// reader.onloadend = function() {
//   //  base64data = reader.result;   
//    console.log("base64data",reader.result)  
// }
}



}
