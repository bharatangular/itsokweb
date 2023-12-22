import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { RedirectService } from 'src/app/services/redirect.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { LoaderService } from 'src/app/services/loader.service';

export interface checkedlist {
  extracheese: string;
  mushroom: string;
  pepperoni: string;
}

interface gap {
  dateRange: string;
  fromDate: string;
  toDate: string;
}
interface qualifyingService {
  fromDate: string;
  toDate: string;
}

interface count {
  sum: number;
}

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss'],
})
export class CommonDialogComponent implements OnInit {
  empDetails: any;
  file: any;
  fileName: any;
  sendAllData: any;
  esignData: any;
  isDisabled: boolean = true;
  is_Disabled: boolean = true;
  message: string = '';
  id!: number;
  hide = true;
  dr_Master!: FormGroup;
  serviceRecordForm!: FormGroup;
  stopApprovalForm!: FormGroup;
  loanAdvanceForm!: FormGroup;
  markLeaveForm!: FormGroup;
  intergerRegex = /^\d+$/;
  status: string = 'Deactive';
  reasonError: string = '';
  documentError: string = '';

  drmaster: boolean = false;
  remark: boolean = false;
  confirm: boolean = false;
  isDeStatus: boolean = false;
  isPenalty: boolean = false;
  datalist: any;
  serviceCatData: any[] = [];
  serviceCatData1: any[] = [];
  addEditServiceRecordslist: any[] = [];
  serviceSubCatData: any[] = [];
  isformInvalid: boolean = false;
  gapArray: gap[] = [];
  gapArray1: gap[] = [];
  gapArray_p: gap[] = [];
  gapArray_p1: gap[] = [];
  empinfo: any = {};
  qualifyingServiceArray: qualifyingService[] = [];
  qualifyingServiceArray_p: qualifyingService[] = [];
  isShowNomineeDetails = false;
  isShowNomineeDetails1 = false;
  gapData: any = [];
  date_Data: count[] = [];
  serviceRecordarry: any[] = [];
  datarecord: any;
  rid: any;
  RangeChange1: any;
  RangeChange: any;
  reqId: any;
  aid: any;
  btnText: any;
  ppo_no: any;
  generated: any;
  checked: checkedlist[] = [];
  random: any = Math.floor(Math.random() * 10000) + 1;
  serviceRecordData: any = [];
  advanceRecordData: any = [];
  employeeId: any;
  totalNoOfDays: any;
  joiningDate: any;
  // minDate: Date;
  nonMinDate: Date;
  nonMaxDate: Date;
  maxDate: Date;
  isQualifying = false;
  Responsedata: any;
  maxDate2: Date;
  RetirementDate: any;
  document_list: any[] = [];
  action: any;
  remarkde: string = '';
  documentlist: any;
  docIdValue: any;
  docId: any;
  isLoading2: boolean = false;
  constructor(
    private _snackBar: MatSnackBar,
    private formbuilder: FormBuilder,
    private ActivatedRoute: ActivatedRoute,
    private _Service: PensionServiceService,
    @Inject(MAT_DIALOG_DATA)
    private data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CommonDialogComponent>,
    private router: Router,
    private load: LoaderService,
    private date: DatePipe,
    private redirectService: RedirectService,
    private actRoute: ActivatedRoute,
    private snackbar: SnackbarService,
    private tokenInfo: TokenManagementService
  ) {
    // this.totalNoOfDays=(this.loanAdvanceForm.controls['principleAmount'].value) - (this.loanAdvanceForm.controls['recoveredAmount'].value)
    console.log(data);
    this.empinfo = this.tokenInfo.empinfoService;
    this.joiningDate = data.doj;
    this.RetirementDate = data.dor;
    this.maxDate = new Date(this.joiningDate);
    this.maxDate = new Date(
      this.maxDate.getFullYear(),
      this.maxDate.getMonth(),
      this.maxDate.getDate() - 1
    );
    this.maxDate2 = new Date(this.RetirementDate);
    this.maxDate2 = new Date(
      this.maxDate2.getFullYear(),
      this.maxDate2.getMonth(),
      this.maxDate2.getDate() - 1
    );
    this.nonMinDate = this.maxDate;
    this.nonMaxDate = this.maxDate2;
    console.log('maxDate', this.maxDate);
    console.log('maxDate2', this.maxDate2);
    console.log('nonMinDate', this.nonMinDate);
    console.log('nonMaxDate', this.nonMaxDate);
    this.message = data.message;
    this.id = data.id;
    this.rid = data.rid;
    this.action = data.action;
    this.reqId = data.reqId;
    this.aid = data.aid;
    this.btnText = data.btnText;

    this.ppo_no = data.ppo_no;

    this.Responsedata = data.Responsedata;

    this.serviceRecordData = data.field;

    if (this.id == 6) {
      this.totalNoOfDays = data.field.totalNoOfDays;
    }
    if (this.id == 7) {
      this.advanceRecordData = data.field;
    }
    if (this.id == 20 || this.id == 21) {
      this.getJson();
    }
    if (this.id == 22) {
      this.getNpaData();
    }
    if (this.id == 22) {
      this.getSpeData();
    }
    if (this.id == 40) {
      this.empDetails = data.empData;
      console.log('empDetails', this.empDetails);
    }
    if(this.id== 41){
      this.empDetails = data.empData;
      console.log(this.id ," empDetails " , this.empDetails)
    }
  }

