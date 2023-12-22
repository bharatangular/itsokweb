
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import * as moment from 'moment';
import { Console } from 'console';


@Component({
  selector: 'app-pension-calculation',
  templateUrl: './pension-calculation.component.html',
  styleUrls: ['./pension-calculation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class PensionCalculationComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  step = 0;
  panelOpenState = false;
  pensionCalculationForm: any = FormGroup;
  disableSelect = new FormControl(false);
  hideRequiredControl = new FormControl(false);
  employeeDetails: any;
  dataColumnArray: string[] = [];
  calculatedData: any;
  submitted!: boolean;
  dateOfJoining!: Date;
  dateOfRetierment!: Date;
  invalidQualifyingDate: boolean = false;
  invalidNonQualifyingDate: boolean = false;
  cpoRange: any;
  disableCpoFields = false;
  serviceDateArray = []
  pensionTypes!: [
    {
      "pensionCode": number,
      "pensionType": string
    }];
  pensionTypeUrl = "http://ifmstest.rajasthan.gov.in/pss/v1.0/pss/getpensiontype"
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  userDetails: any = {};
  isDisabled: boolean = false;
  isDisabled1: boolean = false;
  $event: any;
  one: number = 1;
  zero: number = 0;
  pensionerInfoResult: any;



  constructor(private fb: FormBuilder,
    private ApiUrlService: PensionServiceService, public dialog: MatDialog, private cd: ChangeDetectorRef) {

  }

  ngOnInit(): void {

    this.ApiUrlService.postPensionCalculate(this.pensionTypeUrl, {}).subscribe((res:any) => {
      this.pensionTypes = res.data

    })

    // this.auth.pensionerInfo.subscribe((code: any) => {
    //   this.pensionerInfoResult = code
    // })
    this.pensionCalculationForm = this.fb.group({
      employeeCode: ['', Validators.required],
      pensionTypeId: ['', Validators.required],
      dateOfVCD: [''],
      CpoCheck: [true],
      cpoEfDate: new FormControl({ value: "", disabled: false }, [
        Validators.required
      ]),
      cpoValue: new FormControl({ value: "", disabled: false }, [
        Validators.required
      ]),
      deFlag: [{ value: '1', disabled: false }],
      deType: new FormControl({ value: "", disabled: false }, [
        Validators.required
      ]),
      isPaperLess: [0],
      isMilitary: [1, Validators.required],
      isCivilSevices: [0, Validators.required],
      isPayCommission: [null, Validators.required],
      basicPay: [null, Validators.required],
      dA: [0, Validators.required],
      dapre: [0, Validators.required],
      allowanceAmount: [0, Validators.required],
      withheldAmount: [0, Validators.required],
      deductionAmount: this.fb.array([
        this.fb.group({
          dedAmount: ([null])
        })
      ]),
      recoveryAmount: this.fb.array([
        this.fb.group({
          recAmount: ([null])
        })
      ]),
      qualifyingService: this.fb.array([
        this.fb.group({
          fromDate: [null],
          toDate: [null],

        })
      ]),
      nonQualifyingService: this.fb.array([
        this.fb.group({
          fromDate: [null],
          toDate: [null],

        })
      ]),

    });
    // this.auth.userDetails.subscribe((code: any) => {

      // if (code) {

        // this.userDetails = code
        // this.pensionCalculationForm.controls['employeeCode'].setValue(this.userDetails.employeeCode)
        // if (this.userDetails?.employeeId) {

          // calling Employeedetails API
          // let data = 
          // {
          //    employeeId: this.userDetails?.employeeCode 
          //   }
          // this.ApiUrlService.postPensionCalculate(this.ApiUrlService.Url.getEmployeeDetails, ).subscribe((res:any) => {

          //   this.employeeDetails = res;
          //   this.setInitialUI(res)

          // })
        // }
      //}
    // })
  }


  setInitialUI(res: any) {
    //set initial Value of CPO Pancode
    if (res.data.employeeServiceDetails.serviceCategory === 1) {
      this.pensionCalculationForm.controls['cpoValue'].setValue(40);
      this.cpoRange = 40;
    } else if (res.data.employeeServiceDetails.serviceCategory === 13 || res.data.employeeServiceDetails.serviceCategory === 7) {
      this.pensionCalculationForm.controls['cpoValue'].setValue(50);
      this.cpoRange = 50;
    } else {
      this.pensionCalculationForm.controls['cpoValue'].setValue(33.33);
      this.cpoRange = 33.33;
    }


    //set minimum and maximum date Values

    //Date if joining
    if (res.data.employeeServiceDetails.joiningDate) {
      let date = new Date(res.data.employeeServiceDetails.joiningDate);
      this.dateOfJoining = new Date(date.getFullYear(), date.getDate(), date.getMonth())
   
    }
    //date of retierment
    if (res.data.employeePersonalDetail.dateOfRetirement && res.data.employeePersonalDetail.dateOfRetirement !== '') {
      let date = new Date(res.data.employeePersonalDetail.dateOfRetirement);
      this.dateOfRetierment = new Date(date.getFullYear(), date.getDate(), date.getMonth())


    }
    //Basic Pay
    if (res.data.payEntitlementDetails.basicPay) {
      
      this.pensionCalculationForm.controls['basicPay'].setValue(res.data.payEntitlementDetails.basicPay);
    }
    //DA
    if (res.data.payEntitlementDetails.calDearnessAllowance) {
      this.pensionCalculationForm.controls['dA'].setValue(res.data.payEntitlementDetails.calDearnessAllowance);
    }
    //percentage
    if (res.data.payEntitlementDetails.basicPay && res.data.payEntitlementDetails.calDearnessAllowance) {
      this.percentage(res.data.payEntitlementDetails.basicPay, res.data.payEntitlementDetails.calDearnessAllowance);
    }
  }

  percentage(basicpPay: number, calDearnessAllowance: number) {
    let percentage = (100 * calDearnessAllowance) / basicpPay;
    this.pensionCalculationForm.controls['dapre'].setValue(Math.round(percentage));

  }
  percentageCalculate(changeKey: string) {
    if (changeKey == 'percentage') {
      let newDA = (this.pensionCalculationForm.controls.basicPay.value * this.pensionCalculationForm.controls.dapre.value) / 100;
      this.pensionCalculationForm.controls['dA'].setValue(newDA);
    }
    if (changeKey == 'dA') {
      let percentage = (100 * this.pensionCalculationForm.controls.dA.value) / this.pensionCalculationForm.controls.basicPay.value;

      this.pensionCalculationForm.controls['dapre'].setValue(Math.round(percentage));
    }

    if (changeKey == 'basicPay') {
      let percentage = (100 * this.pensionCalculationForm.controls.dA.value) / this.pensionCalculationForm.controls.basicPay.value;

      this.pensionCalculationForm.controls['dapre'].setValue(Math.round(percentage));
    }

  }

  setStep(index: number) {
    this.step = index;
  }
  // disbale and enable CPO fields
  cpoCheck(event: MatCheckboxChange) {

    if (event.checked) {
      this.disableCpoFields = false;
      this.pensionCalculationForm.get('cpoValue').enable();
      this.pensionCalculationForm.get('cpoEfDate').enable();

    } else {

      this.pensionCalculationForm.get('cpoValue').disable()
      this.pensionCalculationForm.get('cpoEfDate').disable()
      this.pensionCalculationForm.get('cpoValue').setValue('')
      this.pensionCalculationForm.get('cpoEfDate').setValue('')
      this.disableCpoFields = true;

    }

  }

  //Value Validation for CPI Pancode 
  numberValidation() {
    if (this.employeeDetails.data.employeeServiceDetails.serviceCategory === 1) {

      (this.pensionCalculationForm.controls['cpoValue'].value > 40) && this.pensionCalculationForm.controls['cpoValue'].setValue(null);
    } else if (this.employeeDetails.data.employeeServiceDetails.serviceCategory === 13 || this.employeeDetails.data.employeeServiceDetails.serviceCategory === 7) {
      (this.pensionCalculationForm.controls['cpoValue'].value > 50) && this.pensionCalculationForm.controls['cpoValue'].setValue(null);
    } else {
      (this.pensionCalculationForm.controls['cpoValue'].value > 33.33) && this.pensionCalculationForm.controls['cpoValue'].setValue(null);
    }
  }


  someMethod(value: any) {
    // console.log(value)
  }
  // Dyanamically add new input fields
  addFields(fields: any) {
    const newForm = this.fb.group({
      Amount: (['', [Validators.pattern("^[0-9]*$")]])
    })
    if (fields == "deductionAmount") {
      this.deductionAmount.push(this.fb.group({
        dedAmount: (['',Validators.required])
      }));
    } else if (fields == "recoveryAmount") {
      this.recoveryAmount.push(this.fb.group({
        recAmount: (['',Validators.required])
      }));
    } else if (fields == "qualifyingService") {
      this.qualifyingService.push(this.fb.group({
        fromDate: [null,Validators.required],
        toDate: [null,Validators.required],

      }));
    } else if (fields == "nonQualifyingService") {
      this.nonQualifyingService.push(this.fb.group({
        fromDate: [null,Validators.required],
        toDate: [null,Validators.required]
      }));
    }
  }
  // Dyanamically adding new input fields
  removeField(fields: any, index: any) {
    if (fields == "deductionAmount") {
      this.deductionAmount.removeAt(index);
    } else if (fields == "recoveryAmount") {
      this.recoveryAmount.removeAt(index);
    } else if (fields == "qualifyingService") {
      this.qualifyingService.removeAt(index);
    } else if (fields == "nonQualifyingService") {
      this.nonQualifyingService.removeAt(index);
    }

  }
  dcRadio(rbNo: string) {
    if (rbNo == '1') {
      this.isDisabled = false;
      this.pensionCalculationForm.get('deType').enable()
    }
    else {
      this.isDisabled = true;
      this.pensionCalculationForm.get('deType').disable()

    }

  }
  get deductionAmount() {
    return this.pensionCalculationForm.controls["deductionAmount"] as FormArray;
  }
  get recoveryAmount() {
    return this.pensionCalculationForm.controls["recoveryAmount"] as FormArray;
  }
  get qualifyingService() {
    return this.pensionCalculationForm.controls["qualifyingService"] as FormArray;
  }
  get nonQualifyingService() {
    return this.pensionCalculationForm.controls["nonQualifyingService"] as FormArray;
  }
  get deCheck() {
    return this.pensionCalculationForm.controls["deFlag"].value
  }



  // convenience getter for easy access to form fields
  get f() { return this.pensionCalculationForm.controls; }

  //Number input Valiadtion
  public inputValidator(event: any) {

    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }

  }

  // function for check date is already selected or Not 
  public checkExistance(item: any, key: string) {
    this.pensionCalculationForm.value.qualifyingService.forEach((ele: any) => {

      if (ele.fromDate !== "Invalid Date") { ele.fromDate = moment(ele.fromDate).toDate().toLocaleDateString() } else { ele.fromDate == "" }
   
      if (ele.toDate !== "Invalid Date") { ele.toDate = moment(ele.toDate).toDate().toLocaleDateString() } else { ele.toDate == "" }
     

    })
    this.pensionCalculationForm.value.nonQualifyingService.forEach((ele: any) => {

      if (ele.fromDate !== "Invalid Date" && ele.fromDate !== null) { ele.fromDate = moment(ele.fromDate).toDate().toLocaleDateString() } else { ele.fromDate == "" }
      if (ele.toDate !== "Invalid Date" && ele.toDate !== null) { ele.toDate = moment(ele.toDate).toDate().toLocaleDateString() } else { ele.toDate == "" }

    })

    let currentDate = this.pensionCalculationForm.controls[key].value[item]

    let currentDateStart = new Date(currentDate.fromDate)
    let currentDateEnd = new Date(currentDate.toDate)
    let qualifyingServiceDates = this.pensionCalculationForm.controls["qualifyingService"].value;
    let nonQualifyingServiceDates = this.pensionCalculationForm.controls["nonQualifyingService"].value;

    // check existance from Qualifying service Array 
    for (let index = 0; index < qualifyingServiceDates.length; index++) {
      
      let start = new Date(qualifyingServiceDates[index].fromDate);
      let end = new Date(qualifyingServiceDates[index].toDate);
      if (key == 'qualifyingService' && index == item) {
        continue;
      }
      if (currentDateStart >= start && currentDateStart <= end) {
        this.invalidQualifyingDate = true;
        this.pensionCalculationForm.controls[key].controls[item].controls.fromDate.setValue('')
        this.pensionCalculationForm.controls[key].controls[item].controls.toDate.setValue('')
      } else if (currentDateEnd <= end && currentDateEnd >= start) {
        this.invalidQualifyingDate = true;
        this.pensionCalculationForm.controls[key].controls[item].controls.fromDate.setValue('')
        this.pensionCalculationForm.controls[key].controls[item].controls.toDate.setValue('')
      } else if (currentDateStart < start && currentDateEnd > end) {
        this.invalidQualifyingDate = true;
        this.pensionCalculationForm.controls[key].controls[item].controls.fromDate.setValue('')
        this.pensionCalculationForm.controls[key].controls[item].controls.toDate.setValue('')
      } else {
        this.invalidQualifyingDate = false;
      }


    }

    // check existance from Non Qualifying service Array 
    for (let index = 0; index < nonQualifyingServiceDates.length; index++) {
      let start = new Date(nonQualifyingServiceDates[index].fromDate);
      let end = new Date(nonQualifyingServiceDates[index].toDate);
      if (key == 'nonQualifyingService' && index == item) {
        continue;
      }
      if (currentDateStart >= start && currentDateStart <= end) {
        this.invalidNonQualifyingDate = true;
        this.pensionCalculationForm.controls[key].controls[item].controls.fromDate.setValue('')
        this.pensionCalculationForm.controls[key].controls[item].controls.toDate.setValue('')
      } else if (currentDateEnd <= end && currentDateEnd >= start) {
        this.invalidNonQualifyingDate = true;
        this.pensionCalculationForm.controls[key].controls[item].controls.fromDate.setValue('')
        this.pensionCalculationForm.controls[key].controls[item].controls.toDate.setValue('')
      } else {
        this.invalidNonQualifyingDate = false;
      }

    }







  }


  onSubmit() {
    let newOualifyingService
    let newNonOualifyingService
    let dataObject
    // stop here if form is invalid
    if (this.pensionCalculationForm.invalid) {
      this.submitted = true
      return;
    } else {

      if (this.pensionCalculationForm.value.dateOfVCD !== "") {
        this.pensionCalculationForm.value.dateOfVCD = moment(this.pensionCalculationForm.value.dateOfVCD).format('DD-MM-YYYY')
      }


      if (this.pensionCalculationForm.value.cpoEfDate) {
        this.pensionCalculationForm.value.cpoEfDate = moment(this.pensionCalculationForm.value.cpoEfDate).format('DD-MM-YYYY')
      } else {
        this.pensionCalculationForm.value.cpoEfDate = '';
        this.pensionCalculationForm.value.cpoValue = 0;

      }
      //removing CPO check

      if (this.pensionCalculationForm.value.qualifyingService.length) {

        newOualifyingService = JSON.parse(JSON.stringify(this.pensionCalculationForm.value.qualifyingService))
        newOualifyingService.forEach((ele: any) => {
          if (ele.fromDate !== "Invalid Date" && ele.fromDate !== null) { ele.fromDate = moment(ele.fromDate).toDate().toLocaleDateString('en-GB') } else { ele.fromDate = "" }
          if (ele.toDate !== "Invalid Date" && ele.toDate !== null) { ele.toDate = moment(ele.toDate).toDate().toLocaleDateString('en-GB') } else { ele.toDate = "" }

        })
      }
      if (this.pensionCalculationForm.value.nonQualifyingService.length) {
        // newNonOualifyingService =[...this.pensionCalculationForm.value.nonQualifyingService]
        newNonOualifyingService = JSON.parse(JSON.stringify(this.pensionCalculationForm.value.nonQualifyingService))
        newNonOualifyingService.forEach((ele: any) => {
          if (ele.fromDate !== "Invalid Date" && ele.fromDate !== null) { ele.fromDate = moment(ele.fromDate).toDate().toLocaleDateString('en-GB') } else { ele.fromDate = "" }
          if (ele.toDate !== "Invalid Date" && ele.toDate !== null) { ele.toDate = moment(ele.toDate).toDate().toLocaleDateString('en-GB') } else { ele.toDate = "" }
        })
      }

      // clone a objecr
      dataObject = { ...this.pensionCalculationForm.value }
      dataObject.qualifyingService = newOualifyingService
      dataObject.nonQualifyingService = newNonOualifyingService
      dataObject.isCivilSevices = Number(dataObject.isCivilSevices)
      dataObject.isMilitary = Number(dataObject.isMilitary)
     

      //pernsion Calculator Api Call
      this.ApiUrlService.postPensionCalculate(this.ApiUrlService.Url.pensionCalculatorService, dataObject).subscribe((response:any) => {
     
        if (response) {
          let keys = Object.keys(response.data);
          this.dataColumnArray = keys
          this.calculatedData = response.data
          this.step = 1;
          this.cd.detectChanges();
        }
      })
    }
  }

  headingKey(ele: string) {
    return ele.split(/(?=[A-Z])/).join(" ")
  }

  openSnackBar(msg: string) {
    alert(msg)

  }
  previewFiles() {}
  // previewFiles() {

  //   if (this.pensionerInfoResult.length) {
  //     let dmsDocId = this.pensionerInfoResult[0].pensionKitId;
  //     if (dmsDocId = this.pensionerInfoResult[0].pensionKitId) {
  //       let data = {
  //         "type": "pension",
  //         "sourceId": 2,
  //         "docs": [
  //           {
  //             "docId": this.pensionerInfoResult[0].pensionKitId
  //           }
  //         ]
  //       }

  //       this.ApiUrlService.postIntegration("wcc/getfiles", data).subscribe((res: any) => {

  //         if (res.data.document[0].content) {
  //           let data = {
  //             "base64Pdf": res.data.document[0].content,
  //             "redirectUrl": "pensioner/pssdashboard"
  //           }
  //           this.dialog.open(PdfpreviewComponent, { width: '70%', data: { message: data }, disableClose: false });

  //         }
  //       })
  //     } else {
  //       alert("Preview Not Available")
  //     }
  //   }


  // }


  close() {
    this.ngOnDestroy()
  }
  ngOnDestroy(): void {

  }

 
  // this.ApiUrlService.postPensionCalculate(this.ApiUrlService.Url.getEmployeeDetails, ).subscribe((res:any) => {
  onEnterEmpCode(event:any)
  {
   console.log(event)
    let data = 
    {
       employeeId:event
      }
    this.ApiUrlService.postPensionCalculate(this.ApiUrlService.Url.getEmployeeDetails,data).subscribe((res:any) => {
      //this.pensionerDetails = res.data
      this.employeeDetails = res;
      this.setInitialUI(res)
      console.log("Pensioner Deatils Neha",this.employeeDetails)
   })  
  
  } 


}
