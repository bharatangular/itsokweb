import { RvnlDetailsComponent } from './../rvnl-details/rvnl-details.component';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConfig } from 'src/app/app.config';
import { CommonService } from 'src/app/services/common.service';
import { LoaderService } from 'src/app/services/loader.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { RedirectService } from 'src/app/services/redirect.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { ViewPensionEssComponent } from '../../e-pension/view-pension-ess/view-pension-ess.component';
import { MatStepper } from '@angular/material/stepper';
import { EsignModalComponent } from '../../esign-modal/esign-modal.component';
import { FamilyDetailsPopupComponent } from 'src/app/family-details-popup/family-details-popup.component';
import * as moment from 'moment';
import { PdfPreviewComponent } from '../../e-pension/pdf-preview/pdf-preview.component';
import { CommonDialogComponent } from '../../common-dialog/common-dialog.component';
import { ServiceRecordDialogComponent } from '../../service-record-dialog/service-record-dialog.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

interface City {
  value: string;
  viewValue: string;
}
interface gap {
  date: string;
}
interface count {
  sum: number;
}
interface document {
  file: string;
}
interface document_id {
  id: number;
}
interface progress {
  ind: number;
}
interface document_id_list {
  document_name: string;
  size: string;
  id: number;
}
export interface PeriodicElement {
  name: string;
  title: number;
  sex: string;
  symbol: string;
  imagePath: string;
  relation: string;
  main: string;
  alternate: string;
}

@Component({
  selector: 'app-view-rvnl-details',
  templateUrl: './view-rvnl-details.component.html',
  styleUrls: ['./view-rvnl-details.component.scss'],
})
export class ViewRvnlDetailsComponent implements OnInit {
  @ViewChild('content', { static: false }) el!: ElementRef;
  exMilitaryMan: any;
  isLr: boolean = false;
  isCommutation: boolean = false;
  removeDoc: boolean[] = [];
  is_Disabled: boolean = true;
  Banklist: any = [];
  serviceRecordForm!: FormGroup;
  gratuatyDetails: any;
  monthlyPensionDetails: any;
  licDetails: any;
  familyMembers: FormArray;
  familyMembersArray:FormArray;
  familyMembersFormArray:any;
  licDetailsFormArray:any;
  comutationDetails: any;
  loanAndAdvancesDetails: any;
  payload_summary: any;
  payEntitlementDetails: any;
  Pension_Commutation: any;
  Calculations_Pay_Details: any;
  Calculations_Pension_Details: any;
  Calculations_Commutation_Details: any;
  Calculations_ARD_Details: any;
  isMaker1: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  files: any[] = [];
  RetirementOrderfiles: any[] = [];
  Govt_files: any[] = [];
  No_DE_files: any[] = [];
  Bank_files: any[] = [];
  No_DuesFile: any[] = [];
  Single_files: any[] = [];
  Single_files1: any[] = [];
  NSDL_files: any[] = [];
  Accommodation_File: any[] = [];
  Joint_files: any[] = [];
  dateofJoinging: any;
  docList: any[] = [];
  url: any;
  id1: any;
  id: any;
  File_name: any;
  doc_list: any[] = [];
  doc_list1: any[] = [];
  show: boolean = false;
  Retirementshow: boolean = true;
  Govt_show: boolean = true;
  No_DE_show: boolean = true;
  Bank_show: boolean = true;
  NODue_show: boolean = true;
  Single_show: boolean = true;
  NSDL_show: boolean = true;
  Joint_show: boolean = true;
  Accommodation_show: boolean = true;
  show_doc: any;
  idList: any;
  newDocList: any[] = [];
  //#endregion DOCUMENT UPLOAD VARIABLES
  maxDate2: any;
  currentItem = 'Television';
  message: string = 'Are you sure?';
  hide = true;
  deTypeStatus: any;
  deTypeName: any;
  isDisabled: boolean = true;
  isdialog: boolean = false;
  userDetails: any = {
    role: '',
    roleid: '',
    assignmentid: '',
    officeid: '',
    treasCode: '',
    treasName: '',
  };
  advancedLoan: any[] = [];
  conditionForm!: FormGroup;
  commutationDetails!: FormGroup;
  registrationForm!: FormGroup;
  recoveryForm!: FormGroup;
  jointImageUrl: any = 'assets/images/jointImg.jfif';
  imageUrl: any = 'assets/images/userImg.png';
  signimageUrl: any = 'assets/images/signature.png';
  editFile: boolean = true;
  removeUpload: boolean = false;
  // @ViewChild('fileInput') el!: ElementRef;
  Personaldetail2: any;
  serCatId: any;
  Personaldetail: any;
  ServiceDetails: any = {};
  residenceAddress: any;
  interests: City[] = [];
  Request_Confirmation!: FormGroup;
  formGroup!: FormGroup;
  Summary!: FormGroup;
  rvnlDetailsForm: FormGroup;
  recoveryFormNew!: FormGroup;
  DeductionFormNew!: FormGroup;
  AllowanceFormNew!: FormGroup;
  WithHeldFormNew!: FormGroup;
  status: string = 'Deactive';
  drmaster: boolean = false;
  BudgetDetails: any[] = [];
  dateOfBirth: any;
  residenceArray: any[] = [];
  officeArray: any[] = [];
  DepartmentAddress: any[] = [];
  serviceRecordarry: any[] = [];
  serviceRecord_arry: any[] = [];
  serviceRecord_arry_List: any[] = [];
  serviceRecordarry1: any[] = [];
  serviceRecordupdate: any[] = [];
  record: string = '';
  record1: any;
  error: string = '';
  showerror: boolean = false;
  schemeIdForCommutation = 5;
  schemeIdForGratuity = 6;
  schemeIdForArrears = 7;
  empinfo: any;
  makerToken: any;
  reqid: any;
  transId: any;
  taskRoleId: any;
  employeeCode: any;
  employeeId: any;
  action: any;
  adApproveFlag: any;
  tasklist: any;
  Remark_Details: any;
  EDIT: any;
  FORWARD: any;
  REVERT: any;
  serviceRecordData: any;
  rid: any;
  Condition: boolean = true;
  treasury: any;
  isApprove: boolean = false;
  treasuryName: any;
  datalist: any;
  serviceCatData: any[] = [];
  serviceCatData1: any[] = [];
  addEditServiceRecordslist: any[] = [];
  serviceSubCatData: any[] = [];
  dateofRetirement: any;
  gapArray: gap[] = [];
  isShowNomineeDetails = false;
  gapData: any = [];
  date_Data: count[] = [];
  PersonalDetail_Document: document[] = [];
  document_list: any[] = [];
  RangeChange1: any;
  RangeChange: any;
  reqId: any;
  aid: any;
  confirm: boolean = false;
  isDeStatus: boolean = false;
  isPenalty: boolean = false;
  Objectionform!: FormGroup;
  isMaker: boolean = false;
  isCheckerOrApprover = false;
  makerId: any;
  btnlabel: string = 'Proceed';
  is_doc_show: boolean = false;
  wfProcessId: any;
  assignmentId: any;
  esignData: any;
  frEsignData: any;
  pkEsignData: any;
  psnType: any;
  psnTypeCode: any;
  config: AppConfig = new AppConfig();
  serviceRecordDatanew: any;
  mainUrl: any;
  pendingListMaker: boolean = false;
  isRemoveDe: boolean[] = [];
  psnId: any;
  receivedData: any;
  empData: any;
  dynamicForm: FormGroup;
  //#region CONSTRUCTOR
  constructor(
    private formbuilder: FormBuilder,
    private _Service: PensionServiceService,
    private cd: ChangeDetectorRef,
    private datepipe: DatePipe,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private modalService: NgbModal,
    // private ActivatedRoute: ActivatedRoute,
    private routers: Router,
    private http: HttpClient,
    private date: DatePipe,
    private redirectService: RedirectService,
    public actRoute: ActivatedRoute,
    public load: LoaderService,
    private route: ActivatedRoute,
    private tokenInfo: TokenManagementService,
    public commonService: CommonService // @Inject(MAT_DIALOG_DATA) public matdata: {message: any},
  ) // private dialogRef: MatDialogRef<ViewRvnlDetailsComponent>
  {
    this.route.params.subscribe((params) => {
      this.receivedData = params['pensionerId'];
      console.log(this.receivedData);
    });

    console.log('recived data : ' + this.receivedData);

    console.log('by using routes row data is coming ', this.receivedData);

    console.log('=============>');
    // console.log(matdata.message.empData.pensionerId)
    // this.psnId = matdata.message.empData.pensionerId;
  }
  //#endregion CONSTRUCTOR
  date11: any;

  ngOnInit(): void {
    // if(this.matdata)
    // {
    //   console.log("matdata",this.matdata)
    //   this.isdialog=this.matdata.message.isdialog
    // }

    this.dynamicForm = this.formbuilder.group({
      numberOfTickets: ['', Validators.required],
      tickets: new FormArray([])
    });


    this.rvnlDetailsForm = this.formbuilder.group({
      familyPensionAmount: new FormControl(''),
      ppoAmt: new FormControl(''),
      ppoDate: new FormControl(''),
      taxDeductionAmount: new FormControl(''),
      ppoNo: new FormControl(''),
      startDatePension: new FormControl(''),
      reducedFamilyPension: new FormControl(''),
      recoveryHead: new FormControl(''),
      recoveryAmount: new FormControl(''),
      additionalFamilypensionAmount: new FormControl(''),
      deductionAmount: new FormControl(''),
      ppoType: new FormControl(''),
      additionalPensionAmount: new FormControl(''),
      netMonthlyPensionAmount: new FormControl(''),
      drAmount: new FormControl(''),
      taxDeductionHead: new FormControl(''),
      drRate: new FormControl(''),
      deductionHead: new FormControl(''),
      commuationPercentage: new FormControl(''),
      // pensionerDetailId: new FormControl(''),

      // Personal Detail Data ===========>
      janadhaar: new FormControl(''),
      employeeName: new FormControl(''),
      employeeId: new FormControl(''),
      ssoId: new FormControl(''),
      pensionId: new FormControl(''),
      gender: new FormControl(''),
      dateOfBirth: new FormControl(''),
      height: new FormControl(''),
      identificationMarks: new FormControl(''),
      fatherName: new FormControl(''),
      motherName: new FormControl(''),
      maritalStatus: new FormControl(''),
      spouseName: new FormControl(''),
      disable: new FormControl(''),
      disabilityCatName: new FormControl(''),
      disabilityPercent: new FormControl(''),
      bloodGrpName: new FormControl(''),
      emailId: new FormControl(''),
      mobileNo: new FormControl(''),
      nationality: new FormControl(''),
      religion: new FormControl(''),
      panNo: new FormControl(''),
      aadharNo: new FormControl(''),
      deptName: new FormControl(''),
      desigination: new FormControl(''),

      // Service Details ==>

      appointmentOrderDate: new FormControl(''),
      percentageOfCommutation: new FormControl(''),

      orderIssueAuthorityOffice: new FormControl(''),
      noOfQualifyingService: new FormControl(''),
      appointingAuthority: new FormControl(''),
      deType: new FormControl(''),
      isDe: new FormControl(''),
      deStatus: new FormControl(''),
      fromDate: new FormControl(''),
      DOPD: new FormControl(''),
      dateOfJoining: new FormControl(''),
      dor: new FormControl(''),
      gpfNo: new FormControl(''),
      serviceDetailId: new FormControl(''),

      // address details =>
      postalAddress: new FormControl(''),
      addressAfterRetirment: new FormControl(''),

      // Family Details=>
      // familyMembers: this.formbuilder.array([]),
      //familyMembers:  new FormArray([]),
      familyMembers: this.formbuilder.array([]),

      // familyMembersArray: this.formbuilder.array([]),
      familymemberDetailId:new FormControl(''),
      familymemberName: new FormControl(''),
      familymemberMotherName: new FormControl(''),
      familymemberNationality: new FormControl(''),
      familymemberGender: new FormControl(''),
      familymemberMaritalStatus: new FormControl(''),
      familymemberPercentageOfDisability: new FormControl(''),
      familymembereMployedUnEmployed: new FormControl(''),
      familymemberBankDetails: new FormControl(''),
      familymemberTypeOfDisability: new FormControl(''),
      familymemberIdentificationMark: new FormControl(''),
      familymemberAadhaarNo: new FormControl(''),
      familymemberBloodGroup: new FormControl(''),
      familymemberDob: new FormControl(''),
      familymemberJanaadharNo: new FormControl(''),
      familymemberIsDisabled: new FormControl(''),
      familymemberRelationship: new FormControl(''),


      // commutation Details =>

      comutationDeductionAmount: new FormControl(''),
      comutationHead:new FormControl(''),
      comutationAuthorityNo:new FormControl(''),
      comutationAmount:new FormControl(''),
      comutationStartDate:new FormControl(''),
      lastDatecomutationDeduction:new FormControl(''),
      comutationAuthorityGenerationDate:new FormControl(''),
      comutationDetailId:new FormControl(''),


      // Gratutity Details =>
      grautityAuthorityNo:new FormControl(''),
      grautityAmount:new FormControl(''),
      grautityAuthorityNoGenDate:new FormControl(''),
      grautityHead:new FormControl(''),
      grautityDetailId: new FormControl(''),

      // Lic Details =>

      licDetails: this.formbuilder.array([]),


      // bank details
      accountType: new FormControl(''),
      bankAccountNo: new FormControl(''),
      bankName: new FormControl(''),
      ifscCode: new FormControl(''),
      bankId: new FormControl(''),

      // pay Entitlement
      payLevelPayScale: new FormControl(''),
      gradePay: new FormControl(''),
      payCommission: new FormControl(''),
      specialPay: new FormControl(''),
      BasisPay: new FormControl(''),
      dearnessAllowance: new FormControl(''),
      payId:new FormControl('')

    });




    this.familyMembersFormArray=this.rvnlDetailsForm.controls['familyMembers'] as FormArray

    this.licDetailsFormArray= this.rvnlDetailsForm.controls['licDetails'] as FormArray




    //console.log("rvnlDetailsForm==>>",this.rvnlDetailsForm.controls);

   // console.log("rvnlDetailsForm==>>",this.familyMembersFormArray.controls );



    // this.rvnlDetailsForm.controls['familymemberName'].setValue(this.familyMembersFormArray.familymemberName);
    this.updateDetails();

    this.userDetails = this.config.getUserDetails();
    this._Service.url = 'Inbox  >  Profile';
    console.log('userdetails', this.userDetails);

    this.assignmentId = this.userDetails.assignmentid;
    this.actRoute.queryParams.subscribe((params) => {
      var esignRes = params['status'];
      var id = params['id'];
      var makerRevert = params['m'];
      if (makerRevert == 'qweraZaS') {
        this.pendingListMaker = true;
      }
      if (esignRes) {
        if (id) {
          this.getEsignData(id);
        }
      }
    });

    this.progress = 0;
    this.Complete = 0;
    this.reqid = this.config.getDetails('reqId');
    this.transId = this.config.getDetails('transid');
    this.taskRoleId = this.config.getDetails('taskRoleId');
    this.employeeCode = this.config.getDetails('employeeCode');
    this.employeeId = this.config.getDetails('employeeId');
    console.log('employeeId ++++++++++++++++++++++', this.employeeId);
    this.wfProcessId = this.config.getDetails('wfProcessId');
    this.psnType = this.config.getDetails('psnType');

    this.empinfo = this.tokenInfo.empinfoService;
    this.treasury = this.userDetails.treasCode;
    this.treasuryName = this.userDetails.treasName;
    console.log(' this.treasuryCode', this.treasury);
    // this.getLRnumber();

    // this.getDeduction();
    // this.getAllowance();
    // this.getWithHeldReasons();
    // this.getTreasury();

    this.fetchPersonaldetail();

    if (this.userDetails.roleid && !this.pendingListMaker) {
      this.isMaker = true;
      this.isCheckerOrApprover = false;

      // this.fetchServicesdetail();

      //alert(this.ServiceDetails.calculationPer)
      // this.fetchAddressesEmp();
      // this.getFamilyDetails();
      // this.getNomination();
      // this.getPension_Commutation();
      // this.Bank_Detail();
      // this.fetchpersonalEmp();
      // this.getAllUploadedDocumentDetailsByEmployeeCode();
      // this.getLoanAndAdvancesDetails();
      // this.get_Service_Records();
      setTimeout(() => {
        // <<<---using ()=> syntax
        this.checkDisable();
      }, 3000);

      // this.getRecovery();
    } else if (this.userDetails.roleid == '1' && this.pendingListMaker) {
      this.isMaker = true;
      this.isCheckerOrApprover = false;
      this.getTaskDetailMaker(this.transId);
    } else {
      this.isCheckerOrApprover = true;
      this.isMaker = false;
      this.getTaskDetail(this.transId);
    }

    this.recoveryFormNew = this.formbuilder.group({
      recoveryType: new FormControl('', Validators.required),
      recoveryAmount: new FormControl('', Validators.required),
      recoveryHead: new FormControl('', Validators.required),
    });
    this.DeductionFormNew = this.formbuilder.group({
      deductionType: new FormControl('', Validators.required),
      deductionName: new FormControl(''),
      deductionAmount: new FormControl('', Validators.required),
      deductionHead: new FormControl('', Validators.required),
    });
    this.AllowanceFormNew = this.formbuilder.group({
      allowanceType: new FormControl('', Validators.required),
      allowanceName: new FormControl(''),
      allowanceAmount: new FormControl('', Validators.required),
      allowanceHead: new FormControl('', Validators.required),
    });
    this.Objectionform = this.formbuilder.group({
      // Objection: new FormControl('', Validators.required),
      ObjectionText: new FormControl(''),
    });
    this.WithHeldFormNew = this.formbuilder.group({
      withHeldType: new FormControl('', Validators.required),
      withHeldName: new FormControl(''),
      withHeldAmount: new FormControl('', Validators.required),
      withHeldReason: new FormControl('', Validators.required),
    });

    this.Request_Confirmation = this.formbuilder.group({
      Remarks: new FormControl(''),
      pepperoni: new FormControl(''),
      extracheese: new FormControl(''),
      mushroom: new FormControl(''),
    });
    this.Summary = this.formbuilder.group({
      is_agree: new FormControl(false),
    });

    this.conditionForm = this.formbuilder.group({
      condition_1: new FormControl(''),
      condition_1_Date: new FormControl(''),
      condition_1_Date1: new FormControl(''),
      condition_1_Amount: new FormControl(''),
      condition_2: new FormControl(''),
      condition_3: new FormControl(''),
      condition_4: new FormControl(''),
      condition_5: new FormControl(''),
      condition_6: new FormControl(''),
      condition_7: new FormControl(''),
      condition_8: new FormControl(''),
      condition_9: new FormControl(''),
      condition_9_StartDate: new FormControl(''),
      condition_9_EndDate: new FormControl(''),
      condition_9_FromtDate: new FormControl(''),
      condition_9_TotDate: new FormControl(''),
      condition_10: new FormControl(''),
      condition_10_Amount: new FormControl(''),
      condition_10_Amount2: new FormControl(''),
      condition_11: new FormControl(''),
      condition_12: new FormControl(''),
      condition_12_Amount: new FormControl(''),
    });

    this.commutationDetails = this.formbuilder.group({
      budgetHead: new FormControl(''),
      budgetHeadId: new FormControl(''),
      effectiveDate: new FormControl(''),
      Commutation_Amount: new FormControl(''),
      Commutation_Factor: new FormControl(''),
      Commutation_Value: new FormControl(''),
    });

    this.registrationForm = this.formbuilder.group({
      addDynamicElement: this.formbuilder.array([]),
      addDeduction: this.formbuilder.array([]),
      addAllowanceType: this.formbuilder.array([]),
      addWithHeld: this.formbuilder.array([]),
    });
    this.recoveryForm = this.formbuilder.group({});

    this.serviceRecordForm = this.formbuilder.group({
      category: new FormControl(''),
      subCategory: new FormControl(''),
      serviceLength: new FormControl(''),
      qualifyingService: new FormControl(''),
      nonQualifyingService: new FormControl(''),
      totalNonQualifyService: new FormControl(''),
      de_Status: new FormControl(''),
      deType: new FormControl(''),
      start_Date: new FormControl(''),
      end_Date: new FormControl(''),
      penalty: new FormControl(''),
      remark: new FormControl(''),
      nonQualifyingServicestart_Date: new FormControl(''),
      nonQualifyingServiceend_Date: new FormControl(''),
      DEstart_Date: new FormControl(''),
      DEend_Date: new FormControl(''),
    });

    if (this.userDetails.roleid != '1') {
      this.conditionForm.disable();
    }

    this._Service.userActivated.subscribe((data: any) => {
      let rajIndex = 0;
      this.documentlist.filter((data: any, index: number) => {
        if (data.docName == 'No DE Certificate') {
          rajIndex = index;
          return data;
        }
      });
      if (data.doc_id) this.documentlist[rajIndex].dmsDocId = data.doc_id;
      delete data.doc_id;
      delete data.doc_name;
      //console.log("new data", data);
      this.serviceRecordDatanew = data;
      this.serviceRecord_arry_List = [];

      this.pension_calculation(data);
      this.serviceRecord_arry_List.push(data);
      if (data.deStatus == '1') {
        this.destatus = true;
      } else {
        this.destatus = false;
      }

      //console.log("abc", this.serviceRecord_arry_List);
      for (let D of this.serviceRecord_arry) {
        for (let p of this.serviceRecord_arry_List) {
          if (p.id == D.id) {
            this.serviceRecord_arry = this.serviceRecord_arry_List;
            this.getPension_Commutation();
          }
        }
      }
    });

    this._Service.userActivated1.subscribe((data: any) => {
      this.serviceRecord_arry.push(data);
    });
  }

  get f() { return this.dynamicForm.controls; }
  get t() { return this.f['tickets'] as FormArray; }

  // get f() { return this.rvnlDetailsForm.controls; }
  // get t() { return this.f.familyMembers as FormArray; }


