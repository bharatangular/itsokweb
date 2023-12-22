import {Component,Input,OnInit} from '@angular/core';
import {STEPPER_GLOBAL_OPTIONS,} from '@angular/cdk/stepper';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DocumentId,DocumentIdList } from 'src/assets/utils/interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { AppConfig } from 'src/app/app.config';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})


export class ProfileComponent implements OnInit {

  // input decorators
  @Input() empId:any;


  // variables
  jointImageUrl: any = 'assets/images/jointImg.jfif';
  imageUrl: any = 'assets/images/userImg.png';
  personalDetail: any;
  serviceDetails: any;
  residenceAddress: any;
  dateOfBirth: any;
  error: any;
  residenceArray: any[] = [];
  officeArray: any[] = [];
  departmentAddress: any[] = [];
  empInfo: any;
  btnLabel: string = 'Proceed';
  documentList: any;
  document: any;
  dateValue: any;
  iconCA: any;
  iconPA: any;
  iconOA: any;
  empAddress: any;
  empDoc: any;
  file1: any;
  martialStatus: any;
  retirementFile: any;
  document_List: any[] = [];
  file2: any;
  disabledFile: any;
  file3: any;
  documentlist: any;
  documentId: DocumentId[] = [];
  documentIdList: DocumentIdList[] = [];
  stepC = 0;

  bankDetails:any;

  constructor(private _pensionService: PensionServiceService,
    private _datePipe: DatePipe,
    private formbuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public _dialog: MatDialog,
    private tokenInfo:TokenManagementService
    ) { }

 
 

  ngOnInit(): void {
    
    // comment this code for ngOnChange life cycle hooks checking
    // this.bankDetails = this.formbuilder.group({
    //   accountNumber: [''],
    //   bankBranchId: [''],
    //   employeeCode: [''],
    // })

    // alert(this.empId);

    this.fetchPersonalDetail();
    this.fetchServicesDetail();
    this.fetchAddressesEmp();


    this.empInfo = this.tokenInfo.empinfoService;

    if (this.empInfo.roleId == 49) {
      this.btnLabel = 'Next';
    } else {
      this.btnLabel = 'Proceed';
    }
  }

    // ngOnChange life cycle hooks

  // ngOnChanges(changes: any) {
  //  
  //   if (!changes.deatil.firstChange){
  //     this.bankDetails.patchValue({ ...changes.deatil.currentValue }); 
  //   }
  //   console.log("my id",this.bankDetails.value.accountNumber);
    
  // }

  
  //******************* PROFILE *********// 

  // ****************************PERSONAL DETAIL****************************************

