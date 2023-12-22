import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { AppConfig } from 'src/app/app.config';
import { CommonService } from 'src/app/services/common.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};
@Component({
  selector: 'app-revised-cpo',
  templateUrl: './revised-cpo.component.html',
  styleUrls: ['./revised-cpo.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class RevisedCpoComponent implements OnInit {
 userDetails:any;
  empId:any;
  maxDate:any;
  empCode:any;
  config: AppConfig = new AppConfig();
  constructor(public _Service:PensionServiceService,public common:CommonService) { }

  ngOnInit(): void {
    this.userDetails = this.config.getUserDetails();
    this._Service.configMenu = { url: "Inbox > Revise CPO" };
  }
  Personaldetail:any
  dateofRetirement:any;

  comDate:any;
  fetchPersonaldetail() {
    let data = {
      employeeId: this.empId
    }
    this._Service.postRequestpension(data, 'getPersonaldetailsByEmpCode').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.Personaldetail = res.data[0];
          this.Personaldetail = JSON.parse(JSON.stringify(this.Personaldetail).replace(/\:null/gi, "\:\"\""));
          this.dateofRetirement = this.Personaldetail.dor;
          this.maxDate=new Date(this.dateofRetirement)
          if(this.Personaldetail.comDate!='' )
          {
            
            let data:string= this.Personaldetail.comDate.toString()
            if(data.includes('T'))
            {
              let data1:any[]=data.split('T');
              this.comDate=new Date(data1[0])
              console.log("data",this.comDate)
            }else{
              this.comDate=new Date(data)
              console.log("data",this.comDate)
            }
          }else
          {
            let dates = new Date(this.dateofRetirement)
            console.log("dates", dates);
    
            dates.setDate(dates.getDate() + 1);
            console.log("dates", dates);
            this.comDate=dates
             if (this.ServiceDetails.serviceCatId === 1) {
     
        this.ServiceDetails.commuationPercentage = 40;
       
     

    } else if (this.ServiceDetails.serviceCatId === 13 || (this.ServiceDetails.serviceCatId === 7 && this.ServiceDetails.serviceSubcatId === 108)) {
     
        this.ServiceDetails.commuationPercentage = 50;
       
    } else {
      
        this.ServiceDetails.commuationPercentage = 33.33;
       
    }
          }
      
       
        }
      },
      error: (err) => {
     
      }

    });
    console.log("Personal details", this.Personaldetail);
  }
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
        
      }
    }


  }


  ServiceDetails:any={
    "commuationPercentage":0
  }
  isCommutation:boolean=false
  fetchServicesdetail() {

    let data = {
      employeeId: this.empId
    }
    this._Service.postRequestpension(data, 'getServicedetailsByEmpCode').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.ServiceDetails = res.data;
          
          this.ServiceDetails = JSON.parse(JSON.stringify(this.ServiceDetails).replace(/\:null/gi, "\:\"\""));
          console.log("ServiceDetails", this.ServiceDetails);

         
          if (this.ServiceDetails.optForCommutation == 'Yes') {
            this.isCommutation = true;

          } else if (this.ServiceDetails.optForCommutation == 'No') {
            this.isCommutation = false;
          }
if(this.ServiceDetails.commuationPercentage == '0'|| this.ServiceDetails.commuationPercentage == '')
{
  if (this.ServiceDetails.serviceCatId === 1) {
     
    this.ServiceDetails.commuationPercentage = 40;
   
 

} else if (this.ServiceDetails.serviceCatId === 13 || (this.ServiceDetails.serviceCatId === 7 && this.ServiceDetails.serviceSubcatId === 108)) {
 
    this.ServiceDetails.commuationPercentage = 50;
   
} else {
  
    this.ServiceDetails.commuationPercentage = 33.33;
   
}
}
          
        this.getBudgetDetails(this.ServiceDetails);

        }

      },
      error: (err) => {

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
  maxDate2:any
  fetchData(){
    if(this.empCode==null || this.empCode=="")
    {
      alert("Please insert employee Code first");
      return;
    }else{
  
    this.getOldPensionDetails()
    }
  }
  Pension_Commutation:any;
  isCalculate:boolean=false;
  commutationDateCalculation() {
  this.isCalculate=true
    if(this.ServiceDetails.commuationPercentage=="0")
    {
      this.ServiceDetails.commuationPercentage="";
    }
    this.Personaldetail.comDate=this.comDate
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
          "cpoEfDate": this.Personaldetail?.comDate?moment(this.Personaldetail?.comDate).format("DD-MM-YYYY"):"",
          "isPaperLess": 0,
          "cpoValue":this.ServiceDetails?.commuationPercentage? this.ServiceDetails?.commuationPercentage.toString():"",
          "deFlag":  0,
          "deType": "" ,
          "qualifyingService": [],
          "nonQualifyingService": [],
          "isPayCommission": '',
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
      oldPensionDateails:any
      getOldPensionDetails()
      {
        let data ={
          "ppoNo":"0",
          "empCode":this.empCode,
          "psnId":"0",
          "empId":"0"
        }
    
        this._Service.postdetype(data, "getpsndetailsbyids").subscribe({
          next: (res) => {
            if (res.status = 200) {
          
    this.oldPensionDateails=res.data;
    this.empId=this.oldPensionDateails.empId;
    console.log(this.oldPensionDateails)
    this.fetchPersonaldetail();
    this.fetchServicesdetail();
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
  dateChange(data:any)
  {
this.Personaldetail.comDate=data;
  }
  getBudHeadId = (id: string) => {
    if (this.BudgetDetails?.length > 1)
      return this.BudgetDetails.filter((x: any) => x.psbBdgtHeadTypName == id)[0].budgetHeadId;
    else
      return "";
  }
  submit()
  {
if(this.isCalculate)
{

this.Pension_Commutation["budgetHeadId"]= this.getBudHeadId('Commutation');
this.Pension_Commutation["pensionerId"]= this.oldPensionDateails.psnId;
this.Pension_Commutation["createbyA"]= this.userDetails.assignmentid;
this.Pension_Commutation["createbyU"]= this.userDetails.assignmentid;
console.log("submitData",this.Pension_Commutation)

this._Service.postdetype(this.Pension_Commutation, "revisedcpo").subscribe({
  next: (res) => {
    res=res.data;
    console.log("submit",res);
    if(res.status=="Success")
    {
    // alert(res.msg)
    let frData={
      'reportPath':this.oldPensionDateails.reportPathFR,
      'name':"task_data_id",
      'value':this.oldPensionDateails.taskDataId,
      'docName':this.oldPensionDateails.docNameFR,
      'pensionerId':this.oldPensionDateails.psnId,
    }
    let PKData={
      'reportPath':this.oldPensionDateails.reportPathPK1,
      'name':"pensioner_id",
      'value':this.oldPensionDateails.psnId,
      'docName':this.oldPensionDateails.docNamePK,
      "pensionerId":this.oldPensionDateails.psnId,
    }
    let PKSData={
      'reportPath':this.oldPensionDateails.reportPathPK2,
      'name':"pensioner_id",
      'value':this.oldPensionDateails.psnId,
      'docName':this.oldPensionDateails.docNamePKS,
      'pensionerId':this.oldPensionDateails.psnId,
    }
    this.common.directEsign(frData,36);  
    setTimeout(()=>{
      this.common.directEsign(PKData,34);
    },1000);
    setTimeout(()=>{
      this.common.directEsign(PKSData,261);
    },2000)
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
}else
{
  alert("Please calculate new pension ");
}
  }
}
