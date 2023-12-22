import { Component, Input, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { CommonModalComponent } from '../common-modal/common-modal.component';
import { Subject, debounceTime, of, startWith, switchMap } from 'rxjs';

import { ApiEssService } from 'src/app/services/api-ess.service';
import * as moment from 'moment';


@Component({
  selector: 'app-pay-entitlement',
  templateUrl: './pay-entitlement.component.html',
  styleUrls: ['./pay-entitlement.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PayEntitlementComponent implements OnInit {
  @Input() EmpDetails: any = {};
  @Input() config: any = {};
  @Output() EmpData = new EventEmitter();
  @Input() serviceUserList: any;
  @Input() userAction: Array<any> = [];
  @Input() personal: Subject<boolean>;
  @Input() isEssModify: boolean;
  @Input() office: any;
  @Input() currentDepartment: any;
  @Input() officeData: any;
  oOfficeId: any;
  today = new Date();
  payEntitlement: any;
  submitted!: boolean;
  getServiceCategoryList: Array<any> = [];
  getSubServiceCategoryList: Array<any> = [];
  designationlist: Array<any> = [];
  payScalelist: Array<any> = [];
  payCommissionlist: Array<any> = [];
  basicPaylist: Array<any> = [];
  gradePaylist: Array<any> = [];
  hralist: Array<any> = [];
  daRate: Array<any> = [];
  processCalBasic: any;
  processCalSi: any;
  processCalHra: any
  processCalGpf: any;
  processCalDa: any;
  panelOpenState = false;
  grossSalaryCalc: any;
  netDeductionCalc: any;
  netSalaryCalc: any;
  basicPayCalc: any;
  daCalc: any;
  hraCalc: any;
  ccaCalc: any;
  gpfCalc: any;
  siCalc: any;
  itCalc: any;
  isSaveEnable = false;
  action = '';
  gsalary = 0;
  deductions = 0;
  netsalary = 0;
  isOffice: boolean = true;
  isBasicPayTrue: boolean = true;
  pofficeId: any
  pdeptId: any
  //searchdepartment:any
  searchdepartment = new FormControl();
  serchOffice = new FormControl();
  isPayManager: boolean = true;
  constructor(private formbuilder: FormBuilder, private apiService: ApiEssService, public dialog: MatDialog) {

  }
  roleid: any;
  pensionInitOffice: any;
  empinfo: any;
  IsEss: any;
  ngOnInit(): void {
    this.roleid = sessionStorage.getItem("roleId")
    this.payEntitlement = this.formbuilder.group({
      serviceCategory: ['', Validators.required,],
      subServiceCategory: ['', Validators.required],
      designation: ['', Validators.required],
      payCommission: ['', Validators.required],
      dateOfEntryInExistingPayBandGradepay: ['', Validators.required],
      payScale: ['', Validators.required],
      dateOfPresentPayScale: ['', Validators.required],
      gradePay: [null], //Validators.required
      basicPay: ['0', Validators.required],
      dearnessAllowance: [''],
      govtQuarter: [0,],
      calDearnessAllowance: ['', Validators.required],
      houseRentAllowanceRate: [''],
      calBasicPay: ['',],
      gpf: ['',],
      si: ['',],
      calHouseRentAllowanceRate: ['',],
      incomeTax: ['',],
      cityCompensatoryAllowance: ['',],
      grossSalary: new FormControl({ value: '', disabled: true }),
      netDeduction: new FormControl({ value: '', disabled: true }),
      netSalary: new FormControl({ value: '', disabled: true }),
      monthlyPensionTreasury: ['', Validators.required],
      pensionIniOffice: [''],
      officeId: [''],
      specialPay: [''],
      NPA: ['']
      // newPensionInitOffice: [0],

    })
    this.getDepartmentList();
    this.ServiceCategory();
    this.Designation();
    this.PayCommission();
    this.getTreasury();

    this.personal.subscribe(v => {

    });
    this.empinfo = this.apiService.userInfo();
    this.IsEss = sessionStorage.getItem('landtoken');

    if (this.config.isView) {
      this.payEntitlement.disable();
    }
    this.config.isModified === true ? this.isSaveEnable = true : this.isSaveEnable = false;
    this.payEntitlement.patchValue()
    if (this.roleid === '1' || this.roleid === '2' || this.roleid === '3') {
      this.isBasicPayTrue = false;
    }

  }



  treasurylist: any;
  getTreasury() {
    this.apiService.postloantype1({}, "getpensiontreasury").subscribe({
      next: (res: any) => {
        if (res.status = 200) {
          this.treasurylist = res.data;
          console.log("this.treasurylist", this.treasurylist);
        }
      },
      error: (err: any) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }
    })
  }

  selectOption(event: any) {
    console.log(this.office)
    this.oOfficeId = '';
    this.pofficeId = '';
    this.pdeptId = '';
    // alert(this.isSaveEnable)
    // this.isSaveEnable=true;
    let data: any;
    if (event.value == 1) {
      this.isOffice = true;
      this.isList = false
      this.isKnow = false
      // this.pensionInitOffice=this.office;
      data = {
        "inMstType": 28,
        "inValue": this.office,
        "inValue2": 0,
        "inValue3": ""
      }


      this.apiService.postWf('allmstdata', data).subscribe({
        next: (res) => {

          if (res.status = 200) {
            let data1 = JSON.parse(res.data);
            console.log("check res", data1)
            if (data1 != null) {
              this.officeData.officeHoName = data1[0]?.officeHoName;
              this.pensionInitOffice = data1[0]?.officeId;
              this.officeData.officeName = data1[0]?.officeName;
              if (data1[0]?.officeHoName == null) {
                alert("HO is not present in this office. Kindly contact the respective Office.")
              }
            } else {
              alert("Please insert right office id and try again or you can used 'Do'nt Know' option.")
            }
          }
        },

      })


    } else {
      this.isOffice = false;
      this.isKnow = true
      this.isList = true
      // const confirmDialog = this.dialog.open(CommonModalComponent, {
      //   autoFocus: false,
      //   width: '350px',
      //   data: {
      //     action: '',
      //     id: 'office',
      //     currentDepartment:this.currentDepartment

      //   },
      //   disableClose:true
      // });

      // confirmDialog.afterClosed().subscribe(data => {
      //   console.log("data",data);
      //   if(data!='')
      //     this.pensionInitOffice=data;
      //  else
      //  this.isOffice = true;

      // })
    }
  }
  isKnow: boolean = false
  isList: boolean = false
  selectOption2(event: any) {
    this.pofficeId = '';
    this.pdeptId = '';
    if (event.value == 1) {

      this.isList = true
    } else {

      this.isList = false
    }
  }
  fetchBank(officeId: any) {
    let data = {
      "inMstType": 26,
      "inValue": officeId,
      "inValue2": 0
    }
    this.apiService.postloantype1(data, "allmstdata").subscribe({
      next: (res: any) => {
        if (res.status = 200) {
          let officeDetail = res.data;
          console.log(".....officeDetail", officeDetail);
        }
      },
      error: (err: any) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }
    })
  }

  successful(title: any) {
    this.dialog.open(CommonModalComponent, {
      autoFocus: false,
      width: '40%',
      data: {
        message: title,
        id: title
      },
    });
  }
  private readonly houseRentV: ValidatorFn = c => {

    return this.ishouserent ? Validators.required(c) : Validators.nullValidator(c);
  }
  empData: any;
  ngOnChanges(changes: any) {
    console.log(changes)
    if (changes.hasOwnProperty('EmpDetails') && this.payEntitlement) {
      this.payEntitlement.patchValue({ ...changes.EmpDetails.currentValue });

      this.empData = changes.EmpDetails.currentValue;
      console.log("this.empData", this.empData)
      let dateOfPresentPayScale: any = "";
      let dateOfEntryInExistingPayBandGradepay: any = "";
      if (this.empData?.dateOfPresentPayScale)
        dateOfPresentPayScale = new Date(this.empData.dateOfPresentPayScale);
      if (this.empData?.dateOfEntryInExistingPayBandGradepay)
        dateOfEntryInExistingPayBandGradepay = new Date(this.empData.dateOfEntryInExistingPayBandGradepay);
      this.payEntitlement.patchValue({
        dateOfPresentPayScale: dateOfPresentPayScale,
        dateOfEntryInExistingPayBandGradepay: dateOfEntryInExistingPayBandGradepay
      });
      if (this.empData.govtQuarter == 0) {
        this.ishouserent = true;
      }
      if (this.getSubServiceCategoryList.length === 0) {
        this.getSubServiceCategory();
      }
      if (this.payScalelist.length === 0) {
        this.payScale();
        this.basicpay();
      }

    }
    if (changes.hasOwnProperty('serviceUserList')) {
      const data = changes.serviceUserList.currentValue || {};
      if (Object.keys(data).length === 0) { return }
      this.payEntitlement.patchValue({
        serviceCategory: Number(data.serviceCategory),
        subServiceCategory: Number(data.subServiceCategory),
      })
      this.getSubServiceCategory();
    }
    this.config.isModified === true ? this.isSaveEnable = true : this.isSaveEnable = false;
    this.pensionInitOffice = this.office

  }


  modify() {
    this.payEntitlement.enable();
    this.isSaveEnable = true;
    this.config.isModified = false
  }
  ishouserent: boolean = false;
  onItemChange(event: any) {
    if (event.value == true) {

      this.ishouserent = false
      this.payEntitlement.patchValue({
        houseRentAllowanceRate: ""
      })
    }
    else {

      this.ishouserent = true
      this.payEntitlement.patchValue({ houseRentAllowanceRate: this.empData.houseRentAllowanceRate });
    }
  }

  ServiceCategory = () => {
    this.apiService.postmdm('getServiceCategory', {}).subscribe(res => {
      if (res.status = "Success") {
        this.getServiceCategoryList = res.data
        this.getProcessCalGpf();
      }
    })
  }

  getSubServiceCategory = () => {
    this.apiService.postmdm('getSubServiceCategory', { serviceCategoryId: this.payEntitlement.value.serviceCategory }).subscribe({
      next: (res) => {
        this.getSubServiceCategoryList = res.data;
      }
    })
  }



  Designation = () => {
    this.apiService.postmdm('getDesignation', {}).subscribe(res => {
      this.designationlist = res.data
    })
  }
  PayCommission = () => {
    this.apiService.postmdm('getPayCommission', {}).subscribe(res => {
      this.payCommissionlist = res.data

    })


  }
  changePayCommision() {
    this.payEntitlement.patchValue({
      payScale: "",
      basicPay: "",
      dearnessAllowance: ""
    }

    )
    this.payScale();
  }
  payScale = () => {
    let data = {
      "payCommissionId": this.payEntitlement.value.payCommission,
    }
    this.apiService.postlmdm('getPayScale', data).subscribe(res => {
      if (res.data.status = 200) {
        this.payScalelist = res.data

        this.gradePay();
      }
    })
    this.getDaRate();
    this.getHra();
    this.getProcessCalSi()
  }

  gradePay = () => {
    if (this.payEntitlement.value.payScale != null) {
      let data = {
        "payScaleId": this.payEntitlement.value.payScale,
      }
      this.apiService.postlmdm('getGradePay', data).subscribe(res => {
        if (res.data.status = 200) {
          this.gradePaylist = res.data
        }
      })
    }

    this.basicpay();
  }

  basicpay = () => {
    let BasicPaydata = {
      "payScaleId": this.payEntitlement.value.payScale,
      "payCommissionId": this.payEntitlement.value.payCommission,
    }

    this.apiService.postlmdm('getBasicPay', BasicPaydata).subscribe(res => {
      if (res.data.status = 200) {
        this.basicPaylist = res.data;
        if (this.empData) {
          console.log("empData", this.empData.calBasicPay)
          this.basicPaylist.filter((x: any) => {
            if (x.basicPay == this.empData.calBasicPay) {
              this.payEntitlement.patchValue({
                basicPay: x.basicPayId,
              })
            }
          }
          )
        }
      }
    })
  }

  getHra = () => {
    let data = {
      "payCommissionId": this.payEntitlement.value.payCommission,
    }
    this.apiService.postlmdm('getHra', data).subscribe({
      next: res => {
        this.hralist = res.data;
        // this.payEntitlement.patchValue({houseRentAllowanceRate:this.hralist[0].cityClassId

        // })
      }
    })

  }


  getDaRate = () => {
    let data = {
      "payComId": this.payEntitlement.value.payCommission,
      "srvcCatId": this.payEntitlement.value.serviceCategory,
    }
    this.apiService.postlmdm('getDaRateReg', data).subscribe({
      next: res => {
        this.daRate = res.data
        if (this.daRate) {
          this.payEntitlement.patchValue({
            dearnessAllowance: res.data[0].daRateId,
          })
        }
      }
    })
  }

  getProcessCalBasic = () => {
    let data = {
      "payCommissionId": this.payEntitlement.value.payCommission,
      "basicPayId": this.payEntitlement.value.basicPay
    }
    this.apiService.postlmdm('getProcessCalBasic', data).subscribe({
      next: res => {
        this.processCalBasic = res.data,
          this.payEntitlement.patchValue({
            calBasicPay: res.data[0].basicPay,
          })
        this.basicPayCalc = res.data[0].basicPay;

      }
    })
  }
  getProcessCalSi = () => {
    let data = {
      "payCommissionId": this.payEntitlement.value.payCommission,
      "subCatId": this.payEntitlement.value.subServiceCategory,
    }
    this.apiService.postlmdm('getProcessCalSi', data).subscribe({
      next: res => {
        this.processCalSi = res.data,
          this.payEntitlement.patchValue({
            si: res.data[0].SI,
          })
        this.siCalc = res.data[0].SI
      }
    })
  }




  getProcessCalHra = () => {
    let data = {
      "payCommissionId": this.payEntitlement.value.payCommission,
    }
    this.apiService.postlmdm('getHra', data).subscribe({
      next: res => {
        this.processCalHra = res.data;
        this.payEntitlement.patchValue({
          calHouseRentAllowanceRate: res.data[0].HRA,
        })
        // this.hraCalc = res.data.HRA;

      }
    })
  }

  getProcessCalDa = () => {
    let data = {
      "payCommissionId": this.payEntitlement.value.payCommission,
      "daRate": this.payEntitlement.value.dearnessAllowance,
      "basicPay": this.payEntitlement.value.basicPay
    }
    this.apiService.postlmdm('getProcessCalDa', data).subscribe({
      next: res => {
        this.processCalDa = res.data,
          this.payEntitlement.patchValue({
            calDearnessAllowance: res.data[0].da,
          })
        this.daCalc = res.data[0].da;
        this.grossSalaryCalc = this.basicPayCalc + this.daCalc;
        this.netDeductionCalc = this.siCalc + this.gpfCalc;
        this.netSalaryCalc = this.grossSalaryCalc - this.netDeductionCalc
      }
    })
  }

  getProcessCalGpf = () => {
    if (
      this.payEntitlement.value.payCommission != null &&
      this.payEntitlement.value.subServiceCategory
    ) {
      let data = {
        "payCommissionId": this.payEntitlement.value.payCommission,
        "subCatId": this.payEntitlement.value.subServiceCategory,
      }
      this.apiService.postlmdm('getProcessCalGpf', data).subscribe({
        next: res => {
          this.processCalGpf = res.data,
            this.payEntitlement.patchValue({
              gpf: res.data[0].GPF,
            })
          this.gpfCalc = res.data[0].GPF;
        }
      })
    }

  }

  getGrossSalary = () => {
    this.gsalary = this.payEntitlement.value.calBasicPay + this.payEntitlement.value.calDearnessAllowance + this.payEntitlement.value.calHouseRentAllowanceRate + this.payEntitlement.value.cityCompensatoryAllowance
    return this.gsalary;
  }
  getDeduction = () => {
    this.deductions = this.payEntitlement.value.gpf + this.payEntitlement.value.si + this.payEntitlement.value.incomeTax;
    this.netsalary = this.gsalary - this.deductions;
    return this.deductions;
  }

  userConfirm() {
    const confirmDialog = this.dialog.open(CommonModalComponent, {
      autoFocus: false,
      width: '550px',
      data: {
        action: this.action === '' ? 'CMPEMP' : this.action,
        id: 'success'
      },
    });

    confirmDialog.afterClosed().subscribe(data => {
      if (data === 'Y') {
        this.onsubmit();
      }
    })
  }
  submitData: any;
  isSubmit: boolean = false
  preview() {
    if (this.payEntitlement.invalid) {
      alert("Please ensure that all fields are filled correctly and completely");
      return
    }

    if (this.pensionInitOffice <= 0) {
      alert("please enter pension initiate office.");
      return;
    }
    this.submitData = this.payEntitlement.value;
    if (this.submitData['designation']) {
      if (this.designationlist) {
        this.submitData['designationN'] = this.designationlist?.filter((x: any) => x.desgId == this.submitData['designation'])[0]?.desgDescEn;
      }
    }
    if (this.submitData['payCommission']) {
      if (this.payCommissionlist) {
        this.submitData['payCommissionN'] = this.payCommissionlist?.filter((x: any) => x.payCommisionId == this.submitData['payCommission'])[0]?.payCommNameEn;
      }
    }
    if (this.submitData['payScale']) {
      if (this.payScalelist) {
        this.submitData['payScaleN'] = this.payScalelist?.filter((x: any) => x.payScaleId == this.submitData['payScale'])[0]?.payScaleName;
      }
    }
    if (this.payEntitlement.value.payCommission == 6) {
      if (this.submitData['gradePay']) {
        if (this.gradePaylist) {
          this.submitData['gradePayN'] = this.gradePaylist?.filter((x: any) => x.payScaleId == this.submitData['gradePay'])[0]?.incrementGradePay;
        }
      }
    }

    if (this.submitData['basicPay']) {
      if (this.basicPaylist) {
        this.submitData['basicPayN'] = this.basicPaylist?.filter((x: any) => x.basicPayId == this.submitData['basicPay'])[0]?.basicPay;
      }
    }
    if (this.submitData['dearnessAllowance']) {
      if (this.daRate) {
        this.submitData['dearnessAllowanceN'] = this.daRate?.filter((x: any) => x.daRateId == this.submitData['dearnessAllowance'])[0]?.daRate;
      }
    }
    if (this.submitData['monthlyPensionTreasury']) {
      if (this.treasurylist) {
        this.submitData['monthlyPensionTreasuryN'] = this.treasurylist?.filter((x: any) => x.treasCode == this.submitData['monthlyPensionTreasury'])[0]?.treasNameEn;
      }
    }
    this.submitData['pensionIniOffice'] = this.pensionInitOffice;
    this.submitData['officeId'] = this.pensionInitOffice;
    this.submitData['pensionOfficeN'] = this.officeData?.officeName;
    this.submitData['pensionOfficeHoN'] = this.officeData?.officeHoName;
    console.log("submitData", this.submitData)
    this.isSubmit = true

    const data = { step: 7, value: this.submitData, action: this.action, remark: "" }
    this.EmpData.emit(data);
  }
  onsubmit() {
    // this.submitData=this.payEntitlement.value;
    console.log(this.payEntitlement)
    if (this.payEntitlement.invalid) {
      alert("Please ensure that all fields are filled correctly and completely");
      return
    }

    if (this.pensionInitOffice <= 0) {
      alert("please enter pension initiate office.");
      return;
    }

    const confirmDialog = this.dialog.open(CommonModalComponent, {
      autoFocus: false,
      width: '550px',
      data: {
        action: this.action === '' ? 'CMPEMP' : this.action,
        id: 'success'
      },
    });

    confirmDialog.afterClosed().subscribe(data => {

      let mainData = JSON.parse(data)

      if (mainData.action === 'Y') {
        const data = { step: 6, value: this.submitData, action: this.action, remark: mainData.remark }


        // data['value']['pensionIniOffice'] = this.pensionInitOffice;

        // data['value']['officeId'] = this.pensionInitOffice;
        // console.log(this.pensionInitOffice)
        // console.log(data['value']['pensionIniOffice'])

        data['value']['dateOfPresentPayScale'] = moment(this.payEntitlement.value.dateOfPresentPayScale).format('YYYY-MM-DD').toString();
        data['value']['dateOfEntryInExistingPayBandGradepay'] = moment(this.payEntitlement.value.dateOfEntryInExistingPayBandGradepay).format('YYYY-MM-DD').toString();
        console.log(data)
        this.EmpData.emit(data);
      }
    })


    /*  this.apiService.postdoc('payEntitlement/validate', this.payEntitlement.value).subscribe({
       next: res => {
         if (res.status == 'SUCCESS') {
           const data = { step: 6, value: this.payEntitlement.value, action:this.action }
           this.EmpData.emit(data);

         }
       }, error: err => {
       }

     }) */

  }

  _filter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.treasNameEn.toLowerCase().includes(value.toLowerCase())
    });
  }


  // $pdAccountNo = this.pdAccountNo.valueChanges.pipe(
  //   startWith(null),
  //   debounceTime(200),
  //   switchMap((resp: any) => {
  //     if (!resp) return of(this.pdAccountNoArray);
  //     let fff = resp.toLowerCase();
  //     console.log("fff555", fff);
  //     return of(
  //       this.pdAccountNoArray.filter(
  //         (x: any) => x.PDAccName.toString().toLowerCase().indexOf(fff) >= 0
  //         //majorheadname
  //       )
  //     );
  //   })
  // );
  departmentList: any
  getDepartmentList() {
    let data = {
      "inMstType": 21,
      "inValue": 0,
      "inValue2": 0,
      "inValue3": ""
    }
    this.apiService.postWf('allmstdata', data).subscribe({
      next: (res) => {

        if (res.status = 200) {
          this.departmentList = JSON.parse(res.data);
          console.log("this.officeList", this.departmentList)

          this.$searchdepartment = this.searchdepartment.valueChanges.pipe(
            startWith(null),
            debounceTime(200),
            switchMap((res: any) => {
              if (!res) return of(this.departmentList);
              let fff = res;
              //console.log("shyam",fff);
              return of(
                this.departmentList.filter(
                  (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0

                )
              );
            })
          );

        }
      },

    })
  }

  $searchdepartment = this.searchdepartment.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((res: any) => {
      if (!res) return of(this.departmentList);
      let fff = res;
      //console.log("shyam",fff);
      return of(
        this.departmentList.filter(
          (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0

        )
      );
    })
  );

  $serchOffice = this.serchOffice.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((res: any) => {
      if (!res) return of(this.officeList);
      let fff = res;
      //console.log("shyam",fff);
      return of(
        this.officeList.filter(
          (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0

        )
      );
    })
  );


  officeList: any
  getOfficeList() {
    let data = {
      "inMstType": 22,
      "inValue": this.pdeptId,
      "inValue2": 0,
      "inValue3": ""
    }
    this.apiService.postWf('allmstdata', data).subscribe({
      next: (res) => {

        if (res.status = 200) {
          this.officeList = JSON.parse(res.data);
          console.log("this.officeList", this.officeList)
          this.$serchOffice = this.serchOffice.valueChanges.pipe(
            startWith(null),
            debounceTime(200),
            switchMap((res: any) => {
              if (!res) return of(this.officeList);
              let fff = res;
              //console.log("shyam",fff);
              return of(
                this.officeList.filter(
                  (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0

                )
              );
            })
          );
        }
      },

    })
  }
  checkOfficeId(i: any) {
    let data: any;
    if (i == 1) {
      if (this.oOfficeId == null || this.oOfficeId == '') {
        alert("Insert office id")

      }
      data = {
        "inMstType": 28,
        "inValue": this.oOfficeId,
        "inValue2": 0,
        "inValue3": ""
      }
      // this.payEntitlement.patchValue({newPensionInitOffice : this.oOfficeId});

    } else if (i == 2) {
      data = {
        "inMstType": 28,
        "inValue": this.pofficeId,
        "inValue2": 0,
        "inValue3": ""
      }
    }
    console.log("check office", data);
    this.apiService.postWf('allmstdata', data).subscribe({
      next: (res) => {

        if (res.status = 200) {
          let data1 = JSON.parse(res.data);
          console.log("check res", data1)
          if (data1 != null) {
            this.officeData.officeHoName = data1[0]?.officeHoName;
            this.pensionInitOffice = data1[0]?.officeId;
            this.officeData.officeName = data1[0]?.officeName;
            if (data1[0]?.officeHoName == null) {
              alert("HO is not present in this office. Kindly contact the respective Office.")
            }
          } else {
            alert("Please insert right office id and try again or you can used 'Do'nt Know' option.")
          }
        }
      },

    })
  }
}