  fetchPersonalDetail() {

    let data = {
      "employeeId": this.empId,
    };

    this._pensionService.postRequestpension(data, 'getPersonaldetailsByEmpCode').subscribe({
        next: (res) => {
          if ((res.status = 200)) {
            this.personalDetail = res.data[0];
            let dd = res.data[0].dateOfBirth;
            let datatime = dd.toString().substring(0, dd.length - 5);
            this.dateOfBirth = this._datePipe.transform(datatime, 'dd/MM/yyyy');
          }
        },
        error: (err) => {
          this.error = err;
          this._snackBar.open('Error occurred :- ', this.error, {
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          //   this.showerror=true;
          //  alert(this.error)
        },
      });
  }


config:AppConfig=new AppConfig
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
      "documentId": this.document,
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

  // ****************************SERVICE DETAIL****************************************
  

  fetchServicesDetail() {
    let data = {
      "employeeId": this.empId,
    };
    this._pensionService.postRequestpension(data, 'getServicedetailsByEmpCode').subscribe({
        next: (res) => {
          if ((res.status = 200)) {
            this.serviceDetails = res.data;
            // this.serviceDetails = res.data[0];
            // this.dateValue = res.data[0].dateTypes[0].dateValue;
          }
        },
        error: (err) => {
          this.error = err;
          this._snackBar.open('Error occurred :- ', this.error, {
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          //   this.showerror=true;
          //  alert(this.error)
        },
      });
  }

  // ****************************ADDRESS DETAIL****************************************
 

  fetchAddressesEmp() {
    this.residenceArray = [];
    this.officeArray = [];
    this.departmentAddress = [];
    let data = {
      employeeId: this.empId,
    };
    this._pensionService.postRequestpension(data, 'getAddressDetailsByEmployeeId').subscribe({
        next: (res) => {
          this.empAddress = res.data;
          let product: any;
          this.residenceAddress = res.data.employeeAddresses;
          this.officeArray = res.data.officeAddresses;
          this.iconOA = 'apartment';
          for (product of this.residenceAddress) {
            if (product.commType == 'C') {
              this.residenceArray.push(product);
              this.iconCA = 'person_pin_circle';
            } else if (product.commType == 'P') {
              this.departmentAddress.push(product);
              this.iconPA = 'account_box';
            }
          }
        },
        error: (err) => {
          this.error = err;
          // this._snackBar.open('Error occurred :- ', this.error, {
          //   horizontalPosition: 'center',
          //   verticalPosition: 'top',
          // });
          //   this.showerror=true;
          //  alert(this.error)
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

 

  removeMartialStatus() {
    this.file1 = null;
    this.martialStatus = '';
  }


  
  UploadMartialStatus(event: any) {
    this.martialStatus = event.target.files[0].name;
    this.file1 = event.target.files[0];
    const employeeId = this.empId;
    const docTypeId = '23';
    this._pensionService
      .saveDocument(this.file1, employeeId, docTypeId)
      .subscribe((result) => {
        let data = {
          docTypeId: docTypeId,
          documentId: result.data.dmsDocumentId,
          docName: result.data.uploadStatusMessage,
        };
        this.document_List.push(data);
        alert('File uploaded successfully');
      });
  }

 

  onChangeDisabled(event: any) {
    this.file2 = event.target.files[0];
    this.disabledFile = event.target.files[0].name;
    const employeeId = this.empId;
    const docTypeId = '24';

    this._pensionService
      .saveDocument(this.file2, employeeId, docTypeId)
      .subscribe((result) => {
        let data = {
          docTypeId: docTypeId,
          documentId: result.data.dmsDocumentId,
          docName: result.data.uploadStatusMessage,
        };
        this.document_List.push(data);
        console.log(this.document_List);

        alert('File uploaded successfully');
      });
  }

  removeDisabled() {
    this.file2 = null;
    this.disabledFile = '';
  }

  removeRetirement() {
    this.file3 = null;
    this.retirementFile = '';
  }

  onRetirement(event: any) {
    this.file3 = event.target.files[0];
    this.retirementFile = event.target.files[0].name;
    const employeeId = this.empId;
    const docTypeId = '15';
    this._pensionService
      .saveDocument(this.file3, employeeId, docTypeId)
      .subscribe((result) => {
        let data = {
          docTypeId: docTypeId,
          documentId: result.data.dmsDocumentId,
          docName: result.data.uploadStatusMessage,
        };
        this.document_List.push(data);
        alert('File uploaded successfully');
      });
  }

  getTaskDetail(taskId: any) {
    let data = {
      "taskId": taskId,
    };

    this._pensionService.requestApplication(data, 'task').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.personalDetail = res.data.payload.Personal_detail;
          this.serviceDetails = res.data.payload.Service_Details;
          this.document_List = res.data.payload.document_list;
          this.documentlist = res.data.payload.Documents;

          for (let D of this.documentlist) {
            for (let p of this.empDoc) {
              if (p.docTypeId == D.docTypeId) {
                this.documentId.push({ id: p.docTypeId });

                this.documentIdList.push({
                  documentName: D.docName,
                  size: '215',
                  id: D.docTypeId,
                });
                console.log(this.documentIdList);
              }
            }
          }
        }
      },
      error: (err) => {
        console.log(err);
        this.error = err;
      },
    });
  }

  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length;i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }

  setStepC(index: number) {
    this.stepC = index;
  }
  nextStepC() {
    this.stepC++;
  }
  prevStepC() {
    this.stepC--;
  }

//#endregion PROFILE

}
