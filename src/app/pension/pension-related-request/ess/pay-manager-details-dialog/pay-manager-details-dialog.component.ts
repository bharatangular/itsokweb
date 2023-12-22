import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiEssService } from 'src/app/services/api-ess.service';

@Component({
  selector: 'app-pay-manager-details-dialog',
  templateUrl: './pay-manager-details-dialog.component.html',
  styleUrls: ['./pay-manager-details-dialog.component.scss']
})
export class PayManagerDetailsDialogComponent implements OnInit {
  user: any ;
  personalDetail: any ;
  serviceDetails: any ;
  entitlementDetails: any ;
  flgEss:boolean=false;
  mess: string;
  bDay: any ;
  bMonth: any ;
  rMonth: any ;
  formattedDOB:any;
  formattedRetirement:any;
  paymagerDetails:any;
  constructor(private apiService: ApiEssService,private datePipe: DatePipe,private dialogRef: MatDialogRef<PayManagerDetailsDialogComponent>,@Inject(MAT_DIALOG_DATA)
  private data: any){ }


  ngOnInit(): void {
 console.log("data-dialog",this.data)
    this.getEmployeeData(this.data.empId, 1);
    // this.getEmployeeData(this.data.empId, 4);
    // this.getEmployeeData(this.data.empId, 6);
  
  }
  closeDialog()
  {
    this.dialogRef.close({ data: this.paymagerDetails });
  }
  // payMangerData(empId:any)
  // {
    
  // this.apiService.paymanager("getEmployeeDetails",{"employeeId":empId}).subscribe((res:any)=>{
  //   console.log("paymanagerData",res)
  //   if(res.data)
  //   {
  //     this.paymagerDetails=res.data
  //   }
  // },(error)=>{
  //   alert("Error in Paymanager Service.");
  // })
  // }
  getEmployeeData = (empId: any, intype: number) => {

    this.apiService.postmst('getEmployeeDetailsByType', {
      employeeId: empId, inType: intype
    }).subscribe({
      next: res => {
        const data = res.data;
        switch (intype) {
          case 1:
            this.personalDetail = data.employeePersonalDetail;
            // this.checkDataRef();
            // this.payMangerData(data.employeePersonalDetail.employeeId);
            break;
          case 4:
            this.serviceDetails = data.employeeServiceDetails;
            break;
          case 6:
            this.entitlementDetails = data.payEntitlementDetails;
           // this.checkDateStatus();
            break;
           
        }
       
      }
    });
  }


  checkDateStatus()
  {
    this.flgEss = true;
  //   if (this.personalDetail?.dob||this.serviceDetails?.retirementDate) {
  //     this.formattedDOB = this.datePipe.transform(this.personalDetail.dob, 'dd-MM-yyyy');
  //     this.formattedRetirement = this.datePipe.transform(this.serviceDetails?.retirementDate, 'dd-MM-yyyy');
  // this.bDay=this.datePipe.transform(this.personalDetail.dob, 'dd');
  // this.bMonth=this.datePipe.transform(this.personalDetail.dob, 'MM');
  // this.rMonth= this.datePipe.transform(this.serviceDetails.retirementDate, 'MM');


  //     if(this.bDay>=1)
  //     {
        
  //       if(this.bMonth==this.rMonth)
  //       {
  //         alert("hhii"+this.bMonth==this.rMonth)
  //         this.flgEss = true;
  //       }

  //     }
  //     else if(this.rMonth>this.bMonth)
  //     {
  //       alert("mm"+this.rMonth>this.bMonth)
  //       this.flgEss = true;
  //     }
  //    else {
  //     this.flgEss = false;
  //   }
  // }
  }
  checkDataRef() {

    let data = {
      "employeeCode":this.personalDetail.employeeCode,
      "inType": 8,
    }
    this.apiService.postmst('getPensionRevertEmpDetails', data).subscribe((res: any) => {
      if (res.status == "SUCCESS") {
       
        if (res.data.message ==0) {
          this.flgEss = true;
        }
        else if(res.data.message == 1){
          this.flgEss = false;
          this.mess="आपका डेटा अपडेट करने की प्रक्रिया चल रही है, इसलिए कृपया प्रतीक्षा करें और कुछ समय बाद प्रयास करें............";
        }
        else{
          alert("Something went wrong")
        }
      }
    },
      (error) =>
        console.log(error)
    )
  }
  getRefBaseData()
  {
    // this.loaderService.startLoader()
    let data = {
      "employeeCode": this.personalDetail.employeeCode,
      "employeeId": 0,
      "empStatus": 1,
      "inType": 4,
    }
    this.apiService.postmst('getPensionRevertEmpDetails', data).subscribe((res: any) => {
    if(res.status=="SUCCESS")
        {
        if( res.data.message=="Duplicate Data Not Allowed!!")
        {
          this.flgEss = true;
          alert("Data Already Exist Please Continue...");
        }
        else if(res.data.message=="DATA ALREADY EXIST"){
          this.flgEss = true;
          alert("Data Already Exist Please Continue...");
        }

        else{
          this.flgEss = false;
          alert(res.data.message);
        }
        setTimeout(() => {
          // this.loaderService.stopLoader();
        }, 1000);
        }
    },
      (error) => {}
          // this.loaderService.stopLoader(),
          //console.log(error) 
        )

      }
}