  ngOnInit(): void {
    this.employeeId = this.ActivatedRoute.snapshot.paramMap.get('employeeId');
    if (this.id != 4) {
      this.fetchApplicationHistory();
      this.getDeType();
      this.getPenaltyTypes();
      this.getLoanType();
      this.getTreasury();
    }

    // stop auto approval
    this.stopApprovalForm = this.formbuilder.group({
      remarkde: ['', Validators.required],
      // stopDoc: ['', Validators.required],
    });

    //#region Loan And Advance
    this.loanAdvanceForm = this.formbuilder.group({
      loanTypeId: ['', Validators.required],
      treasury: ['', Validators.required],
      sanctionNumber: [''],
      sanctionAmount: [''],
      recoveredAmount: [0],
      principleAmount: [0, Validators.required],
      interest: [0, Validators.required],
      netDueAmount: [{ value: 0, disabled: true }],
      sanctionDate: [''],
      netPrinciple: [''],
    });

    if (this.advanceRecordData != 0) {
      this.fetchLoanAndAdvance();
    }

    //#endregion Loan And Advance

    this.dr_Master = this.formbuilder.group({
      Pay_Commission: ['', Validators.required],
      Entitlement_Status: new FormControl('', Validators.required),
      DR_Rate: new FormControl('', [
        Validators.required,
        Validators.pattern(this.intergerRegex),
      ]),
      Order_No: new FormControl('', [
        Validators.required,
        Validators.pattern(this.intergerRegex),
      ]),
      Order_Date: new FormControl('', Validators.required),
      DR_date: new FormControl('', Validators.required),
      Status: new FormControl('', Validators.required),
    });

    this.getServiceCategory();

    //#region Add Service Records
    this.serviceRecordForm = this.formbuilder.group({
      total_Service_Length: new FormControl(''),
      Qualifying_Service: new FormControl(''),
      qualifyingServiceOtherOrganisationDate: new FormControl(''),
      totalNonQualifyService: new FormControl(''),
      totaleolNonQualifyService: new FormControl(''),
      totalredNonQualifyService: new FormControl(''),
      totalsusNonQualifyService: new FormControl(''),
      totalintNonQualifyService: new FormControl(''),
      totalRVRESNonQualifyService: new FormControl(''),
      totalcivilService: new FormControl(''),
      totalMilitryService: new FormControl(''),
      totalOtherService: new FormControl(''),
      Non_Qualifying_Service: new FormControl(''),
      Non_Qualifying_Service_date: new FormControl(''),
      Total_Qualifying_Service: new FormControl(''),
      DE_Status: new FormControl(''),
      DE_Type: new FormControl(''),
      DEstart_Date: new FormControl(''),
      DEend_Date: new FormControl(''),
      Penalty: new FormControl(''),
      Penalty_Type: new FormControl(''),
      Remark: new FormControl(''),
      id: new FormControl(''),
      totalNoOfDays: new FormControl(''),
      nonQualifyingServicestart_Date: new FormControl(''),
      nonQualifyingServiceend_Date: new FormControl(''),
      eolnonQualifyingServicestart_Date: new FormControl(''),
      eolnonQualifyingServiceend_Date: new FormControl(''),
      Suspensionperiodnontreatedstart_Date: new FormControl(''),
      Suspensionperiodnontreatedend_Date: new FormControl(''),
      ServicesRenderedbelow18yearsagestart_Date: new FormControl(''),
      ServicesRenderedbelow18yearsageend_Date: new FormControl(''),
      InterruptioninservicecondonedUnderrule17start_Date: new FormControl(''),
      InterruptioninservicecondonedUnderrule17end_Date: new FormControl(''),
      ServicesRenderedbyRVRESemployeesbeforemerginginGovtstart_Date:
        new FormControl(''),
      ServicesRenderedbyRVRESemployeesbeforemerginginGovtend_Date:
        new FormControl(''),
      civilservicestart_Date: new FormControl(''),
      civilserviceend_Date: new FormControl(''),
      militryservicestart_Date: new FormControl(''),
      militryserviceend_Date: new FormControl(''),
      Otherstart_Date: new FormControl(''),
      Otherend_Date: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      eolfromDate: new FormControl(''),
      eoltoDate: new FormControl(''),
      qualifyingService_p: new FormControl(''),
      nonQualifyingServiceDate_p: new FormControl(''),
      eolnonQualifyingServiceDate_p: new FormControl(''),
      nodeCertificate: new FormControl(''),
    });
    this.fetchServiceRecords();
    //#endregion Add Service Records
    this.serviceRecordForm.get('DE_Status')?.setValue('0');

    this.markLeaveForm = this.formbuilder.group({
      fromDate: [''],
      toDate: [''],
    });
  }
  npaList: any;
  getNpaData() {
    console.log('data', this.data.empId);
    this._Service
      .postCumm('getNpaData', { employeeId: this.data.empId })
      .subscribe(
        (res: any) => {
          console.log('res', res);
          if (res.data) {
            this.npaList = res.data;
          }
        },
        (error) => {
          alert('Service have error.Please try after sone time');
        }
      );
  }
  spePayList: any;
  getSpeData() {
    console.log('data', this.data.empId);
    this._Service
      .postCumm('getNpaData', { employeeId: this.data.empId })
      .subscribe(
        (res: any) => {
          console.log('res', res);
          if (res.data) {
            this.spePayList = res.data;
          }
        },
        (error) => {
          alert('Service have error.Please try after sone time');
        }
      );
  }
  objectionArray: any[] = [];
  documentList: any[] = [];
  getJson() {
    let data = { requestId: this.reqId, empCode: null };

    this._Service.postho('getEmployeeDetails', data).subscribe((res: any) => {
      console.log('res', res);
      if (res.personalDetails) {
        let data = JSON.parse(res.personalDetails);
        this.objectionArray = data.ObjectionArray;
        let documentList = data.documents;
        console.log('objectionArray', this.objectionArray);
        console.log('documentList', documentList);
        if (documentList) {
          documentList.forEach((element: any) => {
            if (
              element.dmsDocId != '' &&
              element.docTypeId != '32' &&
              element.docTypeId != '33'
            ) {
              this.documentList.push(element);
            }
          });
        }
      }
    });
  }
  base64Pdf: any;
  pdfSrc: any;
  showpreview(DocId: any) {
    let data = {
      type: 'pdf',
      sourceId: 2,
      docs: [
        {
          docId: DocId,
        },
      ],
    };
    let url = 'getpdffiles';

    this._Service.postNewEsign(url, data).subscribe((res: any) => {
      res = JSON.parse(res);
      console.log('res', res.data.document[0].content);
      this.base64Pdf = res.data.document[0].content;
      if (this.base64Pdf) {
        const byteArray = new Uint8Array(
          atob(this.base64Pdf)
            .split('')
            .map((char) => char.charCodeAt(0))
        );
        this.pdfSrc = '';
        const file = new Blob([byteArray], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.pdfSrc = fileURL;
        const pdfWindow = window.open('');
        pdfWindow!.document.write(
          "<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>"
        );
      } else {
        alert('Some error occured.');
      }
    });
  }
  calculateNetDues(principleAmount: any, recoveredAmount: any, interest: any) {
    if (principleAmount > 0) {
      let netDuesAmt =
        Number(principleAmount) - Number(recoveredAmount) + Number(interest);
      this.loanAdvanceForm.get('netDueAmount')?.setValue(netDuesAmt);
      console.log(netDuesAmt);
      let netPrincipal = Number(principleAmount) - Number(recoveredAmount);
      this.loanAdvanceForm.patchValue({ netPrinciple: netPrincipal });

      console.log(netPrincipal);
    }
  }

  onChange1(event: any) {
    this.file = event.target.files[0];
    this.fileName = event.target.files[0].name;
    const employeeId = this.employeeId;
    const docTypeId = '17';
    this._Service
      .saveDocument(this.file, employeeId, docTypeId)
      .subscribe((result) => {
        let data = {
          docTypeId: docTypeId,
          documentId: result.data.dmsDocumentId,
          docName: result.data.uploadStatusMessage,
        };
        this.document_list.push(data);
        alert('File uploaded successfully');
      });
  }
  onChange2(event: any) {
    let time1 = new Date();

    this.file = event.target.files[0];
    this.fileName =
      'No_DE_Certificate' + time1.getHours() + time1.getMinutes().toString();
    const employeeId = this.employeeId;
    const docTypeId = '17';
    const reader = new FileReader();
    var data4: any;
    reader.onloadend = () => {
      console.log(reader.result);
      // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      data4 = reader.result;

      console.log(data4);
      let data = {
        type: 'pension',
        sourceId: 2,
        docAttributes: [],
        data: [
          {
            docTypeId: 17,
            docTypeName: 'No_DE_Certificate',
            docName: this.fileName,
            docTitle: 'Certificate',
            content: data4,
          },
        ],
      };
      this._Service.postOr('wcc/uploaddocs', data).subscribe((res: any) => {
        console.log('res', res);
        let data = {
          docTypeId: docTypeId,
          documentId: res.data.document[0].docId,
          docName: this.fileName,
        };
        this.document_list.push(data);
        console.log('document_list', this.document_list);
      });
    };
    reader.readAsDataURL(this.file);

    // this._Service.saveDocument(this.file, employeeId, docTypeId).subscribe(result => {
    //   let data =
    //   {
    //     "docTypeId": docTypeId,
    //     "documentId": result.data.dmsDocumentId,
    //     "docName": result.data.uploadStatusMessage,
    //   }
    //   this.document_list.push(data);
    //   alert("File uploaded successfully")
    // });
  }

  removeFile1() {
    this.file = null;
    this.fileName = '';
  }

  getEsignData() {
    let msg: string;
    let data = {
      trxnNo: this.data.message.transId,
      databaseKey: '3',
    };
    let url = 'esignTransaction';

    this._Service.postNewEsign(url, data).subscribe((res: any) => {
      this.esignData = JSON.parse(res);
      if (this.esignData.responseStatus == '1') {
        msg = 'E-Sign Successfully done.';
        this.billProcess();
        this.deletefile();
      } else {
        msg = 'E-Sign have Error.';
      }
      console.log('esignData', this.esignData);
    });
  }
  deletefile() {
    let url = 'deleteFile';
    let data = {
      fileName: this.esignData.docName,
    };
    console.log('delete file', data);
    this._Service.postNewEsign(url, data).subscribe((res: any) => {
      console.log('delete file res', res);
    });
  }
  billProcess() {
    let url = 'saveBill';
    let data = {
      billNo: 12347,
    };
    this._Service.postSavebill(url, data).subscribe((res: any) => {
      console.log('bill data', res);
    });
  }
  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  get f() {
    return this.dr_Master.controls;
  }
  submitted = false;
  onSubmit() {
    console.log('hello', this.dr_Master);
    this.submitted = true;
    if (this.dr_Master.valid) {
      return;
    } else {
      let data = {
        payCmmsn: this.dr_Master.controls['Pay_Commission'].value,
        salMin: 10000,
        salMax: 50000,
        minAmt: 5000,
        drRate: this.dr_Master.controls['DR_Rate'].value,
        drRateFix: 4000,
        isDp: 1000,
        drFlag: 'S',
        isPension: 'Y',
        isGpo: 'Y',
        isActive: 1,
        createdBy: 1,
        modifiedBy: 1,
      };

      this._Service
        .postRequestPensionSave(data, 'saveDrRateService')
        .subscribe({
          next: (res) => {
            if ((res.status = 200)) {
              // alert(res.data)
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
  }
  onChange(event: any) {
    if (event.checked == true) {
      this.status = 'Active';
    } else {
      this.status = 'Deactive';
    }
  }
  fetchApplicationHistory() {
    let data = {
      requestId: this.reqId,
    };

    this._Service.requestApplication(data, 'getRemarkByRequestId').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.datalist = res.data;
          console.log('data is:' + JSON.stringify(this.datalist));
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

  Download_PDF() {
    // let data ={
    //     // "e": this.employeeId
    //     "employeeId": this.employeeId
    //   }
    //        this._Service.downloadPDF(data, 'getCPOGPOPPO').subscribe({
    //       next: (res) => {
    //         this.downloadPdf(res.data,"PPO");
    //      this.esignRequest(res.data);
    //       },
    //       error: (err) => {
    //         let errorObj = {
    //           message: err.message,
    //           err: err,
    //           response: err
    //         }
    //       }
    //     })
    this.Responsedata;

    this.esignRequest(this.Responsedata);
  }

  esignRequest(resData: any) {
    let purl: string =
      this.router['location']._platformLocation.location.origin;
    let url2: string = this.router.url;
    let mainUrl = purl + '/pension/#' + url2;
    // let data = {
    //   "reportPath": resData.reportPath,
    //   "name": "",
    //   "value": resData.empCode,
    //   "url": mainUrl,
    //   "contextPath": "",
    //   "cordXvalue": 725,
    //   "cordYvalue": 50,
    // //  "assignmentId": this.userDetails.assignmentid,
    //   "docTypeId": resData.docTypeId,
    //   "docName": resData.docName,
    //  // "roleId": this.userDetails.roleid,
    //   //"requestId":this.allBillData['requestId'],
    //   "processId":6
    // }

    let data = {
      reportPath: '/Pension/FR/PENSION_FR.xdo',
      name: '',
      value: 'RJAJ199601031640',
      url: mainUrl,
      contextPath: '3',
      cordX: 800,
      cordY: 0,
      assignmentId: '58238',
      docTypeId: '123',
      docName: 'PK_RJAJ199601031640',
      roleId: '6',
      requestId: '2805',
      processId: 6,
    };

    console.log('esignXmlRequest', data);
    let url = 'sendrequest';
    this._Service.postNewEsign(url, data).subscribe((res: any) => {
      console.log('res', res);
 let data = {
          "reportPath": "/Pension/FR/PENSION_FR.xdo",
          "name": "",
          "value": "RJAJ199601031640",
          "url": mainUrl,
          "contextPath": "3",
          "cordX": 400,
          "cordY": 35,
         "assignmentId": "58238",
          "docTypeId": "123",
          "docName": "PK_RJAJ199601031640",
          "roleId": "6",
          "requestId":"2805",
          "processId":6
        }

      this.redirectService.postRedirect(res);
    });
  }

  downloadPdf(base64String: any, fileName: any) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
  }

  Download_PDF_ESS() {
    let data = {
      // "e": this.employeeId
      employeeId: this.employeeId,
    };
    this._Service.downloadPDF(data, 'getCPOGPOPPO').subscribe({
      next: (res) => {
        this.downloadPdf_ESS(res.data, 'ESS');
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

  downloadPdf_ESS(base64String: any, fileName: any) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
  }
  finalclose() {
    this.router.navigateByUrl('/pension/Inbox');
    // if(this.aid==57247 || this.aid==57248){
    //    this.router.navigateByUrl('/PensionApplication/HoEmployee');
    // }
    // else if(this.aid==57249){
    //   this.router.navigateByUrl('/PensionApplication/RoleToken');
    // }
    // else{
    //   this.router.navigateByUrl('/PensionApplication/RoleToken');
    // }
  }

  //#region Add Service Records
  addServiceRecord1(data: any) {
    console.log('data', data);

    this.serviceRecordData.serviceRecordDetails.filter(
      (x: any) => x.type == 'Non-Qualifying Service'
    )[0].serviceLengh;
    this.serviceRecordData.serviceRecordDetails.filter(
      (x: any) => x.type == 'Qualifying Service(From Previous Organisation)'
    )[0].serviceLengh;
  }
  fetchServiceRecords() {
    console.log(this.serviceRecordData);

    (this.qualifyingServiceOtherOrganisationDate =
      this.serviceRecordData.serviceRecordDetails.filter(
        (x: any) => x.type == 'Qualifying Service(From Previous Organisation)'
      )[0].serviceLengh),
      this.serviceRecordForm.patchValue({
        total_Service_Length: this.serviceRecordData.totalServiceLength,
        Qualifying_Service: this.serviceRecordData.qualifyingService,
        Qualifying_Service_other_Organisation_date: '',
        nonQualifyingService: this.serviceRecordData.nonQualifyingService,
        Non_Qualifying_Service_date:
          this.serviceRecordData.nonQualifyingServiceDate,

        DE_Status: this.serviceRecordData.deStatus,
        DE_Type: this.serviceRecordData.deType,
        DEstart_Date: this.serviceRecordData.deStartDate,
        DEend_Date: this.serviceRecordData.deEndDate,
        Penalty: this.serviceRecordData.penalty,
        Penalty_Type: this.serviceRecordData.penaltyType,
        Remark: this.serviceRecordData.remark,
        id: this.serviceRecordData.id,
        totalNoOfDays: this.totalNoOfDays,

        totalNonQualifyService:
          this.serviceRecordData.serviceRecordDetails.filter(
            (x: any) => x.type == 'Non-Qualifying Service'
          )[0].serviceLengh,
        totaleolNonQualifyService:
          this.serviceRecordData.serviceRecordDetails.filter(
            (x: any) => x.type == 'EOL Non-Qualifying Service'
          )[0].serviceLengh,
        totalredNonQualifyService:
          this.serviceRecordData.serviceRecordDetails.filter(
            (x: any) => x.type == 'Services Rendered below 18 years age'
          )[0].serviceLengh,
        totalsusNonQualifyService:
          this.serviceRecordData.serviceRecordDetails.filter(
            (x: any) => x.type == 'Suspension period non treated as Qualifying'
          )[0].serviceLengh,
        totalintNonQualifyService:
          this.serviceRecordData.serviceRecordDetails.filter(
            (x: any) =>
              x.type == 'Interruption in service condoned Under rule -17'
          )[0].serviceLengh,
        totalRVRESNonQualifyService:
          this.serviceRecordData.serviceRecordDetails.filter(
            (x: any) =>
              x.type ==
              'Services Rendered by RVRES employees before merging in Govt'
          )[0].serviceLengh,
        totalcivilService: this.serviceRecordData.serviceRecordDetails.filter(
          (x: any) => x.type == 'Civil Service'
        )[0].serviceLengh,
        totalMilitryService: this.serviceRecordData.serviceRecordDetails.filter(
          (x: any) => x.type == 'Military Service'
        )[0].serviceLengh,
        totalOtherService: this.serviceRecordData.serviceRecordDetails.filter(
          (x: any) =>
            x.type == 'Other(Any other service not treated as qualifying)'
        )[0].serviceLengh,
      });
    this.gapArray = this.serviceRecordData.serviceRecordDetails.filter(
      (x: any) => x.type == 'Non-Qualifying Service'
    )[0].serviceDates;
    this.gapArray1 = this.serviceRecordData.serviceRecordDetails.filter(
      (x: any) => x.type == 'EOL Non-Qualifying Service'
    )[0].serviceDates;
    this.gapArray2 = this.serviceRecordData.serviceRecordDetails.filter(
      (x: any) => x.type == 'Suspension period non treated as Qualifying'
    )[0].serviceDates;
    this.gapArray3 = this.serviceRecordData.serviceRecordDetails.filter(
      (x: any) => x.type == 'Services Rendered below 18 years age'
    )[0].serviceDates;
    this.gapArray4 = this.serviceRecordData.serviceRecordDetails.filter(
      (x: any) => x.type == 'Interruption in service condoned Under rule -17'
    )[0].serviceDates;
    this.gapArray10 = this.serviceRecordData.serviceRecordDetails.filter(
      (x: any) =>
        x.type == 'Services Rendered by RVRES employees before merging in Govt'
    )[0].serviceDates;
    this.gapArray6 = this.serviceRecordData.serviceRecordDetails.filter(
      (x: any) => x.type == 'Civil Service'
    )[0].serviceDates;
    this.gapArray7 = this.serviceRecordData.serviceRecordDetails.filter(
      (x: any) => x.type == 'Military Service'
    )[0].serviceDates;

    this.isShowNomineeDetails = true;
    this.isShowNomineeDetails1 = true;
    this.isShowNomineeDetails2 = true;
    this.isShowNomineeDetails3 = true;
    this.isShowNomineeDetails4 = true;
    this.isShowNomineeDetails5 = true;
    this.isShowNomineeDetails6 = true;
    this.isShowNomineeDetails10 = true;
    if (this.serviceRecordData.deStatus == 1) {
      this.isDeStatus = true;
    }
    if (this.serviceRecordData.penalty == 1) {
      this.isPenalty = true;
    }
    this.serviceRecordForm.patchValue({
      fromDate: this.date.transform(
        this.serviceRecordData.qualifyingService[0].fromDate,
        'yyyy-MM-dd'
      ),
      toDate: this.date.transform(
        this.serviceRecordData.qualifyingService[0].toDate,
        'yyyy-MM-dd'
      ),
      DEstart_Date: this.date.transform(
        this.serviceRecordData.deStartDate,
        'yyyy-MM-dd'
      ),
      DEend_Date: this.date.transform(
        this.serviceRecordData.deEndDate,
        'yyyy-MM-dd'
      ),
    });

    this.qualifyingServiceArray.push({
      fromDate: this.serviceRecordForm.value.fromDate,
      toDate: this.serviceRecordForm.value.toDate,
    });

    this.qualifyingServiceArray_p = this.serviceRecordData.qualifyingService_p;
    (this.gapArray_p = this.serviceRecordData.nonQualifyingServiceDate_p),
      (this.gapArray_p1 = this.serviceRecordData.eolnonQualifyingServiceDate_p);
    this.qualifyingServiceOtherOrganisationDate =
      this.serviceRecordData.qualifyingServiceOtherOrganisationDate;
  }
  getServiceCategory() {
    let data = [
      {
        serviceCategoryId: 1,
        serviceCategoryNameEn: 'All India Service',
      },
      {
        serviceCategoryId: 2,
        serviceCategoryNameEn: 'All Rajasthan Service',
      },
    ];

    this.serviceCatData.push(data);

    this.serviceCatData1 = this.serviceCatData[0];
    this._Service.postRequestAddress(null, 'getAllServiceCategory').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
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
  detypelist: any;
  getDeType() {
    let data = {};

    this._Service.postdetype(data, 'getDeTypes').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.detypelist = res.data;
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
  loantypelist: any;
  getLoanType() {
    let data = {
      attrValue: 1,
    };

    this._Service.postloantype(data, 'getLoanTypeData').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.loantypelist = res.data.loanTypeData;
          //console.log(this.loantypelist);
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

  getTreasuryName = (id: string) => {
    if (id)
      return this.treasurylist.filter((x: any) => x.treasCode == id)[0]
        .treasNameEn;
    else return '';
  };
  getLoanTypeName = (id: string) => {
    return this.loantypelist.filter((x: any) => x.loanTypeId == id)[0]
      .loanTypeNameEn;
  };

  treasurylist: any;
  getTreasury() {
    let data = {
      attrValue: 2,
    };

    this._Service.postloantype(data, 'getTreasuryData').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.treasurylist = res.data.treasuryData;
          //console.log(this.treasurylist);
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

  penaltytypelist: any;
  getPenaltyTypes() {
    let data = {};

    this._Service.postdetype(data, 'getPenaltyTypes').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.penaltytypelist = res.data;
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

  getServiceSubCategory(event: any) {
    this.serviceSubCatData = [];
    let data = {
      serviceCategoryId: event,
    };
    this._Service
      .postRequestAddress(data, 'getAllSubServiceCategoryByServiceCategoryId')
      .subscribe({
        next: (res) => {
          if ((res.status = 200)) {
            if (res.data === 'No Data Found!') {
            } else {
              this.serviceSubCatData = res.data;
            }
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

  showHideFields(val: any) {
    if (val === 1) {
      this.isDeStatus = true;
    } else {
      this.isDeStatus = false;
      this.serviceRecordForm.get('DEstart_Date')?.setValue('');
      this.serviceRecordForm.get('DE_Type')?.setValue('');
      this.serviceRecordForm.get('DEend_Date')?.setValue('');
      this.serviceRecordForm.get('Penalty_Type')?.setValue('');
    }
  }
  showHideRemark(val: any) {
    if (val === 1) {
      this.isPenalty = true;
    } else {
      this.isPenalty = false;
    }
  }

  //#endregion Add Service Records

  //#region Loan And Advance

  fetchLoanAndAdvance() {
    this.loanAdvanceForm.patchValue({
      fullnfinalAmount: this.advanceRecordData.fullnfinalAmount,
      interestAmount: this.advanceRecordData.interestAmount,
      interestAmountCalculated: this.advanceRecordData.interestAmountCalculated,
      interestAmountDeposited: this.advanceRecordData.interestAmountDeposited,
      lastBillMonth: this.advanceRecordData.lastBillMonth,
      lastBillYear: this.advanceRecordData.lastBillYear,
      loanAccountNo: this.advanceRecordData.loanAccountNo,
      loanAmountDeposited: this.advanceRecordData.loanAmountDeposited,
      loanAmountDrawn: this.advanceRecordData.loanAmountDrawn,
      premiumAmount: this.advanceRecordData.premiumAmount,
      totalInstallment: this.advanceRecordData.totalInstallment,
      totalInstallmentDeposited:
        this.advanceRecordData.totalInstallmentDeposited,
    });
  }

  //#region  Loand And Advance Start
  addEditLoanAdvance() {
    if (this.loanAdvanceForm.valid) {
      this.isformInvalid = false;
      // return
      let data = {
        loanTypeId: this.loanAdvanceForm.controls['loanTypeId'].value,
        loanTypeName: this.getLoanTypeName(
          this.loanAdvanceForm.controls['loanTypeId'].value
        ),
        treasury: this.loanAdvanceForm.controls['treasury'].value
          ? this.loanAdvanceForm.controls['treasury'].value
          : '',
        treasuryName: this.getTreasuryName(
          this.loanAdvanceForm.controls['treasury'].value
        ),
        sanctionNumber: this.loanAdvanceForm.controls['sanctionNumber'].value,
        sanctionAmount: this.loanAdvanceForm.controls['sanctionAmount'].value,
        recoveredAmount: this.loanAdvanceForm.controls['recoveredAmount'].value,
        principleAmount: this.loanAdvanceForm.controls['principleAmount'].value,
        interest: this.loanAdvanceForm.controls['interest'].value,
        netDueAmount: this.loanAdvanceForm.controls['netDueAmount'].value,
        sanctionDate: this.date.transform(
          this.loanAdvanceForm.controls['sanctionDate'].value,
          'dd-MMM-yyyy'
        ),
        netPrinciple: this.loanAdvanceForm.controls['netPrinciple'].value,
      };
      console.log('formdata', data);
      this.dialogRef.close({ data: JSON.stringify(data) });
    } else {
      this.isformInvalid = true;
    }
  }
  //#endregion Loand And Advance End
  qfromdate: any;
  qtodate: any;
  dateRangeChangequalifying(
    dateRangeStart1: HTMLInputElement,
    dateRangeEnd1: HTMLInputElement
  ) {
    this.diffDays1 = [];

    this.qualifyingStart1 = new Date(dateRangeStart1.value);
    this.qualifyingEnd1 = new Date(dateRangeEnd1.value);
    this.nonMinDate = new Date(
      this.qualifyingStart1.getFullYear(),
      this.qualifyingStart1.getMonth(),
      this.qualifyingStart1.getDate() - 1
    );
    this.nonMaxDate = new Date(
      this.qualifyingEnd1.getFullYear(),
      this.qualifyingEnd1.getMonth(),
      this.qualifyingEnd1.getDate() - 1
    );
    console.log('nonMinDate', this.nonMinDate);
    console.log('nonMaxDate', this.nonMaxDate);
    this.Qualifying_Service_other_Organisation_date =
      this.date.transform(this.qualifyingStart1, 'MM/dd/yyyy') +
      ' - ' +
      this.date.transform(this.qualifyingEnd1, 'MM/dd/yyyy');
    this.fromdate = this.date.transform(this.qualifyingStart1, 'MM/dd/yyyy');
    this.todate = this.date.transform(this.qualifyingEnd1, 'MM/dd/yyyy');
    this.qfromdate = this.date.transform(this.qualifyingStart1, 'dd-MM-yyyy');
    this.qtodate = this.date.transform(this.qualifyingEnd1, 'dd-MM-yyyy');

    let timeDiff = Math.abs(
      this.qualifyingStart1.getTime() - this.qualifyingEnd1.getTime()
    );

    this.diffDays1 = Math.ceil(timeDiff / (1000 * 3600 * 24));

    this.date_Data.push({
      sum: this.diffDays1,
    });
    var total = 0;
    for (var i = 0; i < this.date_Data.length; i++) {
      total += this.date_Data[i].sum;
    }

    this.totalDay1 = total;
    var years = Math.floor(this.totalDay1 / 365);
    var months = Math.floor((this.totalDay1 % 365) / 30);
    var days = Math.floor((this.totalDay1 % 365) % 30);
    this.years2 = years;
    this.months2 = months;
    this.days2 = days + 1;
    this.qualifyingServiceOtherOrganisationDate =
      this.years2 +
      ' years ' +
      this.months2 +
      ' months ' +
      this.days2 +
      ' days';

    this.qualifyingServiceArray.push({
      fromDate: this.fromdate,
      toDate: this.todate,
    });
    this.qualifyingServiceArray_p.push({
      fromDate: this.qfromdate,
      toDate: this.qtodate,
    });
  }

  visible: any;
  years: any;
  months: any;
  days: any;
  years1: any;
  months1: any;
  days1: any;
  visibleId: any = 0;
  visibleId1: boolean = false;
  visibleId2: boolean = false;
  visibleId3: boolean = false;

  dateGap: any;
  dateGapsus: any;
  dateGapeol: any;
  enddate: any;
  startdate: any;
  dateOne: any;
  dateTwo: any;
  diffDays: any;
  totalDay: number = 0;

  dateGap_p: any;
  dateGap_peol: any;
  dateGap_psus: any;
  enddate_p: any;
  startdate_p: any;

  dateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    this.is_Disabled = false;
    this.diffDays = [];
    this.date_Data = [];
    this.dateOne = new Date(dateRangeStart.value);
    this.dateTwo = new Date(dateRangeEnd.value);

    let timeDiff = Math.abs(this.dateOne.getTime() - this.dateTwo.getTime());

    this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.date_Data.push({
      sum: this.diffDays,
    });
    var total = 0;
    for (var i = 0; i < this.date_Data.length; i++) {
      total += this.date_Data[i].sum;
    }

    this.totalDay = total;
    var years = Math.floor(this.totalDay / 365);
    var yearRemainder = Math.floor(this.totalDay % 365);

    var months = Math.floor(yearRemainder / 30);
    var days = Math.floor((this.totalDay % 365) % 30);
    this.years = years;
    this.months = months;
    this.days = days + 1;

    this.serviceRecordForm.patchValue({
      totalNonQualifyService:
        years + ' years ' + months + ' months ' + days + ' days ',
    });

    setTimeout(() => {
      // <<<---using ()=> syntax
      this.serviceRecordForm.controls['nonQualifyingServicestart_Date'].reset();
      this.serviceRecordForm.controls['nonQualifyingServiceend_Date'].reset();
    }, 100);
    if (this.date_Data.length > 0) {
      this.addAnothergap();
    }
  }
  years3: any;
  months3: any;
  days3: any;
  eoldateRangeChange(dateRangeStart: any, dateRangeEnd: any) {
    this.is_Disabled = false;
    this.diffDays = [];
    this.date_Data = [];
    this.dateOne = new Date(dateRangeStart);
    this.dateTwo = new Date(dateRangeEnd);

    let timeDiff = Math.abs(this.dateOne.getTime() - this.dateTwo.getTime());

    this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.date_Data.push({
      sum: this.diffDays,
    });
    var total = 0;
    for (var i = 0; i < this.date_Data.length; i++) {
      total += this.date_Data[i].sum;
    }

    this.totalDay = total;
    var years = Math.floor(this.totalDay / 365);
    var yearRemainder = Math.floor(this.totalDay % 365);

    var months = Math.floor(yearRemainder / 30);
    var days = Math.floor((this.totalDay % 365) % 30);
    this.years3 = years;
    this.months3 = months;
    this.days3 = days + 1;

    this.serviceRecordForm.patchValue({
      totaleolNonQualifyService:
        this.years3 +
        ' years ' +
        this.months3 +
        ' months ' +
        this.days3 +
        ' days ',
    });

    setTimeout(() => {
      // <<<---using ()=> syntax
      this.serviceRecordForm.controls[
        'eolnonQualifyingServicestart_Date'
      ].reset();
      this.serviceRecordForm.controls[
        'eolnonQualifyingServiceend_Date'
      ].reset();
    }, 100);
    if (this.date_Data.length > 0) {
      this.addAnothergap2();
    }
  }

  commondategap: any[] = [];
  addAnothergap() {
    this.serviceRecordForm.controls['nonQualifyingServicestart_Date'].reset();
    this.serviceRecordForm.controls['nonQualifyingServiceend_Date'].reset();
    this.startdate = this.date.transform(this.dateOne, 'MM/dd/yyyy');
    this.enddate = this.date.transform(this.dateTwo, 'MM/dd/yyyy');
    this.dateGap =
      this.date.transform(this.dateOne, 'MM/dd/yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'MM/dd/yyyy');

    console.log('commondategap', this.commondategap);

    this.startdate_p = this.date.transform(this.dateOne, 'dd-MM-yyyy');
    this.enddate_p = this.date.transform(this.dateTwo, 'dd-MM-yyyy');
    this.dateGap_p =
      this.date.transform(this.dateOne, 'dd-MM-yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'dd-MM-yyyy');
    let added = false;

    //   if( (new Date (this.todate)) >= (new Date(this.startdate))) {
    //   this.serviceRecordForm.patchValue({
    //     totalNonQualifyService: ''
    //   });
    //   alert("Date already selected");

    // }
    // else{

    for (let t of this.commondategap)
      if (t.dateRange === this.dateGap) {
        added = true;
        alert('Date already selected');
        break;
      } else if (new Date(t.toDate) > new Date(this.startdate)) {
        added = true;
        alert('Date already selected');
        break;
      }
    if (!added)
      this.commondategap.push({
        dateRange: this.dateGap,
      });
    if (!added) {
      this.gapArray.push({
        dateRange: this.dateGap,
        fromDate: this.startdate,
        toDate: this.enddate,
      });
      this.gapArray_p.push({
        dateRange: this.dateGap_p,
        fromDate: this.startdate_p,
        toDate: this.enddate_p,
      });

      this.isShowNomineeDetails = true;
      // }
      console.log('gap array 1', this.gapArray);
    }
  }
  addAnothergap2() {
    this.serviceRecordForm.controls[
      'eolnonQualifyingServicestart_Date'
    ].reset();
    this.serviceRecordForm.controls['eolnonQualifyingServiceend_Date'].reset();
    this.startdate = this.date.transform(this.dateOne, 'MM/dd/yyyy');
    this.enddate = this.date.transform(this.dateTwo, 'MM/dd/yyyy');
    this.dateGapeol =
      this.date.transform(this.dateOne, 'MM/dd/yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'MM/dd/yyyy');

    this.commondategap.concat(this.dateGapeol);
    console.log('commondategap', this.commondategap);

    this.startdate_p = this.date.transform(this.dateOne, 'dd-MM-yyyy');
    this.enddate_p = this.date.transform(this.dateTwo, 'dd-MM-yyyy');
    this.dateGap_peol =
      this.date.transform(this.dateOne, 'dd-MM-yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'dd-MM-yyyy');

    let added = false;

    for (let t of this.commondategap)
      if (t.dateRange === this.dateGap) {
        added = true;
        alert('Date already selected');
        break;
      } else if (new Date(t.toDate) > new Date(this.startdate)) {
        added = true;
        alert('Date already selected');
        break;
      }
    if (!added)
      this.commondategap.push({
        dateRange: this.dateGap,
      });
    if (!added) {
      this.gapArray1.push({
        dateRange: this.dateGapeol,
        fromDate: this.startdate,
        toDate: this.enddate,
      });
      this.gapArray_p1.push({
        dateRange: this.dateGap_peol,
        fromDate: this.startdate_p,
        toDate: this.enddate_p,
      });
    }

    this.isShowNomineeDetails1 = true;
    // }
  }
  years4: any;
  months4: any;
  days4: any;
  susdateRangeChange(dateRangeStart: any, dateRangeEnd: any) {
    this.is_Disabled = false;
    this.diffDays = [];
    this.date_Data = [];
    this.dateOne = new Date(dateRangeStart);
    this.dateTwo = new Date(dateRangeEnd);

    let timeDiff = Math.abs(this.dateOne.getTime() - this.dateTwo.getTime());

    this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.date_Data.push({
      sum: this.diffDays,
    });
    var total = 0;
    for (var i = 0; i < this.date_Data.length; i++) {
      total += this.date_Data[i].sum;
    }

    this.totalDay = total;
    var years = Math.floor(this.totalDay / 365);
    var yearRemainder = Math.floor(this.totalDay % 365);

    var months = Math.floor(yearRemainder / 30);
    var days = Math.floor((this.totalDay % 365) % 30);
    this.years4 = years;
    this.months4 = months;
    this.days4 = days + 1;

    this.serviceRecordForm.patchValue({
      totalsusNonQualifyService:
        this.years4 +
        ' years ' +
        this.months4 +
        ' months ' +
        this.days4 +
        ' days ',
    });

    setTimeout(() => {
      // <<<---using ()=> syntax
      this.serviceRecordForm.controls[
        'Suspensionperiodnontreatedstart_Date'
      ].reset();
      this.serviceRecordForm.controls[
        'Suspensionperiodnontreatedend_Date'
      ].reset();
    }, 100);
    if (this.date_Data.length > 0) {
      this.addAnothergap3();
    }
  }
  isShowNomineeDetails2: boolean = false;
  gapArray2: gap[] = [];
  gapArray_p2: gap[] = [];
  addAnothergap3() {
    this.serviceRecordForm.controls[
      'Suspensionperiodnontreatedstart_Date'
    ].reset();
    this.serviceRecordForm.controls[
      'Suspensionperiodnontreatedend_Date'
    ].reset();
    this.startdate = this.date.transform(this.dateOne, 'MM/dd/yyyy');
    this.enddate = this.date.transform(this.dateTwo, 'MM/dd/yyyy');
    this.dateGapsus =
      this.date.transform(this.dateOne, 'MM/dd/yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'MM/dd/yyyy');

    this.startdate_p = this.date.transform(this.dateOne, 'dd-MM-yyyy');
    this.enddate_p = this.date.transform(this.dateTwo, 'dd-MM-yyyy');
    this.dateGap_psus =
      this.date.transform(this.dateOne, 'dd-MM-yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'dd-MM-yyyy');

    let added = false;

    this.gapArray2.push({
      dateRange: this.dateGapsus,
      fromDate: this.startdate,
      toDate: this.enddate,
    });
    this.gapArray_p2.push({
      dateRange: this.dateGap_psus,
      fromDate: this.startdate_p,
      toDate: this.enddate_p,
    });

    this.isShowNomineeDetails2 = true;
    // }
  }
  years5: any;
  months5: any;
  days5: any;
  reddateRangeChange(dateRangeStart: any, dateRangeEnd: any) {
    this.is_Disabled = false;
    this.diffDays = [];
    this.date_Data = [];
    this.dateOne = new Date(dateRangeStart);
    this.dateTwo = new Date(dateRangeEnd);

    let timeDiff = Math.abs(this.dateOne.getTime() - this.dateTwo.getTime());

    this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.date_Data.push({
      sum: this.diffDays,
    });
    var total = 0;
    for (var i = 0; i < this.date_Data.length; i++) {
      total += this.date_Data[i].sum;
    }

    this.totalDay = total;
    var years = Math.floor(this.totalDay / 365);
    var yearRemainder = Math.floor(this.totalDay % 365);

    var months = Math.floor(yearRemainder / 30);
    var days = Math.floor((this.totalDay % 365) % 30);
    this.years5 = years;
    this.months5 = months;
    this.days5 = days + 1;

    this.serviceRecordForm.patchValue({
      totalredNonQualifyService:
        this.years5 +
        ' years ' +
        this.months5 +
        ' months ' +
        this.days5 +
        ' days ',
    });

    setTimeout(() => {
      // <<<---using ()=> syntax
      this.serviceRecordForm.controls[
        'ServicesRenderedbelow18yearsagedstart_Date'
      ].reset();
      this.serviceRecordForm.controls[
        'ServicesRenderedbelow18yearsageend_Date'
      ].reset();
    }, 100);
    if (this.date_Data.length > 0) {
      this.addAnothergap4();
    }
  }
  isShowNomineeDetails3: boolean = false;
  gapArray3: gap[] = [];
  gapArray_p3: gap[] = [];
  dateGapred: any;
  dateGap_pred: any;
  addAnothergap4() {
    this.serviceRecordForm.controls[
      'ServicesRenderedbelow18yearsageend_Date'
    ].reset();
    this.serviceRecordForm.controls[
      'ServicesRenderedbelow18yearsageend_Date'
    ].reset();
    this.startdate = this.date.transform(this.dateOne, 'MM/dd/yyyy');
    this.enddate = this.date.transform(this.dateTwo, 'MM/dd/yyyy');
    this.dateGapred =
      this.date.transform(this.dateOne, 'MM/dd/yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'MM/dd/yyyy');

    this.startdate_p = this.date.transform(this.dateOne, 'dd-MM-yyyy');
    this.enddate_p = this.date.transform(this.dateTwo, 'dd-MM-yyyy');
    this.dateGap_pred =
      this.date.transform(this.dateOne, 'dd-MM-yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'dd-MM-yyyy');

    let added = false;

    this.gapArray3.push({
      dateRange: this.dateGapsus,
      fromDate: this.startdate,
      toDate: this.enddate,
    });
    this.gapArray_p3.push({
      dateRange: this.dateGap_psus,
      fromDate: this.startdate_p,
      toDate: this.enddate_p,
    });

    this.isShowNomineeDetails3 = true;
    // }
  }
  years6: any;
  months6: any;
  days6: any;
  intdateRangeChange(dateRangeStart: any, dateRangeEnd: any) {
    this.is_Disabled = false;
    this.diffDays = [];
    this.date_Data = [];
    this.dateOne = new Date(dateRangeStart);
    this.dateTwo = new Date(dateRangeEnd);

    let timeDiff = Math.abs(this.dateOne.getTime() - this.dateTwo.getTime());

    this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.date_Data.push({
      sum: this.diffDays,
    });
    var total = 0;
    for (var i = 0; i < this.date_Data.length; i++) {
      total += this.date_Data[i].sum;
    }

    this.totalDay = total;
    var years = Math.floor(this.totalDay / 365);
    var yearRemainder = Math.floor(this.totalDay % 365);

    var months = Math.floor(yearRemainder / 30);
    var days = Math.floor((this.totalDay % 365) % 30);
    this.years6 = years;
    this.months6 = months;
    this.days6 = days + 1;

    this.serviceRecordForm.patchValue({
      totalintNonQualifyService:
        this.years6 +
        ' years ' +
        this.months6 +
        ' months ' +
        this.days6 +
        ' days ',
    });

    setTimeout(() => {
      // <<<---using ()=> syntax
      this.serviceRecordForm.controls[
        'InterruptioninservicecondonedUnderrule17start_Date'
      ].reset();
      this.serviceRecordForm.controls[
        'ServicesRenderedbelInterruptioninservicecondonedUnderrule17start_Dateow18yearsageend_Date'
      ].reset();
    }, 100);
    if (this.date_Data.length > 0) {
      this.addAnothergap5();
    }
  }
  isShowNomineeDetails4: boolean = false;
  gapArray4: gap[] = [];
  gapArray_p4: gap[] = [];
  dateGapint: any;
  dateGap_pint: any;
  addAnothergap5() {
    this.serviceRecordForm.controls[
      'InterruptioninservicecondonedUnderrule17start_Date'
    ].reset();
    this.serviceRecordForm.controls[
      'InterruptioninservicecondonedUnderrule17end_Date'
    ].reset();
    this.startdate = this.date.transform(this.dateOne, 'MM/dd/yyyy');
    this.enddate = this.date.transform(this.dateTwo, 'MM/dd/yyyy');
    this.dateGapint =
      this.date.transform(this.dateOne, 'MM/dd/yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'MM/dd/yyyy');

    this.startdate_p = this.date.transform(this.dateOne, 'dd-MM-yyyy');
    this.enddate_p = this.date.transform(this.dateTwo, 'dd-MM-yyyy');
    this.dateGap_pint =
      this.date.transform(this.dateOne, 'dd-MM-yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'dd-MM-yyyy');

    let added = false;

    this.gapArray4.push({
      dateRange: this.dateGapsus,
      fromDate: this.startdate,
      toDate: this.enddate,
    });
    this.gapArray_p4.push({
      dateRange: this.dateGap_psus,
      fromDate: this.startdate_p,
      toDate: this.enddate_p,
    });

    this.isShowNomineeDetails4 = true;
    // }
  }
  years7: any;
  months7: any;
  days7: any;
  RVRESdateRangeChange(dateRangeStart: any, dateRangeEnd: any) {
    this.is_Disabled = false;
    this.diffDays = [];
    this.date_Data = [];
    this.dateOne = new Date(dateRangeStart);
    this.dateTwo = new Date(dateRangeEnd);

    let timeDiff = Math.abs(this.dateOne.getTime() - this.dateTwo.getTime());

    this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.date_Data.push({
      sum: this.diffDays,
    });
    var total = 0;
    for (var i = 0; i < this.date_Data.length; i++) {
      total += this.date_Data[i].sum;
    }

    this.totalDay = total;
    var years = Math.floor(this.totalDay / 365);
    var yearRemainder = Math.floor(this.totalDay % 365);

    var months = Math.floor(yearRemainder / 30);
    var days = Math.floor((this.totalDay % 365) % 30);
    this.years7 = years;
    this.months7 = months;
    this.days7 = days + 1;

    this.serviceRecordForm.patchValue({
      totalRVRESNonQualifyService:
        this.years7 +
        ' years ' +
        this.months7 +
        ' months ' +
        this.days7 +
        ' days ',
    });

    setTimeout(() => {
      // <<<---using ()=> syntax
      this.serviceRecordForm.controls[
        'ServicesRenderedbyRVRESemployeesbeforemerginginGovtstart_Date'
      ].reset();
      this.serviceRecordForm.controls[
        'ServicesRenderedbyRVRESemployeesbeforemerginginGovtend_Date'
      ].reset();
    }, 100);
    if (this.date_Data.length > 0) {
      this.addAnothergap10();
    }
  }
  isShowNomineeDetails5: boolean = false;
  gapArray5: gap[] = [];
  gapArray_p5: gap[] = [];

  addAnothergap6() {
    this.serviceRecordForm.controls[
      'ServicesRenderedbyRVRESemployeesbeforemerginginGovtstart_Date'
    ].reset();
    this.serviceRecordForm.controls[
      'ServicesRenderedbyRVRESemployeesbeforemerginginGovtend_Date'
    ].reset();
    this.startdate = this.date.transform(this.dateOne, 'MM/dd/yyyy');
    this.enddate = this.date.transform(this.dateTwo, 'MM/dd/yyyy');
    this.dateGapRVRES =
      this.date.transform(this.dateOne, 'MM/dd/yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'MM/dd/yyyy');

    this.startdate_p = this.date.transform(this.dateOne, 'dd-MM-yyyy');
    this.enddate_p = this.date.transform(this.dateTwo, 'dd-MM-yyyy');
    this.dateGap_pRVRES =
      this.date.transform(this.dateOne, 'dd-MM-yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'dd-MM-yyyy');

    let added = false;

    this.gapArray5.push({
      dateRange: this.dateGapsus,
      fromDate: this.startdate,
      toDate: this.enddate,
    });
    this.gapArray_p5.push({
      dateRange: this.dateGap_psus,
      fromDate: this.startdate_p,
      toDate: this.enddate_p,
    });

    this.isShowNomineeDetails5 = true;
    // }
  }
  isShowNomineeDetails10: boolean = false;
  gapArray10: gap[] = [];
  gapArray_p10: gap[] = [];
  dateGapRVRES: any;
  dateGap_pRVRES: any;
  addAnothergap10() {
    this.serviceRecordForm.controls[
      'ServicesRenderedbyRVRESemployeesbeforemerginginGovtstart_Date'
    ].reset();
    this.serviceRecordForm.controls[
      'ServicesRenderedbyRVRESemployeesbeforemerginginGovtend_Date'
    ].reset();
    this.startdate = this.date.transform(this.dateOne, 'MM/dd/yyyy');
    this.enddate = this.date.transform(this.dateTwo, 'MM/dd/yyyy');
    this.dateGapRVRES =
      this.date.transform(this.dateOne, 'MM/dd/yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'MM/dd/yyyy');

    this.startdate_p = this.date.transform(this.dateOne, 'dd-MM-yyyy');
    this.enddate_p = this.date.transform(this.dateTwo, 'dd-MM-yyyy');
    this.dateGap_pRVRES =
      this.date.transform(this.dateOne, 'dd-MM-yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'dd-MM-yyyy');

    let added = false;

    this.gapArray10.push({
      dateRange: this.dateGapsus,
      fromDate: this.startdate,
      toDate: this.enddate,
    });
    this.gapArray_p10.push({
      dateRange: this.dateGap_psus,
      fromDate: this.startdate_p,
      toDate: this.enddate_p,
    });

    this.isShowNomineeDetails10 = true;
    // }
  }
  years8: any;
  months8: any;
  days8: any;
  CivildateRangeChange(dateRangeStart: any, dateRangeEnd: any) {
    this.is_Disabled = false;
    this.diffDays = [];
    this.date_Data = [];
    this.dateOne = new Date(dateRangeStart);
    this.dateTwo = new Date(dateRangeEnd);

    let timeDiff = Math.abs(this.dateOne.getTime() - this.dateTwo.getTime());

    this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.date_Data.push({
      sum: this.diffDays,
    });
    var total = 0;
    for (var i = 0; i < this.date_Data.length; i++) {
      total += this.date_Data[i].sum;
    }

    this.totalDay = total;
    var years = Math.floor(this.totalDay / 365);
    var yearRemainder = Math.floor(this.totalDay % 365);

    var months = Math.floor(yearRemainder / 30);
    var days = Math.floor((this.totalDay % 365) % 30);
    this.years8 = years;
    this.months8 = months;
    this.days8 = days + 1;

    this.serviceRecordForm.patchValue({
      totalcivilService:
        this.years8 +
        ' years ' +
        this.months8 +
        ' months ' +
        this.days8 +
        ' days ',
    });

    setTimeout(() => {
      // <<<---using ()=> syntax
      this.serviceRecordForm.controls['civilservicestart_Date'].reset();
      this.serviceRecordForm.controls['civilserviceend_Date'].reset();
    }, 100);
    if (this.date_Data.length > 0) {
      this.addAnothergap7();
    }
  }
  isShowNomineeDetails6: boolean = false;
  gapArray6: gap[] = [];
  gapArray_p6: gap[] = [];
  dateGapcivil: any;
  dateGap_pcivil: any;
  addAnothergap7() {
    this.serviceRecordForm.controls['civilservicestart_Date'].reset();
    this.serviceRecordForm.controls['civilserviceend_Date'].reset();
    this.startdate = this.date.transform(this.dateOne, 'MM/dd/yyyy');
    this.enddate = this.date.transform(this.dateTwo, 'MM/dd/yyyy');
    this.dateGapcivil =
      this.date.transform(this.dateOne, 'MM/dd/yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'MM/dd/yyyy');

    this.startdate_p = this.date.transform(this.dateOne, 'dd-MM-yyyy');
    this.enddate_p = this.date.transform(this.dateTwo, 'dd-MM-yyyy');
    this.dateGap_pcivil =
      this.date.transform(this.dateOne, 'dd-MM-yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'dd-MM-yyyy');

    let added = false;

    this.gapArray6.push({
      dateRange: this.dateGapsus,
      fromDate: this.startdate,
      toDate: this.enddate,
    });
    this.gapArray_p6.push({
      dateRange: this.dateGap_psus,
      fromDate: this.startdate_p,
      toDate: this.enddate_p,
    });

    this.isShowNomineeDetails6 = true;
    // }
  }
  years9: any;
  months9: any;
  days9: any;
  MilitrydateRangeChange(dateRangeStart: any, dateRangeEnd: any) {
    this.is_Disabled = false;
    this.diffDays = [];
    this.date_Data = [];
    this.dateOne = new Date(dateRangeStart);
    this.dateTwo = new Date(dateRangeEnd);

    let timeDiff = Math.abs(this.dateOne.getTime() - this.dateTwo.getTime());

    this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.date_Data.push({
      sum: this.diffDays,
    });
    var total = 0;
    for (var i = 0; i < this.date_Data.length; i++) {
      total += this.date_Data[i].sum;
    }

    this.totalDay = total;
    var years = Math.floor(this.totalDay / 365);
    var yearRemainder = Math.floor(this.totalDay % 365);

    var months = Math.floor(yearRemainder / 30);
    var days = Math.floor((this.totalDay % 365) % 30);
    this.years9 = years;
    this.months9 = months;
    this.days9 = days + 1;

    this.serviceRecordForm.patchValue({
      totalMilitryService:
        this.years9 +
        ' years ' +
        this.months9 +
        ' months ' +
        this.days9 +
        ' days ',
    });

    setTimeout(() => {
      // <<<---using ()=> syntax
      this.serviceRecordForm.controls['militryservicestart_Date'].reset();
      this.serviceRecordForm.controls['militryserviceend_Date'].reset();
    }, 100);
    if (this.date_Data.length > 0) {
      this.addAnothergap8();
    }
  }
  otherdateRangeChange(dateRangeStart: any, dateRangeEnd: any) {
    this.is_Disabled = false;
    this.diffDays = [];

    this.dateOne = new Date(dateRangeStart);
    this.dateTwo = new Date(dateRangeEnd);

    let timeDiff = Math.abs(this.dateOne.getTime() - this.dateTwo.getTime());

    this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.date_Data.push({
      sum: this.diffDays,
    });
    var total = 0;
    for (var i = 0; i < this.date_Data.length; i++) {
      total += this.date_Data[i].sum;
    }

    this.totalDay = total;
    var years = Math.floor(this.totalDay / 365);
    var yearRemainder = Math.floor(this.totalDay % 365);

    var months = Math.floor(yearRemainder / 30);
    var days = Math.floor((this.totalDay % 365) % 30);
    this.years = years;
    this.months = months;
    this.days = days + 1;

    this.serviceRecordForm.patchValue({
      totalOtherService:
        years + ' years ' + months + ' months ' + days + ' days ',
    });
  }
  isShowNomineeDetails7: boolean = false;
  gapArray7: gap[] = [];
  gapArray_p7: gap[] = [];
  dateGapmilitry: any;
  dateGap_pmilitry: any;
  addAnothergap8() {
    this.serviceRecordForm.controls['civilservicestart_Date'].reset();
    this.serviceRecordForm.controls['civilserviceend_Date'].reset();
    this.startdate = this.date.transform(this.dateOne, 'MM/dd/yyyy');
    this.enddate = this.date.transform(this.dateTwo, 'MM/dd/yyyy');
    this.dateGapmilitry =
      this.date.transform(this.dateOne, 'MM/dd/yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'MM/dd/yyyy');

    this.startdate_p = this.date.transform(this.dateOne, 'dd-MM-yyyy');
    this.enddate_p = this.date.transform(this.dateTwo, 'dd-MM-yyyy');
    this.dateGap_pmilitry =
      this.date.transform(this.dateOne, 'dd-MM-yyyy') +
      ' - ' +
      this.date.transform(this.dateTwo, 'dd-MM-yyyy');

    let added = false;

    this.gapArray7.push({
      dateRange: this.dateGapsus,
      fromDate: this.startdate,
      toDate: this.enddate,
    });
    this.gapArray_p7.push({
      dateRange: this.dateGap_psus,
      fromDate: this.startdate_p,
      toDate: this.enddate_p,
    });

    this.isShowNomineeDetails7 = true;
    // }
  }
  date1: string = '';
  date2: string = '';
  dd: any;
  dddd: any;
  removeFile(index: any, obj: any) {
    this.gapArray.splice(index, 1);

    var splitted = obj.date.toString().split(' - ');
    this.date1 = splitted[0];
    this.date2 = splitted[1];

    for (let t of this.gapArray)
      if (t.dateRange !== obj.date) {
        this.dateOne = new Date(this.date1);
        this.dateTwo = new Date(this.date2);
        let timeDiff = Math.abs(
          this.dateOne.getTime() - this.dateTwo.getTime()
        );

        this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        this.date_Data.push({
          sum: -this.diffDays,
        });
        var total = 0;
        for (var i = 0; i < this.date_Data.length; i++) {
          total += this.date_Data[i].sum;
        }

        this.totalDay = total;
        var years = Math.floor(this.totalDay / 365);
        var months = Math.floor((this.totalDay % 365) / 30);
        var days = Math.floor((this.totalDay % 365) % 30);
        this.years = years;
        this.months = months;
        this.days = days;

        this.serviceRecordForm.patchValue({
          totalNonQualifyService:
            this.years +
            ' years ' +
            this.months +
            ' months ' +
            this.days +
            ' days ',
        });
      }

    if (this.gapArray.length == 0) {
      this.serviceRecordForm.patchValue({
        totalsusNonQualifyService: '',
      });
      this.isShowNomineeDetails = false;
      this.date_Data.splice(index);
    }
  }

  removeFile2(index: any, obj: any) {
    this.gapArray1.splice(index, 1);

    var splitted = obj.date.toString().split(' - ');
    this.date1 = splitted[0];
    this.date2 = splitted[1];

    for (let t of this.gapArray1)
      if (t.dateRange !== obj.date) {
        this.dateOne = new Date(this.date1);
        this.dateTwo = new Date(this.date2);
        let timeDiff = Math.abs(
          this.dateOne.getTime() - this.dateTwo.getTime()
        );

        this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        this.date_Data.push({
          sum: -this.diffDays,
        });
        var total = 0;
        for (var i = 0; i < this.date_Data.length; i++) {
          total += this.date_Data[i].sum;
        }

        this.totalDay = total;
        var years = Math.floor(this.totalDay / 365);
        var months = Math.floor((this.totalDay % 365) / 30);
        var days = Math.floor((this.totalDay % 365) % 30);
        this.years = years;
        this.months = months;
        this.days = days;

        this.serviceRecordForm.patchValue({
          totaleolNonQualifyService:
            this.years +
            ' years ' +
            this.months +
            ' months ' +
            this.days +
            ' days ',
        });
      }

    if (this.gapArray1.length == 0) {
      this.serviceRecordForm.patchValue({
        totaleolNonQualifyService: '',
      });
      this.isShowNomineeDetails1 = false;
      this.date_Data.splice(index);
    }
  }
  removeFile3(index: any, obj: any) {
    this.gapArray2.splice(index, 1);

    var splitted = obj.date.toString().split(' - ');
    this.date1 = splitted[0];
    this.date2 = splitted[1];

    for (let t of this.gapArray2)
      if (t.dateRange !== obj.date) {
        this.dateOne = new Date(this.date1);
        this.dateTwo = new Date(this.date2);
        let timeDiff = Math.abs(
          this.dateOne.getTime() - this.dateTwo.getTime()
        );

        this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        this.date_Data.push({
          sum: -this.diffDays,
        });
        var total = 0;
        for (var i = 0; i < this.date_Data.length; i++) {
          total += this.date_Data[i].sum;
        }

        this.totalDay = total;
        var years = Math.floor(this.totalDay / 365);
        var months = Math.floor((this.totalDay % 365) / 30);
        var days = Math.floor((this.totalDay % 365) % 30);
        this.years = years;
        this.months = months;
        this.days = days;

        this.serviceRecordForm.patchValue({
          totalsusNonQualifyService:
            this.years +
            ' years ' +
            this.months +
            ' months ' +
            this.days +
            ' days ',
        });
      }

    if (this.gapArray2.length == 0) {
      this.serviceRecordForm.patchValue({
        totalsusNonQualifyService: '',
      });
      this.isShowNomineeDetails2 = false;
      this.date_Data.splice(index);
    }
  }
  removeFile4(index: any, obj: any) {
    this.gapArray3.splice(index, 1);

    var splitted = obj.date.toString().split(' - ');
    this.date1 = splitted[0];
    this.date2 = splitted[1];

    for (let t of this.gapArray3)
      if (t.dateRange !== obj.date) {
        this.dateOne = new Date(this.date1);
        this.dateTwo = new Date(this.date2);
        let timeDiff = Math.abs(
          this.dateOne.getTime() - this.dateTwo.getTime()
        );

        this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        this.date_Data.push({
          sum: -this.diffDays,
        });
        var total = 0;
        for (var i = 0; i < this.date_Data.length; i++) {
          total += this.date_Data[i].sum;
        }

        this.totalDay = total;
        var years = Math.floor(this.totalDay / 365);
        var months = Math.floor((this.totalDay % 365) / 30);
        var days = Math.floor((this.totalDay % 365) % 30);
        this.years = years;
        this.months = months;
        this.days = days;

        this.serviceRecordForm.patchValue({
          totalredNonQualifyService:
            this.years +
            ' years ' +
            this.months +
            ' months ' +
            this.days +
            ' days ',
        });
      }

    if (this.gapArray3.length == 0) {
      this.serviceRecordForm.patchValue({
        totalredNonQualifyService: '',
      });
      this.isShowNomineeDetails3 = false;
      this.date_Data.splice(index);
    }
  }
  removeFile5(index: any, obj: any) {
    this.gapArray4.splice(index, 1);

    var splitted = obj.date.toString().split(' - ');
    this.date1 = splitted[0];
    this.date2 = splitted[1];

    for (let t of this.gapArray4)
      if (t.dateRange !== obj.date) {
        this.dateOne = new Date(this.date1);
        this.dateTwo = new Date(this.date2);
        let timeDiff = Math.abs(
          this.dateOne.getTime() - this.dateTwo.getTime()
        );

        this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        this.date_Data.push({
          sum: -this.diffDays,
        });
        var total = 0;
        for (var i = 0; i < this.date_Data.length; i++) {
          total += this.date_Data[i].sum;
        }

        this.totalDay = total;
        var years = Math.floor(this.totalDay / 365);
        var months = Math.floor((this.totalDay % 365) / 30);
        var days = Math.floor((this.totalDay % 365) % 30);
        this.years = years;
        this.months = months;
        this.days = days;

        this.serviceRecordForm.patchValue({
          totalintNonQualifyService:
            this.years +
            ' years ' +
            this.months +
            ' months ' +
            this.days +
            ' days ',
        });
      }

    if (this.gapArray4.length == 0) {
      this.serviceRecordForm.patchValue({
        totalintNonQualifyService: '',
      });
      this.isShowNomineeDetails4 = false;
      this.date_Data.splice(index);
    }
  }
  removeFile6(index: any, obj: any) {
    this.gapArray10.splice(index, 1);

    var splitted = obj.date.toString().split(' - ');
    this.date1 = splitted[0];
    this.date2 = splitted[1];

    for (let t of this.gapArray10)
      if (t.dateRange !== obj.date) {
        this.dateOne = new Date(this.date1);
        this.dateTwo = new Date(this.date2);
        let timeDiff = Math.abs(
          this.dateOne.getTime() - this.dateTwo.getTime()
        );

        this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        this.date_Data.push({
          sum: -this.diffDays,
        });
        var total = 0;
        for (var i = 0; i < this.date_Data.length; i++) {
          total += this.date_Data[i].sum;
        }

        this.totalDay = total;
        var years = Math.floor(this.totalDay / 365);
        var months = Math.floor((this.totalDay % 365) / 30);
        var days = Math.floor((this.totalDay % 365) % 30);
        this.years = years;
        this.months = months;
        this.days = days;

        this.serviceRecordForm.patchValue({
          totalRVRESNonQualifyService:
            this.years +
            ' years ' +
            this.months +
            ' months ' +
            this.days +
            ' days ',
        });
      }

    if (this.gapArray10.length == 0) {
      this.serviceRecordForm.patchValue({
        totalRVRESNonQualifyService: '',
      });
      this.isShowNomineeDetails10 = false;
      this.date_Data.splice(index);
    }
  }
  removeFile7(index: any, obj: any) {
    this.gapArray6.splice(index, 1);

    var splitted = obj.date.toString().split(' - ');
    this.date1 = splitted[0];
    this.date2 = splitted[1];

    for (let t of this.gapArray6)
      if (t.dateRange !== obj.date) {
        this.dateOne = new Date(this.date1);
        this.dateTwo = new Date(this.date2);
        let timeDiff = Math.abs(
          this.dateOne.getTime() - this.dateTwo.getTime()
        );

        this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        this.date_Data.push({
          sum: -this.diffDays,
        });
        var total = 0;
        for (var i = 0; i < this.date_Data.length; i++) {
          total += this.date_Data[i].sum;
        }

        this.totalDay = total;
        var years = Math.floor(this.totalDay / 365);
        var months = Math.floor((this.totalDay % 365) / 30);
        var days = Math.floor((this.totalDay % 365) % 30);
        this.years = years;
        this.months = months;
        this.days = days;

        this.serviceRecordForm.patchValue({
          totalcivilService:
            this.years +
            ' years ' +
            this.months +
            ' months ' +
            this.days +
            ' days ',
        });
      }

    if (this.gapArray6.length == 0) {
      this.serviceRecordForm.patchValue({
        totalcivilService: '',
      });
      this.isShowNomineeDetails6 = false;
      this.date_Data.splice(index);
    }
  }
  removeFile8(index: any, obj: any) {
    this.gapArray7.splice(index, 1);

    var splitted = obj.date.toString().split(' - ');
    this.date1 = splitted[0];
    this.date2 = splitted[1];

    for (let t of this.gapArray7)
      if (t.dateRange !== obj.date) {
        this.dateOne = new Date(this.date1);
        this.dateTwo = new Date(this.date2);
        let timeDiff = Math.abs(
          this.dateOne.getTime() - this.dateTwo.getTime()
        );

        this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        this.date_Data.push({
          sum: -this.diffDays,
        });
        var total = 0;
        for (var i = 0; i < this.date_Data.length; i++) {
          total += this.date_Data[i].sum;
        }

        this.totalDay = total;
        var years = Math.floor(this.totalDay / 365);
        var months = Math.floor((this.totalDay % 365) / 30);
        var days = Math.floor((this.totalDay % 365) % 30);
        this.years = years;
        this.months = months;
        this.days = days;

        this.serviceRecordForm.patchValue({
          totalMilitryService:
            this.years +
            ' years ' +
            this.months +
            ' months ' +
            this.days +
            ' days ',
        });
      }

    if (this.gapArray6.length == 0) {
      this.serviceRecordForm.patchValue({
        totalMilitryService: '',
      });
      this.isShowNomineeDetails7 = false;
      this.date_Data.splice(index);
    }
  }
  deDateStart: any;
  deDateEnd: any;
  deFromDate: any;
  deToDate: any;

  deDateRangeChange(
    dateRangeS: HTMLInputElement,
    dateRangeE: HTMLInputElement
  ) {
    this.deDateStart = new Date(dateRangeS.value);
    this.deDateEnd = new Date(dateRangeE.value);
    this.deFromDate = this.date.transform(this.deDateStart, 'MM/dd/yyyy');
    this.deToDate = this.date.transform(this.deDateEnd, 'MM/dd/yyyy');

    if (new Date(this.todate) > new Date(this.deFromDate)) {
      this.serviceRecordForm.patchValue({
        DEstart_Date: '',
        DEend_Date: '',
      });
      alert('Date already selected');
    }
  }
  deDateRangeChange2(
    dateRangeS: HTMLInputElement,
    dateRangeE: HTMLInputElement
  ) {
    this.deDateStart = new Date(dateRangeS.value);
    this.deDateEnd = new Date(dateRangeE.value);
    this.deFromDate = this.date.transform(this.deDateStart, 'MM/dd/yyyy');
    this.deToDate = this.date.transform(this.deDateEnd, 'MM/dd/yyyy');

    // if( (new Date (this.todate)) > (new Date(this.deFromDate))) {
    //   this.serviceRecordForm.patchValue({
    //     DEstart_Date: '',
    //     DEend_Date: ''
    //   });
    //   alert("Date already selected");

    // }
  }

  getDeTypeName = (id: string) => {
    return this.detypelist.filter((x: any) => x.deTypeId == id)[0].deTypeName;
  };

  years2: any;
  months2: any;
  days2: any;
  qualifyingStart1: any;
  qualifyingEnd1: any;
  qualifyingServiceOtherOrganisationDate: any;
  diffDays1: any;
  Qualifying_Service_other_Organisation_date: any;
  fromdate: any;
  todate: any;
  totalDay1: number = 0;

  onActivate() {
    this.totalDay =
      this.totalDay1 + this.serviceRecordData.totalNoOfDays - this.totalDay;
    var years = Math.floor(this.totalDay / 365);
    var months = Math.floor((this.totalDay % 365) / 30);
    var days = Math.floor((this.totalDay % 365) % 30);
    this.years = years;
    this.months = months;
    this.days = days;
    this.serviceRecordForm.patchValue({
      Total_Qualifying_Service:
        this.years +
        ' years ' +
        this.months +
        ' months ' +
        this.days +
        ' days ',
    });
    let data = {
      totalNoOfDays: this.serviceRecordData.totalNoOfDays,
      doc_name: this.document_list[0] ? this.document_list[0].docName : '',
      doc_id: this.document_list[0] ? this.document_list[0].documentId : '',
      totalServiceLength: this.serviceRecordForm.value.total_Service_Length,
      penalty: this.serviceRecordForm.value.Penalty,
      penaltyType: this.serviceRecordForm.value.Penalty_Type,
      remark: this.serviceRecordForm.value.Remark,
      deType: this.serviceRecordForm.value.DE_Type
        ? this.serviceRecordForm.value.DE_Type
        : '',
      deTypeName: this.serviceRecordForm.value.DE_Type
        ? this.getDeTypeName(this.serviceRecordForm.value.DE_Type)
        : '',
      deEndDate: this.serviceRecordForm.value.DEend_Date
        ? this.date.transform(
            this.serviceRecordForm.value.DEend_Date,
            'MM/dd/yyyy'
          )
        : '',
      deStartDate: this.serviceRecordForm.value.DEstart_Date
        ? this.date.transform(
            this.serviceRecordForm.value.DEstart_Date,
            'MM/dd/yyyy'
          )
        : '',
      deStatus: this.serviceRecordForm.value.DE_Status
        ? this.serviceRecordForm.value.DE_Status
        : '',
      serviceRecordDetails: [
        {
          serviceDates: this.gapArray7 ? this.gapArray7 : '',
          serviceLengh: this.serviceRecordForm.value.totalMilitryService
            ? this.serviceRecordForm.value.totalMilitryService
            : '',
          OrganizationName: '',
          type: 'Military Service',
          isPension: 'N',
          isGratuity: 'N',
          psnAmnt: 0,
          typeId: 0,
          qualifying: 'N',
        },
        {
          serviceDates: this.qualifyingServiceArray
            ? this.qualifyingServiceArray
            : '',
          serviceLengh: this.qualifyingServiceOtherOrganisationDate
            ? this.qualifyingServiceOtherOrganisationDate
            : '',
          OrganizationName: '',
          type: 'Qualifying Service(From Previous Organisation)',
          isPension: 'N',
          isGratuity: 'N',
          psnAmnt: 0,
          typeId: 0,
          qualifying: 'N',
        },
        {
          serviceDates: this.gapArray ? this.gapArray : '',
          serviceLengh: this.serviceRecordForm.value.totalNonQualifyService
            ? this.serviceRecordForm.value.totalNonQualifyService
            : '',
          OrganizationName: '',
          type: 'Non-Qualifying Service',
          isPension: 'N',
          isGratuity: 'N',
          psnAmnt: 0,
          typeId: 0,
          qualifying: 'N',
        },
        {
          serviceDates: this.gapArray1 ? this.gapArray1 : '',
          serviceLengh: this.serviceRecordForm.value.totaleolNonQualifyService
            ? this.serviceRecordForm.value.totaleolNonQualifyService
            : '',
          OrganizationName: '',
          type: 'EOL Non-Qualifying Service',
          isPension: 'N',
          isGratuity: 'N',
          psnAmnt: 0,
          typeId: 0,
          qualifying: 'N',
        },
        {
          serviceDates: this.gapArray2 ? this.gapArray2 : '',
          serviceLengh: this.serviceRecordForm.value.totalsusNonQualifyService
            ? this.serviceRecordForm.value.totalsusNonQualifyService
            : '',
          OrganizationName: '',
          type: 'Suspension period non treated as Qualifying',
          isPension: 'N',
          isGratuity: 'N',
          psnAmnt: 0,
          typeId: 0,
          qualifying: 'N',
        },
        {
          serviceDates: this.gapArray3 ? this.gapArray3 : '',
          serviceLengh: this.serviceRecordForm.value.totalredNonQualifyService
            ? this.serviceRecordForm.value.totalredNonQualifyService
            : '',
          OrganizationName: '',
          type: 'Services Rendered below 18 years age',
          isPension: 'N',
          isGratuity: 'N',
          psnAmnt: 0,
          typeId: 0,
          qualifying: 'N',
        },
        {
          serviceDates: this.gapArray4 ? this.gapArray4 : '',
          serviceLengh: this.serviceRecordForm.value.totalintNonQualifyService
            ? this.serviceRecordForm.value.totalintNonQualifyService
            : '',
          OrganizationName: '',
          type: 'Interruption in service condoned Under rule -17',
          isPension: 'N',
          isGratuity: 'N',
          psnAmnt: 0,
          typeId: 0,
          qualifying: 'N',
        },
        {
          serviceDates: this.gapArray10 ? this.gapArray10 : '',
          serviceLengh: this.serviceRecordForm.value.totalRVRESNonQualifyService
            ? this.serviceRecordForm.value.totalRVRESNonQualifyService
            : '',
          OrganizationName: '',
          type: 'Services Rendered by RVRES employees before merging in Govt',
          isPension: 'N',
          isGratuity: 'N',
          psnAmnt: 0,
          typeId: 0,
          qualifying: 'N',
        },
        {
          serviceDates: this.gapArray6 ? this.gapArray6 : '',
          serviceLengh: this.serviceRecordForm.value.totalcivilService
            ? this.serviceRecordForm.value.totalcivilService
            : '',
          OrganizationName: '',
          type: 'Civil Service',
          isPension: 'N',
          isGratuity: 'N',
          psnAmnt: 0,
          typeId: 0,
          qualifying: 'N',
        },
        {
          serviceDates: this.serviceRecordForm.value.Otherstart_Date
            ? this.serviceRecordForm.value.Otherstart_Date
            : '' + '-' + this.serviceRecordForm.value.Otherend_Date
            ? this.serviceRecordForm.value.Otherend_Date
            : '',
          serviceLengh: this.serviceRecordForm.value.totalOtherService
            ? this.serviceRecordForm.value.totalOtherService
            : '',
          OrganizationName: '',
          type: 'Other(Any other service not treated as qualifying)',
          isPension: 'N',
          isGratuity: 'N',
          psnAmnt: 0,
          typeId: 0,
          qualifying: 'N',
        },
      ],
    };
    //  let data = {
    //   "serrecord":[
    //     {
    //       ,
    //       "qualifyingService": this.qualifyingServiceArray,
    //       "totalQualifyingService":this.serviceRecordForm.value.Total_Qualifying_Service,
    //     },
    //     {

    //       "nonQualifyingService": this.serviceRecordForm.value.totalNonQualifyService,
    //       "nonQualifyingServiceDate":this.gapArray,
    //     },
    //     {

    //       "eolQualifyingServiceDate":this.gapArray1?this.gapArray1:"",
    //       "Nonqualifying_EOL":this.serviceRecordForm.value.totaleolNonQualifyService?this.serviceRecordForm.value.totaleolNonQualifyService:"",
    //     },
    //     {

    //       "susQualifyingServiceDate":this.gapArray2?this.gapArray2:"",
    //       "Nonqualifying_suspensionperiod": this.serviceRecordForm.value.totalsusNonQualifyService?this.serviceRecordForm.value.totalsusNonQualifyService:"",
    //     },
    //     {

    //       "Nonqualifying_serviceBelow18": this.serviceRecordForm.value.totalredNonQualifyService?this.serviceRecordForm.value.totalredNonQualifyService:"",
    //       "redQualifyingServiceDate":this.gapArray3?this.gapArray3:"",
    //     },
    //     {

    //       "ServiceInterruption_rule27": this.serviceRecordForm.value.totalintNonQualifyService?this.serviceRecordForm.value.totalintNonQualifyService:"",
    //     "intQualifyingServiceDate":this.gapArray4?this.gapArray4:"",
    //     },
    //     {

    //       "RVRES_employees_service": this.serviceRecordForm.value.totalRVRESNonQualifyService?this.serviceRecordForm.value.totalRVRESNonQualifyService:"",
    //       "RVRESQualifyingServiceDate":this.gapArray5?this.gapArray5:"",
    //     },
    //     {

    //       "Civil_service": this.serviceRecordForm.value.totalcivilService?this.serviceRecordForm.value.totalcivilService:"",
    //       "CivilServiceDate":this.gapArray6?this.gapArray6:"",
    //     },
    //     {
    //       "type":"Military Service",
    //       "Civil_service": ,
    //       "CivilServiceDate":,
    //     },
    //     {

    //       "start_date":this.serviceRecordForm.value.Otherstart_Date?this.serviceRecordForm.value.Otherstart_Date:"",
    //       "end_date":this.serviceRecordForm.value.Otherend_Date?this.serviceRecordForm.value.Otherend_Date:"",
    //       "other_service":this.serviceRecordForm.value.totalOtherService?this.serviceRecordForm.value.totalOtherService:"",
    //     }

    //   ],
    //     "totalServiceLength": this.serviceRecordForm.value.total_Service_Length,

    //     "qualifyingServiceOtherOrganisationDate" :this.qualifyingServiceOtherOrganisationDate,
    //     "deStatus":,
    //     "deType":,
    //     "deStartDate":,
    //     "deEndDate":,
    //     "penalty": ,
    //     "penaltyType": ,
    //     "remark": ,
    //     "id": this.serviceRecordForm.value.id,
    //     "totalNoOfDays":this.serviceRecordData.totalNoOfDays,
    //     "qualifyingService_p": this.qualifyingServiceArray_p,
    //     "nonQualifyingServiceDate_p":this.gapArray_p,
    //      "eolnonQualifyingServicestart_Date":this.serviceRecordForm.value.eolnonQualifyingServiceend_Date?this.date.transform(this.serviceRecordForm.value.eolnonQualifyingServiceend_Date, 'MM/dd/yyyy'):"",
    //     "eolnonQualifyingServiceend_Date":this.serviceRecordForm.value.Suspensionperiodnontreatedstart_Date?this.date.transform(this.serviceRecordForm.value.Suspensionperiodnontreatedstart_Date, 'MM/dd/yyyy'):"",
    //     "Suspensionperiodnontreatedstart_Date":this.serviceRecordForm.value.Suspensionperiodnontreatedend_Date?this.date.transform(this.serviceRecordForm.value.Suspensionperiodnontreatedend_Date, 'MM/dd/yyyy'):"",
    //     "Suspensionperiodnontreatedend_Date":this.serviceRecordForm.value.Suspensionperiodnontreatedend_Date?this.date.transform(this.serviceRecordForm.value.Suspensionperiodnontreatedend_Date, 'MM/dd/yyyy'):"",
    //     "ServicesRenderedbelow18yearsagestart_Date":this.serviceRecordForm.value.ServicesRenderedbelow18yearsagestart_Date?this.date.transform(this.serviceRecordForm.value.ServicesRenderedbelow18yearsagestart_Date, 'MM/dd/yyyy'):"",
    //     "ServicesRenderedbelow18yearsageend_Date":this.serviceRecordForm.value.ServicesRenderedbelow18yearsageend_Date?this.date.transform(this.serviceRecordForm.value.ServicesRenderedbelow18yearsageend_Date, 'MM/dd/yyyy'):"",
    //     "InterruptioninservicecondonedUnderrule17start_Date":this.serviceRecordForm.value.InterruptioninservicecondonedUnderrule17start_Date?this.date.transform(this.serviceRecordForm.value.InterruptioninservicecondonedUnderrule17start_Date, 'MM/dd/yyyy'):"",
    //     "InterruptioninservicecondonedUnderrule17end_Date":this.serviceRecordForm.value.InterruptioninservicecondonedUnderrule17end_Date?this.date.transform(this.serviceRecordForm.value.eolnonQualifyingServiceend_Date, 'MM/dd/yyyy'):"",
    //    " ServicesRenderedbyRVRESemployeesbeforemerginginGovtstart_Date":this.serviceRecordForm.value.ServicesRenderedbyRVRESemployeesbeforemerginginGovtstart_Date?this.date.transform(this.serviceRecordForm.value.ServicesRenderedbyRVRESemployeesbeforemerginginGovtstart_Date, 'MM/dd/yyyy'):"",
    //    " ServicesRenderedbyRVRESemployeesbeforemerginginGovtend_Date":this.serviceRecordForm.value.ServicesRenderedbyRVRESemployeesbeforemerginginGovtend_Date?this.date.transform(this.serviceRecordForm.value.ServicesRenderedbyRVRESemployeesbeforemerginginGovtend_Date, 'MM/dd/yyyy'):"",
    //     "Otherstart_Date":this.serviceRecordForm.value.Otherstart_Date?this.serviceRecordForm.value.Otherstart_Date:"",
    //     "Otherend_Date":this.serviceRecordForm.value.Otherend_Date?this.serviceRecordForm.value.Otherend_Date:"",

    //   }
    this.date.transform(
      this.serviceRecordForm.value.eolnonQualifyingServiceend_Date,
      'MM/dd/yyyy'
    );
    // this._Service.docList=this.document_list;
    console.log('service Record', data);
    // this.dialogRef.close({ data: JSON.stringify(data) });
    this._Service.userActivated.next(data);
  }

  principleAmtCheck() {
    // alert( this.loanAdvanceForm.controls['sanctionAmount'].value)
    //loanAdvanceForm.controls['sanctionAmount'].value) < (loanAdvanceForm.controls['principleAmount'].value))
    if (
      this.loanAdvanceForm.controls['sanctionAmount'].value >=
      this.loanAdvanceForm.controls['principleAmount'].value
    ) {
    } else {
      this.loanAdvanceForm.controls['principleAmount'].setValue('');
    }
  }

  dateChange(
    dateRangeStart3: HTMLInputElement,
    dateRangeEnd4: HTMLInputElement
  ) {
    let fromDate: any = '';
    let toDate: any = '';

    fromDate = new Date(dateRangeStart3.value);
    toDate = new Date(dateRangeEnd4.value);
    fromDate = this.date.transform(this.qualifyingStart1, 'MM/dd/yyyy');
    toDate = this.date.transform(this.qualifyingEnd1, 'MM/dd/yyyy');

    this.qualifyingServiceArray.push({
      fromDate: fromDate,
      toDate: toDate,
    });
  }

  markLeaveSubmit() {
    if (this.markLeaveForm.valid) {
      this._Service.post('submit', this.markLeaveForm.value).subscribe({
        next: (res) => {
          if (res.data) {
            this.snackbar.show('Leave applied successfully', 'success');
          }
        },
        error: (err) => {
          this.snackbar.show(err?.error.description, 'danger');
        },
      });
    }
  }
  StopAutoApprove() {

    // this.isLoading2 = true;
    console.log(this.stopApprovalForm);
    this.reasonError = '';
    // this.documentError = '';
    if (this.stopApprovalForm.valid) {
      // Form is valid, you can access the form values
      const formData = this.stopApprovalForm.value;
      console.log(formData);
      console.log('inside employee INfo ===', this.empinfo);
      console.log(this.empDetails);
      console.log('Here is Remark ', this.remarkde);
      let ApprovalJson = { };

      if(this.id == 40){
         ApprovalJson = {
          employeeId: this.empDetails.employeeId,
          createdByUId: this.empinfo.userId,
          remarks: this.stopApprovalForm.value.remarkde,
          docId: this.docIdValue || 0,
          flag:0
        };
      }
      // else if(this.id == 29){
      //       ApprovalJson = {
      //         employeeId: this.empDetails.employeeId,
      //         createdByUId: this.empinfo.userId,
      //         remarks: this.stopApprovalForm.value.remarkde,
      //         docId: this.docIdValue || 0,
      //         flag:1
      //       };
      // }


      this.load.show();
      this._Service
        .postCumm( '/submitPsnStopMarkAuto',ApprovalJson)
        .subscribe({
          next: (res) => {
            if (res) {
              if(this.id == 40){
                this.snackbar.show(
                  'Stopped Auto Approval Successfully',
                  'success'
                );
              }
              // else if(this.id == 29){
              //   this.snackbar.show(
              //     'Released Auto Approval Successfully',
              //     'success'
              //   );
              // }
              this.dialogRef.close();
            }
            this.load.hide();
          },
          error: (err) => {
            this.snackbar.show(err?.error.description, 'danger');
          },
        });

      console.log(ApprovalJson);
      // You can now submit the form data, e.g., send it to a server
    }
    else{
      if (this.stopApprovalForm?.get('remarkde')?.hasError('required')) {
        this.reasonError = 'Reason is required.';
      }
      // if (!this.stopApprovalForm?.get('stopDoc')?.value) {
      //   this.documentError = 'Please upload a document.';
      // }
    }
  }

  ReleaseAutoApprove(){

    console.log("inside Release" ,this.stopApprovalForm);
    this.reasonError = '';
    // this.documentError = '';
    if (this.stopApprovalForm.valid) {
      // Form is valid, you can access the form values
      const formData = this.stopApprovalForm.value;
      console.log(formData);
      console.log('inside employee INfo ===', this.empinfo);
      console.log(this.empDetails);
      console.log('Here is Remark ', this.remarkde);
      let ReleaseJson = { };

      if(this.id == 41){
        ReleaseJson = {
          employeeId: this.empDetails.employeeId,
          createdByUId: this.empinfo.userId,
          remarks: this.stopApprovalForm.value.remarkde,
          docId: this.docIdValue || 0,
          flag:1
        };
      }
      // else if(this.id == 29){
      //       ApprovalJson = {
      //         employeeId: this.empDetails.employeeId,
      //         createdByUId: this.empinfo.userId,
      //         remarks: this.stopApprovalForm.value.remarkde,
      //         docId: this.docIdValue || 0,
      //         flag:1
      //       };
      // }



      this._Service
        .postCumm( '/submitPsnStopMarkAuto',ReleaseJson)
        .subscribe({
          next: (res) => {
            if (res) {
              if(this.id == 41){
                this.snackbar.show(
                  'Released Auto Approval Successfully',
                  'success'
                );
              }
              // else if(this.id == 29){
              //   this.snackbar.show(
              //     'Released Auto Approval Successfully',
              //     'success'
              //   );
              // }
              this.dialogRef.close();
            }
          },
          error: (err) => {
            this.snackbar.show(err?.error.description, 'danger');
          },
        });

      console.log("in Release button bbbbbbb =>",ReleaseJson);
      // You can now submit the form data, e.g., send it to a server
    }
    else{
      if (this.stopApprovalForm?.get('remarkde')?.hasError('required')) {
        this.reasonError = 'Reason is required.';
      }
      // if (!this.stopApprovalForm?.get('stopDoc')?.value) {
      //   this.documentError = 'Please upload a document.';
      // }
    }

  }

  selectFile(event: any) {
    let time1 = new Date();

    // this.isView = true;
    this.file = event.target.files[0];
    let ex2: any[] = this.file.name.split('.');
    console.log('size', this.file.size / 1024);
    if (ex2[1].includes('PDF') || ex2[1].includes('pdf')) {
    } else {
      alert('Only PDF file format allowed');
      return;
    }

    if (this.file.size / 1024 > 2048) {
      alert('Max 2 MB file size allowed');
      return;
    }

    this.fileName =
      'doc' +
      time1.getDate() +
      (time1.getMonth() + 1) +
      time1.getFullYear() +
      time1.getHours() +
      time1.getMinutes() +
      time1.getMilliseconds().toString() +
      '.' +
      ex2[1];
    this.fileName = this.fileName.replace(' ', '');
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('filename', this.fileName);
    this.isLoading2 = true;
    const docTypeId = '20';

    this._Service.postOr('wcc/uploadfile', formData).subscribe(
      (res: any) => {
        this.documentlist = res.data.document;

        console.log('docId ---->  ' + res.data.document[0].docId);

        this.docIdValue = res.data.document[0].docId;
        console.log(this.docIdValue);
        this.docId = res.data.document[0].docId;
        console.log(this.documentlist);
        console.log(res.data.document);
        this.isLoading2 = false;
        let data = {
          docTypeId: docTypeId,
          dmsDocId: res.data.document[0].docId,
          docName: 'User Manual Document',
        };

        if (res.data.document[0].docId) {
          let rajIndex = -1;
          console.log('document list' + this.documentlist);
          this.documentlist.filter((data: any, index: number) => {
            console.log('data ' + data);
            if (data.docName == 'User Manual Document') {
              // console.log(data.docName);
              rajIndex = index;
              console.log('rajIndex : ' + rajIndex);
              return data;
            }
          });
          if (rajIndex == -1) {
            console.log();
            this.documentlist.push(data);
          } else {
            this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
          }
          console.log('document_list', this.documentlist);

          this.snackbar.show('Document Uploaded Successfully.', 'success');
          // this.IsAcc = true;
        } else {
          alert('Some error occured.');
        }
      },
      (error) => {
        this.isLoading2 = false;
        alert('Some Error Occured');
      }
    );

    // this.file = event.target.files[0];
    // let ex2:any[]=this.file.name.split(".");
    // console.log("size",this.file.size/1024)
    // if(ex2[1].includes('PDF') || ex2[1].includes('pdf')  )
    // {

    // } else
    // {
    //   alert("Only PDF file format allowed")
    //   return;
    // }

    // if((this.file.size/1024)>2048)
    // {
    //   alert("Max 2 MB file size allowed")
    //   return;
    // }
  }
}
