import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { PensionServiceService } from 'src/app/services/pension-service.service';
import * as moment from 'moment';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
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
  selector: 'app-service-record-dialog',
  templateUrl: './service-record-dialog.component.html',
  styleUrls: ['./service-record-dialog.component.scss'],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})


export class ServiceRecordDialogComponent implements OnInit {
  searchTxt:any;
  DEstart_Date:any;
  DEend_Date:any
  Remark:any;
  Penalty_Type:any
  Penalty:any;
  detypestatus:any;
  totalService:any;
  fromDate:any;
  toDate:any;
  typeId:any;
  deptName:any;
  isGratuity:any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  displayedColumns: string[] = ['SR.NO.',"ServiceName", "FromDate","ToDate","TotalService", 'Remove'];
  serviceList:any[]=[];
  serviceRecords:any[]=[];
  commonDateCheck:any;
  totalS:any=""
  joiningDate:any;
  RetirementDate:any;
  maxDate:any;
reMaxdate:any;
serMinDate:any;
serMaxDate:any;
dateofBirth:any;
min18year:any;

  constructor(private date:DatePipe,public _Service:PensionServiceService,private dialogRef: MatDialogRef<ServiceRecordDialogComponent>,@Inject(MAT_DIALOG_DATA)
  private data: any) {
  
    // this.dateofBirth=moment(data.dob).format('DD-MM-YYYY');
    this.dateofBirth= moment(data.dob,'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss')
  
    this.min18year = new  Date( this.dateofBirth);
    
    this.min18year = new Date(this.min18year.getFullYear()+18,this.min18year.getMonth(),this.min18year.getDate())
  
    // this.joiningDate= moment(data.doj).format("DD-MMM-YYYY");
    this.joiningDate=moment(data.doj,'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss')
   
    this.RetirementDate=data.dor;
   
    this.maxDate = new  Date( this.joiningDate);
    
    this.maxDate = new Date(this.maxDate.getFullYear(),this.maxDate.getMonth(),this.maxDate.getDate()-1)
    

    this.reMaxdate = new  Date(this.RetirementDate);
   
    this.reMaxdate = new Date(this.reMaxdate.getFullYear(),this.reMaxdate.getMonth(),this.reMaxdate.getDate()-1)
    
    this.serMinDate=this.maxDate;
    this.serMaxDate=this.reMaxdate;
    setTimeout(()=>{                           
      this.patchData();
      this.totalS=this.data.field.totalServiceLength
  }, 200);
   }
   orgLengthCheck()
   {
    if(this.deptName.length>99)
    {
      alert("In Organization Name max 100 character allow")
    }
   }
   dateChange()
   {

    if(this.getQualifying(this.typeId)=="Y")
    {
      this.serMaxDate=this.maxDate;
      this.serMinDate=this.min18year;
    }else if(this.getQualifying(this.typeId)=="A")
    {
      this.serMaxDate=this.maxDate;
      this.serMinDate=this.min18year;
    }else{     

      this.serMaxDate=this.reMaxdate;
      this.serMinDate=this.maxDate;
    }

   }
  ngOnInit(): void {
    console.log("data",this.data);
    
    this.getServiceList();
    this.getDeType();
    this.getLoanType();
    this.getPenaltyTypes();

    
  }
  patchData()
  {
    console.log("dataSD",this.data.field);
    this.serviceRecords=this.data.field.serviceRecordDetails;
this.dataSource=new MatTableDataSource(this.serviceRecords);
this.detypestatus=this.data.field.deStatus;
this.showHideFields(Number(this.data.field.deStatus))
this.showHideRemark(Number(this.data.field.penalty))
   this.Penalty=this.data.field.penalty;
    this.Penalty_Type=this.data.field.penaltyType;
     this.Remark=this.data.field.remark;
     this.DE_Type=Number(this.data?.field?.deType)
     this.DEstart_Date=new Date(this.data.field.deStartDate);
     this.DEend_Date=new Date(this.data.field.deEndDate);
   this.deDateEnd=this.data.field.deEndDate
    this.deDateStart=this.data.field.deStartDate
    
  }
  getServiceList()
  {
    
    this._Service.postPssRequest({}, "getservicedetails").subscribe({
      next: (res) => {
        if (res.status = 200) {
          console.log(res);
          this.serviceList=res.data;
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
   
    console.log("this.serviceList",this.serviceList);
    
  }
  isDeStatus:boolean=false
  showHideFields(val: any) {
      
    if (val === 1) {
      
      this.isDeStatus = true;
    } else {
     
      this.isDeStatus = false;
      
    }
  
  }
  isPenalty:boolean=false
  showHideRemark(val: any) {
    if (val === 1) {
      this.isPenalty = true;
    } else {
      this.isPenalty = false;
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
    loantypelist:any;
    getLoanType() {

      let data ={
        "attrValue":1
      }

      this._Service.postloantype(data, "getLoanTypeData").subscribe({
        next: (res) => {
          if (res.status = 200) {
          
this.loantypelist=res.data.loanTypeData;
//console.log(this.loantypelist);
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
    treasurylist:any;
    getTreasuryName = (id: string) => {
      if(this.treasurylist>1)
      return this.treasurylist.filter((x: any) => x.treasCode == id)[0].treasNameEn;
      else
      return ""
  }
  getLoanTypeName = (id: string) => {
    return this.loantypelist.filter((x: any) => x.loanTypeId == id)[0].loanTypeNameEn;
}
totalDays:any;
add:boolean=true;
newstart:any;
newend:any
  dateRangeChange(dateRangeStart:any, dateRangeEnd:any)
  {
    this.newstart="";
   this.newend="";
   console.log(dateRangeStart)
   console.log(dateRangeEnd)
 
    this.fromDate = dateRangeStart;
    this.toDate = dateRangeEnd;
    console.log(" this.fromDate ", this.fromDate )
    console.log(" this.toDate ", this.toDate )
    let data={
      "fromDate":dateRangeStart,
      "toDate":dateRangeEnd
    }
    this._Service.post("calculatetotaldays", data).subscribe((res: any) => {
      if(res.status=="SUCCESS")
      {
       
        res=JSON.parse(res.data)
        this.totalService="";
        this.totalService= (res.year)+' years '+(res.month)+' months '+(res.totalDays)+' days';
        console.log("this.totalService",this.totalService)
      }
     
   
    })
      let currentDate:any=new Date(this.fromDate);
      let datasend1:any=moment(dateRangeEnd,"dd-MMM-yyyy")
      let dateSent:any=new Date(datasend1);
      
let timeDiff = Math.abs(currentDate.getTime() - dateSent.getTime());


console.log("this.timeDiff1",timeDiff)
let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
var date_Data:any[]=[]
date_Data.push({
  sum: diffDays
});
var total = 0
for (var i = 0; i < date_Data.length; i++) {
  total += date_Data[i].sum;
}
    this.totalDays=total+1;
  }
  deDateStart:any;
  deDateEnd:any;
  deFromDate:any;
  deToDate:any;
  nonQualifyingServicestart_Date:any;
  nonQualifyingServiceend_Date:any
 // deDateRangeChange2(dateRangeS: HTMLInputElement, dateRangeE: HTMLInputElement){
    
    // this.deDateStart = new Date(dateRangeS.value);
    // this.deDateEnd = new Date(dateRangeE.value);
   
    
    // if( (new Date (this.todate)) > (new Date(this.deFromDate))) {
    //   this.serviceRecordForm.patchValue({
    //     DEstart_Date: '',
    //     DEend_Date: ''
    //   });
    //   alert("Date already selected");

    // }
  //}
  penaltytypelist:any;
  getPenaltyTypes() {

    let data ={
      
    }

    this._Service.postdetype(data, "getPenaltyTypes").subscribe({
      next: (res) => {
        if (res.status = 200) {
        
this.penaltytypelist=res.data;

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
  alldateGap:any[]=[]
  dateGap:any
  addService()
  {if(this.totalService && this.deptName )
    {
      if(this.deptName.length>99)
      {
        alert("In Organization Name max 100 character allow");
        return;
      }
    this.add=true;
    // this.dateGap = this.date.transform(this.fromDate, 'dd/MMM/yyyy') + ' - ' + this.date.transform(this.toDate, 'dd/MMM/yyyy');
    console.log(this.alldateGap)
    if(this.alldateGap.length<1)
    {
      this.alldateGap.push({fromDate:this.fromDate,toDate:this.toDate })
    }else
    {
      for(let r of this.alldateGap)
      {
        console.log("ggd1",this.fromDate)
console.log("ggd2",r.fromDate)
console.log("ggd3",this.toDate)
console.log("ggd4",r.toDate)


let date0=moment(this.fromDate,"DD-MM-YYYY").toISOString();
let date1=new Date(date0)
let date01=moment(r.fromDate,"DD-MM-YYYY").toISOString();
let date2=new Date(date01)
let date3=moment(this.toDate,"DD-MM-YYYY").toISOString();
let date5=new Date(date3)
let date4=moment(r.toDate,"DD-MM-YYYY").toISOString();
let date6=new Date(date4)
console.log("ggd5",date1)
console.log("ggd6",date2)
console.log("ggd7",date5)
console.log("ggd8",date6)
    if(date1 >=date2 && date1<=date6)
    {
  
      this.add=false;
      this.nonQualifyingServicestart_Date="";
      this.nonQualifyingServiceend_Date="";
      alert("Date/Duration Already has been used in Service Period.");
return
    }
    else if(date5 <=date6 && date5>=date2)
    {
      
      this.add=false;
      this.nonQualifyingServicestart_Date="";
      this.nonQualifyingServiceend_Date="";
      alert("Date/Duration Already has been used in Service Period.")
      return
    }
    else if(date1<date2 && date5>date6)
    {
      
      this.add=false;
      this.nonQualifyingServicestart_Date="";
      this.nonQualifyingServiceend_Date="";
      alert("Date/Duration Already has been used in Service Period.")
      return
    }
      }
    }
if(this.add)
{
  this.alldateGap.push({fromDate:this.fromDate,toDate:this.toDate})
  console.log("this.alldateGap",this.alldateGap)
}
  if(this.add)
  {
    
      let type=this.serviceList.filter((x:any)=>{
        if(x.serviceId==this.typeId)
        {
          return x.serviceName
        }else
        {
          return ""
        }
      });
      let data={
        "fromDate":this.fromDate  ,
        "toDate": this.toDate,
        "serviceLengh": this.totalService,
        "OrganizationName": this.deptName,
        "type": type[0].serviceName,
        "isPension": "N",
        "isGratuity": "N",
        "totalDays":this.totalDays,
        "psnAmnt": 0,
        "typeId": this.typeId,
        "qualifying": this.getQualifying(this.typeId)
      }
      
      this.serviceRecords.push(data);
      console.log(this.serviceRecords);
      this.dataSource=new MatTableDataSource(this.serviceRecords);
      this.deptName="";
      this.typeId="";
      this.nonQualifyingServicestart_Date=""
      this.nonQualifyingServiceend_Date=""
    
  }
  }
    
  }
  getQualifying(typeId:any)
  {
    let data=this.serviceList.filter((x:any)=>{
      if(x.serviceId==typeId)
    {
      return x
    }
    })
let quali=data[0].qualifying;
return quali;
  }
  removeService(i:any,item:any)
  {
  console.log(item)
this.serviceRecords.splice(i,1);
console.log("dfgdg",this.serviceRecords)
this.dataSource=new MatTableDataSource(this.serviceRecords);
console.log("this.serviceRecords",this.serviceRecords);
let data11=this.alldateGap;
console.log(this.alldateGap);
data11.filter((x:any,i:any)=>
{
  console.log("from",x.fromDate);
  console.log("from1",item.fromDate);
  if(x.fromDate==item.fromDate)
{
  this.alldateGap.splice(i,1);
}})
data11.filter((x:any,i:any)=>
{
  if(x.fromDate==item.fromDate)
{
  this.alldateGap.splice(i,1);
}})
console.log(this.alldateGap)
  }
  getDeTypeName = (id: string) => {
    if(id)
    return this.detypelist.filter((x: any) => x.deTypeId == id)[0].deTypeName;
    else
    return ""
  }
  DE_Type:any
  submit()
  {

    console.log(this.DE_Type)
    if(this.isDeStatus)
    {
      if(this.DE_Type=="")
      {
        alert("Please select DE type.");
        return;
      }
    }
   
    if(this.detypestatus=='')
    {
      alert("Please select DE Status.");
      return;
    }
    let submitData={
      "totalNoOfDays": this.data.field.totalNoOfDays,
      "totalServiceLength": this.data.field.totalServiceLength,
      "penalty": this.Penalty,
      "penaltyType": this.Penalty_Type,
      "remark": this.Remark,
      "deType": this.DE_Type,
      "deTypeName":this.getDeTypeName(this.DE_Type),
      "deEndDate": "",
      "deStartDate":"",
      "deStatus": this.detypestatus?this.detypestatus:"0",
      "serviceRecordDetails": this.serviceRecords?this.serviceRecords:[]  
      
    }
    console.log("submitData",submitData);
    this.data.getServiceRecordData(this.detypestatus,this.getDeTypeName(this.DE_Type));
    this.dialogRef.close({ data: JSON.stringify(submitData) });
  }
  OnChangeCom()
  {
    if(this.detypestatus==1)
    {
   

    }else{
      this.DE_Type="";     
      this.Penalty="";
      this.Penalty_Type="";
      this.Remark="";
    }

  }

  isChange(  )
  {
    if(this.Penalty==1)
    {

    }
    else
      {
        this.Penalty_Type="";
        this.Remark="";
      }

  }
}
