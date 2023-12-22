import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDialog } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { TokenManagementService } from 'src/app/services/token-management.service';

@Component({
  selector: 'app-calculations',
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})


export class CalculationsComponent implements OnInit {

  // input decorators
  @Input() empId:any;
  
  // variables
  empInfo: any;
  btnLabel: any;
  destatus: boolean = true;
  calculationsCommutationDetails: any;
  calculationsArdDetails: any;
  serviceRecordArray: any[] = [];
  serviceRecordArrayList: any[] = [];
  calculationsPayDetails: any;
  pensionCommutation: any;

  userDetails:any={"role":"",
  "roleid" :"",
 "assignmentid":""};
config:AppConfig=new AppConfig();
  // form group
  formARD!: FormGroup;
  commutationDetailsForm!: FormGroup;



  constructor(private _formBuilder: FormBuilder, private _pensionService: PensionServiceService, public _dialog: MatDialog,private tokenInfo:TokenManagementService) { }

  ngOnInit(): void {

    this.userDetails = this.config.getUserDetails();
    this.empInfo =  this.tokenInfo.empinfoService;;

    if (this.empInfo.roleId == 49) {
      this.btnLabel = 'Next';
    } else {
      this.btnLabel = 'Proceed';
    }

    if (this.empInfo.aid === "58233") {
      this.fetchPersonalEmp();
    } else {
    }

    this.formARD = this._formBuilder.group({

      // New FormControls
      recoveryType: new FormControl(''),
      recoveryAmount: new FormControl(''),
      recoveryHead: new FormControl(''),
      deductionType: new FormControl(''),
      deductionAmount: new FormControl(''),
      deductionHead: new FormControl(''),
      allowanceType: new FormControl(''),
      allowanceAmount: new FormControl(''),
      allowanceHead: new FormControl(''),
      withHeldReason: new FormControl(''),
      withHeldAmount: new FormControl(''),

    });
    this.commutationDetailsForm = this._formBuilder.group({
      budgetHead: new FormControl(''),
      effectiveDate: new FormControl(''),
      CommutationAmount: new FormControl(''),
      CommutationFactor: new FormControl(''),
      CommutationValue: new FormControl(''),

    });

    this._pensionService.userActivated.subscribe((data: any) => {
      this.serviceRecordArrayList = [];
      this.serviceRecordArrayList.push(data)

      for (let D of this.serviceRecordArray) {
        for (let p of this.serviceRecordArrayList) {
          if (p.id == D.id) {


            this.serviceRecordArray = this.serviceRecordArrayList;
            this.getPensionCommutation();
            if (this.serviceRecordArray[0].DE_Status == 1) {
              this.destatus = true;
            } else {
              this.destatus = false;
            }

          }
        }
      }
    })

    this._pensionService.userActivated1.subscribe((data: any) => {
      this.serviceRecordArray.push(data)
    })

  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
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

  fetchPersonalEmp() {
    let data = {
      "employeeId": this.empId
    }
    this._pensionService.postRequestpension(data, 'getEmployeePayDetails').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.calculationsPayDetails = res.data;

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




  getPensionCommutation() {
    let data = {
      // "employeeCode": this.employeeCode,
      "withheldAmount": 450,
      "deductionAmount": 520,
      "recoveryAmount": 230,
      "allowanceAmount": 450,
      "qualifyingService": this.serviceRecordArray[0].qualifyingService,
      "nonQualifyingService": this.serviceRecordArray[0].nonQualifyingServiceDate,
    }

  
    this._pensionService.postRequestpension(data, 'getPensionDetailsByEmployeeCode').subscribe({
      next: (response) => {
        if (response.status = 200) {
          
          this.pensionCommutation = response.data;
          this.commutationDetailsForm.patchValue({
            Commutation_Amount: this.pensionCommutation.commutationAmount,
            Commutation_Factor: this.pensionCommutation.commutedFactor,
            Commutation_Value: this.pensionCommutation.pensionCommuted,

          });
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
  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }
}

