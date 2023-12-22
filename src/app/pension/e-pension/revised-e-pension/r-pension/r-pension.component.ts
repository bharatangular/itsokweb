import { FormArray } from '@angular/forms';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { DatePipe } from '@angular/common';
import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FamilyDetailsPopupComponent } from 'src/app/family-details-popup/family-details-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatStepper } from '@angular/material/stepper';
import { CommonDialogComponent } from '../../../common-dialog/common-dialog.component';
import { PdfPreviewComponent } from './../../pdf-preview/pdf-preview.component';
import { RedirectService } from 'src/app/services/redirect.service';
import { EsignModalComponent } from '../../../esign-modal/esign-modal.component';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { ServiceRecordDialogComponent } from '../../../service-record-dialog/service-record-dialog.component';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CommonService } from 'src/app/services/common.service';
import { RevisedPensionerDetailsComponent } from '../revised-pensioner-details/revised-pensioner-details.component';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

interface City {
  value: string,
  viewValue: string
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
  size: string,
  id: number
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
  selector: 'app-r-pension',
  templateUrl: './r-pension.component.html',
  styleUrls: ['./r-pension.component.scss'],
  providers: [
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false } },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class RPensionComponent implements OnInit {
  isAddCer:boolean=false;
  tBasicPayReason:any;
  npa:any;
  specialPay:any;
  tenBasicPay: any;
  tenPayLevel: any;
  exMilitaryMan: any
  isLr: boolean = false
  isCommutation: boolean = false;
  removeDoc: boolean[] = []
  is_Disabled: boolean = true;
  Banklist: any = [];
  serviceRecordForm !: FormGroup;
  loanAndAdvancesDetails: any;
  payload_summary: any;
  Pension_Commutation: any = {
    "monthlyPensionTreasury": ""
  };
  Calculations_Pay_Details: any;
  Calculations_Pension_Details: any;
  Calculations_Commutation_Details: any;
  Calculations_ARD_Details: any;
  isMaker1: boolean = false;
  isEdit: boolean = true;
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
  show: boolean = false
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
  message: string = "Are you sure?"
  hide = true;
  deTypeStatus: any;
  deTypeName: any;
  isDisabled: boolean = true;
  userDetails: any = {
    "role": "",
    "roleid": "",
    "assignmentid": "",
    "officeid": "",
    "treasCode": "",
    "treasName": ""
  };
  advancedLoan: any[] = [];
  conditionForm !: FormGroup;
  commutationDetails!: FormGroup;
  registrationForm !: FormGroup;
  recoveryForm!: FormGroup;
  jointImageUrl: any = "assets/images/jointImg.jfif";
  imageUrl: any = "assets/images/userImg.png";
  signimageUrl: any = "assets/images/signature.png";
  editFile: boolean = true;
  removeUpload: boolean = false;
  @ViewChild('fileInput') el!: ElementRef;
  Personaldetail2: any;
  serCatId: any;
  Personaldetail: any;
  ServiceDetails: any = {
    addedServices:'No',
    addedJoiningDate:''
  };
  residenceAddress: any;
  interests: City[] = [];
  Request_Confirmation !: FormGroup;
  formGroup !: FormGroup;
  Summary !: FormGroup;
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
  serviceRecordDatanew: any
  mainUrl: any;
  pendingListMaker: boolean = false;
  isRemoveDe: boolean[] = [];
  date11: any;
  lRnumber: any = '';
  IsAcc: boolean = false;
  wrongType: boolean = false;
  isLoading2:boolean=false;
  nonQualifyingService: any;
  QualifyingService: any
  calQualifying: any[] = [];
  calNonQualifying: any[] = [];
  isMilitry: any = 0
  step = 0;
  stepFamily = 0;
  stepc = 0;
  enhanceDate: any
  commucationDate: any;
  isgovHouseAlloted: boolean = false;
  revisedMaker:boolean=false
  dateValue: any;
  psnTypeId:any;
  pType:any;
  isTLPC:boolean=false;
  //#region CONSTRUCTOR
  constructor(
    private formbuilder: FormBuilder,
    private _Service: PensionServiceService,
    private cd: ChangeDetectorRef,
    private datepipe: DatePipe,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private routers: Router, private http: HttpClient,
    private date: DatePipe,
    private redirectService: RedirectService,
    public actRoute: ActivatedRoute,
    public load: LoaderService,
    private tokenInfo: TokenManagementService,
    private imageCompress: NgxImageCompressService,
    public common:CommonService
  ) {

  }
  //#endregion CONSTRUCTOR
 

  ngOnInit(): void {

    this.userDetails = this.config.getUserDetails();

    this._Service.configMenu = { url: "Inbox  >  Revised Pension" };
    console.log('userdetails', this.userDetails);
if(this.userDetails.roleid=='1')
{
  this.isEdit=false;
}
    this.assignmentId = this.userDetails.assignmentid;
    this.actRoute.queryParams.subscribe(params => {

      var esignRes = params['status'];
      var id = params['id'];
      var makerRevert = params['m'];
      if (makerRevert == "qweraZaS") {

        this.pendingListMaker = true;
      }
      var rMaker = params['r'];
      if (rMaker == "wqSqurs") {

        this.revisedMaker = true;
      }
      if (esignRes) {
        if (id) {

          this.getEsignData(id);

        }
      }

    });


console.log(this.revisedMaker)
    this.progress = 0;
    this.Complete = 0;
    this.reqid = this.config.getDetails("reqId");
    this.transId = this.config.getDetails("transid");
    this.taskRoleId = this.config.getDetails("taskRoleId");
    this.employeeCode = this.config.getDetails('employeeCode');
    this.employeeId = this.config.getDetails('employeeId');
    this.wfProcessId = this.config.getDetails('wfProcessId');
    this.psnType = this.config.getDetails('psnType');
    this.psnTypeId = this.config.getDetails('psnTypeId');
    this.empinfo = this.tokenInfo.empinfoService;;
    this.treasury = this.userDetails.treasCode;
    this.treasuryName = this.userDetails.treasName;
    console.log(" this.treasuryCode", this.treasury)

    if(this.psnTypeId=="68")
    {
    this.pType="Superannuation"
    }else if(this.psnTypeId=="69")
    {
      this.pType="Voluntary Retirement Pension U/R 50"
    }else
    {
      this.pType="Superannuation"
    }
    this.getDeduction();
    this.getAllowance();
    this.getWithHeldReasons();
    this.getTreasury();
    this.getObjection();
    if (this.userDetails.roleid == '1' && !this.pendingListMaker && !this.revisedMaker) {
      this.isMaker = true;
      this.isCheckerOrApprover = false;

      this.fetchPersonaldetail();
      this.fetchServicesdetail();

      
      this.fetchAddressesEmp();
      this.getFamilyDetails();
      this.getNomination();
      this.getPension_Commutation();
      this.Bank_Detail();
      this.fetchpersonalEmp();
      this.getAllUploadedDocumentDetailsByEmployeeCode();
      this.getLoanAndAdvancesDetails();
      this.get_Service_Records();
      setTimeout(() => {                           // <<<---using ()=> syntax
        this.checkDisable();
      }, 3000);

      // this.getRecovery();
    }
    else if (

      this.userDetails.roleid == '1' && this.pendingListMaker
    ) {
      this.isMaker = true;
      this.isCheckerOrApprover = false;
      this.getTaskDetailMaker(this.transId);
    }else if (

      this.userDetails.roleid == '1' && this.revisedMaker
    ) {
      this.isMaker = true;
      this.isCheckerOrApprover = false;
      this.getTaskRevisedMaker(this.employeeCode);
    }
    else {
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
      deductionHead: new FormControl('', Validators.required)

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
      ObjectionTextOther: new FormControl(''),

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
      condition_12_Amount: new FormControl('')
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
      addWithHeld: this.formbuilder.array([])
    });
    this.recoveryForm = this.formbuilder.group({

    });

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
        if (data.docName == "No DE Certificate") {
          rajIndex = index;
          return data;
        }
      })
      if (data.doc_id)
        this.documentlist[rajIndex].dmsDocId = data.doc_id;
      delete data.doc_id;
      delete data.doc_name;
      //console.log("new data", data);
      this.serviceRecordDatanew = data
      this.serviceRecord_arry_List = [];

      this.pension_calculation(data);
      this.serviceRecord_arry_List.push(data)
      if (data.deStatus == "1") {
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
    })

    this._Service.userActivated1.subscribe((data: any) => {
      this.serviceRecord_arry.push(data)

    })
  }
  removeobj(i: any, data: any) {

    this._Service.getCurrentDate();

    setTimeout(() => {
      this.ObjectionArray[i].rejected = true;
      this.ObjectionArray[i].rejectedDate = this._Service.currentDate;
    }, 500);
  }
  addRecovery() {
    let data=this.recoveryFormNew.value.recoveryHead
    if(data.length<15)
  {
    alert("please add full Budget-Head.")
    return;
  }
  if(data.length>20)
  {
    alert("Max Budget-Head length 20.")
    return;
  }
    if (this.recoveryFormNew.valid) {
      this.addDynamicElement.push(
        this.formbuilder.group({
          recoveryType: new FormControl(this.recoveryFormNew.value.recoveryType),
          recoveryAmount: new FormControl(this.recoveryFormNew.value.recoveryAmount),
          recoveryHead: new FormControl(this.recoveryFormNew.value.recoveryHead)
        })

      );
      this.recoveryFormNew.reset();
    } else {
      alert("Please check all fields properly.")
    }

  }
  addDed() {
    let data=this.DeductionFormNew.value.deductionHead
    if(data.length<15)
  {
    alert("please add full Budget-Head.")
    return;
  }
  if(data.length>20)
  {
    alert("Max Budget-Head length 20.")
    return;
  }
    if (this.DeductionFormNew.valid) {
      this.addDeduction.push(
        this.formbuilder.group({
          deductionType: new FormControl(this.DeductionFormNew.value.deductionType),
          deductionName: new FormControl(this.DeductionFormNew.value.deductionName),
          deductionAmount: new FormControl(this.DeductionFormNew.value.deductionAmount),
          deductionHead: new FormControl(this.DeductionFormNew.value.deductionHead)
        })
      );
      this.isRemoveDe[this.addDeduction?.length - 1] = true;
      this.DeductionFormNew.reset();
    } else {
      alert("Please check all fields properly.")
    }

  }
  addAll() {
    let data=this.AllowanceFormNew.value.allowanceHead
    if(data.length<15)
  {
    alert("please add full Budget-Head.")
    return;
  }
  if(data.length>20)
  {
    alert("Max Budget-Head length 20.")
    return;
  }
    if (this.AllowanceFormNew.valid) {
      this.addAllowanceType.push(
        this.formbuilder.group({
          allowanceType: new FormControl(this.AllowanceFormNew.value.allowanceType),
          allowanceName: new FormControl(this.AllowanceFormNew.value.allowanceName),
          allowanceAmount: new FormControl(this.AllowanceFormNew.value.allowanceAmount),
          allowanceHead: new FormControl(this.AllowanceFormNew.value.allowanceHead)
        })

      );
      this.AllowanceFormNew.reset();
    } else {
      alert("Please check all fields properly.")
    }

  }
  addWithheld() {
    if (this.WithHeldFormNew.valid) {
      if (this.addWithHeld?.length < 1) {
        this.addWithHeld.push(
          this.formbuilder.group({
            withHeldType: new FormControl(this.WithHeldFormNew.value.withHeldType),
            withHeldName: new FormControl(this.WithHeldFormNew.value.withHeldName),
            withHeldAmount: new FormControl(this.WithHeldFormNew.value.withHeldAmount),
            withHeldReason: new FormControl(this.WithHeldFormNew.value.withHeldReason)
          })

        );
        this.WithHeldFormNew.reset();
      } else {
        alert("Only one entry allowed.")
      }

    } else {
      alert("Please check all fields properly.")
    }

  }
  alertUser() {
    alert("Please click 'Add' button for submit details.")
  }
  onChangeDeduction(id: any) {
    if (this.deduction?.length > 0) {

      let data = this.deduction.filter((x: any) => x.allDeductionOrAllowanceId == id)[0].allDeductionOrAllowanceName;

      this.DeductionFormNew.patchValue({
        deductionName: data

      })
    }


  }
  DeductionName(id: any) {
    if (id)
      return this.deduction.filter((x: any) => x.allDeductionOrAllowanceId == id)[0].allDeductionOrAllowanceName;
  }
  onChangeDeductionAllow(id: any) {

    let data = this.Allowance.filter((x: any) => x.allDeductionOrAllowanceId == id)[0].allDeductionOrAllowanceName;
    this.AllowanceFormNew.patchValue({
      allowanceName: data
    })
  }


  onChangeDeductionWithHeld(id: any) {
    let data = this.WithHeldReasons.filter((x: any) => x.withHeldReasonId == id)[0].withHeldReasonDesc;
    this.WithHeldFormNew.patchValue({
      withHeldName: data
    })
  }
  checkDisable() {

    if (this.Personaldetail?.disable == 'N') {
      if (this.docList?.length > 0)
        this.docList = this.docList.filter(item => item.docName != "Disability Certificate");
    }
    if (this.Personaldetail?.disable == '0') {
      if (this.docList?.length > 0)
        this.docList = this.docList.filter(item => item.docName != "Disability Certificate");
    }
  }
  getDedctionTypeName(i: any) {

    if (i) {
      if (this.deduction?.length > 0)
        return this.deduction.filter((x: any) => x.allDeductionOrAllowanceId == i)[0].allDeductionOrAllowanceName
    } else {
      return "";
    }

  }

  getAllowanceTypeName(i: any) {
    if (i) {
      if (this.Allowance?.length > 0)
        return this.Allowance.filter((x: any) => x.allDeductionOrAllowanceId == i)[0].allDeductionOrAllowanceName;
    }

    else
      return "";
  }

  getwithheldTypeName(i: any) {
    if (i) {
      if (this.WithHeldReasons?.length > 0)
        return this.WithHeldReasons.filter((x: any) => x.withHeldReasonId == i)[0].withHeldReasonDesc;
    }

    else
      return "";


  }

  getLRnumber() {

    this.treasury = this.Banklist.treasuryCode;
    let data = {
      "inTreasCode": this.treasury,
      "inEmpId": this.Personaldetail.employeeId,
      "inRevised": "0"
    }
    this._Service.post("getlrnumber", data).subscribe((res: any) => {

      console.log("result", res);
      if (res.status == 'SUCCESS') {
        this.lRnumber = res.data;

      }else
      {
        alert("LR Number not generated.refresh page.")
      }
    })
  }
 
  extension(file: any) {
    let type = file.name.split('.').pop();

    if (type == 'pdf') {
      return true
    }
    return false
  }
  nextUpload(event: Event, stepper: MatStepper) {
    console.log(this.documentlist)
    let accountCerDocId = this.documentlist.filter((x: any) => x.docName == 'Revised APC')[0]?.dmsDocId;
    console.log(accountCerDocId)
    if (accountCerDocId) {

      stepper.next();
      return true;
    } else {
      alert('Please Upload Revised Accounts Personnel Certificate');
      return false;
    }


  }
 
  checkar_doc(event: any) {

    let time1 = new Date();

    this.file = event.target.files[0];
    let ex2: any[] = this.file.name.split(".");
    console.log("size", this.file.size / 1024)
    if (ex2[1].includes('PDF') || ex2[1].includes('pdf')) {

    } else {
      alert("Only PDF file format allowed")
      return;
    }

    if ((this.file.size / 1024) > 2048) {
      alert("Max 2 MB file size allowed")
      return;
    }

    this.fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + "." + ex2[1];
    this.fileName = this.fileName.replace(" ", "")
    const formData = new FormData();
    formData.append("file", this.file);
    formData.append("filename", this.fileName);
    this.isLoading2=true
    const docTypeId = "195"
 
    this._Service.postOr("wcc/uploadfile",formData).subscribe((res:any)=>{
      this.isLoading2=false;
      let data =
        {
          "docTypeId": docTypeId,
          "dmsDocId": res.data.document[0].docId,
          "docName": "Revised APC",
        }

        if (res.data.document[0].docId) {
          let rajIndex = -1;
          this.documentlist.filter((data: any, index: number) => {
            if (data.docName == "Revised APC") {
              rajIndex = index;
              return data;
            }
          })
          if (rajIndex == -1) {
            this.documentlist.push(data);
          } else {
            this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
          }
          console.log("document_list", this.documentlist);

          alert("Document Uploaded Successfully.")
          this.IsAcc = true;
        } else {
          alert("Some error occured.")
        }

    },(error)=>{
      this.isLoading2=false;
      alert("Some Error Occured")
    })



    // const employeeId = this.employeeId
   
    // const reader = new FileReader();
    // var data4: any;
    // reader.onloadend = () => {
    //   //console.log(reader.result);

    //   data4 = reader.result;
    //   let data5 = data4.toString()
    //   data5 = data5.replace("data:application/pdf;base64,", "")
    //   let data = {
    //     "type": "pension",
    //     "sourceId": 2,
    //     "docAttributes": [

    //     ],
    //     "data": [
    //       {
    //         "docTypeId": docTypeId,
    //         "docTypeName": "AccountsPersonnelCertificate",
    //         "docName": this.fileName,
    //         "docTitle": "Certificate",
    //         "content": data5
    //       }
    //     ]
    //   }

    //   this._Service.postOr("wcc/uploaddocs", data).subscribe((res: any) => {

    //     let data =
    //     {
    //       "docTypeId": docTypeId,
    //       "dmsDocId": res.data.document[0].docId,
    //       "docName": "Accounts Personnel Certificate",
    //     }

    //     if (res.data.document[0].docId) {
    //       let rajIndex = -1;
    //       this.documentlist.filter((data: any, index: number) => {
    //         if (data.docName == "Accounts Personnel Certificate") {
    //           rajIndex = index;
    //           return data;
    //         }
    //       })
    //       if (rajIndex == -1) {
    //         this.documentlist.push(data);
    //       } else {
    //         this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
    //       }
    //       console.log("document_list", this.documentlist);

    //       alert("Document Uploaded Successfully.")
    //       this.IsAcc = true;
    //     } else {
    //       alert("Some error occured.")
    //     }

    //   })
    // };
    // reader.readAsDataURL(this.file);
  }

 
  addServiceRecord1() {
    this.calNonQualifying = [];
    this.calQualifying = [];
    let nonQualifying: any[] = [];

    nonQualifying = this.serviceRecordDatanew.serviceRecordDetails.filter((x: any) => {
      if (x.qualifying == "N") {
        return x;
      }
    })


    //console.log("non quali", nonQualifying)

    let Qualifying: any[] = [];

    Qualifying = this.serviceRecordDatanew.serviceRecordDetails.filter((x: any) => {
      if (x.qualifying == "Y") {
        return x;
      }
    })
    let militry: any[] = [];

    militry = this.serviceRecordDatanew.serviceRecordDetails.filter((x: any) => {
      if (x.qualifying == "A") {
        return x;
      }
    })

    if (militry.length >= 1) {
      this.isMilitry = 1;
    }

    let totalnonQualiService: any = 0 + ' years ' + 0 + ' months ' + 0 + ' days ';
    let totalnon: any = 0;
    for (let t of nonQualifying) {
      totalnon = totalnon + Number(t.totalDays)
      // totalnonQualiService=this.addTimeofService(totalnonQualiService,t.serviceLengh)
    }
    console.log("totalnonQualiService", totalnonQualiService)

    let totalQua: any = 0;
    for (let t of Qualifying) {
      totalQua = totalQua + Number(t.totalDays)
    }
    //console.log("totalQua", totalQua)
    var years = Math.floor(totalQua / 365);
    var yearRemainder = Math.floor(totalQua % 365)

    var months = Math.floor(yearRemainder / 30);
    var days = Math.floor(totalQua % 365 % 30);


    this.QualifyingService = "";
    this.QualifyingService = (years) + ' years ' + (months) + ' months ' + (days) + ' days ';
    //console.log("QualifyingService", this.QualifyingService);

    var years = Math.floor(totalnon / 365);
    var yearRemainder = Math.floor(totalnon % 365)

    var months = Math.floor(yearRemainder / 30);
    var days = Math.floor(totalnon % 365 % 30);


    this.QualifyingService = "";
    this.nonQualifyingService = (years) + ' years ' + (months) + ' months ' + (days) + ' days ';
    //console.log("nonQualifyingService", this.nonQualifyingService);

    for (let q of Qualifying) {
      let data = {
        "fromDate": q.fromDate,
        "toDate": q.toDate
      }
      this.calQualifying.push(data)
    }
    //console.log("calQualifying", this.calQualifying);
    for (let q of nonQualifying) {
      let data = {
        "fromDate": q.fromDate,
        "toDate": q.toDate
      }

      this.calNonQualifying.push(data)
    }
    // console.log("calNonQualifying", this.calNonQualifying);
  }
  getEsignData(id: any) {

    let data = {
      "trxnNo": id,
      "databaseKey": "3"
    }
    let url = "esignTransaction";

    this._Service.postNewEsign(url, data).subscribe((res: any) => {


      this.esignData = JSON.parse(res);
      if (this.esignData.responseStatus == '1') {

        if (this.config.getDetails("esigntype") == 'FR') {

          this.pkEsignData = JSON.parse(this.config.getDetails("pkEsignData"));
          this.updateDocId(36)
          let data = {
            "esignRes": "SUCCESS",
            "transId": id,
            "redirectUrl": "pension/Inbox",
            "type": "pk",
            "pkesigndata": this.pkEsignData
          }
          this.dialog.open(EsignModalComponent, { panelClass: 'dialog-w-30', data: { message: data } , disableClose: true });
        } else {

          if (this.config.getDetails("esigntype") == 'approver') {
            let data = {
              "esignRes": "SUCCESS",
              "transId": id,
              "redirectUrl": "pension/Inbox",
              "bill": "0"
            }
            this.dialog.open(EsignModalComponent, { panelClass: 'dialog-w-30', data: { message: data }, disableClose: true  });
          } else {
            if(this.esignData.docName.includes('FR'))
            {
              alert("Some error in Pension-Kit e-sign.Please again esign Pension Kit from Pending E-sign");
              this.routers.navigate(['pension/e-Pension/pendingEsign'])
            }else if(this.esignData.docName.includes('PK'))
            {
              this.updateDocId(34);
              let data = {
                "esignRes": "SUCCESS",
                "transId": id,
                "redirectUrl": "pension/Inbox",
                "bill": "0"
              }
              this.dialog.open(EsignModalComponent, { panelClass: 'dialog-w-30', data: { message: data } , disableClose: true });
            }
           
          }

        }



        // this.billProcess();
      } else {
        if (this.config.getDetails("esigntype") == 'FR') {
          let data = {
            "esignRes": "failed",
            "type": "pk",
            "redirectUrl": "pension/Inbox",

          }
          this.dialog.open(EsignModalComponent, { panelClass: 'dialog-w-30', data: { message: data } });
        } else {
          let data = {
            "esignRes": "failed",
            "type": "",
            "redirectUrl": "pension/Inbox",

          }
          this.dialog.open(EsignModalComponent, { panelClass: 'dialog-w-30', data: { message: data } });
        }
      }
      //console.log("esignData", this.esignData);
    })
  }
  updateDocId(docTypeId: any) {
    let pensionerId = this.config.getDetails("pensionerId");
   
    let data = {
      "dmsDocId": this.esignData.docId,
      "pensionerId": pensionerId,
      "docTypeId": docTypeId
    }
    this._Service.postPssRequest(data, "pensionerdocument").subscribe({
      next: (res) => {
        //console.log("res", res);
        if (res.status == "SUCCESS") {
        } else {
          // alert("Something went wrong");
        }
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

  billProcess() {
    var randNumber = (Math.random() * 10000).toFixed(0);
    let data = {
      "billNo": randNumber
    }
    let url = "saveBill";

    this._Service.postSavebill(url, data).subscribe((res: any) => {
      //console.log("billdata", res);

    })
  }

  get_Service_Records() {

    let data =
    {
      "employeeId": this.employeeId
    }

    this._Service.postRequestpension(data, 'getOtherServiceDetailsByEmployeeId').subscribe({
      next: (response) => {
        if (response.status = 200) {
          this.serviceRecord = response.data;

          let data = {

            "totalServiceLength": this.serviceRecord.totalServiceDuration,

            "deStatus": '',
            "deType": '',
            "deStartDate": '',
            "deEndDate": '',
            "penalty": '',
            "penaltyType": '',
            "remark": '',
            "id": 1,
            "totalNoOfDays": this.serviceRecord.totalNoOfDays,

            "nonQualifyingServiceDate_p": '',
            "serviceRecordDetails": [
            ]
          }
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
          response: err
        }
      }

    });

  }

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
    return new Date().toISOString().split('T')[0]
  }

  //#region PROFILE

  // ****************************PERSONAL DETAIL****************************************
  isLoadingSPic:boolean=false
  isLoadingJPic:boolean=false
  uploadFile(event: any, i: any) {
  

    const file = event.target.files[0];

    if (file) {
        const fileType = file.type;

        if (fileType.includes('pdf')) {

            alert("Selected file is a PDF");

        } 
        else if (fileType.includes('image')) {

            const reader = new FileReader();

            reader.onloadend = (e: any) => {
              console.log("Old file", file);

                const maxSize = 200 * 1024; // 100KB in bytes
                let quality = 75; // Initial quality setting

                const compressRecursive = () => {
                    const base64String = e.target.result;
                    this.imageCompress
                        .compressFile(base64String, -1, quality, quality) // third argument is ratio, forth argument is quality
                        .then(compressedImage => {
                            const blob = this.dataURItoBlob(compressedImage);
                            const compressedSize = blob.size;
                            if (compressedSize <= maxSize) {
                                const jpegFile = new File([blob], file.name, {
                                    type: 'image/jpeg'
                                });
                                this.displayConvertedFile(jpegFile, i);
                            } else {
                                quality -= 5;
                                compressRecursive();
                            }
                        });
                }
                compressRecursive();
            };
            reader.readAsDataURL(file);

        } 
        else {

            alert("Selected file is not a PDF or image");

        }
    }

}
dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: 'image/jpeg' });
}
displayConvertedFile(file: File, i: any) {
  console.log("New file",file);
  let ex2: any[] = file.name.split(".");
  let time1 = new Date();
  const fileName =  "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".jpeg" ;

  var data4: any;
  const reader = new FileReader();
  //return;
  reader.onloadend = () => {
      data4 = reader.result;
      let data5 = data4.toString()
      let data6: any[] = [];
      data6 = data5.split("base64,")

      //console.log(data6);
      let data1 = {
          "type": "image",
          "sourceId": 2,
          "docAttributes": [

          ],
          "data": [{
              "docTypeId": "1",
              "docTypeName": "photo",
              "docName": fileName,
              "docTitle": "essdoc",
              "content": data6[1]
          }]
      }
      //console.log("data", data1);
      if(i==1)
      this.isLoadingSPic=true
      else
      this.isLoadingJPic=true
      this._Service.postOr("wcc/uploaddocs", data1).subscribe((res: any) => {
          //console.log("res", res);
          console.log("res", res);
          if(i==1)
  this.isLoadingSPic=false
  else
  this.isLoadingJPic=false
    if (res.data.document[0].docId) {
      
      if(i==1)
      {
        this.imageUrl=data5
       
        this.Personaldetail.selfPhotoId=res.data.document[0].docId
        let docCheck: any[] = []
      docCheck = this.documentlist.filter((x: any) => x.docTypeId == 33)
      let rajIndex: any
      if (docCheck.length != 0) {
        this.documentlist.filter((data: any, index: number) => {
          if (data.docTypeId == 33) {
            rajIndex = index;
            return data;
          }
        })
        this.documentlist[rajIndex].dmsDocId=res.data.document[0].docId
      }
  
      console.log("this.documentlist", this.documentlist);
       
      }
  else if(i==2)
      {
        this.jointImageUrl=data5
        this.Personaldetail.jointPhotoId=res.data.document[0].docId;
        let docCheck: any[] = []
      docCheck = this.documentlist.filter((x: any) => x.docTypeId == 32)
      let rajIndex: any
      if (docCheck.length != 0) {
        this.documentlist.filter((data: any, index: number) => {
          if (data.docTypeId == 32) {
            rajIndex = index;
            return data;
          }
        })
        this.documentlist[rajIndex].dmsDocId=res.data.document[0].docId
      }
      console.log("this.documentlist", this.documentlist);
       
    }
      }


      },(error)=>{
        if(i==1)
  this.isLoadingSPic=false
  else
  this.isLoadingJPic=false
        alert("Some Error Occured")
      })
  };
  reader.readAsDataURL(file);



}
isSelfPic:boolean=false;
isJointPic:boolean=false;
  fetchPersonaldetail() {
    let data = {
      employeeId: this.employeeId
    }
    this._Service.postRequestpension(data, 'getPersonaldetailsByEmpCode').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.Personaldetail = res.data[0];
          this.Personaldetail = JSON.parse(JSON.stringify(this.Personaldetail).replace(/\:null/gi, "\:\"\""));
          //console.log("this.Personaldetail", this.Personaldetail);
          this.commutationDateCalculation2();
          this.Personaldetail2 = res.data[0];
          let dd = res.data[0].dateOfBirth
          this.Personaldetail.dateOfBirth = this.date.transform(this.Personaldetail.dateOfBirth, 'dd-MM-yyyy')
          let datatime = dd.toString().substring(0, dd.length - 5);
          this.dateOfBirth = this.datepipe.transform(datatime, 'dd-MM-yyyy')
          this.dateofRetirement = this.Personaldetail.dor;

          let date1;
          console.log("sssss", this.Personaldetail.comDate);
          if(this.Personaldetail?.pan=='' || this.Personaldetail?.pan==null || this.Personaldetail?.pan==undefined)
          {
            alert("Employee PAN Number is not updated on Pention-ESS.Please update PAN on Pension-ESS before Pension initiate.");
          }
          if (this.Personaldetail.comDate == null || this.Personaldetail.comDate == "") {
            date1 = "";
            console.log("ddpersonelse", date1);
          }
          else {
            
            let comm = this.Personaldetail?.comDate.split('[')
            this.commucationDate = comm[0];
           
            this.Personaldetail.comDate=this.commucationDate;
            let comDate:any=moment(this.commucationDate).format();
            let dor:any=moment(this.dateofRetirement).format();
            let comDate1=new Date(comDate);
            let dor1=new Date(dor);
            if(comDate1.getTime()>dor1.getTime())
            {

              comDate1.setDate(1);
              comDate1.setMonth(comDate1.getMonth()+1);
              this.commutationDetails.patchValue({ effectiveDate: comDate1 });
              date1 = comDate1;
              this.commucationDate=comDate1;
            }else
            {
              
              date1=Number(this.psnTypeId)==69?dor1:dor1.setDate(dor1.getDate() + 1);
              this.commucationDate=new Date(date1)
              this.commutationDetails.patchValue({ effectiveDate: this.commucationDate });
              this.commucationDate=date1;
            }
          
           
            console.log("ddpersonif", date1);
          }
          if (this.Personaldetail?.govHouseAlloted == 'Y') {
            this.isgovHouseAlloted = true
          } else {
            this.isgovHouseAlloted = false
          }
          let dates = new Date(this.dateofRetirement)
          // this.conditionForm.patchValue({ condition_1_Date: dates });
          this.maxDate2 = new Date(this.dateofRetirement);
          if(Number(this.psnTypeId)==69)
        {}else{
          this.maxDate2 = new Date(this.maxDate2.getFullYear(), this.maxDate2.getMonth(), this.maxDate2.getDate() + 1)
        }
          console.log("maxDate2", this.maxDate2);
          if (this.Personaldetail?.selfPhotoId > 0){
            this.showPic(this.Personaldetail.selfPhotoId);
            this.isSelfPic=true
          }
         
          if (this.Personaldetail?.jointPhotoId > 0)
          {
            this.jointPic(this.Personaldetail.jointPhotoId);
            this.isJointPic=true
          }
          
          this.conditionForm.patchValue({ condition_1_Date: new Date() })
          //this.commutationDateCalculation(date1);
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
      }

    });

  }


  // ****************************SERVICE DETAIL****************************************
  revisedCommutation:boolean=false
  fetchServicesdetail() {

    let data = {
      employeeId: this.employeeId
    }
    this._Service.postRequestpension(data, 'getServicedetailsByEmpCode').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.ServiceDetails = res.data;
          this.getBudgetDetails(this.ServiceDetails);
          this.ServiceDetails = JSON.parse(JSON.stringify(this.ServiceDetails).replace(/\:null/gi, "\:\"\""));
          console.log("ServiceDetails", this.ServiceDetails);
          this.ServiceDetails['addedServices'] = 'No'
          this.ServiceDetails['addedJoiningDate'] = ''
          this.ServiceDetails['addedServicesGratuity'] = 'No'
          this.ServiceDetails['addedServicesGratuityAmount'] = 0
  
          if (this.ServiceDetails.optForCommutation == 'Yes') {
            this.isCommutation = true;
            this.revisedCommutation=true;
          } else if (this.ServiceDetails.optForCommutation == 'No') {
            this.isCommutation = false;
          }


          console.log("date of joining", this.dateofJoinging);
          this.setDate();
          this.dateofJoinging = this.DOJ;
          
          setTimeout(() => {
          
            let date1;
            if (this.commucationDate == '' || this.commucationDate == null) {
              date1 = '';
            } else {
              console.log("this.commucationDate",this.commucationDate)
              date1 = new Date(this.commucationDate)
            }   
         

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
      }
    });


  }
  removeFile1(i: any, data: any) {
    this.advancedLoan.splice(i, 1);

    const control = <FormArray>this.registrationForm?.get('addDeduction');
    if (data.loanTypeId == '1') //HBA
    {
      let data1 = this.addDeduction.value;
      console.log(data1)
      data1.filter((x: any, i: any) => {
        if (x.deductionType == 227 && x.deductionAmount == data.netPrinciple && !this.isRemoveDe[i]) {
          control.removeAt(i);
          this.isRemoveDe.splice(i, 1);
        }
      })
      data1 = this.addDeduction.value;
      console.log(data1)
      data1.filter((x: any, i: any) => {

        if (x.deductionType == 231 && x.deductionAmount == data.interest && !this.isRemoveDe[i]) {
          control.removeAt(i);
          this.isRemoveDe.splice(i, 1);
        }
      })
    } else if (data.loanTypeId == '2') //MCA
      var data1 = this.addDeduction.value;
    console.log(data1)

    data1.filter((x: any, i: any) => {
      if (x.deductionType == 223 && x.deductionAmount == data.netPrinciple && !this.isRemoveDe[i]) {
        control.removeAt(i);
        this.isRemoveDe.splice(i, 1);
      }
    })
    data1 = this.addDeduction.value;
    console.log(data1)
    data1.filter((x: any, i: any) => {
      if (x.deductionType == 224 && x.deductionAmount == data.interest && !this.isRemoveDe[i]) {
        control.removeAt(i);
        this.isRemoveDe.splice(i, 1);
      }
    })

  }
  // ****************************ADDRESS DETAIL****************************************
  iconCA: any;
  iconPA: any;
  iconOA: any;
  EMPAddress: any;
  EMP_doc: any;
  fetchAddressesEmp() {

    this.residenceArray = [];
    this.officeArray = [];
    this.DepartmentAddress = [];
    let data = {
      employeeId: this.employeeId
    };
    this._Service.postRequestpension(data, 'getAddressDetailsByEmployeeId').subscribe({
      next: (res) => {

        this.EMPAddress = res.data;
        this.EMPAddress = JSON.parse(JSON.stringify(this.EMPAddress).replace(/\:null/gi, "\:\"\""));
        let product: any;
        this.residenceAddress = res.data.employeeAddresses;
        this.officeArray = res.data.officeAddresses;
        this.iconOA = 'apartment'
        for (product of this.residenceAddress) {
          if (product.commType == 'C') {
            this.residenceArray.push(product);
            this.iconCA = 'person_pin_circle'
          }
          else if (product.commType == 'P') {
            this.DepartmentAddress.push(product);
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
        //   this.showerror=true;setD
        //  alert(this.error)
      },
    });
  }

  //#endregion PROFILE
  DOAPP: any
  DOJRS: any
  DOPD: any
  DOJPD: any
  DOJ: any
  setDate() {

console.log("this.ServiceDetails",this.ServiceDetails)

    let data: any[] = this.ServiceDetails.dateTypes
    for (let i = 0; i < data.length; i++) {
      if (data[i].acronym == 'DOJRS') {
        this.DOJRS = data[i].dateFormatted
      }
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].acronym == 'DOPD') {
        this.DOPD = data[i].dateFormatted
      }
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].acronym == 'DOJPD') {
        this.DOJPD = data[i].dateFormatted
      }
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].acronym == 'DOJ') {
        this.DOJ = data[i].dateFormatted
      }
    }

  }
  dateTrans(da: any) {
    if (da)
      return this.date.transform(da, "dd-MM-yyyy");
    else
      return "N/A"
  }



  //#region FAMILY DETAILS AND NOMINATION

  getFamilyDetails() {
    let data = {
      "employeeId": this.employeeId
    }

    this._Service.postRequestpension(data, 'getFamilyDetailsByEmployeeId').subscribe({
      next: (response) => {
        if (response.status = 200) {
          this.familyDetails = response.data;
          this.familyDetails = JSON.parse(JSON.stringify(this.familyDetails).replace(/\:null/gi, "\:\"\""));
        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }

    });
  }

  gratuity_Arr: any[] = [];
  commutation_Arr: any[] = [];
  arrear_Arr: any[] = [];

  getNomination() {
    let data = {
      "employeeId": this.employeeId
    }
    this._Service.postRequestpension(data, 'getSchemeNomineeDetails').subscribe({
      next: (response) => {
        if (response.status = 200) {
          this.nominee = response.data;
          this.nominee = JSON.parse(JSON.stringify(this.nominee).replace(/\:null/gi, "\:\"\""));
          let product: any;
          for (product of this.nominee) {

            if (product.schemeName == 'Commutation') {
              this.commutation_Arr.push(product);
              this.iconCA = 'person_pin_circle'

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
          response: err
        }
      }

    });
  }
  getPension_Commutation() {

    let data = {
      "employeeCode": this.employeeCode,
      "withheldAmount": 0,
      "deductionAmount": 0,
      "recoveryAmount": 0,
      "allowanceAmount": 0,
      "qualifyingService": this.serviceRecord_arry[0]?.qualifyingService_p === undefined ? null : this.serviceRecord_arry[0]?.qualifyingService_p,
      "nonQualifyingService": this.serviceRecord_arry[0]?.nonQualifyingServiceDate_p === undefined ? null : this.serviceRecord_arry[0]?.nonQualifyingServiceDate_p
    }


    this._Service.postRequestpension(data, 'getPensionDetailsByEmployeeCode').subscribe({
      next: (response) => {

        if (response) {


        }

      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }

    });


  }
  openDialog(field: any) {
    const updatePopup = this.dialog.open(FamilyDetailsPopupComponent, {

      height: "auto",
      width: "calc(100% - 40%)",

      panelClass: 'full-screen-modal'
      , autoFocus: false,
      data: {
        parentPage: field
      }
    });


    updatePopup.afterClosed().subscribe(result => {
      //console.log(result.data.value.memberName);
      // console.log("Data After Stringify : " + JSON.stringify(result.data.value));
      if (result) {
        // console.log("User wants Update than,if block redirect(family-nominee.component.ts) : " + JSON.stringify(result.data.value));
        this.familyDetails.nameEn = result.data.value.memberName;
        //console.log("Family Details name " + this.familyDetails.nameEn);

        let data = {
          "employeeCode": this.employeeCode,
          "familyMemId": 2,
          "relationshipId": 5,
          "nameEn": this.familyDetails.nameEn
        }


        this._Service.postRequestAddress(data, 'updateFamilyDetails').subscribe({
          next: (response) => {
            if (response.status = 200) {
              this.getFamilyDetails();
            }
          },
          error: (err) => {
            let errorObj = {
              message: err.message,
              err: err,
              response: err
            }
          }

        });

      }

    });


  }


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
    const employeeId = this.employeeId
    const docTypeId = "17"
    this._Service.saveDocument(this.file, employeeId, docTypeId).subscribe(result => {
      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.document_list.push(data);
      this.documentlist.push(data);
      alert("Document uploaded successfully")
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

  Uploaddocument1(event: any,i:any) {


    let time1 = new Date();

    this.file = event.target.files[0];
    let ex2: any[] = this.file.name.split(".");
    console.log("size", this.file.size / 1024)
    if (ex2[1].includes('PDF') || ex2[1].includes('pdf')) {

    } else {
      alert("Only PDF file format allowed")
      return;
    }

    if ((this.file.size / 1024) > 2048) {
      alert("Max 2 MB file size allowed")
      return;
    }



    this.fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + "." + ex2[1];
    this.fileName = this.fileName.replace(" ", "")

    const formData = new FormData();
    formData.append("file", this.file);
    formData.append("filename", this.fileName);
    this.isLoading1=true
    this._Service.postOr("wcc/uploadfile",formData).subscribe((res:any)=>{
      let rajIndex = 0;
      this.isLoading1=false;
      if(i==1)
      {
        
        
          this.documentlist.filter((data: any, index: number) => {
            if (data.docName == "Marriage Certificate") {
              rajIndex = index;
              return data;
            }
          })
          if (res.data.document[0].docId)
          {
            this.isMdown = true;
          }
          
      }else if(i==2)
      {
        this.documentlist.filter((data: any, index: number) => {
          if (data.docName == "Retirement Order Sanction") {
            rajIndex = index;
            return data;
          }
        })
        if (res.data.document[0].docId)
        {
          this.isRe = true;
        }
        
      }else if(i==3)
      {
        this.documentlist.filter((data: any, index: number) => {
          if (data.docName == "No DE Certificate") {
            rajIndex = index;
            return data;
          }
        })
        if (res.data.document[0].docId)
        {
          this.isDe = true;
        }
      }else if(i==4)
      {
        this.documentlist.filter((data: any, index: number) => {
          if (data.docName == "Bank Passbook First Page/Cancelled Cheque") {
            rajIndex = index;
            return data;
          }
        })
        if (res.data.document[0].docId)
        {
          this.ischq = true;
        }
      }  else if (i == 5) 
      {

        this.documentlist.filter((data: any, index: number) => {
          if (data.docName == "Tentative LPC Certificate") {
            rajIndex = index;
            return data;
          }
        })
        if (res.data.document[0].docId) {
          this.isTLPC = true;
        }
      }
      else if (i == 6) 
      {

        this.documentlist.filter((data: any, index: number) => {
          if (data.docName == "Added Gratuity Certificate") {
            rajIndex = index;
            return data;
          }
        })
        if (res.data.document[0].docId) {
          this.isAddCer = true;
        }
      }
        if (res.data.document[0].docId) {
          this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
          // this.documentlist[rajIndex]['newDocName']=this.fileName;
          console.log("documentlist", this.documentlist);
          alert("Document Upload Successfully.")
          
          
        } else {
          alert("Some Error Occured")
        }
    },(error)=>{
      this.isLoading1=false;
      alert("Some Error Occured")
    })




    // const employeeId = this.employeeId
    // const docTypeId = "23"
    // const reader = new FileReader();
    // var data4: any;
    // reader.onloadend = () => {
    //   //console.log(reader.result);
    //   // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
    //   data4 = reader.result;
    //   let data5 = data4.toString()
    //   data5 = data5.replace("data:application/pdf;base64,", "")
    //   //console.log(data4);
    //   //console.log(data4);
    //   let data = {
    //     "type": "pension",
    //     "sourceId": 2,
    //     "docAttributes": [

    //     ],
    //     "data": [
    //       {
    //         "docTypeId": docTypeId,
    //         "docTypeName": "Marriage_certificate",
    //         "docName": this.fileName,
    //         "docTitle": "Certificate",
    //         "content": data5
    //       }
    //     ]
    //   }
    //   this._Service.postOr("wcc/uploaddocs", data).subscribe((res: any) => {
    //     // console.log("res", res);

    //     let rajIndex = 0;
    //     this.documentlist.filter((data: any, index: number) => {
    //       if (data.docName == "Marriage Certificate") {
    //         rajIndex = index;
    //         return data;
    //       }
    //     })
    //     if (res.data.document[0].docId)
    //       this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;

    //     console.log("documentlist", this.documentlist);
    //     this.isMdown = true;
    //   })
    // };
    // reader.readAsDataURL(this.file);

    // // this.updateProgress();
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
    const employeeId = this.employeeId
    const docTypeId = "24";

    this._Service.saveDocument(this.file2, employeeId, docTypeId).subscribe({
      next: (result: any) => {
        if (result.data) {
          let data =
          {
            "docTypeId": docTypeId,
            "documentId": result.data.dmsDocumentId,
            "docName": result.data.uploadStatusMessage,
          }
          this.document_list.push(data);
          console.log(this.document_list);

          if (this.document_list.length > 0) {
            this.Disabledfile = 'Download Certificate';
          }

          alert("Document uploaded successfully")
        } else {
          alert("Some Error Occured")
        }

      }, error: (err: any) => {
        alert(err.error.error.description);
      }
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
  isLoading1:boolean=false
  // onRetirement(event: any) {



  //   let time1 = new Date();

  //   this.file = event.target.files[0];
  //   let ex2: any[] = this.file.name.split(".");
  //   console.log("size", this.file.size / 1024)
  //   if (ex2[1].includes('PDF') || ex2[1].includes('pdf')) {

  //   } else {
  //     alert("Only PDF file format allowed")
  //     return;
  //   }

  //   if ((this.file.size / 1024) > 2048) {
  //     alert("Max 2 MB file size allowed")
  //     return;
  //   }



  //   this.fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + "." + ex2[1];
  //   this.fileName = this.fileName.replace(" ", "")
  //   const formData = new FormData();
  //   formData.append("file", this.file);
  //   formData.append("filename", this.fileName);
  //   this.isLoading1=true
  //   this._Service.postOr("wcc/uploadfile",formData).subscribe((res:any)=>{
  //     this.isLoading1=false;
  //     let rajIndex = 0;
  //       this.documentlist.filter((data: any, index: number) => {
  //         if (data.docName == "Retirement Order Sanction") {
  //           rajIndex = index;
  //           return data;
  //         }
  //       })
  //       if (res.data.document[0].docId) {
  //         this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
  //         // this.documentlist[rajIndex]['newDocName']=this.fileName;
  //         console.log("documentlist", this.documentlist);
  //         alert("Document Upload Successfully.")
  //         this.isRe = true;

  //       } else {
  //         alert("Some Error Occured")
  //       }
  //   },(error)=>{
  //     this.isLoading1=false;
  //     alert("Some Error Occured")
  //   }),
  //   // const employeeId = this.employeeId
  //   // const docTypeId = "15"
  //   // const reader = new FileReader();
  //   // var data4: any;
  //   // reader.onloadend = () => {
  //   //   console.log(reader.result);
  //   //   // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
  //   //   data4 = reader.result;
  //   //   let data5 = data4.toString()
  //   //   data5 = data5.replace("data:application/pdf;base64,", "")
  //   //   console.log(data4);
  //   //   console.log(data4);
  //   //   let data = {
  //   //     "type": "pension",
  //   //     "sourceId": 2,
  //   //     "docAttributes": [

  //   //     ],
  //   //     "data": [
  //   //       {
  //   //         "docTypeId": docTypeId,
  //   //         "docTypeName": "Retire_Order_Sanction",
  //   //         "docName": this.fileName,
  //   //         "docTitle": "Certificate",
  //   //         "content": data5
  //   //       }
  //   //     ]
  //   //   }
  //   //   this._Service.postOr("wcc/uploaddocs", data).subscribe((res: any) => {
  //   //     console.log("res", res);

  //   //     let rajIndex = 0;
  //   //     this.documentlist.filter((data: any, index: number) => {
  //   //       if (data.docName == "Retirement Order Sanction") {
  //   //         rajIndex = index;
  //   //         return data;
  //   //       }
  //   //     })
  //   //     if (res.data.document[0].docId) {
  //   //       this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
  //   //       // this.documentlist[rajIndex]['newDocName']=this.fileName;
  //   //       console.log("documentlist", this.documentlist);
  //   //       alert("Document Upload Successfully.")
  //   //       this.isRe = true;

  //   //     } else {
  //   //       alert("Some Error Occured")
  //   //     }


  //   //   })
  //   // };
  //   // reader.readAsDataURL(this.file);

  //   this.updateProgress();
  // }
  isDe: boolean = false
  // noDECertificate(event: any) {


  //   let time1 = new Date();

  //   this.file = event.target.files[0];
  //   let ex2: any[] = this.file.name.split(".");
  //   console.log("size", this.file.size / 1024)
  //   if (ex2[1].includes('PDF') || ex2[1].includes('pdf')) {

  //   } else {
  //     alert("Only PDF file format allowed")
  //     return;
  //   }

  //   if ((this.file.size / 1024) > 2048) {
  //     alert("Max 2 MB file size allowed")
  //     return;
  //   }



  //   this.fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + "." + ex2[1];
  //   this.fileName = this.fileName.replace(" ", "")
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
  //           "docTypeId": docTypeId,
  //           "docTypeName": "nodecertificate",
  //           "docName": this.fileName,
  //           "docTitle": "Certificate",
  //           "content": data5
  //         }
  //       ]
  //     }
  //     this._Service.postOr("wcc/uploaddocs", data).subscribe((res: any) => {
  //       console.log("res", res);

  //       let rajIndex = 0;
  //       this.documentlist.filter((data: any, index: number) => {
  //         if (data.docName == "No DE Certificate") {
  //           rajIndex = index;
  //           return data;
  //         }
  //       })
  //       if (res.data.document[0].docId) {
  //         this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
  //         // this.documentlist[rajIndex]['newDocName']=this.fileName;
  //         console.log("documentlist", this.documentlist);
  //         alert("Document Upload Successfully.")
  //         this.isDe = true;

  //       } else {
  //         alert("Some Error Occured")
  //       }


  //     })
  //   };
  //   reader.readAsDataURL(this.file);

  //   this.updateProgress();
  // }
  removeRetirement() {
    this.file3 = null;
    this.Retirementfile = '';

  }
  // ********************Disabled
  file4: any;
  Chequefile: any;
  ischq: boolean = false
  // onChangeCheque(event: any) {


  //   let time1 = new Date();

  //   this.file = event.target.files[0];
  //   let ex2: any[] = this.file.name.split(".");
  //   console.log("size", this.file.size / 1024)
  //   if (ex2[1].includes('PDF') || ex2[1].includes('pdf')) {

  //   } else {
  //     alert("Only PDF file format allowed")
  //     return;
  //   }

  //   if ((this.file.size / 1024) > 2048) {
  //     alert("Max 2 MB file size allowed")
  //     return;
  //   }



  //   this.fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + "." + ex2[1];
  //   this.fileName = this.fileName.replace(" ", "")
  //   const employeeId = this.employeeId
  //   const docTypeId = "18"
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
  //           "docTypeId": docTypeId,
  //           "docTypeName": "bankDoc",
  //           "docName": this.fileName,
  //           "docTitle": "Certificate",
  //           "content": data5
  //         }
  //       ]
  //     }
  //     console.log("data", data);

  //     this._Service.postOr("wcc/uploaddocs", data).subscribe((res: any) => {
  //       console.log("res", res);
  //       let data =
  //       {
  //         "docTypeId": docTypeId,
  //         "documentId": res.data.document[0].docId,
  //         "docName": this.fileName,
  //       }
  //       let rajIndex = 0;
  //       this.documentlist.filter((data: any, index: number) => {
  //         if (data.docName == "Bank Passbook First Page/Cancelled Cheque") {
  //           rajIndex = index;
  //           return data;
  //         }
  //       })
  //       if (res.data.document[0].docId) {
  //         this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
  //         //this.documentlist[rajIndex]['newDocName']=this.fileName;
  //         console.log("document_list", this.documentlist);
  //         alert("Document Upload Succesfully.")
  //         this.ischq = true;
  //       } else {
  //         alert("Some Error Occured.")
  //       }


  //     })
  //   };
  //   reader.readAsDataURL(this.file);

  //   this.updateProgress();
  // }

  removeCheque() {
    this.file3 = null;
    this.Chequefile = '';

  }
  scount=0;
  spaynumberValidation()
  {
    if(this.specialPay>=this.Pension_Commutation.specialpay && this.Pension_Commutation.specialpay>0)
    {
      this.specialPay=this.Pension_Commutation.specialpay;
      alert("Enter amount is greater than "+this.Pension_Commutation.specialpay)
    }
  }
  //Commutation Date Calculation here call this service -- callPensionCalculationRuleEngine
  commutationDateCalculation(date: any) {

    console.log("date", date)
    let date1: any;
    if (date != "" ) {
      if (date != undefined )
      date1 = moment(date).format("DD-MM-YYYY")
    }
    console.log("effective date", this.commutationDetails.value.effectiveDate)
    console.log("date1", date1)
    let formData = this.registrationForm.value
    let totalRecovery: any = 0;
    for (let t of formData?.addDynamicElement) {
      totalRecovery = totalRecovery + Number(t.recoveryAmount)
    }

    let totalAllowance: any = 0;
    for (let t of formData?.addAllowanceType) {
      totalAllowance = totalAllowance + Number(t.allowanceAmount)
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
      "employeeCode": this.Personaldetail.employeeCode,
      "pensionTypeId": this.psnTypeId,
      "withheldAmount": totalwithheld,
      "deductionAmount": [{
        "dedAmount": totalDeduction
      }],
      "recoveryAmount": [{
        "recAmount": totalRecovery
      }],
      "allowanceAmount": totalAllowance,
      "dateOfVCD": "",
      "cpoEfDate": date1,
      "isPaperLess": 0,
      "cpoValue": this.ServiceDetails?.commuationPercentage ? this.ServiceDetails.commuationPercentage.toString() : "",
      "deFlag": this.serviceRecordDatanew?.deStatus != "" ? this.serviceRecordDatanew?.deStatus : "0",
      "deType": this.serviceRecordDatanew?.deStatus != "" ? this.serviceRecordDatanew?.deType : "",
      "qualifyingService": this.calQualifying,
      "addedJoiningDate":  this.ServiceDetails.addedJoiningDate? this.ServiceDetails.addedJoiningDate:"",
      "nonQualifyingService": this.calNonQualifying,
      "isPayCommission": this.Calculations_Pay_Details?.payCommissionNameEn ? this.Calculations_Pay_Details.payCommissionNameEn : '',
      "isMilitary": this.isMilitry,
      "tenBasicPay": this.tenBasicPay ? this.tenBasicPay : 0,
      "marStatus":this.Personaldetail?.maritalStatus?this.Personaldetail?.maritalStatus:"",    
      "npa":this.npa?this.npa:0,
      "addedServicesGratuityAmount":this.ServiceDetails?.addedServicesGratuityAmount?Number(this.ServiceDetails?.addedServicesGratuityAmount):0
    }
this.load.show()
    console.log("date22", this.Pension_Commutation);
    console.log("data", data);
    var ser_data: any[] = [];
    if(this.userDetails.roleid=='1')
    {
      this._Service.postRequestpension(data, 'callPensionCalculationRuleEngine').subscribe({
        next: (res) => {
          this.load.hide();
          if ((res.status = 200)) {
  
            console.log("res", res);
            ser_data.push(res.data);
            console.log("res", ser_data);
  
  
            this.Pension_Commutation = res.data;
            this.Pension_Commutation2=JSON.parse(JSON.stringify(res.data))
            console.log( "1",this.Pension_Commutation)
            if(Number(this.Pension_Commutation2?.netPay)<1)
            {
              alert("Payable DCRG is less than 1.")
            }
            if(Number(this.Pension_Commutation2?.netPay)<1)
            {
              alert("Payable DCRG is less than 1.")
            }
            if(this.scount==0)
            {
              this.specialPay=this.Pension_Commutation2.specialpay;
              this.scount=this.scount+1;
              if(this.Pension_Commutation2.specialpay==0)
              {
                this.spay=true
              }
            }
           
          }
        },
        error: (err) => {
          this.load.hide();
        },
      });
      if (this.Calculations_Commutation_Details?.effectiveDate)
        this.Calculations_Commutation_Details.effectiveDate = date1;
    }
 


  }
  Pension_Commutation2:any
  pensionDetails: any;
  commutationDateCalculation2() {
    console.log("effective date", this.commutationDetails.value.effectiveDate)
    let data = {
      "employeeCode": this.Personaldetail.employeeCode,
      "pensionTypeId": this.psnTypeId,
      "withheldAmount": 0,
      "deductionAmount": [
      ],
      "recoveryAmount": [
      ],
      "allowanceAmount": 0,
      "dateOfVCD": "",
      "cpoEfDate": "",
      "cpoValue": 0,
      "isPaperLess": 0,
      "deFlag": 0,
      "deType": "",
      "tenBasicPay": this.tenBasicPay ? this.tenBasicPay : 0,
      "marStatus":this.Personaldetail?.maritalStatus?this.Personaldetail?.maritalStatus:"",    
      "npa":this.npa?this.npa:0,
      "addedServicesGratuityAmount":this.ServiceDetails?.addedServicesGratuityAmount?Number(this.ServiceDetails?.addedServicesGratuityAmount):0,
      "qualifyingService": [
      ],
      "nonQualifyingService": [
      ]
    }
    console.log("data", data);
    this.caculationPayload = data;
    var ser_data: any[] = [];
    this.load.show();
    if(this.userDetails.roleid=='1')
    {
    this._Service.postRequestpension(data, 'callPensionCalculationRuleEngine').subscribe({
      next: (res) => {
        this.load.hide();
        if ((res.status = 200)) {
          this.Pension_Commutation = res.data;
          this.Pension_Commutation2=JSON.parse(JSON.stringify(res.data))
          console.log("2", this.Pension_Commutation)
          if(Number(this.Pension_Commutation2?.netPay)<1)
          {
            alert("Payable DCRG is less than 1.")
          }
          if(this.scount==0)
          {
            this.specialPay=this.Pension_Commutation2.specialpay;
            this.scount=this.scount+1;
            if(this.Pension_Commutation2.specialpay==0)
            {
              this.spay=true
            }
          }
        }
      },
      error: (err) => {
        this.load.hide();
      },
    });

  }

  }
  commutationDateCalculation5(date: any) {

    console.log("date", date)
    if (date == null) {
      date = '';
    }
    let date1: any;
    if (date != "") {
      date1 = moment(date).format("DD-MM-YYYY")
    }
    console.log("effective date", this.commutationDetails.value.effectiveDate)
    console.log("date1", date1)
    let formData = this.registrationForm.value
    let totalRecovery: any = 0;
    for (let t of formData?.addDynamicElement) {
      totalRecovery = totalRecovery + Number(t.recoveryAmount)
    }

    let totalAllowance: any = 0;
    for (let t of formData?.addAllowanceType) {
      totalAllowance = totalAllowance + Number(t.allowanceAmount)
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
      "employeeCode": this.Personaldetail.employeeCode,
      "pensionTypeId": this.psnTypeId,
      "withheldAmount": totalwithheld,
      "deductionAmount": [{
        "dedAmount": totalDeduction
      }],
      "recoveryAmount": [{
        "recAmount": totalRecovery
      }],
      "allowanceAmount": totalAllowance,
      "dateOfVCD": "",
      "cpoEfDate": date1,
      "isPaperLess": 0,
      "cpoValue": this.ServiceDetails?.commuationPercentage ? this.ServiceDetails.commuationPercentage.toString() : "",
      "deFlag": this.serviceRecordDatanew?.deStatus != "" ? this.serviceRecordDatanew?.deStatus : "0",
      "deType": this.serviceRecordDatanew?.deStatus != "" ? this.serviceRecordDatanew?.deType : "",
      "qualifyingService": this.calQualifying,
      "nonQualifyingService": this.calNonQualifying,
      "isPayCommission": this.Calculations_Pay_Details?.payCommissionNameEn ? this.Calculations_Pay_Details.payCommissionNameEn : '',
      "isMilitary": this.isMilitry,
      "tenBasicPay": this.tenBasicPay ? this.tenBasicPay : 0,
      "marStatus":this.Personaldetail?.maritalStatus?this.Personaldetail?.maritalStatus:"",    
      "npa":this.npa?this.npa:0,
      "addedServicesGratuityAmount":this.ServiceDetails?.addedServicesGratuityAmount?Number(this.ServiceDetails?.addedServicesGratuityAmount):0
    }

    console.log("date22", this.Pension_Commutation);
    console.log("data", data);
    var ser_data: any[] = [];
    this.load.show();
    if(this.userDetails.roleid=='1')
    {
    this._Service.postRequestpension(data, 'callPensionCalculationRuleEngine').subscribe({
      next: (res) => {
        this.load.hide();
        if ((res.status = 200)) {

          console.log("res", res);
          ser_data.push(res.data);
          console.log("res", ser_data);

          this.Pension_Commutation=res.data;
          this.Pension_Commutation2 = JSON.parse(JSON.stringify(res.data));
          console.log( "5",this.Pension_Commutation)
          if(Number(this.Pension_Commutation2?.netPay)<1)
          {
            alert("Payable DCRG is less than 1.")
          }
          if(this.scount==0)
          {
            this.specialPay=this.Pension_Commutation2.specialpay;
            this.scount=this.scount+1;
            if(this.Pension_Commutation2.specialpay==0)
            {
              this.spay=true
            }
          }
        }
      },
      error: (err) => {
        this.load.hide();
      },
    });
    if (this.Calculations_Commutation_Details?.effectiveDate)
      this.Calculations_Commutation_Details.effectiveDate = date1;

  }
  }
  esignHoApprover()
  {
    this.getLRnumber();
    setTimeout(()=>
    this.hoApproverEsign(),1000
    )
  }
  commutationDateCalculation3(date: any) {
   
    let date1: any
    if (date != '')
      date1 = this.date.transform(date, 'dd-MM-yyyy')
   
    let data = {
      "employeeCode": this.Personaldetail.employeeCode,
      "pensionTypeId": this.psnTypeId,
      "withheldAmount": 0,
      "deductionAmount": [{
        "dedAmount": 0
      }],
      "recoveryAmount": [{
        "recAmount": 0
      }],
      "allowanceAmount": 0,
      "dateOfVCD": "",
      "cpoEfDate": date1,
      "isPaperLess": 0,
      "cpoValue": this.ServiceDetails?.commuationPercentage ? this.ServiceDetails.commuationPercentage.toString() : "",
      "deFlag": this.serviceRecordDatanew?.deStatus != "" ? this.serviceRecordDatanew?.deStatus : "0",
      "deType": this.serviceRecordDatanew?.deStatus != "" ? this.serviceRecordDatanew?.deType : "",
      "qualifyingService": this.calQualifying,
      "nonQualifyingService": this.calNonQualifying,
      "isPayCommission": this.Calculations_Pay_Details?.payCommissionNameEn ? this.Calculations_Pay_Details.payCommissionNameEn : '',
      "isMilitary": this.isMilitry,
      "tenBasicPay": this.tenBasicPay ? this.tenBasicPay : 0,
      "marStatus":this.Personaldetail?.maritalStatus?this.Personaldetail?.maritalStatus:"",    
      "npa":this.npa?this.npa:0,
      "addedServicesGratuityAmount":this.ServiceDetails?.addedServicesGratuityAmount?Number(this.ServiceDetails?.addedServicesGratuityAmount):0
    }


    console.log("data", data);
    this.load.show();
    this.caculationPayload = data;
    var ser_data: any[] = [];
    if(this.userDetails.roleid=='1')
    {
    this._Service.postRequestpension(data, 'callPensionCalculationRuleEngine').subscribe({
      next: (res) => {
        this.load.hide();
        if ((res.status = 200)) {

          console.log("res", res);
          ser_data.push(res.data);
          console.log("res", ser_data);


          this.Pension_Commutation = res.data;
          this.Pension_Commutation2=JSON.parse(JSON.stringify(res.data))
          console.log( "3",this.Pension_Commutation);
          if(Number(this.Pension_Commutation2?.netPay)<1)
          {
            alert("Payable DCRG is less than 1.")
          }
          if(this.scount==0)
          {
            this.specialPay=this.Pension_Commutation2.specialpay;
            this.scount=this.scount+1;
            if(this.Pension_Commutation2.specialpay==0)
            {
              this.spay=true
            }
          }
        }
      },
      error: (err) => {
        this.load.hide();
      },
    });
    if (this.Calculations_Commutation_Details?.effectiveDate)
      this.Calculations_Commutation_Details.effectiveDate = date1;
  }

  }
  commutationDateCalculation4(date: any) {

    console.log("date", date)
    console.log("effective date", this.commutationDetails.value.effectiveDate._d)
    let formData = this.registrationForm.value
    let totalRecovery: any = 0;
    for (let t of formData?.addDynamicElement) {
      totalRecovery = totalRecovery + Number(t.recoveryAmount)
    }

    let totalAllowance: any = 0;
    for (let t of formData?.addAllowanceType) {
      totalAllowance = totalAllowance + Number(t.allowanceAmount)
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
      "employeeCode": this.Personaldetail.employeeCode,
      "pensionTypeId": this.psnTypeId,
      "withheldAmount": totalwithheld,
      "deductionAmount": [{
        "dedAmount": totalDeduction
      }],
      "recoveryAmount": [{
        "recAmount": totalRecovery
      }],
      "allowanceAmount": totalAllowance,
      "dateOfVCD": "",
      "cpoEfDate": date,
      "isPaperLess": 0,
      "cpoValue": this.ServiceDetails?.commuationPercentage ? this.ServiceDetails.commuationPercentage.toString() : "",
      "deFlag": this.serviceRecordDatanew?.deStatus != "" ? this.serviceRecordDatanew?.deStatus : "0",
      "deType": this.serviceRecordDatanew?.deStatus != "" ? this.serviceRecordDatanew?.deType : "",
      "qualifyingService": this.calQualifying,
      "nonQualifyingService": this.calNonQualifying,
      "isPayCommission": this.Calculations_Pay_Details?.payCommissionNameEn ? this.Calculations_Pay_Details.payCommissionNameEn : '',
      "isMilitary": this.isMilitry,
      "tenBasicPay": this.tenBasicPay ? this.tenBasicPay : 0,
      "marStatus":this.Personaldetail?.maritalStatus?this.Personaldetail?.maritalStatus:"",    
      "npa":this.npa?this.npa:0,
      "addedServicesGratuityAmount":this.ServiceDetails?.addedServicesGratuityAmount?Number(this.ServiceDetails?.addedServicesGratuityAmount):0
    }


    console.log("data", data);
    this.load.show()
    this.caculationPayload = data;
    var ser_data: any[] = [];
    if(this.userDetails.roleid=='1')
    {
    this._Service.postRequestpension(data, 'callPensionCalculationRuleEngine').subscribe({
      next: (res) => {
        this.load.hide();
        if ((res.status = 200)) {

          console.log("res", res);
          ser_data.push(res.data);
          console.log("res", ser_data);


          this.Pension_Commutation = res.data;
          this.Pension_Commutation2=JSON.parse(JSON.stringify(res.data))
          console.log( "4",this.Pension_Commutation)
          if(Number(this.Pension_Commutation2?.netPay)<1)
          {
            alert("Payable DCRG is less than 1.")
          }
          if(this.scount==0)
          {
            this.specialPay=this.Pension_Commutation2.specialpay;
            this.scount=this.scount+1;
            if(this.Pension_Commutation2.specialpay==0)
            {
              this.spay=true
            }
          }
        }
      },
      error: (err) => {
        this.load.hide();
      },
    });
    if (this.Calculations_Commutation_Details?.effectiveDate)
      this.Calculations_Commutation_Details.effectiveDate = date;
  }

  }
  spay:boolean=false;
  pension_calculation(data1: any) {
    console.log(this.ServiceDetails.commuationPercentage)
    //alert(this.ServiceDetails.commuationPercentage)
    console.log("date", this.Pension_Commutation);
    let data = {
      "employeeCode": this.Personaldetail.employeeCode,
      "pensionTypeId": this.psnTypeId,
      "withheldAmount": 0,
      "deductionAmount": [],
      "recoveryAmount": [
      ],
      "allowanceAmount": 0,
      "dateOfVCD": "",
      "cpoEfDate": "",
      "cpoValue": 0,
      "isPaperLess": 0,
      "tenBasicPay": this.tenBasicPay ? this.tenBasicPay : 0,
      "deFlag": data1.deStatus ? data1.deStatus : 0,
      "deType": data1.deType ? data1.deType : "",
      "marStatus":this.Personaldetail?.maritalStatus?this.Personaldetail?.maritalStatus:"",    
      "npa":this.npa?this.npa:0,
      "addedServicesGratuityAmount":this.ServiceDetails?.addedServicesGratuityAmount?Number(this.ServiceDetails?.addedServicesGratuityAmount):0,
      "qualifyingService": [
      ],
      "nonQualifyingService": [

      ]
    }
    console.log("data", data);
    this.load.show();
    this.caculationPayload = data;
    var ser_data: any[] = [];
    if(this.userDetails.roleid=='1')
    {
    this._Service.postRequestpension(data, 'callPensionCalculationRuleEngine').subscribe({
      next: (res) => {
        this.load.hide();
        if ((res.status = 200)) {

          console.log("res", res);
          ser_data.push(res.data);
          console.log("res", ser_data);
          this.Calculations_Pay_Details.gratuityB = ser_data[0].retirGratuity
          this.Pension_Commutation.gratuityAmount = ser_data[0].netPay
          console.log( "p",this.Pension_Commutation)
          this.Pension_Commutation = res.data;
          this.Pension_Commutation2=JSON.parse(JSON.stringify(res.data))
          console.log( "4",this.Pension_Commutation)
          if(Number(this.Pension_Commutation2?.netPay)<1)
          {
            alert("Payable DCRG is less than 1.")
          }
          if(this.scount==0)
          {
            this.specialPay=this.Pension_Commutation2.specialpay;
            this.scount=this.scount+1;
            if(this.Pension_Commutation2.specialpay==0)
            {
              this.spay=true
            }
          }
        }
      },
      error: (err) => {
        this.load.hide();
      },
    });

  }

  }
  //Commutation Pension here call this service 
  caculationPension() {

    if (this.isCommutation) {
      let dates: any
      //alert(this.dateofRetirement)
      if (this.Pension_Commutation?.commutationEffectiveDate != '') {
        if (this.Pension_Commutation?.commutationEffectiveDate != null) {
          let commDate=moment(this.Pension_Commutation.commutationEffectiveDate).format()
          dates = new Date(commDate)
        }

      } else {
        dates = new Date(this.dateofRetirement)
        dates.setDate(dates.getDate() + 1);
      }

      this.commutationDateCalculation(dates);
    }
    else {
      let dates = ""
      this.commutationDateCalculation(dates);
    }
  }


  value() {
    console.log("Commutation value is here>>>", this.ServiceDetails.optForCommutation)
    if (this.ServiceDetails.optForCommutation == 'Yes') {
      this.isCommutation = true;
      let dates = new Date(this.dateofRetirement)
      console.log("dates", dates);

      dates.setDate(dates.getDate() + 1);
      console.log("dates", dates);
      this.commutationDetails.patchValue({ effectiveDate: dates });
      if (this.ServiceDetails.serviceCatId === 1) {
        this.ServiceDetails.commuationPercentage = 40;
      } else if (this.ServiceDetails.serviceCatId === 13 || (this.ServiceDetails.serviceCatId === 7 && this.ServiceDetails.serviceSubcatId === 108)) {
        this.ServiceDetails.commuationPercentage = 50;
      } else {
        this.ServiceDetails.commuationPercentage = 33.33;

      }

      this.commutationDateCalculation(dates);

    } else if (this.ServiceDetails.optForCommutation == 'No') {
      this.isCommutation = false;
      this.ServiceDetails.commuationPercentage = "0";
      let dates = "";
      this.commutationDetails.patchValue({ effectiveDate: dates });
      this.commutationDateCalculation(dates);
    }

  }

  frEsign() {
    this.esignRequest(this.pkEsignData);
  }
  isLoadingPK:boolean=false;
isLoadingFR:boolean=false;
  FrpreviewNew() {
    var data2: any;
    let url = "getreportpath";
    let data1 =
    {
      "taskTranId": this.transId
    }
    this.isLoadingFR=true
    this._Service.postho(url, data1).subscribe((res: any) => {
      console.log("res", res)
      data2 = res.data;
      // data2=JSON.parse(data2);
      this.pdfpreviewFR(data2)
    },(error)=>{
      this.isLoadingFR=false;
      alert("Some Error Occured")
    })
  }
  FRPreview() {


    let data =
    {
      "reportPath": "/VOB_REPORT/SANCTION_BENIFICARY.xdo",
      "format": "pdf",
      "params": [
        {
          "name": "task_data_id",
          "value": "185"
        }
      ]
    }

    let url = "getpdffiles";

    this._Service.postNewEsign(url, data).subscribe((res: any) => {

      res = JSON.parse(res)
      console.log("res", res.data.document[0].content);
      let base64Pdf = res.data.document[0].content;
      if (base64Pdf) {
        const byteArray = new Uint8Array(
          atob(base64Pdf)
            .split("")
            .map(char => char.charCodeAt(0))
        );

        const file = new Blob([byteArray], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);

        const pdfWindow = window.open("");
        pdfWindow!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");

      } else {
        alert("Some error occured.")
      }
    })

  }
  familyDetails: any;
  nominee: any;

  condition1Amount: any = 0;
  npay:boolean=false;
  fetchpersonalEmp() {
    let data = {
      "employeeId": this.employeeId
    }
    this._Service.postRequestpension(data, 'getEmployeePayDetails').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.Calculations_Pay_Details = res.data;
          this.Calculations_Pay_Details = JSON.parse(JSON.stringify(this.Calculations_Pay_Details).replace(/\:null/gi, "\:\"\""));
          this.condition1Amount = Number(this.Calculations_Pay_Details.basicPay) + Number(this.Calculations_Pay_Details.npaOrNca) + Number(this.Calculations_Pay_Details.specialPay)
          console.log("  this.condition1Amount", this.condition1Amount);
          this.npa=Number(this.Calculations_Pay_Details?.npaOrNca)
          if(this.npa==0)
          {
            this.npay=true;
          }
          this.payScale()
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
  NPAnumberValidation()
  {
    if(this.npa>=Number(this.Calculations_Pay_Details.npaOrNca) && Number(this.Calculations_Pay_Details.npaOrNca)>0)
    {
      this.npa=Number(this.Calculations_Pay_Details.npaOrNca);
      alert("Amount is greater than "+Number(this.Calculations_Pay_Details.npaOrNca))
    }else
    {
      this.Calculations_Pay_Details.npaOrNca=this.npa.toString();
    }
  }
  open(item: any) {
    console.log(item)
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
        alert("Please confirm that all details viewed are correct.")
      }

    }
  }
  addObjRemark(i: any, value: any) {
    this.ObjectionArray[i].remark = value
  }
  ObjectionArray: any[] = []
  addObj() {
    this._Service.getCurrentDate();

    if (this.Objectionform.value.ObjectionText == '' || this.Objectionform.value.ObjectionText == null) {
      return;
    } else if(this.Objectionform.value.ObjectionText=='Other ')
    {if(this.Objectionform.value.ObjectionTextOther=="" || this.Objectionform.value.ObjectionTextOther==null || this.Objectionform.value.ObjectionTextOther==undefined)
    {
      alert("Objection text is blank.")
      return;
    }
      setTimeout(() => {                           // <<<---using ()=> syntax
        if (this.Objectionform.valid) {
          let data = {
            "roleName": this.userDetails.role,
            "Objection": this.Objectionform.value.ObjectionTextOther,
            "CreatedAt": moment(this._Service?.currentDate).format("DD-MM-YYYY"),
            "rejected": false,
            "rejectedDate": "",
            "roleId": this.userDetails.roleid,
            "remark": ""
          }
          console.log(this.ObjectionArray)
          this.ObjectionArray.push(data);
          this.Objectionform.reset();
        } else {
          alert("Fill all fields properly.")
        }
        console.log(this.ObjectionArray)
      }, 500);
    }
    else{
      setTimeout(() => {                           // <<<---using ()=> syntax
        if (this.Objectionform.valid) {
          let data = {
            "roleName": this.userDetails.role,
            "Objection": this.Objectionform.value.ObjectionText,
            "CreatedAt": moment(this._Service?.currentDate).format("DD-MM-YYYY"),
            "rejected": false,
            "rejectedDate": "",
            "roleId": this.userDetails.roleid,
            "remark": ""
          }
          console.log(this.ObjectionArray)
          this.ObjectionArray.push(data);
          this.Objectionform.reset();
        } else {
          alert("Fill all fields properly.")
        }
        console.log(this.ObjectionArray)
      }, 500);
    }
  }
  nextAd: boolean = false;
  finalSubmit(item: any, stepper: MatStepper) {
console.log("deduction",this.registrationForm.value)
    if (this.userDetails.roleid == '6') {
      if (this.ServiceDetails.serviceCatId == 1 || this.ServiceDetails.serviceCatId == 13) {

        this.nextAd = true;
      } else if (this.ServiceDetails.serviceCatId == 2 && this.ServiceDetails.serviceSubcatId == 37) {
        this.nextAd = true;
      }
      if (this.nextAd1) {

        this.nextAd = false;

      }
    }

    let accountCerDocId = this.documentlist.filter((x: any) => x.docName == 'Accounts Personnel Certificate')[0]?.dmsDocId;
    console.log(accountCerDocId)
    if (accountCerDocId == null && this.userDetails.roleid == '2') {
      alert('Please Upload Accounts Personnel Certificate');
      stepper.previous();
    } else {
      if (this.userDetails.roleid != '1' && this.Summary.value.is_agree == true) {

        this.modalService.open(item);
        // this.get_Task_Detail();
        this.Remark();
      } else if (this.userDetails.roleid == '1') {
        this.modalService.open(item);
        // this.get_Task_Detail();
        this.Remark();
      } else {
        alert("Please confirm that all details viewed are correct.")
      }
    }
  }

  makerProcessSubmit(item: any, stepper: MatStepper) {
    console.log("de",this.registrationForm.value)
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

  conditionCheck1() {
    if (!this.conditionForm.value.condition_1) {
      this.conditionForm.patchValue({ condition_9: false });
    } else if (!this.conditionForm.value.condition_2) {
      this.conditionForm.patchValue({ condition_9: false });
    } else if (!this.conditionForm.value.condition_3) {
      this.conditionForm.patchValue({ condition_9: false });
    } else if (!this.conditionForm.value.condition_1) {
      this.conditionForm.patchValue({ condition_9: false });
    } else if (!this.conditionForm.value.condition_4) {
      this.conditionForm.patchValue({ condition_9: false });
    } else if (!this.conditionForm.value.condition_5) {
      this.conditionForm.patchValue({ condition_9: false });
    } else if (!this.conditionForm.value.condition_6) {
      this.conditionForm.patchValue({ condition_9: false });
    } else if (!this.conditionForm.value.condition_7) {
      this.conditionForm.patchValue({ condition_9: false });
    } else if (!this.conditionForm.value.condition_8) {
      this.conditionForm.patchValue({ condition_9: false });
    }
  }

  conditionCheck() {
    if (this.conditionForm.value.condition_9) {
      if (!this.conditionForm.value.condition_1_Date) {
        alert("Please fill all fields values of conditions.")
        this.conditionForm.patchValue({ condition_9: false });
        return;
      } else if (!this.conditionForm.value.condition_1_Amount) {
        alert("Please fill all fields values of conditions.")
        this.conditionForm.patchValue({ condition_9: false });
        return;
      } else if (!this.conditionForm.value.condition_1_Date1) {
        alert("Please fill all fields values of conditions.")
        this.conditionForm.patchValue({ condition_9: false });
        return;
      }
      else {
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
  Bank_Detail() {
    let data = {
      "employeeId": this.employeeId
    }
    this._Service.postRequestpension(data, "getBankdetailsByEmpCode").subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.Banklist = res.data[0];
          this.Banklist = JSON.parse(JSON.stringify(this.Banklist).replace(/\:null/gi, "\:\"\""));
          // localStorage.setItem('bank-details', JSON.stringify(res.data[0]))
          this.config.storeDetails('bank-details', JSON.stringify(res.data[0]))
          
        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }

      }
    })
  }
  //#endregion BANK/TREASURY DETAIL

  //#region DOCUMENTS UPLOADED
  documentlist: any[] = []
  getAllUploadedDocumentDetailsByEmployeeCode() {
    let data = {
      "subModuleId": 4,
      "processId": 1,
      "employeeId": this.employeeId
    }
    this._Service.postRequestpension(data, 'getDocsDtlsBySubId').subscribe((res) => {
      if (res.status = 200) {
        let rajIndex = 0;
        this.documentlist = res.data;
        this.docList = res.data;
        console.log("docList 0", this.docList);
        console.log("documentlist 0", this.documentlist);
        let newdocumentlist:any[]=JSON.parse(JSON.stringify(this.documentlist))
        newdocumentlist = newdocumentlist.filter(item => item.docName != "Bill Inner - PDF");
        newdocumentlist = newdocumentlist.filter(item => item.docName != "Invoice PDF");
        newdocumentlist = newdocumentlist.filter(item => item.docName != "Other");
        newdocumentlist = newdocumentlist.filter(item => item.docName != "Bill Outer - PDF");
        newdocumentlist = newdocumentlist.filter(item => item.docName != "Scan Copy of Approval");
        newdocumentlist = newdocumentlist.filter(item => item.docName != "Pension Kit Summary");
        this.documentlist=newdocumentlist;
        console.log("or documentlist", this.documentlist);
        let data = {
          "dmsDocId": null,
          "docName": "FR",
          "docTypeId": 36
        }
       
        this.documentlist.push(data);
        let doc_check:any[]=this.documentlist.filter((x:any)=>x.docTypeId==190);
        if(doc_check.length<1)
        {
          let data1 = {
            "dmsDocId": null,
            "docName": "Tentative LPC Certificate",
            "docTypeId": 190
          }
          this.documentlist.push(data1);
        }
        let doc_check1:any[]=this.documentlist.filter((x:any)=>x.docTypeId==191);
        if(doc_check1.length<1)
        {
        let data2 = {
          "dmsDocId": null,
          "docName": "Added Gratuity Certificate",
          "docTypeId": 191
        }
       
        this.documentlist.push(data2);
      }
      
        this.spliceit();
        for (let i = 0; i < this.documentlist.length; i++) {
          this.removeDoc[i] = false;
        }
        for (let i = 0; i < this.documentlist.length; i++) {
          if (this.documentlist[i].dmsDocId != null) {
            if (this.documentlist[i].docTypeId == '23') {
              this.isMdown = true;
            } else if (this.documentlist[i].docTypeId == '18') {
              this.ischq = true
            } else if (this.documentlist[i].docTypeId == '15') {
              this.isRe = true;
            }else if (this.documentlist[i].docTypeId == '190') {
              this.isTLPC = true;
            }
            
          }
        }
        // console.log("documentlist",res.data);
      }
    })

  }

  spliceit() {

    let newdocumentlist: any[] = [];

    console.log("docList 1", this.docList);
    console.log("documentlist 1",);
    newdocumentlist = this.documentlist.filter(item => item.docName != "No DE Certificate");
    newdocumentlist = newdocumentlist.filter(item => item.docName != "Marriage Certificate");
    newdocumentlist = newdocumentlist.filter(item => item.docName != "Pension Kit");
    newdocumentlist = newdocumentlist.filter(item => item.docName != "Bank Passbook First Page/Cancelled Cheque");
    newdocumentlist = newdocumentlist.filter(item => item.docName != "No Dues Certificate");
    newdocumentlist = newdocumentlist.filter(item => item.docName != "FR");
    newdocumentlist = newdocumentlist.filter(item => item.docName != "Tentative LPC Certificate");
    newdocumentlist = newdocumentlist.filter(item => item.docName != "Added Gratuity Certificate");
    if (this.userDetails.roleid == 1 || this.userDetails.roleid == 2 || this.userDetails.roleid == 3) {
      newdocumentlist = newdocumentlist.filter(item => item.docName != "Pension Set");
    }
    newdocumentlist = newdocumentlist.filter(item => item.docName != "Signature");
    newdocumentlist = newdocumentlist.filter(item => item.docName != "Retirement Order Sanction");

    this.docList = newdocumentlist;
    console.log("docList 2", this.docList);
    for (let i = 0; i < this.docList.length; i++) {
      if (this.docList[i].dmsDocId != null) {
        this.removeDoc[i] = true;
      }
    }
    let docCheck: any[] = []
    docCheck = this.documentlist.filter((x: any) => x.docTypeId == 282)
    if (docCheck.length == 0) {
      let document1 = {
        "dmsDocId": null,
        docName: "Additional Document 1",
        docTypeId: 282
      }
      let document2 = {
        "dmsDocId": null,
        docName: "Additional Document 2",
        docTypeId: 283
      }
      let document3 = {
        "dmsDocId": null,
        docName: "Additional Document 3",
        docTypeId: 284
      }

      this.documentlist.push(document1);
      this.documentlist.push(document2);
      this.documentlist.push(document3);
      this.docList.push(document1);
      this.docList.push(document2);
      this.docList.push(document3);
      console.log("documentlist", this.documentlist)
    }


    if (this.Personaldetail?.disable == 'N') {
      newdocumentlist = newdocumentlist.filter(item => item.docName != "Disability Certificate");
    }
    if (this.Personaldetail?.disable == '0') {
      newdocumentlist = newdocumentlist.filter(item => item.docName != "Disability Certificate");
    }
  }




  index: any
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
        "type": "pension",
        "sourceId": 2,
        "docs": [
          {
            "docId": item.dmsDocId
          }
        ]
      }
      console.log("single report data", data)
      this._Service.postOr("wcc/getfiles", data).subscribe((res: any) => {
        console.log("res", res.data.document[0].content);
        if (res.data.document[0].content) {
          // let ex2:any[]=res.data.document[0].docName.split("."); 
          let data = {
            "base64Pdf": res.data.document[0].content,
            "redirectUrl": "pension/revised/revised-pension",
            // "type":ex2[1]
          }
          console.log("data", data);

          this.dialog.open(PdfPreviewComponent, { width: '70%', data: { message: data }, disableClose: false });


        }
      })
    } else {
      alert("Preview Not Available")
    }
  }
  previewFiles2(cer: any) {
    console.log(cer);
    let data1: any[] = this.documentlist.filter(item => item.docName == cer);

    console.log("data1", JSON.stringify(data1));
    if (data1[0].dmsDocId) {
      let data = {
        "type": "pension",
        "sourceId": 2,
        "docs": [
          {
            "docId": data1[0].dmsDocId
          }
        ]
      }
      console.log("single report data", data)
      this._Service.postOr("wcc/getfiles", data).subscribe((res: any) => {
        console.log("res", res.data.document[0].content);
        if (res.data.document[0].content) {
          let data = {
            "base64Pdf": res.data.document[0].content,
            "redirectUrl": "pension/revised/revised-pension"
          }
          console.log("data", data);

          this.dialog.open(PdfPreviewComponent, { width: '70%', data: { message: data }, disableClose: false });


        }
      })
    } else {
      alert("Preview Not Available")
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
    this.id = docTypeId
    this.Single_files1.push(docTypeId);
    for (let p of this.Single_files) {

      if (p.docTypeId === docTypeId) {

        this.id = 15
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

    this.id1 = id
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
    this.id1 = ''
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
    const employeeId = this.employeeId
    const docTypeId = "16"

    this._Service.saveDocument(this.Gfile, employeeId, docTypeId).subscribe(result => {

      let data =
      {
        "docTypeId": docTypeId,
        "documentId": result.data.dmsDocumentId,
        "docName": result.data.uploadStatusMessage,
      }
      this.document_list.push(data);
      console.log(result);
      // alert("File uploaded successfully");

      // localStorage.setItem("doc_Id", result.data.dmsDocumentId);
      this.config.storeDetails("doc_Id", result.data.dmsDocumentId)
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

  isLoading3:boolean[]=[]
  CPF_On(event: any, item: any, i: any) {
for(let j=0;j<this.docList.length;j++)
{
  this.isLoading3[j]=false;
}
    let time1 = new Date();

    this.file = event.target.files[0];
    let ex2: any[] = this.file.name.split(".");
    console.log("size", this.file.size / 1024)
    if (ex2[1].includes('PDF') || ex2[1].includes('pdf')) {

    } else {
      alert("Only PDF file format allowed")
      return;
    }

    if ((this.file.size / 1024) > 2048) {
      alert("Max 2 MB file size allowed")
      return;
    }

    this.fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + "." + ex2[1];
    this.fileName = this.fileName.replace(" ", "")


    const formData = new FormData();
    formData.append("file", this.file);
    formData.append("filename", this.fileName);
    this.isLoading3[i]=true;
    this._Service.postOr("wcc/uploadfile",formData).subscribe((res:any)=>{
      this.isLoading3[i]=false;
    
        let rajIndex = 0;
        this.documentlist.filter((data: any, index: number) => {
          if (data.docName == item.docName) {
            rajIndex = index;
            return data;
          }
        })
        if (res.data.document[0].docId)
          this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
        this.removeDoc[i] = true
        //this.documentlist[rajIndex]['newDocName']= this.fileName;

        console.log("document_list", this.documentlist);
        alert("Document Uploaded Successfully.")
    },(error)=>{
      this.isLoading3[i]=false;
      alert("Some Error Occured")
    })



    // const employeeId = this.employeeId
    // const docTypeId = item.docTypeId
    // const reader = new FileReader();
    // var data4: any;
    // reader.onloadend = () => {
    //   console.log(reader.result);
    //   // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
    //   data4 = reader.result;
    //   let data5 = data4.toString()
    //   data5 = data5.replace("data:application/pdf;base64,", "")
    //   console.log(data4);
    //   let data = {
    //     "type": "pdf",
    //     "sourceId": 3,
    //     "docAttributes": [

    //     ],
    //     "data": [
    //       {
    //         "docTypeId": docTypeId,
    //         "docTypeName": item.docName,
    //         "docName": this.fileName,
    //         "docTitle": "Certificate",
    //         "content": data5
    //       }
    //     ]
    //   }
    //   console.log("data", data);

    //   this._Service.postOr("wcc/uploaddocs", data).subscribe((res: any) => {
    //     console.log("res", res);
    //     let data =
    //     {
    //       "docTypeId": docTypeId,
    //       "documentId": res.data.document[0].docId,
    //       "docName": this.fileName,
    //     }
    //     let rajIndex = 0;
    //     this.documentlist.filter((data: any, index: number) => {
    //       if (data.docName == item.docName) {
    //         rajIndex = index;
    //         return data;
    //       }
    //     })
    //     if (res.data.document[0].docId)
    //       this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
    //     this.removeDoc[i] = true
    //     //this.documentlist[rajIndex]['newDocName']= this.fileName;

    //     console.log("document_list", this.documentlist);
    //     alert("Document Uploaded Successfully.")
    //   })
    // };
    // reader.readAsDataURL(this.file);

    // this.updateProgress();

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
    this.dialog.open(CommonDialogComponent,
      {
        panelClass: 'dialog-w-50', autoFocus: false
        ,
        height: "auto",
        width: "calc(100% - 50%)",
        data: {
          message: title,
          field: field,
          id: 7,
          btnText: btnText
        }
      }
    ).afterClosed()
      .subscribe(response => {
        console.log("json data", response);

        this.advancedLoan.push(JSON.parse(response.data));

      

        if (this.advancedLoan.length >= 1) {
          let HprincipalAmount:any=this.advancedLoan[this.advancedLoan.length - 1].principleAmount - this.advancedLoan[this.advancedLoan.length - 1].recoveredAmount;
          console.log("HprincipalAmount",HprincipalAmount)
        
            if (this.advancedLoan[this.advancedLoan.length - 1].loanTypeId == '1') {
              if(HprincipalAmount>0)
              {
              this.isHBA = true
              this.addDeduction.push(
                this.formbuilder.group({
                  deductionAmount: new FormControl(this.advancedLoan[this.advancedLoan.length - 1].principleAmount - this.advancedLoan[this.advancedLoan.length - 1].recoveredAmount),
                  deductionHead: new FormControl(this.HPrincipal),
                  deductionType: new FormControl(227),
                  deductionName: new FormControl(this.DeductionName(227).toString()),
  
                })
  
              );
              this.isRemoveDe[this.addDeduction?.length - 1] = false;
              console.log(this.addDeduction)
          }
          
            let HInterest=this.advancedLoan[this.advancedLoan.length - 1].interest;
            console.log("HInterest",HInterest)
            if(HInterest>0)
            {
              this.addDeduction.push(
                this.formbuilder.group({
                  deductionAmount: new FormControl(this.advancedLoan[this.advancedLoan.length - 1].interest),
                  deductionHead: new FormControl(this.HInterest),
                  deductionType: new FormControl(231),
                  deductionName: new FormControl(this.DeductionName(231).toString())
                })
              );
              this.isRemoveDe[this.addDeduction?.length - 1] = false;
            }
          
          } else if (this.advancedLoan[this.advancedLoan.length - 1].loanTypeId == '2') {
            this.isMCA = true;
            let MprincipalAmount:any=this.advancedLoan[this.advancedLoan.length - 1].principleAmount - this.advancedLoan[this.advancedLoan.length - 1].recoveredAmount;
            console.log("MprincipalAmount",MprincipalAmount)
            if(MprincipalAmount>0)
          {
            this.addDeduction.push(
              this.formbuilder.group({

                deductionAmount: new FormControl(this.advancedLoan[this.advancedLoan.length - 1].principleAmount - this.advancedLoan[this.advancedLoan.length - 1].recoveredAmount),
                deductionHead: new FormControl(this.MPrincipal),
                deductionType: new FormControl(223),
                deductionName: new FormControl(this.DeductionName(223).toString())
              })
            );
            this.isRemoveDe[this.addDeduction?.length - 1] = false;
          }
          let MInterest=this.advancedLoan[this.advancedLoan.length - 1].interest;
          console.log("MInterest",MInterest)
            if(MInterest>0)
            {
            this.addDeduction.push(
              this.formbuilder.group({
                deductionAmount: new FormControl(this.advancedLoan[this.advancedLoan.length - 1].interest),
                deductionHead: new FormControl(this.MInterest),
                deductionType: new FormControl(224),
                deductionName: new FormControl(this.DeductionName(224).toString())
              })
            );
            this.isRemoveDe[this.addDeduction?.length - 1] = false;
            }
          }

        }

      });



  }
  //#endregion LOAN AND ADVANCE

  get_Task_Detail() {

    let data = {
      "taskId": this.transId
    }
    this._Service.requestApplication(data, "task").subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.tasklist = res.data;
          console.log("this.tasklist", this.tasklist);
          this.isMaker1 = true
          this.FORWARD = res.data.actionData[0].actionLabel;
          this.REVERT = res.data.actionData[1].actionLabel;
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


  Remark() {

    if (this.userDetails.roleid == '1') {
      this.taskRoleId = 1
    }
    let data = {
      "roleId": this.taskRoleId
    }
    console.log(data)
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
      Remarks: remark_id.remarks
    })

  }

  Qualifying_Service = ''
  Non_Qualifying_Service = ''
  Type_DE = ''
  De_Start_Date = ''
  De_Completion_Date = ''

  isCrimnalCase: boolean = false
  addServiceRecord(field: any, title: any) {
    if (this.Pension_Commutation?.totalCurrentService) {
      field.totalServiceLength = this.Pension_Commutation.totalCurrentService
    }

    this.dialog.open(ServiceRecordDialogComponent,
      {
        panelClass: 'dialog-w-50', autoFocus: false
        ,
        height: "auto",
        width: "calc(100% - 30%)",

        data: {
          getServiceRecordData: (status: any, detypename: any) => {
            this.deTypeStatus = status;
            this.deTypeName = detypename;
            console.log(this.deTypeName)
            if (this.deTypeStatus == 1) {
              this.deTypeStatus = true;
            } else if (this.deTypeStatus == 0) {
              this.ServiceDetails.optForCommutation = this.ServiceDetails.optForCommutation;
              this.deTypeStatus = false;
            }
            this.isDisabled = this.deTypeStatus;
            console.log("DE Type Satus>>>>>", this.deTypeStatus)
          },
          message: title,
          field: field,
          id: 6,
          doj: this.dateofJoinging,
          dor: this.dateofRetirement,
          dob: this.Personaldetail.dateOfBirth,
          // joiningDate:this.ServiceDetails.DOJ
        }
      }
    ).afterClosed()
      .subscribe(data => {


        this.serviceRecordDatanew = JSON.parse(data.data)
        console.log("this.serviceRecordDatanew ", this.serviceRecordDatanew)
        this.addServiceRecord1()
        if (this.serviceRecordDatanew.deStatus == 1) {
          this.destatus = true
          this.ServiceDetails.optForCommutation = "No";
          this.ServiceDetails.commuationPercentage = 0;
          this.isCommutation = false;
          this.isCrimnalCase = true;
          // this.psnTypeId="74"
          // this.pType="Provisional Pension U/R 90"
          //  console.log(this.Calculations_Commutation_Details);
          //  this.Calculations_Commutation_Details.effectiveDate="";
          this.commutationDetails.patchValue({
            effectiveDate: ""
          })

        } else {
          // this.psnTypeId = this.config.getDetails('psnTypeId');    
          // if(this.psnTypeId=="68")
          // {
          // this.pType="Superannuation"
          // }else if(this.psnTypeId=="69")
          // {
          //   this.pType="Voluntary Retirement Pension U/R 50"
          // }
          
        
          this.serviceRecordDatanew.deType = ''
          if(this.revisedComData.commutFlag=='Y')
          {
           
            this.Personaldetail.comDate=this.revisedComData?.commutDate;
           
            this.commucationDate=new Date(this.revisedComData?.commutDate);
            
            this.commutationDetails.patchValue({ effectiveDate: this.commucationDate });
            this.ServiceDetails.optForCommutation = 'Yes';
            this.isCommutation = true;
            this.revisedCommutation=true;
            this.ServiceDetails.commuationPercentage=this.revisedComData?.comPercent
           
            this.commutationDateCalculation3(this.commucationDate);
          }else{
            this.ServiceDetails.optForCommutation = this.ServiceDetails.optForCommutation;
            if (this.ServiceDetails.optForCommutation == 'Yes') {
              this.isCommutation = true;
              this.revisedCommutation=true;
            } else if (this.ServiceDetails.optForCommutation == 'No') {
              this.isCommutation = false;
              this.revisedCommutation=true;
            }
          }
     
          this.destatus = false;
          this.isCrimnalCase = false;

        }
        
        if (this.isCommutation) {
          let dor1 = moment(this.Personaldetail.comDate).format();
          let dates = new Date(dor1)
          console.log("service dates", dates);

          // dates.setDate(dates.getDate() + 1);
         
          this.commutationDateCalculation(dates);
        }
      
        else {
          let dates = ""
          console.log("dates", dates);
          this.commutationDateCalculation(dates);
        }

      });




  }



  addTimeofService(firstService: any, secondService: any) {

    let dataarray1 = firstService.split(" ");
    let dataarray2 = secondService.split(" ");

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
    let finalTime = years + " years " + months + " months " + days + " days";
    console.log("finalTime", finalTime);

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
      "documentId": 4829
    }

    this._Service.postRequestpension(data, "getDocumentByDocumentId").subscribe({
      next: (res) => {
        if (res.status = 200) {

          this.documentList = res.data.documentContent;
          let data = {
            "base64Pdf": this.documentList,
            "redirectUrl": "pension/revised/revised-pension"
          }

          this.dialog.open(PdfPreviewComponent, { width: '60%', data: { message: data }, disableClose: false });

          //this.downloadPdf(this.documentList, name);
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


  downloadPdf(base64String: any, fileName: any) {

    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.pdf`
    link.click();
    window.URL.revokeObjectURL(link.href);
    window.open(link.href, '_blank');
  }


  getServiceSubCategory(event: any) {
    this.serviceSubCatData = [];
    let data = {
      serviceCategoryId: event
    }
    this._Service.postRequestAddress(data, "getAllSubServiceCategoryByServiceCategoryId").subscribe({
      next: (res) => {
        if (res.status = 200) {
          if (res.data === "No Data Found!") {
          } else {
            this.serviceSubCatData = res.data;
          }
        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }
    })
  }

  treasurylist: any;
  getTreasury() {

    let data = {
      "attrValue": 2
    }

    this._Service.postloantype(data, "getpensiontreasury").subscribe({
      next: (res) => {
        if (res.status = 200) {

          this.treasurylist = res.data
          //console.log(this.treasurylist);
        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }
    })
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
  
 
    this.Pension_Commutation2.monthlyPensionTreasury = i
    this.Pension_Commutation.monthlyPensionTreasury = i
  
  }
  basicPayName(id: any) {
    if (id) {
      this.basicPaylist.filter((x: any) => x.basicPayId == id)[0].basicPay
    }
  }
  payLevelName(id: any) {
    if (id) {
      this.payScalelist.filter((x: any) => x.payScaleId == id)[0].payScaleName
    }
  }

  makerConditionCheck()
  {
  
    if (this.Pension_Commutation?.monthlyPensionTreasury == "0") {
      alert("Please select 'Monthly Pension Treasury' at Bank/Treasury Tab");
      return;
    }
    console.log("documentlist", this.documentlist)
    let deDoc = this.documentlist.filter((x: any) => x.docTypeId == '17')[0].dmsDocId;

    if (deDoc == '' || deDoc == null) {
      alert("Please upload DE Certificate in Service Record Tab");
      return;
    }
    let deDoc1 = this.documentlist.filter((x: any) => x.docTypeId == '15')[0].dmsDocId;

    if (deDoc1 == '' || deDoc1 == null) {
      alert("Please upload Retirement Order Sanction in Service Details Tab");
      return;
    }
    if(this.treasury=="0" || this.treasury==undefined || this.treasury==null)
    {
    alert("Your Bank treasury is not proper.Please update that");
    return;
    }
    if(this.isCommutation)
    {
      if(this.Pension_Commutation.commutationEffectiveDate="")
      {
        alert("Please select a commutation date");
    return;
      }
    if(this.Pension_Commutation.commutationValue="")
    {
      alert("Please enter commutation Percentage.");
    return;
    }
  
  }

if(this.userDetails.treasCode=='' || this.userDetails.treasCode=='0' || this.userDetails.treasCode==null || this.userDetails.treasCode==undefined)
{
  alert("Your Treasury Code is not proper.please update that");
  return;
}
  }
  getPayLavelName(id:any)
  {
    
    if(id && this.payScalelist)
    {
      return this.payScalelist.filter((res:any)=>res.payScaleId==id)[0]?.payScaleName;
    }else
    return '';
  }
  ppo_number: any;
  monthlyPensionTreasury: any
  caculationPayload: any;
  errorList:any[]=[];
  onSubmit_Final_Maker(action: any) {

    if (this.ServiceDetails.addedServices=='Yes' &&  this.ServiceDetails.addedJoiningDate=='') {

      alert("Please add ADDED services Joining Date at 'Pay Deatils' Tab.");
      return;
    }
        if (this.Pension_Commutation?.monthlyPensionTreasury == "0") {
          alert("Please select 'Monthly Pension Treasury' at Bank/Treasury Tab");
          return;
        }
        if(this.Personaldetail?.pan=='' || this.Personaldetail?.pan==null || this.Personaldetail?.pan==undefined)
        {
          alert("Employee PAN Number is not updated on Pention-ESS.Please update PAN on Pension-ESS before Pension initiate.");
          return;
        }
        if(this.Personaldetail.selfPhotoId=='' || this.Personaldetail.selfPhotoId==null || this.Personaldetail.selfPhotoId==undefined)
        {
          alert("Please upload Employee self photograph");
          return;
        }
        if(this.Personaldetail.jointPhotoId=='' || this.Personaldetail.jointPhotoId==null || this.Personaldetail.jointPhotoId==undefined)
        {
          alert("Please upload Employee Joint photograph");
          return;
        }
        console.log("documentlist", this.documentlist)
        // let deDoc = this.documentlist.filter((x: any) => x.docTypeId == '17')[0].dmsDocId;
    
        // if (deDoc == '' || deDoc == null) {
        //   alert("Please upload DE Certificate in Service Record Tab");
        //   return;
        // }
        let deDoc1 = this.documentlist.filter((x: any) => x.docTypeId == '15')[0].dmsDocId;
    
        if (deDoc1 == '' || deDoc1 == null) {
          alert("Please upload Retirement Order Sanction in Service Details Tab");
          return;
        }
        if(this.treasury=="0" || this.treasury==undefined || this.treasury==null)
        {
        alert("Your Bank treasury is not proper.Please update that");
        return;
        }
        if(this.isCommutation)
        {
          if(this.Pension_Commutation.commutationEffectiveDate="")
          {
            alert("Please select a commutation date");
        return;
          }
        if(this.Pension_Commutation.commutationValue="")
        {
          alert("Please enter commutation Percentage.");
        return;
        }
      
      }
    
    if(this.userDetails.treasCode=='' || this.userDetails.treasCode=='0' || this.userDetails.treasCode==null || this.userDetails.treasCode==undefined)
    {
      alert("Your Treasury Code is not proper.please update that");
      return;
    }
    if(Number(this.Pension_Commutation2?.netPay)<1)
    {
      alert("Payable DCRG is less than 1.");
      return
    }
    if(Number(this.Pension_Commutation2?.pensionAmount)<0)
    {
      alert("Pension Amount less than 1.");
      return
    }
    this.ServiceDetails['tenPayLevel']=this.tenPayLevel?this.tenPayLevel:"";
    this.ServiceDetails['tenBasicPay']=this.tenBasicPay?this.tenBasicPay:"";
    this.ServiceDetails['tBasicPayReason']=this.tBasicPayReason?this.tBasicPayReason:"";
    this.ServiceDetails['tenPayLevelName']=this.tenPayLevel?this.getPayLavelName(this.tenPayLevel):"";
    this.Pension_Commutation.specialpay=this.specialPay;
        let commutation_data: any;
        if (!this.isCommutation) {
          commutation_data = {
            "budgetHead": "",
            "budgetHeadId": "",
            "effectiveDate": "",
            "commutationAmount": "",
            "commutationFactor": "",
            "commutationValue": "",
          }
          this.Pension_Commutation2.commutedFactor = "";
          this.Pension_Commutation2.commutationAmount = "";
          this.Pension_Commutation2.commutationValue = "";
        } else {
          commutation_data = {
            "budgetHead": this.getBudHead('Commutation'),
            "budgetHeadId": this.getBudHeadId('Commutation'),
            "effectiveDate": this.Pension_Commutation2.commutationEffectiveDate,
            "commutationAmount": this.Pension_Commutation2.commutationAmount,
            "commutationFactor": this.Pension_Commutation2.commutedFactor,
            "commutationValue": this.Pension_Commutation2.commutationValue,
          }
        }
    
        let condition3 = ""
        if (this.isgovHouseAlloted && this.advancedLoan?.length == 0) {
          condition3 = "No dues Certificate of occupation of Government accommodation has been obtained from the concerned authority";
        } else if (!this.isgovHouseAlloted) {
          condition3 = "Certificate of non occupation of Government accommodation has been obtained from the Government Employee and it is certify that he/she is not in occupation of any Government accommodation and/or have not taken any articles like furniture etc. from P.W.D. Stores on rent"
        } else if (this.isgovHouseAlloted && this.advancedLoan?.length > 0) {
          condition3 = "Government servant has taken Government accommodation and/or any articles like furniture etc. from P.W.D, a certificate has been obtained from the Director Estate Department and accordingly recovery/ deduction have been proposed in e-pension set"
        }
        let condition_data = [{
          "condtion_type_id": "1",
          "condition": this.conditionForm.value.condition_1,
          "condition_StartDate": moment(this.conditionForm.value.condition_1_Date).format(),
          "condition_EndDate": moment(this.conditionForm.value.condition_1_Date1).format(),
          "condition_FromtDate": "",
          "condition_TotDate": "",
          "condition_Amount2": "",
          "condition_Amount": this.conditionForm.value.condition_1_Amount,
          "condition_string": "It is certified that" + (!this.isCrimnalCase ? ' No ' : "") + "Departmental Enquiry under rule 16 of C.C.A Rules or criminal case is pending or contemplated against the employee on dated " + this.date.transform(this.conditionForm.value.condition_1_Date, "dd-MM-yyy") + "(date of submission of pension case) as per appointing authority order No " + this.conditionForm.value.condition_1_Amount + " date " + this.date.transform(this.conditionForm.value.condition_1_Date1, "dd-MM-yyy") + " . Copy of retirement orders issued from the Appointing Authority are attached with e-pension set"
        },
        {
          "condition_Amount2": "",
          "condtion_type_id": "2",
          "condition": this.conditionForm.value.condition_2,
          "condition_string": "Qualifying service has been computed in the e-pension set is in accordance to service verification recorded in the service book",
          "condition_StartDate": "",
          "condition_EndDate": "",
          "condition_FromtDate": "",
          "condition_TotDate": "",
          "condition_Amount": ""
        },
        {
          "condition_Amount2": "",
          "condtion_type_id": "3",
          "condition": this.conditionForm.value.condition_3,
          "condition_string": condition3,
          "condition_StartDate": "",
          "condition_EndDate": "",
          "condition_FromtDate": "",
          "condition_TotDate": "",
          "condition_Amount": ""
        },
    
        {
          "condition_Amount2": "",
          "condtion_type_id": "4",
          "condition": this.conditionForm.value.condition_4,
          "condition_string": "A certificate has been obtained from the senior accounts personnel in the Office that all the fixations made from time to time are correct and the pay being drawn is also correct, the same is attached with the e-pension set",
          "condition_StartDate": "",
          "condition_EndDate": "",
          "condition_FromtDate": "",
          "condition_TotDate": "",
          "condition_Amount": "",
        },
    
    
        {
          "condition_Amount2": "",
          "condtion_type_id": "5",
          "condition": this.conditionForm.value.condition_5,
          "condition_string": "Extraordinary Leave is taken on Medical Certificate, or for Higher Studies or due to Civil Commotion/natural calamities, orders of the competent authority counting the leave period for pension are recorded in the Service Book and the same have been included in the qualifying service. Extra ordinary leave is taken other than medical certificate or interruptions of service have been included as non qualifying service in e-pension set",
          "condition_StartDate": "",
          "condition_EndDate": "",
          "condition_FromtDate": "",
          "condition_TotDate": "",
          "condition_Amount": "",
        },
        {
          "condition_Amount2": "",
          "condtion_type_id": "6",
          "condition": this.conditionForm.value.condition_6,
          "condition_string": "Entry to the effect that employer's share of CPF balance has been deposited in the Government Account and Transfer Entry passed by the State Insurance/Provident Fund Department, has been recorded in the Service Book.",
          "condition_StartDate": "",
          "condition_EndDate": "",
          "condition_FromtDate": "",
          "condition_TotDate": "",
          "condition_Amount": ""
        },
        {
          "condition_Amount2": "",
          "condtion_type_id": "7",
          "condition": this.conditionForm.value.condition_7,
          "condition_string": "The dues of the Government recoverable from the Government servant have been shown in tentative L.P.C and recovery/ deduction has been proposed in e-pension set",
          "condition_StartDate": "",
          "condition_EndDate": "",
          "condition_FromtDate": "",
          "condition_TotDate": "",
          "condition_Amount": ""
        },
        {
          "condition_Amount2": "",
          "condtion_type_id": "8",
          "condition": this.conditionForm.value.condition_8,
          "condition_StartDate": "",
          "condition_EndDate": "",
          "condition_FromtDate": "",
          "condition_TotDate": "",
          "condition_string": "It is certified that no HBA/MCA was sanctioned to him/her during entire services",
          "condition_Amount": "",
        }
        ]
    
        let payload_summary = {
          "empName": this.Personaldetail.nameEn,
          "emp_Id": this.Personaldetail.employeeId,
          "empCode": this.Personaldetail.employeeCode
        }
        if (this.Calculations_Pay_Details) {
          this.Calculations_Pay_Details['mainBudgetHead'] = this.getBudHead("General");
          this.Calculations_Pay_Details['gratuityBudgetHead'] = this.getBudHead("Gratuity");
          this.Calculations_Pay_Details['mainBudgetHeadId'] = this.getBudHeadId("General");
          this.Calculations_Pay_Details['gratuityBudgetHeadId'] = this.getBudHeadId("Gratuity");
          this.Calculations_Pay_Details['pensionType'] = this.pType?this.pType:"Superannuation"
          this.Calculations_Pay_Details['pensionTypeCode'] = this.psnTypeId?this.psnTypeId:"68"
        }
    
    
    
        this.Banklist['treasuryCode'] = this.userDetails.treasCode;
        this.Banklist['treasuryName'] = this.userDetails.treasName;
    
    
        this.Personaldetail['requestId'] = this.reqid ? this.reqid : "";
        let docCheck: any[] = []
        let docCheck2: any[] = []
        docCheck = this.documentlist.filter((x: any) => x.docTypeId == 33)
        docCheck2 = this.documentlist.filter((x: any) => x.docTypeId == 32)
        if (docCheck.length == 0) {
    
          let selfPic = {
            "dmsDocId": this.Personaldetail?.selfPhotoId,
            "docName": "Self Photograph",
            "docTypeId": 33
          }
          this.documentlist.push(selfPic)
    
        }else
        {
          let rajIndex: any
          if (docCheck.length != 0) {
            this.documentlist.filter((data: any, index: number) => {
              if (data.docTypeId == 33) {
                rajIndex = index;
                return data;
              }
            })
            this.documentlist[rajIndex].dmsDocId=this.Personaldetail?.selfPhotoId
          }
        }
        if(docCheck2.length == 0)
        {
          let jointPic = {
            "dmsDocId": this.Personaldetail?.jointPhotoId,
            "docName": "Joint Photograph",
            "docTypeId": 32
          }
          this.documentlist.push(jointPic)
        }else
        {
          let rajIndex: any
          if (docCheck.length != 0) {
            this.documentlist.filter((data: any, index: number) => {
              if (data.docTypeId == 32) {
                rajIndex = index;
                return data;
              }
            })
            this.documentlist[rajIndex].dmsDocId=this.Personaldetail?.jointPhotoId
          }
        }
         
    
        
    
        console.log("this.documentlist", this.documentlist);
        let data = {
          "requestData": {
            "processId": "2",
            "taskSeq": "",
            "processTaskSeq": "",
            "taskTranId": this.transId ? this.transId : "",
            "requestId": this.reqid ? this.reqid : "",
            "requestDesc": "",
            "initiator": this.userDetails.assignmentid,
            //"person_id": this.empinfo.userId,
            "person_name": this.empinfo.displayName ? this.empinfo.displayName : "",
            "action": action,
            "remarks": this.Request_Confirmation.controls['Remarks'].value ? this.Request_Confirmation.controls['Remarks'].value : "",
            "payloadChangeFlag": "Y",
            "adApproveFlag": ""
          },
          "payload": {
    
            "personalDetails": this.Personaldetail ? this.Personaldetail : "",
            "serviceDetails": this.ServiceDetails ? this.ServiceDetails : "",
            "addressDetails": this.EMPAddress ? this.EMPAddress : "",
            "familyDetails": this.familyDetails ? this.familyDetails : "",
            "nominationDetails": this.nominee ? this.nominee : [],
            "serviceRecords": this.serviceRecordDatanew ? this.serviceRecordDatanew : "",
            "loansAdvance": this.advancedLoan,
            "calculationsPayDetails": this.Calculations_Pay_Details ? this.Calculations_Pay_Details : "",
            "calculationsAdditionalAllowanceRecovery": this.registrationForm.value ? this.registrationForm.value : "",
            "calculationsPensionDetails": this.Pension_Commutation2 ? this.Pension_Commutation2 : "",
            "calculationsCommutationDetailsNomination": commutation_data ? commutation_data : "",
            "bankTreasuryDetails": this.Banklist ? this.Banklist : "",
            "documents": this.documentlist ? this.documentlist : "",
            "conditionList": condition_data ? condition_data : "",
            "employeeId": this.Personaldetail.employeeId,
            "employeeCode": this.Personaldetail.employeeCode,
            "createdByAid": this.empinfo.aid,
            "createdByUserId": this.empinfo.userId,
            "payeeId": this.Personaldetail.payeeId ? this.Personaldetail.payeeId : "",
            "ObjectionArray": this.ObjectionArray,
            "caculationPayload": this.caculationPayload,
            "oldPayload":this.oldPayload
          }
          ,
          "payloadSummary": payload_summary ? payload_summary : "",
    
        }
    
        console.log(data);
 
    // this._Service.post('validatePensionJson',data.payload).subscribe((res:any)=>{
     
    // },(error)=>{
    //   let data=error.error;
    //   console.log("error",data)
    //   let datastring:string=JSON.stringify(data);
    //   let datastring2:string='';
    //   this.errorList=datastring.split('checkDetails.arg0.')
    //   this.errorList.splice(0,1);
    // console.log("data2",this.errorList)
    // for(let i=1;i<this.errorList.length;i++)
    // {
    //   datastring2=datastring2+i+':'+this.errorList[i]
    // }
      
    //   console.log("datastring",datastring2)
    //   // alert(datastring2)
    // })
    
    this._Service.requestApplication(data, 'action').subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.rid = res.requestId
          this.modalService.dismissAll();
          this.pensionInitaite();
          this.dialog.open(CommonDialogComponent,
            {
              panelClass: 'dialog-w-50', autoFocus: false
              , data: {
                message: 'success', reqId: this.rid, id: 4, aid: this.empinfo.aid, ppo_no: '', action: action
              }
            }
          );
        }
      },
      error: (err) => {
        alert("Some error occur")
      },
    });
      }

  pensionInitaite() {
    
 let data
    if (this.userDetails.roleid == '1') {

    data={	 
      "inMstType": 3,
          "requestData": [{
                    "employeeId": -1,
                   "employeeCode": this.Personaldetail.employeeCode,
                    "isRevisionUnderProcess": "Z"
                } ] 
       }  
      }else
          if (this.userDetails.roleid == '6') {
            data={	 
              "inMstType": 3,
                  "requestData": [{
                            "employeeId": -1,
                           "employeeCode": this.Personaldetail.employeeCode,
                            "isRevisionUnderProcess": "N"
                        } ] 
               }  
              }else
              if (this.userDetails.roleid == '2') {
                data={	 
                  "inMstType": 3,
                      "requestData": [{
                                "employeeId": -1,
                               "employeeCode": this.Personaldetail.employeeCode,
                                "isRevisionUnderProcess": "M"
                            } ] 
                   }  
                  }
       console.log("update revision",data);
       this._Service.postCumm("essWorkMultiTask",data).subscribe((res:any)=>{

       },(error)=>{
       alert("update revision flag service not work.Please Submit again.")
       })
  }

  document_id: document_id[] = [];
  document_id_list: document_id_list[] = [];
  getBudgetDetails(ser: any) {
    console.log("this.ServiceDetails", ser);
    this.BudgetDetails = [
    ]
    let data =
    {
      "pensionCode": this.psnTypeCode ? this.psnTypeCode : "68",
      "srvcCatId": ser.serviceCatId
    }
    console.log("getBudgetDetails", data);
    this._Service.postdeduction(data, 'getPensionBudgetHead').subscribe({
      next: (res) => {
        console.log("BudgetDetails", res);

        this.BudgetDetails = res.data.psnBdgtHeadMapData;
        if(this.BudgetDetails.length<1)
        {
          alert("Budget Head is blank. Please refresh page.")
        }
        this.DeductionbudgetHead();
        //  this.generalBudHead=this.BudgetDetails.filter((x: any) => x.psbBdgtHeadTypName == "General";
      },
      error: (err) => {

        alert("Budget Head is blank. Please refresh page.")

      },
    });
  }
  getBudHead = (id: string) => {

    if (this.BudgetDetails?.length > 1)
      return this.BudgetDetails.filter((x: any) => x.psbBdgtHeadTypName == id)[0].budgetHead;
    else
      return "";
  }
  getBudHeadId = (id: string) => {
    if (this.BudgetDetails?.length > 1)
      return this.BudgetDetails.filter((x: any) => x.psbBdgtHeadTypName == id)[0].budgetHeadId;
    else
      return "";
  }
  conditionList: any
  isAccCert: boolean = false;
  payloadTask:any;
  getTaskDetail(taskId: any) {

    let data = {
      "taskId": taskId
    }
    this._Service.requestApplication(data, "task").subscribe({
      next: (res) => {
        if (res.status = 200) {
          let data4 = JSON.parse(JSON.stringify(res.data).replace(/\:"null"/gi, "\:\"\""));
          console.log("data2", data4);
          this.tasklist = data4.actionData
          this.payloadTask=data4.payload;
          console.log("payloadTask", this.payloadTask);
          this.FORWARD = data4.actionData[0]?.actionLabel;
          this.REVERT = data4.actionData[1]?.actionLabel;
          this.familyDetails = data4.payload.familyDetails;
          this.Personaldetail = data4.payload.personalDetails;
          this.ServiceDetails = data4.payload.serviceDetails;
          this.nominee = data4.payload.nominationDetails;
          this.conditionList = data4.payload.conditionList
          this.Pension_Commutation = data4.payload.calculationsPensionDetails;
          this.oldPayload=data4.payload?.oldPayload,
          this.caculationPayload= data4.payload?.caculationPayload
          //console.log('pension data',this.Pension_Commutation)
          this.Banklist = data4.payload.bankTreasuryDetails;
          // if (this.userDetails.roleid == '3') {
          //   this.getLRnumber();
          // }
          this.Calculations_Pay_Details = data4.payload.calculationsPayDetails;
          this.Calculations_ARD_Details = data4.payload.calculationsAdditionalAllowanceRecovery;
          this.Calculations_Commutation_Details = data4.payload.calculationsCommutationDetailsNomination;
          //console.log('pension data',this.Calculations_Commutation_Details)
          this.loanAndAdvancesDetails = data4.payload.loansAdvance;
          this.ObjectionArray = data4.payload?.ObjectionArray ? data4.payload?.ObjectionArray : []
          this.advancedLoan = data4.payload.loansAdvance;
          this.document_list = data4.payload.documents;
          this.documentlist = data4.payload.documents;
          this.EMPAddress = data4.payload.addressDetails
          console.log("this.EMPAddress", this.EMPAddress)
          this.residenceAddress = this.EMPAddress.employeeAddresses;
          console.log("this.residenceAddress", this.residenceAddress)
          this.officeArray = data4.payload.addressDetails.officeAddresses;
          let newdocumentlist: any[] = [];
          newdocumentlist = this.documentlist;
          if (newdocumentlist?.length > 0) {
            newdocumentlist = newdocumentlist.filter(item => item.docName != "Pension Kit");
            newdocumentlist = newdocumentlist.filter(item => item.docName != "Signature");
            newdocumentlist = newdocumentlist.filter(item => item.docName != "Self Photograph");
            newdocumentlist = newdocumentlist.filter(item => item.docName != "Joint Photograph");
            newdocumentlist = newdocumentlist.filter(item => item.docName != "No DE Certificate");
            newdocumentlist = newdocumentlist.filter(item => item.docName != "No Dues Certificate");
            newdocumentlist = newdocumentlist.filter(item => item.docName != "Revised APC");
            if (this.userDetails.roleid == 1 || this.userDetails.roleid == 2 || this.userDetails.roleid == 3) {
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Pension Set");
            }
            newdocumentlist = newdocumentlist.filter(item => item.docName != "FR");
            if (this.Personaldetail?.disable == 'N') {
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Disability Certificate");
            }
            if (this.Personaldetail?.disable == '0') {
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Disability Certificate");
            }
            
            if (this.userDetails.roleid == 2) {    
              let docId = this.documentlist.filter((x: any) => x.docName == 'Revised APC')[0]?.dmsDocId;
            console.log('docId',docId)
              if (docId == '' || docId == null) {}else{ this.isAccCert = true;}

            }


          }


          this.docList = newdocumentlist;
          console.log("this.docList", this.docList);
          for (let i = 0; i < this.docList.length; i++) {

            this.removeDoc[i] = false;

          }
          for (let i = 0; i < this.docList.length; i++) {
            if (this.docList[i].dmsDocId) {
              this.removeDoc[i] = true;
            }
          }
          this.payload_summary = data4.payload.payloadSummary
          // this.serviceRecord_arry = data4.payload.serviceRecords;

          this.EMP_doc = data4.payload.documents;

          console.log("this.residenceAddress", this.residenceAddress)
          this.documentlist = data4.payload.documents;
          this.nominee = data4.payload.nominationDetails;
          let product1: any;
          this.serviceRecordDatanew = data4.payload.serviceRecords
          this.addServiceRecord1();
          // this.addServiceRecord1(data4.payload.serviceRecords);

          this.serviceRecord_arry_List.push(data4.payload.serviceRecords)
          console.log()
          if (this.ServiceDetails.optForCommutation == 'Yes') {
            this.isCommutation = true;
          } else if (this.ServiceDetails.optForCommutation == 'No') {
            this.isCommutation = false;
          }
          if (this.serviceRecordDatanew.deStatus == "1") {
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
              this.iconCA = 'person_pin_circle'

            } else if (product1.schemeName == 'Arrears') {
              this.arrear_Arr.push(product1);

            } else if (product1.schemeName == 'Gratuity') {

              this.gratuity_Arr.push(product1);

            }
          }
          if (this.serviceRecordDatanew.deType == '1' || this.serviceRecordDatanew.deType == '4') {
            this.isCrimnalCase = true;

          }
          for (let i = 0; i < data4.payload.documents.length; i++) {
            if (i % 2 == 0) {
              this.doc_list.push(data4.payload.documents[i]);
            }
            else {
              this.doc_list1.push(data4.payload.documents[i]);
            }
          }


          if (this.Personaldetail?.nextAd) {

            this.nextAd1 = true;

          }


          // this.conditionForm.setValue(data4.payload.conditionList);
          let product: any;
          for (product of this.residenceAddress) {
            if (product.commType == 'C') {
              this.residenceArray.push(product);
              // console.log("this.residenceArray",this.residenceArray);
              this.iconCA = 'person_pin_circle'
            }
            else if (product.commType == 'P') {
              this.DepartmentAddress.push(product);
              this.iconPA = 'account_box';
            }
          }

          for (let D of this.documentlist) {
            for (let p of this.EMP_doc) {
              if (p.docTypeId == D.docTypeId) {
                this.document_id.push(
                  { id: p.docTypeId })

                this.document_id_list.push(
                  {
                    document_name: D.docName,
                    size: '215',
                    id: D.docTypeId
                  })
                // console.log(this.document_id_list);

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
  removeAPC(i: any) {
    console.log("docList1", this.docList)
    console.log("documentlist1", this.documentlist)
    this.docList = this.docList.filter((x: any) => x.docName != 'Revised APC');
    this.documentlist = this.documentlist.filter((x: any) => x.docName != 'Revised APC');
    console.log("docList", this.docList)
    console.log("documentlist", this.documentlist)
    this.isAccCert = false;

  }
  nextAd1: boolean = false
  getTreaName(i: any) {
    if (i) {
      return this.treasurylist.filter((x: any) => x.treasCode == i)[0]?.treasNameEn
    }

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
      console.log("res", res);
      if (res.status == 'S') {
        if (res.data.document[0].content) {
          
          this.imageUrl = "data:image/jpeg;base64," + res.data.document[0].content;
        }
      } else {
        console.log("self pic have some error")
      }

    })
  }
  jointPic = (id: any) => {
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
      //console.log("res", res.data.document[0].content);
      if (res.data.document[0].content) {
        this.jointImageUrl = "data:image/jpeg;base64," + res.data.document[0].content;
      }
    })
  }
  newconditions: any;
  makerObj: boolean = false
  effectivedate: any;
  getTaskDetailMaker(taskId: any) {

    let data = {
      "taskId": taskId
    }
    this._Service.requestApplication(data, "task").subscribe({
      next: (res) => {
   
        if (res.status = 200) {
          let data4 = JSON.parse(JSON.stringify(res.data).replace(/\:"null"/gi, "\:\"\""));
          console.log("data2", data4);
          this.makerObj = true
          this.tasklist = data4.actionData
          console.log("taskdata", this.tasklist);
          this.FORWARD = data4.actionData[0]?.actionLabel;
          this.REVERT = data4.actionData[1]?.actionLabel;
          this.load.show();
          this.employeeId = data4.payload.personalDetails?.employeeId;
          console.log("data4.payload", data4.payload)

          this.fetchPersonaldetail();
          this.fetchAddressesEmp();
          this.getFamilyDetails();
          this.nominee = []
          this.getNomination();
          this.fetchServicesdetail();
          this.Bank_Detail();
          this.fetchpersonalEmp()
          setTimeout(() => {
            this.oldPayload=data4.payload?.oldPayload;
            this.Pension_Commutation = data4.payload.calculationsPensionDetails;
            this.Pension_Commutation2 = data4.payload.calculationsPensionDetails;
            // this.familyDetails = data4.payload.familyDetails;
            this.lRnumber = data4.payload.personalDetails?.lrNo;
            this.ServiceDetails.addedServices=data4.payload?.serviceDetails?.addedServices
            this.ServiceDetails.addedJoiningDate=data4.payload?.serviceDetails?.addedJoiningDate;
            this.ServiceDetails.addedServicesGratuity =  data4.payload?.serviceDetails?.addedServicesGratuity;
            this.ServiceDetails.addedServicesGratuityAmount =  data4.payload?.serviceDetails?.addedServicesGratuityAmount;
            this.psnTypeId=data4.payload?.calculationsPensionDetails?.pensionType;
            this.pType=data4.payload?.calculationsPayDetails?.pensionType;
            // if(this.psnTypeId=="68")
            // {
            // this.pType="Superannuation"
            // }else if(this.psnTypeId=="69")
            // {
            //   this.pType="Voluntary Retirement Pension U/R 50"
            // }
            this.tenPayLevel=data4.payload?.serviceDetails?.tenPayLevel;
            this.tenBasicPay=data4.payload?.serviceDetails?.tenBasicPay;
            this.tBasicPayReason=data4.payload?.serviceDetails?.tBasicPayReason;
            this.getBasicPay();
            if(data4.payload?.serviceDetails?.addedJoiningDate)
            {
              let date1=moment(data4.payload?.serviceDetails?.addedJoiningDate).format('YYYY-MM-DD[T]HH:mm:ss');             
              this.addedJoiningDate=date1
            }
            // this.ServiceDetails = data4.payload.serviceDetails;
            this.getBudgetDetails(this.ServiceDetails);
            // this.nominee = data4.payload.nominationDetails;
          
            this.dateofRetirement = this.Personaldetail.dor;
        
            this.maxDate2 = new Date(this.dateofRetirement);
                    if(Number(this.psnTypeId)==69)
                  {}else{
                    this.maxDate2 = new Date(this.maxDate2.getFullYear(), this.maxDate2.getMonth(), this.maxDate2.getDate() + 1)
                  }
            this.serviceRecordDatanew = data4.payload.serviceRecords;
            this.addServiceRecord1();
            console.log("serviceRecordDatanew", this.serviceRecordDatanew)
            if (this.serviceRecordDatanew.deStatus == 1) {
              this.destatus = true
              if (this.serviceRecordDatanew.deType == '1' || this.serviceRecordDatanew.deType == '4') {
                this.ServiceDetails.optForCommutation = "No";
                this.ServiceDetails.commuationPercentage = 0;
                this.isCommutation = false;
                this.isCrimnalCase = true;
                //  console.log(this.Calculations_Commutation_Details);
                //  this.Calculations_Commutation_Details.effectiveDate="";
                this.commutationDetails.patchValue({
                  effectiveDate: ""
                })
              }
            } else {

              this.ServiceDetails.optForCommutation = data4.payload.serviceDetails.optForCommutation;
              this.destatus = false;
              this.isCrimnalCase = false;
            }


            //console.log('pension data',this.Pension_Commutation)
            // this.Banklist = data4.payload.bankTreasuryDetails;

            // this.Calculations_Pay_Details = data4.payload.calculationsPayDetails;
        
            this.Calculations_ARD_Details = data4.payload.calculationsAdditionalAllowanceRecovery;
            console.log("this.Calculations_ARD_Details", this.Calculations_ARD_Details)
            this.ObjectionArray = data4.payload?.ObjectionArray ? data4.payload?.ObjectionArray : []
            if (this.Calculations_ARD_Details?.addDeduction.length > 0) {
              this.Calculations_ARD_Details?.addDeduction.forEach((element: any, i: any) => {
                this.addDeduction.push(
                  this.formbuilder.group({
                    deductionType: new FormControl(element.deductionType),
                    deductionName: new FormControl(element.deductionName),
                    deductionAmount: new FormControl(element.deductionAmount),
                    deductionHead: new FormControl(element.deductionHead)
                  })


                );
                this.isRemoveDe[i] = true;
              });

            }
            if (this.Calculations_ARD_Details?.addAllowanceType.length > 0) {
              this.Calculations_ARD_Details?.addAllowanceType.forEach((element: any) => {
                this.addAllowanceType.push(
                  this.formbuilder.group({
                    allowanceType: new FormControl(element.allowanceType),
                    allowanceName: new FormControl(element.allowanceName),
                    allowanceAmount: new FormControl(element.allowanceAmount),
                    allowanceHead: new FormControl(element.allowanceHead)
                  })


                );
              });

            }

            if (this.Calculations_ARD_Details?.addDynamicElement.length > 0) {
              this.Calculations_ARD_Details?.addDynamicElement.forEach((element: any) => {
                this.addDynamicElement.push(
                  this.formbuilder.group({
                    recoveryType: new FormControl(element.recoveryType),
                    recoveryAmount: new FormControl(element.recoveryAmount),
                    recoveryHead: new FormControl(element.recoveryHead)
                  })


                );
              });

            }
            if (this.Calculations_ARD_Details?.addWithHeld.length > 0) {
              this.Calculations_ARD_Details?.addWithHeld.forEach((element: any) => {
                this.addWithHeld.push(
                  this.formbuilder.group({
                    withHeldType: new FormControl(element.withHeldType),
                    withHeldName: new FormControl(element.withHeldName),
                    withHeldAmount: new FormControl(element.withHeldAmount),
                    withHeldReason: new FormControl(element.withHeldReason)
                  })


                );
              });

            }
            // this.addDeduction=this.Calculations_ARD_Details.addDeduction
            this.Calculations_Commutation_Details = data4.payload.calculationsCommutationDetailsNomination;
            //console.log('pension data',this.Calculations_Commutation_Details)
            this.loanAndAdvancesDetails = data4.payload.loansAdvance;
            this.advancedLoan = data4.payload.loansAdvance;
            this.document_list = data4.payload.documents;
            this.documentlist = data4.payload.documents;

            // this.EMPAddress = data4.payload.addressDetails
            // console.log("this.EMPAddress", this.EMPAddress)
            // this.residenceArray = data4.payload.addressDetails.employeeAddresses;
            // console.log("this.residenceAddress", this.residenceAddress)
            // this.officeArray = data4.payload.addressDetails.officeAddresses;
            let newdocumentlist: any[] = [];
            newdocumentlist = this.documentlist;
            console.log("this.documentlist", this.documentlist)
            if (newdocumentlist?.length > 0) {
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Pension Kit");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Pension Set");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Signature");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Self Photograph");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Joint Photograph");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Retirement Order Sanction");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Bank Passbook First Page/Cancelled Cheque");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Accounts Personnel Certificate");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Marriage Certificate");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "No DE Certificate");              
              newdocumentlist = newdocumentlist.filter(item => item.docName != "No Dues Certificate");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "FR");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Tentative LPC Certificate");
              if (this.Personaldetail?.disable == 'N') {
                newdocumentlist = newdocumentlist.filter(item => item.docName != "Disability Certificate");
              }
              if (this.Personaldetail?.disable == '0') {
                newdocumentlist = newdocumentlist.filter(item => item.docName != "Disability Certificate");
              }
            }
            this.docList = newdocumentlist;
            console.log("this.docList", this.docList);
            let docCheck: any[] = []
            docCheck = this.documentlist.filter((x: any) => x.docTypeId == 282)
            if (docCheck.length == 0) {
              let document1 = {
                "dmsDocId": null,
                docName: "Additional Document 1",
                docTypeId: 282
              }
              let document2 = {
                "dmsDocId": null,
                docName: "Additional Document 2",
                docTypeId: 283
              }
              let document3 = {
                "dmsDocId": null,
                docName: "Additional Document 3",
                docTypeId: 284
              }

              this.documentlist.push(document1);
              this.documentlist.push(document2);
              this.documentlist.push(document3);
              this.docList.push(document1);
              this.docList.push(document2);
              this.docList.push(document3);
              console.log("documentlist", this.documentlist)
            }
            let doc_check43:any[]=this.documentlist.filter((x:any)=>x.docTypeId==287);
            if(doc_check43.length<1)
            {
              let data2 = {
                "dmsDocId": null,
                "docName": "Revised APC",
                "docTypeId": 287
              }
             
              this.documentlist.push(data2);
            }
            let doc_check45:any[]=this.documentlist.filter((x:any)=>x.docTypeId==288);
            if(doc_check45.length<1)
            {
              let data2 = {
                "dmsDocId": null,
                "docName": "Additional Document 4",
                "docTypeId": 288
              }
             
              this.documentlist.push(data2);
              this.revisedDocList.push(data2);
            }else
            {
              this.revisedDocList.push(doc_check45[0])
            }
            let doc_check46:any[]=this.documentlist.filter((x:any)=>x.docTypeId==289);
            if(doc_check46.length<1)
            {
              let data2 = {
                "dmsDocId": null,
                "docName": "Additional Document 5",
                "docTypeId": 289
              }
             
              this.documentlist.push(data2);
              this.revisedDocList.push(data2);
            }else
            {
              this.revisedDocList.push(doc_check46[0])
            }
            let doc_check47:any[]=this.documentlist.filter((x:any)=>x.docTypeId==285);
            if(doc_check47.length<1)
            {
              let data2 = {
                "dmsDocId": null,
                "docName": "Additional Document 6",
                "docTypeId": 285
              }
             
              this.documentlist.push(data2);
              this.revisedDocList.push(data2);
            }else
            {
              this.revisedDocList.push(doc_check47[0])
            }
            let doc_check49:any[]=this.documentlist.filter((x:any)=>x.docTypeId==286);
            if(doc_check49.length<1)
            {
              let data2 = {
                "dmsDocId": null,
                "docName": "Promotion/ACP/Increment Sanction",
                "docTypeId": 286
              }
             
              this.documentlist.push(data2);
              this.revisedDocList.push(data2);
            }else
            {
              this.revisedDocList.push(doc_check49[0])
            }

            for (let i = 0; i < this.docList.length; i++) {

              this.removeDoc[i] = false;

            }
            for (let i = 0; i < this.docList.length; i++) {
              if (this.docList[i].dmsDocId) {
                this.removeDoc[i] = true;
              }
            }
            this.newconditions = data4.payload.conditionList
            
            console.log(this.newconditions[0]?.condition_StartDate)
                     
            let datec1 = new Date(this.newconditions[0]?.condition_StartDate)
            let datec2 = new Date(this.newconditions[0]?.condition_EndDate)
            console.log("this.newconditions", this.newconditions)
            this.conditionForm.patchValue({
              condition_1: this.newconditions[0]?.condition,
              condition_2: this.newconditions[1]?.condition,
              condition_3: this.newconditions[2]?.condition,
              condition_4: this.newconditions[3]?.condition,
              condition_5: this.newconditions[4]?.condition,
              condition_6: this.newconditions[5]?.condition,
              condition_7: this.newconditions[6]?.condition,
              condition_8: this.newconditions[7]?.condition,
              condition_1_Date: datec1,
              condition_1_Date1: datec2,
              condition_1_Amount: this.newconditions[0]?.condition_Amount
            })

            this.payload_summary = data4.payload.payloadSummary
            this.EMP_doc = data4.payload.documents;



            // this.addServiceRecord1()



            this.serviceRecord_arry_List.push(data4.payload.serviceRecords)
            let product1: any;
            console.log("data4.payload.serviceDetails.optForCommutation", data4.payload.serviceDetails.optForCommutation)
            if (data4.payload.serviceDetails.optForCommutation == 'Yes') {

              this.ServiceDetails.optForCommutation = data4.payload.serviceDetails.optForCommutation

              this.isCommutation = true;
              this.ServiceDetails.commuationPercentage = data4.payload.serviceDetails.commuationPercentage;

              let dor1 = moment(this.Pension_Commutation.commutationEffectiveDate).format();

              let date1 = new Date(dor1)
              this.effectivedate = date1
              this.commutationDetails.patchValue({ effectiveDate: date1 });



              let dor = new Date(this.Personaldetail.dor);
              console.log("date1", date1)
              console.log("dor", dor)
              if (date1.getTime() < dor.getTime()) {

                this.effectivedate = new Date(this.dateofRetirement)
                console.log("dates", this.effectivedate);
                if(Number(this.psnTypeId)==69)
                {}else{
                  this.effectivedate.setDate(this.effectivedate.getDate() + 1);
                }
               
                console.log("effectivedate", this.effectivedate);
                this.commutationDetails.patchValue({ effectiveDate: this.effectivedate });
                let monthlyPensionTreasury = this.Pension_Commutation.monthlyPensionTreasury
                this.commutationDateCalculation5(this.effectivedate);
                setTimeout(() => {
                  this.Pension_Commutation.monthlyPensionTreasury = monthlyPensionTreasury
                }, 100);
              }
              console.log("data4.payload.serviceDetails", this.ServiceDetails.commuationPercentage)
            } else if (data4.payload.serviceDetails.optForCommutation == 'No') {
              this.ServiceDetails.optForCommutation = data4.payload.serviceDetails.optForCommutation
              this.isCommutation = false;
              this.ServiceDetails.commuationPercentage = '0';
            }
            if (data4.payload.serviceRecords.deStatus == "1") {
              this.destatus = true;
            } else {
              this.destatus = false;
            }

            this.conditionList = data4.payload.conditionList;


            if (this.serviceRecordDatanew.deType == '1' || this.serviceRecordDatanew.deType == '4') {
              this.isCrimnalCase = true;

            }
            let monthlyPensionTreasury = this.Pension_Commutation.monthlyPensionTreasury
            // this.serviceRecordDatanew=data4.payload.serviceRecords;
            this.commutationDateCalculation5(this.effectivedate);
            setTimeout(() => {
              this.Pension_Commutation.monthlyPensionTreasury = monthlyPensionTreasury
            }, 100);
            console.log("this.pension", this.Pension_Commutation)
            for (let i = 0; i < data4.payload.documents.length; i++) {
              if (i % 2 == 0) {
                this.doc_list.push(data4.payload.documents[i]);
              }
              else {
                this.doc_list1.push(data4.payload.documents[i]);
              }
            }
            // this.conditionForm.setValue(data4.payload.conditionList);
            console.log("document list", this.documentlist)
            this.documentlist.forEach((element: any) => {

              if (element.docTypeId == 23) {
                if (element.dmsDocId != null) {
                  if (element.dmsDocId != '') {
                    this.isMdown = true
                  }
                }
              }
              if (element.docTypeId == 17) {
                if (element.dmsDocId != null) {
                  if (element.dmsDocId != '') {
                    this.isDe = true
                  }
                }
              }
              if (element.docTypeId == 18) {
                if (element.dmsDocId != null) {
                  if (element.dmsDocId != '') {
                    this.ischq = true
                  }
                }
              }
              if (element.docTypeId == 15) {
                if (element.dmsDocId != null) {
                  if (element.dmsDocId != '') {
                    this.isRe = true
                  }
                }
              }
              if (element.docTypeId == 190) {
                if (element.dmsDocId != null) {
                  if (element.dmsDocId != '') {
                    this.isTLPC = true
                  }
                }
              }
             
              if (element.docTypeId == 191) {
                if (element.dmsDocId != null) {
                  if (element.dmsDocId != '') {
                    this.isAddCer = true
                  }
                }
              }
            });

            this.payScale();
            this.load.hide();


          }, 1500)

        }
      },
      error: (err) => {
        console.log(err);
        this.error = err
      }
    })

  }
  oldPayload:any;
  revisedDocList:any[]=[]
  getTaskRevisedMaker(empCode: any) {
  this.load.show()
    let   data={"empCode":empCode,'requestId':null}
    this._Service.postho('getEmployeeDetails', data).subscribe({
      next: (res:any) => {
   
   
          let data4 = JSON.parse(res.personalDetails)
          this.oldPayload=data4;
          if(this.oldPayload?.oldPayload)
          {
            this.oldPayload.oldPayload=''
          }
          console.log("data2", data4);
          this.makerObj = true
    
          
          this.employeeId = data4.personalDetails?.employeeId;
          console.log("data4", data4)

          this.fetchPersonaldetail();
          this.fetchAddressesEmp();
          this.getFamilyDetails();
          this.nominee = []
          this.getNomination();
          this.fetchServicesdetail();
          this.Bank_Detail();
          this.fetchpersonalEmp()
         
         
          setTimeout(() => {
            
            this.getPensionCommutation()
          
            this.Pension_Commutation = data4.calculationsPensionDetails;
            this.Pension_Commutation2 = data4.calculationsPensionDetails;
            // this.familyDetails = data4.familyDetails;
            this.lRnumber = data4.personalDetails?.lrNo;
            if(data4?.serviceDetails?.addedServices=='Yes')
            {
              this.ServiceDetails.addedServices=data4?.serviceDetails?.addedServices
              this.ServiceDetails.addedJoiningDate=data4?.serviceDetails?.addedJoiningDate;
              this.ServiceDetails.addedServicesGratuity =  data4.payload?.serviceDetails?.addedServicesGratuity;
              this.ServiceDetails.addedServicesGratuityAmount =  data4.payload?.serviceDetails?.addedServicesGratuityAmount;
            }
            
            this.tenPayLevel=data4?.serviceDetails?.tenPayLevel;
            this.tenBasicPay=data4?.serviceDetails?.tenBasicPay;
            this.tBasicPayReason=data4?.serviceDetails?.tBasicPayReason;
           
            this.getBasicPay();
            if(data4?.serviceDetails?.addedJoiningDate)
            {
              let date1=moment(data4?.serviceDetails?.addedJoiningDate).format('YYYY-MM-DD[T]HH:mm:ss');             
              this.addedJoiningDate=date1
            }
            // this.ServiceDetails = data4.serviceDetails;
            this.getBudgetDetails(this.ServiceDetails);
            // this.nominee = data4.nominationDetails;

            this.serviceRecordDatanew = data4.serviceRecords;
            this.addServiceRecord1();
            
            console.log("serviceRecordDatanew", this.serviceRecordDatanew)
            if (this.serviceRecordDatanew.deStatus == 1) {
              this.destatus = true
              if (this.serviceRecordDatanew.deType == '1' || this.serviceRecordDatanew.deType == '4') {
                this.ServiceDetails.optForCommutation = "No";
                this.ServiceDetails.commuationPercentage = 0;
                this.isCommutation = false;
                this.isCrimnalCase = true;
                //  console.log(this.Calculations_Commutation_Details);
                //  this.Calculations_Commutation_Details.effectiveDate="";
                this.commutationDetails.patchValue({
                  effectiveDate: ""
                })
              }
            } else {

              // this.ServiceDetails.optForCommutation = data4.serviceDetails.optForCommutation;
              this.destatus = false;
              this.isCrimnalCase = false;
            }

           
            //console.log('pension data',this.Pension_Commutation)
            // this.Banklist = data4.bankTreasuryDetails;

            // this.Calculations_Pay_Details = data4.calculationsPayDetails;
        
            this.Calculations_ARD_Details = data4.calculationsAdditionalAllowanceRecovery;
            console.log("this.Calculations_ARD_Details", this.Calculations_ARD_Details)
            // this.ObjectionArray = data4?.ObjectionArray ? data4?.ObjectionArray : []
            if (this.Calculations_ARD_Details?.addDeduction?.length > 0) {
              this.Calculations_ARD_Details?.addDeduction.forEach((element: any, i: any) => {
                this.addDeduction.push(
                  this.formbuilder.group({
                    deductionType: new FormControl(element.deductionType),
                    deductionName: new FormControl(element.deductionName),
                    deductionAmount: new FormControl(element.deductionAmount),
                    deductionHead: new FormControl(element.deductionHead)
                  })


                );
                this.isRemoveDe[i] = true;
              });

            }
            if (this.Calculations_ARD_Details?.addAllowanceType?.length > 0) {
              this.Calculations_ARD_Details?.addAllowanceType.forEach((element: any) => {
                this.addAllowanceType.push(
                  this.formbuilder.group({
                    allowanceType: new FormControl(element.allowanceType),
                    allowanceName: new FormControl(element.allowanceName),
                    allowanceAmount: new FormControl(element.allowanceAmount),
                    allowanceHead: new FormControl(element.allowanceHead)
                  })


                );
              });

            }

            if (this.Calculations_ARD_Details?.addDynamicElement?.length > 0) {
              this.Calculations_ARD_Details?.addDynamicElement.forEach((element: any) => {
                this.addDynamicElement.push(
                  this.formbuilder.group({
                    recoveryType: new FormControl(element.recoveryType),
                    recoveryAmount: new FormControl(element.recoveryAmount),
                    recoveryHead: new FormControl(element.recoveryHead)
                  })


                );
              });

            }
            if (this.Calculations_ARD_Details?.addWithHeld?.length > 0) {
              this.Calculations_ARD_Details?.addWithHeld.forEach((element: any) => {
                this.addWithHeld.push(
                  this.formbuilder.group({
                    withHeldType: new FormControl(element.withHeldType),
                    withHeldName: new FormControl(element.withHeldName),
                    withHeldAmount: new FormControl(element.withHeldAmount),
                    withHeldReason: new FormControl(element.withHeldReason)
                  })


                );
              });

            }
          
            // this.addDeduction=this.Calculations_ARD_Details.addDeduction
            this.Calculations_Commutation_Details = data4.calculationsCommutationDetailsNomination;
            //console.log('pension data',this.Calculations_Commutation_Details)
            this.loanAndAdvancesDetails = data4.loansAdvance;
            this.advancedLoan = data4.loansAdvance;
            this.document_list = data4.documents;
            this.documentlist = data4.documents;
            let doc:any[]=JSON.parse(JSON.stringify(this.documentlist))
            doc = doc.filter(item => item.docName != "Bill Inner - PDF");
            doc = doc.filter(item => item.docName != "Invoice PDF");
            doc = doc.filter(item => item.docName != "Other");
            doc = doc.filter(item => item.docName != "Bill Outer - PDF");
            doc = doc.filter(item => item.docName != "Scan Copy of Approval");
            doc = doc.filter(item => item.docName != "Pension Kit Summary");
            this.documentlist=doc;
            console.log("debug",this.documentlist)
            let doc_check:any[]=this.documentlist.filter((x:any)=>x.docTypeId==190);
            if(doc_check.length<1)
            {
              let data1 = {
                "dmsDocId": null,
                "docName": "Tentative LPC Certificate",
                "docTypeId": 190
              }
              this.documentlist.push(data1);
            }
            let doc_check1:any[]=this.documentlist.filter((x:any)=>x.docTypeId==191);
            if(doc_check1.length<1)
            {
            let data2 = {
              "dmsDocId": null,
              "docName": "Added Gratuity Certificate",
              "docTypeId": 191
            }
           
            this.documentlist.push(data2);
          }
          let random = Math.floor(Math.random() * (9999 - 1000)) + 1000;
         
          let doc_check2:any[]=this.documentlist.filter((x:any)=>x.docTypeId==287);
      if(doc_check2.length<1)
      {
        this.documentlist = this.documentlist.map(item => {
          if (item.docTypeId === 287) {
            return { ...item, docName:"Revised APC"+random.toString(),docTypeId:random };
          }
          return item;
        });
      }
    let data2 = {
      "dmsDocId": null,
      "docName": "Revised APC",
      "docTypeId": 287
    }
   
    this.documentlist.push(data2);

let random2 = Math.floor(Math.random() * (9999 - 1000)) + 1000;

let doc_check5:any[]=this.documentlist.filter((x:any)=>x.docTypeId==288);
if(doc_check5.length<1)
{
  this.documentlist = this.documentlist.map(item => {
    if (item.docTypeId === 288) {
      return { ...item, docName:"Additional Document 4"+random2.toString(),docTypeId:random2 };
    }
    return item;
  });
}

let data3 = {
  "dmsDocId": null,
  "docName": "Additional Document 4",
  "docTypeId": 288
}

this.documentlist.push(data3);
this.revisedDocList.push(data3);

let random3 = Math.floor(Math.random() * (9999 - 1000)) + 1000;
let doc_check6:any[]=this.documentlist.filter((x:any)=>x.docTypeId==289);
if(doc_check6.length<1)
{
  this.documentlist = this.documentlist.map(item => {
    if (item.docTypeId === 289) {
      return { ...item, docName:"Additional Document 5"+random3.toString(),docTypeId:random3 };
    }
    return item;
  });
}
let data8 = {
  "dmsDocId": null,
  "docName": "Additional Document 5",
  "docTypeId": 289
}
this.documentlist.push(data8);
this.revisedDocList.push(data8);

let random4 = Math.floor(Math.random() * (9999 - 1000)) + 1000;
let doc_check7:any[]=this.documentlist.filter((x:any)=>x.docTypeId==285);
if(doc_check7.length<1)
{
  this.documentlist = this.documentlist.map(item => {
    if (item.docTypeId === 285) {
      return { ...item, docName:"Additional Document 6"+random4.toString(),docTypeId:random4 };
    }
    return item;
  });
}
let data5 = {
  "dmsDocId": null,
  "docName": "Additional Document 6",
  "docTypeId": 285
}
this.documentlist.push(data5);
this.revisedDocList.push(data5);
let random5 = Math.floor(Math.random() * (9999 - 1000)) + 1000;
let doc_check8:any[]=this.documentlist.filter((x:any)=>x.docTypeId==286);
if(doc_check8.length<1)
{
  this.documentlist = this.documentlist.map(item => {
    if (item.docTypeId === 286) {
      return { ...item, docName:"Promotion/ACP/Increment Sanction"+random5.toString(),docTypeId:random5 };
    }
    return item;
  });
}
let data6 = {
  "dmsDocId": null,
  "docName": "Promotion/ACP/Increment Sanction",
  "docTypeId": 286
}
this.documentlist.push(data6);
this.revisedDocList.push(data6);
          console.log("revisedDocList", this.revisedDocList)
            // this.EMPAddress = data4.addressDetails
            // console.log("this.EMPAddress", this.EMPAddress)
            // this.residenceArray = data4.addressDetails.employeeAddresses;
            // console.log("this.residenceAddress", this.residenceAddress)
            // this.officeArray = data4.addressDetails.officeAddresses
            if(JSON.stringify(this.documentlist).includes('Pension Set'))
            {
              this.documentlist = this.documentlist.map(item => {
                if (item.docTypeId === 35) {
                  return { ...item, dmsDocId: "" };
                }
                return item;
              });
            }
            
            let newdocumentlist: any[] = [];
            newdocumentlist = this.documentlist;
            console.log("this.documentlist", this.documentlist)
            if (newdocumentlist?.length > 0) {
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Pension Kit");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Pension Set");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Signature");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Self Photograph");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Joint Photograph");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Retirement Order Sanction");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Bank Passbook First Page/Cancelled Cheque");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Marriage Certificate");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "No DE Certificate");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "No Dues Certificate");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Pension Kit Summary");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Cancelled Cheque");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Tentative LPC Certificate");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Added Gratuity Certificate");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "FR");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Revised APC");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Additional Document 4");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Additional Document 5");
              newdocumentlist = newdocumentlist.filter(item => item.docName != "Additional Document 6");
              if (this.Personaldetail?.disable == 'N') {
                newdocumentlist = newdocumentlist.filter(item => item.docName != "Disability Certificate");
              }
              if (this.Personaldetail?.disable == '0') {
                newdocumentlist = newdocumentlist.filter(item => item.docName != "Disability Certificate");
              }
            }
            this.docList = newdocumentlist;
            console.log("this.docList", this.docList);
          
         
            let docCheck: any[] = []
            docCheck = this.documentlist.filter((x: any) => x.docTypeId == 282)
            if (docCheck.length == 0) {
              let document1 = {
                "dmsDocId": null,
                docName: "Additional Document 1",
                docTypeId: 282
              }
              let document2 = {
                "dmsDocId": null,
                docName: "Additional Document 2",
                docTypeId: 283
              }
              let document3 = {
                "dmsDocId": null,
                docName: "Additional Document 3",
                docTypeId: 284
              }

              this.documentlist.push(document1);
              this.documentlist.push(document2);
              this.documentlist.push(document3);
              this.docList.push(document1);
              this.docList.push(document2);
              this.docList.push(document3);
              console.log("documentlist123", this.documentlist)
            }

            for (let i = 0; i < this.docList.length; i++) {

              this.removeDoc[i] = false;

            }
            for (let i = 0; i < this.docList.length; i++) {
              if (this.docList[i].dmsDocId) {
                this.removeDoc[i] = true;
              }
            }
            this.newconditions = data4.conditionList
            
            console.log(this.newconditions[0]?.condition_StartDate)
                     
            let datec1 = new Date(this.newconditions[0]?.condition_StartDate)
            let datec2 = new Date(this.newconditions[0]?.condition_EndDate)
            console.log("this.newconditions", this.newconditions)
            this.conditionForm.patchValue({
              condition_1: this.newconditions[0]?.condition,
              condition_2: this.newconditions[1]?.condition,
              condition_3: this.newconditions[2]?.condition,
              condition_4: this.newconditions[3]?.condition,
              condition_5: this.newconditions[4]?.condition,
              condition_6: this.newconditions[5]?.condition,
              condition_7: this.newconditions[6]?.condition,
              condition_8: this.newconditions[7]?.condition,
              condition_1_Date: datec1,
              condition_1_Date1: datec2,
              condition_1_Amount: this.newconditions[0]?.condition_Amount
            })

            this.payload_summary = data4.payloadSummary
            this.EMP_doc = data4.documents;



            // this.addServiceRecord1()



            this.serviceRecord_arry_List.push(data4.serviceRecords)
            let product1: any;
            console.log("data4.serviceDetails.optForCommutation", data4.serviceDetails.optForCommutation)
            // if (data4.serviceDetails.optForCommutation == 'Yes') {

            //   this.ServiceDetails.optForCommutation = data4.serviceDetails.optForCommutation

            //   this.isCommutation = true;
            //   this.ServiceDetails.commuationPercentage = data4.serviceDetails.commuationPercentage;

            //   let dor1 = moment(this.Pension_Commutation.commutationEffectiveDate).format();

            //   let date1 = new Date(dor1)
            //   this.effectivedate = date1
            //   this.commutationDetails.patchValue({ effectiveDate: date1 });



            //   let dor = new Date(this.Personaldetail.dor);
            //   console.log("date1", date1)
            //   console.log("dor", dor)
            //   if (date1.getTime() < dor.getTime()) {

            //     this.effectivedate = new Date(this.dateofRetirement)
            //     console.log("dates", this.effectivedate);

            //     this.effectivedate.setDate(this.effectivedate.getDate() + 1);
            //     console.log("effectivedate", this.effectivedate);
            //     this.commutationDetails.patchValue({ effectiveDate: this.effectivedate });
            //     let monthlyPensionTreasury = this.Pension_Commutation.monthlyPensionTreasury
            //     this.commutationDateCalculation5(this.effectivedate);
            //     setTimeout(() => {
            //       this.Pension_Commutation.monthlyPensionTreasury = monthlyPensionTreasury
            //     }, 100);
            //   }
            //   console.log("data4.serviceDetails", this.ServiceDetails.commuationPercentage)
            // } 
            if (data4.serviceRecords.deStatus == "1") {
              this.destatus = true;
            } else {
              this.destatus = false;
            }

            this.conditionList = data4.conditionList;


            if (this.serviceRecordDatanew.deType == '1' || this.serviceRecordDatanew.deType == '4') {
              this.isCrimnalCase = true;

            }
            let monthlyPensionTreasury = this.Pension_Commutation.monthlyPensionTreasury
            // this.serviceRecordDatanew=data4.serviceRecords;
            this.commutationDateCalculation5(this.effectivedate);
            setTimeout(() => {
              this.Pension_Commutation.monthlyPensionTreasury = monthlyPensionTreasury
            }, 100);
            console.log("this.pension", this.Pension_Commutation)
            for (let i = 0; i < data4.documents.length; i++) {
              if (i % 2 == 0) {
                this.doc_list.push(data4.documents[i]);
              }
              else {
                this.doc_list1.push(data4.documents[i]);
              }
            }
            // this.conditionForm.setValue(data4.conditionList);
            console.log("document list", this.documentlist)
            this.documentlist.forEach((element: any) => {
              if (element.docTypeId == 23) {
                if (element.dmsDocId != null) {
                  if (element.dmsDocId != '') {
                    this.isMdown = true
                  }
                }
              }
              if (element.docTypeId == 17) {
                if (element.dmsDocId != null) {
                  if (element.dmsDocId != '') {
                    this.isDe = true
                  }
                }
              }
              if (element.docTypeId == 18) {
                if (element.dmsDocId != null) {
                  if (element.dmsDocId != '') {
                    this.ischq = true
                  }
                }
              }
              if (element.docTypeId == 15) {
                if (element.dmsDocId != null) {
                  if (element.dmsDocId != '') {
                    this.isRe = true
                  }
                }
              }
              if (element.docTypeId == 190) {
                if (element.dmsDocId != null) {
                  if (element.dmsDocId != '') {
                    this.isTLPC = true
                  }
                }
              }
              if (element.docTypeId == 191) {
                if (element.dmsDocId != null) {
                  if (element.dmsDocId != '') {
                    this.isAddCer = true
                  }
                }
              }
            });

            this.payScale();
            this.load.hide();


          }, 2000)

        
      },
      error: (err) => {
        console.log(err);
        this.error = err
      }
    })

  }
  getDocId()
  {
  
    let data = {
  "inMstType":27,
  "inValue":0,
  "inValue2":0,
  "inValue3":this.oldPayload.personalDetails.employeeCode
  }
  
    this._Service.postho('allmstdata', data).subscribe((res:any) => {
      console.log("res",res)
     if(res.status=='SUCCESS')
     {
      if(res.data!=null)
      {
        let picdata=JSON.parse(res.data);
        let pkdoc:any
        console.log(picdata)
        picdata.forEach((element:any) => {
          if(element.vdocTypeId=='34')
          {
            pkdoc=element.vdmsDocId
          }
        });
        this.common.Previewbydocid(pkdoc,'pension/revised/revised-pension');
      }
     }
  
    })
  }
  revisedComData:any;
  getPensionCommutation()
  {
    
 let data={ "employeeCode": this.Personaldetail?.employeeCode,"employeeId":0  }
 console.log("getReviseCommutationDtls",data);

    this._Service.postdetype(data,'getReviseCommutationDtls').subscribe({
      next: (res) => {
   

       console.log("getReviseCommutationDtls",res);
       if(res.data)
       {
        this.revisedComData=res?.data[0];
       
        if(res?.data[0]?.commutFlag=='Y')
        {
        
          this.Personaldetail.comDate=res?.data[0]?.commutDate;
         
          this.commucationDate=new Date(res?.data[0]?.commutDate);
          
          this.commutationDetails.patchValue({ effectiveDate: this.commucationDate });
          this.ServiceDetails.optForCommutation = 'Yes';
          this.isCommutation = true;
          this.revisedCommutation=true;
          this.ServiceDetails.commuationPercentage=res?.data[0]?.comPercent
          
          this.commutationDateCalculation3(this.commucationDate);
        }
        if(res?.data[0]?.recovery.includes('recoveryType'))
        {

          let recovery:any=JSON.parse(res?.data[0]?.recovery);
         
          recovery.forEach((element: any) => {
              this.addDynamicElement.push(
                this.formbuilder.group({
                  recoveryType: new FormControl(element.recoveryType),
                  recoveryAmount: new FormControl(element.recoveryAmount),
                  recoveryHead: new FormControl(element.recoveryHead)
                })
              );
            });

          
        }
        if (res?.data[0]?.deStatus == "1") {
     
          this.serviceRecordDatanew.deStatus=res?.data[0]?.deStatus;
          this.serviceRecordDatanew.deType=res?.data[0]?.deType;
          this.destatus = true
          this.ServiceDetails.optForCommutation = "No";
          this.ServiceDetails.commuationPercentage = 0;
          this.isCommutation = false;
          this.isCrimnalCase = true;
          // this.psnTypeId="74"
          // this.pType="Provisional Pension U/R 90"
          //  console.log(this.Calculations_Commutation_Details);
          //  this.Calculations_Commutation_Details.effectiveDate="";
          this.commutationDetails.patchValue({
            effectiveDate: ""
          })
          
        }
        
       }
      }
    })
  }
  HInterest: any = "";
  HPrincipal: any = "";
  MInterest: any = "";
  MPrincipal: any = "";
  DeductionbudgetHead() {
    if (this.BudgetDetails?.length >= 1) {
      let data = this.BudgetDetails.filter((x: any) => {
        if (x.allwDedName == "HBA Interest") {
          return x;
        }

      })
      this.HInterest = data[0].budgetHead;

      let data2 = this.BudgetDetails.filter((x: any) => {
        if (x.allwDedName == "HBA Principal") {
          return x;
        }

      })
      this.HPrincipal = data2[0].budgetHead;

      let data3 = this.BudgetDetails.filter((x: any) => {
        if (x.allwDedName == "MCA Interest") {
          return x;
        }

      })
      this.MInterest = data3[0].budgetHead;
      let data4 = this.BudgetDetails.filter((x: any) => {
        if (x.allwDedName == "MCA Principal") {
          return x;
        }

      })
      this.MPrincipal = data4[0].budgetHead;
    }
    console.log(this.HInterest);

  }
  numberValidation() {
    if (this.ServiceDetails.commuationPercentage < 0) {
      this.ServiceDetails.commuationPercentage = 0;
      alert("Please enter positive value.");
      return;
    }

    if (this.ServiceDetails.serviceCatId === 1) {
      if (this.ServiceDetails.commuationPercentage > 40) {
        this.ServiceDetails.commuationPercentage = 0;
        alert("Enter value under 40");
      } else {

        let dates = new Date(this.dateofRetirement)
        console.log("dates", dates);
        if(Number(this.psnTypeId)==69)
        {}else{
          dates.setDate(dates.getDate() + 1);
        }
        
        console.log("dates", dates);
        this.commutationDateCalculation(dates);
      }

    } else if (this.ServiceDetails.serviceCatId === 13 || (this.ServiceDetails.serviceCatId === 7 && this.ServiceDetails.serviceSubcatId === 108)) {
      if (this.ServiceDetails.commuationPercentage > 50) {
        this.ServiceDetails.commuationPercentage = 0;
        alert("Enter value under 50");
      } else {
        let dates = new Date(this.dateofRetirement)
        console.log("dates", dates);
        if(Number(this.psnTypeId)==69)
        {}else{
          dates.setDate(dates.getDate() + 1);
        }
       
        console.log("dates", dates);
        this.commutationDateCalculation(dates);
      }

    } else {
      if (this.ServiceDetails.commuationPercentage > 33.33) {
        this.ServiceDetails.commuationPercentage = 0;
        alert("Enter value under 33.33");
      } else {
        let dates = new Date(this.dateofRetirement)
        console.log("dates", dates);
        if(Number(this.psnTypeId)==69)
        {}else{
          dates.setDate(dates.getDate() + 1);
        }
        
        console.log("dates", dates);
        this.commutationDateCalculation(dates);
      }
    }


  }
  esignRequest(resData: any) {
    let data = {
      "reportPath": resData.reportPath,
      "name": resData.name,
      "value": resData.value,
      "url": resData.mainurl,
      "contextPath": "3",
      "cordX": 400,
      "cordY": 35,
      "assignmentId": this.userDetails.assignmentid,
      "docTypeId": resData.docTypeId,
      "docName": resData.docName,
      "roleId": "6",
      "requestId": resData.requestId ? resData.requestId : "",
      "processId": resData.processId
    }
    console.log("esignXmlRequest", data);

    let url = "sendrequest";
    this.load.show();
    this._Service.postNewEsign(url, data).subscribe((res: any) => {
      console.log("res", res);
      this.load.hide();
      setTimeout(() => {
        this.redirectService.postRedirect(res);
      }, 300);


    },(error)=>{
      this.load.hide();
      alert("Error in E-Sign Service.Please try after some time.")
    })


  }

  onSubmit_Final(action: any, item: any) {
    let count = 0
    if (this.userDetails.roleid == '6' && action == 'ARV' && !this.nextAd) {
      this.ObjectionArray.filter((x: any) => {
        if (x.rejected == false) {
          count = 1

        }
      })
    }


    if (count == 1) {
      alert("Please clear all Objections before Approve.")
      return;
    }
    if (this.userDetails.roleid == '4' || this.userDetails.roleid == '6') {
      if (this.Pension_Commutation?.monthlyPensionTreasury == "0") {
        alert("Please select 'Monthly Pension Treasury' on Bank/Treasury Tab");
        return;
      }
    }

   
   

    let payload_summary = {
      "empName": this.Personaldetail.nameEn,
      "emp_Id": this.Personaldetail.employeeId,
      "empCode": this.Personaldetail.employeeCode
    }
   
    if (this.userDetails.roleid == "2") {
      this.Personaldetail['requestId'] = this.reqid ? this.reqid : "";
    }
    if (this.nextAd) {
      this.Personaldetail['nextAd'] = this.nextAd
    }
    let data = {
      "requestData": {
        "processId": "2",
        "taskSeq": "",
        "processTaskSeq": "",
        "taskTranId": this.transId,
        "requestId": this.reqid,
        "requestDesc": "",
        "initiator": this.empinfo.aid,
        "person_id": this.empinfo.userId,
        "person_name": this.empinfo.displayName,
        "action": action,
        "remarks": this.Request_Confirmation.controls['Remarks'].value,
        "payloadChangeFlag": "Y",
        "adApproveFlag": ""

      },
      "payload": {

        "personalDetails": this.Personaldetail ? this.Personaldetail : "",
        "serviceDetails": this.ServiceDetails ? this.ServiceDetails : "",
        "addressDetails": this.EMPAddress,
        "familyDetails": this.familyDetails ? this.familyDetails : "",
        "nominationDetails": this.nominee ? this.nominee : "",
        "serviceRecords": this.serviceRecordDatanew ? this.serviceRecordDatanew : "",
        "loansAdvance": this.advancedLoan,
        "calculationsPayDetails": this.Calculations_Pay_Details ? this.Calculations_Pay_Details : "",
        "calculationsAdditionalAllowanceRecovery": this.Calculations_ARD_Details ? this.Calculations_ARD_Details : "",
        "calculationsPensionDetails": this.Pension_Commutation ? this.Pension_Commutation : "",
        "calculationsCommutationDetailsNomination": this.Calculations_Commutation_Details,
        "bankTreasuryDetails": this.Banklist ? this.Banklist : "",
        "documents": this.documentlist ? this.documentlist : "",
        "employeeId": this.Personaldetail.employeeId,
        "employeeCode": this.Personaldetail.employeeCode,
        "createdByAid": this.empinfo.aid,
        "createdByUserId": this.empinfo.userId,
        "payeeId": this.Personaldetail.payeeId,
        "conditionList": this.conditionList,
        "ObjectionArray": this.ObjectionArray,
        "oldPayload":this.oldPayload,
        "caculationPayload": this.caculationPayload,
      },
      "payloadSummary": payload_summary ? payload_summary : "",
    }


    console.log("checkerdata", data);

    this._Service.requestApplication(data, 'action').subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.rid = res.requestId

          this.modalService.dismissAll();
          if (action == "ARV") {
            this.pensionInitaite();
            let purl: string = this.routers['location']._platformLocation.location.origin;
            let url2: string = this.routers.url;
            let mainUrl = purl + "/pension/#" + "/pension/revised/revised-pension";
            console.log("enter");
            this.frEsignData = {
              "reportPath": res.response.reportPathFR,
              "name": "task_data_id",
              "value": res.response.taskDataIdFR,
              "docTypeId": res.response.docTypeId,
              "docName": res.response.docNameFR,
              "processId": res.response.processId,
              "mainurl": mainUrl,
              "requestId": this.reqid
            }
            this.pkEsignData = {
              "reportPath": res.response.reportPathPK,
              "name": "pensioner_id",
              "value": res.response.pensionerId,
              "docTypeId": res.response.docTypeId,
              "docName": res.response.docNamePK,
              "processId": res.response.processId,
              "mainurl": mainUrl,
              "requestId": this.reqid
            }
            // localStorage.setItem("esigntype","FR");
            // localStorage.setItem("pkEsignData",JSON.stringify(this.pkEsignData));
            this.config.storeDetails("esigntype", "");
            this.config.storeDetails("pkEsignData", JSON.stringify(this.pkEsignData));
            this.config.storeDetails("pensionerId", res.response.pensionerId);
            console.log("frEsignData", this.frEsignData);
            this.isApprove = true;
            let postdata = {
              "ppoNo": res.response.ppoNo,
              "employeeId": this.Personaldetail.employeeId,
            }
            this.modalService.open(item);
            this._Service.postNewEmployee('updatePPONumber', postdata).subscribe((res: any) => {

              console.log("warnshyam===>>", res);

            })


          } else if (action == 'REJHO') {
            this.updateEmployeeHO();
            this.dialog.open(CommonDialogComponent,
              {
                panelClass: 'dialog-w-50', autoFocus: false
                , data: {
                  message: 'success', reqId: this.rid, id: 4, aid: this.empinfo.aid, ppo_no: this.ppo_number
                  , Responsedata: res.response, action: action
                }
              }
            );
          } else if (action == 'REV' && this.userDetails.roleid == '2') {
            this.pensionInitaite();
            this.dialog.open(CommonDialogComponent,
              {
                panelClass: 'dialog-w-50', autoFocus: false
                , data: {
                  message: 'success', reqId: this.rid, id: 4, aid: this.empinfo.aid, ppo_no: this.ppo_number
                  , Responsedata: res.response, action: action
                }
              }
            );
          }
          else {
            this.dialog.open(CommonDialogComponent,
              {
                panelClass: 'dialog-w-50', autoFocus: false
                , data: {
                  message: 'success', reqId: this.rid, id: 4, aid: this.empinfo.aid, ppo_no: this.ppo_number
                  , Responsedata: res.response, action: action
                }
              }
            );
          }

        }
      },
      error: (err) => {

        alert("Some Error Occured")
        
      },
    });
  }
  updateEmployeeHO() {
    let data = {
      "inType": 2,
      "employeeId": this.Personaldetail.employeeId
    }
    console.log("update on Ess", data);
    this._Service.postNewEmployee("getPensionRevertEmpDetails", data).subscribe((res: any) => {
      console.log("res", res);
    })
  }
  PKpreview() {
    var data2: any;
    let url = "getreportpath";
    let data1 =
    {
      "taskTranId": this.transId
    }
    this._Service.postho(url, data1).subscribe((res: any) => {
      console.log("res", res)
      data2 = res.data;
      // data2=JSON.parse(data2);
      // this.pdfpreviewPK(data2)
    })
  }
  pdfpreviewPK() {
    console.log("preview", this.pkEsignData);

    let data = {
      "reportPath": this.pkEsignData.reportPath,
      "format": "pdf",
      "params": [
        {
          "name": this.pkEsignData.name,
          "value": this.pkEsignData.value
        }
      ]
    }
    console.log("single report data", data)
    this.isLoadingPK=true
    this._Service.postOr("report/singlereport", data).subscribe((res: any) => {
      console.log("res", res.data.report.content);
      if (res.data.report.content) {
        this.isLoadingPK=false;
        const byteArray = new Uint8Array(
          atob(res.data.report.content)
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
    },(error)=>{
      this.isLoadingPK=false;
      alert("Some Error Occured")
    })
  }
  hoApproverEsign() {

    if (this.Pension_Commutation?.monthlyPensionTreasury == "0") {
      alert("Please select 'Monthly Pension Treasury'");
      return;
    }
    console.log(this.Personaldetail['lrNo'])
    if (this.Personaldetail.hasOwnProperty('lrNo')) {

      if (this.Personaldetail.lrNo == "" || this.Personaldetail.lrNo == null || this.lRnumber=='0' || this.lRnumber==undefined) {

        this.getLRnumber();
        this.Personaldetail.lrNo = this.lRnumber;
      }
    } else {
     
      if(this.lRnumber=="" || this.lRnumber==null || this.lRnumber=='0' || this.lRnumber==undefined)
      {
        alert("LR Number not generated so please reload the form");
        return;
      }
      
      this.Personaldetail['lrNo'] = this.lRnumber;
    }

    let commutation_data = {
      "budgetHead": this.Calculations_Commutation_Details?.budgetHead,
      "budgetHeadId": this.Calculations_Commutation_Details?.budgetHeadId,
      "effectiveDate": this.Calculations_Commutation_Details?.effectiveDate,
      "commutationAmount": this.Pension_Commutation?.commutationAmount,
      "commutationFactor": this.Pension_Commutation?.commutedFactor,
      "commutationValue": this.Pension_Commutation?.pensionCommuted,
    }
    let payload_summary = {
      "empName": this.Personaldetail.nameEn,
      "emp_Id": this.Personaldetail.employeeId,
      "empCode": this.Personaldetail.employeeCode
    }


    let data = {
      "requestData": {
        "processId": "2",
        "taskSeq": "",
        "processTaskSeq": "",
        "taskTranId": this.transId,
        "requestId": this.reqid,
        "requestDesc": "",
        "initiator": this.empinfo.aid,
        "person_id": this.empinfo.userId,
        "person_name": this.empinfo.displayName,
        "action": 'FWD',
        "remarks": this.Request_Confirmation.controls['Remarks'].value,
        "payloadChangeFlag": "Y",
        "adApproveFlag": ""

      },
      "payload": {
        "personalDetails": this.Personaldetail ? this.Personaldetail : "",
        "serviceDetails": this.ServiceDetails ? this.ServiceDetails : "",
        "addressDetails": this.EMPAddress,
        "familyDetails": this.familyDetails ? this.familyDetails : "",
        "nominationDetails": this.nominee ? this.nominee : "",
        "serviceRecords": this.serviceRecordDatanew ? this.serviceRecordDatanew : "",
        "loansAdvance": this.advancedLoan,
        "calculationsPayDetails": this.Calculations_Pay_Details ? this.Calculations_Pay_Details : "",
        "calculationsAdditionalAllowanceRecovery": this.Calculations_ARD_Details ? this.Calculations_ARD_Details : "",
        "calculationsPensionDetails": this.Pension_Commutation ? this.Pension_Commutation : "",
        "calculationsCommutationDetailsNomination": this.Calculations_Commutation_Details,
        "bankTreasuryDetails": this.Banklist ? this.Banklist : "",
        "documents": this.documentlist ? this.documentlist : "",
        "employeeId": this.Personaldetail.employeeId,
        "employeeCode": this.Personaldetail.employeeCode,
        "createdByAid": this.empinfo.aid,
        "createdByUserId": this.empinfo.userId,
        "payeeId": this.Personaldetail.payeeId,
        "conditionList": this.conditionList,
        "ObjectionArray": this.ObjectionArray,
        "oldPayload":this.oldPayload,
        "caculationPayload": this.caculationPayload
      },
      "payloadSummary": payload_summary ? payload_summary : "",

    }
    console.log("approverSubmitData", data)

    this.config.storeDetails("approverSubmitData", JSON.stringify(data))
    let url = "getreportpath";
    let data1 =
    {
      "taskTranId": this.transId
    }
    this._Service.postho(url, data1).subscribe((res: any) => {
      console.log("res", res)
      let data = res.data;

      let purl: string = this.routers['location']._platformLocation.location.origin;
      let url2: string = this.routers.url;
      let mainUrl = purl + "/pension/#" + "/pension/revised/revised-pension";
      console.log("enter");
      let esigndata = {
        "reportPath": data.reportPath,
        "name": "task_data_id",
        "value": data.taskDataId,
        "docTypeId": data.docTypeId,
        "docName": data.docName,
        "processId": "2",
        "mainurl": mainUrl,
        "requestId": this.reqid ? this.reqid : ""
      }


      this.config.storeDetails("esigntype", "approver")
      this.esignRequest(esigndata);
    })

  }
  View_ESSPension(){
   
    this.dialog.open(RevisedPensionerDetailsComponent, { panelClass: 'dialog-w-60', data: { message: this.oldPayload,isShow:2 } , disableClose: false }).afterClosed()
    .subscribe((data:any) => {
      
     
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








  Complete: any;
  Comp: any;
  progressFiles: progress[] = [];
  fil: any;

  onStepChange(stepper: MatStepper) {
    this.fil = stepper.selectedIndex
    this.progressFiles.push({
      ind: this.fil
    })

    this.Comp = 12.50;

    for (let p of this.progressFiles) {
      if (p.ind == this.fil) {
        this.progress1 = this.progress1 + this.Comp;
        this.Complete = (this.Complete + 13);
        if (this.Complete > 100) {
          this.Complete = 100
          this.progress1 = 100
        }
      }
    }

  }
  moveToSelectedTab(tabName: string) {
    if (this.userDetails.roleid == '1') {
      if (
        tabName == "Address Details"
      ) {
        if (this.ServiceDetails.optForCommutation == 'Yes') {
          if (this.ServiceDetails.commuationPercentage == 0) {
            alert("Enter Commuation Percentage");
          } else {
            this.moveNext(tabName);
          }
        } else {
          this.moveNext(tabName);
        }

      } else if (tabName == "Pension Details") {
        if (this.ServiceDetails.optForCommutation == 'Yes' && !this.commutationDetails.value.effectiveDate) {
          alert("Enter Commuation Effective Date");
        } else {
          this.moveNext(tabName);
        }
      }
      else {
        this.moveNext(tabName);
      }
    } else {
      this.moveNext(tabName);
    }


  }


  moveNext(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }

  get addDynamicElement() {
    return this.registrationForm?.get('addDynamicElement') as FormArray
  }


  onChnage() {

  }
  onRemoveSpecialRequest(index: any) {
    const control = <FormArray>this.registrationForm?.get('addDynamicElement');
    control.removeAt(index);
  }


  get addDeduction() {
    return this.registrationForm?.get('addDeduction') as FormArray
  }


  onRemoveDeduction(index: any) {
    let data = this.addDeduction.value;
    if (data[index].deductionType == 227 || data[index].deductionType == 231) {
      if (this.isHBA) {
        alert("Loan amount not remove here.");
        return;
      }
    }
    if (data[index].deductionType == 223 || data[index].deductionType == 224) {
      if (this.isMCA) {
        alert("Loan amount not remove here.");
        return;
      }
    }
    const control = <FormArray>this.registrationForm?.get('addDeduction');
    control.removeAt(index);
  }


  get addAllowanceType() {
    return this.registrationForm?.get('addAllowanceType') as FormArray
  }



  onRemoveAllowance(index: any) {
    const control = <FormArray>this.registrationForm?.get('addAllowanceType');
    control.removeAt(index);
  }
  onSubmitAllowance() {

    if (this.recoveryFormNew.value.recoveryAmount == "" || this.recoveryFormNew.value.recoveryAmount == null) { } else {
      alert("Please click 'Add' Button to add Recovery")
      if (this.userDetails.roleid == '1') {
        this.moveToSelectedTab("Types of Additional Allowance,Recovery and Deductions Details")
      }
    }
    if (this.DeductionFormNew.value.deductionAmount == "" || this.DeductionFormNew.value.deductionAmount == null) { } else {
      alert("Please click 'Add' Button to add Deduction")
      if (this.userDetails.roleid == '1') {
        this.moveToSelectedTab("Types of Additional Allowance,Recovery and Deductions Details")
      }
    }
    if (this.AllowanceFormNew.value.allowanceAmount == "" || this.AllowanceFormNew.value.allowanceAmount == null) { } else {
      alert("Please click 'Add' Button to add Allowance")
      if (this.userDetails.roleid == '1') {
        this.moveToSelectedTab("Types of Additional Allowance,Recovery and Deductions Details")
      }
    }
    if (this.WithHeldFormNew.value.withHeldAmount == "" || this.WithHeldFormNew.value.withHeldAmount == null) { } else {
      alert("Please click 'Add' Button to add WithHeld")
      if (this.userDetails.roleid == '1') {
        this.moveToSelectedTab("Types of Additional Allowance,Recovery and Deductions Details")
      }
    }
  }
  get addWithHeld() {
    return this.registrationForm.get('addWithHeld') as FormArray
  }



  onRemoveWithHeld(index: any) {
    const control = <FormArray>this.registrationForm?.get('addWithHeld');
    control.removeAt(index);
  }

  Allowance: any;
  getAllowance() {

    this._Service.postdeduction({ "allDeductionType": "A" }, 'getAllowance').subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.Allowance = res.data;

        }
      },
      error: (err) => {


        this.error = err;
      
      },
    });
  }
  deduction: any;
  getDeduction() {

    this._Service.postdeduction({ "allDeductionType": "D" }, 'getDeduction',).subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.deduction = res.data;

        }
      },
      error: (err) => {


        this.error = err;
      
      },
    });
  }
  WithHeldReasons: any;
  getWithHeldReasons() {

    this._Service.postdeduction(null, 'getWithHeldReasons').subscribe({
      next: (res) => {
        if (res.status = 200) {
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
        if (res.status = 200) {
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
  isLoadingSet:boolean=false;
  pensionSetPreview() {
    var data2: any;
    this.isLoadingSet=true
    let url = "getreportpath";
    let data1 =
    {
      "taskTranId": this.transId
    }
    this.isLoadingSet=true
    this._Service.postho(url, data1).subscribe((res: any) => {
      console.log("res", res)
      data2 = res.data;
      // data2=JSON.parse(data2);
      this.pdfpreview(data2)
    },(error)=>{
      this.isLoadingSet=false
        alert("Some Error Occured")
      })
  }

  pdfpreview(data2: any) {
    console.log("preview", data2);

    let data = {
      "reportPath": data2.reportPath,
      "format": "pdf",
      "params": [
        {
          "name": "task_data_id",
          "value": data2.taskDataId
        }
      ]
    }
    console.log("single report data", data)
    this._Service.postOr("report/singlereport", data).subscribe((res: any) => {
      console.log("res", res.data.report.content);
      this.isLoadingSet=false
      if (res.data.report.content) {
        const byteArray = new Uint8Array(
          atob(res.data.report.content)
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
    },(error)=>{
        this.isLoadingSet=false
          alert("Some Error Occured")
        })
  }
  previewFilesFR() {
    var data2: any;
    let url = "getreportpath";
    let data1 =
    {
      "taskTranId": this.transId
    }
    this._Service.postho(url, data1).subscribe((res: any) => {
      console.log("res", res)
      data2 = res.data;
      // data2=JSON.parse(data2);
      this.pdfpreviewFR(data2)
    })

  }
  pdfpreviewFR(data2: any) {
    console.log("preview", data2);

    let data = {
      "reportPath": "/Pension/FR/Report/PENSION_FR_RPT.xdo",
      "format": "pdf",
      "params": [
        {
          "name": "task_data_id",
          "value": data2.taskDataId
        }
      ]
    }
    console.log("single report data", data)
    this._Service.postOr("report/singlereport", data).subscribe((res: any) => {
      console.log("res", res.data.report.content);
      this.isLoadingFR=false;
      if (res.data.report.content) {

        const byteArray = new Uint8Array(
          atob(res.data.report.content)
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
    },(error)=>{
      this.isLoadingFR=false;
      alert("Some Error Occured")
    })
  }

  
  isAgree(i: any) {
    alert(this.Summary.value.is_agree)
  }
  removeUploadDoc(i: any, in1: any) {
    console.log("document removed", i);

    let rajIndex = 0;
    this.documentlist.filter((data: any, index: number) => {
      if (data.docName == i) {
        rajIndex = index;
        return data;
      }
    })

    this.documentlist[rajIndex].dmsDocId = null;
    this.removeDoc[in1] = false
    //this.documentlist[rajIndex]['newDocName']=data.doc_name;
    console.log("documentlist", this.documentlist);
    if (i == "Marriage Certificate") {
      this.isMdown = false;
    }
    else if (i == "Retirement Order Sanction") {
      this.isRe = false
    } else if (i == "No DE Certificate") {
      this.isDe = false
    }
    else if (i == "Bank Passbook First Page/Cancelled Cheque") {
      this.ischq = false
    }

  }
  removeUploadDoc2(i: any) {
    console.log("document removed", this.documentlist);

    let rajIndex = -1;
    this.documentlist.filter((data: any, index: number) => {
      if (data.docName == i) {
 
        rajIndex = index;
        return data;
      }
    })

    this.documentlist[rajIndex].dmsDocId = null;

    //this.documentlist[rajIndex]['newDocName']=data.doc_name;
    console.log("documentlist", this.documentlist);
    if (i == "Marriage Certificate") {
      this.isMdown = false;
    }
    else if (i == "Retirement Order Sanction") {
      this.isRe = false
    } else if (i == "No DE Certificate") {
      this.isDe = false
    }
    else if (i == "Bank Passbook First Page/Cancelled Cheque") {
      this.ischq = false
    }
    else if (i == "Revised APC") {
      this.file = undefined;
      this.IsAcc = false
    }
    else if (i == "Tentative LPC Certificate") {
      this.file = undefined;
      this.isTLPC = false
    }
    else if (i == "Added Gratuity Certificate") {
      this.file = undefined;
      this.isAddCer = false
    }
  }
  payScalelist: any;
  payScale = () => {
    let data = {
      "payCommissionId": this.Calculations_Pay_Details.payCommissionId,
    }
    this._Service.postEmployeeLmdm('getPayScale', data).subscribe((res: any) => {
      console.log("payScalelist", this.payScalelist)
      if (res.data.status = 200) {

        this.payScalelist = res.data

      }
    })

  }
  basicPaylist: any;
  getBasicPay() {
    let BasicPaydata = {
      "payScaleId": this.tenPayLevel,
      "payCommissionId": this.Calculations_Pay_Details.payCommissionId,
    }

    this._Service.postEmployeeLmdm('getBasicPay', BasicPaydata).subscribe(res => {
      console.log("basicPaylist", this.basicPaylist)
      if (res.data.status = 200) {
        this.basicPaylist = res.data;

      }
    })
  }
  omit_special_char(val:any)
{
   var k;
    document.all ? k = val.keyCode : k = val.which;

    return ( k == 8 || k == 32 || (k >= 48 && k <= 57) || k ==45);
}
checkHeadLength(val:any)
{
  let data=val.target.value
  console.log(data.length)
  if(data.length<15)
  {
    alert("please add full Budget-Head.")
  }
  if(data.length>20)
  {
    alert("Max Budget-Head length is 20.")
  }
}
openNPADialog(){
  this.dialog.open(CommonDialogComponent,
    {
      panelClass: 'dialog-w-50', autoFocus: false
      ,
      height: "auto",
      width: "calc(100% - 50%)",
      data: {
        message: "NPA List",
       
        id: 22,
        empId:this.Personaldetail.employeeId
        
      }
    }
  ).afterClosed()
    .subscribe(response => {

    });

}
openSpePayDialog()
{
  this.dialog.open(CommonDialogComponent,
    {
      panelClass: 'dialog-w-50', autoFocus: false
      ,
      height: "auto",
      width: "calc(100% - 50%)",
      data: {
        message: "Special Pay List",
       
        id: 25,
        empId:this.Personaldetail.employeeId
        
      }
    }
  ).afterClosed()
    .subscribe(response => {

    });
}
addedJoiningDate: any;
addedJoiningDate2:any='';
AddedServicesDateChange(date: any) {
  this.addedJoiningDate2=date;
  let date1 = moment(date, "DD-MM-YYYY").format("DD-MMM-YYYY");;
  let date2 = new Date(date1);
  this.addedJoiningDate = date2;
 
  // this.commutationDateCalculation(this.Pension_Commutation2.commutationEffectiveDate)
}
AddedServicesDateChange2() {

 if(this.addedJoiningDate2=="")
 {
  alert("Please select joining date.");
  return;
 }
 if(this.ServiceDetails.addedServicesGratuity=="Yes" )
 {
  if(this.ServiceDetails.addedServicesGratuityAmount==0 )
 {
  alert("Please enter Gratuity Amount");
  return;
 }

 let doc_check=this.documentlist.filter((x:any)=>x.docTypeId==191);

 if(doc_check.length>0)
 {
   if(doc_check[0].dmsDocId==null)
   {
     alert("Upload Document.");
     return;
   }
       }
}
this.ServiceDetails.addedJoiningDate = moment(this.addedJoiningDate2, "DD-MM-YYYY").format("DD-MMM-YYYY");
  this.commutationDateCalculation(this.Pension_Commutation2.commutationEffectiveDate)
}
hoverMsg:any;
hoverMsgS:any;
over(hoverMsg:any)
{
 
this.hoverMsg=hoverMsg

}
out1()
{
 
  this.hoverMsg="";


}
over2(hoverMsg:any)
{
  
this.hoverMsgS=hoverMsg
}
out2()
{
 
  this.hoverMsgS="";

}
ObjectionList:any;
getObjection(){
  let data = {
    "inMstType":31
   
    }
  this._Service.post('allmstdata', data).subscribe({
    next: (res) => {
      if (res.status = 'SUCCESS') {
       
       this.ObjectionList=JSON.parse(res.data)
       console.log("objection",this.ObjectionList)
      }
    },

  })
}
ChangeTenBasicPay(){
  if(this.tenBasicPay==null || this.tenBasicPay==undefined || this.tenBasicPay=='')
  {
    alert("Select Tentative Basic Pay.");
    return;
  }
  if(this.tBasicPayReason==null || this.tBasicPayReason==undefined || this.tBasicPayReason=='')
  {
    alert("Select Reason.");
    return;
  }
 
  let doc_check=this.documentlist.filter((x:any)=>x.docTypeId==190);

  if(doc_check.length>0)
  {
    if(doc_check[0].dmsDocId==null)
    {
      alert("Upload Document.");
      return;
    }
        }
  this.caculationPension()
}
}


