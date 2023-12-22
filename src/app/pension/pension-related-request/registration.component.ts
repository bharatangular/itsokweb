import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SnackbarService } from 'src/app/services/snackbar.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';



import { Subject } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { MatStepper } from '@angular/material/stepper';
import { CommonModalComponent } from './common-modal/common-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { FamilyDetailsComponent } from './family-details/family-details.component';
import { RegistrationConfig } from 'src/app/layout/registration.config';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { PayManagerDetailsDialogComponent } from './ess/pay-manager-details-dialog/pay-manager-details-dialog.component';
import { BasicDetailsPopupComponent } from './ess/basic-details-popup/basic-details-popup.component';
import { PreviewPensionEssComponent } from './ess/preview-pension-ess/preview-pension-ess.component';



class Employee {
  employeeCode: any;
  requester: any;
  employeePersonalDetail: any = {};
  employeeServiceDetails: any = {};
  employeeAddressDetails: any = { currentAddress: {}, permanentAddress: {} };
  employeeFamilyDetails: any = { familyDetails: [], nomineeDetails: [] };
  employeeBankDetails: any = {};
  payEntitlementDetails: any = {};
}

interface progress {
  ind: number;
}
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  @ViewChild('stepper') teststepper: any;
  @ViewChild(MatStepper) stepper1: MatStepper;
  @ViewChild(PersonalDetailsComponent, { static: false })
  personalDetails1!:PersonalDetailsComponent;
  @ViewChild(ServiceDetailsComponent, { static: false })
  serviceDetails1!:ServiceDetailsComponent;
  @ViewChild(FamilyDetailsComponent, { static: false })
  familyDetails1!:FamilyDetailsComponent;
  personal: Subject<boolean> = new Subject();
  service: Subject<boolean> = new Subject();
  bank: Subject<boolean> = new Subject();
  Commutation:Subject<boolean> = new Subject();
  address: Subject<boolean> = new Subject(); 
  family:Subject<boolean> = new Subject();
  employee: Employee = new Employee();
  oldEmployee: Employee = new Employee();
  payint: Subject<boolean> = new Subject();
  isNext:boolean[]=[];
  actionList = [];
  ssoInfo:any
  roleid:any;
  IsLinear = true;
  reqId: string = '';
  action: string = 'DFT';
  taskId: string = '';
  dateOfBirth = '';
  janUserList: Array<any> = [];
  serviceUserList: Array<any> = [];
  stepper: any;
  firstFormGroup: any;
  secondFormGroup: any;
  thirdFormGroup: any;
  forthFormGroup: any;
  fifthFormGroup: any;
  eightFormGroup: any;
  isEssModify:boolean=true;
  isDraftModify:boolean=true;
  loginUser:any;
  config: RegistrationConfig = {
    isView: false,
    isModified: true,
    processId: 0,
    registrationType: 0,
    isFirstWorkflow: 0
  };
  setepCount = 6;
  user: any = {};
  userType: any = '';
  empId: any;
  picData: any;
  isMakerModified:boolean=false
    userdetails:any[]=[];
    isCommutaion:boolean=true;
    ismaker:any;
  constructor(
    private apiService: ApiEssService,
    private snackbar: SnackbarService,
    private route: ActivatedRoute,
    private router:Router,
    private formBuilder: FormBuilder,
    private tokenInfo:TokenManagementService,
    private dialog:MatDialog
  ) {this.apiService.configMenu={isload:true}
 }