  exportToPdf() {
    window.print();
    // this.commonService.exportToPdf(this.el.nativeElement);
  }
  removeobj(i: any, data: any) {
    this._Service.getCurrentDate();

    setTimeout(() => {
      this.ObjectionArray[i].rejected = true;
      this.ObjectionArray[i].rejectedDate = this._Service.currentDate;
    }, 500);
  }
  addRecovery() {
    if (this.recoveryFormNew.valid) {
      this.addDynamicElement.push(
        this.formbuilder.group({
          recoveryType: new FormControl(
            this.recoveryFormNew.value.recoveryType
          ),
          recoveryAmount: new FormControl(
            this.recoveryFormNew.value.recoveryAmount
          ),
          recoveryHead: new FormControl(
            this.recoveryFormNew.value.recoveryHead
          ),
        })
      );
      this.recoveryFormNew.reset();
    } else {
      alert('Please check all fields properly.');
    }
  }
  addDed() {
    if (this.DeductionFormNew.valid) {
      this.addDeduction.push(
        this.formbuilder.group({
          deductionType: new FormControl(
            this.DeductionFormNew.value.deductionType
          ),
          deductionName: new FormControl(
            this.DeductionFormNew.value.deductionName
          ),
          deductionAmount: new FormControl(
            this.DeductionFormNew.value.deductionAmount
          ),
          deductionHead: new FormControl(
            this.DeductionFormNew.value.deductionHead
          ),
        })
      );
      this.isRemoveDe[this.addDeduction?.length - 1] = true;
      this.DeductionFormNew.reset();
    } else {
      alert('Please check all fields properly.');
    }
  }
  addAll() {
    if (this.AllowanceFormNew.valid) {
      this.addAllowanceType.push(
        this.formbuilder.group({
          allowanceType: new FormControl(
            this.AllowanceFormNew.value.allowanceType
          ),
          allowanceName: new FormControl(
            this.AllowanceFormNew.value.allowanceName
          ),
          allowanceAmount: new FormControl(
            this.AllowanceFormNew.value.allowanceAmount
          ),
          allowanceHead: new FormControl(
            this.AllowanceFormNew.value.allowanceHead
          ),
        })
      );
      this.AllowanceFormNew.reset();
    } else {
      alert('Please check all fields properly.');
    }
  }

  updateDetails() {
    console.log("le bhai id ",this.rvnlDetailsForm.get('pensionerDetailId')?.value);

    console.log(this.rvnlDetailsForm.get('familyMembers')?.value)


    let updateData = {
      "psnPersonalDtl": {
          "pensionId": this.rvnlDetailsForm.get('pensionId')?.value,
          "employeeId": this.rvnlDetailsForm.get('employeeId')?.value,
          "ssoId": this.rvnlDetailsForm.get('ssoId')?.value,
          "employeeName": this.rvnlDetailsForm.get('employeeName')?.value,
          "janadhaar": this.rvnlDetailsForm.get('janadhaar')?.value,
          "pran": this.rvnlDetailsForm.get('pran')?.value,
          "fatherName": this.rvnlDetailsForm.get('fatherName')?.value,
          "motherName": this.rvnlDetailsForm.get('motherName')?.value,
          "martialStatus": this.rvnlDetailsForm.get('maritalStatus')?.value,
          "spouseName": this.rvnlDetailsForm.get('spouseName')?.value,
          "desigination": this.rvnlDetailsForm.get('desigination')?.value,
          "religion": this.rvnlDetailsForm.get('religion')?.value,
          "nationality": this.rvnlDetailsForm.get('nationality')?.value,
          "gender": this.rvnlDetailsForm.get('gender')?.value,
          "height": this.rvnlDetailsForm.get('height')?.value,
          "deptName": this.rvnlDetailsForm.get('deptName')?.value,
          "dob": this.rvnlDetailsForm.get('dateOfBirth')?.value,
          "nameOfCircle": this.rvnlDetailsForm.get('nameOfCircle')?.value,
          "mobileNo": this.rvnlDetailsForm.get('mobileNo')?.value,
          "postalAddress": this.rvnlDetailsForm.get('postalAddress')?.value,
          "addressAfterRetirment": this.rvnlDetailsForm.get('addressAfterRetirment')?.value,
          "emailId": this.rvnlDetailsForm.get('emailId')?.value,
          "aadharNo": this.rvnlDetailsForm.get('aadharNo')?.value,
          "panNo": this.rvnlDetailsForm.get('panNo')?.value,
          "doj": this.rvnlDetailsForm.get('dateOfJoining')?.value,
          "dor": this.rvnlDetailsForm.get('dor')?.value,
          "gpfNo": this.rvnlDetailsForm.get('gpfNo')?.value,
          "comumutation": this.rvnlDetailsForm.get('comumutation')?.value,
          "percentageOfComumutation": this.rvnlDetailsForm.get('commuationPercentage')?.value,
          "percentageOfDisability": this.rvnlDetailsForm.get('disabilityPercent')?.value,
          "typesOfDisability": this.rvnlDetailsForm.get('disabilityCatName')?.value,
          "deptId": this.rvnlDetailsForm.get('deptId')?.value,
          "officeId": this.rvnlDetailsForm.get('officeId')?.value
      },
      "serviceDetails": {
          "serviceDetailId": this.rvnlDetailsForm.get('serviceDetailId')?.value,
          "appointmentOrderDate": this.rvnlDetailsForm.get('appointmentOrderDate')?.value,
          "orderIssueAuthorityOffice": this.rvnlDetailsForm.get('orderIssueAuthorityOffice')?.value,
          "appointingAuthority": this.rvnlDetailsForm.get('appointingAuthority')?.value,
          "dateOfJoining": this.rvnlDetailsForm.get('dateOfJoining')?.value,
          "noOfQualifyingService": this.rvnlDetailsForm.get('noOfQualifyingService')?.value,
          "isDe": this.rvnlDetailsForm.get('isDe')?.value,
          "fromDate": this.rvnlDetailsForm.get('fromDate')?.value,
          "toDate": this.rvnlDetailsForm.get('dor')?.value,
          "deStatus": this.rvnlDetailsForm.get('deStatus')?.value,
          "deType": this.rvnlDetailsForm.get('deType')?.value
      },
      "grautityDetails": {
          "grautityDetailId": this.rvnlDetailsForm.get('grautityDetailId')?.value,
          "grautityAuthorityNo": this.rvnlDetailsForm.get('grautityAuthorityNo')?.value,
          "grautityAuthorityNoGenDate": this.rvnlDetailsForm.get('grautityAuthorityNoGenDate')?.value,
          "grautityAmount": this.rvnlDetailsForm.get('grautityAmount')?.value,
          "grautityHead": this.rvnlDetailsForm.get('grautityHead')?.value
      },
      "pay_entitlement": {
          "payId": this.rvnlDetailsForm.get('payId')?.value,
          "payCommission": this.rvnlDetailsForm.get('payCommission')?.value,
          "payLevelPayScale": this.rvnlDetailsForm.get('payLevelPayScale')?.value,
          "gradePay": this.rvnlDetailsForm.get('gradePay')?.value,
          "BasisPay":this.rvnlDetailsForm.get('BasisPay')?.value,
          "specialPay": this.rvnlDetailsForm.get('specialPay')?.value,
          "dearnessAllowance": this.rvnlDetailsForm.get('dearnessAllowance')?.value
      },
      "monthlyPensionDetails": {
          "ppoType": this.rvnlDetailsForm.get('ppoType')?.value,
          "ppoNo": this.rvnlDetailsForm.get('ppoNo')?.value,
          "ppoDate": this.rvnlDetailsForm.get('ppoDate')?.value,
          "ppoAmt": this.rvnlDetailsForm.get('ppoAmt')?.value,
          "startDatePension": this.rvnlDetailsForm.get('startDatePension')?.value,
          "deductionHead": this.rvnlDetailsForm.get('deductionHead')?.value,
          "deductionAmount": this.rvnlDetailsForm.get('deductionAmount')?.value,
          "recoveryHead": this.rvnlDetailsForm.get('recoveryHead')?.value,
          "recoveryAmount":this.rvnlDetailsForm.get('recoveryAmount')?.value,
          "taxDeductionHead": this.rvnlDetailsForm.get('taxDeductionHead')?.value,
          "taxDeductionAmount": this.rvnlDetailsForm.get('taxDeductionAmount')?.value,
          "netMonthlyPensionAmount": this.rvnlDetailsForm.get('netMonthlyPensionAmount')?.value,
          "drAmount": this.rvnlDetailsForm.get('drAmount')?.value,
          "drRate": this.rvnlDetailsForm.get('drRate')?.value,
          "familyPensionAmount": this.rvnlDetailsForm.get('familyPensionAmount')?.value,
          "reducedFamilyPension": this.rvnlDetailsForm.get('reducedFamilyPension')?.value,
          "additionalPensionAmount": this.rvnlDetailsForm.get('additionalPensionAmount')?.value,
          "additionalFamilypensionAmount": this.rvnlDetailsForm.get('additionalFamilypensionAmount')?.value
      },
      "comutationDetails": {
          "comutationDetailId": this.rvnlDetailsForm.get('comutationDetailId')?.value,
          "comutationAuthorityNo": this.rvnlDetailsForm.get('comutationAuthorityNo')?.value,
          "comutationAuthorityGenerationDate": this.rvnlDetailsForm.get('comutationAuthorityGenerationDate')?.value,
          "comutationAmount": this.rvnlDetailsForm.get('comutationAmount')?.value,
          "comutationDeductionAmount": this.rvnlDetailsForm.get('comutationDeductionAmount')?.value,
          "comutationStartDate": this.rvnlDetailsForm.get('comutationStartDate')?.value,
          "lastDatecomutationDeduction": this.rvnlDetailsForm.get('lastDatecomutationDeduction')?.value,
          "comutationHead": this.rvnlDetailsForm.get('comutationHead')?.value
      },
      "bankDetails": {
          "bankId": this.rvnlDetailsForm.get('bankId')?.value,
          "bankName": this.rvnlDetailsForm.get('bankName')?.value,
          "bankAccountNo": this.rvnlDetailsForm.get('bankAccountNo')?.value,
          "accountType": this.rvnlDetailsForm.get('accountType')?.value,
          "ifscCode": this.rvnlDetailsForm.get('ifscCode')?.value
      },
      "familyMemberDetails": this.rvnlDetailsForm.get('familyMembers')?.value,


      "licDetails": this.rvnlDetailsForm.get('licDetails')?.value
  }

  console.log(updateData)

  this._Service.postRvnlDetails(updateData,"/updateRvnlDtls").subscribe({
    next: (res) => {
      this.load.hide();
      console.log(res);
    },
    error: (err) => {
      this.load.hide();
      console.log(err);
      this.error = err

    }
  })


  console.log("up",updateData)


  }

  addWithheld() {
    if (this.WithHeldFormNew.valid) {
      if (this.addWithHeld?.length < 1) {
        this.addWithHeld.push(
          this.formbuilder.group({
            withHeldType: new FormControl(
              this.WithHeldFormNew.value.withHeldType
            ),
            withHeldName: new FormControl(
              this.WithHeldFormNew.value.withHeldName
            ),
            withHeldAmount: new FormControl(
              this.WithHeldFormNew.value.withHeldAmount
            ),
            withHeldReason: new FormControl(
              this.WithHeldFormNew.value.withHeldReason
            ),
          })
        );
        this.WithHeldFormNew.reset();
      } else {
        alert('Only one entry allowed.');
      }
    } else {
      alert('Please check all fields properly.');
    }
  }
  alertUser() {
    alert("Please click 'Add' button for submit details.");
  }
  onChangeDeduction(id: any) {
    if (this.deduction?.length > 0) {
      let data = this.deduction.filter(
        (x: any) => x.allDeductionOrAllowanceId == id
      )[0].allDeductionOrAllowanceName;

      this.DeductionFormNew.patchValue({
        deductionName: data,
      });
    }
  }
  DeductionName(id: any) {
    if (id)
      return this.deduction.filter(
        (x: any) => x.allDeductionOrAllowanceId == id
      )[0].allDeductionOrAllowanceName;
  }
  onChangeDeductionAllow(id: any) {
    let data = this.Allowance.filter(
      (x: any) => x.allDeductionOrAllowanceId == id
    )[0].allDeductionOrAllowanceName;
    this.AllowanceFormNew.patchValue({
      allowanceName: data,
    });
  }

  onChangeDeductionWithHeld(id: any) {
    let data = this.WithHeldReasons.filter(
      (x: any) => x.withHeldReasonId == id
    )[0].withHeldReasonDesc;
    this.WithHeldFormNew.patchValue({
      withHeldName: data,
    });
  }
  checkDisable() {
    if (this.Personaldetail?.disable == 'N') {
      if (this.docList?.length > 0)
        this.docList = this.docList.filter(
          (item) => item.docName != 'Disability Certificate'
        );
    }
    if (this.Personaldetail?.disable == '0') {
      if (this.docList?.length > 0)
        this.docList = this.docList.filter(
          (item) => item.docName != 'Disability Certificate'
        );
    }
  }
  getDedctionTypeName(i: any) {
    if (i) {
      if (this.deduction?.length > 0)
        return this.deduction.filter(
          (x: any) => x.allDeductionOrAllowanceId == i
        )[0].allDeductionOrAllowanceName;
    } else {
      return '';
    }
  }

  getAllowanceTypeName(i: any) {
    if (i) {
      if (this.Allowance?.length > 0)
        return this.Allowance.filter(
          (x: any) => x.allDeductionOrAllowanceId == i
        )[0].allDeductionOrAllowanceName;
    } else return '';
  }

  getwithheldTypeName(i: any) {
    if (i) {
      if (this.WithHeldReasons?.length > 0)
        return this.WithHeldReasons.filter(
          (x: any) => x.withHeldReasonId == i
        )[0].withHeldReasonDesc;
    } else return '';
  }
  lRnumber: any = '';
  getLRnumber() {
    this._Service
      .post('getlrnumber', { inTreasCode: this.treasury })
      .subscribe((res: any) => {
        console.log('result', res);
        if (res.status == 'SUCCESS') {
          this.lRnumber = res.data;
        }
      });
  }
  IsAcc: boolean = false;
  wrongType: boolean = false;
  extension(file: any) {
    let type = file.name.split('.').pop();

    if (type == 'pdf') {
      return true;
    }
    return false;
  }
  nextUpload(event: Event, stepper: MatStepper) {
    console.log(this.documentlist);
    let accountCerDocId = this.documentlist.filter(
      (x: any) => x.docName == 'Accounts Personnel Certificate'
    )[0]?.dmsDocId;
    console.log(accountCerDocId);
    if (accountCerDocId) {
      stepper.next();
      return true;
    } else {
      alert('Please Upload Accounts Personnel Certificate');
      return false;
    }
  }

  checkar_doc(event: any) {
    let time1 = new Date();

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
      time1.getHours() +
      time1.getMilliseconds().toString() +
      '.' +
      ex2[1];
    this.fileName = this.fileName.replace(' ', '');
    const employeeId = this.employeeId;
    const docTypeId = '20';
    const reader = new FileReader();
    var data4: any;
    reader.onloadend = () => {
      //console.log(reader.result);

      data4 = reader.result;
      let data5 = data4.toString();
      data5 = data5.replace('data:application/pdf;base64,', '');
      let data = {
        type: 'pension',
        sourceId: 2,
        docAttributes: [],
        data: [
          {
            docTypeId: docTypeId,
            docTypeName: 'AccountsPersonnelCertificate',
            docName: this.fileName,
            docTitle: 'Certificate',
            content: data5,
          },
        ],
      };

      this._Service.postOr('wcc/uploaddocs', data).subscribe((res: any) => {
        let data = {
          docTypeId: docTypeId,
          dmsDocId: res.data.document[0].docId,
          docName: 'Accounts Personnel Certificate',
        };

        if (res.data.document[0].docId) {
          let rajIndex = -1;
          this.documentlist.filter((data: any, index: number) => {
            if (data.docName == 'Accounts Personnel Certificate') {
              rajIndex = index;
              return data;
            }
          });
          if (rajIndex == -1) {
            this.documentlist.push(data);
          } else {
            this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
          }
          console.log('document_list', this.documentlist);

          alert('Document Uploaded Successfully.');
          this.IsAcc = true;
        } else {
          alert('Some error occured.');
        }
      });
    };
    reader.readAsDataURL(this.file);
  }

  nonQualifyingService: any;
  QualifyingService: any;
  calQualifying: any[] = [];
  calNonQualifying: any[] = [];
  isMilitry: any = 0;
  addServiceRecord1() {
    this.calNonQualifying = [];
    this.calQualifying = [];
    let nonQualifying: any[] = [];

    nonQualifying = this.serviceRecordDatanew.serviceRecordDetails.filter(
      (x: any) => {
        if (x.qualifying == 'N') {
          return x;
        }
      }
    );

    //console.log("non quali", nonQualifying)

    let Qualifying: any[] = [];

    Qualifying = this.serviceRecordDatanew.serviceRecordDetails.filter(
      (x: any) => {
        if (x.qualifying == 'Y') {
          return x;
        }
      }
    );
    let militry: any[] = [];

    militry = this.serviceRecordDatanew.serviceRecordDetails.filter(
      (x: any) => {
        if (x.qualifying == 'A') {
          return x;
        }
      }
    );

    if (militry.length >= 1) {
      this.isMilitry = 1;
    }

    let totalnonQualiService: any =
      0 + ' years ' + 0 + ' months ' + 0 + ' days ';
    let totalnon: any = 0;
    for (let t of nonQualifying) {
      totalnon = totalnon + Number(t.totalDays);
      // totalnonQualiService=this.addTimeofService(totalnonQualiService,t.serviceLengh)
    }
    console.log('totalnonQualiService', totalnonQualiService);

    let totalQua: any = 0;
    for (let t of Qualifying) {
      totalQua = totalQua + Number(t.totalDays);
    }
    //console.log("totalQua", totalQua)
    var years = Math.floor(totalQua / 365);
    var yearRemainder = Math.floor(totalQua % 365);

    var months = Math.floor(yearRemainder / 30);
    var days = Math.floor((totalQua % 365) % 30);

    this.QualifyingService = '';
    this.QualifyingService =
      years + ' years ' + months + ' months ' + days + ' days ';
    //console.log("QualifyingService", this.QualifyingService);

    var years = Math.floor(totalnon / 365);
    var yearRemainder = Math.floor(totalnon % 365);

    var months = Math.floor(yearRemainder / 30);
    var days = Math.floor((totalnon % 365) % 30);

    this.QualifyingService = '';
    this.nonQualifyingService =
      years + ' years ' + months + ' months ' + days + ' days ';
    //console.log("nonQualifyingService", this.nonQualifyingService);

    for (let q of Qualifying) {
      let data = {
        fromDate: q.fromDate,
        toDate: q.toDate,
      };
      this.calQualifying.push(data);
    }
    //console.log("calQualifying", this.calQualifying);
    for (let q of nonQualifying) {
      let data = {
        fromDate: q.fromDate,
        toDate: q.toDate,
      };

      this.calNonQualifying.push(data);
    }
    //console.log("calNonQualifying", this.calNonQualifying);
  }
  getEsignData(id: any) {
    let data = {
      trxnNo: id,
      databaseKey: '3',
    };
    let url = 'esignTransaction';

    this._Service.postNewEsign(url, data).subscribe((res: any) => {
      this.esignData = JSON.parse(res);
      if (this.esignData.responseStatus == '1') {
        if (this.config.getDetails('esigntype') == 'FR') {
          this.pkEsignData = JSON.parse(this.config.getDetails('pkEsignData'));
          this.updateDocId(36);
          let data = {
            esignRes: 'SUCCESS',
            transId: id,
            redirectUrl: 'pension/Inbox',
            type: 'pk',
            pkesigndata: this.pkEsignData,
          };
          this.dialog.open(EsignModalComponent, {
            panelClass: 'dialog-w-30',
            data: { message: data },
          });
        } else {
          if (this.config.getDetails('esigntype') == 'approver') {
            let data = {
              esignRes: 'SUCCESS',
              transId: id,
              redirectUrl: 'pension/Inbox',
              bill: '0',
            };
            this.dialog.open(EsignModalComponent, {
              panelClass: 'dialog-w-30',
              data: { message: data },
            });
          } else {
            this.updateDocId(34);
            let data = {
              esignRes: 'SUCCESS',
              transId: id,
              redirectUrl: 'pension/Inbox',
              bill: '0',
            };
            this.dialog.open(EsignModalComponent, {
              panelClass: 'dialog-w-30',
              data: { message: data },
            });
          }
        }

        // this.billProcess();
      } else {
        if (this.config.getDetails('esigntype') == 'FR') {
          let data = {
            esignRes: 'failed',
            type: 'pk',
            redirectUrl: 'pension/Inbox',
          };
          this.dialog.open(EsignModalComponent, {
            panelClass: 'dialog-w-30',
            data: { message: data },
          });
        } else {
          let data = {
            esignRes: 'failed',
            type: '',
            redirectUrl: 'pension/Inbox',
          };
          this.dialog.open(EsignModalComponent, {
            panelClass: 'dialog-w-30',
            data: { message: data },
          });
        }
      }
      //console.log("esignData", this.esignData);
    });
  }
  updateDocId(docTypeId: any) {
    let pensionerId = this.config.getDetails('pensionerId');
    let data = {
      dmsDocId: this.esignData.docId,
      pensionerId: pensionerId,
      docTypeId: docTypeId,
    };
    this._Service.postPssRequest(data, 'pensionerdocument').subscribe({
      next: (res) => {
        //console.log("res", res);
        if (res.status == 'SUCCESS') {
        } else {
          // alert("Something went wrong");
        }
      },
      error: (err) => {
        // alert("Something went wrong");
        let errorObj = {
          message: err.message,
          err: err,
          response: err,
        };
      },
    });
  }

  billProcess() {
    var randNumber = (Math.random() * 10000).toFixed(0);
    let data = {
      billNo: randNumber,
    };
    let url = 'saveBill';

    this._Service.postSavebill(url, data).subscribe((res: any) => {
      //console.log("billdata", res);
    });
  }

