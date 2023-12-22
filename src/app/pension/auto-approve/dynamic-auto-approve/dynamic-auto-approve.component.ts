import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-auto-approve',
  templateUrl: './dynamic-auto-approve.component.html',
  styleUrls: ['./dynamic-auto-approve.component.scss']
})
export class DynamicAutoApproveComponent implements OnInit {

  displayedColumns: string[] = ['employeeCode','name','designationName','dateOfJoining','dateOfRetirement'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  datalist: any = [];
  countDetail: any;
  inboxData: any = [];

  showerror: boolean = false;
  error: string = '';
  empinfo: any;
  isShow=true;

  encryptMode: boolean= false;
  textToConvert: any;
  password: any;
  conversionOutput: any;
  userdetails:any;
config:AppConfig=new AppConfig()
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
  constructor(public _Service:PensionServiceService,public load:LoaderService,private dialog:MatDialog,) { }
 
  ngOnInit(): void {
    this._Service.configMenu = { url: "Inbox > Auto Approve Pensioner" };
    this.userDetails = this.config.getUserDetails();
    // console.log(this.data)
    
    // this.load.show()
    this. getMonthlyDetail();
    
  }
  Personaldetail:any
  ServiceDetails:any
  dateofRetirement:any;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  pensionerList:any;
  getMonthlyDetail(){

    let data = {
  "ddoId":null,
 "officeId":null,
// "serviceCategoryId":null,
  "departmentId":null,
// "departmentId":this.userdetails.assignmentid,
  //"officeId": this.userdetails.officeid,
   "serviceCategoryId":99,
   
  }
  this.load.show();
  this._Service.postUpcomingpension(data, "getUpcomingPensionersList").subscribe({
    //this._Service.postRequestpension(data, "getToBeRetiringEmployeeListByDeptId").subscribe({
      next: (res) => {
        this.load.hide();
        if (res.status === "SUCCESS") {
          if (res == '') {
            alert("Not Record Found");
          }
          else {
            this.pensionerList=res.data
            this.dataSource = new MatTableDataSource(res.data);
            this.dataSource.paginator = this.paginator;
            console.log("pensionerList",this.pensionerList)
          }
        }
      },
      error: (err) => {
        this.load.hide();
        console.log(err);
        this.error = err
      
      }
    })
  }
  data:any;
isStop:boolean=true
  count:any=0
  isLoading:boolean=false
  autoApproveStart()
  {
     this.Personaldetail =''
     this.ServiceDetails =''
     this.EMPAddress =''
     this.familyDetails =''
     this.nominee =''
     this.serviceRecordDatanew =''
     this.advancedLoan=[]
     this.Calculations_Pay_Details =''
     this.Pension_Commutation =''
     this.Calculations_Commutation_Details=''
     this.Banklist =''
     this.documentlist =[]
     this.isrequest=false;
     this.payload='';
     this.requestIdE='';
     this.requestIdP='';
     this.lRnumber='';
   if(this.count<this.pensionerList.length && this.isStop)
   {
    this.data=this.pensionerList[this.count];
    console.log(this.data)
    this.dor=new Date(this.data.dateOfRetirement)
      console.log(this.dor)
      this.isLoading=true
      this.count++ ;
    this.getPensionStatus();
   }else{
    this.isStop=true
    this.isLoading=false
    alert("List Completed or Process Stopped");
    this.getMonthlyDetail();
    this.count=0;
   }
   
  }
  autoApproveStop()
  {
    this.isStop=false;
  }
  fetchPersonaldetail() {
    let data = {
      employeeId: this.data.employeeId
    }
    this._Service.postRequestpension(data, 'getPersonaldetailsByEmpCode').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.Personaldetail = res.data[0];
          this.Personaldetail = JSON.parse(JSON.stringify(this.Personaldetail).replace(/\:null/gi, "\:\"\""));
        
         
          this.dateofRetirement = this.Personaldetail.dor;
          
          console.log("date",this.Personaldetail)
         
         
        }
      },
      error: (err) => {
      
     
      }

    });
    console.log("Personal details", this.Personaldetail);
  }
  getEmployeeStatus()
  {
  
    let data={
      "inMonth":this.dor.getMonth()+1,
      "inYear":this.dor.getFullYear(),
      "inEmpId":this.data.employeeId 
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
      "inEmpId":this.data.employeeId
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
      setTimeout(()=>{
        this.getLRnumber();
        this.commutationDateCalculation();
        this.getEmployeeStatus();
      },1500)
         
          
        
        setTimeout(()=>{
          
          this.makerequestINI();
        },2000)
         
       
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

      
      this.makerequestINI();

 
  }
 
})
  }
  fetchServicesdetail() {

    let data = {
      employeeId: this.data.employeeId
    }
    this._Service.postRequestpension(data, 'getServicedetailsByEmpCode').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.ServiceDetails = res.data;
          this.getBudgetDetails(this.ServiceDetails);
          this.ServiceDetails = JSON.parse(JSON.stringify(this.ServiceDetails).replace(/\:null/gi, "\:\"\""));
          console.log("ServiceDetails", this.ServiceDetails);


          

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
      employeeId: this.data.employeeId
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
      "employeeId": this.data.employeeId
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
      "employeeId": this.data.employeeId
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
      "employeeId": this.data.employeeId
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
      "employeeId": this.data.employeeId
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
  deChange()
  {
   
    this.serviceRecordDatanew.deType='';
  }
  documentlist: any[] = []
  getAllUploadedDocumentDetailsByEmployeeCode() {
    let data = {
      "subModuleId": 4,
      "processId": 1,
      "employeeId": this.data.employeeId
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
    "deStatus": '0',
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
      "employeeId": this.data.employeeId
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
    if (this.ServiceDetails?.optForCommutation=='No') {
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
    } else if(this.ServiceDetails?.optForCommutation=='Yes') {
      this.Calculations_Commutation_Details = {
        "budgetHead": this.getBudHead('Commutation'),
        "budgetHeadId": this.getBudHeadId('Commutation'),
        "effectiveDate":this.Personaldetail.comDate,
        "commutationAmount": this.Pension_Commutation.commutationAmount,
        "commutationFactor": this.Pension_Commutation.commutedFactor,
        "commutationValue": this.Pension_Commutation.commutationValue,
      }
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
      "inTreasCode":this.data.treasCode,
      "inEmpId":this.Personaldetail.employeeId,
      "inRevised":"0"
    }
    this._Service.post("getlrnumber", data).subscribe((res: any) => {

      console.log("result", res);
      if (res.status == 'SUCCESS') {
        this.lRnumber = res.data;

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

    let submitdata:any;
    // if(Number(this.Calculations_Pay_Details.payCommissionId)<=5)
    // {
    //   alert("Your Pay Commission Id is equal or less than 5.")
    // }
    if(!this.isrequest)
    {
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
    
    this.Banklist['treasuryCode'] = this.data.treasCode;
    // this.Banklist['treasuryName'] = this.data.
    this.Personaldetail['lrNo'] = this.lRnumber?this.lRnumber:"";
   
      let selfPic={
        "dmsDocId":this.Personaldetail.selfPhotoId,
        "docName":"Self Photograph",
        "docTypeId":33
      }
      this.documentlist.push(selfPic)
    
    
    let jointPic={
      "dmsDocId":this.Personaldetail.jointPhotoId,
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
        "initiator": this.data.assignmentId,
        "person_name":  "",
        "action": "AUTOARV",
        "remarks": "AUTO APPROVED",
        "payloadChangeFlag": "Y",
        "adApproveFlag": "",
        "officeId":this.data.empOfficeId
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
        "createdByAid": this.data.employeeId,
        "createdByUserId": this.data.employeeId,
        "payeeId": this.Personaldetail.payeeId ? this.Personaldetail.payeeId : "",
        "ObjectionArray":""
      }
      ,
      "payloadSummary": payload_summary ? payload_summary : "",

    }

  }else
  {
    let payload_summary = {
        "empName": this.payload.personalDetails.nameEn,
        "emp_Id": this.payload.personalDetails.employeeId,
        "empCode": this.payload.personalDetails.employeeCode
      }
    if(this.payload.personalDetails.hasOwnProperty('lrNo')){

      if(this.payload.personalDetails.lrNo=="" ||  this.payload.personalDetails.lrNo==null)
   {
 
     this.getLRnumber();
     this.payload.personalDetails.lrNo = this.lRnumber;
   }
 }else{
    
  this.payload.personalDetails['lrNo'] = this.lRnumber;
  }
    submitdata = {
      "requestData": {
        "processId": "1",
        "taskSeq": "",
        "processTaskSeq": "",
        "taskTranId":  "",
        "requestId":  "",
        "requestDesc": "",
        "initiator": this.data.assignmentId,
        "person_name":  "",
        "action": "AUTOARV",
        "remarks": "AUTO APPROVED",
        "payloadChangeFlag": "Y",
        "adApproveFlag": "",
        "officeId":this.data.empOfficeId
      },
      "payload": {

        "personalDetails": this.payload.personalDetails ? this.payload.personalDetails : "",
        "serviceDetails": this.payload.serviceDetails ? this.payload.serviceDetails : "",
        "addressDetails": this.payload.addressDetails ? this.payload.addressDetails : "",
        "familyDetails": this.payload.familyDetails ? this.payload.familyDetails : "",
        "nominationDetails": this.payload.nominationDetails ? this.payload.nominationDetails : [],
        "serviceRecords": this.payload.serviceRecords ? this.payload.serviceRecords : "",
        "loansAdvance": this.payload.loansAdvance,
        "calculationsPayDetails": this.payload.calculationsPayDetails ? this.payload.calculationsPayDetails : "",
        "calculationsAdditionalAllowanceRecovery": this.payload.calculationsAdditionalAllowanceRecovery,
        "calculationsPensionDetails": this.payload.calculationsPensionDetails ? this.payload.calculationsPensionDetails : "",
        "calculationsCommutationDetailsNomination": this.payload.calculationsCommutationDetailsNomination ? this.payload.calculationsCommutationDetailsNomination : "",
        "bankTreasuryDetails": this.payload.bankTreasuryDetails ? this.payload.bankTreasuryDetails : "",
        "documents": this.payload.documents ? this.payload.documents : "",
        "conditionList":this.payload.conditionList,
        "employeeId": this.Personaldetail.employeeId,
        "employeeCode": this.Personaldetail.employeeCode,
        "createdByAid": this.data.employeeId,
        "createdByUserId": this.data.employeeId,
        "payeeId": this.Personaldetail.payeeId ? this.Personaldetail.payeeId : "",
        "ObjectionArray":this.payload.ObjectionArray
      }
      ,
      "payloadSummary": payload_summary ? payload_summary : "",

    }

  }
     
    console.log(submitdata);

    this._Service.requestApplication(submitdata, 'action').subscribe({
      next: (res) => {
        console.log(res)
        // this.load.show();
      
        if(res.response)
        {
          this. pensionInitaite();
          this.pdfpreviewFR(res.response)
          setTimeout(()=>{
            this.pdfpreviewpk(res.response)
          },5000)
          setTimeout(()=>{
            this.pdfpreviewSS(res.response)
          },10000)
          setTimeout(()=>{
            this.directEsignSS2(res.response,51)
          },12000)
          setTimeout(()=>{
            this.directEsignSS2(res.response,52)
          },14000)
          setTimeout(()=>{
            this.directEsignSS2(res.response,53)
          },16000)
        }else
        {
          this.pensionErrorFlag();
          console.log("action fail");
        }
        setTimeout(()=>{
          this.autoApproveStart()
         },40000)
      },
      error: (err) => {
        this.pensionErrorFlag();
        setTimeout(()=>{
          this.autoApproveStart()
         },4000)
        console.log("action fail2");
      },
    });
  }
  directEsignSS2(data2:any,doctypeid:any)
  {
    let time1=new Date()
    let name:any;
    if(doctypeid==51)
    {
      name='PPO'
    }else if(doctypeid==52)
    {
      name='CPO'
    }else if(doctypeid==53)
    {
      name='GPO'
    }
    let fileName = name + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf" ;
    let reportpath:any;
    if(doctypeid==51)
    {
      reportpath="/Pension/Pension_Kit/Report/PENSION_PPO.xdo"
    }else if(doctypeid==52)
    {
      reportpath="/Pension/Pension_Kit/Report/PENSION_GPO.xdo"
    }
    else if(doctypeid==53)
    {
      reportpath="/Pension/Pension_Kit/Report/PENSION_CPO.xdo"
    }
    let data={
  "reportPath": reportpath,
  "name":"pensioner_id",
  "value":data2.pensionerId,
  "sourceId":3,
  "processName":"PENSION_AUTO_PROCESS",
  "identifier":2,
  "identifierType":"DDO",
  "signName":"Addl Director Pension Pensioners Welfare.",
  "reason":"Approved",
  "location":"Jaipur",
  "searchText":"¥",
  "docName":fileName,
  "docTypeId":doctypeid,
  "docId":0
    }
    this._Service.postNewEsign("withOutOTPEsign", data).subscribe((res: any) => {
  
    res=JSON.parse(res)
    
  console.log(res)
    if(res.status=='success')
    {
      let data1=JSON.parse(res.data)
      console.log(data1)
      this.docIdSS=data1.DocId;
      if(doctypeid==53)
      {
       
      }
        this. updateDocIdnew(doctypeid,data1.DocId,data2)
      
    }
    })
  }
  updateDocIdnew(doctypeid:any,docId:any,data:any)
  {
    let uploadData={"empCode": this.Personaldetail.employeeCode,
          "psnId": data.pensionerId,
          "docitem": [
           {
              "docTypeId": doctypeid,
              "createAid": this.Personaldetail.employeeId,
               "dmsdocid": docId,
               }
       
           ]
       
       }
       this._Service.postho('updatephotoid',uploadData).subscribe((res: any) => {
       console.log("res",res)
       if(res.status ='SUCCESS' && res.data.status=="Success"){
      // if(res.data.status=="Success"){
         // return res.data.msg;
         if((res.data.msg=='Data Save Successfully')==true)
         {
        
 
           
         }       
        
       }    
       });
  }
  pensionErrorFlag()
  {

  } 
  docIdSS:any
  pdfpreviewFR(data2: any) {
    console.log("preview", data2);

    let data = {
      "reportPath": data2.reportPathFR,
      "format": "pdf",
      "params": [
        {
          "name": "task_data_id",
          "value": data2.taskDataIdFR
        }
      ]
    }
    console.log("single report data", data)
    this._Service.postOr("report/singlereport", data).subscribe((res: any) => {
      console.log("res", res.data.report.content);
      if (res.data.report.content) {
        const byteArray = new Uint8Array(
          atob(res.data.report.content)
            .split("")
            .map(char => char.charCodeAt(0))
        );
        // this.pdfSrc = "";
        const file = new Blob([byteArray], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        // this.pdfSrc = fileURL;
        // const pdfWindow = window.open("");
        // pdfWindow!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");
        this.directEsign(data2)
// this.pdfpreviewpk(data2)
      }

    })
  }
  directEsign(data2:any)
  {
    let data={
  "reportPath": data2.reportPathFR,
  "name":"task_data_id",
  "value":data2.taskDataIdFR,
  "sourceId":3,
  "processName":"PENSION_AUTO_PROCESS",
  "identifier":2,
  "identifierType":"DDO",
  "signName":"Addl Director Pension Pensioners Welfare.",
  "reason":"Approved",
  "location":"Jaipur",
  "searchText":"¥",
  "docName":data2.docNameFR,
  "docTypeId":"36",
  "docId":0
    }
    this._Service.postNewEsign("withOutOTPEsign", data).subscribe((res: any) => {
      res=JSON.parse(res)
      console.log(res)
    // console.log(res.data.document[0].docId);
    if(res.status=='success')
    {
      let data1=JSON.parse(res.data)
      console.log(data1)
      this.docIdFR=data1.DocId;
        this. updateDocId(36,data1.DocId,data2,1)
      
    }
    
    
    })
  }
  pdfpreviewpk(data2: any) {
    console.log("preview", data2);

    let data = {
      "reportPath": data2.reportPathPK,
      "format": "pdf",
      "params": [
        {
          "name": "pensioner_id",
          "value": data2.pensionerId
        }
      ]
    }
    console.log("single report data", data)
    this._Service.postOr("report/singlereport", data).subscribe((res: any) => {
      // console.log("res", res.data.report.content);
      if (res.data.report.content) {
        const byteArray = new Uint8Array(
          atob(res.data.report.content)
            .split("")
            .map(char => char.charCodeAt(0))
        );
      
        const file = new Blob([byteArray], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
      
          this.directEsignPK(data2)
      }
      
    })
  }
  directEsignPK(data2:any)
  {
    let data={
  "reportPath": data2.reportPathPK,
  "name":"pensioner_id",
  "value":data2.pensionerId,
  "sourceId":3,
  "processName":"PENSION_AUTO_PROCESS",
  "identifier":2,
  "identifierType":"DDO",
  "signName":"Addl Director Pension Pensioners Welfare.",
  "reason":"Approved",
  "location":"Jaipur",
  "searchText":"¥",
  "docName":data2.docNamePK,
  "docTypeId":"34",
  "docId":0
    }
    this._Service.postNewEsign("withOutOTPEsign", data).subscribe((res: any) => {
  
    res=JSON.parse(res)
    
  console.log(res)
    if(res.status=='success')
    {
      let data1=JSON.parse(res.data)
      console.log(data1)
      this.docIdPS=data1.DocId;
        this. updateDocId(34,data1.DocId,data2,2)
      
    }
    })
  }
  pdfpreviewSS(data2: any) {
    console.log("preview", data2);

    let data = {
      "reportPath": data2.reportPathPK,
      "format": "pdf",
      "params": [
        {
          "name": "pensioner_id",
          "value": data2.pensionerId
        }
      ]
    }
    console.log("single report data", data)
    this._Service.postOr("report/singlereport", data).subscribe((res: any) => {
      // console.log("res", res.data.report.content);
      if (res.data.report.content) {
        const byteArray = new Uint8Array(
          atob(res.data.report.content)
            .split("")
            .map(char => char.charCodeAt(0))
        );
        // this.pdfSrc = "";
        const file = new Blob([byteArray], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        // this.pdfSrc = fileURL;
        // const pdfWindow1 = window.open("");
        // pdfWindow1!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");
          this.directEsignSS(data2)
      }
      
    })
  }
  directEsignSS(data2:any)
  {
    let data={
  "reportPath": data2.reportPathPKS,
  "name":"pensioner_id",
  "value":data2.pensionerId,
  "sourceId":3,
  "processName":"PENSION_AUTO_PROCESS",
  "identifier":2,
  "identifierType":"DDO",
  "signName":"Addl Director Pension Pensioners Welfare.",
  "reason":"Approved",
  "location":"Jaipur",
  "searchText":"¥",
  "docName":data2.docNamePKS,
  "docTypeId":"261",
  "docId":0
    }
    this._Service.postNewEsign("withOutOTPEsign", data).subscribe((res: any) => {
  
    res=JSON.parse(res)
    
  console.log(res)
    if(res.status=='success')
    {
      let data1=JSON.parse(res.data)
      console.log(data1)
      this.docIdSS=data1.DocId;
        this. updateDocId(261,data1.DocId,data2,3)
      
    }
    })
  }
  updateDocId(docTypeId: any,docId:any,data2:any,i:any) {
    
    let data = {
      "dmsDocId": docId,
      "pensionerId": data2.pensionerId,
      "docTypeId": docTypeId
    }
    this._Service.postPssRequest(data, "pensionerdocument").subscribe({
      next: (res) => {
        //console.log("res", res);
        if(i==3)
        {
          this.load.hide();
       
          // this.dialog.closeAll();
        }
        if (res.status == "SUCCESS") {
        } else {
          // alert("Something went wrong");
        }
      },
      error: (err) => {
        // alert("Something went wrong");
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }
    })
  }
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
  commutationDateCalculation() {
  
if(this.ServiceDetails.commuationPercentage=="0")
{
  this.ServiceDetails.commuationPercentage="";
}

    let data = {
      "employeeCode": this.Personaldetail?.employeeCode,
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
      "cpoEfDate": this.Personaldetail?.comDate?this.Personaldetail?.comDate:"",
      "isPaperLess": 0,
      "cpoValue":this.ServiceDetails?.commuationPercentage? this.ServiceDetails?.commuationPercentage.toString():"",
      "deFlag":  this.serviceRecordDatanew.deStatus,
      "deType":  this.serviceRecordDatanew.deType.toString() ,
      "qualifyingService": [],
      "nonQualifyingService": [],
      "isPayCommission": this.Calculations_Pay_Details?.payCommissionNameEn ? this.Calculations_Pay_Details.payCommissionNameEn : '',
      "isMilitary": '',

    }

    
    console.log("data", data);
    var ser_data: any[] = [];
    this._Service.postRequestpension(data, 'callPensionCalculationRuleEngine').subscribe({
      next: (res) => {
       

          console.log("res", res);
          ser_data.push(res.data);
          console.log("res", ser_data);


          this.Pension_Commutation = res.data

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

refrsh()
{
  this.ngOnInit();
}
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

    }

    console.log("date", this.Pension_Commutation);
    console.log("data", data);
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
      "empId": this.data.employeeCode,
      "psnInitiated": true,
      "psnType": "S",
      "psnStatus": "I"
    }
    console.log("data", data)
    this._Service.postCumm("updateEmployeePensionStatus", data).subscribe((res: any) => {
console.log("updateEmployeePensionStatus",res)
    })
  }
}

