import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as moment from 'moment';
import { PensionServiceService } from 'src/app/services/pension-service.service';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-send-data',
  templateUrl: './send-data.component.html',
  styleUrls: ['./send-data.component.scss'],
  providers: [
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false } },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class SendDataComponent implements OnInit {
  sendDate:any
  value:any
  constructor(public _Service:PensionServiceService) { }

  ngOnInit(): void {
  }
 
  sendDataIFMPS()
  {
    if(this.sendDate)
    {
      this._Service.getUpcomPsnReport("IfmsPpo",{'date':this.sendDate}).subscribe((res:any)=>{
        console.log("res",res);
        if(res.data=='success')
        {
          alert('Data send successfully.')
        }else
        {
          alert("Some error Occured")
        }

      })
    }else
    {
      alert("Enter Date")
    }

  }
  sendDataCPOGPO(){
    this._Service.getUpcomPsnReport("IfmsGpoCpo",{'status':'0'}).subscribe((res:any)=>{
      console.log("res",res)
      if(res.data=='success')
      {
        alert('Data send successfully.')
      }else
      {
        alert("Some error Occured")
      }

    })
  }
  dateChange(value:any)
  {
  
this.sendDate=value
console.log("this.sendDate",this.sendDate);

  }
  generateBill()
  {
    let data={
      "psnStDate":this.sendDate
  }
  console.log("data",data);
  this._Service.getPensionerDetail(data,"generateBill").subscribe((res:any)=>{
    console.log("res",res);
    alert(res.data.status);
  },(error)=>{
      alert("Error in Service"+JSON.stringify(error));
  })
  }
  sendDataPayeeManager()
  {
    if(this.value)
    {
      this._Service.getUpcomPsnReport("billPushForPayeeManager",{'type':this.value}).subscribe((res:any)=>{
        console.log("res",res)
        if(res.data=='success')
        {
          alert('Data send successfully.')
        }else
        {
          alert("Some error Occured")
        }
  
      })
    }else
    {
      alert("Select CPO/GPO.")
    }
    
  }
}