config2:AppConfig=new AppConfig();
  ngOnInit(): void {
  
   
    this.ismaker=this.config2.getDetails("maker");
    if(this.ismaker=='1')
    {
      let userdetails=this.config2.getDetails("pensionerData");
     
      if(userdetails)
      {
        userdetails=JSON.parse(userdetails);       
        this.userdetails.push(userdetails)
      }
     this.loginUser=this.config2.getUserDetails();
    }else
    {
      this.userdetails= this.config2.getUserDetails();      
    }
    console.log("User",this.userdetails);
    this.user=  this.tokenInfo.empinfoService;
    console.log(this.user);
  
   
   
    this.config.registrationType =2;
   
  
for(let i=0;i<5;i++)
{
  this.isNext[i]=false;
}


    const IsEss = sessionStorage.getItem('landtoken');
    if (IsEss !== null) {
      this.userType = IsEss;
    }
this.roleid=sessionStorage.getItem("roleId")
   

    if (this.config.registrationType === 2) {
       this.empId = this.userdetails[0].employeeCode;
    }

    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.thirdFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.forthFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.fifthFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    let Makerdata=this.newconfig.getDetails("makerRequest");
    const session = JSON.parse(sessionStorage.getItem('ifm_emp_in')!);

    if (session !== null ) {
     
      this.reqId = session.reqId;
      this.taskId = session.taskId;
      this.getAllData(session.taskId);
      this.IsLinear = false;
      this.getCommutation();
      this. getPensionCommutation()
    } else if(this.newconfig.getDetails("isess")==1)
    {
     
      this.rootEss=true;
      this.inProcess( this.userdetails[0].employeeCode);
      this.getCommutation();
      this. getPensionCommutation()
    }else if(this.ismaker=='1') {
      this.inProcess2( this.userdetails[0].employeeCode);
      this.getCommutation();
      this. getPensionCommutation()
    }
    else {
      this.inProcess2( this.userdetails[0].employeeCode);
      this.getCommutation();
      this. getPensionCommutation()
    }
    if(session?.type=="Submitted" && this.userType=="1")
    {
      this.isEssModify=false;
      this.config.isModified=false;
      this.isOtpVerified=true;
    }
    if(session?.type=="Draft" && this.userType=="1")
    {
          this.config.isModified=true
    }
    if(this.roleid=='1')
    {
      this.isOtpVerified=true;
    }
    
   
    if(Makerdata)
    {
      Makerdata=JSON.parse(Makerdata);
      console.log("makerdata",Makerdata)
      this.empId=Makerdata.employeeCode;
     this.userdetails[0].employeeCode=Makerdata.employeeCode;
      this.isEssModify=true;
      this.config.isModified=true;
      this.isMakerModified=true;
    
    }
       this.empId=this.userdetails[0].employeeCode
   
   
  }
  newconfig:AppConfig=new AppConfig()
  isOtpVerified:boolean=false;
  ngOnDestroy() {
    sessionStorage.removeItem('ifm_emp_in');
    this.newconfig.storeDetails("isess","");
    this.newconfig.storeDetails("makerRequest","");
    
  }
  getCommutation = () => {
   
    
    this.apiService.postmst('getCommutation', { "employeeId": this.userdetails[0].employeeCode  }).subscribe({
      next: (res) => {
        let data=res.data[0]; 
        console.log("commutation",data);
        if(data.comFlag=="Y")
        {
          this.isCommutaion=false;
        }
       
      }
    })
  }
  getPensionCommutation()
  {
    this.apiService.postloantype1({ "employeeCode": this.userdetails[0].employeeCode,"employeeId":0  },'getReviseCommutationDtls').subscribe({
      next: (res) => {
       console.log("res",res);
       if(res.data)
       {
        if(res?.data[0]?.commutFlag=='Y')
        {
          this.isCommutaion=false;
        }
       }
      }
    })
  }
  paymanagerData:any;
  openBasicDeatailDialog() {
    // const updatePopup = this.dialog.open(PayManagerDetailsDialogComponent, {
const updatePopup = this.dialog.open(BasicDetailsPopupComponent, {
  height: "calc(100% - 30%)",
  width: "calc(100% - 30%)",

      panelClass: 'full-screen-modal'
      , autoFocus: false,
      disableClose: true,
      data: {
        empId:this.empId
      }
    });

    updatePopup.afterClosed().subscribe(result => {
     
console.log("result",result)

this.paymanagerData=result.data;
this.newconfig.storeDetails("isess",'1');
this.getTaskInProcess(this.empId);

    });
  }
  inProcess(empid:any)
  {
    this.apiService.post('getEmpRequestCount', {processId:18, employeeCode: empid }).subscribe({
      next: (res) => {
   
        console.log(res.data)
 
        if(res.data.count==0)
        {
          this.getAllEmpData();
            this.config.isModified=true;
            this.isEssModify=true
        }else
        {
          this.getAllEmpData();
          this.config.isModified=false;
          this.isEssModify=false;
          this.isOtpVerified=true;
        }
       
      }
    })
  }
  inProcess2(empid:any)
  {
    this.apiService.post('getEmpRequestCount', {processId:18, employeeCode: empid }).subscribe({
      next: (res) => {
   
        console.log(res.data)

        if(res.data.count==0)
        {
          this.openBasicDeatailDialog();
            this.config.isModified=true;
            this.isEssModify=true
        }else if(this.ismaker=='1')
        {
          this.getTaskInProcess(this.empId);
          this.config.isModified=true;
          this.isEssModify=true;
          this.isOtpVerified=true;
        }else
        {
          this.getAllEmpData();
          this.config.isModified=false;
          this.isEssModify=false;
          this.isOtpVerified=true;
        }
       
      }
    })
  }
