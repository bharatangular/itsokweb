import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiEssService } from 'src/app/services/api-ess.service';

import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-basic-details-popup',
  templateUrl: './basic-details-popup.component.html',
  styleUrls: ['./basic-details-popup.component.scss']
})
export class BasicDetailsPopupComponent implements OnInit {

    user: any ;
    personalDetail: any ;
    serviceDetails: any ;
    entitlementDetails: any ;
    flgEss:boolean=true;
    mess: string;
    bDay: any ;
    bMonth: any ;
    rMonth: any ;
    formattedDOB:any;
    formattedRetirement:any;
    employeeBankDetails:any
    reason:any;
    reasonRevisonList:any[]=[];
    reasonRevison:any;
    isReason:boolean=false;
  
    constructor(private apiService: ApiEssService,
      public api:ApiEssService,
      private datePipe: DatePipe,
      private dialogRef: MatDialogRef<BasicDetailsPopupComponent>,
      @Inject(MAT_DIALOG_DATA)
    private data: any,
    public common:CommonService){ }
  
  
    ngOnInit(): void {
      // this.user = this.apiService.userInfo();
      console.log("aa",this.data)
      this.getRevisionReason();
      this.getMaritalStatus();
      this.getMinorityList();
      this.getCasteCategory();
      this.getReligion();
     this.Designation();
     this.PayCommission();
      this.getServiceQuota();
      this.getEmployeeData(this.data.empId, 1);
      this.getEmployeeData(this.data.empId, 3);
      this.getEmployeeData(this.data.empId, 4);
      this.getEmployeeData(this.data.empId, 6);
    
    }
    getRevisionflag()
    {
     
      let data={
        "employeeId": this.personalDetail?.employeeId,
        "inType": 14
      }
      console.log("revisedata",data)
      this.api.postNewEmployee("getPensionRevertEmpDetails",data).subscribe((res:any)=>
      {
        if(res.data)
        {
          if(res.data.ISREVISIONUNDERPROCESS=="N")
          {
           this.isReason=true
           
          }
        }
      },(error)=>{
          alert("Error in revisionflag service");
      })
     
    }
   saveReason()
   {
    if(!this.reason)
    {
      alert("select reason")
      return;
    }
    if(this.reasonRevisonList.length<1)
    {
      this.reasonRevisonList.push(this.reason)
    }else{
      let r_check=this.reasonRevisonList.filter((x:any)=>x==this.reason);
     
      if(r_check.length>0)
      {
        alert("You already select this reason.")
      }else
      {
        this.reasonRevisonList.push(this.reason)
      }
    }
    console.log("list",this.reasonRevisonList)
   }
    getRevisionReason()
    {
      let data = {
        "inMstType":30,
       
        }
        this.apiService.postWf('allmstdata', data).subscribe({
          next: (res) => {
            
            if (res.status = 200) {
             this.reasonRevison = JSON.parse(res.data);
              console.log("reasonRevison",this.reasonRevison)
             
            }
          },
      
        })
    }
    dialog_close()
    {if(this.isReason){
      if(this.reasonRevisonList.length<1)
      {
        alert("Please select minimum one reason.");
        return;
      }
      let reason:any;
      this.reasonRevisonList.forEach((element:any,index)=>
      {
        if(index==0)
        reason=element;
        else
        reason=reason+','+element;
    
      })
     let data= {	 
        "inMstType": 4,
        "requestData":  [{
                "employeeId": -1,
                "employeeCode": this.data.empId,
                "revisionReason ": reason
            } ] 
    }  
         console.log("reason revision",data);
                   this.apiService.empServicese("essWorkMultiTask",data).subscribe((res:any)=>{
  
                   },(error)=>{
                   alert("update revision flag service not work.Please Submit again.")
                   })
    }
      
      this.dialogRef.close({ data: "" });
    }
  

    getEmployeeData = (empId: any, intype: number) => {
  
      this.apiService.postmst('getEmployeeDetailsByType', {
        employeeId: empId, inType: intype
      }).subscribe({
        next: res => {
          const data = res.data;
          switch (intype) {
            case 1:
              this.personalDetail = data.employeePersonalDetail;
              this.checkDataRef();
              this.getRevisionflag()
              break;
              case 3:
                this.employeeBankDetails = data.employeeBankDetails;
              
                break;
            case 4:
              this.serviceDetails = data.employeeServiceDetails;
              this.getEntitalment()
              break;
            case 6:
              this.entitlementDetails = data.payEntitlementDetails;
             this.payScale()
              break;
             
          }
         
        }
      });
    }

