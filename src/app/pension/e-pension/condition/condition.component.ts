import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { DatePipe } from '@angular/common';
import { STEPPER_GLOBAL_OPTIONS, } from '@angular/cdk/stepper';
import { MatSnackBar, } from '@angular/material/snack-bar';
import { MatDialog, } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonDialogComponent } from '../../common-dialog/common-dialog.component';
import { AppConfig } from 'src/app/app.config';
import { TokenManagementService } from 'src/app/services/token-management.service';

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})


export class ConditionComponent implements OnInit {

  // input
  @Input() stepper: any;
  @Output() outerStepper = new EventEmitter();

  // variables
  empInfo: any;
  taskRoleId: any;
  // remarkDetails: any;
  btnLabel: string = 'Proceed';
  transId: any;
  reqId: any;
  personalDetail: any;
  serviceDetails: any;
  residenceAddress: any;
  loanAndAdvancesDetails: any;
  calculationsPayDetails: any;
  pensionCommutation: any;
  banklist: any;
  documentList: any;
  rid: any;
  calculationsCommutationDetails: any;
  calculationsARDDetails: any;
  empDoc: any;
  payloadSummary: any;
  error: any;
  isMaker = false;
  isCheckerOrApprover = false;
  makerId: any;

  // form group
  conditionForm!: FormGroup;
 
  userDetails:any={"role":"",
  "roleid" :"",
 "assignmentid":""};
config:AppConfig=new AppConfig();
  
  constructor(private _formBuilder: FormBuilder, 
    private _pensionService: PensionServiceService, 
    private cd: ChangeDetectorRef, 
    private datepipe: DatePipe, 
    private _snackBar: MatSnackBar, 
    public dialog: MatDialog, 
    private ActivatedRoute: ActivatedRoute, 
    private routers: Router, 
    private http: HttpClient, 
    private date: DatePipe,
    private tokenInfo:TokenManagementService
) { }
  ngOnInit(): void {
    this.userDetails = this.config.getUserDetails();
    this.taskRoleId = this.ActivatedRoute.snapshot.paramMap.get('taskRoleId');
    this.empInfo = this.tokenInfo.empinfoService;;
    
    if (this.empInfo.roleId == 49) {
      this.btnLabel = 'Next';
    } else {
      this.btnLabel = 'Proceed';
    }

    if ( this.userDetails.roleid=='1') {
      this.isMaker = true;
      this.isCheckerOrApprover = false;
    } else {
      this.isCheckerOrApprover = true;
      this.isMaker = false;
    }

    this.conditionForm = this._formBuilder.group({
      condition1: new FormControl(''),
      condition1Date: new FormControl(''),
      condition1Amount: new FormControl(''),
      condition2: new FormControl(''),
      condition3: new FormControl(''),
      condition4: new FormControl(''),
      condition5: new FormControl(''),
      condition6: new FormControl(''),
      condition7: new FormControl(''),
      condition8: new FormControl(''),
      condition9: new FormControl(''),
      condition9StartDate: new FormControl(''),
      condition9EndDate: new FormControl(''),
      condition9FromtDate: new FormControl(''),
      condition9TotDate: new FormControl(''),
      condition10: new FormControl(''),
      condition10Amount: new FormControl(''),
      condition10Amount2: new FormControl(''),
      condition11: new FormControl(''),
      condition12: new FormControl(''),
      condition12Amount: new FormControl(''),
    });

  }

  // popup

  openDialog(field: any, title: any, btnlabel: any) {
    this.dialog.open(CommonDialogComponent,
      {
        panelClass: 'dialog-w-50', autoFocus: false,
        height: "auto",
        width: "30%",
        data: {
          message: title,
          field: field,
          id: 9,
          btnlabel: btnlabel
        }
      }
    );
    // this.Remark();
  }

}
