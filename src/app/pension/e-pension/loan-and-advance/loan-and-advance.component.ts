import { Component, Input, OnInit } from '@angular/core';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from '../../common-dialog/common-dialog.component';
import { AppConfig } from 'src/app/app.config';
import { TokenManagementService } from 'src/app/services/token-management.service';


@Component({
  selector: 'app-loan-and-advance',
  templateUrl: './loan-and-advance.component.html',
  styleUrls: ['./loan-and-advance.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})

export class LoanAndAdvanceComponent implements OnInit {

  // input decorator
  @Input() empId: any;

  // variables
  loanAndAdvancesDetails: any;
  empInfo: any;
  btnlabel: any;
  error: any;

  constructor(private _Service: PensionServiceService,public dialog: MatDialog,private tokenInfo:TokenManagementService) {}


  ngOnInit(): void {

    this.empInfo = this.tokenInfo.empinfoService;

    if (this.empInfo.roleId == 49) {
      this.btnlabel = 'Next';
    } else {
      this.btnlabel = 'Proceed';
    }

    if (this.empInfo.aid === "58233") {

      this.getLoanAndAdvancesDetails();

    } else {

    }
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
  config:AppConfig=new AppConfig()
  //#region LOAN AND ADVANCE
  getLoanAndAdvancesDetails() {
    let data = {
      "employeeId": parseInt(this.empId)
    }
    this._Service.postRequestpension(data, 'getLoanDetailsByEmployeeId').subscribe({
      next: (response) => {
        if (response.status = 200) {
          this.loanAndAdvancesDetails = response.data;
          // let dd = response.data[0].loanDate
          // let datatime = dd.toString().substring(0,dd.length-5);
          // this.dateOfBirth=this.datepipe.transform(datatime  , 'dd/MM/yyyy')

          // localStorage.setItem('Loans-Advance', JSON.stringify(response.data[0]))
          this.config.storeDetails('Loans-Advance', JSON.stringify(response.data[0]))
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

  onPreviewFile() {
  }

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
    );
  }
 

}
