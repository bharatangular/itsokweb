import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { RedirectService } from 'src/app/services/redirect.service';

@Component({
  selector: 'app-revised-auto-approved-dialog',
  templateUrl: './revised-auto-approved-dialog.component.html',
  styleUrls: ['./revised-auto-approved-dialog.component.scss']
})
export class RevisedAutoApprovedDialogComponent implements OnInit {
  jointImageUrl:any;
  imageUrl:any
  userDetails: any = {
    "role": "",
    "roleid": "",
    "assignmentid": "",
    "officeid": "",
    "treasCode": "",
    "treasName": ""
  }; 
  Pension_Commutation: any={
    "monthlyPensionTreasury":""
  };
  dor:any;
  constructor(public redirectService:RedirectService,public router:Router,private formbuilder: FormBuilder, public _Service:PensionServiceService,@Inject(MAT_DIALOG_DATA) public data: {message: any},public load:LoaderService,private dialog:MatDialog,private dialogRef: MatDialogRef<RevisedAutoApprovedDialogComponent>) { }
  config: AppConfig = new AppConfig();
  comDate1:any;
  comPercent:any;
  selfPic:any
  jointPic:any
  otpVerify:boolean=false;
  otpForm: any;
  recoveryFormNew!: FormGroup;
recoveryArray:any[]=[];
  ngOnInit(): void {
    this._Service.configMenu = { url: "Inbox > Auto Approve Pensioner" };
    this.userDetails = this.config.getUserDetails();
    console.log(this.data)
    this.dor=new Date(this.data.message.dor)
    console.log(this.dor)
    // this.load.show()
   
    this.selfPic=this.data.message.item?.singlePhoto;
    if(this.selfPic)
    this.showPic(this.selfPic,1);
   
    this.jointPic=this.data.message.item?.jointPhoto;
    if(this.jointPic)
    this.showPic(this.jointPic,2);
    this.comDate1=this.data.message.item?.commutDate;
    
    this.comPercent=this.data.message.item?.comPercent;
    this.comFlag= this.data.message.item?.commutFlag;
    this.fetchPersonaldetail();
    this.fetchServicesdetail();
    this.fetchAddressesEmp();
    this.getFamilyDetails();
    this.getNomination();
    this.Bank_Detail();
    this.fetchpersonalEmp();
    this.getAllUploadedDocumentDetailsByEmployeeCode();
    this.get_Service_Records();
    this.getDeType();
    this.getTreasury();
   this. getPaymentDetails();
    setTimeout(()=>{      
      this.getLRnumber();     
      this.recoveryArray=this.data.message.item?.recovery?this.data.message.item?.recovery:[];
      
      this.commutationDateCalculation();     
      if(this.data.message.item?.deStatus=="1")
      {
        console.log("remark",this.data.message.item)
        this.serviceRecordDatanew.deStatus=this.data.message.item.deStatus;
        this.serviceRecordDatanew.deType=Number(this.data.message.item.deType);
        this.remark=this.data.message.item?.remark?this.data.message.item.remark:"";
        this.docId=this.data.message.item?.dmsDocId?this.data.message.item.dmsDocId:"";
        
      }else
      {
        this.serviceRecordDatanew.deStatus=this.data.message.item.deStatus;
      }
    
    },1500)
    this.otpForm = this.formbuilder.group({
      otpInput1: ['', Validators.required],
      otpInput2: ['', Validators.required],
      otpInput3: ['', Validators.required],
      otpInput4: ['', Validators.required],
      otpInput5: ['', Validators.required],
      otpInput6: ['', Validators.required],
    });
    if(this.userDetails.roleid=='6')
    {
      this.getloginuserMobile();
      this.isverify=true;
    }
    this.recoveryFormNew = this.formbuilder.group({
      recoveryType: new FormControl('', Validators.required),
      recoveryAmount: new FormControl('', Validators.required),
      recoveryHead: new FormControl('', Validators.required),

    });
  
  }
  payCalDetails:any
  getPaymentDetails(){
   
    var data = {
     
      "pensionerId": this.data.message.item?.pensionerId,
     
    };
    this._Service.postPssRequest(data,'getppodetails').subscribe((res: any) => {
      console.log("result>>>", res);
      this.payCalDetails=res.data[0];    
        console.log(this.payCalDetails)  
     })   
  }
  mobileNo:any;
  otpRes:any;
  showOtpdialog:boolean=false
  verifyMobileNo(): void {
  
   
    if(this.mobileNo)
    {
      this.getMaskedPhoneNo(this.mobileNo.toString());
      let data={
        "ssoId":"RJ121212",
        "sourceId":"1",
        "processId":"18",
        "mobileNo":this.mobileNo.toString(),
        "ipAddress":"10.1.1.1"
      }
      this._Service.postOr('otp/otpGenerate', data).subscribe((res:any)=>{
        
          this.otpRes=res
          console.log(res)
          this.showOtpdialog=true;
         
      },(error)=>{
        alert("Error in send otp");
      })
    }else
    {
      alert("Employee Mobile no not found");
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
  otp:any
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
      "reqId":this.otpRes.reqId,
      "otpCode":this.otp,
      "otpEnv":env
    }
    console.log("data",data);
    this._Service.postOr('otp/otpVerify', data).subscribe((res:any)=>{
     

        console.log(res)
       if(res.verified=='Y')
       {
        this.makerequestINI();
       }else
       {
        alert(res.errMsg)
       }
       
    },(error)=>{
      alert("OTP service have error")
    }
    )
  }
  jointUrl:any
  showPic = (id: any,i:any) => {
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
      console.log("res", res.data.document[0].content);
      if (res.data.document[0].content) {
        if(i==1)
        this.imageUrl = "data:image/jpeg;base64," + res.data.document[0].content;
        else if(i==2)
        this.jointUrl = "data:image/jpeg;base64," + res.data.document[0].content;
      }
    })
  }
  Personaldetail:any
  ServiceDetails:any
  dateofRetirement:any;
  fetchPersonaldetail() {
    let data = {
      employeeId: this.data.message.employeeId
    }
    this._Service.postRequestpension(data, 'getPersonaldetailsByEmpCode').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.Personaldetail = res.data[0];
          this.Personaldetail = JSON.parse(JSON.stringify(this.Personaldetail).replace(/\:null/gi, "\:\"\""));
        
         
          this.dateofRetirement = this.Personaldetail.dor;
         
          this.Personaldetail.comDate=this.comDate1
          console.log("date",this.Personaldetail)
         
         
        }
      },
      error: (err) => {
      
     
      }

    });
    console.log("Personal details", this.Personaldetail);
  }
  optForCommutation:any;
  commuationPercentage:any;
  comDate:any;
  deTypeChange()
  {
   
   
      this.comDate1='';
      this.comPercent=0;
      this.comFlag= 'N';
      this.commutationDateCalculation();
    
  }
  getEmployeeStatus()
  {
  
    let data={
      "inMonth":this.dor.getMonth()+1,
      "inYear":this.dor.getFullYear(),
      "inEmpId":this.data.message.employeeId
    }
    // let data={"inMonth":7,"inYear":2023,"inEmpId":2697733}
    this._Service.postCumm('getstatusofpensionatess',data).subscribe({
      next: (res:any) => {
        console.log("emp",res)
        if(res.data.psnInfo!=='no data found')
        {
         if(res.data.empInfo[0].reqId>0)
         {
           this.requestIdE=Number(res.data.empInfo[0].reqId);
           this.getEmpJsonByReqId()
         }
        }
      },
      error: (err) => {
      
     
      }

    });
  }
  getEmpJsonByReqId()
  {
    this._Service.postEmployee("getEssJsonByRequestId",{"requestId":this.requestIdE}).subscribe((res:any)=>
    {
      if(res.data)
      {
        console.log("empJson1",res.data.employeePersonalDetail.employeePhoto);
        let data:any=res.data.employeePersonalDetail.documentList;
        let jointpic=data.filter((x:any)=>x.docTypeId==32)[0].dmsDocumentId
        console.log("empJson2",jointpic);
        this.Personaldetail.selfPhotoId=res.data.employeePersonalDetail.employeePhoto;
        this.Personaldetail.jointPhotoId=jointpic;
      }
    
    })
  }
  requestIdP:any=0
  requestIdE:any=0
  getPensionStatus()
  {

    let data={
      "inMonth":this.dor.getMonth()+1,
      "inYear":this.dor.getFullYear(),
      "inEmpId":this.data.message.employeeId
    }

    // let data={"inMonth":7,"inYear":2023,"inEmpId":2697733}
    console.log("data12",data)

    this._Service.add_Reason(data, 'getstatusofpension').subscribe({
      next: (res) => {
       console.log("pension",res.data)
       if(res.data.psnInfo!=="no data found")
       {
        if(res.data.psnInfo[0].requestId>0)
        {
          this.requestIdP=Number(res.data.psnInfo[0].requestId);
          
          this.getPensionJsonByReqId()
        }
       }else
       {
        
       }
      },
      error: (err) => {
      }

    });
  }
  payload:any;
  isrequest:boolean=false
  getPensionJsonByReqId()
  {
this._Service.postho('getPensionJsonByRequestId',{"requestId":this.requestIdP}).subscribe((res:any)=>{
  console.log("pension Json",res.data);
  if(res.data)
  {
    this.payload=res.data;
    this.isrequest=true;
    this.Personaldetail=this.payload.personalDetails;
    this.Pension_Commutation=this.payload.calculationsPensionDetails;
    this.Calculations_Pay_Details=this.payload.calculationsPayDetails;
    this.EMPAddress=this.payload.addressDetails;
  }
 
})
  }
  fetchServicesdetail() {

    let data = {
      employeeId: this.data.message.employeeId
    }
    this._Service.postRequestpension(data, 'getServicedetailsByEmpCode').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.ServiceDetails = res.data;
          this.getBudgetDetails(this.ServiceDetails);
          this.ServiceDetails = JSON.parse(JSON.stringify(this.ServiceDetails).replace(/\:null/gi, "\:\"\""));
          console.log("ServiceDetails", this.ServiceDetails);
          this.ServiceDetails.optForCommutation=this.comFlag=='Y'?"Yes":'No';
          this.ServiceDetails.commuationPercentage=this.comPercent;
        }

      },
      error: (err) => {
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
        //   this.showerror=true;
        //  alert(this.error)
      }
    });


  }
  BudgetDetails:any
  getBudgetDetails(ser: any) {
    console.log("this.ServiceDetails", ser);
    this.BudgetDetails = [
    ]
    
    let data =
    {
      "pensionCode":  "68",
      "srvcCatId": ser.serviceCatId
    }
    console.log("getBudgetDetails", data);
    this._Service.postdeduction(data, 'getPensionBudgetHead').subscribe({
      next: (res) => {
        console.log("BudgetDetails", res.data.psnBdgtHeadMapData);

        this.BudgetDetails = res.data.psnBdgtHeadMapData;
      
        //  this.generalBudHead=this.BudgetDetails.filter((x: any) => x.psbBdgtHeadTypName == "General";
      },
      error: (err) => {

     

      },
    });
  
  }
  verifyChange()
  {
    console.log(this.isverify)
  }
  isverify:boolean=false
  isCalculate:boolean=true
  calculateOn()
  {
    this.isCalculate=true
  }
  EMPAddress:any
  fetchAddressesEmp() {

   
    let data = {
      employeeId: this.data.message.employeeId
    };
    this._Service.postRequestpension(data, 'getAddressDetailsByEmployeeId').subscribe({
      next: (res) => {

        this.EMPAddress = res.data;
        this.EMPAddress = JSON.parse(JSON.stringify(this.EMPAddress).replace(/\:null/gi, "\:\"\""));
       
        
      },
      error: (err) => {


       
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
        //   this.showerror=true;setD
        //  alert(this.error)
      },
    });
  }
  nominee:any
  getNomination() {
    let data = {
      "employeeId": this.data.message.employeeId
    }
    this._Service.postRequestpension(data, 'getSchemeNomineeDetails').subscribe({
      next: (response) => {
        if (response.status = 200) {
          this.nominee = response.data;
          this.nominee = JSON.parse(JSON.stringify(this.nominee).replace(/\:null/gi, "\:\"\""));
         
          
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
  familyDetails:any
  getFamilyDetails() {
    let data = {
      "employeeId": this.data.message.employeeId
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
  Banklist:any
  Bank_Detail() {
    let data = {
      "employeeId": this.data.message.employeeId
    }
    this._Service.postRequestpension(data, "getBankdetailsByEmpCode").subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.Banklist = res.data[0];
          this.Banklist = JSON.parse(JSON.stringify(this.Banklist).replace(/\:null/gi, "\:\"\""));
          // localStorage.setItem('bank-details', JSON.stringify(res.data[0]))
        
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
  Calculations_Pay_Details:any
  fetchpersonalEmp() {
    let data = {
      "employeeId": this.data.message.employeeId
    }
    this._Service.postRequestpension(data, 'getEmployeePayDetails').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
         
          this.Calculations_Pay_Details = res.data;
          this.Calculations_Pay_Details = JSON.parse(JSON.stringify(this.Calculations_Pay_Details).replace(/\:null/gi, "\:\"\""));
       
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
  comFlag:any;
  deChange()
  {

   if(this.serviceRecordDatanew.deStatus=='0')
   {
    
    this.serviceRecordDatanew.deType='';
    this.comFlag= this.data.message.item?.commutFlag;
    this.comDate1=this.data.message.item?.commutDate;
    this.comPercent=this.data.message.item?.comPercent;
    this.commutationDateCalculation();
   }else
   {
    this.comDate1='';
    this.comPercent=0;
    this.comFlag= 'N';
    this.serviceRecordDatanew.deType='';
    this.commutationDateCalculation();
   }
   
  }
  documentlist: any[] = []
  getAllUploadedDocumentDetailsByEmployeeCode() {
    let data = {
      "subModuleId": 4,
      "processId": 1,
      "employeeId": this.data.message.employeeId
    }
    this._Service.postRequestpension(data, 'getDocsDtlsBySubId').subscribe((res) => {
      if (res.status = 200) {
        let rajIndex = 0;
        this.documentlist = res.data;
      
        console.log("documentlist 0", this.documentlist);

        let data = {
          "dmsDocId": null,
          "docName": "FR",
          "docTypeId": 36
        }
        let data1 = {
          "dmsDocId": null,
          "docName": "Pension Kit Summary",
          "docTypeId": 261
        }
        this.documentlist.push(data);
        this.documentlist.push(data1);
        // console.log("documentlist",res.data);
      }
    })

  }
  serviceRecordDatanew:any={

    "totalServiceLength": "",
    "deStatus": '2',
    "deType": '',
    "deStartDate": '',
    "deEndDate": '',
    "penalty": '',
    "penaltyType": '',
    "remark": '',
    "id": 1,
    "totalNoOfDays": "",

    "nonQualifyingServiceDate_p": '',
    "serviceRecordDetails": [
    ]
  };
  serviceRecord:any
  get_Service_Records() {

    let data =
    {
      "employeeId": this.data.message.employeeId
    }

    this._Service.postRequestpension(data, 'getOtherServiceDetailsByEmployeeId').subscribe({
      next: (response) => {
        if (response.status = "SUCCESS") {
          this.serviceRecord = response.data;

          let data = {

            "totalServiceLength": this.serviceRecord.totalServiceDuration,
            "deStatus": '0',
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
  monthlyPensionTreasury:any
  MonthlyPensionTreasury(i:any)
  {
    this.Pension_Commutation.monthlyPensionTreasury=i
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
  isCommutation:boolean=false
  advancedLoan:any[]=[]

  Calculations_Commutation_Details:any={
    "budgetHead": "",
    "budgetHeadId": "",
    "effectiveDate": "",
    "commutationAmount": "",
    "commutationFactor": "",
    "commutationValue": "",
  };
  commutationChange()  
  {   
    if (this.comFlag=='N') {
      this.Calculations_Commutation_Details = {
        "budgetHead": "",
        "budgetHeadId": "",
        "effectiveDate": "",
        "commutationAmount": "",
        "commutationFactor": "",
        "commutationValue": "",
      }
      this.Pension_Commutation.commutedFactor = "";
      this.Pension_Commutation.commutationAmount = "";
      this.Pension_Commutation.commutationValue = "";
    } 
    if(this.comFlag=='Y') {
      this.Calculations_Commutation_Details = {
        "budgetHead": this.getBudHead('Commutation'),
        "budgetHeadId": this.getBudHeadId('Commutation'),
        "effectiveDate":this.Pension_Commutation2.commutationEffectiveDate,
        "commutationAmount": this.Pension_Commutation2.commutationAmount,
        "commutationFactor": this.Pension_Commutation2.commutedFactor,
        "commutationValue": this.Pension_Commutation2.commutationValue,
      }
      console.log("this.Calculations_Commutation_Details",this.Calculations_Commutation_Details);
      
    }
  }
  iscalculate:boolean=false
buttonClick()
{
  this.iscalculate=true;
}
  lRnumber: any = '';
  getLRnumber() {
    let data={
      "inTreasCode":this.data.message.traseCode,
      "inEmpId":this.Personaldetail.employeeId,
      "inRevised":"0"
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
  
  treasurylist:any;
  getTreasury() {

    let data ={
      "attrValue":2
    }

    this._Service.postloantype(data, "getpensiontreasury").subscribe({
      next: (res) => {
        if (res.status = 200) {
        
this.treasurylist=res.data
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
  makerequestINI()
  {
    this.isverify=false
    let submitdata:any;
    // if(Number(this.Calculations_Pay_Details.payCommissionId)<=5)
    // {
    //   alert("Your Pay Commission Id is equal or less than 5.")
    // }
   
      let payload_summary = {
        "empName": this.Personaldetail.nameEn,
        "emp_Id": this.Personaldetail.employeeId,
        "empCode": this.Personaldetail.employeeCode
      }
      this.Calculations_Pay_Details['mainBudgetHead'] = this.getBudHead("General");
      this.Calculations_Pay_Details['gratuityBudgetHead'] = this.getBudHead("Gratuity");
      this.Calculations_Pay_Details['mainBudgetHeadId'] = this.getBudHeadId("General");
      this.Calculations_Pay_Details['gratuityBudgetHeadId'] = this.getBudHeadId("Gratuity");
      this.Calculations_Pay_Details['pensionType'] = this.BudgetDetails?.length > 1 ? this.BudgetDetails[0].pensionType : "";
      this.Calculations_Pay_Details['pensionTypeCode'] = this.BudgetDetails?.length > 1 ? this.BudgetDetails[0].pensionCode : "";
    if(this.data.message.traseCode=='' || this.data.message.traseCode=='0' || this.data.message.traseCode==null || this.data.message.traseCode==undefined)
    {
        alert("Treasury Code is not proper.")
        return;     
    }
    this.Banklist['treasuryCode'] = this.data.message.traseCode;
    // this.Banklist['treasuryName'] = this.data.message.
    if(this.lRnumber=='0' || this.lRnumber==null || this.lRnumber==undefined || this.lRnumber=='')
    {
      alert("LR no not generated.")
      return;
    }
    this.Personaldetail['lrNo'] = this.lRnumber?this.lRnumber:"";
   
      let selfPic={
        "dmsDocId":this.selfPic,
        "docName":"Self Photograph",
        "docTypeId":33
      }
     
      let rec:any;
      if(this.recoveryArray.length>0)
      {
         rec={
          addDynamicElement:this.recoveryArray,
          addAllowanceType: [],
          addDeduction: [],
          addWithHeld: []
        }
      }
      console.log("rec",rec);
      this.documentlist.push(selfPic)
    
    
    let jointPic={
      "dmsDocId":this.jointPic,
      "docName":"Joint Photograph",
      "docTypeId":32
    }
    this.documentlist.push(jointPic)
    submitdata = {
      "requestData": {
        "processId": "1",
        "taskSeq": "",
        "processTaskSeq": "",
        "taskTranId":  "",
        "requestId":  "",
        "requestDesc": "",
        "initiator": this.userDetails.assignmentid,
        "person_name":  "",
        "action": "RVSARV",
        "remarks": "REVISED AUTO APPROVED",
        "payloadChangeFlag": "Y",
        "pensionerId":this.data.message.item.pensionerId,
        "adApproveFlag": "",
        "officeId":this.data.message.officeId
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
        "calculationsAdditionalAllowanceRecovery": [],
        "calculationsPensionDetails": this.Pension_Commutation ? this.Pension_Commutation : "",
        "calculationsCommutationDetailsNomination": this.Calculations_Commutation_Details ? this.Calculations_Commutation_Details : "",
        "bankTreasuryDetails": this.Banklist ? this.Banklist : "",
        "documents": this.documentlist ? this.documentlist : "",
        "conditionList": "",
        "employeeId": this.Personaldetail.employeeId,
        "employeeCode": this.Personaldetail.employeeCode,
        "createdByAid": this.data.message.employeeId,
        "createdByUserId": this.data.message.employeeId,
        "payeeId": this.Personaldetail.payeeId ? this.Personaldetail.payeeId : "",
        "ObjectionArray":"",
        "CalculationPayload": this.CalculationPayload
      }
      ,
      "payloadSummary": payload_summary ? payload_summary : "",

    }

     
    console.log(submitdata);

//     this._Service.requestApplication(submitdata, 'action').subscribe({
//       next: (res) => {
//         console.log(res)
//         this.load.show();
//        if(res.response)
//        {
//         this.UpdateFlag(3);
//        }
//        let purl: string = this.router['location']._platformLocation.location.origin;
//        let url2: string = this.router.url;
//        let mainUrl = purl + "/pension/#" + "/pension/revisedAutoApprove";
//        console.log("enter");
//     //    let sendData={
//     //     "employeeId":this.Personaldetail.employeeId,
//     //     "lrNumber":this.lRnumber
//     //   }
//     // this._Service.postUpcomingpension(sendData,"updateLrNumber").subscribe((res:any)=>{
//     //   console.log("update LR no",res)
//     // })
//     let sendata={	 
//       "inMstType": 2,
//       "requestData": [
//     {
//               "employeeId": -1,
//               "employeeCode":this.Personaldetail.employeeCode,
//               "lrNumver": this.lRnumber
//     }
// ] 
// }

// this._Service.postUpcomingpension(sendata,"essWorkMultiTask").subscribe((res:any)=>{

// },(error)=>{
// alert("update LR service not work.")
// })
//       let time1=new Date();
//     let PKdoc="PKdoc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf" 
//        let pkEsignData = {
//          "reportPath": res.response.reportPathPK,
//          "name": "pensioner_id",
//          "value": res.response.pensionerId,
//          "docTypeId": "34",
//          "docName": PKdoc,
//          "processId": "0",
//          "mainurl": mainUrl,
//          "requestId": "0"
//        }
//        console.log("pkEsignData",pkEsignData)
//        this.config.storeDetails('pensionerId',res.response.pensionerId)
//        this.esignRequest(pkEsignData)
//         // this.pdfpreviewFR(res.response)
//         // setTimeout(()=>{
//         //   this.pdfpreviewpk(res.response)
//         // },5000)
//         // setTimeout(()=>{
//         //   this.pdfpreviewSS(res.response)
//         // },10000)
//       },
//       error: (err) => {
//         alert("Some error occurred.")
//         this.load.hide();
//       },
//     });
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
  //  multiEsign(data:any)
  // {
  //   let time1=new Date();
  //   let PKdoc="PKdoc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf" 
  //   let PKSdoc="PKSdoc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf" 
  //   let PPOdoc="PPOdoc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf" 
  //   let GPOdoc="GPOdoc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf" 
  //   let CPOdoc="CPOdoc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf" 
  //   let data2=[
  //     {
  //         "reportPath": "/Pension/Pension_Kit/Report/PENSION_KIT_RPT.xdo",
  //         "name": "pensioner_id",
  //         "value": data.pensionerId,
  //         "sourceId": 3,
  //         "processName": "PENSION_AUTO_PROCESS",
  //         "identifier": 2,
  //         "identifierType": "DDO",
  //         "signName": "Addl Director Pension Pensioners Welfare.",
  //         "reason": "Approved",
  //         "location": "Jaipur",
  //         "searchText": "¥",
  //         "docName": PKdoc,
  //         "docTypeId": "34",
  //         "docId": 0
  //     },
  //     {
  //         "reportPath": "/Pension/Pension_Kit/Report/PENSION_KIT_SUMMARY.xdo",
  //         "name": "pensioner_id",
  //         "value": data.pensionerId,
  //         "sourceId": 3,
  //         "processName": "PENSION_AUTO_PROCESS",
  //         "identifier": 2,
  //         "identifierType": "DDO",
  //         "signName": "Addl Director Pension Pensioners Welfare.",
  //         "reason": "Approved",
  //         "location": "Jaipur",
  //         "searchText": "¥",
  //         "docName": PKSdoc,
  //         "docTypeId": "261",
  //         "docId": 0
  //     },
  //     {
  //       "reportPath": "/Pension/Pension_Kit/Report/PENSION_PPO.xdo",
  //       "name": "pensioner_id",
  //       "value": data.pensionerId,
  //       "sourceId": 3,
  //       "processName": "PENSION_AUTO_PROCESS",
  //       "identifier": 2,
  //       "identifierType": "DDO",
  //       "signName": "Addl Director Pension Pensioners Welfare.",
  //       "reason": "Approved",
  //       "location": "Jaipur",
  //       "searchText": "¥",
  //       "docName": PPOdoc,
  //       "docTypeId": "51",
  //       "docId": 0
  //   },
  //   {
  //     "reportPath": "/Pension/Pension_Kit/Report/PENSION_CPO.xdo",
  //     "name": "pensioner_id",
  //     "value": data.pensionerId,
  //     "sourceId": 3,
  //     "processName": "PENSION_AUTO_PROCESS",
  //     "identifier": 2,
  //     "identifierType": "DDO",
  //     "signName": "Addl Director Pension Pensioners Welfare.",
  //     "reason": "Approved",
  //     "location": "Jaipur",
  //     "searchText": "¥",
  //     "docName": CPOdoc,
  //     "docTypeId": "52",
  //     "docId": 0
  // },
  //   {
  //     "reportPath": "/Pension/Pension_Kit/Report/PENSION_GPO.xdo",
  //     "name": "pensioner_id",
  //     "value": data.pensionerId,
  //     "sourceId": 3,
  //     "processName": "PENSION_AUTO_PROCESS",
  //     "identifier": 2,
  //     "identifierType": "DDO",
  //     "signName": "Addl Director Pension Pensioners Welfare.",
  //     "reason": "Approved",
  //     "location": "Jaipur",
  //     "searchText": "¥",
  //     "docName": GPOdoc,
  //     "docTypeId": "53",
  //     "docId": 0
  // }
  // ]
  // console.log("data",data2);
  // this._Service.postOr("wcc/withOutOTPEsignMulti",data2).subscribe((res:any)=>{
  //   console.log("res",res)
  //   if(res.data.length>0)
  //   {
  //     let docIdData:any[]=[];
  //     res.data.forEach((element:any)=>{
  //       if (element.status=='success')
  //       {
  //         docIdData.push(element);
  //       }
  //     })
  //     let docData={
  //       'jsonData':docIdData
  //     }
  //     this._Service.getPensionerDetail(docData,"updateMultiDoc").subscribe((res:any)=>
  //     {this.load.hide();
  //        this.dialogRef.close({ data: "Y" });
  //       // alert(res.data);
  //     },(error)=>{
  //       this.load.hide();
  //       alert("error in Update doc service Service.")
       
  //     })
  //   }
  // },(error)=>{
  //   alert("error in Multi Esign Service.")
  // })
  // }
  docIdSS:any
//   pdfpreviewFR(data2: any) {
//     console.log("preview", data2);

//     let data = {
//       "reportPath": data2.reportPathFR,
//       "format": "pdf",
//       "params": [
//         {
//           "name": "task_data_id",
//           "value": data2.taskDataIdFR
//         }
//       ]
//     }
//     console.log("single report data", data)
//     this._Service.postOr("report/singlereport", data).subscribe((res: any) => {
//       console.log("res", res.data.report.content);
//       if (res.data.report.content) {
//         const byteArray = new Uint8Array(
//           atob(res.data.report.content)
//             .split("")
//             .map(char => char.charCodeAt(0))
//         );
//         // this.pdfSrc = "";
//         const file = new Blob([byteArray], { type: "application/pdf" });
//         const fileURL = URL.createObjectURL(file);
//         // this.pdfSrc = fileURL;
//         // const pdfWindow = window.open("");
//         // pdfWindow!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");
//         this.directEsign(data2)
// // this.pdfpreviewpk(data2)
//       }

//     })
//   }
  // directEsign(data2:any)
  // {
  //   let data={
  // "reportPath": data2.reportPathFR,
  // "name":"task_data_id",
  // "value":data2.taskDataIdFR,
  // "sourceId":3,
  // "processName":"PENSION_AUTO_PROCESS",
  // "identifier":2,
  // "identifierType":"DDO",
  // "signName":"Addl Director Pension Pensioners Welfare.",
  // "reason":"Approved",
  // "location":"Jaipur",
  // "searchText":"¥",
  // "docName":data2.docNameFR,
  // "docTypeId":"36",
  // "docId":0
  //   }
  //   this._Service.postNewEsign("withOutOTPEsign", data).subscribe((res: any) => {
  //     res=JSON.parse(res)
  //     console.log(res)
  //   // console.log(res.data.document[0].docId);
  //   if(res.status=='success')
  //   {
  //     let data1=JSON.parse(res.data)
  //     console.log(data1)
  //     this.docIdFR=data1.DocId;
  //       this. updateDocId(36,data1.DocId,data2,1)
      
  //   }
    
    
  //   })
  // }
  // pdfpreviewpk(data2: any) {
  //   console.log("preview", data2);

  //   let data = {
  //     "reportPath": data2.reportPathPK,
  //     "format": "pdf",
  //     "params": [
  //       {
  //         "name": "pensioner_id",
  //         "value": data2.pensionerId
  //       }
  //     ]
  //   }
  //   console.log("single report data", data)
  //   this._Service.postOr("report/singlereport", data).subscribe((res: any) => {
  //     // console.log("res", res.data.report.content);
  //     if (res.data.report.content) {
  //       const byteArray = new Uint8Array(
  //         atob(res.data.report.content)
  //           .split("")
  //           .map(char => char.charCodeAt(0))
  //       );
  //       // this.pdfSrc = "";
  //       const file = new Blob([byteArray], { type: "application/pdf" });
  //       const fileURL = URL.createObjectURL(file);
  //       // this.pdfSrc = fileURL;
  //       // const pdfWindow1 = window.open("");
  //       // pdfWindow1!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");
  //         this.directEsignPK(data2)
  //     }
      
  //   })
  // }
  // directEsignPK(data2:any)
  // {
  //   let data={
  // "reportPath": data2.reportPathPK,
  // "name":"pensioner_id",
  // "value":data2.pensionerId,
  // "sourceId":3,
  // "processName":"PENSION_AUTO_PROCESS",
  // "identifier":2,
  // "identifierType":"DDO",
  // "signName":"Addl Director Pension Pensioners Welfare.",
  // "reason":"Approved",
  // "location":"Jaipur",
  // "searchText":"¥",
  // "docName":data2.docNamePK,
  // "docTypeId":"34",
  // "docId":0
  //   }
  //   this._Service.postNewEsign("withOutOTPEsign", data).subscribe((res: any) => {
  
  //   res=JSON.parse(res)
    
  // console.log(res)
  //   if(res.status=='success')
  //   {
  //     let data1=JSON.parse(res.data)
  //     console.log(data1)
  //     this.docIdPS=data1.DocId;
  //       this. updateDocId(34,data1.DocId,data2,2)
      
  //   }
  //   })
  // }
  // pdfpreviewSS(data2: any) {
  //   console.log("preview", data2);

  //   let data = {
  //     "reportPath": data2.reportPathPK,
  //     "format": "pdf",
  //     "params": [
  //       {
  //         "name": "pensioner_id",
  //         "value": data2.pensionerId
  //       }
  //     ]
  //   }
  //   console.log("single report data", data)
  //   this._Service.postOr("report/singlereport", data).subscribe((res: any) => {
  //     // console.log("res", res.data.report.content);
  //     if (res.data.report.content) {
  //       const byteArray = new Uint8Array(
  //         atob(res.data.report.content)
  //           .split("")
  //           .map(char => char.charCodeAt(0))
  //       );
  //       // this.pdfSrc = "";
  //       const file = new Blob([byteArray], { type: "application/pdf" });
  //       const fileURL = URL.createObjectURL(file);
  //       // this.pdfSrc = fileURL;
  //       // const pdfWindow1 = window.open("");
  //       // pdfWindow1!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");
  //         this.directEsignSS(data2)
  //     }
      
  //   })
  // }
  // directEsignSS(data2:any)
  // {
  //   let data={
  // "reportPath": data2.reportPathPKS,
  // "name":"pensioner_id",
  // "value":data2.pensionerId,
  // "sourceId":3,
  // "processName":"PENSION_AUTO_PROCESS",
  // "identifier":2,
  // "identifierType":"DDO",
  // "signName":"Addl Director Pension Pensioners Welfare.",
  // "reason":"Approved",
  // "location":"Jaipur",
  // "searchText":"¥",
  // "docName":data2.docNamePKS,
  // "docTypeId":"261",
  // "docId":0
  //   }
  //   this._Service.postNewEsign("withOutOTPEsign", data).subscribe((res: any) => {
  
  //   res=JSON.parse(res)
    
  // console.log(res)
  //   if(res.status=='success')
  //   {
  //     let data1=JSON.parse(res.data)
  //     console.log(data1)
  //     this.docIdSS=data1.DocId;
  //       this. updateDocId(261,data1.DocId,data2,3)
      
  //   }
  //   })
  // }
  // updateDocId(docTypeId: any,docId:any,data2:any,i:any) {
    
  //   let data = {
  //     "dmsDocId": docId,
  //     "pensionerId": data2.pensionerId,
  //     "docTypeId": docTypeId
  //   }
  //   this._Service.postPssRequest(data, "pensionerdocument").subscribe({
  //     next: (res) => {
  //       //console.log("res", res);
  //       if(i==3)
  //       {
  //         this.load.hide();
          
  //         setTimeout(() => {
  //           this.dialogRef.close({ data: "Y" });
  //         }, 500);
        
  //         // this.dialog.closeAll();
  //       }
  //       if (res.status == "SUCCESS") {
  //       } else {
  //         // alert("Something went wrong");
  //       }
  //     },
  //     error: (err) => {
  //       // alert("Something went wrong");
  //       let errorObj = {
  //         message: err.message,
  //         err: err,
  //         response: err
  //       }
  //     }
  //   })
  // }
  CommutationValue:any
 
  numberValidation() {
    if(this.ServiceDetails.commuationPercentage<0)
    {
      this.ServiceDetails.commuationPercentage=0;
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

        dates.setDate(dates.getDate() + 1);
        console.log("dates", dates);
        this.commutationDateCalculation();
      }

    } else if (this.ServiceDetails.serviceCatId === 13 || (this.ServiceDetails.serviceCatId === 7 && this.ServiceDetails.serviceSubcatId === 108)) {
      if (this.ServiceDetails.commuationPercentage > 50) {
        this.ServiceDetails.commuationPercentage = 0;
        alert("Enter value under 50");
      } else {
        let dates = new Date(this.dateofRetirement)
        console.log("dates", dates);

        dates.setDate(dates.getDate() + 1);
        console.log("dates", dates);
        this.commutationDateCalculation();
      }

    } else {
      if (this.ServiceDetails.commuationPercentage > 33.33) {
        this.ServiceDetails.commuationPercentage = 0;
        alert("Enter value under 33.33");
      } else {
        let dates = new Date(this.dateofRetirement)
        console.log("dates", dates);

        dates.setDate(dates.getDate() + 1);
        console.log("dates", dates);
        this.commutationDateCalculation();
      }
    }


  }
  deChange1()
  {
this.isCalculate=false
  }
  value() {
    this.isCalculate=false;
    console.log("Commutation value is here>>>", this.ServiceDetails.optForCommutation)
    if (this.ServiceDetails.optForCommutation == 'Yes') {
      this.isCommutation = true;
   
     
      if (this.ServiceDetails.serviceCatId === 1) {
        this.ServiceDetails.commuationPercentage = 40;
      } else if (this.ServiceDetails.serviceCatId === 13 || (this.ServiceDetails.serviceCatId === 7 && this.ServiceDetails.serviceSubcatId === 108)) {
        this.ServiceDetails.commuationPercentage = 50;
      } else {
        this.ServiceDetails.commuationPercentage = 33.33;

      }
      let date11:any
      if(this.Personaldetail?.comDate==null || this.Personaldetail?.comDate=="")
      {
       let dates = new Date(this.dateofRetirement)
      console.log("dates", dates);
  
      dates.setDate(dates.getDate() + 1);
      console.log("dates", dates);
      date11=moment(dates).format("DD-MM-YYYY")
      this.Personaldetail.comDate=date11
      }
      this.commutationDateCalculation();

    } else if (this.ServiceDetails.optForCommutation == 'No') {
      this.isCommutation = false;
      this.ServiceDetails.commuationPercentage = "0";
      this.Personaldetail.comDate=""
      this.commutationDateCalculation();
    }

  }
  Pension_Commutation2:any
  commutationDateCalculation() {

    let totalRecoveryAmt:any=0;
  
if(this.recoveryArray.length>0 )
{
   this.recoveryArray.forEach((element:any)=>{
    totalRecoveryAmt=totalRecoveryAmt+element.recoveryAmount
  })
}

    let data = {
      "employeeCode": this.Personaldetail?.employeeCode,
      "pensionTypeId": this.data.message.item?.pensionType?this.data.message.item?.pensionType:"68",
      "withheldAmount": 0,
      "deductionAmount": [{
        "dedAmount": 0
      }],
      "recoveryAmount": [{
        "recAmount": totalRecoveryAmt?totalRecoveryAmt:0
      }],
      "allowanceAmount": 0,
      "dateOfVCD": "",
      "cpoEfDate": this.comDate1?moment(this.comDate1).format('DD-MMM-YYYY'):"",
      "isPaperLess": 0,
      "cpoValue":this.comPercent? this.comPercent:"",
      "deFlag":  this.serviceRecordDatanew.deStatus==2?"0":this.serviceRecordDatanew.deStatus,
      "deType":  this.serviceRecordDatanew.deType.toString() ,
      "qualifyingService": [],
      "nonQualifyingService": [],
      "isPayCommission": this.Calculations_Pay_Details?.payCommissionNameEn ? this.Calculations_Pay_Details.payCommissionNameEn : '',
      "isMilitary": '',
      "basicPay": this.payCalDetails.basicPay ? Number(this.payCalDetails.basicPay) : 0,
      "revised": 1,
      "marStatus":this.Personaldetail?.maritalStatus?this.Personaldetail?.maritalStatus:"",
      "npa":this.Calculations_Pay_Details.npaOrNca?Number(this.Calculations_Pay_Details.npaOrNca):0
    }

    
    console.log("data", data);
    this.CalculationPayload=data;
    var ser_data: any[] = [];
    this._Service.postRequestpension(data, 'callPensionCalculationRuleEngine').subscribe({
      next: (res) => {
       

          console.log("res", res);
          ser_data.push(res.data);
          console.log("res", ser_data);


          this.Pension_Commutation = JSON.parse(JSON.stringify(res.data))
          this.Pension_Commutation2=JSON.parse(JSON.stringify(res.data))
          this.commutationChange();
        this.load.hide()
      },
      error: (err) => {
        // let errorObj = {
        //   message: err.message,
        //   err: err,
        //   response: err,
        // };
        alert("Data not load properly so please Press Refresh Button.")
      }, complete: ()=> {
        this.load.hide();
        
      }
    });
    

  }
  getloginuserMobile()
  {
    this._Service.postUpcomingpension({"assignmentId":Number(this.userDetails.assignmentid)},"getMobileNoByAssignmentId").subscribe((res:any)=>{
      console.log("res",res.data[0].mobile);
      if(res.data=="" ||res.data==null || res.data==undefined)
      {
        alert("Login Employee mobile no not found.")
      }else
      {
        this.mobileNo=res.data
        
      }
    },(error)=>{
      alert("Get mobile no service have error.")
    })
  }
  remark:any
  UpdateFlag(flag:any)
  {
   
    let data={
      'pensionerId':this.data.message.item.pensionerId,
      'flag':flag,
      'type':1,
      'deType':this.serviceRecordDatanew.deType?this.serviceRecordDatanew.deType:null,
      'deStatus':this.serviceRecordDatanew.deStatus?this.serviceRecordDatanew.deStatus:0,
      'remarks':this.remark?this.remark:null,
      "dmsDocId":this.docId?this.docId.toString():null,
      "recovery":this.recoveryArray?this.recoveryArray:[],
      'assignmentId':this.userDetails.assignmentid
    }
    this._Service.postPssRequest(data,'revisepensiontypewise').subscribe((res:any)=>
    {
      console.log("res",res);
      if(flag==2 )
      {
        if(confirm("Application rejected successfully "))
        {
          this.dialogRef.close({ data: "R" });
        }
      }else if(flag==1)
      {
        if(confirm("Application forward successfully "))
        {
          this.dialogRef.close({ data: "R" });
        }
      }
      else if(flag==4)
      {
        if(confirm("Application revert successfully "))
        {
          this.dialogRef.close({ data: "R" });
        }
      }
    })
  }
  isLoading:boolean=false;
  file:any
  selectFile(event: any)
  {
 

    this.file = event.target.files[0];
    let ex2:any[]=this.file.name.split("."); 
    console.log("size",this.file.size/1024)
    if(ex2[1].includes('PDF') || ex2[1].includes('pdf')  )
    {
      
    } else
    {
      alert("Only PDF file format allowed")
      return;
    } 

    if((this.file.size/1024)>2048)
    {
      alert("Max 2 MB file size allowed")
      return;
    }
  
  }
refrsh()
{
  this.ngOnInit();
}
CalculationPayload:any;
  commutationDateCalculation2() {

    let data = {
      "employeeCode": this.Personaldetail.employeeCode,
      "pensionTypeId": 1,
      "withheldAmount": 0,
      "deductionAmount": [{
        "dedAmount": 0
      }],
      "recoveryAmount": [{
        "recAmount": 0
      }],
      "allowanceAmount": 0,
      "dateOfVCD": "",
      "cpoEfDate": this.Personaldetail.comDate,
      "isPaperLess": 0,
      "cpoValue": "",
      "deFlag":  this.serviceRecordDatanew.deStatus,
      "deType":  this.serviceRecordDatanew.deType.toString() ,
      "qualifyingService": [],
      "nonQualifyingService": [],
      "isPayCommission": this.Calculations_Pay_Details?.payCommissionNameEn ? this.Calculations_Pay_Details.payCommissionNameEn : '',
      "isMilitary": '',
      "marStatus":this.Personaldetail?.maritalStatus?this.Personaldetail?.maritalStatus:""
    }

    console.log("date", this.Pension_Commutation);
    console.log("data", data);
    this.CalculationPayload=data;
    var ser_data: any[] = [];
    this._Service.postRequestpension(data, 'callPensionCalculationRuleEngine').subscribe({
      next: (res) => {
       

          console.log("res", res);
          ser_data.push(res.data);
          console.log("res", ser_data);


          this.Pension_Commutation = res.data
        
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
  docId:any;
  fileName:any;
  uploadFile(id:any) {
    if(id==2 || id==4)
    {
      if(this.serviceRecordDatanew.deType)
      {
      }else{
        alert("Please select DE/Judiciary Proceedings Type ")
        return;
      }
if(this.remark)
{
}else
{
  alert("Please add some remark. ")
  return;
}
    }
    if(this.file)
    {
     let time1 = new Date();
     let ex2:any[]=this.file.name.split("."); 
     this.fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() +"."+ex2[1];
     this.fileName = this.fileName.replace(" ", "")
   
     const docTypeId = "20"
     const reader = new FileReader();
     var data4: any;
     reader.onloadend = () => {
       //console.log(reader.result);
 
       data4 = reader.result;
       let data5 = data4.toString()
       data5 = data5.replace("data:application/pdf;base64,", "")
       let data = {
         "type": "pension",
         "sourceId": 2,
         "docAttributes": [
 
         ],
         "data": [
           {
             "docTypeId": docTypeId,
             "docTypeName": "pdf",
             "docName": this.fileName,
             "docTitle": "Certificate",
             "content": data5
           }
         ]
       }
       this.isLoading=true;
       this._Service.postOr("wcc/uploaddocs", data).subscribe((res: any) => {
 
         let data =
         {
           "docTypeId": docTypeId,
           "dmsDocId": res.data.document[0].docId,
           "docName": "Accounts Personnel Certificate",
         }
 
         if (res.data.document[0].docId) {
       this.docId=res.data.document[0].docId
          //  this.submitEmployeeDe()
          this.UpdateFlag(id);
         } else {
           alert("Some error occured.")
         }
 
       },(error)=>{
         this.isLoading=false;
         alert("Error in Upload document")
       })
     };
     reader.readAsDataURL(this.file);
   
 
    }else{
     alert("Please select DE document.")
    }
   
   }
  detypelist:any;
  getDeType() {

    let data ={
    
    }

    this._Service.postdetype(data, "getDeTypes").subscribe({
      next: (res) => {
        if (res.status = 200) {
      
this.detypelist=res.data;
console.log(this.detypelist)

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
  base64Pdf:any
  docIdFR:any
  docIdPS:any
  pdfSrc:any
  getBaseData(no:any)
  {
    let docId:any;
  if(no=='1')
  {
    docId=this.docIdFR
  }else if(no=='2')
  {
    docId=this.docIdPS
  }
   
  let data = {
    "type": "pension",
    "sourceId": 2,
    "docs": [
      {
        "docId": docId
      }
    ]
  }
  console.log("single report data", data)
  this._Service.postOr("wcc/getfiles", data).subscribe((res: any) => {
    console.log("res", res.data.document[0].content);
    if (res.data.document[0].content) {
      let data = {
        "base64Pdf": res.data.document[0].content,
        "redirectUrl": "pension/e-Pension/Profile"
      }
      console.log("data", data);

      // this.dialog.open(PdfPreviewComponent, { width: '70%', data: { message: data }, disableClose: false });
      this.base64Pdf=res.data.document[0].content;
      if(this.base64Pdf)
      {const byteArray = new Uint8Array(
        atob(this.base64Pdf)
          .split("")
          .map(char => char.charCodeAt(0))
      );
      this.pdfSrc = "";
      const file = new Blob([byteArray], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      this.pdfSrc = fileURL;
      const pdfWindow = window.open("");
      pdfWindow!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");
    
      }

    }
  })
  

  }
  pensionInitaite() {
    let data = {
      "empId": this.Personaldetail.employeeCode,
      "psnInitiated": true,
      "psnType": "S",
      "psnStatus": "I"
    }
    console.log("data", data)
    this._Service.postCumm("updateEmployeePensionStatus", data).subscribe((res: any) => {
console.log("updateEmployeePensionStatus",res)
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
}
addRecovery() {
  let data=this.recoveryFormNew.value.recoveryHead
  if(data.length<15)
{
  alert("please add full Budget-Head.")
  return;
}

  if (this.recoveryFormNew.valid) {
    let data={
      recoveryType: this.recoveryFormNew.value.recoveryType,
      recoveryAmount: this.recoveryFormNew.value.recoveryAmount,
      recoveryHead: this.recoveryFormNew.value.recoveryHead
    }
    console.log("data",data)
    this.recoveryArray.push(data);
    this.recoveryFormNew.reset();
    this.commutationDateCalculation();
  } else {
    alert("Please check all fields properly.")
  }

}
onRemoveSpecialRequest(index: any) {

  this.recoveryArray.splice(index,1);
  this.commutationDateCalculation();
}
}