    checkDateStatus()
    {
      if (this.personalDetail?.dob||this.serviceDetails?.retirementDate) {
        this.formattedDOB = this.datePipe.transform(this.personalDetail.dob, 'dd-MM-yyyy');
        this.formattedRetirement = this.datePipe.transform(this.serviceDetails?.retirementDate, 'dd-MM-yyyy');
    this.bDay=this.datePipe.transform(this.personalDetail.dob, 'dd');
    this.bMonth=this.datePipe.transform(this.personalDetail.dob, 'MM');
    this.rMonth= this.datePipe.transform(this.serviceDetails.retirementDate, 'MM');
  
  
        if(this.bDay>=1)
        {
          
          if(this.bMonth==this.rMonth)
          {
            alert("hhii"+this.bMonth==this.rMonth)
            this.flgEss = true;
          }
  
        }
        else if(this.rMonth>this.bMonth)
        {
          alert("mm"+this.rMonth>this.bMonth)
          this.flgEss = true;
        }
       else {
        this.flgEss = false;
      }
    }
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
          
          }
      },
        (error) => 
            {}
            //console.log(error) 
          )
  
        }
        maritalStatusList:any;
        getMaritalStatus = () => {        
                     this.apiService.postmdm('getMaritalStatus', {}).subscribe({
              next: (res) => {
                this.maritalStatusList = res.data;               
              }
            })          
          }
         
        
        getMaritalStatusName = (id:any) => {         
          if(id)
          {            
            return this.maritalStatusList?.filter((x:any)=>x.mStatusId==id)[0]?.mStatusName;
          }         
        }
        minorityList:any;
        getMinorityList = () => {
          this.apiService.postmdm('getMinorityList', {}).subscribe({
            next: (res) => {
              this.minorityList = res.data;
            }
          })
        }
        getMinorityListName = (id:any) => {
          if(id)
          {            
            return this.minorityList?.filter((x:any)=>x.minorCatId==id)[0]?.MinorCatNameEn
          }   
        }
        religionList:any;
        getReligion = () => {
          this.apiService.postmdm('getReligion', {}).subscribe({
            next: (res) => {
              this.religionList = res.data;
            }
          })
        }
        getReligionName = (id:any) => {
           if(id)
          {            
            return this.religionList?.filter((x:any)=>x.religionId==id)[0]?.religionNameEn
          }   
        }
        casteCategoryList:any;
        getCasteCategory = () => {
          this.apiService.postmdm('getCasteCategory', {}).subscribe({
            next: (res) => {
              this.casteCategoryList = res.data;
            }
          })
        }
        getCasteCategoryName = (id:any) => {
          if(id)
         {            
           return this.casteCategoryList?.filter((x:any)=>x.categoryId==id)[0]?.catNameEn
         }   
       }
       entitalmentList:any;
       getEntitalment = () => {
       
          this.apiService.postmdm('getEntitlementDetails', { servicecatId: this.serviceDetails.serviceCategory }).subscribe({
            next: (res) => {
              this.entitalmentList = res.data;
            }
          })
        
      
      }
      getEntitalmentName = (id:any) => {
        if(id)
       {            
         return this.entitalmentList?.filter((x:any)=>x.entId==id)[0]?.entStatus
       }   
     }
     getServiceQuotaList:any;
     getServiceQuota = () => {
      this.apiService.postmdm('getServiceQuota', {}).subscribe({
        next: (res) => {
          this.getServiceQuotaList = res.data;
        }
      })
    }
    getServiceQuotaName = (id:any) => {
      if(id)
     {            
       return this.getServiceQuotaList?.filter((x:any)=>x.quotaId==id)[0]?.quotaNameEn
     }   
   }
   designationlist:any
   Designation = () => {
    this.apiService.postmdm('getDesignation', {}).subscribe(res => {
      this.designationlist = res.data
    })
  }
  getDesignationName = (id:any) => {
    if(id)
   {            
     return this.designationlist?.filter((x:any)=>x.desgId==id)[0]?.desgDescEn
   }   
 }

  payCommissionlist:any
  PayCommission = () => {
    this.apiService.postmdm('getPayCommission', {}).subscribe(res => {
      this.payCommissionlist = res.data

    })
  }
  PayCommissionName = (id:any) => {
    if(id)
   {            
     return this.payCommissionlist?.filter((x:any)=>x.payCommisionId==id)[0]?.payCommNameEn
   }   
 }
  payScalelist:any
  payScale = () => {
    let data = {
      "payCommissionId": this.entitlementDetails.payCommission,
    }
    this.apiService.postlmdm('getPayScale', data).subscribe(res => {
      if (res.data.status = 200) {
        this.payScalelist = res.data
       
       
      }
    })
  }
  payScaleName = (id:any) => {
    if(id)
   {            
     return this.payScalelist?.filter((x:any)=>x.payScaleId==id)[0]?.payScaleName
   }   
 }
 stepc = 0;
 nextStepc() {
  
  this.stepc++;
}
prevStepc() {
  this.stepc--;
}
  }
  