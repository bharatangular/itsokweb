import { Component, OnInit } from '@angular/core';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-request-pay-manager',
  templateUrl: './request-pay-manager.component.html',
  styleUrls: ['./request-pay-manager.component.scss']
})
export class RequestPayManagerComponent implements OnInit {

  constructor(public _Service:PensionServiceService) { }
  empCode:any;
  employeeData:any;
  Personaldetail:any;
  ServiceDetails:any;
  pType:any;
  psnTypeId:any;
  Pension_Commutation:any;
  doj:any;
  ngOnInit(): void {
    this._Service.configMenu = { url: "Request Data from Pay Manager" };
  }
  
  getEmployeeData = () => {

    this._Service.postNewEmployee('getEmployeeDetailsByType', {
      employeeId:this.empCode , inType: 8
    }).subscribe({
      next: res => {
       console.log("res",res.data.employeeOtherDetails[0])
       this.employeeData=res.data.employeeOtherDetails[0];
       if(this.employeeData?.pensionType=="S")
       {
         this.pType="Superannuation";
         this.psnTypeId=68;
       }else if(this.employeeData?.pensionType=="V")
       {
         this.pType="Voluntary Retirement Pension U/R 50";
         this.psnTypeId=69;
       }
        this.fetchPersonaldetail();
        this.fetchServicesdetail();
        this.pensionCalculation();
      }, error: err => {
      }
    })
  }
  fetchPersonaldetail() {
    let data = {
      employeeId: this.employeeData?.employeeId
    }
    this._Service.postRequestpension(data, 'getPersonaldetailsByEmpCode').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.Personaldetail = res.data[0];
          this.Personaldetail = JSON.parse(JSON.stringify(this.Personaldetail).replace(/\:null/gi, "\:\"\""));
         
        }
      },
      error: (err) => {
       
      }

    });

  }


  // ****************************SERVICE DETAIL****************************************

  fetchServicesdetail() {

    let data = {
      employeeId: this.employeeData?.employeeId
    }
    this._Service.postRequestpension(data, 'getServicedetailsByEmpCode').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.ServiceDetails = res.data;
          this.ServiceDetails = JSON.parse(JSON.stringify(this.ServiceDetails).replace(/\:null/gi, "\:\"\""));
         this.doj=this.ServiceDetails.filter((x:any)=>x.acronym=="DOJ")[0].dateValue
        }

      },
      error: (err) => {
      }
    });

  }
  pensionCalculation() {
    
    let data = {
      "employeeCode": this.empCode,
      "pensionTypeId": this.psnTypeId,
      "withheldAmount": 0,
      "deductionAmount": [
      ],
      "recoveryAmount": [
      ],
      "allowanceAmount": 0,
      "dateOfVCD": "",
      "cpoEfDate": "",
      "cpoValue": 0,
      "isPaperLess": 0,
      "deFlag": 0,
      "deType": "",
      "tenBasicPay":  0,
      "addedJoiningDate": "",
      "marStatus":"",
      "npa": 0,
      "addedServicesGratuityAmount":0,
      "qualifyingService": [
      ],
      "nonQualifyingService": [
      ]
    }
    console.log("data", data);
    
    var ser_data: any[] = [];

  
      
      this._Service.postRequestpension(data, 'callPensionCalculationRuleEngine').subscribe({
        next: (res) => {
          
          if ((res.status = 200)) {
            this.Pension_Commutation = res.data;
           
          }
        },
        error: (err) => {
         
        },
      });

  }
}
