import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfig } from 'src/app/app.config';
import { CommonService } from 'src/app/services/common.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-view-objection',
  templateUrl: './view-objection.component.html',
  styleUrls: ['./view-objection.component.scss']
})
export class ViewObjectionComponent implements OnInit {
  config:AppConfig=new AppConfig();
  requestId:any;
  constructor(  @Inject(DOCUMENT) private document: Document,public _Service:PensionServiceService,public common:CommonService) {
    // this.editorOptions = new JsonEditorOptions()
    // this.editorOptions.modes = ['code', 'text', 'tree', 'view'];

    
 
   }
  // public editorOptions: JsonEditorOptions;
  type:any='1'
  objectionArray:any;
  userDetails:any;
  empCode:any;
  displayedColumns: string[] = ['roleName','Objection','CreatedAt'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngOnInit(): void {
    this._Service.configMenu = { url: "View Objection" };
    this.userDetails=this.config.getUserDetails();
  }

 
  getJson(i:any)
  { let data:any
    if(i==1)
    {
      if(this.empCode=='' || this.empCode==null)
      {
        alert("Enter Employee Code.");
        return
      }
      data={"empCode":this.empCode,'requestId':null}

    }else if(i==2)
    {
      if(this.requestId=='' || this.requestId==null)
      {
        alert("Enter request id.");
        return
      }
      data={"requestId":this.requestId,"empCode":null}

    }
    
    
    this._Service.postho("getEmployeeDetails",data).subscribe((res:any)=>{
      console.log("res",res);
      if(res.personalDetails)
      {
        let data=JSON.parse(res.personalDetails);
        this.objectionArray=data.ObjectionArray;
        console.log("objectionArray",this.objectionArray)
        if(this.objectionArray!=='')
        {
          this.dataSource = new MatTableDataSource(this.objectionArray);
          this.dataSource.paginator = this.paginator;
        }
        else
        {
          let data:any=[]
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
        }
      }
    })
  }




  




  
}

