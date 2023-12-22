import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, MinLengthValidator, Validators } from '@angular/forms';

import { FormBuilder } from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CommonModalComponent } from '../common-modal/common-modal.component';

import { ApiEssService } from 'src/app/services/api-ess.service';


@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {
  @Input() EmpBankDetails: any;
  @Input() mobileNo:any;
  @Input() config: any = {};
  @Input() userAction: Array<any> = [];
  @Output() EmpData = new EventEmitter();
  @Input() personal: Subject<boolean>;
  @Input() isOtpVerified:boolean;
  bankDetails: any;
  banklist: any;
  bankBranchlist: Array<any> = [];
  // new filter
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;
  datalist: any;
  isSaveEnable = false;
  action = '';
roleid:any;
isPayManger:boolean=true;
  constructor(private apiService: ApiEssService, private formbuilder: FormBuilder, private snackbar: SnackbarService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.roleid=sessionStorage.getItem("roleId")
    this.bankDetails = this.formbuilder.group({
      bankAccountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      bankName: ['', Validators.required],
      branchName: ['', Validators.required],
    })
    this.getBank();
    if (this.userAction.length > 0) {
      this.bankDetails.disable();
    }
    this.config.isModified === true ? this.isSaveEnable = true : this.isSaveEnable = false;
    this.personal.subscribe(v => { 
      // this.onsubmit();
    });
  }
  checkAccountNo(){
    if(this.bankDetails.value.bankAccountNumber)
    {
      if(this.bankDetails.value.bankAccountNumber.length>20)
      {
        alert("Max length of Account no is 20");
        this.bankDetails.patchValue({bankAccountNumber:null})
      }
    }
  }

  ngOnChanges(changes: any) {
    if (!changes.EmpBankDetails?.firstChange) {
      const data = changes.EmpBankDetails?.currentValue;
      this.bankDetails.patchValue({ ...data });
      if (this.bankBranchlist.length === 0) {
        this.getBankBranch();
      }
      this.config.isModified === true ? this.isSaveEnable = true : this.isSaveEnable = false;
     
    }
    
    if(this.isOtpVerified)
    {
      this.isSaveEnable = true
    }
    if(this.roleid=='4' || this.roleid=='5')
    {
      this.isSaveEnable = false
    }
  }



  ifsccode() {
    this.apiService.postmdm('getBankIfsc', { ifscCode: this.bankDetails.value.ifscCode, bankId: this.bankDetails.value.bankName }).subscribe({
      next: res => {
        this.bankBranchlist = res.data
      }, error: err => {
        this.snackbar.show(err.status, 'danger')
      }
    })
  }

  modify() {
    this.bankDetails.enable();
    this.isSaveEnable = true;
  }

  getBank() {
    this.apiService.postmdm('getBank', {}).subscribe({
      next: res => {
        this.banklist = res.data
        // this.getBankBranch();

      }
    })
  }

  getBankBranch(): void {
    let requestedData = {
      bankId: this.bankDetails.value.bankName
    }
    this.apiService.postmdm('getBankBranch', requestedData).subscribe({
      next: res => {
        const data = res.data;
        this.bankBranchlist = res.data
      }
    })
  }
  verifyMobileNo(): void {
    if(this.mobileNo)
    {
    let data={
      "ssoId":"RJ121212",
      "sourceId":"1",
      "processId":"18",
      "mobileNo":this.mobileNo,
      "ipAddress":"10.1.1.1"
    }
    this.apiService.postIfms('otp/otpGenerate', data).subscribe({
      next: res => {

        console.log(res)
        this.verifyOtp(res);
       }
    })
  }
    else
    {
      alert("The Employee mobile number was not found");
    }
  }

  verifyOtp(res:any){
    const confirmDialog = this.dialog.open(CommonModalComponent, {
      autoFocus: false,
      width: '350px',
      data: {
        action: '',
        id: 'otp',
        otpData:res,
        mobileNo:this.mobileNo
      },
    });

    confirmDialog.afterClosed().subscribe(data => {
      console.log("data",data);
      
      if (data.verified === 'Y') {
        this.saveBankDetails();
      }else{
        alert("The OTP (One-Time Password) was not verified")
      }
    })
  }

  getBranchIFSC(id: number): void {
    const branchObject = this.bankBranchlist.find(x => x.bankBranchId === id);
    this.bankDetails.patchValue({
      ifscCode: branchObject.ifscCode,
    })
  }

  onsubmit() {
    if (this.bankDetails.invalid) { 
      alert("Please ensure that all fields are filled correctly and completely");
      return }
    this.verifyMobileNo();
  }

  saveBankDetails(){
    const finalData = this.bankDetails.value;
    this.apiService.postmst('bankDetail/validate', finalData).subscribe(res => {
      if (res.status == 'SUCCESS') {
        const data = { step: 5, value: finalData};
        this.EmpData.emit(data);
      }else
      {
        alert("The fields you entered are not valid. Please review the information provided and make sure all fields are correctly filled with valid data.")
      }
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