rootEss:boolean=false;
  getTaskInProcess = (empCode: any) => {
  
   
    this.apiService.post('getEmpDraftRqstCount', { employeeCode: empCode }).subscribe({
      next: (response) => {
      
        console.log("response",response)
        debugger
        if(response.data.isSuccess){
          this.reqId = response.data.requestId;
          this.taskId = response.data.taskTransId;
          this.getAllData(response.data.taskTransId);
         
          
        } else{
          this.getAllEmpData();
          this.config.isModified=true;
            this.isEssModify=true
        }
        console.log(response)
      },
      error: (err) => {},
    });

  }

  getAllEmpData() {
    
    this.getEmployeeData(this.userdetails[0].employeeCode, 3);
    this.getEmployeeData(this.userdetails[0].employeeCode, 5);
    this.getEmployeeData(this.userdetails[0].employeeCode, 1);
    this.getEmployeeData(this.userdetails[0].employeeCode, 2);
    this.getEmployeeData(this.userdetails[0].employeeCode, 4);
    this.getEmployeeData(this.userdetails[0].employeeCode, 6);
    this.getEmployeeData(this.userdetails[0].employeeCode, 8);
  }
  picId:any;
  mobileNo:any;
  getAllData = (taskId: number) => {
    this.apiService.post('task', { taskId: taskId }).subscribe({
      next: (response) => {
        if (response.status == 'SUCCESS') {
          // this.config.isModified=true
          this.actionList = response.data.actionData;
          this.employee=response.data.payload
          this.employee.employeeFamilyDetails=this.employee.employeeFamilyDetails
          this.employee.employeeFamilyDetails = response.data.payload.employeeFamilyDetails;
          console.log("this.Employee",this.employee.employeeFamilyDetails);
          this.oldEmployee = response.data.payload;
          console.log("this.oldEmployee",this.oldEmployee);
       
          this.getEmployeeData(this.employee.employeePersonalDetail.employeeId, 3);
          this.getEmployeeData(this.employee.employeePersonalDetail.employeeId, 5);
          this.getEmployeeData(this.employee.employeePersonalDetail.employeeId, 8);
          this.empId = this.employee.employeePersonalDetail.employeeId;                  
          this.picId = this.employee.employeePersonalDetail.employeePhoto;          
          this.mobileNo=this.employee.employeePersonalDetail.mobileNumber
         
          console.log("pic id",this.picId);          
          if(this.picId)
          {
            this.showPic(this.picId)
          }
          //  this.empId = this.employee.employeePersonalDetail.employeeCode;   
        
        }
      },
      error: (err) => { },
    });
  };
  showPic = (id:any) =>{
    let data = {
      "type": "ess",
      "sourceId": 2,
      "docs": [
        {
          "docId":id
        }
      ]
    }
    console.log("single report data", data)
    this.apiService.postOr('wcc/getfiles', data).subscribe({
      next: (res:any) =>{
       
         
          data=  res.data.document[0].content;
          this.picData="data:image/jpeg;base64,"+data;
         // console.log("pic Data",this.picData)
       
      }, error: err =>{
        
      }
    })
  }
  officeData:any
  getEmployeeData = (empId: any, intype: number) => {

    this.apiService.postmst('getEmployeeDetailsByType', {
      employeeId: empId, inType: intype
    }).subscribe({
      next: res => {
        const data = res.data;
        switch (intype) {
          case 1:
            this.employee.employeePersonalDetail = data.employeePersonalDetail;
           
           
            this.employee.employeePersonalDetail.employeeId= this.employee.employeePersonalDetail.employeeCode        
            this.mobileNo=this.employee.employeePersonalDetail.mobileNumber; 
            this.oldEmployee.employeePersonalDetail = data.employeePersonalDetail;           
            if(this.employee.employeePersonalDetail.selfPhotoDocId!=0)
            {
              this.showPic(this.employee.employeePersonalDetail.selfPhotoDocId)
              this.employee.employeePersonalDetail.employeePhoto = this.employee.employeePersonalDetail.selfPhotoDocId;
              this.employee.employeePersonalDetail.isemployeePhoto=true;  
            }   else
            {
              this.employee.employeePersonalDetail.isemployeePhoto=false; 
            }          
            break;
          case 2:
            this.employee.employeeFamilyDetails = data.employeeFamilyDetails;
            this.oldEmployee.employeePersonalDetail = data.employeePersonalDetail; 
            break;

          case 3:
            this.employee.employeeBankDetails = data.employeeBankDetails;
            this.oldEmployee.employeeBankDetails = data.employeeBankDetails; 
            this.config.isFirstWorkflow = data.employeeBankDetails.isFirstWorkflow;
            break;

          case 4:
            this.employee.employeeServiceDetails = data.employeeServiceDetails;
            
            // if(this.paymanagerData)
            // {
          
            //   this.employee.employeeServiceDetails.dob=this.paymanagerData.dob;
            //   this.employee.employeeServiceDetails.dateOfJoiningRegularService=this.paymanagerData.dojRegular;
            //   this.employee.employeeServiceDetails.retirementDate=this.paymanagerData.dor;
            //   this.employee.employeeServiceDetails.joiningDate=this.paymanagerData.doj;
            //   this.employee.employeeServiceDetails.serviceCategory=this.paymanagerData.serviceCatId;
            //   this.employee.employeeServiceDetails.subServiceCategory=this.paymanagerData.subServiceCatId;

            // } 
            this.oldEmployee.employeeServiceDetails = this.employee.employeeServiceDetails;
            break;

          case 5:
            let currentAddress=res.data.employeeAddressDetails.currentAddress
            if(currentAddress!="0")
            {
              currentAddress=currentAddress
            }

            console.log("currentAddress",currentAddress)
            let permanentAddress=res.data.employeeAddressDetails.permanentAddress;
            if(permanentAddress!="0")
            {
              permanentAddress=permanentAddress
            }
            console.log("permanentAddress",permanentAddress)
            // ...data.employeeAddressDetails.permanentAddress
            this.employee.employeeAddressDetails =
            {
              ...currentAddress,
             ...permanentAddress
            };
            this.oldEmployee.employeeAddressDetails =
            {
              ...currentAddress,
             ...permanentAddress
            };
            break;

          case 6:
            this.employee.payEntitlementDetails = data.payEntitlementDetails;
            this.oldEmployee.payEntitlementDetails = data.payEntitlementDetails;
            // if(this.paymanagerData)
            // {

            //   this.employee.payEntitlementDetails.subServiceCategory=this.paymanagerData.subServiceCatId;
            //   this.employee.payEntitlementDetails.serviceCategory=this.paymanagerData.serviceCatId;
            //   // this.employee.payEntitlementDetails.payCommission=this.paymanagerData.payCommissionId;
            //   this.employee.payEntitlementDetails.NPA=this.paymanagerData.npa;
            //   this.employee.payEntitlementDetails.specialPay=this.paymanagerData.specialPay;
            // } 
            break;
            case 8:
             console.log("office",data.employeeOtherDetails[0]);
             this.officeData=data.employeeOtherDetails[0]
             this.office=data.employeeOtherDetails[0]?.officeId;
             this.currentDepartment=data.employeeOtherDetails[0]?.departmentId;
              break;
        }
      }, error: err => {
      }
    })
  }

  office:any
  currentDepartment:any
  getJanaadharuser = (data: any) => {
    if (this.config.registrationType === 2) { return }
    this.janUserList = data;
  };

  // service list
  getServiceuser = (data: any) => {
    this.serviceUserList = data;
  };
  getDob = (data: any) => {
    this.dateOfBirth = data;
  };
  personalDetails:any;
  saveOffline(data: any)
  {
    
    this.personalDetails=data
    // console.log("data1111",this.personalDetails);
  }
  validate:boolean=false
  getData = (data: any) => {
 
  this.validate=data.validate;  
    this.setepCount = data.step;    
    switch (data.step) {
      case 1:
        this.employee.employeePersonalDetail = data.value;
        if(!this.employee.employeePersonalDetail.employeePhoto)
        {
        this.employee.employeePersonalDetail.employeePhoto = this.employee.employeePersonalDetail.selfPhotoDocId;
        } 
        // this.employee.employeePersonalDetail['employeeCode']=this.employee.employeeCode;
        // this.employee.employeePersonalDetail['employeeId']=this.empId;
        console.log("this.employee.employeePersonalDetail", this.employee.employeePersonalDetail)
        this.firstFormGroup.patchValue({ firstCtrl: 'done' });
    
          this.saveData(' Draft Saved Successfully with request id',1,"Draft");
   
        
       
        if(this.validate && this.isNext[0])
        this.onStepChange1();
        break;
      case 2:
        this.employee.employeeServiceDetails = data.value;
        this.secondFormGroup.patchValue({ secondCtrl: 'done' });
        console.log("this.employee.employeeServiceDetails", this.employee.employeeServiceDetails)
       
        this.saveData('Draft Saved Successfully with request id',2,"Draft");
        
        if(this.validate && this.isNext[1])
        this.onStepChange1();
        break;

      case 3:
        console.log(this.config.registrationType)
        
        this.thirdFormGroup.patchValue({ secondCtrl: 'check' });
        
          this.saveAddress(data.value);
          // if(this.validate && this.isNext)
          // this.onStepChange1();
          return
        // }
        this.employee.employeeAddressDetails = data.value;
        if(this.userType==1)
        this.saveData('Draft Saved Successfully with request id',3,"Draft");
       
       
        break;

      case 4:
        this.employee.employeeFamilyDetails = data.value;
        this.forthFormGroup.patchValue({ secondCtrl: 'check' });
      
        this.saveData('Draft Saved Successfully with request id',4,"Draft");
        if(this.validate && this.isNext)
        this.onStepChange1();
        break;

      case 5:
        this.fifthFormGroup.patchValue({ secondCtrl: 'check' });
        if (this.config.registrationType === 2) {
          this.saveBankDeta(data.value);
          return
        }
        this.employee.employeeBankDetails = data.value;
       
        this.saveData('Draft Saved Successfully with request id',5,"Draft");
        if(this.validate && this.isNext[4])
        this.onStepChange1();
        break;

      case 6:
     if(this.personalDetails1.personalDetails.valid)
     {

     }else{
      alert("Please Enter the mandatory feilds of Personal Details Tab");
      return;
     }
     if(this.serviceDetails1.serviceDetails)
     {

     }else{
      alert("Please Enter the mandatory feilds of Service Details Tab");
      return;
     }
     
       // console.log(data)
       let remark=""
       if(this.roleid=='1' || this.roleid=='2' || this.roleid=='3')
       {
        remark=data.remark;
      
       }else
       {
        remark="Submitted"
       }
       this.employee.employeePersonalDetail=this.employee.employeePersonalDetail;
       this.employee.employeeAddressDetails=this.employee.employeeAddressDetails;
       this.employee.employeeBankDetails=this.employee.employeeBankDetails;
       this.employee.employeeServiceDetails=this.employee.employeeServiceDetails;
       this.employee.employeeFamilyDetails= this.employee.employeeFamilyDetails
        this.employee.payEntitlementDetails = data.value;
           
       
        this.action = data.action === '' ? 'CMPEMP' : data.action;

        let title = 'Your Request Forwarded with request id ';
        if(data.action=='CMP')
        {
           title = 'Your Request Approved with request id ';
        }
       
          this.saveData(title,6,remark);
       
       
        break;
        case 7: this.employee.payEntitlementDetails = data.value;
        this.preview()
        break;
    }
  };
  preview()
  {
    const updatePopup = this.dialog.open(PreviewPensionEssComponent, {
      height: "calc(100% - 30%)",
      width: "calc(100% - 30%)",

      panelClass: 'full-screen-modal'
      , autoFocus: false,
      disableClose: true,
      data: {
        empData:this.employee
      }
    });

    updatePopup.afterClosed().subscribe(result => {
     
console.log("result",result)


    });
  }
  savedata1(i:any)
  {
  
    if(i==1 )
    {
      
      this.isNext[0]=true
      this.personal.next(true);
    }else if(i==2 )
    {
      this.isNext[1]=true
      this.service.next(true);
    }else if(i==5 )
    {
            this.onStepChange1();
    }else if(i==3 )
    {
     
      this.onStepChange1();
     
    }else if(i==4 )
    {
      this.isNext[4]=true
      this.family.next(true);
      
    }else if(i==5 )
    {
      this.payint.next(true);
    }else if(i==8 )
    {
      this.onStepChange1();
    }
   
  }
  onStepChange1() {
      this.stepper1.next();
  }
  verifyMobileNo(title:any,n:any,remark:any): void {
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
        this.verifyOtp(res,title,n,remark);
       }
    })
  }
    else
    {
      alert("The Employee mobile number was not found");
    }
  }

  verifyOtp(res:any,title:any,n:any,remark:any){
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
        this.saveData(title,n,remark);
      }else{
        alert("The OTP (One-Time Password) was not verified")
      }
    })
  }

  saveData(message: string,i:any,rema:any) {
  
   if(this.rootEss)
   {
    this.newconfig.storeDetails("isess","");
   }
    let remark=rema;
  console.log("this.employee",this.employee)
   
    const actionData = {
      request_data: {
        processId: 18, //1
        taskSeq: '',
        processTaskSeq: '',
        taskTranId: this.taskId,
        requestId: this.reqId,
        requestDesc: '',
        assignmentId:this.empId ,
        initiator: 0,
        person_id: this.empId ,
        person_name: '',
        action: this.action,
        remarks: remark,
        payloadChangeFlag: 'Y',
        userType: 'E' ,
        pensionerId:this.userdetails[0].pensionerId
      },
      payload: { ...this.employee,
        'pensionerId':this.userdetails[0].pensionerId},
      oldPayload: { ...this.oldEmployee },
      payloadSummery: {
        employeeCode: this.empId,
        requester: 'EMP',
        pensionerId:this.userdetails[0].pensionerId
      }
    };
    console.log("Action Data",actionData);
    if (this.config.registrationType === 2) {
      delete actionData.payload.employeeBankDetails;
      delete actionData.payload.employeeAddressDetails;
      actionData.payload.employeeCode = this.empId
      actionData.payload.requester = 'EMP';
     
    }
    debugger
    if (this.ismaker == "1") {
      delete actionData.payload.employeeBankDetails;
      delete actionData.payload.employeeAddressDetails;
      actionData.payload.employeeCode = this.empId
      actionData.payload.requester = 'MAKER';
      actionData.request_data.assignmentId=this.loginUser.assignmentid;
    }
    if(this.action=='CMPEMP')
    {
      if (this.ismaker == "1") {
        delete actionData.payload.employeeBankDetails;
        delete actionData.payload.employeeAddressDetails;
        actionData.payload.employeeCode = this.empId
        actionData.payload.requester = 'MAKER';
        actionData.request_data.userType='O';
        actionData.request_data.assignmentId=this.loginUser.assignmentid;
      }
    }
   
if(this.isMakerModified)
{
  actionData.request_data.action="INI";
  actionData.request_data.userType='O';
  actionData.request_data.assignmentId=this.user.aid;
  actionData.payloadSummery.requester='MAKER';
}
if(
  this.roleid=='1' && this.action=='REV'
)
{
  actionData.request_data.remarks='Draft';
}
   
 
actionData.payload.payEntitlementDetails["pensionerId"]=this.userdetails[0].pensionerId
console.log("requestData",actionData);

     this.apiService.post('action', actionData).subscribe({
       next: res => {
         this.newconfig.storeDetails("isess","");
         this.taskId = res.data.taskTranId;
         this.reqId = res.data.requestId;
         actionData.request_data.taskSeq = res.data.taskSeq;
    
         if(actionData.request_data.action=='CMPEMP')
         {
          let data={	 
                  "inMstType": 3,
                      "requestData": [{
                                "employeeId": -1,
                               "employeeCode": this.empId,
                                "isRevisionUnderProcess": "Y"
                            } ] 
                   }  
                   console.log("update revision",data);
                   this.apiService.empServicese("essWorkMultiTask",data).subscribe((res:any)=>{
  
                   },(error)=>{
                   alert("update revision flag service not work.Please Submit again.")
                   })
                   this.newconfig.storeDetails("pensionerData","")    
             
                   this.newconfig.storeDetails("maker",'0') 
          this.snackbar.show('Your details updated successfully', 'success');
         }else
         {
          this.snackbar.show(message + ' ' + this.reqId, 'success');
         }
         
        if(i==6)
        {
         setTimeout(()=>{   
          if(this.userType=="1")
          {
            this.newconfig.storeDetails("dashEss","1");
          }
          if(this.ismaker=="1")       
          {
            this.router.navigate(['pension/revised/revised-pension-list'])
          } else{
            this.router.navigate(['/MyDashboard'])
          }   
          
       }, 100);
        }
      
       }, error: err => {
         this.snackbar.show(err?.error?.description, 'danger');
       }
     })
    this.onStepChange()
  }


  saveBankDeta = (data: any) => {
    const user = this.apiService.userInfo();
    const requestData = {
      employeeCode: this.empId,
      requester: 'EMP',
      employeeBankDetails: { ...data }
    }

    this.apiService.postmst('updateEssBankDetails', requestData).subscribe({
      next: res => {
        this.snackbar.show('Your bank details updated successfully', 'success');
      }, error: err => {
        this.snackbar.show(err?.error.description, 'danger');
      }
    })
  }

  saveAddress = (data: any) => {
    const requestData = {
      employeeCode: this.empId,
      requester: 'EMP',
      employeeAddressDetails: { ...data }
    }
console.log("requestData",requestData);

    this.apiService.postmst('updateEssAddressDetails', requestData).subscribe({
      next: res => {
        this.snackbar.show('Your Address details updated successfully', 'success');
      }, error: err => {
        this.snackbar.show(err?.error.description, 'danger');
      }
    })
  }


  progress1: number = 0;
  onStepChange() {
    this.progress1 = this.setepCount * 16;

    if (this.setepCount == 6) {
      this.progress1 = 100
    }
  }

}
