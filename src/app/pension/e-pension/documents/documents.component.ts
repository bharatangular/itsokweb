import { Component, Input, OnInit } from '@angular/core';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { TokenManagementService } from 'src/app/services/token-management.service';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})


export class DocumentsComponent implements OnInit {

  // input decorator
  @Input() empId: any;

  // variables
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  retirementOrderFiles: any[] = [];
  accommodationFile: any[] = [];
  documentListArray: any[] = [];
  singleFiles: any[] = [];
  singleFiles1: any[] = [];
  noDeFiles: any[] = [];
  noDuesFile: any[] = [];
  jointFiles: any[] = [];
  govtFiles: any[] = [];
  bankFiles: any[] = [];
  nsdlFiles: any[] = [];
  docList: any[] = [];
  docList1: any[] = [];
  files: any[] = [];
  governmentFiles: any[] = [];
  governmentShow: boolean = true;
  gFile: any;
  btnLabel: string = 'Proceed';
  documentList: any;
  document: any;
  empDoc: any;
  error: any;
  url: any;
  id1: any;
  id: any;
  fileName: any;
  show: boolean = false
  retirementShow: boolean = true;
  govtShow: boolean = true;
  noDeShow: boolean = true;
  bankShow: boolean = true;
  noDueShow: boolean = true;
  singleShow: boolean = true;
  nsdlShow: boolean = true;
  jointShow: boolean = true;
  accommodationShow: boolean = true;
  idList: any;
  empInfo: any;
  fileNSDL: any;
  nsdl1Files: any[] = [];
  nsdl1Show: boolean = true;
  fileSig: any;
  signatureFiles: any[] = [];
  signatureShow: boolean = true;
  duesFiles: any[] = [];
  duesShow: boolean = true;
  fileDues: any;
  progress: number = 0;
  noOfFiles: number = 35;
  completed: boolean = false;
  uploadProgress = 0;
  progress1: number = 0;
  noOfFiles1: number = 35;
  completed1: boolean = false;
  progress2: number = 0;
  noOfFiles2: number = 35;
  completed2: boolean = false;
  progress3: number = 0;
  noOfFiles3: number = 35;
  completed3: boolean = false;
  progress4: number = 0;
  noOfFiles4: number = 35;
  completed4: boolean = false;
  cpfFiles: any[] = [];
  cpfShow: boolean = true;
  fileCPF: any;
config:AppConfig=new AppConfig();
  constructor(private _pensionService: PensionServiceService, 
    private _snackBar: MatSnackBar, 
    public dialog: MatDialog,
    private tokenInfo:TokenManagementService) { }

  ngOnInit(): void {

    this.empInfo = this.tokenInfo.empinfoService;

    if (this.empInfo.roleId == 49) {
      this.btnLabel = 'Next';
    } else {
      this.btnLabel = 'Proceed';
    }

    if (this.empInfo.aid === "58233") {
      this.getAllUploadedDocumentDetailsByEmployeeCode();
    } else {
    }

  }

