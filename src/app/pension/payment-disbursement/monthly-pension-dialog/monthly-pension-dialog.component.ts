import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import * as _moment from 'moment';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


const moment =  _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-monthly-pension-dialog',
  templateUrl: './monthly-pension-dialog.component.html',
  styleUrls: ['./monthly-pension-dialog.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class MonthlyPensionDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: any,id:any,fromDate:any},
  public _Service:PensionServiceService,
  public dialog:MatDialog,
  private dialogRef: MatDialogRef<MonthlyPensionDialogComponent>,
  public common:CommonService) { }
  headerMsg:any;
  otherDeduction:any;
  holdReason:any;
  frommonth:any;
  fromRdate:any;
  toRdate:any;
  mindate:any;
  maxdate:any;
  ngOnInit(): void {
    console.log("data",this.data)
  
    if(this.data?.id==1)
    {
      
      this.headerMsg="Add Deduction";
    }else if(this.data?.id==2)
    {
      this.headerMsg="Hold Monthly Pension";
      this.getHoldReasons();
    }else if(this.data?.id==3)
    {
      this.headerMsg="Release Monthly Pension";
      this.frommonth="01/"+this.data?.fromDate
      let min=new Date(this.frommonth)
      this.fromRdate=min;
      let max=new Date();
      console.log("max1",min)
      let max1=new Date(max.getFullYear(),max.getMonth()+1,0)
      min.setDate(1)
      max1.setMonth(max1.getMonth()+1)
      
    
   
      this.mindate=min;
      this.maxdate=max1;
      this.toRdate=max1
    }
    
  }
  otherDeductionchange()
  {
    if(this.otherDeduction>Number(this.data?.message?.netPayableAmount))
    {
      this.otherDeduction=0;
      alert("Please insert deduction below Net payble amount")
    }
    
  }
  saveDeduction()
{
 
 
  if(confirm("Are you sure..after save, amount "+this.otherDeduction+" ₹ will not be changable."))
  {
    let data={
      "inType":5,
      "psnReqid":Number(this.data?.message?.psnReqid),
      "otherDeduction":this.otherDeduction
    }
    console.log('data',data);
    this._Service.postdetype(data,"getMonthlyPsnCalData").subscribe((res:any)=>{
      console.log("qqq",res)
      if(res.data[0].Message=="Updated successfully")
      {
        let data={
          "otherDeduction":this.otherDeduction
        }
        this.dialogRef.close({ data: data});
      }else
      {
        alert("Some error occur");
      }
      
    },(error)=>{
      
    })
  }
  
}
holdReasonsList:any[]=[];
getHoldReasons()
{
  this._Service.postdetype({"inType":3},"getMonthlyPsnCalData").subscribe((res:any)=>{
    console.log("qqq",res.data)

      if(res.data)
      {
        this.holdReasonsList=res.data;
        console.log("holdReasonsList",this.holdReasonsList)
    }

  },(error)=>{
    
  })
}

file:any;
isLoading:boolean=false;
fileName:any;
docId:any;

uploadFile(event: any) {
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
      this.isLoading=false;
      

      if (res.data.document[0].docId) {
    this.docId=res.data.document[0].docId;
   
      alert("Document Upload Successfully.")
      
      } else {
        alert("Some error occured.")
      }

    },(error)=>{
      this.isLoading=false;
      alert("Error in Upload document")
    })
  };
  reader.readAsDataURL(this.file);

 }

}
holdMonthlyPension()
{
  if(!this.holdReason)
  {
    alert("Please select hold reason");
    return;
  }
  if(confirm("Are you sure to hold pension of "+this.data?.message?.employeeName))
  {
    let data={
      "inType":2,
      'ppoNumber':Number(this.data?.message?.ppoNumber),
      'pensionerId':Number(this.data?.message?.pensionerId),
      'frmDate':this.data?.message?.psnMonthYear,
      'todate':"",
      'holdReasonId':Number(this.holdReason),
      'withArrear':"",
      'psnReqid':Number(this.data?.message?.psnReqid),
      'otherDocumentNo':this.docId
    }
    console.log("hold data",data)
    this._Service.postdetype(data,"getMonthlyPsnCalData").subscribe((res:any)=>{
      console.log(res)
      if(res.data[0].Message=="inserted successfully")
      {
        
        this.dialogRef.close({ data: 'Y'});
      }else
      {
        alert("Some error occur");
      }

    },(error)=>{
      
    })
  }
}
removeHoldDocument()
{
  this.docId=null
}


fromMonth(normalizedMonth: any, datepicker: any) {

  console.log(normalizedMonth.month()+1);
  console.log(normalizedMonth.year());
  console.log("dsd",this.fromRdate)
  datepicker.close();
}
toMonth(normalizedMonth: any, datepicker: any) {

  console.log(normalizedMonth.month()+1);
  console.log(normalizedMonth.year());
  datepicker.close();
}
calculatePension()
{
  let data={
    "inType":8,
    "fromMonth":this.fromRdate,
    "tillMonth":this.toRdate,
    "psnReqid":this.data?.message?.psnReqid
  }
  console.log("data",data)
  this._Service.postdetype(data,"getMonthlyPsnCalData").subscribe((res:any)=>{
    console.log(res)
    

  },(error)=>{
    
  })
}
}
