import { Component, Input, OnInit } from '@angular/core';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDialog } from '@angular/material/dialog';
import { DocumentId, DocumentIdList } from 'src/assets/utils/interface';
import { AppConfig } from 'src/app/app.config';
import { TokenManagementService } from 'src/app/services/token-management.service';

@Component({
  selector: 'app-bank-and-treasury-details',
  templateUrl: './bank-and-treasury-details.component.html',
  styleUrls: ['./bank-and-treasury-details.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})

export class BankAndTreasuryDetailsComponent implements OnInit {

  // input decorator
  @Input() empId: any;

  // variables
  isDisabled: boolean = true;
  bankList: any = [];
  error: string = '';
  empInfo: any;
  employeeId: any;
  treasury: any;
  documentId: DocumentId[] = [];
  aid: any;
  btnLabel: string = 'Proceed';
  empDoc: any;
  file3: any;
  file4: any;
  chequeFile: any;
  documentList: any;
  document: any;
  documentlist: any
  documentIdList: DocumentIdList[] = [];
  userDetails:any={"role":"",
  "roleid" :"",
 "assignmentid":""};
config:AppConfig=new AppConfig();

  constructor(private _pensionService: PensionServiceService, public _dialog: MatDialog,private tokenInfo:TokenManagementService) { }

  ngOnInit(): void {
    this.userDetails = this.config.getUserDetails();
    // console.log("my id", this.empId);

    this.empInfo =  this.tokenInfo.empinfoService;;
    this.treasury = this.config.getDetails('treasury_name');

    if (this.empInfo.roleId == 49) {
      this.btnLabel = 'Next';
    } else {
      this.btnLabel = 'Proceed';
    }

    if ( this.userDetails.roleid=='1') {
      this.bankDetail();
    } else {
      this.getTaskDetail(this.empId);
    }

  }


  onChangeCheque(event: any) {
    this.file4 = event.target.files[0];
    this.chequeFile = event.target.files[0].name;
    const employeeId = this.employeeId;
    const docTypeId = '18';
    this._pensionService.saveDocument(this.file4, employeeId, docTypeId).subscribe((res) => {
      let data = {
        docTypeId: docTypeId,
        documentId: res.data.dmsDocumentId,
        docName: res.data.uploadStatusMessage,
      };
      this.documentList.push(data);
      alert('File uploaded successfully');
    });
  }

  removeCheque() {
    this.file3 = null;
    this.chequeFile = '';
  }

  ViewCertificate() { }
  close(i: number) { }

  bankDetail() {
    let data = {
      employeeId: this.empId
    };
    this._pensionService
      .postRequestpension(data, 'getBankdetailsByEmpCode').subscribe({
        next: (res) => {
          if ((res.status = 200)) {
            this.bankList = res.data[0];
            // localStorage.setItem('bank-details', JSON.stringify(res.data[0]));
            this.config.storeDetails('bank-details',JSON.stringify(res.data[0]));
          }
        },
        error: (err) => {
          let errorObj = {
            message: err.message,
            err: err,
            response: err,
          };
        },
      });
  }


  getDetailDocument(name: any, id: any) {
    if (id == 1) {
      this.document = parseInt(this.config.getDetails('doc_Id')!);
    } else {
      for (let p of this.empDoc) {
        if (p.docTypeId == id) {
          this.document = p.documentId;
          console.log(p.documentId);
        }
      }
    }
    let data = {
      documentId: this.document,
    };

    this._pensionService.postRequestpension(data, 'getDocumentByDocumentId').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          // let file = new Blob([res.data.documentContent], { type: 'application/pdf' });
          // var fileURL = URL.createObjectURL(file);
          // window.open(fileURL);

          this.documentList = res.data.documentContent;

          this.downloadPdf(this.documentList, name);
          console.log(this.documentList);
        }
      },
      error: (err) => {
        console.log(err);
        this.error = err;
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      },
    });
  }

  downloadPdf(base64String: any, fileName: any) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
    window.URL.revokeObjectURL(link.href);
    window.open(link.href, '_blank');
  }


  getTaskDetail(taskId: any) {
    let data = {
      "taskId": taskId
    }
    this._pensionService.requestApplication(data, "task").subscribe({
      next: (res) => {
        if (res.status = 200) {


          this.documentlist = res.data.payload.Documents;
          this.empDoc = res.data.payload.document_Details;


          for (let D of this.documentlist) {
            for (let p of this.empDoc) {
              if (p.docTypeId == D.docTypeId) {
                this.documentId.push(
                  { id: p.docTypeId })

                this.documentIdList.push(
                  {
                    documentName: D.docName,
                    size: '215',
                    id: D.docTypeId
                  })
                console.log(this.documentIdList);

              }
            }
          }
        }
      },
      error: (err) => {
        console.log(err);
        this.error = err
      }
    })
  }


  stepC = 0;
  setStepC(index: number) {
    this.stepC = index;
  }
  nextStepC() {
    this.stepC++;
  }
  prevStepC() {
    this.stepC--;
  }

}