  downloadPdf(base64String: any, fileName: any) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.pdf`
    link.click();
    window.URL.revokeObjectURL(link.href);
    window.open(link.href, '_blank');
  }

  getDetailDocument(name: any, id: any) {

    if (id == 1) {
      this.document = parseInt(this.config.getDetails("doc_Id")!);
    }
    else {

      for (let p of this.empDoc) {
        if (p.docTypeId == id) {
          this.document = p.documentId
          console.log(p.documentId);
        }
      }
    }
    let data = {
      "documentId": this.document
    }

    this._pensionService.postRequestpension(data, "getDocumentByDocumentId").subscribe({
      next: (res) => {
        if (res.status = 200) {
          // let file = new Blob([res.data.documentContent], { type: 'application/pdf' });
          // var fileURL = URL.createObjectURL(file);
          // window.open(fileURL);

          this.documentList = res.data.documentContent;

          this.downloadPdf(this.documentList, name);
          console.log(this.documentList)
        }
      },
      error: (err) => {
        console.log(err);
        this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      }
    })
  }



  getAllUploadedDocumentDetailsByEmployeeCode() {
    let data = {
      "subModuleId": 4,
      "processId": 1,
      "employeeId": this.empId
    }
    this._pensionService.postRequestpension(data, 'getDocsDtlsBySubId').subscribe((res) => {
      if (res.status = 200) {

        this.documentList = res.data
        for (let i = 0; i < res.data.length; i++) {
          if (i % 2 == 0) {

            this.docList.push(res.data[i]);
            // this.Single_files.push(res.data[i]);

          }
          else {

            this.docList1.push(res.data[i]);
            //this.Single_files1.push(res.data[i]);

          }
        }
      }
      this.fileName = res.data[0].documentName
      let filename = {
        "progress": 0,
        "lastModified": 1672922117392,
        "lastModifiedDate": "Thu Jan 05 2023 18:05:17 GMT+0530 (India Standard Time)",
        "name": res.data[0].documentName,
        "size": 4250,
        "type": "image/jpeg",
        "webkitRelativePath": "",
      }
    })
  }

  /** on file drop handler **/
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /** handle file from browsing **/
  Pdf: string = '';
  fileBrowseHandler(event: any) {
    this.prepareFilesList(event.target.files);
  }

  /** Delete file from files list* @param index (File index) **/
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /** Simulate the upload process  **/

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }

  /** Convert Files list to normal array list * @param files (Files List) **/
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      for (let i = 0; i < this.files.length; i++) {

        if (this.files[i].name === item.name) {
          this._snackBar.open('Error occurred :- ', 'File is already Exist', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });

          return;
        }
      }
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }


  /*** format bytes* @param bytes (File size in bytes)* @param decimals (Decimals point) */
  formatBytes(bytes: any, decimals: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  // ********************Strat Retirement Order***********************************

  retirementOrder1(event: any) {
    this.retirementOrderList(event.target.files);
  }

  retirementOrderList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.retirementOrderFiles.push(item);
      this.retirementShow = false;
    }
    this.retirementUploadFilesSimulator(0);
  }

  filesDelete(index: number) {
    this.retirementOrderFiles.splice(index, 1);
    this.retirementShow = true;
  }

  retirementUploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.retirementOrderFiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.retirementOrderFiles[index].progress === 100) {
            clearInterval(progressInterval);
          } else {
            this.retirementOrderFiles[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }

  // ********************END Retirement Order ************************************


  // ********************Strat Retirement Order***********************************

  govtBrowseHandler(event: any) {
    this.govtList(event.target.files);
  }

  govtList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.govtFiles.push(item);
      this.govtShow = false;
    }
    this.govtUploadFilesSimulator(0);
  }

  govtDelete(index: number) {
    this.govtFiles.splice(index, 1);
    this.govtShow = true;
  }

  govtUploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.govtFiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.govtFiles[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.govtFiles[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }


  // ********************END Retirement Order ************************************

  // ********************Strat Retirement Order***********************************

  noDeCertificate(event: any) {
    this.noDeCertificateList(event.target.files);
  }

  noDeCertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.noDeFiles.push(item);
      this.noDeShow = false;
    }
    this.noDESimulator(0);
  }

  nodEDelete(index: number) {
    this.noDeFiles.splice(index, 1);
    this.noDeShow = true;
  }

  noDESimulator(index: number) {
    setTimeout(() => {
      if (index === this.noDeFiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.noDeFiles[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.noDeFiles[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************


  // ********************Strat Retirement Order***********************************

  bankPassbook(event: any) {
    this.bankCertificateList(event.target.files);
  }

  bankCertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.bankFiles.push(item);
      this.bankShow = false;
    }
    this.bankSimulator(0);
  }

  bankPassbookDelete(index: number) {
    this.bankFiles.splice(index, 1);
    this.bankShow = true;
  }

  bankSimulator(index: number) {
    setTimeout(() => {
      if (index === this.bankFiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.bankFiles[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.bankFiles[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************

  // ********************Strat Retirement Order***********************************

  noDuesCertificate(event: any) {
    this.noDuesCertificateList(event.target.files);
  }

  noDuesCertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.noDuesFile.push(item);
      this.noDueShow = false;
    }
    this.noDuesSimulator(0);
  }

  noDuesPassbookDelete(index: number) {
    this.noDuesFile.splice(index, 1);
    this.noDueShow = true;
  }

  noDuesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.noDuesFile.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.noDuesFile[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.noDuesFile[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }

  // ********************END Retirement Order ***********************************



  // ********************Strat Retirement Order***********************************

  singleon(event: any, docTypeId: any) {
    this.singleCertificateList(event.target.files);
    this.id = docTypeId
    this.singleFiles1.push(docTypeId);
    for (let p of this.singleFiles) {
      if (p.docTypeId === docTypeId) {
        this.id = 15
      }
    }
    //this.addProductlist(event.target.files);
  }


  singleCertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;

      this.singleFiles.push(item);
    }
    this.singleSimulator(0);
  }


  singleDelete(index: number) {
    this.singleFiles.splice(index, 1);
  }


  singleSimulator(index: number) {
    setTimeout(() => {
      if (index === this.singleFiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.singleFiles[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.singleFiles[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }

  // ********************END Retirement Order ***********************************


  // ********************Strat Retirement Order***********************************

  singleon1(event: any, id: any) {

    this.id1 = id
    this.idList = id + 2;
    this.singleCertificateList1(event.target.files);
    // for (let i = 0; i < this.doc_list.length; i++) {
    //
    //   if (this.doc_list[i].documentName === id) {
    //     this.show_doc = 1
    //   }
    //   else{
    //     this.show_doc = 0
    //   }

    // }
  }


  singleCertificateList1(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.singleFiles1.push(item);
      this.singleShow = false;
    }
    // this.Single_Simulator1(0);
  }


  singleDelete1(index: number) {
    this.singleFiles1.splice(index, 1);
    this.singleShow = true;
    this.id1 = ''
  }

  singleSimulator1(index: number) {
    setTimeout(() => {
      if (index === this.singleFiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.singleFiles[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.singleFiles[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************


  // ********************Strat Retirement Order***********************************

  governmentOn(event: any) {
    this.governmentCertificateList(event.target.files);
    this.gFile = event.target.files[0];
    const employeeId = this.empId
    const docTypeId = "16"

    this._pensionService.saveDocument(this.gFile, employeeId, docTypeId).subscribe(result => {

      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.documentListArray.push(data);
      // console.log(this.document_list);
      // alert("File uploaded successfully");

      // localStorage.setItem("doc_Id", result.data.dmsDocumentId)
      this.config.storeDetails("doc_Id", result.data.dmsDocumentId)
    });
    this.updateProgress1();
  }

  governmentCertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.governmentFiles.push(item);
      this.governmentShow = false;
    }
    // this.NSDL_Simulator(0);
  }

  governmentDelete(index: number) {
    this.governmentFiles.splice(index, 1);
    this.governmentShow = true;
  }

  //  ************  update progressess ************** 

  delay(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
  async updateProgress() {
    this.completed = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay(35);
      this.progress = Math.round(i * n);
      console.log(i);
    }
    this.completed = true;
  }

  delay1(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }

  async updateProgress1() {
    this.completed1 = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay1(35);
      this.progress1 = Math.round(i * n);
      console.log(i);
    }
    this.completed1 = true;
  }

  delay2(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }

  async updateProgress2() {
    this.completed2 = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay2(35);
      this.progress2 = Math.round(i * n);
      console.log(i);
    }
    this.completed2 = true;
  }

  delay3(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }

  async updateProgress3() {
    this.completed3 = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay3(35);
      this.progress3 = Math.round(i * n);
      console.log(i);
    }
    this.completed3 = true;
  }

  delay4(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }

  async updateProgress4() {
    this.completed4 = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay4(35);
      this.progress4 = Math.round(i * n);
      console.log(i);
    }
    this.completed4 = true;
  }


  // ********************Strat Retirement Order***********************************

  cpfOn(event: any) {
    this.cpfCertificateList(event.target.files);
    this.fileCPF = event.target.files[0];
    const employeeId = this.empId
    const docTypeId = "22"

    this._pensionService.saveDocument(this.fileCPF, employeeId, docTypeId).subscribe(result => {
      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.documentListArray.push(data);
      // console.log(this.document_list);
      // alert("File uploaded successfully");
      this.updateProgress2();
    });
  }

  cpfCertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.cpfFiles.push(item);
      this.cpfShow = false;
    }
    // this.NSDL_Simulator(0);
  }

  cpfDelete(index: number) {
    this.cpfFiles.splice(index, 1);
    this.cpfShow = true;
  }

  duesOn(event: any) {
    this.duesCertificateList(event.target.files);
    this.fileDues = event.target.files[0];
    const employeeId = this.empId
    const docTypeId = "19"

    this._pensionService.saveDocument(this.fileDues, employeeId, docTypeId).subscribe(result => {

      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.documentListArray.push(data);
      // console.log(this.document_list);
      // alert("File uploaded successfully");
    });
    this.updateProgress3();
  }

  duesCertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.duesFiles.push(item);
      this.duesShow = false;
    }
    // this.NSDL_Simulator(0);
  }

  duesDelete(index: number) {
    this.duesFiles.splice(index, 1);
    this.duesShow = true;
  }

  signatureOn(event: any) {
    this.signatureCertificateList(event.target.files);
    this.fileSig = event.target.files[0];
    const employeeId = this.empId
    const docTypeId = "20"

    this._pensionService.saveDocument(this.fileSig, employeeId, docTypeId).subscribe(result => {

      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.documentListArray.push(data);
      // console.log(this.document_list);
      // alert("File uploaded successfully");
    });

    this.updateProgress4();
  }

  signatureCertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.signatureFiles.push(item);
      this.signatureShow = false;
    }
    // this.NSDL_Simulator(0);
  }

  signatureDelete(index: number) {
    this.signatureFiles.splice(index, 1);
    this.signatureShow = true;
  }


  nsdl1On(event: any) {
    this.nsdl1CertificateList(event.target.files);
    this.fileNSDL = event.target.files[0];
    const employeeId = this.empId
    const docTypeId = "21"

    this._pensionService.saveDocument(this.fileNSDL, employeeId, docTypeId).subscribe(result => {

      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.documentListArray.push(data);
      // console.log(this.document_list);
      // alert("File uploaded successfully");
    });
    this.updateProgress();
  }


  nsdl1CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.nsdl1Files.push(item);
      this.nsdl1Show = false;
    }
    // this.NSDL_Simulator(0);
  }

  nsdl1Delete(index: number) {
    this.nsdl1Files.splice(index, 1);
    this.nsdl1Show = true;
  }

  nsdlOn(event: any) {
    this.nsdlCertificateList(event.target.files);
  }

  nsdlCertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.nsdlFiles.push(item);
      this.nsdlShow = false;
    }
    // this.NSDL_Simulator(0);
  }

  nsdlDelete(index: number) {
    this.nsdlFiles.splice(index, 1);
    this.nsdlShow = true;
  }

  nsdlSimulator(index: number) {
    setTimeout(() => {
      if (index === this.nsdlFiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.nsdlFiles[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.nsdlFiles[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************


  // ********************Strat Retirement Order***********************************

  jointOn(event: any) {
    this.jointCertificateList(event.target.files);
  }

  jointCertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.jointFiles.push(item);
      this.jointShow = false;
    }
    this.jointSimulator(0);
  }

  jointDelete(index: number) {
    this.jointFiles.splice(index, 1);
    this.jointShow = true;
  }

  jointSimulator(index: number) {
    setTimeout(() => {
      if (index === this.jointFiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.jointFiles[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.jointFiles[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************


  // ********************Strat Retirement Order***********************************

  accommodationOn(event: any) {
    this.accommodationList(event.target.files);
  }

  accommodationList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.accommodationFile.push(item);
      this.accommodationShow = false;
    }
    this.accommodationSimulator(0);
  }

  accommodationDelete(index: number) {
    this.accommodationFile.splice(index, 1);
    this.accommodationShow = true;
  }

  accommodationSimulator(index: number) {
    setTimeout(() => {
      if (index === this.accommodationFile.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.accommodationFile[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.accommodationFile[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }

  onPreviewFile() {
  }

}
