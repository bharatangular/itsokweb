import { Component, Input, OnInit } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { MatDialog } from '@angular/material/dialog';
import { FamilyDetailsPopupComponent } from 'src/app/family-details-popup/family-details-popup.component';
import { AppComponent } from 'src/app/app.component';
import { AppConfig } from 'src/app/app.config';
import { TokenManagementService } from 'src/app/services/token-management.service';

@Component({
  selector: 'app-family-nomination',
  templateUrl: './family-nomination.component.html',
  styleUrls: ['./family-nomination.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})

export class FamilyNominationComponent implements OnInit {

  // input decorator
  @Input() empId: any;
  @Input() empCode: any;

  // variables
  familyDetails: any = [];
  nominee: any;
  btnLabel: any;
  iconCA: any;
  empInfo: any;
  serviceRecordArray: any[] = [];
  serviceRecordAarrayList: any[] = [];
  deStatus: boolean = true;
  error: any;
  serviceRecord: any;
  gratuityArray: any[] = [];
  commutationArray: any[] = [];
  arrearArray: any[] = [];
  userDetails:any={"role":"",
  "roleid" :"",
 "assignmentid":""};
config:AppConfig=new AppConfig();

  constructor(private _pensionService: PensionServiceService,
    public _dialog: MatDialog,
    private tokenInfo:TokenManagementService) { }

  ngOnInit(): void {
    this.userDetails = this.config.getUserDetails();
    // alert(this.empId)
    // alert(this.empCode)

    this.empInfo = this.tokenInfo.empinfoService;

    if (this.empInfo.roleId == 49) {
      this.btnLabel = 'Next';
    } else {
      this.btnLabel = 'Proceed';
    }

    if ( this.userDetails.roleid=='1') {
      this.getFamilyDetails();
      this.getNomination();
      this.getPensionCommutation();
    } else {
      // this.getTaskDetail(this.transId);
    }

    this._pensionService.userActivated.subscribe((data: any) => {
      this.serviceRecordAarrayList = [];
      this.serviceRecordAarrayList.push(data);

      for (let D of this.serviceRecordArray) {
        for (let p of this.serviceRecordAarrayList) {
          if (p.id == D.id) {
            this.serviceRecordArray = this.serviceRecordAarrayList;
            this.getPensionCommutation();
            if (this.serviceRecordArray[0].DE_Status == 1) {
              this.deStatus = true;
            } else {
              this.deStatus = false;
            }
            // let data1 ={
            //   get(id:any): any {
            //     return p.id
            //   },
            // }
            //          this.serviceRecord_arry.forEach((data) => {
            //           if(data1.get(data.id) && (data.id === data1.get(data.id).id)) {
            //
            //             //data.Qualifying_pensionService = data1.get(data.id).Qualifying_pensionService;
            //             this.serviceRecord_arry.push(data);
            //           }
            //         });
          }
        }
      }
    });

    this._pensionService.userActivated1.subscribe((data: any) => {
      this.serviceRecordArray.push(data);
    });
  }

  //#region FAMILY DETAILS AND NOMINATION

  getFamilyDetails() {
  
    let data = {
      employeeId: this.empId,
    };

    this._pensionService.postRequestpension(data, 'getFamilyDetailsByEmployeeId').subscribe({
        next: (response) => {
          if (response.status == 'SUCCESS') {
            this.familyDetails = response.data;
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

  

  getNomination() {
    let data = {
      "employeeId": this.empId,
    };
    this._pensionService.postRequestpension(data, 'getSchemeNomineeDetails').subscribe({
        next: (response) => {
          if ((response.status = 200)) {
            this.nominee = response.data;
            let product: any;
            for (product of this.nominee) {
              if (product.schemeName == 'Commutation') {
                this.commutationArray.push(product);
                this.iconCA = 'person_pin_circle';
              } else if (product.schemeName == 'Arrears') {
                this.arrearArray.push(product);
              } else if (product.schemeName == 'Gratuity') {
                this.gratuityArray.push(product);
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


  getPensionCommutation() {
    
    let data = {
      "employeeCode": this.empCode,
      "withheldAmount": 450,
      "deductionAmount": 520,
      "recoveryAmount": 230,
      "allowanceAmount": 450,
      "qualifyingService": this.serviceRecordArray[0].qualifyingService,
      "nonQualifyingService": this.serviceRecordArray[0].nonQualifyingServiceDate,
    };

    
    this._pensionService.postRequestpension(data, 'getPensionDetailsByEmployeeCode').subscribe({
        next: (response) => {
          if ((response.status = 200)) {
            
            // this.Pension_Commutation = response.data;
            // this.commutationDetails.patchValue({
            //   Commutation_Amount: this.Pension_Commutation.commutationAmount,
            //   Commutation_Factor: this.Pension_Commutation.commutedFactor,
            //   Commutation_Value: this.Pension_Commutation.pensionCommuted,

            // });
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

  openDialog(field: any) {

    const updatePopup = this._dialog.open(FamilyDetailsPopupComponent, {
      // maxWidth: '65vw',
      // maxHeight: '90vh',
      // height: '100%',
      // width: '100%',
      height: 'auto',
      width: 'calc(100% - 40%)',

      panelClass: 'full-screen-modal',
      autoFocus: false,
      data: {
        parentPage: field,
      },
    });

    updatePopup.afterClosed().subscribe((result) => {
      console.log(result.data.value.memberName);
      console.log(
        'Data After Stringify : ' + JSON.stringify(result.data.value)
      );
      if (result) {
        console.log(
          'User wants Update than,if block redirect(family-nominee.component.ts) : ' +
          JSON.stringify(result.data.value)
        );
        this.familyDetails.nameEn = result.data.value.memberName;
        console.log('Family Details name ' + this.familyDetails.nameEn);

        let data = {
          "employeeCode": this.empCode,
          "familyMemId": 2,
          "relationshipId": 5,
          "nameEn": this.familyDetails.nameEn,
        };

        this._pensionService.postRequestAddress(data, 'updateFamilyDetails').subscribe({
            next: (response) => {
              if ((response.status = 200)) {
                this.getFamilyDetails();
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
    });
  }


  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length;i++) {
      if (
        (<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i])
          .innerText == tabName
      ) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }

}