  get_Service_Records() {
    let data = {
      employeeId: this.employeeId,
    };

    this._Service
      .postRequestpension(data, 'getOtherServiceDetailsByEmployeeId')
      .subscribe({
        next: (response) => {
          if ((response.status = 200)) {
            this.serviceRecord = response.data;

            let data = {
              totalServiceLength: this.serviceRecord.totalServiceDuration,

              deStatus: '',
              deType: '',
              deStartDate: '',
              deEndDate: '',
              penalty: '',
              penaltyType: '',
              remark: '',
              id: 1,
              totalNoOfDays: this.serviceRecord.totalNoOfDays,

              nonQualifyingServiceDate_p: '',
              serviceRecordDetails: [],
            };
            this.serviceRecordDatanew = data;
            this.serviceRecord_arry_List.push(data);

            // alert(JSON.stringify(this.serviceRecord_arry_List))
            //   if(this.serviceRecord_arry.DE_Status==0){
            //  this.destatus=true;
            //   }else{
            //     this.destatus=false;
            //   }
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

  //#region STEPPER
  step = 0;
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  // ****************************************************************

  stepFamily = 0;
  setStepFamily(index: number) {
    this.stepFamily = index;
  }
  nextStepFamily() {
    this.stepFamily++;
  }
  prevStepFamily() {
    this.stepFamily--;
  }

  // ****************************************************************

  stepc = 0;
  setStepc(index: number) {
    this.stepc = index;
  }
  nextStepc(i: any) {
    //  if(i==3)
    //  {

    //   if(this.serviceRecordDatanew.deStatus==0)
    //   {
    //     let data1=this.documentlist.filter((data: any)=>{
    //       if(data.docName == "No DE Certificate"){
    //         return data;
    //       }
    //   })
    //   if(data1[0].dmsDocId==null)
    //   {
    //     alert("Enter No DE Certificate ")

    //   }else
    //   {
    //     this.stepc++;
    //   }

    //   }
    //  }else
    //  {

    //  }
    this.stepc++;
  }
  prevStepc() {
    this.stepc--;
  }

  //#endregion STEPPER

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  //#region PROFILE

  // ****************************PERSONAL DETAIL****************************************
  uploadFile(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;

        this.editFile = false;
        this.removeUpload = true;
      };
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
  enhanceDate: any;
  commucationDate: any;
  isgovHouseAlloted: boolean = false;
  fetchPersonaldetail() {
    console.log('fetchDetails===>', this.psnId);
    let data = {
      pensionerId: this.receivedData,
    };
    this._Service
      .postRvnlDetails(data, 'getRvnlPersonalDtlsPensionerWise')
      .subscribe({
        next: (res) => {
          if ((res.status = 200)) {
            this.Personaldetail = res.data.psnPersonalDtl;
            console.log('Personal Details ======> +++', this.Personaldetail);

            this.rvnlDetailsForm.patchValue({
              janadhaar: this.handleBlankValue(this.Personaldetail.janadhaar),
              employeeName: this.handleBlankValue(
                this.Personaldetail.employeeName
              ),
              employeeId: this.handleBlankValue(this.Personaldetail.employeeId),
              ssoId: this.handleBlankValue(this.Personaldetail.ssoId),
              pensionId: this.handleBlankValue(this.Personaldetail.pensionId),
              gender: this.handleBlankValue(this.Personaldetail.gender),
              dateOfBirth: this.handleBlankValue(this.Personaldetail.dob),
              height: this.handleBlankValue(this.Personaldetail.height),
              identificationMarks: this.handleBlankValue(
                this.Personaldetail.identificationMarks
              ),
              fatherName: this.handleBlankValue(this.Personaldetail.fatherName),
              motherName: this.handleBlankValue(this.Personaldetail.motherName),
              maritalStatus: this.handleBlankValue(
                this.Personaldetail.martialStatus
              ),
              spouseName: this.handleBlankValue(this.Personaldetail.spouseName),
              disable: this.handleBlankValue(this.Personaldetail.disable),
              disabilityCatName: this.handleBlankValue(
                this.Personaldetail.typesOfDisability
              ),
              disabilityPercent: this.handleBlankValue(
                this.Personaldetail.percentageOfDisability
              ),
              bloodGrpName: this.handleBlankValue(
                this.Personaldetail.bloodGrpName
              ),
              emailId: this.handleBlankValue(this.Personaldetail.emailId),
              mobileNo: this.handleBlankValue(this.Personaldetail.mobileNo),
              nationality: this.handleBlankValue(
                this.Personaldetail.nationality
              ),
              religion: this.handleBlankValue(this.Personaldetail.religion),
              panNo: this.handleBlankValue(this.Personaldetail.panNo),
              aadharNo: this.handleBlankValue(this.Personaldetail.aadharNo),
              deptName: this.handleBlankValue(this.Personaldetail.deptName),
              desigination: this.handleBlankValue(
                this.Personaldetail.desigination
              ),
              addressAfterRetirment: this.Personaldetail.addressAfterRetirment,
              postalAddress: this.Personaldetail.postalAddress,
            });

            // this.Personaldetail = res.data[0];
            this.Personaldetail = JSON.parse(
              JSON.stringify(this.Personaldetail).replace(/\:null/gi, ':""')
            );

            console.log(
              this.Personaldetail ? this.Personaldetail.employeeName : ''
            );
            let formControls: any = {};
            console.log(this.Personaldetail ? this.Personaldetail.gpfNo : '');
            this.familyDetails = res.data.familyMemberDetails;

//             this.familyDetails.forEach((field:any, index:any) => {
//               Object.keys(field).forEach((fieldName) => {
//                 formControls[`${fieldName}_${index}`] = [
//                   field[fieldName],
//                   Validators.required,
//                 ];
//               });
//             }); // Create the form group
//             this.rvnlDetailsForm = this.formbuilder.group(formControls);
// console.log("this.rvnlDetailsForm", this.rvnlDetailsForm);

            this.addFamilyMembers(this.familyDetails);



            // this.rvnlDetailsForm.patchValue({
            //   'familymemberName': this.handleBlankValue(familyMemberName)
            // })

            this.Banklist = res.data.bankDetails;

            console.log('Bank Details Here : ', this.Banklist);

            this.addBankDetails();

            this.ServiceDetails = res.data.serviceDetails;

            console.log(' Service Details : ', this.ServiceDetails);

            this.rvnlDetailsForm.patchValue({
              appointmentOrderDate: this.handleBlankValue(
                this.ServiceDetails.appointmentOrderDate
              ),
              percentageOfCommutation: this.handleBlankValue(
                this.calculatePercentage(
                  this.Personaldetail.percentageOfComumutation
                )
              ),
              orderIssueAuthorityOffice: this.handleBlankValue(
                this.ServiceDetails.orderIssueAuthorityOffice
              ),
              noOfQualifyingService: this.handleBlankValue(
                this.ServiceDetails.noOfQualifyingService
              ),
              appointingAuthority: this.handleBlankValue(
                this.ServiceDetails.appointingAuthority
              ),
              deType: this.handleBlankValue(
                this.ServiceDetails.deType
              ),
              isDe: this.handleBlankValue(
                this.ServiceDetails.isDe
              ),
              deStatus: this.handleBlankValue(
                this.ServiceDetails.deStatus
              ),
              fromDate: this.handleBlankValue(this.ServiceDetails.fromDate),
              DOPD: this.handleBlankValue(this.DOPD),
              dateOfJoining: this.handleBlankValue(
                this.ServiceDetails.dateOfJoining
              ),
              dor: this.handleBlankValue(this.Personaldetail.dor),
              gpfNo: this.handleBlankValue(this.Personaldetail.gpfNo),
              serviceDetailId: this.ServiceDetails.serviceDetailId,
            });

            this.gratuatyDetails = res.data.grautityDetails;

            console.log('Gratuaity Details : ', this.gratuatyDetails);

            this.addGratuatyDetails();

            this.licDetails = res.data.licDetails;

            console.log('Lic Details : ', this.licDetails);

            this.addLicDetails(this.licDetails);

            // this.addLicDetails();

            this.monthlyPensionDetails = res.data.monthlyPensionDetails;

            this.rvnlDetailsForm.patchValue({
              pensionerDetailId:this.monthlyPensionDetails.pensionerDetailId,
              familyPensionAmount:
                this.monthlyPensionDetails.familyPensionAmount,
              ppoAmt: this.monthlyPensionDetails.ppoAmt,
              ppoDate: this.monthlyPensionDetails.ppoDate,
              taxDeductionAmount: this.monthlyPensionDetails.taxDeductionAmount,
              ppoNo: this.monthlyPensionDetails.ppoNo,
              startDatePension: this.monthlyPensionDetails.startDatePension,
              reducedFamilyPension:
                this.monthlyPensionDetails.reducedFamilyPension,
              recoveryHead: this.monthlyPensionDetails.recoveryHead,
              recoveryAmount: this.monthlyPensionDetails.recoveryAmount,
              additionalFamilypensionAmount:
                this.monthlyPensionDetails.additionalFamilypensionAmount,
              deductionAmount: this.monthlyPensionDetails.deductionAmount,
              ppoType: this.monthlyPensionDetails.ppoType,
              additionalPensionAmount:
                this.monthlyPensionDetails.additionalPensionAmount,
              netMonthlyPensionAmount:
                this.monthlyPensionDetails.netMonthlyPensionAmount,
              drAmount: this.monthlyPensionDetails.drAmount,
              taxDeductionHead: this.monthlyPensionDetails.taxDeductionHead,
              drRate: this.monthlyPensionDetails.drRate,
              deductionHead: this.monthlyPensionDetails.deductionHead,
              commuationPercentage:
                this.monthlyPensionDetails.commuationPercentage,
            });

            console.log('Monthly Pension Details : ', this.licDetails);

            this.payEntitlementDetails = res.data.pay_entitlement;

            console.log(this.payEntitlementDetails);

            this.addEntitlementDetails();

            this.comutationDetails = res.data.comutationDetails;

            this.addCommutationDetails();


            console.log(this.comutationDetails);

            // this.commutationDateCalculation2();
            // this.Personaldetail2 = res.data[0];
            // let dd = res.data[0].dateOfBirth
            // this.Personaldetail.dateOfBirth = this.date.transform(this.Personaldetail.dateOfBirth, 'dd/MM/yyyy')
            // let datatime = dd.toString().substring(0, dd.length - 5);
            // this.dateOfBirth = this.datepipe.transform(datatime, 'dd/MM/yyyy')
            this.dateofRetirement = this.Personaldetail.dor;
            console.log(this.dateofRetirement);
            // let comm = this.Personaldetail.comDate?.split('[')
            // this.commucationDate = comm[0];
            // this.commutationDetails.patchValue({ effectiveDate: this.commucationDate });

            // if (this.Personaldetail?.govHouseAlloted == 'Y') {
            //   this.isgovHouseAlloted = true
            // } else {
            //   this.isgovHouseAlloted = false
            // }
            // let dates = new Date(this.dateofRetirement)
            // // this.conditionForm.patchValue({ condition_1_Date: dates });
            // this.maxDate2 = new Date(this.dateofRetirement);
            // this.maxDate2 = new Date(this.maxDate2.getFullYear(), this.maxDate2.getMonth(), this.maxDate2.getDate() - 1)
            // // console.log("maxDate2", this.maxDate2);
            // if (this.Personaldetail?.selfPhotoId > 0)
            //   this.showPic(this.Personaldetail.selfPhotoId);
            // if (this.Personaldetail?.jointPhotoId > 0)
            //   this.jointPic(this.Personaldetail.jointPhotoId);
            // let date1 = new Date(this.commucationDate)

            // this.commutationDateCalculation(date1);
            // console.log(this.Personaldetail)
            // console.log("Joint photo ID",this.Personaldetail.jointPhotoId,"self Photo-->>",this.Personaldetail.selfPhotoId  )
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
    console.log('Personal details', this.Personaldetail);
  }

  addLicDetails(members:any) {

    this.licDetailsFormArray = this.rvnlDetailsForm.get('licDetails') as FormArray;


    for (let i = this.t.length; i < members.length; i++) {
      this.licDetailsFormArray.push(
       this.formbuilder.group({
        licDetailId: [members[i].licDetailId],
         lsSubmitted: [members[i].lsSubmitted],
         lcSubmittedDate: [members[i].lcSubmittedDate],
   }));


 }


    console.log("Lic Details in addLicDetails : ==>>",this.licDetailsFormArray);


  }
  addEntitlementDetails() {
    this.rvnlDetailsForm.patchValue({
      'payLevelPayScale':this.payEntitlementDetails.payLevelPayScale,
      'gradePay':this.payEntitlementDetails.gradePay,
      'payCommission':this.payEntitlementDetails.payCommission,
      'specialPay':this.payEntitlementDetails.specialPay,
      'BasisPay':this.payEntitlementDetails.BasisPay,
      'dearnessAllowance':this.payEntitlementDetails.dearnessAllowance,
      'payId':this.payEntitlementDetails.payId
    })
  }
  addBankDetails() {

    this.rvnlDetailsForm.patchValue({
      'accountType':this.Banklist.accountType,
      'bankAccountNo':this.Banklist.bankAccountNo,
      'bankName':this.Banklist.bankName,
      'ifscCode':this.Banklist.ifscCode,
      'bankId':this.Banklist.bankId,

    })

  }

  addCommutationDetails(){

    this.rvnlDetailsForm.patchValue({
      'comutationDeductionAmount':this.comutationDetails.comutationDeductionAmount,
      'comutationHead':this.comutationDetails.comutationHead,
      'comutationAuthorityNo':this.comutationDetails.comutationAuthorityNo,
      'comutationAmount':this.comutationDetails.comutationAmount,
      'comutationStartDate':this.comutationDetails.comutationStartDate,
      'lastDatecomutationDeduction':this.comutationDetails.lastDatecomutationDeduction,
      'comutationAuthorityGenerationDate':this.comutationDetails.comutationAuthorityGenerationDate,
      'comutationDetailId': this.comutationDetails.comutationDetailId
    })


  }

  addGratuatyDetails(){
    this.rvnlDetailsForm.patchValue({
      'grautityAuthorityNo':this.gratuatyDetails.grautityAuthorityNo,
      'grautityAmount':this.gratuatyDetails.grautityAmount,
      'grautityAuthorityNoGenDate':this.gratuatyDetails.grautityAuthorityNoGenDate,
      'grautityHead':this.gratuatyDetails.grautityHead,
      'grautityDetailId':this.gratuatyDetails.grautityDetailId
    })

  }

  // get familyMembers(): FormArray {
  //   return this.rvnlDetailsForm.get('familyMembers') as FormArray;
  // }

  addFamilyMembers(members:any[]) {




     this.familyMembersFormArray = this.rvnlDetailsForm.get('familyMembers') as FormArray;
   for (let i = this.t.length; i < members.length; i++) {
     this.familyMembersFormArray.push(
      this.formbuilder.group({
        familymemberDetailId: [members[i].familymemberDetailId],
        familymemberName: [members[i].familymemberName],
      familymemberMotherName: [members[i].familymemberMotherName],
      familymemberNationality: [members[i].familymemberNationality],
      familymemberGender: [members[i].familymemberGender],
      familymemberMaritalStatus: [members[i].familymemberMaritalStatus],
      familymemberPercentageOfDisability: [members[i].familymemberPercentageOfDisability],
      familymembereMployedUnEmployed:[members[i].familymembereMployedUnEmployed],
      familymemberBankDetails:[members[i].familymemberBankDetails],
      familymemberTypeOfDisability:[members[i].familymemberTypeOfDisability],
      familymemberIdentificationMark:[members[i].familymemberIdentificationMark],
      familymemberAadhaarNo:[members[i].familymemberAadhaarNo],
      familymemberBloodGroup:[members[i].familymemberBloodGroup],
      familymemberDob:[members[i].familymemberDob],
      familymemberJanaadharNo:[members[i].familymemberJanaadharNo],
      familymemberIsDisabled:[members[i].familymemberIsDisabled],
      familymemberRelationship:[members[i].familymemberRelationship],
  }));

}


   console.log("familyMembersFormArray==>>",this.familyMembersFormArray);


    members.forEach(member => {

      console.log("member==>>",member);

     // console.log(member,"new memberrrrrrrrrrrrrrrrrrrrrrrrrrrr")

      // this.rvnlDetailsForm.patchValue({
      //   'familymemberName':[member?.familymemberName || '']
      // })

      // const memberFormGroup = this.createFamilyMemberFormGroup(member);
      // console.log("member form group is here : ",memberFormGroup.value)
      // this.familyMembersFormArray.push(memberFormGroup);
    });


    //console.log("array =---->",this.familyMembersFormArray.controls);

    // console.log("family member Details ======> " ,familyMemberDtls)
    //  let i=0;
    // this.familyDetails.forEach((item:any) =>
    //   {
    //     debugger;
    //     let familymemberName='familymemberName_'+i;
    //     this.rvnlDetailsForm.patchValue({
    //       familymemberName:item.familyMemberName,
    //     })
    //     i++;
    //   }
    // )
    // this.familyMembers.push(
    //   this.formbuilder.group({
    //     recoveryType: new FormControl(this.recoveryFormNew.value.recoveryType),
    //     recoveryAmount: new FormControl(this.recoveryFormNew.value.recoveryAmount),
    //     recoveryHead: new FormControl(this.recoveryFormNew.value.recoveryHead)
    //   })
    // this.familyDetails.forEach((fieldname:any)=>{
    //   console.log("this.familyDetail", fieldname);
    //   formControls[fieldname.familymemberName] = ['']
    // })
    // console.log("this.formControlsformControls", formControls);
    // this.rvnlDetailsForm = this.formbuilder.group(formControls);
    // console.log('Family Details :+++++++++++++++', this.rvnlDetailsForm);

    //console.log("familyMembersFormArray",this.familyMembersFormArray);
  }







  createFamilyMemberFormGroup(memberData: any): FormGroup {




    return this.formbuilder.group({

      familymemberAadhaarNo:this.handleBlankValue(memberData.familymemberAadhaarNo),
      familymemberBankDetails:this.handleBlankValue(memberData.familymemberBankDetails),
      familymemberBloodGroup:this.handleBlankValue(memberData.familymemberBloodGroup),
      familymemberDetailId:this.handleBlankValue(memberData.familymemberDetailId),
      familymemberDob:this.handleBlankValue(memberData.familymemberDob),
      familymemberGender:this.handleBlankValue(memberData.familymemberGender),

      familymemberIdentificationMark:this.handleBlankValue(memberData.familymemberIdentificationMark),

      familymemberIsDisabled:this.handleBlankValue(memberData.familymemberIsDisabled),


      familymemberJanaadharNo: this.handleBlankValue(memberData.familymemberJanaadharNo),

      familymemberMaritalStatus: this.handleBlankValue(memberData.familymemberMaritalStatus),

      familymemberMotherName: this.handleBlankValue(memberData.familymemberMotherName),
      familymemberName: this.handleBlankValue(memberData.familymemberName),
      familymemberNationality:this.handleBlankValue(memberData.familymemberNationality),
      familymemberPercentageOfDisability:this.handleBlankValue(memberData.familymemberNationality),
      familymemberRelationship:this.handleBlankValue(memberData.familymemberNationality),
      familymemberTypeOfDisability:this.handleBlankValue(memberData.familymemberNationality),
      familymembereMployedUnEmployed:this.handleBlankValue(memberData.familymemberNationality)
    })
  }



  handleBlankValue(value: any): any {
    return value || 'Na';
  }
  calculatePercentage(percentage: any) {
    if (!percentage) {
      return 'N/A'; // or any default value you prefer
    }

    const [numerator, denominator] = percentage.split('/');

    if (numerator && denominator) {
      const percentageValue =
        (parseFloat(numerator) / parseFloat(denominator)) * 100;
      return percentageValue.toFixed(2) + '%';
    } else {
      return 'N/A'; // Handle invalid input
    }
  }

  openDialog(field: any) {
    const updatePopup = this.dialog.open(FamilyDetailsPopupComponent, {
      height: 'auto',
      width: 'calc(100% - 40%)',

      panelClass: 'full-screen-modal',
      autoFocus: false,
      data: {
        parentPage: field,
      },
    });
  }
  // updatePopup.afterClosed().subscribe(result => {
  //   //console.log(result.data.value.memberName);
  //   // console.log("Data After Stringify : " + JSON.stringify(result.data.value));
  //   if (result) {
  //     // console.log("User wants Update than,if block redirect(family-nominee.component.ts) : " + JSON.stringify(result.data.value));
  //     this.familyDetails.nameEn = result.data.value.memberName;
  //     //console.log("Family Details name " + this.familyDetails.nameEn);

  //     let data = {
  //       "employeeCode": this.employeeCode,
  //       "familyMemId": 2,
  //       "relationshipId": 5,
  //       "nameEn": this.familyDetails.nameEn
  //     }

  //     this._Service.postRequestAddress(data, 'updateFamilyDetails').subscribe({
  //       next: (response) => {
  //         if (response.status = 200) {
  //           this.getFamilyDetails();
  //         }
  //       },
  //       error: (err) => {
  //         let errorObj = {
  //           message: err.message,
  //           err: err,
  //           response: err
  //         }
  //       }

  //     });

  //   }

  // });

  // ****************************SERVICE DETAIL****************************************
  dateValue: any;
  fetchServicesdetail() {
    let data = {
      employeeId: this.employeeId,
    };
    this._Service
      .postRequestpension(data, 'getServicedetailsByEmpCode')
      .subscribe({
        next: (res) => {
          if ((res.status = 200)) {
            this.ServiceDetails = res.data;
            this.getBudgetDetails(this.ServiceDetails);
            this.ServiceDetails = JSON.parse(
              JSON.stringify(this.ServiceDetails).replace(/\:null/gi, ':""')
            );
            console.log('ServiceDetails', this.ServiceDetails);

            if (this.ServiceDetails.optForCommutation == 'Yes') {
              this.isCommutation = true;
            } else if (this.ServiceDetails.optForCommutation == 'No') {
              this.isCommutation = false;
            }

            console.log('date of joining', this.dateofJoinging);
            this.setDate();
            this.dateofJoinging = this.DOJ;
            setTimeout(() => {
              // <<<---using ()=> syntax
              let date1 = new Date(this.commucationDate);
              this.commutationDateCalculation3(date1);
            }, 500);
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
  removeFile1(i: any, data: any) {
    this.advancedLoan.splice(i, 1);

    const control = <FormArray>this.registrationForm?.get('addDeduction');
    if (data.loanTypeId == '1') {
      //HBA
      let data1 = this.addDeduction.value;
      console.log(data1);
      data1.filter((x: any, i: any) => {
        if (
          x.deductionType == 227 &&
          x.deductionAmount == data.netPrinciple &&
          !this.isRemoveDe[i]
        ) {
          control.removeAt(i);
          this.isRemoveDe.splice(i, 1);
        }
      });
      data1 = this.addDeduction.value;
      console.log(data1);
      data1.filter((x: any, i: any) => {
        if (
          x.deductionType == 231 &&
          x.deductionAmount == data.interest &&
          !this.isRemoveDe[i]
        ) {
          control.removeAt(i);
          this.isRemoveDe.splice(i, 1);
        }
      });
    } else if (data.loanTypeId == '2')
      //MCA
      var data1 = this.addDeduction.value;
    console.log(data1);

    data1.filter((x: any, i: any) => {
      if (
        x.deductionType == 223 &&
        x.deductionAmount == data.netPrinciple &&
        !this.isRemoveDe[i]
      ) {
        control.removeAt(i);
        this.isRemoveDe.splice(i, 1);
      }
    });
    data1 = this.addDeduction.value;
    console.log(data1);
    data1.filter((x: any, i: any) => {
      if (
        x.deductionType == 224 &&
        x.deductionAmount == data.interest &&
        !this.isRemoveDe[i]
      ) {
        control.removeAt(i);
        this.isRemoveDe.splice(i, 1);
      }
    });
  }
  // ****************************ADDRESS DETAIL****************************************
  iconCA: any;
  iconPA: any;
  iconOA: any;
  EMPAddress: any;
  EMP_doc: any;
  // fetchAddressesEmp() {

  //   this.residenceArray = [];
  //   this.officeArray = [];
  //   this.DepartmentAddress = [];
  //   let data = {
  //     employeeId: this.employeeId
  //   };
  //   this._Service.postRequestpension(data, 'getAddressDetailsByEmployeeId').subscribe({
  //     next: (res) => {

  //       this.EMPAddress = res.data;
  //       this.EMPAddress = JSON.parse(JSON.stringify(this.EMPAddress).replace(/\:null/gi, "\:\"\""));
  //       let product: any;
  //       this.residenceAddress = res.data.employeeAddresses;
  //       this.officeArray = res.data.officeAddresses;
  //       this.iconOA = 'apartment'
  //       for (product of this.residenceAddress) {
  //         if (product.commType == 'C') {
  //           this.residenceArray.push(product);
  //           console.log("Residencal array ", this.residenceArray)
  //           this.iconCA = 'person_pin_circle'
  //         }
  //         else if (product.commType == 'P') {
  //           this.DepartmentAddress.push(product);
  //           this.iconPA = 'account_box';
  //         }
  //       }
  //     },
  //     error: (err) => {

  //       this.error = err;
  //       // this._snackBar.open('Error occurred :- ', this.error, {
  //       //   horizontalPosition: 'center',
  //       //   verticalPosition: 'top',
  //       // });
  //       //   this.showerror=true;setD
  //       //  alert(this.error)
  //     },
  //   });
  // }

  //#endregion PROFILE
  DOAPP: any;
  DOJRS: any;
  DOPD: any;
  DOJPD: any;
  DOJ: any;
  setDate() {
    let data: any[] = this.ServiceDetails.dateTypes;
    for (let i = 0; i < data.length; i++) {
      if (data[i].acronym == 'DOJRS') {
        this.DOJRS = data[i].dateFormatted;
      }
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].acronym == 'DOPD') {
        this.DOPD = data[i].dateFormatted;
      }
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].acronym == 'DOJPD') {
        this.DOJPD = data[i].dateFormatted;
      }
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].acronym == 'DOJ') {
        console.log('Date', data);
        this.DOJ = data[i].dateFormatted;
      }
    }
  }
  dateTrans(da: any) {
    // const datePipe = new DatePipe('en-US');

    if (da) return this.date.transform(da, 'dd-MM-yyyy');
    else return 'N/A';
  }

  //#region FAMILY DETAILS AND NOMINATION

  // getFamilyDetails() {

  //   console.log("Family Details : " , this.pensionDetails);

  // let data = {
  //   "employeeId": this.employeeId
  // }

  // this._Service.postRequestpension(data, 'getFamilyDetailsByEmployeeId').subscribe({
  //   next: (response) => {
  //     if (response.status = 200) {
  //       this.familyDetails = response.data;
  //       this.familyDetails = JSON.parse(JSON.stringify(this.familyDetails).replace(/\:null/gi, "\:\"\""));
  //     }
  //   },
  //   error: (err) => {
  //     let errorObj = {
  //       message: err.message,
  //       err: err,
  //       response: err
  //     }
  //   }

  // });
  // }

  gratuity_Arr: any[] = [];
  commutation_Arr: any[] = [];
  arrear_Arr: any[] = [];

  getNomination() {
    let data = {
      employeeId: this.employeeId,
    };
    this._Service
      .postRequestpension(data, 'getSchemeNomineeDetails')
      .subscribe({
        next: (response) => {
          if ((response.status = 200)) {
            this.nominee = response.data;
            this.nominee = JSON.parse(
              JSON.stringify(this.nominee).replace(/\:null/gi, ':""')
            );
            let product: any;
            for (product of this.nominee) {
              if (product.schemeName == 'Commutation') {
                this.commutation_Arr.push(product);
                this.iconCA = 'person_pin_circle';
              } else if (product.schemeName == 'Arrears') {
                this.arrear_Arr.push(product);
              } else if (product.schemeName == 'Gratuity') {
                this.gratuity_Arr.push(product);
              }
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
  getPension_Commutation() {
    let data = {
      employeeCode: this.employeeCode,
      withheldAmount: 0,
      deductionAmount: 0,
      recoveryAmount: 0,
      allowanceAmount: 0,
      qualifyingService:
        this.serviceRecord_arry[0]?.qualifyingService_p === undefined
          ? null
          : this.serviceRecord_arry[0]?.qualifyingService_p,
      nonQualifyingService:
        this.serviceRecord_arry[0]?.nonQualifyingServiceDate_p === undefined
          ? null
          : this.serviceRecord_arry[0]?.nonQualifyingServiceDate_p,
    };

    this._Service
      .postRequestpension(data, 'getPensionDetailsByEmployeeCode')
      .subscribe({
        next: (response) => {
          if (response) {
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
  // openDialog(field: any) {
  //   const updatePopup = this.dialog.open(FamilyDetailsPopupComponent, {

  //     height: "auto",
  //     width: "calc(100% - 40%)",

  //     panelClass: 'full-screen-modal'
  //     , autoFocus: false,
  //     data: {
  //       parentPage: field
  //     }
  //   });

  //   updatePopup.afterClosed().subscribe(result => {
  //     //console.log(result.data.value.memberName);
  //     // console.log("Data After Stringify : " + JSON.stringify(result.data.value));
  //     if (result) {
  //       // console.log("User wants Update than,if block redirect(family-nominee.component.ts) : " + JSON.stringify(result.data.value));
  //       this.familyDetails.nameEn = result.data.value.memberName;
  //       //console.log("Family Details name " + this.familyDetails.nameEn);

  //       let data = {
  //         "employeeCode": this.employeeCode,
  //         "familyMemId": 2,
  //         "relationshipId": 5,
  //         "nameEn": this.familyDetails.nameEn
  //       }

  //       this._Service.postRequestAddress(data, 'updateFamilyDetails').subscribe({
  //         next: (response) => {
  //           if (response.status = 200) {
  //             this.getFamilyDetails();
  //           }
  //         },
  //         error: (err) => {
  //           let errorObj = {
  //             message: err.message,
  //             err: err,
  //             response: err
  //           }
  //         }

  //       });

  //     }

  //   });

  // }

  //#endregion FAMILY DETAILS AND NOMINATION
  serviceRecord: any;
  de: any;
  file: any;
  fileName: any;
  datarecord: any;
  show1: string = 'A';
  destatus: boolean = false;

  onChange(event: any) {
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
        this.documentlist.push(data);
        alert('Document uploaded successfully');
      });
  }

  removeFile() {
    this.file = null;
    this.fileName = '';
  }

  // ********************Martial_Status
  file1: any;
  MartialStatus: any;

  isMdown: boolean = false;
  UploadMartialStatus(event: any) {
    let time1 = new Date();

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
      time1.getHours() +
      time1.getMilliseconds().toString() +
      '.' +
      ex2[1];
    this.fileName = this.fileName.replace(' ', '');
    const employeeId = this.employeeId;
    const docTypeId = '23';
    const reader = new FileReader();
    var data4: any;
    reader.onloadend = () => {
      //console.log(reader.result);
      // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      data4 = reader.result;
      let data5 = data4.toString();
      data5 = data5.replace('data:application/pdf;base64,', '');
      //console.log(data4);
      //console.log(data4);
      let data = {
        type: 'pension',
        sourceId: 2,
        docAttributes: [],
        data: [
          {
            docTypeId: docTypeId,
            docTypeName: 'Marriage_certificate',
            docName: this.fileName,
            docTitle: 'Certificate',
            content: data5,
          },
        ],
      };
      this._Service.postOr('wcc/uploaddocs', data).subscribe((res: any) => {
        // console.log("res", res);

        let rajIndex = 0;
        this.documentlist.filter((data: any, index: number) => {
          if (data.docName == 'Marriage Certificate') {
            rajIndex = index;
            return data;
          }
        });
        if (res.data.document[0].docId)
          this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;

        console.log('documentlist', this.documentlist);
        this.isMdown = true;
      });
    };
    reader.readAsDataURL(this.file);

    // this.updateProgress();
  }
  removeMartial_Status() {
    this.file1 = null;
    this.MartialStatus = '';
  }

  // ********************Disabled
  file2: any;
  Disabledfile: any;

  onChangeDisabled(event: any) {
    this.file2 = event.target.files[0];
    const employeeId = this.employeeId;
    const docTypeId = '24';

    this._Service.saveDocument(this.file2, employeeId, docTypeId).subscribe({
      next: (result: any) => {
        if (result.data) {
          let data = {
            docTypeId: docTypeId,
            documentId: result.data.dmsDocumentId,
            docName: result.data.uploadStatusMessage,
          };
          this.document_list.push(data);
          console.log(this.document_list);

          if (this.document_list.length > 0) {
            this.Disabledfile = 'Download Certificate';
          }

          alert('Document uploaded successfully');
        } else {
          alert('Some Error Occured');
        }
      },
      error: (err: any) => {
        alert(err.error.error.description);
      },
    });
  }

  removeDisabled() {
    this.file2 = null;
    this.Disabledfile = '';
  }
  // ********************Disabled
  file3: any;
  Retirementfile: any;
  isRe: boolean = false;
  onRetirement(event: any) {
    let time1 = new Date();

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
      time1.getHours() +
      time1.getMilliseconds().toString() +
      '.' +
      ex2[1];
    this.fileName = this.fileName.replace(' ', '');
    const employeeId = this.employeeId;
    const docTypeId = '15';
    const reader = new FileReader();
    var data4: any;
    reader.onloadend = () => {
      console.log(reader.result);
      // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      data4 = reader.result;
      let data5 = data4.toString();
      data5 = data5.replace('data:application/pdf;base64,', '');
      console.log(data4);
      console.log(data4);
      let data = {
        type: 'pension',
        sourceId: 2,
        docAttributes: [],
        data: [
          {
            docTypeId: docTypeId,
            docTypeName: 'Retire_Order_Sanction',
            docName: this.fileName,
            docTitle: 'Certificate',
            content: data5,
          },
        ],
      };
      this._Service.postOr('wcc/uploaddocs', data).subscribe((res: any) => {
        console.log('res', res);

        let rajIndex = 0;
        this.documentlist.filter((data: any, index: number) => {
          if (data.docName == 'Retirement Order Sanction') {
            rajIndex = index;
            return data;
          }
        });
        if (res.data.document[0].docId) {
          this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
          // this.documentlist[rajIndex]['newDocName']=this.fileName;
          console.log('documentlist', this.documentlist);
          alert('Document Upload Successfully.');
          this.isRe = true;
        } else {
          alert('Some Error Occured');
        }
      });
    };
    reader.readAsDataURL(this.file);

    this.updateProgress();
  }
  isDe: boolean = false;
  noDECertificate(event: any) {
    let time1 = new Date();

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
      time1.getHours() +
      time1.getMilliseconds().toString() +
      '.' +
      ex2[1];
    this.fileName = this.fileName.replace(' ', '');
    const employeeId = this.employeeId;
    const docTypeId = '17';
    const reader = new FileReader();
    var data4: any;
    reader.onloadend = () => {
      console.log(reader.result);
      // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      data4 = reader.result;
      let data5 = data4.toString();
      data5 = data5.replace('data:application/pdf;base64,', '');
      console.log(data4);
      console.log(data4);
      let data = {
        type: 'pension',
        sourceId: 2,
        docAttributes: [],
        data: [
          {
            docTypeId: docTypeId,
            docTypeName: 'Retire_Order_Sanction',
            docName: this.fileName,
            docTitle: 'Certificate',
            content: data5,
          },
        ],
      };
      this._Service.postOr('wcc/uploaddocs', data).subscribe((res: any) => {
        console.log('res', res);

        let rajIndex = 0;
        this.documentlist.filter((data: any, index: number) => {
          if (data.docName == 'No DE Certificate') {
            rajIndex = index;
            return data;
          }
        });
        if (res.data.document[0].docId) {
          this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
          // this.documentlist[rajIndex]['newDocName']=this.fileName;
          console.log('documentlist', this.documentlist);
          alert('Document Upload Successfully.');
          this.isDe = true;
        } else {
          alert('Some Error Occured');
        }
      });
    };
    reader.readAsDataURL(this.file);

    this.updateProgress();
  }
  removeRetirement() {
    this.file3 = null;
    this.Retirementfile = '';
  }
  // ********************Disabled
  file4: any;
  Chequefile: any;
  ischq: boolean = false;
  onChangeCheque(event: any) {
    let time1 = new Date();

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
      time1.getHours() +
      time1.getMilliseconds().toString() +
      '.' +
      ex2[1];

    const employeeId = this.employeeId;
    const docTypeId = '18';
    const reader = new FileReader();
    var data4: any;
    reader.onloadend = () => {
      console.log(reader.result);
      // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      data4 = reader.result;
      let data5 = data4.toString();
      data5 = data5.replace('data:application/pdf;base64,', '');
      console.log(data4);
      console.log(data4);
      let data = {
        type: 'pension',
        sourceId: 2,
        docAttributes: [],
        data: [
          {
            docTypeId: docTypeId,
            docTypeName: 'bankDoc',
            docName: this.fileName,
            docTitle: 'Certificate',
            content: data5,
          },
        ],
      };
      console.log('data', data);

      this._Service.postOr('wcc/uploaddocs', data).subscribe((res: any) => {
        console.log('res', res);
        let data = {
          docTypeId: docTypeId,
          documentId: res.data.document[0].docId,
          docName: this.fileName,
        };
        let rajIndex = 0;
        this.documentlist.filter((data: any, index: number) => {
          if (data.docName == 'Bank Passbook First Page/Cancelled Cheque') {
            rajIndex = index;
            return data;
          }
        });
        if (res.data.document[0].docId) {
          this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
          //this.documentlist[rajIndex]['newDocName']=this.fileName;
          console.log('document_list', this.documentlist);
          alert('Document Upload Succesfully.');
          this.ischq = true;
        } else {
          alert('Some Error Occured.');
        }
      });
    };
    reader.readAsDataURL(this.file);

    this.updateProgress();
  }

  removeCheque() {
    this.file3 = null;
    this.Chequefile = '';
  }
  //Commutation Date Calculation here call this service -- callPensionCalculationRuleEngine
  commutationDateCalculation(date: any) {
    let date1 = this.date.transform(date, 'dd-MM-yyyy');
    let formData = this.registrationForm.value;
    let totalRecovery: any = 0;
    for (let t of formData?.addDynamicElement) {
      totalRecovery = totalRecovery + Number(t.recoveryAmount);
    }

    let totalAllowance: any = 0;
    for (let t of formData?.addAllowanceType) {
      totalAllowance = totalAllowance + Number(t.allowanceAmount);
    }

    let totalDeduction: any = 0;
    for (let t of formData?.addDeduction) {
      totalDeduction = totalDeduction + Number(t.deductionAmount);
    }

    let totalwithheld: any = 0;

    for (let t of formData?.addWithHeld) {
      totalwithheld = totalwithheld + Number(t.withHeldAmount);
    }

    let data = {
      employeeCode: this.Personaldetail.employeeCode,
      pensionTypeId: 1,
      withheldAmount: totalwithheld,
      deductionAmount: [
        {
          dedAmount: totalDeduction,
        },
      ],
      recoveryAmount: [
        {
          recAmount: totalRecovery,
        },
      ],
      allowanceAmount: totalAllowance,
      dateOfVCD: '',
      cpoEfDate: date1,
      isPaperLess: 0,
      cpoValue: this.ServiceDetails.commuationPercentage.toString(),
      deFlag:
        this.serviceRecordDatanew.deStatus != ''
          ? this.serviceRecordDatanew.deStatus
          : '0',
      deType:
        this.serviceRecordDatanew.deStatus != ''
          ? this.serviceRecordDatanew.deType.toString()
          : '',
      qualifyingService: this.calQualifying,
      nonQualifyingService: this.calNonQualifying,
      isPayCommission: this.Calculations_Pay_Details?.payCommissionNameEn
        ? this.Calculations_Pay_Details.payCommissionNameEn
        : '',
      isMilitary: this.isMilitry,
    };

    console.log('date', this.Pension_Commutation);
    console.log('data', data);
    var ser_data: any[] = [];
    this._Service
      .postRequestpension(data, 'callPensionCalculationRuleEngine')
      .subscribe({
        next: (res) => {
          if ((res.status = 200)) {
            console.log('res', res);
            ser_data.push(res.data);
            console.log('res', ser_data);

            this.Pension_Commutation = res.data;
          }
        },
        error: (err) => {
          // let errorObj = {
          //   message: err.message,
          //   err: err,
          //   response: err,
          // };
        },
      });
    this.Calculations_Commutation_Details.effectiveDate = date1;
  }
  commutationDateCalculation3(date: any) {
    let date1 = this.date.transform(date, 'dd-MM-yyyy');

    let data = {
      employeeCode: this.Personaldetail.employeeCode,
      pensionTypeId: 1,
      withheldAmount: 0,
      deductionAmount: [
        {
          dedAmount: 0,
        },
      ],
      recoveryAmount: [
        {
          recAmount: 0,
        },
      ],
      allowanceAmount: 0,
      dateOfVCD: '',
      cpoEfDate: date1,
      isPaperLess: 0,
      cpoValue: this.ServiceDetails.commuationPercentage.toString(),
      deFlag:
        this.serviceRecordDatanew.deStatus != ''
          ? this.serviceRecordDatanew.deStatus
          : '0',
      deType:
        this.serviceRecordDatanew.deStatus != ''
          ? this.serviceRecordDatanew.deType.toString()
          : '',
      qualifyingService: this.calQualifying,
      nonQualifyingService: this.calNonQualifying,
      isPayCommission: this.Calculations_Pay_Details?.payCommissionNameEn
        ? this.Calculations_Pay_Details.payCommissionNameEn
        : '',
      isMilitary: this.isMilitry,
    };

    console.log('date', this.Pension_Commutation);
    console.log('data', data);
    var ser_data: any[] = [];
    this._Service
      .postRequestpension(data, 'callPensionCalculationRuleEngine')
      .subscribe({
        next: (res) => {
          if ((res.status = 200)) {
            console.log('res', res);
            ser_data.push(res.data);
            console.log('res', ser_data);

            this.Pension_Commutation = res.data;
          }
        },
        error: (err) => {
          // let errorObj = {
          //   message: err.message,
          //   err: err,
          //   response: err,
          // };
        },
      });
    this.Calculations_Commutation_Details.effectiveDate = date1;
  }
  //Commutation Pension here call this service
  caculationPension() {
    if (this.isCommutation) {
      //alert(this.dateofRetirement)
      let dates = new Date(this.dateofRetirement);
      dates.setDate(dates.getDate() + 1);
      this.commutationDateCalculation(dates);
    } else {
      let dates = '';
      this.commutationDateCalculation(dates);
    }
  }
  pensionDetails: any;
  // commutationDateCalculation2() {
  //   let data = {
  //     "employeeCode": this.Personaldetail.employeeCode,
  //     "pensionTypeId": 1,
  //     "withheldAmount": 0,
  //     "deductionAmount": [
  //     ],
  //     "recoveryAmount": [
  //     ],
  //     "allowanceAmount": 0,
  //     "dateOfVCD": "",
  //     "cpoEfDate": "",
  //     "cpoValue": 0,
  //     "isPaperLess": 0,
  //     "deFlag": 0,
  //     "deType": "",
  //     "qualifyingService": [
  //     ],
  //     "nonQualifyingService": [
  //     ]
  //   }
  //   console.log("data", data);
  //   var ser_data: any[] = [];
  //   this._Service.postRequestpension(data, 'callPensionCalculationRuleEngine').subscribe({
  //     next: (res) => {
  //       if ((res.status = 200)) {
  //         this.Pension_Commutation = res.data
  //         console.log("res", this.pensionDetails)

  //       }
  //     },
  //     error: (err) => {
  //       // let errorObj = {
  //       //   message: err.message,
  //       //   err: err,
  //       //   response: err,
  //       // };
  //     },
  //   });

  // }

  value() {
    console.log(
      'Commutation value is here>>>',
      this.ServiceDetails.optForCommutation
    );
    if (this.ServiceDetails.optForCommutation == 'Yes') {
      this.isCommutation = true;
      let dates = new Date(this.dateofRetirement);
      console.log('dates', dates);

      dates.setDate(dates.getDate() + 1);
      console.log('dates', dates);
      this.commutationDetails.patchValue({ effectiveDate: dates });
      if (this.ServiceDetails.serviceCatId === 1) {
        this.ServiceDetails.commuationPercentage = 40;
      } else if (
        this.ServiceDetails.serviceCatId === 13 ||
        (this.ServiceDetails.serviceCatId === 7 &&
          this.ServiceDetails.serviceSubcatId === 108)
      ) {
        this.ServiceDetails.commuationPercentage = 50;
      } else {
        this.ServiceDetails.commuationPercentage = 33.33;
      }

      this.commutationDateCalculation(dates);
    } else if (this.ServiceDetails.optForCommutation == 'No') {
      this.isCommutation = false;
      this.ServiceDetails.commuationPercentage = '0';
      let dates = '';
      this.commutationDateCalculation(dates);
    }
  }
  pension_calculation(data1: any) {
    console.log(this.ServiceDetails.commuationPercentage);
    //alert(this.ServiceDetails.commuationPercentage)
    console.log('date', this.Pension_Commutation);
    let data = {
      employeeCode: this.Personaldetail.employeeCode,
      pensionTypeId: 1,
      withheldAmount: 0,
      deductionAmount: [],
      recoveryAmount: [],
      allowanceAmount: 0,
      dateOfVCD: '',
      cpoEfDate: '',
      cpoValue: 0,
      isPaperLess: 0,
      deFlag: data1.deStatus ? data1.deStatus : 0,
      deType: data1.deType ? data1.deType : '',
      qualifyingService: [],
      nonQualifyingService: [],
    };
    console.log('data', data);
    var ser_data: any[] = [];
    this._Service
      .postRequestpension(data, 'callPensionCalculationRuleEngine')
      .subscribe({
        next: (res) => {
          if ((res.status = 200)) {
            console.log('res', res);
            ser_data.push(res.data);
            console.log('res', ser_data);

            // this.Pension_Commutation["commutationAmount"]=ser_data[0].commutationAmount.toFixed(0)
            // this.Pension_Commutation["commutedFactor"]=ser_data[0].commutedFactor
            // this.Pension_Commutation.pensionCommuted=ser_data[0].commutationValue
            this.Calculations_Pay_Details.gratuityB = ser_data[0].retirGratuity;
            this.Pension_Commutation.gratuityAmount = ser_data[0].netPay;
          }
        },
        error: (err) => {
          // let errorObj = {
          //   message: err.message,
          //   err: err,
          //   response: err,
          // };
        },
      });
  }

  familyDetails: any;
  nominee: any;

  condition1Amount: any = 0;

  fetchpersonalEmp() {
    let data = {
      employeeId: this.employeeId,
    };
    this._Service.postRequestpension(data, 'getEmployeePayDetails').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.Calculations_Pay_Details = res.data;
          this.Calculations_Pay_Details = JSON.parse(
            JSON.stringify(this.Calculations_Pay_Details).replace(
              /\:null/gi,
              ':""'
            )
          );
          this.condition1Amount =
            Number(this.Calculations_Pay_Details.basicPay) +
            Number(this.Calculations_Pay_Details.npaOrNca) +
            Number(this.Calculations_Pay_Details.specialPay);
          console.log('  this.condition1Amount', this.condition1Amount);
          // this.conditionForm.patchValue({ condition_1_Amount: this.condition1Amount });
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

  open(item: any) {
    console.log(item);
    if (this.userDetails.roleid != '1' && this.Summary.value.is_agree == true) {
      this.modalService.open(item);
      // this.get_Task_Detail();
      this.Remark();
    } else if (this.userDetails.roleid == '1') {
      this.modalService.open(item);
      // this.get_Task_Detail();
      this.Remark();
    } else {
      if (this.userDetails.roleid !== '1') {
        alert('Please confirm that all details viewed are correct.');
      }
    }
  }
  addObjRemark(i: any, value: any) {
    this.ObjectionArray[i].remark = value;
  }
  ObjectionArray: any[] = [];
  addObj() {
    this._Service.getCurrentDate();

    if (
      this.Objectionform.value.ObjectionText == '' ||
      this.Objectionform.value.ObjectionText == null
    ) {
      return;
    } else {
      setTimeout(() => {
        // <<<---using ()=> syntax
        if (this.Objectionform.valid) {
          let data = {
            roleName: this.userDetails.role,
            Objection: this.Objectionform.value.ObjectionText,
            CreatedAt: moment(this._Service?.currentDate).format('DD-MM-YYYY'),
            rejected: false,
            rejectedDate: '',
            roleId: this.userDetails.roleid,
            remark: '',
          };
          console.log(this.ObjectionArray);
          this.ObjectionArray.push(data);
          this.Objectionform.reset();
        } else {
          alert('Fill all fields properly.');
        }
        console.log(this.ObjectionArray);
      }, 500);
    }
  }
  finalSubmit(item: any, stepper: MatStepper) {
    let accountCerDocId = this.documentlist.filter(
      (x: any) => x.docName == 'Accounts Personnel Certificate'
    )[0]?.dmsDocId;
    console.log(accountCerDocId);
    if (accountCerDocId == null && this.userDetails.roleid == '2') {
      alert('Please Upload Accounts Personnel Certificate');
      stepper.previous();
    } else {
      if (
        this.userDetails.roleid != '1' &&
        this.Summary.value.is_agree == true
      ) {
        this.modalService.open(item);
        // this.get_Task_Detail();
        this.Remark();
      } else if (this.userDetails.roleid == '1') {
        this.modalService.open(item);
        // this.get_Task_Detail();
        this.Remark();
      } else {
        alert('Please confirm that all details viewed are correct.');
      }
    }
  }

  makerProcessSubmit(item: any, stepper: MatStepper) {
    let deValue = this.conditionForm.controls['condition_7'].value;
    let advanceLoanLength = this.advancedLoan.length;

    if (!this.conditionForm.value.condition_9) {
      alert("Please check 'Verify that all fields and conditions'");
    } else {
      this.modalService.open(item);
      // // this.get_Task_Detail();
      this.Remark();
    }
  }

  conditionCheck() {
    if (this.conditionForm.value.condition_9) {
      if (!this.conditionForm.value.condition_1_Date) {
        alert('Please fill all fields values of conditions.');
        this.conditionForm.patchValue({ condition_9: false });
        return;
      } else if (!this.conditionForm.value.condition_1_Amount) {
        alert('Please fill all fields values of conditions.');
        this.conditionForm.patchValue({ condition_9: false });
        return;
      } else if (!this.conditionForm.value.condition_1_Date1) {
        alert('Please fill all fields values of conditions.');
        this.conditionForm.patchValue({ condition_9: false });
        return;
      } else {
        this.conditionForm.patchValue({
          condition_1: true,
          condition_2: true,
          condition_3: true,
          condition_4: true,
          condition_5: true,
          condition_6: true,
          condition_7: true,
          condition_8: true,
          condition_9: true,
        });
      }
    }
  }
  //#region BANK/TREASURY DETAIL
  // Bank_Detail() {
  //   let data = {
  //     "employeeId": this.employeeId
  //   }
  //   this._Service.postRequestpension(data, "getBankdetailsByEmpCode").subscribe({
  //     next: (res) => {
  //       if (res.status = 200) {
  //         this.Banklist = res.data[0];
  //         this.Banklist = JSON.parse(JSON.stringify(this.Banklist).replace(/\:null/gi, "\:\"\""));
  //         // localStorage.setItem('bank-details', JSON.stringify(res.data[0]))
  //         this.config.storeDetails('bank-details', JSON.stringify(res.data[0]))
  //       }
  //     },
  //     error: (err) => {
  //       let errorObj = {
  //         message: err.message,
  //         err: err,
  //         response: err
  //       }

  //     }
  //   })
  // }
  //#endregion BANK/TREASURY DETAIL

  //#region DOCUMENTS UPLOADED
  documentlist: any[] = [];
  getAllUploadedDocumentDetailsByEmployeeCode() {
    let data = {
      subModuleId: 4,
      processId: 1,
      employeeId: this.employeeId,
    };
    this._Service
      .postRequestpension(data, 'getDocsDtlsBySubId')
      .subscribe((res) => {
        if ((res.status = 200)) {
          let rajIndex = 0;
          this.documentlist = res.data;
          this.docList = res.data;
          console.log('docList 0', this.docList);
          console.log('documentlist 0', this.documentlist);

          let data = {
            dmsDocId: null,
            docName: 'FR',
            docTypeId: 36,
          };
          this.documentlist.push(data);
          this.spliceit();
          for (let i = 0; i < this.documentlist.length; i++) {
            this.removeDoc[i] = false;
          }
          for (let i = 0; i < this.documentlist.length; i++) {
            if (this.documentlist[i].dmsDocId != null) {
              if (this.documentlist[i].docTypeId == '23') {
                this.isMdown = true;
              } else if (this.documentlist[i].docTypeId == '18') {
                this.ischq = true;
              } else if (this.documentlist[i].docTypeId == '15') {
                this.isRe = true;
              }
            }
          }
          // console.log("documentlist",res.data);
        }
      });
  }

  spliceit() {
    let newdocumentlist: any[] = [];

    console.log('docList 1', this.docList);
    console.log('documentlist 1');
    newdocumentlist = this.documentlist.filter(
      (item) => item.docName != 'No DE Certificate'
    );
    newdocumentlist = newdocumentlist.filter(
      (item) => item.docName != 'Marriage Certificate'
    );
    newdocumentlist = newdocumentlist.filter(
      (item) => item.docName != 'Pension Kit'
    );
    newdocumentlist = newdocumentlist.filter(
      (item) => item.docName != 'Bank Passbook First Page/Cancelled Cheque'
    );
    newdocumentlist = newdocumentlist.filter(
      (item) => item.docName != 'No Dues Certificate'
    );
    newdocumentlist = newdocumentlist.filter((item) => item.docName != 'FR');
    if (
      this.userDetails.roleid == 1 ||
      this.userDetails.roleid == 2 ||
      this.userDetails.roleid == 3
    ) {
      newdocumentlist = newdocumentlist.filter(
        (item) => item.docName != 'Pension Set'
      );
    }
    newdocumentlist = newdocumentlist.filter(
      (item) => item.docName != 'Signature'
    );
    newdocumentlist = newdocumentlist.filter(
      (item) => item.docName != 'Retirement Order Sanction'
    );

    this.docList = newdocumentlist;
    console.log('docList 2', this.docList);
    for (let i = 0; i < this.docList.length; i++) {
      if (this.docList[i].dmsDocId != null) {
        this.removeDoc[i] = true;
      }
    }
    if (this.Personaldetail?.disable == 'N') {
      newdocumentlist = newdocumentlist.filter(
        (item) => item.docName != 'Disability Certificate'
      );
    }
    if (this.Personaldetail?.disable == '0') {
      newdocumentlist = newdocumentlist.filter(
        (item) => item.docName != 'Disability Certificate'
      );
    }
  }

  index: any;
  findIndex(data: any[], key: any) {
    for (let i = 0; i <= data.length - 1; i++) {
      if (data[i].docName == key) {
        this.index = i;
      }
    }
    //  alert(this.index)
    return this.index;
  }
  previewFiles(item: any) {
    console.log(item);

    if (item.dmsDocId) {
      let data = {
        type: 'pension',
        sourceId: 2,
        docs: [
          {
            docId: item.dmsDocId,
          },
        ],
      };
      console.log('single report data', data);
      this._Service.postOr('wcc/getfiles', data).subscribe((res: any) => {
        console.log('res', res.data.document[0].content);
        if (res.data.document[0].content) {
          // let ex2:any[]=res.data.document[0].docName.split(".");
          let data = {
            base64Pdf: res.data.document[0].content,
            redirectUrl: 'pension/e-Pension/Profile',
            // "type":ex2[1]
          };
          console.log('data', data);

          this.dialog.open(PdfPreviewComponent, {
            width: '70%',
            data: { message: data },
            disableClose: false,
          });
        }
      });
    } else {
      alert('Preview Not Available');
    }
  }
  previewFiles2(cer: any) {
    console.log(cer);
    let data1: any[] = this.documentlist.filter((item) => item.docName == cer);

    console.log('data1', JSON.stringify(data1));
    if (data1[0].dmsDocId) {
      let data = {
        type: 'pension',
        sourceId: 2,
        docs: [
          {
            docId: data1[0].dmsDocId,
          },
        ],
      };
      console.log('single report data', data);
      this._Service.postOr('wcc/getfiles', data).subscribe((res: any) => {
        console.log('res', res.data.document[0].content);
        if (res.data.document[0].content) {
          let data = {
            base64Pdf: res.data.document[0].content,
            redirectUrl: 'pension/e-Pension/Profile',
          };
          console.log('data', data);

          this.dialog.open(PdfPreviewComponent, {
            width: '70%',
            data: { message: data },
            disableClose: false,
          });
        }
      });
    } else {
      alert('Preview Not Available');
    }
  }
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

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
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

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
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

  RetirementOrder1(event: any) {
    this.RetirementOrderList(event.target.files);
  }
  RetirementOrderList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.RetirementOrderfiles.push(item);
      this.Retirementshow = false;
    }
    this.RetirementuploadFilesSimulator(0);
  }
  Files_Delete(index: number) {
    this.RetirementOrderfiles.splice(index, 1);
    this.Retirementshow = true;
  }
  RetirementuploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.RetirementOrderfiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.RetirementOrderfiles[index].progress === 100) {
            clearInterval(progressInterval);
          } else {
            this.RetirementOrderfiles[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ************************************

  // ********************Strat Retirement Order***********************************

  GovtBrowseHandler(event: any) {
    this.GovtList(event.target.files);
  }
  GovtList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;

      this.Govt_files.push(item);
      this.Govt_show = false;
    }
    this.GovtuploadFilesSimulator(0);
  }
  Govt_Delete(index: number) {
    this.Govt_files.splice(index, 1);
    this.Govt_show = true;
  }
  GovtuploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.Govt_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.Govt_files[index].progress === 100) {
            clearInterval(progressInterval);
          } else {
            this.Govt_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ************************************

  // ********************Strat Retirement Order***********************************

  No_DE_Certificate(event: any) {
    this.No_DE_CertificateList(event.target.files);
  }
  No_DE_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.No_DE_files.push(item);
      this.No_DE_show = false;
    }
    this.No_DESimulator(0);
  }
  No_DE_Delete(index: number) {
    this.No_DE_files.splice(index, 1);
    this.No_DE_show = true;
  }
  No_DESimulator(index: number) {
    setTimeout(() => {
      if (index === this.No_DE_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.No_DE_files[index].progress === 100) {
            clearInterval(progressInterval);
          } else {
            this.No_DE_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************
  // ********************Strat Retirement Order***********************************

  Bank_Passbook(event: any) {
    this.Bank_CertificateList(event.target.files);
  }
  Bank_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.Bank_files.push(item);
      this.Bank_show = false;
    }
    this.Bank_Simulator(0);
  }
  Bank_PassbookDelete(index: number) {
    this.Bank_files.splice(index, 1);
    this.Bank_show = true;
  }
  Bank_Simulator(index: number) {
    setTimeout(() => {
      if (index === this.Bank_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.Bank_files[index].progress === 100) {
            clearInterval(progressInterval);
          } else {
            this.Bank_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************

  // ********************Strat Retirement Order***********************************

  NoDues_Certificate(event: any) {
    this.NoDues_CertificateList(event.target.files);
  }
  NoDues_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.No_DuesFile.push(item);
      this.NODue_show = false;
    }
    this.NoDues_Simulator(0);
  }
  NoDues_PassbookDelete(index: number) {
    this.No_DuesFile.splice(index, 1);
    this.NODue_show = true;
  }
  NoDues_Simulator(index: number) {
    setTimeout(() => {
      if (index === this.No_DuesFile.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.No_DuesFile[index].progress === 100) {
            clearInterval(progressInterval);
          } else {
            this.No_DuesFile[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************

  // ********************Strat Retirement Order***********************************

  Singleon(event: any, docTypeId: any) {
    this.Single_CertificateList(event.target.files);
    this.id = docTypeId;
    this.Single_files1.push(docTypeId);
    for (let p of this.Single_files) {
      if (p.docTypeId === docTypeId) {
        this.id = 15;
      }
    }
  }

  Single_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;

      this.Single_files.push(item);
    }
    this.Single_Simulator(0);
  }
  Single_Delete(index: number) {
    this.Single_files.splice(index, 1);
  }

  Single_Simulator(index: number) {
    setTimeout(() => {
      if (index === this.Single_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.Single_files[index].progress === 100) {
            clearInterval(progressInterval);
          } else {
            this.Single_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }

  // ********************END Retirement Order ***********************************

  // ********************Strat Retirement Order***********************************

  Singleon1(event: any, id: any) {
    this.id1 = id;
    this.idList = id + 2;
    this.Single_CertificateList1(event.target.files);
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
  Single_CertificateList1(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.Single_files1.push(item);
      this.Single_show = false;
    }
    // this.Single_Simulator1(0);
  }
  Single_Delete1(index: number) {
    this.Single_files1.splice(index, 1);
    this.Single_show = true;
    this.id1 = '';
  }
  Single_Simulator1(index: number) {
    setTimeout(() => {
      if (index === this.Single_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.Single_files[index].progress === 100) {
            clearInterval(progressInterval);
          } else {
            this.Single_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************
  // ********************Strat Retirement Order***********************************

  Government_files: any[] = [];
  Government_show: boolean = true;
  Gfile: any;
  Government_On(event: any) {
    this.Government_CertificateList(event.target.files);

    this.Gfile = event.target.files[0];
    const employeeId = this.employeeId;
    const docTypeId = '16';

    this._Service
      .saveDocument(this.Gfile, employeeId, docTypeId)
      .subscribe((result) => {
        let data = {
          docTypeId: docTypeId,
          documentId: result.data.dmsDocumentId,
          docName: result.data.uploadStatusMessage,
        };
        this.document_list.push(data);
        console.log(result);
        // alert("File uploaded successfully");

        // localStorage.setItem("doc_Id", result.data.dmsDocumentId);
        this.config.storeDetails('doc_Id', result.data.dmsDocumentId);
      });
    this.updateProgress();
  }
  Government_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.Government_files.push(item);
      this.Government_show = false;
    }
    // this.NSDL_Simulator(0);
  }
  Government_Delete(index: number) {
    this.Government_files.splice(index, 1);
    this.Government_show = true;
  }

  // ********************Strat Retirement Order***********************************

  CPF_files: any[] = [];
  CPF_show: boolean = true;
  fileCPF: any;

  CPF_On(event: any, item: any, i: any) {
    let time1 = new Date();

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
      time1.getHours() +
      time1.getMilliseconds().toString() +
      '.' +
      ex2[1];
    this.fileName = this.fileName.replace(' ', '');
    const employeeId = this.employeeId;
    const docTypeId = item.docTypeId;
    const reader = new FileReader();
    var data4: any;
    reader.onloadend = () => {
      console.log(reader.result);
      // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      data4 = reader.result;
      let data5 = data4.toString();
      data5 = data5.replace('data:application/pdf;base64,', '');
      console.log(data4);
      let data = {
        type: 'pension',
        sourceId: 2,
        docAttributes: [],
        data: [
          {
            docTypeId: docTypeId,
            docTypeName: item.docName,
            docName: this.fileName,
            docTitle: 'Certificate',
            content: data5,
          },
        ],
      };
      console.log('data', data);

      this._Service.postOr('wcc/uploaddocs', data).subscribe((res: any) => {
        console.log('res', res);
        let data = {
          docTypeId: docTypeId,
          documentId: res.data.document[0].docId,
          docName: this.fileName,
        };
        let rajIndex = 0;
        this.documentlist.filter((data: any, index: number) => {
          if (data.docName == item.docName) {
            rajIndex = index;
            return data;
          }
        });
        if (res.data.document[0].docId)
          this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
        this.removeDoc[i] = true;
        //this.documentlist[rajIndex]['newDocName']= this.fileName;

        console.log('document_list', this.documentlist);
        alert('Document Uploaded Successfully.');
      });
    };
    reader.readAsDataURL(this.file);

    this.updateProgress();
  }
  CPF_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.CPF_files.push(item);
      this.CPF_show = false;
    }
    // this.NSDL_Simulator(0);
  }
  CPF_Delete(index: number) {
    this.CPF_files.splice(index, 1);
    this.CPF_show = true;
  }

  // Dues_files: any[] = [];
  // Dues_show: boolean = true;
  // fileDues: any;
  // Dues_On(event: any) {
  //   let time1 = new Date();

  //   this.file = event.target.files[0];
  //   this.fileName = "NodueCer" + time1.getHours() + time1.getMilliseconds().toString();

  //   const reader = new FileReader();
  //   var data4: any;
  //   reader.onloadend = () => {
  //     console.log(reader.result);
  //     // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
  //     data4 = reader.result;
  //     let data5 = data4.toString()
  //     data5 = data5.replace("data:application/pdf;base64,", "")
  //     console.log(data4);
  //     console.log(data4);
  //     let data = {
  //       "type": "pension",
  //       "sourceId": 2,
  //       "docAttributes": [

  //       ],
  //       "data": [
  //         {
  //           "docTypeId": 19,
  //           "docTypeName": "No_due_Certificate",
  //           "docName": this.fileName,
  //           "docTitle": "Certificate",
  //           "content": data5
  //         }
  //       ]
  //     }
  //     this._Service.postOr("wcc/uploaddocs", data).subscribe((res: any) => {
  //       console.log("res", res);
  //       let data =
  //       {
  //         "docTypeId": 19,
  //         "documentId": res.data.document[0].docId,
  //         "docName": this.fileName,
  //       }
  //       this.newDocList.push(data);
  //       console.log("document_list", this.document_list);

  //     })
  //   };
  //   reader.readAsDataURL(this.file);
  //   this.Dues_CertificateList(event.target.files);
  //   this.fileDues = event.target.files[0];
  //   const employeeId = this.employeeId
  //   const docTypeId = "19"

  //   this._Service.saveDocument(this.fileDues, employeeId, docTypeId).subscribe(result => {

  //     let data =
  //     {
  //       "docTypeId": docTypeId,
  //       "documentId": result.data.dmsDocumentId,
  //       "docName": result.data.uploadStatusMessage,
  //     }
  //     this.document_list.push(data);
  //     // console.log(this.document_list);
  //     // alert("File uploaded successfully");
  //   });
  //   this.updateProgress3();
  // }
  // Dues_CertificateList(files: Array<any>) {
  //   for (const item of files) {
  //     item.progress = 0;
  //     this.Dues_files.push(item);
  //     this.Dues_show = false;
  //   }
  //   // this.NSDL_Simulator(0);
  // }
  // Dues_Delete(index: number) {
  //   this.Dues_files.splice(index, 1);
  //   this.Dues_show = true;
  // }

  // fileSig: any;
  // Signature_files: any[] = [];
  // Signature_show: boolean = true;
  // Signature_On(event: any) {
  //   this.Signature_CertificateList(event.target.files);
  //   this.fileSig = event.target.files[0];
  //   const employeeId = this.employeeId
  //   const docTypeId = "20"

  //   this._Service.saveDocument(this.fileSig, employeeId, docTypeId).subscribe(result => {

  //     let data =
  //     {
  //       "docTypeId": docTypeId,
  //       "documentId": result.data.dmsDocumentId,
  //       "docName": result.data.uploadStatusMessage,
  //     }
  //     this.document_list.push(data);
  //     // console.log(this.document_list);
  //     // alert("File uploaded successfully");
  //   });

  //   this.updateProgress4();
  // }
  // Signature_CertificateList(files: Array<any>) {
  //   for (const item of files) {
  //     item.progress = 0;
  //     this.Signature_files.push(item);
  //     this.Signature_show = false;
  //   }
  //   // this.NSDL_Simulator(0);
  // }
  // Signature_Delete(index: number) {
  //   this.Signature_files.splice(index, 1);
  //   this.Signature_show = true;
  // }

  // fileNSDL: any;
  // NSDL1_files: any[] = [];
  // NSDL1_show: boolean = true;
  // NSDL1_On(event: any) {

  //   let time1 = new Date();

  //   this.file = event.target.files[0];
  //   this.fileName = "NSDLCert" + time1.getHours() + time1.getMilliseconds().toString();
  //   const employeeId = this.employeeId
  //   const docTypeId = "17"
  //   const reader = new FileReader();
  //   var data4: any;
  //   reader.onloadend = () => {
  //     console.log(reader.result);
  //     // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
  //     data4 = reader.result;
  //     let data5 = data4.toString()
  //     data5 = data5.replace("data:application/pdf;base64,", "")
  //     console.log(data4);
  //     console.log(data4);
  //     let data = {
  //       "type": "pension",
  //       "sourceId": 2,
  //       "docAttributes": [

  //       ],
  //       "data": [
  //         {
  //           "docTypeId": 21,
  //           "docTypeName": "NSDL_Certificate",
  //           "docName": this.fileName,
  //           "docTitle": "Certificate",
  //           "content": data5
  //         }
  //       ]
  //     }
  //     this._Service.postOr("wcc/uploaddocs", data).subscribe((res: any) => {
  //       console.log("res", res);
  //       let data =
  //       {
  //         "docTypeId": docTypeId,
  //         "documentId": res.data.document[0].docId,
  //         "docName": this.fileName,
  //       }
  //       this.newDocList.push(data);
  //       console.log("document_list", this.newDocList);
  //     })
  //   };
  //   reader.readAsDataURL(this.file);

  //   this.updateProgress();
  // }
  // NSDL1_CertificateList(files: Array<any>) {
  //   for (const item of files) {
  //     item.progress = 0;
  //     this.NSDL1_files.push(item);
  //     this.NSDL1_show = false;
  //   }
  //   // this.NSDL_Simulator(0);
  // }
  // NSDL1_Delete(index: number) {
  //   this.NSDL1_files.splice(index, 1);
  //   this.NSDL1_show = true;
  // }

  NSDL_On(event: any) {
    this.NSDL_CertificateList(event.target.files);
  }
  NSDL_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.NSDL_files.push(item);
      this.NSDL_show = false;
    }
    // this.NSDL_Simulator(0);
  }
  NSDL_Delete(index: number) {
    this.NSDL_files.splice(index, 1);
    this.NSDL_show = true;
  }

  NSDL_Simulator(index: number) {
    setTimeout(() => {
      if (index === this.NSDL_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.NSDL_files[index].progress === 100) {
            clearInterval(progressInterval);
          } else {
            this.NSDL_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************

  // ********************Strat Retirement Order***********************************

  Joint_On(event: any) {
    this.Joint_CertificateList(event.target.files);
  }
  Joint_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.Joint_files.push(item);
      this.Joint_show = false;
    }
    this.Joint_Simulator(0);
  }
  Joint_Delete(index: number) {
    this.Joint_files.splice(index, 1);
    this.Joint_show = true;
  }
  Joint_Simulator(index: number) {
    setTimeout(() => {
      if (index === this.Joint_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.Joint_files[index].progress === 100) {
            clearInterval(progressInterval);
          } else {
            this.Joint_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************
  // ********************Strat Retirement Order***********************************

  Accommodation_On(event: any) {
    this.AccommodationList(event.target.files);
  }
  AccommodationList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.Accommodation_File.push(item);
      this.Accommodation_show = false;
    }
    this.Accommodation_Simulator(0);
  }
  Accommodation_delete(index: number) {
    this.Accommodation_File.splice(index, 1);
    this.Accommodation_show = true;
  }
  Accommodation_Simulator(index: number) {
    setTimeout(() => {
      if (index === this.Accommodation_File.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.Accommodation_File[index].progress === 100) {
            clearInterval(progressInterval);
          } else {
            this.Accommodation_File[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }
  // ********************END Retirement Order ***********************************

  //#endregion DOCUMENTS UPLOADED

  //#region LOAN AND ADVANCE
  getLoanAndAdvancesDetails() {
    // let data = {
    //   "employeeId": parseInt(this.employeeId)
    // }
    // this._Service.postRequestpension(data, 'getLoanDetailsByEmployeeId').subscribe({
    //   next: (response) => {
    //     if (response.status = 200) {
    //       this.loanAndAdvancesDetails = response.data;
    //       // let dd = response.data[0].loanDate
    //       // let datatime = dd.toString().substring(0,dd.length-5);
    //       // this.dateOfBirth=this.datepipe.transform(datatime  , 'dd/MM/yyyy')
    //       localStorage.setItem('Loans-Advance', JSON.stringify(response.data[0]))
    //     }
    //   },
    //   error: (err) => {
    //     this.error = err;
    //     // this._snackBar.open('Error occurred :- ', this.error, {
    //     //   horizontalPosition: 'center',
    //     //   verticalPosition: 'top',
    //     // });
    //     //   this.showerror=true;
    //     //  alert(this.error)
    //   }
    // });
  }

  // file preview function

  isHBA: boolean = false;
  isMCA: boolean = false;
  loanAdvance(field: any, title: any, btnText: any) {
    this.dialog
      .open(CommonDialogComponent, {
        panelClass: 'dialog-w-50',
        autoFocus: false,
        height: 'auto',
        width: 'calc(100% - 50%)',
        data: {
          message: title,
          field: field,
          id: 7,
          btnText: btnText,
        },
      })
      .afterClosed()
      .subscribe((response) => {
        console.log('json data', response);

        this.advancedLoan.push(JSON.parse(response.data));

        console.log('this.advancedLoan', this.advancedLoan);
        // Calculations_ARD_Details?.addDynamicElement
        console.log(this.registrationForm.value.addDeduction);
        // this.Calculations_ARD_Details?.addDeduction.forEach((i:any,index:any)=>{
        //      i.deductionAmount=  this.advancedLoan[index].principleAmount- this.advancedLoan[index].recoveredAmount
        // })
        console.log(this.addDeduction);
        // this.addDeduction.value[0].deductionAmount = this.advancedLoan[0].principleAmount- this.advancedLoan[0].recoveredAmount
        //  .forEach((i:any,index:any)=>{
        //      i.deductionAmount  =  this.advancedLoan[index].principleAmount- this.advancedLoan[index].recoveredAmount
        // })
        console.log(this.addDeduction);
        console.log(this.registrationForm.value);
        console.log(this.Calculations_ARD_Details?.addDeduction);
        // principleAmount-recoveredAmount

        if (this.advancedLoan.length >= 1) {
          if (
            this.advancedLoan[this.advancedLoan.length - 1].loanTypeId == '1'
          ) {
            this.isHBA = true;
            this.addDeduction.push(
              this.formbuilder.group({
                deductionAmount: new FormControl(
                  this.advancedLoan[this.advancedLoan.length - 1]
                    .principleAmount -
                    this.advancedLoan[this.advancedLoan.length - 1]
                      .recoveredAmount
                ),
                deductionHead: new FormControl(this.HPrincipal),
                deductionType: new FormControl(227),
                deductionName: new FormControl(
                  this.DeductionName(227).toString()
                ),
              })
            );
            this.isRemoveDe[this.addDeduction?.length - 1] = false;
            console.log(this.addDeduction);
            this.addDeduction.push(
              this.formbuilder.group({
                deductionAmount: new FormControl(
                  this.advancedLoan[this.advancedLoan.length - 1].interest
                ),
                deductionHead: new FormControl(this.HInterest),
                deductionType: new FormControl(231),
                deductionName: new FormControl(
                  this.DeductionName(231).toString()
                ),
              })
            );
            this.isRemoveDe[this.addDeduction?.length - 1] = false;
          } else if (
            this.advancedLoan[this.advancedLoan.length - 1].loanTypeId == '2'
          ) {
            this.isMCA = true;
            this.addDeduction.push(
              this.formbuilder.group({
                deductionAmount: new FormControl(
                  this.advancedLoan[this.advancedLoan.length - 1]
                    .principleAmount -
                    this.advancedLoan[this.advancedLoan.length - 1]
                      .recoveredAmount
                ),
                deductionHead: new FormControl(this.MPrincipal),
                deductionType: new FormControl(223),
                deductionName: new FormControl(
                  this.DeductionName(223).toString()
                ),
              })
            );
            this.isRemoveDe[this.addDeduction?.length - 1] = false;
            this.addDeduction.push(
              this.formbuilder.group({
                deductionAmount: new FormControl(
                  this.advancedLoan[this.advancedLoan.length - 1].interest
                ),
                deductionHead: new FormControl(this.MInterest),
                deductionType: new FormControl(224),
                deductionName: new FormControl(
                  this.DeductionName(224).toString()
                ),
              })
            );
            this.isRemoveDe[this.addDeduction?.length - 1] = false;
          }
        }
      });
  }
  //#endregion LOAN AND ADVANCE

  get_Task_Detail() {
    let data = {
      taskId: this.transId,
    };
    this._Service.requestApplication(data, 'task').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.tasklist = res.data;
          console.log('this.tasklist', this.tasklist);
          this.isMaker1 = true;
          this.FORWARD = res.data.actionData[0].actionLabel;
          this.REVERT = res.data.actionData[1].actionLabel;
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

  Remark() {
    if (this.userDetails.roleid == '1') {
      this.taskRoleId = 1;
    }
    let data = {
      roleId: this.taskRoleId,
    };
    console.log(data);
    this._Service.requestApplication(data, 'getRemarksSuggestion').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.Remark_Details = res.data;
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

  selectRemark(remark_id: any) {
    this.Request_Confirmation.patchValue({
      Remarks: remark_id.remarks,
    });
  }

  Qualifying_Service = '';
  Non_Qualifying_Service = '';
  Type_DE = '';
  De_Start_Date = '';
  De_Completion_Date = '';

  isCrimnalCase: boolean = false;
  addServiceRecord(field: any, title: any) {
    if (this.Pension_Commutation?.totalCurrentService) {
      field.totalServiceLength = this.Pension_Commutation.totalCurrentService;
    }

    this.dialog
      .open(ServiceRecordDialogComponent, {
        panelClass: 'dialog-w-50',
        autoFocus: false,
        height: 'auto',
        width: 'calc(100% - 30%)',

        data: {
          getServiceRecordData: (status: any, detypename: any) => {
            this.deTypeStatus = status;
            this.deTypeName = detypename;
            console.log(this.deTypeName);
            if (this.deTypeStatus == 1) {
              this.deTypeStatus = true;
            } else if (this.deTypeStatus == 0) {
              this.ServiceDetails.optForCommutation =
                this.ServiceDetails.optForCommutation;
              this.deTypeStatus = false;
            }
            this.isDisabled = this.deTypeStatus;
            console.log('DE Type Satus>>>>>', this.deTypeStatus);
          },
          message: title,
          field: field,
          id: 6,
          doj: this.dateofJoinging,
          dor: this.dateofRetirement,
          dob: this.dateOfBirth,
          // joiningDate:this.ServiceDetails.DOJ
        },
      })
      .afterClosed()
      .subscribe((data) => {
        this.serviceRecordDatanew = JSON.parse(data.data);
        console.log('this.serviceRecordDatanew ', this.serviceRecordDatanew);
        this.addServiceRecord1();
        if (this.serviceRecordDatanew.deStatus == 1) {
          this.destatus = true;
          if (
            this.serviceRecordDatanew.deType == '1' ||
            this.serviceRecordDatanew.deType == '4'
          ) {
            this.ServiceDetails.optForCommutation = 'No';
            this.ServiceDetails.commuationPercentage = 0;
            this.isCommutation = false;
            this.isCrimnalCase = true;
            //  console.log(this.Calculations_Commutation_Details);
            //  this.Calculations_Commutation_Details.effectiveDate="";
            this.commutationDetails.patchValue({
              effectiveDate: '',
            });
          }
        } else {
          this.ServiceDetails.optForCommutation =
            this.ServiceDetails.optForCommutation;
          this.destatus = false;
          this.isCrimnalCase = false;
        }
        if (this.isCommutation) {
          let dates = new Date(this.commucationDate);
          console.log('dates', dates);

          // dates.setDate(dates.getDate() + 1);
          console.log('dates', dates);
          this.commutationDateCalculation(dates);
        } else {
          let dates = '';
          console.log('dates', dates);
          this.commutationDateCalculation(dates);
        }
      });
  }

  addTimeofService(firstService: any, secondService: any) {
    let dataarray1 = firstService.split(' ');
    let dataarray2 = secondService.split(' ');

    let days = Number(dataarray1[4]) + Number(dataarray2[4]);
    let months = Number(dataarray1[2]) + Number(dataarray2[2]);
    let years = Number(dataarray1[0]) + Number(dataarray2[0]);
    if (days >= 30) {
      months = months + 1;
      days = days - 30;
    }
    if (months >= 12) {
      years = years + 1;
      months = months - 12;
    }
    let finalTime = years + ' years ' + months + ' months ' + days + ' days';
    console.log('finalTime', finalTime);
  }

  documentList: any;
  document: any;
  get_Detail_Document(name: any, id: any) {
    // if (id == 1) {
    //   this.document = parseInt(this.config.getDetails("doc_Id")!);
    // }
    // else {

    //   for (let p of this.EMP_doc) {
    //     if (p.docTypeId == id) {
    //       this.document = p.documentId
    //       console.log(p.documentId);
    //     }
    //   }
    // }
    let data = {
      documentId: 4829,
    };

    this._Service
      .postRequestpension(data, 'getDocumentByDocumentId')
      .subscribe({
        next: (res) => {
          if ((res.status = 200)) {
            this.documentList = res.data.documentContent;
            let data = {
              base64Pdf: this.documentList,
              redirectUrl: 'pension/e-Pension/Profile',
            };

            this.dialog.open(PdfPreviewComponent, {
              width: '60%',
              data: { message: data },
              disableClose: false,
            });

            //this.downloadPdf(this.documentList, name);
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
  showHideFields(val: any) {
    if (val === 1) {
      this.isDeStatus = true;
    } else {
      this.isDeStatus = false;
    }
  }
  showHideRemark(val: any) {
    if (val === 1) {
      this.isPenalty = true;
    } else {
      this.isPenalty = false;
    }
  }

  MonthlyPensionTreasury(i: any) {
    this.Pension_Commutation.monthlyPensionTreasury = i;
  }
  ppo_number: any;
  monthlyPensionTreasury: any;
  onSubmit_Final_Maker(action: any) {
    if (this.Pension_Commutation?.monthlyPensionTreasury == '0') {
      alert("Please select 'Monthly Pension Treasury'");
      return;
    }

    console.log('this.documentlist', this.documentlist);
    // this.Pension_Commutation.enhancedPensionDate=this.enhanceDate;
    let commutation_data: any;
    if (!this.isCommutation) {
      commutation_data = {
        budgetHead: '',
        budgetHeadId: '',
        effectiveDate: '',
        commutationAmount: '',
        commutationFactor: '',
        commutationValue: '',
      };
      this.Pension_Commutation.commutedFactor = '';
      this.Pension_Commutation.commutationAmount = '';
      this.Pension_Commutation.commutationValue = '';
    } else {
      commutation_data = {
        budgetHead: this.getBudHead('Commutation'),
        budgetHeadId: this.getBudHeadId('Commutation'),
        effectiveDate: this.commutationDetails.value.effectiveDate,
        commutationAmount: this.Pension_Commutation.commutationAmount,
        commutationFactor: this.Pension_Commutation.commutedFactor,
        commutationValue: this.Pension_Commutation.commutationValue,
      };
    }

    let Deductions_Details = {
      additionalAmount: this.registrationForm.value.additional_Allowance_Amt,
      recoveryAmount: this.registrationForm.value.recoveryTypeAmount,
      deductionAmount: this.registrationForm.value.DeductionTypeAmount,
    };
    let condition3 = '';
    if (this.isgovHouseAlloted && this.advancedLoan?.length == 0) {
      condition3 =
        'No dues Certificate of occupation of Government accommodation has been obtained from the concerned authority';
    } else if (!this.isgovHouseAlloted) {
      condition3 =
        'Certificate of non occupation of Government accommodation has been obtained from the Government Employee and it is certify that he/she is not in occupation of any Government accommodation and/or have not taken any articles like furniture etc. from P.W.D. Stores on rent';
    } else if (this.isgovHouseAlloted && this.advancedLoan?.length > 0) {
      condition3 =
        'Government servant has taken Government accommodation and/or any articles like furniture etc. from P.W.D, a certificate has been obtained from the Director Estate Department and accordingly recovery/ deduction have been proposed in e-pension set';
    }
    let condition_data = [
      {
        condtion_type_id: '1',
        condition: this.conditionForm.value.condition_1,
        condition_StartDate: this.conditionForm.value.condition_1_Date,
        condition_EndDate: this.conditionForm.value.condition_1_Date1,
        condition_FromtDate: '',
        condition_TotDate: '',
        condition_Amount2: '',
        condition_Amount: this.conditionForm.value.condition_1_Amount,
        condition_string:
          'It is certified that' +
          (!this.isCrimnalCase ? ' No ' : '') +
          'Departmental Enquiry under rule 16 of C.C.A Rules or criminal case is pending or contemplated against the employee on dated ' +
          this.date.transform(
            this.conditionForm.value.condition_1_Date,
            'dd-MM-yyy'
          ) +
          ' as per appointing authority order No ' +
          this.conditionForm.value.condition_1_Amount +
          ' date ' +
          this.date.transform(
            this.conditionForm.value.condition_1_Date,
            'dd-MM-yyy'
          ) +
          ' (date of submission of pension case). Copy of retirement orders and no D.E. certificate issued from the Appointing Authority are attached with e-pension set',
      },
      {
        condition_Amount2: '',
        condtion_type_id: '2',
        condition: this.conditionForm.value.condition_2,
        condition_string:
          'Qualifying service has been computed in the e-pension set is in accordance to service verification recorded in the service book',
        condition_StartDate: '',
        condition_EndDate: '',
        condition_FromtDate: '',
        condition_TotDate: '',
        condition_Amount: '',
      },
      {
        condition_Amount2: '',
        condtion_type_id: '3',
        condition: this.conditionForm.value.condition_3,
        condition_string: condition3,
        condition_StartDate: '',
        condition_EndDate: '',
        condition_FromtDate: '',
        condition_TotDate: '',
        condition_Amount: '',
      },

      {
        condition_Amount2: '',
        condtion_type_id: '4',
        condition: this.conditionForm.value.condition_4,
        condition_string:
          'A certificate has been obtained from the senior accounts personnel in the Office that all the fixations made from time to time are correct and the pay being drawn is also correct, the same is attached with the e-pension set',
        condition_StartDate: '',
        condition_EndDate: '',
        condition_FromtDate: '',
        condition_TotDate: '',
        condition_Amount: '',
      },

      {
        condition_Amount2: '',
        condtion_type_id: '5',
        condition: this.conditionForm.value.condition_5,
        condition_string:
          'Extraordinary Leave is taken on Medical Certificate, or for Higher Studies or due to Civil Commotion/natural calamities, orders of the competent authority counting the leave period for pension are recorded in the Service Book and the same have been included in the qualifying service. Extra ordinary leave is taken other than medical certificate or interruptions of service have been included as non qualifying service in e-pension set',
        condition_StartDate: '',
        condition_EndDate: '',
        condition_FromtDate: '',
        condition_TotDate: '',
        condition_Amount: '',
      },
      {
        condition_Amount2: '',
        condtion_type_id: '6',
        condition: this.conditionForm.value.condition_6,
        condition_string:
          "Entry to the effect that employer's share of CPF balance has been deposited in the Government Account and Transfer Entry passed by the State Insurance/Provident Fund Department, has been recorded in the Service Book.",
        condition_StartDate: '',
        condition_EndDate: '',
        condition_FromtDate: '',
        condition_TotDate: '',
        condition_Amount: '',
      },
      {
        condition_Amount2: '',
        condtion_type_id: '7',
        condition: this.conditionForm.value.condition_7,
        condition_string:
          'The dues of the Government recoverable from the Government servant have been shown in tentative L.P.C and recovery/ deduction has been proposed in e-pension set',
        condition_StartDate: '',
        condition_EndDate: '',
        condition_FromtDate: '',
        condition_TotDate: '',
        condition_Amount: '',
      },
      {
        condition_Amount2: '',
        condtion_type_id: '8',
        condition: this.conditionForm.value.condition_8,
        condition_StartDate: '',
        condition_EndDate: '',
        condition_FromtDate: '',
        condition_TotDate: '',
        condition_string:
          'It is certified that no HBA/MCA was sanctioned to him/her during entire services',
        condition_Amount: '',
      },
    ];

    let payload_summary = {
      empName: this.Personaldetail.nameEn,
      emp_Id: this.Personaldetail.employeeId,
      empCode: this.Personaldetail.employeeCode,
    };
    if (this.Calculations_Pay_Details) {
      this.Calculations_Pay_Details['mainBudgetHead'] =
        this.getBudHead('General');
      this.Calculations_Pay_Details['gratuityBudgetHead'] =
        this.getBudHead('Gratuity');
      this.Calculations_Pay_Details['mainBudgetHeadId'] =
        this.getBudHeadId('General');
      this.Calculations_Pay_Details['gratuityBudgetHeadId'] =
        this.getBudHeadId('Gratuity');
      this.Calculations_Pay_Details['pensionType'] =
        this.BudgetDetails?.length > 1 ? this.BudgetDetails[0].pensionType : '';
      this.Calculations_Pay_Details['pensionTypeCode'] =
        this.BudgetDetails?.length > 1 ? this.BudgetDetails[0].pensionCode : '';
    }

    this.Banklist['treasuryCode'] = this.userDetails.treasCode;
    this.Banklist['treasuryName'] = this.userDetails.treasName;
    this.Personaldetail['lrNo'] = this.lRnumber ? this.lRnumber : '';
    this.Personaldetail['requestId'] = this.reqid ? this.reqid : '';
    if (this.Personaldetail?.selfPhotoId) {
      let selfPic = {
        dmsDocId: this.Personaldetail.selfPhotoId,
        docName: 'Self Photograph',
        docTypeId: 32,
      };
      this.documentlist.push(selfPic);
    }
    if (this.Personaldetail?.jointPhotoId) {
      let jointPic = {
        dmsDocId: this.Personaldetail.jointPhotoId,
        docName: 'Joint Photograph',
        docTypeId: 33,
      };
      this.documentlist.push(jointPic);
    }
    console.log('this.documentlist', this.documentlist);
    let data = {
      requestData: {
        processId: '1',
        taskSeq: '',
        processTaskSeq: '',
        taskTranId: this.transId ? this.transId : '',
        requestId: this.reqid ? this.reqid : '',
        requestDesc: '',
        initiator: this.userDetails.assignmentid,
        //"person_id": this.empinfo.userId,
        person_name: this.empinfo.displayName ? this.empinfo.displayName : '',
        action: action,
        remarks: this.Request_Confirmation.controls['Remarks'].value
          ? this.Request_Confirmation.controls['Remarks'].value
          : '',
        payloadChangeFlag: 'Y',
        adApproveFlag: '',
      },
      payload: {
        personalDetails: this.Personaldetail ? this.Personaldetail : '',
        serviceDetails: this.ServiceDetails ? this.ServiceDetails : '',
        addressDetails: this.EMPAddress ? this.EMPAddress : '',
        familyDetails: this.familyDetails ? this.familyDetails : '',
        nominationDetails: this.nominee ? this.nominee : [],
        serviceRecords: this.serviceRecordDatanew
          ? this.serviceRecordDatanew
          : '',
        loansAdvance: this.advancedLoan,
        calculationsPayDetails: this.Calculations_Pay_Details
          ? this.Calculations_Pay_Details
          : '',
        calculationsAdditionalAllowanceRecovery: this.registrationForm.value
          ? this.registrationForm.value
          : '',
        calculationsPensionDetails: this.Pension_Commutation
          ? this.Pension_Commutation
          : '',
        calculationsCommutationDetailsNomination: commutation_data
          ? commutation_data
          : '',
        bankTreasuryDetails: this.Banklist ? this.Banklist : '',
        documents: this.documentlist ? this.documentlist : '',
        conditionList: condition_data ? condition_data : '',
        employeeId: this.Personaldetail.employeeId,
        employeeCode: this.Personaldetail.employeeCode,
        createdByAid: this.empinfo.aid,
        createdByUserId: this.empinfo.userId,
        payeeId: this.Personaldetail.payeeId ? this.Personaldetail.payeeId : '',
      },
      payloadSummary: payload_summary ? payload_summary : '',
    };

    console.log(data);

    this._Service.requestApplication(data, 'action').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.rid = res.requestId;
          this.modalService.dismissAll();
          this.pensionInitaite();
          this.dialog.open(CommonDialogComponent, {
            panelClass: 'dialog-w-50',
            autoFocus: false,
            data: {
              message: 'success',
              reqId: this.rid,
              id: 4,
              aid: this.empinfo.aid,
              ppo_no: '',
            },
          });
        }
      },
      error: (err) => {},
    });
  }
  checkAllCondition() {}
  pensionInitaite() {
    let data = {
      empId: this.Personaldetail.employeeCode,
      psnInitiated: true,
      psnType: 'S',
      psnStatus: 'I',
    };
    console.log('data', data);
    this._Service
      .postCumm('updateEmployeePensionStatus', data)
      .subscribe((res: any) => {
        console.log('updateEmployeePensionStatus', res);
      });
  }

  document_id: document_id[] = [];
  document_id_list: document_id_list[] = [];
  getBudgetDetails(ser: any) {
    console.log('this.ServiceDetails', ser);
    this.BudgetDetails = [];
    let data = {
      pensionCode: this.psnTypeCode ? this.psnTypeCode : '68',
      srvcCatId: ser.serviceCatId,
    };
    console.log('getBudgetDetails', data);
    this._Service.postdeduction(data, 'getPensionBudgetHead').subscribe({
      next: (res) => {
        console.log('BudgetDetails', res.data.psnBdgtHeadMapData);

        this.BudgetDetails = res.data.psnBdgtHeadMapData;
        this.DeductionbudgetHead();
        //  this.generalBudHead=this.BudgetDetails.filter((x: any) => x.psbBdgtHeadTypName == "General";
      },
      error: (err) => {},
    });
  }
  getBudHead = (id: string) => {
    if (this.BudgetDetails?.length > 1)
      return this.BudgetDetails.filter(
        (x: any) => x.psbBdgtHeadTypName == id
      )[0].budgetHead;
    else return '';
  };
  getBudHeadId = (id: string) => {
    if (this.BudgetDetails?.length > 1)
      return this.BudgetDetails.filter(
        (x: any) => x.psbBdgtHeadTypName == id
      )[0].budgetHeadId;
    else return '';
  };
  conditionList: any;
  isAccCert: boolean = false;
  getTaskDetail(taskId: any) {
    let data = {
      taskId: taskId,
    };
    this._Service.requestApplication(data, 'task').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          let data4 = JSON.parse(
            JSON.stringify(res.data).replace(/\:"null"/gi, ':""')
          );
          console.log('data2', data4);
          this.tasklist = data4.actionData;

          console.log('taskdata', this.tasklist);
          this.FORWARD = data4.actionData[0].actionLabel;
          this.REVERT = data4.actionData[1].actionLabel;
          this.familyDetails = data4.payload.familyDetails;
          this.Personaldetail = data4.payload.personalDetails;
          this.ServiceDetails = data4.payload.serviceDetails;
          this.nominee = data4.payload.nominationDetails;
          this.conditionList = data4.payload.conditionList;
          this.Pension_Commutation = data4.payload.calculationsPensionDetails;
          //console.log('pension data',this.Pension_Commutation)
          this.Banklist = data4.payload.bankTreasuryDetails;
          this.Calculations_Pay_Details = data4.payload.calculationsPayDetails;
          this.Calculations_ARD_Details =
            data4.payload.calculationsAdditionalAllowanceRecovery;
          this.Calculations_Commutation_Details =
            data4.payload.calculationsCommutationDetailsNomination;
          //console.log('pension data',this.Calculations_Commutation_Details)
          this.loanAndAdvancesDetails = data4.payload.loansAdvance;
          this.ObjectionArray = data4.payload?.ObjectionArray
            ? data4.payload?.ObjectionArray
            : [];
          this.advancedLoan = data4.payload.loansAdvance;
          this.document_list = data4.payload.documents;
          this.documentlist = data4.payload.documents;
          this.EMPAddress = data4.payload.addressDetails;
          console.log('this.EMPAddress', this.EMPAddress);
          this.residenceAddress = this.EMPAddress.employeeAddresses;
          console.log('this.residenceAddress', this.residenceAddress);
          this.officeArray = data4.payload.addressDetails.officeAddresses;
          let newdocumentlist: any[] = [];
          newdocumentlist = this.documentlist;
          if (newdocumentlist?.length > 0) {
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'Pension Kit'
            );
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'Signature'
            );
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'Self Photograph'
            );
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'Joint Photograph'
            );
            // newdocumentlist = newdocumentlist.filter(item => item.docName != "No DE Certificate");
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'No Dues Certificate'
            );
            if (
              this.userDetails.roleid == 1 ||
              this.userDetails.roleid == 2 ||
              this.userDetails.roleid == 3
            ) {
              newdocumentlist = newdocumentlist.filter(
                (item) => item.docName != 'Pension Set'
              );
            }
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'FR'
            );
            if (this.Personaldetail?.disable == 'N') {
              newdocumentlist = newdocumentlist.filter(
                (item) => item.docName != 'Disability Certificate'
              );
            }
            if (this.Personaldetail?.disable == '0') {
              newdocumentlist = newdocumentlist.filter(
                (item) => item.docName != 'Disability Certificate'
              );
            }
            if (this.userDetails.roleid == 2) {
              let docId = this.documentlist.filter(
                (x: any) => x.docName == 'Accounts Personnel Certificate'
              )[0]?.dmsDocId;
              if (docId != null) {
                this.isAccCert = true;
              }
            }
          }

          this.docList = newdocumentlist;
          console.log('this.docList', this.docList);
          for (let i = 0; i < this.docList.length; i++) {
            this.removeDoc[i] = false;
          }
          for (let i = 0; i < this.docList.length; i++) {
            if (this.docList[i].dmsDocId) {
              this.removeDoc[i] = true;
            }
          }
          this.payload_summary = data4.payload.payloadSummary;
          this.serviceRecord_arry = data4.payload.serviceRecords;

          this.EMP_doc = data4.payload.documents;

          console.log('this.residenceAddress', this.residenceAddress);
          this.documentlist = data4.payload.documents;
          this.nominee = data4.payload.nominationDetails;
          let product1: any;
          this.serviceRecordDatanew = data4.payload.serviceRecords;
          this.addServiceRecord1();
          // this.addServiceRecord1(data4.payload.serviceRecords);

          this.serviceRecord_arry_List.push(data4.payload.serviceRecords);

          if (this.ServiceDetails.optForCommutation == 'Yes') {
            this.isCommutation = true;
          } else if (this.ServiceDetails.optForCommutation == 'No') {
            this.isCommutation = false;
          }
          if (this.serviceRecordDatanew.deStatus == '1') {
            this.destatus = true;
          } else {
            this.destatus = false;
          }
          this.setDate();
          this.showPic(this.Personaldetail.selfPhotoId);
          if (this.Personaldetail.jointPhotoId > 0)
            this.jointPic(this.Personaldetail.jointPhotoId);
          for (product1 of this.nominee) {
            if (product1.schemeName == 'Commutation') {
              this.commutation_Arr.push(product1);
              this.iconCA = 'person_pin_circle';
            } else if (product1.schemeName == 'Arrears') {
              this.arrear_Arr.push(product1);
            } else if (product1.schemeName == 'Gratuity') {
              this.gratuity_Arr.push(product1);
            }
          }
          if (
            this.serviceRecordDatanew.deType == '1' ||
            this.serviceRecordDatanew.deType == '4'
          ) {
            this.isCrimnalCase = true;
          }
          for (let i = 0; i < data4.payload.documents.length; i++) {
            if (i % 2 == 0) {
              this.doc_list.push(data4.payload.documents[i]);
            } else {
              this.doc_list1.push(data4.payload.documents[i]);
            }
          }
          if (this.Personaldetail.hasOwnProperty('lrNo')) {
          } else {
            this.treasury = this.Banklist?.treasuryCode;
            this.getLRnumber();
            this.isLr = true;
          }
          // this.conditionForm.setValue(data4.payload.conditionList);
          let product: any;
          for (product of this.residenceAddress) {
            if (product.commType == 'C') {
              this.residenceArray.push(product);
              // console.log("this.residenceArray",this.residenceArray);
              this.iconCA = 'person_pin_circle';
            } else if (product.commType == 'P') {
              this.DepartmentAddress.push(product);
              this.iconPA = 'account_box';
            }
          }

          for (let D of this.documentlist) {
            for (let p of this.EMP_doc) {
              if (p.docTypeId == D.docTypeId) {
                this.document_id.push({ id: p.docTypeId });

                this.document_id_list.push({
                  document_name: D.docName,
                  size: '215',
                  id: D.docTypeId,
                });
                console.log(this.document_id_list);
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
  getTreaName(i: any) {
    if (i) {
      return this.treasurylist.filter((x: any) => x.treasCode == i)[0]
        ?.treasNameEn;
    }
  }
  picData: any = '';
  showPic = (id: any) => {
    let data = {
      type: 'ess',
      sourceId: 2,
      docs: [
        {
          docId: id,
        },
      ],
    };
    console.log('single report data', data);
    this._Service.postOr('wcc/getfiles', data).subscribe((res: any) => {
      console.log('res', res.data.document[0].content);
      if (res.data.document[0].content) {
        this.imageUrl =
          'data:image/jpeg;base64,' + res.data.document[0].content;
      }
    });
  };
  jointPic = (id: any) => {
    let data = {
      type: 'ess',
      sourceId: 2,
      docs: [
        {
          docId: id,
        },
      ],
    };
    console.log('single report data', data);
    this._Service.postOr('wcc/getfiles', data).subscribe((res: any) => {
      //console.log("res", res.data.document[0].content);
      if (res.data.document[0].content) {
        this.jointImageUrl =
          'data:image/jpeg;base64,' + res.data.document[0].content;
      }
    });
  };
  newconditions: any;
  makerObj: boolean = false;
  getTaskDetailMaker(taskId: any) {
    let data = {
      taskId: taskId,
    };
    this._Service.requestApplication(data, 'task').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          let data4 = JSON.parse(
            JSON.stringify(res.data).replace(/\:"null"/gi, ':""')
          );
          console.log('data2', data4);
          this.makerObj = true;
          this.tasklist = data4.actionData;
          console.log('taskdata', this.tasklist);
          this.FORWARD = data4.actionData[0].actionLabel;
          this.REVERT = data4.actionData[1].actionLabel;
          this.familyDetails = data4.payload.familyDetails;
          this.Personaldetail = data4.payload.personalDetails;
          this.ServiceDetails = data4.payload.serviceDetails;
          this.getBudgetDetails(this.ServiceDetails);
          this.nominee = data4.payload.nominationDetails;
          this.serviceRecordDatanew = data4.payload.serviceRecords;
          if (this.serviceRecordDatanew.deStatus == 1) {
            this.destatus = true;
            if (
              this.serviceRecordDatanew.deType == '1' ||
              this.serviceRecordDatanew.deType == '4'
            ) {
              this.ServiceDetails.optForCommutation = 'No';
              this.ServiceDetails.commuationPercentage = 0;
              this.isCommutation = false;
              this.isCrimnalCase = true;
              //  console.log(this.Calculations_Commutation_Details);
              //  this.Calculations_Commutation_Details.effectiveDate="";
              this.commutationDetails.patchValue({
                effectiveDate: '',
              });
            }
          } else {
            this.ServiceDetails.optForCommutation =
              this.ServiceDetails.optForCommutation;
            this.destatus = false;
            this.isCrimnalCase = false;
          }
          this.Pension_Commutation = data4.payload.calculationsPensionDetails;
          //console.log('pension data',this.Pension_Commutation)
          this.Banklist = data4.payload.bankTreasuryDetails;
          this.Calculations_Pay_Details = data4.payload.calculationsPayDetails;
          this.Calculations_ARD_Details =
            data4.payload.calculationsAdditionalAllowanceRecovery;
          console.log(
            'this.Calculations_ARD_Details',
            this.Calculations_ARD_Details
          );
          this.ObjectionArray = data4.payload?.ObjectionArray
            ? data4.payload?.ObjectionArray
            : [];
          if (this.Calculations_ARD_Details?.addDeduction.length > 0) {
            this.Calculations_ARD_Details?.addDeduction.forEach(
              (element: any, i: any) => {
                this.addDeduction.push(
                  this.formbuilder.group({
                    deductionType: new FormControl(element.deductionType),
                    deductionName: new FormControl(element.deductionName),
                    deductionAmount: new FormControl(element.deductionAmount),
                    deductionHead: new FormControl(element.deductionHead),
                  })
                );
                this.isRemoveDe[i] = true;
              }
            );
          }
          if (this.Calculations_ARD_Details?.addAllowanceType.length > 0) {
            this.Calculations_ARD_Details?.addAllowanceType.forEach(
              (element: any) => {
                this.addAllowanceType.push(
                  this.formbuilder.group({
                    allowanceType: new FormControl(element.allowanceType),
                    allowanceName: new FormControl(element.allowanceName),
                    allowanceAmount: new FormControl(element.allowanceAmount),
                    allowanceHead: new FormControl(element.allowanceHead),
                  })
                );
              }
            );
          }

          if (this.Calculations_ARD_Details?.addDynamicElement.length > 0) {
            this.Calculations_ARD_Details?.addDynamicElement.forEach(
              (element: any) => {
                this.addDynamicElement.push(
                  this.formbuilder.group({
                    recoveryType: new FormControl(element.recoveryType),
                    recoveryAmount: new FormControl(element.recoveryAmount),
                    recoveryHead: new FormControl(element.recoveryHead),
                  })
                );
              }
            );
          }
          if (this.Calculations_ARD_Details?.addWithHeld.length > 0) {
            this.Calculations_ARD_Details?.addWithHeld.forEach(
              (element: any) => {
                this.addWithHeld.push(
                  this.formbuilder.group({
                    withHeldType: new FormControl(element.withHeldType),
                    withHeldName: new FormControl(element.withHeldName),
                    withHeldAmount: new FormControl(element.withHeldAmount),
                    withHeldReason: new FormControl(element.withHeldReason),
                  })
                );
              }
            );
          }
          // this.addDeduction=this.Calculations_ARD_Details.addDeduction
          this.Calculations_Commutation_Details =
            data4.payload.calculationsCommutationDetailsNomination;
          //console.log('pension data',this.Calculations_Commutation_Details)
          this.loanAndAdvancesDetails = data4.payload.loansAdvance;
          this.advancedLoan = data4.payload.loansAdvance;
          this.document_list = data4.payload.documents;
          this.documentlist = data4.payload.documents;
          this.EMPAddress = data4.payload.addressDetails;
          console.log('this.EMPAddress', this.EMPAddress);
          this.residenceArray = data4.payload.addressDetails.employeeAddresses;
          console.log('this.residenceAddress', this.residenceAddress);
          this.officeArray = data4.payload.addressDetails.officeAddresses;
          let newdocumentlist: any[] = [];
          newdocumentlist = this.documentlist;
          if (newdocumentlist?.length > 0) {
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'Pension Kit'
            );
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'Pension Set'
            );
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'Signature'
            );
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'Self Photograph'
            );
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'Joint Photograph'
            );
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'Retirement Order Sanction'
            );
            newdocumentlist = newdocumentlist.filter(
              (item) =>
                item.docName != 'Bank Passbook First Page/Cancelled Cheque'
            );
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'Accounts Personnel Certificate'
            );
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'Marriage Certificate'
            );
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'No DE Certificate'
            );
            // newdocumentlist = newdocumentlist.filter(item => item.docName != "No DE Certificate");
            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'No Dues Certificate'
            );

            newdocumentlist = newdocumentlist.filter(
              (item) => item.docName != 'FR'
            );
            if (this.Personaldetail?.disable == 'N') {
              newdocumentlist = newdocumentlist.filter(
                (item) => item.docName != 'Disability Certificate'
              );
            }
            if (this.Personaldetail?.disable == '0') {
              newdocumentlist = newdocumentlist.filter(
                (item) => item.docName != 'Disability Certificate'
              );
            }
          }
          this.docList = newdocumentlist;
          console.log('this.docList', this.docList);
          for (let i = 0; i < this.docList.length; i++) {
            this.removeDoc[i] = false;
          }
          for (let i = 0; i < this.docList.length; i++) {
            if (this.docList[i].dmsDocId) {
              this.removeDoc[i] = true;
            }
          }
          this.newconditions = data4.payload.conditionList;
          let datec1 = new Date(this.newconditions[0].condition_StartDate);
          let datec2 = new Date(this.newconditions[0].condition_EndDate);
          console.log('this.newconditions', this.newconditions);
          this.conditionForm.patchValue({
            condition_1: this.newconditions[0].condition,
            condition_2: this.newconditions[1].condition,
            condition_3: this.newconditions[2].condition,
            condition_4: this.newconditions[3].condition,
            condition_5: this.newconditions[4].condition,
            condition_6: this.newconditions[5].condition,
            condition_7: this.newconditions[6].condition,
            condition_8: this.newconditions[7].condition,
            condition_1_Date: datec1,
            condition_1_Date1: datec2,
            condition_1_Amount: this.newconditions[0].condition_Amount,
          });
          this.payload_summary = data4.payload.payloadSummary;
          this.EMP_doc = data4.payload.documents;
          console.log('this.residenceAddress', this.residenceAddress);
          this.documentlist = data4.payload.documents;
          this.nominee = data4.payload.nominationDetails;
          this.serviceRecord_arry = data4.payload.serviceRecords;
          this.serviceRecordDatanew = data4.payload.serviceRecords;
          this.addServiceRecord1();
          //  alert()
          //   this.addServiceRecord1(data4.payload.serviceRecords);
          this.setDate();

          this.serviceRecord_arry_List.push(data4.payload.serviceRecords);
          let product1: any;
          if (this.ServiceDetails.optForCommutation == 'Yes') {
            this.isCommutation = true;
          } else if (this.ServiceDetails.optForCommutation == 'No') {
            this.isCommutation = false;
            let date1 =
              new (this.Calculations_Commutation_Details?.effectiveDate)();
            this.commutationDetails.patchValue({ effectiveDate: date1 });
          }
          if (data4.payload.serviceRecords.deStatus == '1') {
            this.destatus = true;
          } else {
            this.destatus = false;
          }

          this.conditionList = data4.payload.conditionList;

          this.showPic(this.Personaldetail.selfPhotoId);
          if (this.Personaldetail.jointPhotoId > 0)
            this.jointPic(this.Personaldetail.jointPhotoId);

          for (product1 of this.nominee) {
            if (product1.schemeName == 'Commutation') {
              this.commutation_Arr.push(product1);
            } else if (product1.schemeName == 'Arrears') {
              this.arrear_Arr.push(product1);
            } else if (product1.schemeName == 'Gratuity') {
              this.gratuity_Arr.push(product1);
            }
          }
          if (
            this.serviceRecordDatanew.deType == '1' ||
            this.serviceRecordDatanew.deType == '4'
          ) {
            this.isCrimnalCase = true;
          }
          for (let i = 0; i < data4.payload.documents.length; i++) {
            if (i % 2 == 0) {
              this.doc_list.push(data4.payload.documents[i]);
            } else {
              this.doc_list1.push(data4.payload.documents[i]);
            }
          }
          // this.conditionForm.setValue(data4.payload.conditionList);
          this.documentlist.forEach((element: any) => {
            if (element.docTypeId == 23) {
              if (element.dmsDocId != null) {
                this.isMdown = true;
              }
            }
            if (element.docTypeId == 17) {
              if (element.dmsDocId != null) {
                this.isDe = true;
              }
            }
            if (element.docTypeId == 18) {
              if (element.dmsDocId != null) {
                this.ischq = true;
              }
            }
            if (element.docTypeId == 15) {
              if (element.dmsDocId != null) {
                this.isRe = true;
              }
            }
          });
        }
      },
      error: (err) => {
        console.log(err);
        this.error = err;
      },
    });
  }

  HInterest: any = '';
  HPrincipal: any = '';
  MInterest: any = '';
  MPrincipal: any = '';
  DeductionbudgetHead() {
    if (this.BudgetDetails?.length >= 1) {
      let data = this.BudgetDetails.filter((x: any) => {
        if (x.allwDedName == 'HBA Interest') {
          return x;
        }
      });
      this.HInterest = data[0].budgetHead;

      let data2 = this.BudgetDetails.filter((x: any) => {
        if (x.allwDedName == 'HBA Principal') {
          return x;
        }
      });
      this.HPrincipal = data2[0].budgetHead;

      let data3 = this.BudgetDetails.filter((x: any) => {
        if (x.allwDedName == 'MCA Interest') {
          return x;
        }
      });
      this.MInterest = data3[0].budgetHead;
      let data4 = this.BudgetDetails.filter((x: any) => {
        if (x.allwDedName == 'MCA Principal') {
          return x;
        }
      });
      this.MPrincipal = data4[0].budgetHead;
    }
    console.log(this.HInterest);
  }
  numberValidation() {
    if (this.ServiceDetails.commuationPercentage < 0) {
      this.ServiceDetails.commuationPercentage = 0;
      alert('Please enter positive value.');
      return;
    }

    if (this.ServiceDetails.serviceCatId === 1) {
      if (this.ServiceDetails.commuationPercentage > 40) {
        this.ServiceDetails.commuationPercentage = 0;
        alert('Enter value under 40');
      } else {
        let dates = new Date(this.dateofRetirement);
        console.log('dates', dates);

        dates.setDate(dates.getDate() + 1);
        console.log('dates', dates);
        this.commutationDateCalculation(dates);
      }
    } else if (
      this.ServiceDetails.serviceCatId === 13 ||
      (this.ServiceDetails.serviceCatId === 7 &&
        this.ServiceDetails.serviceSubcatId === 108)
    ) {
      if (this.ServiceDetails.commuationPercentage > 50) {
        this.ServiceDetails.commuationPercentage = 0;
        alert('Enter value under 50');
      } else {
        let dates = new Date(this.dateofRetirement);
        console.log('dates', dates);

        dates.setDate(dates.getDate() + 1);
        console.log('dates', dates);
        this.commutationDateCalculation(dates);
      }
    } else {
      if (this.ServiceDetails.commuationPercentage > 33.33) {
        this.ServiceDetails.commuationPercentage = 0;
        alert('Enter value under 33.33');
      } else {
        let dates = new Date(this.dateofRetirement);
        console.log('dates', dates);

        dates.setDate(dates.getDate() + 1);
        console.log('dates', dates);
        this.commutationDateCalculation(dates);
      }
    }
  }
  esignRequest(resData: any) {
    let data = {
      reportPath: resData.reportPath,
      name: resData.name,
      value: resData.value,
      url: resData.mainurl,
      contextPath: '3',
      cordX: 400,
      cordY: 35,
      assignmentId: this.userDetails.assignmentid,
      docTypeId: resData.docTypeId,
      docName: resData.docName,
      roleId: '6',
      requestId: resData.requestId ? resData.requestId : '',
      processId: resData.processId,
    };
    console.log('esignXmlRequest', data);

    let url = 'sendrequest';
    this.load.show();
    this._Service.postNewEsign(url, data).subscribe((res: any) => {
      console.log('res', res);
      this.load.hide();
      setTimeout(() => {
        this.redirectService.postRedirect(res);
      }, 300);
    });
  }

  onSubmit_Final(action: any) {
    let count = 0;
    if (this.userDetails.roleid == '6' && action == 'ARV') {
      this.ObjectionArray.filter((x: any) => {
        if (x.rejected == false) {
          count = 1;
        }
      });
    }

    if (count == 1) {
      alert('Please clear all Objections before Approve.');
      return;
    }
    if (this.userDetails.roleid == '4' || this.userDetails.roleid == '6') {
      if (this.Pension_Commutation?.monthlyPensionTreasury == '0') {
        alert("Please select 'Monthly Pension Treasury'");
        return;
      }
    }
    if (this.isLr) {
      this.Personaldetail['lrNo'] = this.lRnumber ? this.lRnumber : '';
    }
    let commutation_data = {
      budgetHead: this.Calculations_Commutation_Details?.budgetHead,
      budgetHeadId: this.Calculations_Commutation_Details?.budgetHeadId,
      effectiveDate: this.Calculations_Commutation_Details?.effectiveDate,
      commutationAmount: this.Pension_Commutation?.commutationAmount,
      commutationFactor: this.Pension_Commutation?.commutedFactor,
      commutationValue: this.Pension_Commutation?.pensionCommuted,
    };

    let payload_summary = {
      empName: this.Personaldetail.nameEn,
      emp_Id: this.Personaldetail.employeeId,
      empCode: this.Personaldetail.employeeCode,
    };
    // console.log( "self pphoto id",this.Personaldetail.selfPhotoId)
    // console.log(this.documentlist)
    if (action == 'ARV') {
      let picData = {
        dmsDocId: this.Personaldetail.jointPhotoId,
        docName: 'Self Photo',
        docTypeId: 33,
      };
      let jointData = {
        dmsDocId: this.Personaldetail.selfPhotoId,
        docName: 'Joint Photo',
        docTypeId: 32,
      };
      this.documentlist.push(picData);
      this.documentlist.push(jointData);
      //console.log("Updated Doc List by Neha",this.documentlist)
    }
    if (this.userDetails.roleid == '2') {
      this.Personaldetail['requestId'] = this.reqid ? this.reqid : '';
    }

    let data = {
      requestData: {
        processId: '1',
        taskSeq: '',
        processTaskSeq: '',
        taskTranId: this.transId,
        requestId: this.reqid,
        requestDesc: '',
        initiator: this.empinfo.aid,
        person_id: this.empinfo.userId,
        person_name: this.empinfo.displayName,
        action: action,
        remarks: this.Request_Confirmation.controls['Remarks'].value,
        payloadChangeFlag: 'Y',
        adApproveFlag: '',
      },
      payload: {
        personalDetails: this.Personaldetail ? this.Personaldetail : '',
        serviceDetails: this.ServiceDetails ? this.ServiceDetails : '',
        addressDetails: this.EMPAddress,
        familyDetails: this.familyDetails ? this.familyDetails : '',
        nominationDetails: this.nominee ? this.nominee : '',
        serviceRecords: this.serviceRecord_arry ? this.serviceRecord_arry : '',
        loansAdvance: this.advancedLoan,
        calculationsPayDetails: this.Calculations_Pay_Details
          ? this.Calculations_Pay_Details
          : '',
        calculationsAdditionalAllowanceRecovery: this.Calculations_ARD_Details
          ? this.Calculations_ARD_Details
          : '',
        calculationsPensionDetails: this.Pension_Commutation
          ? this.Pension_Commutation
          : '',
        calculationsCommutationDetailsNomination: commutation_data
          ? commutation_data
          : '',
        bankTreasuryDetails: this.Banklist ? this.Banklist : '',
        documents: this.documentlist ? this.documentlist : '',
        employeeId: this.Personaldetail.employeeId,
        employeeCode: this.Personaldetail.employeeCode,
        createdByAid: this.empinfo.aid,
        createdByUserId: this.empinfo.userId,
        payeeId: this.Personaldetail.payeeId,
        conditionList: this.conditionList,
        ObjectionArray: this.ObjectionArray,
      },
      payloadSummary: payload_summary ? payload_summary : '',
    };

    console.log('checkerdata', data);

    this._Service.requestApplication(data, 'action').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.rid = res.requestId;

          this.modalService.dismissAll();
          if (action == 'ARV') {
            let purl: string =
              this.routers['location']._platformLocation.location.origin;
            let url2: string = this.routers.url;
            let mainUrl = purl + '/pension/#' + '/pension/e-Pension/Profile';
            console.log('enter');
            this.frEsignData = {
              reportPath: res.response.reportPathFR,
              name: 'task_data_id',
              value: res.response.taskDataIdFR,
              docTypeId: res.response.docTypeId,
              docName: res.response.docNameFR,
              processId: res.response.processId,
              mainurl: mainUrl,
              requestId: this.reqid,
            };
            this.pkEsignData = {
              reportPath: res.response.reportPathPK,
              name: 'pensioner_id',
              value: res.response.pensionerId,
              docTypeId: res.response.docTypeId,
              docName: res.response.docNamePK,
              processId: res.response.processId,
              mainurl: mainUrl,
              requestId: this.reqid,
            };
            // localStorage.setItem("esigntype","FR");
            // localStorage.setItem("pkEsignData",JSON.stringify(this.pkEsignData));
            this.config.storeDetails('esigntype', 'FR');
            this.config.storeDetails(
              'pkEsignData',
              JSON.stringify(this.pkEsignData)
            );
            this.config.storeDetails('pensionerId', res.response.pensionerId);
            console.log('frEsignData', this.frEsignData);
            this.isApprove = true;
            if (confirm('Approve Successful! Countinue for FR E-Sign.')) {
              // here genrate final report FR
              setTimeout(() => {
                this.esignRequest(this.frEsignData);
              }, 500);

              let postdata = {
                ppoNo: res.response.ppoNo,
                employeeId: this.Personaldetail.employeeId,
              };

              this._Service
                .postNewEmployee('updatePPONumber', postdata)
                .subscribe((res: any) => {
                  console.log('warnshyam===>>', res);
                });
            }
          } else {
            this.dialog.open(CommonDialogComponent, {
              panelClass: 'dialog-w-50',
              autoFocus: false,
              data: {
                message: 'success',
                reqId: this.rid,
                id: 4,
                aid: this.empinfo.aid,
                ppo_no: this.ppo_number,
                Responsedata: res.response,
              },
            });
          }
        }
      },
      error: (err) => {
        alert('Some Error Occured');
        // this.error = err;
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
        //   this.showerror=true;
        //  alert(this.error)
      },
    });
  }

  hoApproverEsign() {
    if (this.Pension_Commutation?.monthlyPensionTreasury == '0') {
      alert("Please select 'Monthly Pension Treasury'");
      return;
    }

    let commutation_data = {
      budgetHead: this.Calculations_Commutation_Details?.budgetHead,
      budgetHeadId: this.Calculations_Commutation_Details?.budgetHeadId,
      effectiveDate: this.Calculations_Commutation_Details?.effectiveDate,
      commutationAmount: this.Pension_Commutation?.commutationAmount,
      commutationFactor: this.Pension_Commutation?.commutedFactor,
      commutationValue: this.Pension_Commutation?.pensionCommuted,
    };
    let payload_summary = {
      empName: this.Personaldetail.nameEn,
      emp_Id: this.Personaldetail.employeeId,
      empCode: this.Personaldetail.employeeCode,
    };

    let data = {
      requestData: {
        processId: '1',
        taskSeq: '',
        processTaskSeq: '',
        taskTranId: this.transId,
        requestId: this.reqid,
        requestDesc: '',
        initiator: this.empinfo.aid,
        person_id: this.empinfo.userId,
        person_name: this.empinfo.displayName,
        action: 'FWD',
        remarks: this.Request_Confirmation.controls['Remarks'].value,
        payloadChangeFlag: 'Y',
        adApproveFlag: '',
      },
      payload: {
        personalDetails: this.Personaldetail ? this.Personaldetail : '',
        serviceDetails: this.ServiceDetails ? this.ServiceDetails : '',
        addressDetails: this.EMPAddress,
        familyDetails: this.familyDetails ? this.familyDetails : '',
        nominationDetails: this.nominee ? this.nominee : '',
        serviceRecords: this.serviceRecord_arry ? this.serviceRecord_arry : '',
        loansAdvance: this.advancedLoan,
        calculationsPayDetails: this.Calculations_Pay_Details
          ? this.Calculations_Pay_Details
          : '',
        calculationsAdditionalAllowanceRecovery: this.Calculations_ARD_Details
          ? this.Calculations_ARD_Details
          : '',
        calculationsPensionDetails: this.Pension_Commutation
          ? this.Pension_Commutation
          : '',
        calculationsCommutationDetailsNomination: commutation_data
          ? commutation_data
          : '',
        bankTreasuryDetails: this.Banklist ? this.Banklist : '',
        documents: this.documentlist ? this.documentlist : '',
        employeeId: this.Personaldetail.employeeId,
        employeeCode: this.Personaldetail.employeeCode,
        createdByAid: this.empinfo.aid,
        createdByUserId: this.empinfo.userId,
        payeeId: this.Personaldetail.payeeId,
        conditionList: this.conditionList,
        ObjectionArray: this.ObjectionArray,
      },
      payloadSummary: payload_summary ? payload_summary : '',
    };
    // localStorage.setItem("approverSubmitData",JSON.stringify(data))
    this.config.storeDetails('approverSubmitData', JSON.stringify(data));
    let url = 'getreportpath';
    let data1 = {
      taskTranId: this.transId,
    };
    this._Service.postho(url, data1).subscribe((res: any) => {
      console.log('res', res);
      let data = res.data;

      let purl: string =
        this.routers['location']._platformLocation.location.origin;
      let url2: string = this.routers.url;
      let mainUrl = purl + '/pension/#' + '/pension/e-Pension/Profile';
      console.log('enter');
      let esigndata = {
        reportPath: data.reportPath,
        name: 'task_data_id',
        value: data.taskDataId,
        docTypeId: data.docTypeId,
        docName: data.docName,
        processId: '1',
        mainurl: mainUrl,
        requestId: this.reqid ? this.reqid : '',
      };
      // localStorage.setItem("esigntype","approver")
      this.config.storeDetails('esigntype', 'approver');
      this.esignRequest(esigndata);
    });
  }

  progress: number = 0;
  noOfFiles: number = 35;
  completed: boolean = false;
  uploadProgress = 0;

  delay(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
  async updateProgress() {
    this.completed = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay(35);
      this.progress = Math.round(i * n);
    }
    this.completed = true;
  }

  progress1: number = 0;
  noOfFiles1: number = 35;
  completed1: boolean = false;

  delay1(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }

  progress2: number = 0;
  noOfFiles2: number = 35;
  completed2: boolean = false;

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

  progress3: number = 0;
  noOfFiles3: number = 35;
  completed3: boolean = false;

  delay3(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
  async updateProgress3() {
    this.completed3 = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay3(35);
      this.progress = Math.round(i * n);
      console.log(i);
    }
    this.completed3 = true;
  }
  progress4: number = 0;
  noOfFiles4: number = 35;
  completed4: boolean = false;

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

  onSubmit_Final_ESS(action: any) {
    let commutation_data = {
      budgetHead: this.Calculations_Commutation_Details?.budgetHead,
      budgetHeadId: this.Calculations_Commutation_Details?.budgetHeadId,
      effectiveDate: this.Calculations_Commutation_Details?.effectiveDate,
      commutationAmount: this.Pension_Commutation?.commutationAmount,
      commutationFactor: this.Pension_Commutation?.commutedFactor,
      commutationValue: this.Pension_Commutation?.pensionCommuted,
    };

    let Deductions_Details = {
      Additional_Amount: this.Calculations_ARD_Details?.Additional_Amount,
      Recovery_Amount: this.Calculations_ARD_Details?.Recovery_Amount,
      Deduction_Amount: this.Calculations_ARD_Details?.Deduction_Amount,
    };
    let payload_summary = {
      empName: this.Personaldetail.nameEn,
      emp_Id: this.Personaldetail.employeeId,
      empCode: this.Personaldetail.employeeCode,
    };

    let data = {
      requestData: {
        processId: '1',
        taskSeq: '',
        processTaskSeq: '',
        taskTranId: this.transId,
        requestId: this.reqid,
        requestDesc: '',
        initiator: this.empinfo.aid,
        person_id: this.empinfo.userId,
        person_name: this.empinfo.displayName,
        action: action,
        // "remarks": this.Request_Confirmation.controls['Remarks'].value,
        payloadChangeFlag: 'Y',
        adApproveFlag: '',
      },
      payload: {
        personalDetails: this.Personaldetail,
        serviceDetails: this.ServiceDetails,
        addressDetails: this.EMPAddress,
        familyDetails: this.familyDetails,
        nominationDetails: this.nominee,
        serviceRecords: this.serviceRecord_arry ? this.serviceRecord_arry : '',
        loansAdvance: this.loanAndAdvancesDetails
          ? this.loanAndAdvancesDetails
          : '',
        calculationsPayDetails: this.Calculations_Pay_Details,
        calculationsAdditionalAllowanceRecovery: Deductions_Details
          ? Deductions_Details
          : '',
        calculationsPensionDetails: this.Pension_Commutation
          ? this.Pension_Commutation
          : '',
        calculationsCommutationDetailsNomination: commutation_data,
        bankTreasuryDetails: this.Banklist,
        Bank_Treasury_Details: this.Banklist,
        summary: this.Summary.value.is_agree,
      },

      payloadSummary: payload_summary,
    };

    this._Service.requestApplication(data, 'action').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.rid = res.request_id;

          this.modalService.dismissAll();
          this.dialog.open(CommonDialogComponent, {
            panelClass: 'dialog-w-50',
            autoFocus: false,
            data: {
              message: 'success',
              reqId: this.rid,
              id: 14,
              aid: this.empinfo.aid,
              ppo_no: 0,
            },
          });
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

  Complete: any;
  Comp: any;
  progressFiles: progress[] = [];
  fil: any;

  moveToSelectedTab(tabName: string) {
    if (this.userDetails.roleid == '1') {
      if (tabName == 'Address Details') {
        if (this.ServiceDetails.optForCommutation == 'Yes') {
          if (this.ServiceDetails.commuationPercentage == 0) {
            alert('Enter Commuation Percentage');
          } else {
            this.moveNext(tabName);
          }
        } else {
          this.moveNext(tabName);
        }
      } else if (tabName == 'Pension Details') {
        if (
          this.ServiceDetails.optForCommutation == 'Yes' &&
          !this.commutationDetails.value.effectiveDate
        ) {
          alert('Enter Commuation Effective Date');
        } else {
          this.moveNext(tabName);
        }
      } else {
        this.moveNext(tabName);
      }
    } else {
      this.moveNext(tabName);
    }
  }

  printPage() {
    window.print();
  }

  moveNext(tabName: string) {
    for (
      let i = 0;
      i < document.querySelectorAll('.mat-tab-label-content').length;
      i++
    ) {
      if (
        (<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i])
          .innerText == tabName
      ) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }

  get addDynamicElement() {
    return this.registrationForm?.get('addDynamicElement') as FormArray;
  }

  onChnage() {}
  onRemoveSpecialRequest(index: any) {
    const control = <FormArray>this.registrationForm?.get('addDynamicElement');
    control.removeAt(index);
  }

  get addDeduction() {
    return this.registrationForm?.get('addDeduction') as FormArray;
  }

  onRemoveDeduction(index: any) {
    let data = this.addDeduction.value;
    if (data[index].deductionType == 227 || data[index].deductionType == 231) {
      if (this.isHBA) {
        alert('Loan amount not remove here.');
        return;
      }
    }
    if (data[index].deductionType == 223 || data[index].deductionType == 224) {
      if (this.isMCA) {
        alert('Loan amount not remove here.');
        return;
      }
    }
    const control = <FormArray>this.registrationForm?.get('addDeduction');
    control.removeAt(index);
  }

  get addAllowanceType() {
    return this.registrationForm?.get('addAllowanceType') as FormArray;
  }

  onRemoveAllowance(index: any) {
    const control = <FormArray>this.registrationForm?.get('addAllowanceType');
    control.removeAt(index);
  }
  onSubmitAllowance() {
    if (
      this.recoveryFormNew.value.recoveryAmount == '' ||
      this.recoveryFormNew.value.recoveryAmount == null
    ) {
    } else {
      alert("Please click 'Add' Button to add Recovery");
      if (this.userDetails.roleid == '1') {
        this.moveToSelectedTab(
          'Types of Additional Allowance,Recovery and Deductions Details'
        );
      }
    }
    if (
      this.DeductionFormNew.value.deductionAmount == '' ||
      this.DeductionFormNew.value.deductionAmount == null
    ) {
    } else {
      alert("Please click 'Add' Button to add Deduction");
      if (this.userDetails.roleid == '1') {
        this.moveToSelectedTab(
          'Types of Additional Allowance,Recovery and Deductions Details'
        );
      }
    }
    if (
      this.AllowanceFormNew.value.allowanceAmount == '' ||
      this.AllowanceFormNew.value.allowanceAmount == null
    ) {
    } else {
      alert("Please click 'Add' Button to add Allowance");
      if (this.userDetails.roleid == '1') {
        this.moveToSelectedTab(
          'Types of Additional Allowance,Recovery and Deductions Details'
        );
      }
    }
    if (
      this.WithHeldFormNew.value.withHeldAmount == '' ||
      this.WithHeldFormNew.value.withHeldAmount == null
    ) {
    } else {
      alert("Please click 'Add' Button to add WithHeld");
      if (this.userDetails.roleid == '1') {
        this.moveToSelectedTab(
          'Types of Additional Allowance,Recovery and Deductions Details'
        );
      }
    }
  }
  get addWithHeld() {
    return this.registrationForm.get('addWithHeld') as FormArray;
  }

  onRemoveWithHeld(index: any) {
    const control = <FormArray>this.registrationForm?.get('addWithHeld');
    control.removeAt(index);
  }

  Allowance: any;
  getAllowance() {
    this._Service
      .postdeduction({ allDeductionType: 'A' }, 'getAllowance')
      .subscribe({
        next: (res) => {
          if ((res.status = 200)) {
            this.Allowance = res.data;
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
  deduction: any;
  getDeduction() {
    this._Service
      .postdeduction({ allDeductionType: 'D' }, 'getDeduction')
      .subscribe({
        next: (res) => {
          if ((res.status = 200)) {
            this.deduction = res.data;
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
  WithHeldReasons: any;
  getWithHeldReasons() {
    this._Service.postdeduction(null, 'getWithHeldReasons').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.WithHeldReasons = res.data;
        }
      },
      error: (err) => {
        this.error = err;
      },
    });
  }
  Recovery: any;
  getRecovery() {
    this._Service.postdeduction(null, 'getRecovery').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.Recovery = res.data;
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
  pensionSetPreview() {
    var data2: any;
    let url = 'getreportpath';
    let data1 = {
      taskTranId: this.transId,
    };
    this._Service.postho(url, data1).subscribe((res: any) => {
      console.log('res', res);
      data2 = res.data;
      // data2=JSON.parse(data2);
      this.pdfpreview(data2);
    });
  }
  pdfpreview(data2: any) {
    console.log('preview', data2);

    let data = {
      reportPath: data2.reportPath,
      format: 'pdf',
      params: [
        {
          name: 'task_data_id',
          value: data2.taskDataId,
        },
      ],
    };
    console.log('single report data', data);
    this._Service.postOr('report/singlereport', data).subscribe((res: any) => {
      console.log('res', res.data.report.content);
      if (res.data.report.content) {
        const byteArray = new Uint8Array(
          atob(res.data.report.content)
            .split('')
            .map((char) => char.charCodeAt(0))
        );
        // this.pdfSrc = "";
        const file = new Blob([byteArray], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        // this.pdfSrc = fileURL;
        const pdfWindow = window.open('');
        pdfWindow!.document.write(
          "<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>"
        );
      }
    });
  }

  FRPreview() {
    let data = {
      reportPath: '/VOB_REPORT/SANCTION_BENIFICARY.xdo',
      format: 'pdf',
      params: [
        {
          name: 'task_data_id',
          value: '185',
        },
      ],
    };

    let url = 'getpdffiles';

    this._Service.postNewEsign(url, data).subscribe((res: any) => {
      res = JSON.parse(res);
      console.log('res', res.data.document[0].content);
      let base64Pdf = res.data.document[0].content;
      if (base64Pdf) {
        const byteArray = new Uint8Array(
          atob(base64Pdf)
            .split('')
            .map((char) => char.charCodeAt(0))
        );

        const file = new Blob([byteArray], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);

        const pdfWindow = window.open('');
        pdfWindow!.document.write(
          "<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>"
        );
      } else {
        alert('Some error occured.');
      }
    });
  }
  isAgree(i: any) {
    alert(this.Summary.value.is_agree);
  }
  removeUploadDoc(i: any, in1: any) {
    console.log('document removed', i);

    let rajIndex = 0;
    this.documentlist.filter((data: any, index: number) => {
      if (data.docName == i) {
        rajIndex = index;
        return data;
      }
    });

    this.documentlist[rajIndex].dmsDocId = null;
    this.removeDoc[in1] = false;
    //this.documentlist[rajIndex]['newDocName']=data.doc_name;
    console.log('documentlist', this.documentlist);
    if (i == 'Marriage Certificate') {
      this.isMdown = false;
    } else if (i == 'Retirement Order Sanction') {
      this.isRe = false;
    } else if (i == 'No DE Certificate') {
      this.isDe = false;
    } else if (i == 'Bank Passbook First Page/Cancelled Cheque') {
      this.ischq = false;
    }
  }
  removeUploadDoc2(i: any) {
    console.log('document removed', i);

    let rajIndex = -1;
    this.documentlist.filter((data: any, index: number) => {
      if (data.docName == i) {
        rajIndex = index;
        return data;
      }
    });

    this.documentlist[rajIndex].dmsDocId = null;

    //this.documentlist[rajIndex]['newDocName']=data.doc_name;
    console.log('documentlist', this.documentlist);
    if (i == 'Marriage Certificate') {
      this.isMdown = false;
    } else if (i == 'Retirement Order Sanction') {
      this.isRe = false;
    } else if (i == 'No DE Certificate') {
      this.isDe = false;
    } else if (i == 'Bank Passbook First Page/Cancelled Cheque') {
      this.ischq = false;
    } else if (i == 'Accounts Personnel Certificate') {
      this.file = undefined;
      this.IsAcc = false;
    }
  }
}
