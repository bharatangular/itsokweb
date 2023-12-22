import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { CommonService } from 'src/app/services/common.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-bill-push',
  templateUrl: './bill-push.component.html',
  styleUrls: ['./bill-push.component.scss']
})
export class BillPushComponent implements OnInit {
  config:AppConfig=new AppConfig(); 
  billType:any="3";
  data:any; 
  userDetails:any; 
  empCode:any; 

  constructor(  @Inject(DOCUMENT) private document: Document,public _Service:PensionServiceService,public common:CommonService) {
    // this.editorOptions = new JsonEditorOptions()
    // this.editorOptions.modes = ['code', 'text', 'tree', 'view'];

    
   
   }
  // public editorOptions: JsonEditorOptions;
  public initialData: any;
  public visibleData: any;
  ngOnInit(): void {
    this._Service.configMenu = { url: "Bill Push" };
    this.userDetails=this.config.getUserDetails();
   
  }
  showJson(d: Event) {
    this.initialData = d;
  }
  taskdataId:any;
  getJson()
  { let data:any
    
      if(this.empCode=='' || this.empCode==null)
      {
        alert("Enter refNo.");
        return
      }
      data={"type":this.billType,'refNo':this.empCode}

    
    
    this._Service.postdetype(data,"getBillData").subscribe((res:any)=>{
      console.log("res",res);
      if(res.data)
      {
        this.data=JSON.stringify(res.data);
      }
    })
  }
 

  updateJson()
  {
    console.log("data",this.data)
  }
  Submit()
  {
    this._Service.postdetype({"req":JSON.parse(this.data),"typeId":Number(this.billType)},"sendBillData").subscribe((res:any)=>{
      console.log("res",res);
      
    })
  }

  
}
