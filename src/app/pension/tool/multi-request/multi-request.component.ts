import { Component, OnInit } from '@angular/core';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-multi-request',
  templateUrl: './multi-request.component.html',
  styleUrls: ['./multi-request.component.scss']
})
export class MultiRequestComponent implements OnInit {
  data:any
  mainUrl:any="";
  sendData:any[]=[];
  count:any=0;
  constructor(public api:PensionServiceService) { }

  ngOnInit(): void {
  }
  sendRequest()
  {
if(this.data)
{
this.sendData=this.data.split(';');
console.log("data",this.data)
console.log("data2",this.sendData)
if(this.sendData.length>0)
{

 this.updateCount();
 
}
}else
{
  alert("First add data for post");
}
  }
  updateCount()
  {
    if(this.count<this.sendData.length)
    {
     if( this.sendData[this.count]!="")
     {
      let data={
        "inMstType": 3,
        "requestData": this.sendData[this.count]
      }
      console.log("data",data)
      this.api.getPensionerDetail(data,"workMultiTask").subscribe((res:any)=>{
        this.count++;
        this.updateCount();
      },(error)=>{
        this.count++;
        this.updateCount();
      })
     }
     
    }
  }
}
