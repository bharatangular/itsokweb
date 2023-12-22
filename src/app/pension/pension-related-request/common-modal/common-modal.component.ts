import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiEssService } from 'src/app/services/api-ess.service';



@Component({
  selector: 'app-common-modal',
  templateUrl: './common-modal.component.html',
  styleUrls: ['./common-modal.component.scss']
})
export class CommonModalComponent implements OnInit {
  otpForm: any;
  message: any;
  id: any;
  action: any;
  otpData:any;
  otp:any;
  pofficeId:any;
  mobileNo:any;
  remark:any
  roleId:any;
  receivedData: any;
  timerInterval: any;
  remainingMinutes: number = 0;
  remainingSeconds: number = 59;
  reqID: any;
  showResendButton: boolean = false; 
  currentDepartment:any;
  officeList:any;
  constructor(@Inject(MAT_DIALOG_DATA) data: any, private dialogRef: MatDialogRef<CommonModalComponent>,private apiService:ApiEssService, private formbuilder: FormBuilder,) {
    /* this.message = data.message;
    this.id = data.id; */
    console.log("data",data)
    this.id = data.id;
    this.action = data.action;
    this.otpData=data.otpData;
    this.reqID=data.otpData?.reqId
    this.mobileNo=data.mobileNo;
    this.roleId=sessionStorage.getItem("roleId");
    this.currentDepartment=data.currentDepartment
    
    this.getMaskedPhoneNo(this.mobileNo);
    if(data.currentDepartment!=null)
    {
      this.getOfficeList();

    }
  }
  
getOfficeList()
{
  let data = {
    "inMstType":22,
    "inValue":this.currentDepartment,
    "inValue2":0,
    "inValue3":""
    }
  this.apiService.postWf('allmstdata', data).subscribe({
    next: (res) => {
      
      if (res.status = 200) {
        this.officeList = JSON.parse(res.data);
        console.log("this.officeList",this.officeList)
      }
    },

  })
}
  ngOnInit(): void {
    this.otpForm = this.formbuilder.group({
      otpInput1: ['', Validators.required],
      otpInput2: ['', Validators.required],
      otpInput3: ['', Validators.required],
      otpInput4: ['', Validators.required],
      otpInput5: ['', Validators.required],
      otpInput6: ['', Validators.required],
    });
    this.startTimer();
  }
  resendClickCounter: number = 1; 
  resendOtp() {
    this.otpForm.reset();
    if (this.resendClickCounter <= 3) {
      clearInterval(this.timerInterval); // Clear the previous timer interval
      this.remainingMinutes = 0; // Reset the timer values
      this.remainingSeconds = 59;

      // this.ssoId = this.dataShareService.dataEmitted[0].ssoId;
      // this.phoneNo = this.dataShareService.dataEmitted[1].phoneNo;

      let requestData = {
        "ssoId":"RJ121212",
        "sourceId":"1",
        "processId":"18",
        "mobileNo":this.mobileNo,
        "ipAddress":"10.1.1.1"
      };

      this.apiService.postOr('otp/otpGenerate', requestData).subscribe({
        next: (res) => {
          this.receivedData = res;
          console.log('received data ==>', this.receivedData);
          this.reqID = this.receivedData.reqId;
          console.log('RequestId', this.reqID);
          const reqIdData = { reqId: this.reqID };
          // this.dataShareService.dataEmitted.splice(2, 1);
          // this.dataShareService.setData(reqIdData);

          this.resendClickCounter++; // Increment the resend button click counter

          if (this.resendClickCounter >= 3) {
            let showResendText = true;
            // Check if the maximum limit is reached
            this.showResendButton = false; // Hide the Resend OTP button
          }
        },
      });

      console.log(this.reqID);
      if (this.resendClickCounter <= 3) {
        this.showResendButton = false; // Hide the Resend OTP button during API call
        this.startTimer(); // Start the timer if the maximum limit is not reached
      }
    }
  }
  changeOffice(action:any)
  {
   
    this.dialogRef.close(this.pofficeId);
  }
  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
      } else if (this.remainingMinutes > 0) {
        this.remainingMinutes--;
        this.remainingSeconds = 59;
      } else {
        clearInterval(this.timerInterval);
        this.showResendButton = true; // Set the flag variable to true when the timer reaches 0
      }
    }, 1000);
  }
  onOtpKeyUp(event: KeyboardEvent,nextInput: HTMLInputElement | null,previousInput: HTMLInputElement | null,maxLength: number) {
    const input = event.target as HTMLInputElement;
    const key = event.key;

    if (key === 'Backspace' && previousInput) {
      // previousInput = input.previousElementSibling as HTMLInputElement;
      previousInput.focus();
      if (previousInput) {
        this.otpForm.get(previousInput).addValidators([Validators.required]);
        previousInput.value = '';
      }
    } else if (input.value.length === maxLength && nextInput) {
      nextInput.focus();
    }
  }
  submit = (action: any) => {
    let data={
      "action":action,
      "remark":this.remark
    }
    this.dialogRef.close(JSON.stringify(data));
  }
  otpChange()
  {
    if(this.otp.length!=6)
   {
    alert("Please enter a valid OTP (One-Time Password). The OTP you entered is incorrect");
    this.otp=""
   }
  }
  maskedPhoneNo: any;
  getMaskedPhoneNo(phoneNo: any) {
    console.log('PlainPhoneNo', phoneNo);
    if (phoneNo) {
      let maskedDigits = phoneNo.slice(0, -4).replace(/./g, '*');
      let lastDigits = phoneNo.slice(-4);
      this.maskedPhoneNo = maskedDigits + lastDigits;
      console.log("mobile",this.maskedPhoneNo);
      return this.maskedPhoneNo;
      
    } else {
      return '';
    }
  }
  checkOtp(action:any)
  {
    let env="T"
    let url=window.location.origin
    if(url.includes("dev") || url.includes("test"))
    {
     env="T"
    }else
    {
     env="P"
    }
    this.otp=this.otpForm.value.otpInput1+
    this.otpForm.value.otpInput2+
    this.otpForm.value.otpInput3+
    this.otpForm.value.otpInput4+
    this.otpForm.value.otpInput5+
    this.otpForm.value.otpInput6
    console.log("otp",this.otp)
    let data={
      "ssoId":"RJ121212",
      "sourceId":"1",
      "processId":"18",
      "mobileNo":this.mobileNo,
      "reqId":this.reqID,
      "otpCode":this.otp,
      "otpEnv":env
    }
    console.log("data",data);
    this.apiService.postIfms('otp/otpVerify', data).subscribe({
      next: res => {

        console.log(res)
        this.dialogRef.close(res);
       }
    })
  }
}