import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { CommonDialogComponent } from '../../common-dialog/common-dialog.component';

@Component({
  selector: 'app-file-status',
  templateUrl: './file-status.component.html',
  styleUrls: ['./file-status.component.scss']
})
export class FileStatusComponent implements OnInit {
  empCode:any
  ComEmpCode:any
  displayedColumns: string[] = ['SSOID','displayName','requesId','actionTaken','actionTakenby','LevelType','roleName','modifyDate','remarks'];
  dataSource!: MatTableDataSource<any>;
  dataSource1!: MatTableDataSource<any>;
 
  @ViewChild('ess') ess!: MatPaginator;
  @ViewChild('pension') pension!: MatPaginator;
  constructor(public _Service:PensionServiceService,public dialog:MatDialog) { }

  ngOnInit(): void {
    this._Service.configMenu = { url: "Check Application Status" };
   
  }
  message:any;
  getPensionDtls(){
    //alert(this.empIdUserDtls)
    if(this.ComEmpCode)
    {
     
      let payload= {
  
        "empCode":this.ComEmpCode,"reqId":0,"pensionerId":0
      }
      this._Service.postPssRequest(payload,'fetchpensionerdtls').subscribe((res:any)=>{
        console.log("New service",res);

        
      if(res.data[0].flag==0)
      {       
        this.message="Your Request is pending at HO_Approver: "+res.data[0].hoApprover
      }  
        
        else if(res.data[0].flag==1)
        {
           this.message="Your Request is forward by HO Approver: "+res.data[0].hoApprover +" and pending at Zonal Approver: "+res.data[0].zonalApprover;
        } else if(res.data[0].flag==3)
        {
           this.message="Your Request is Approved by Zonal Approver: "+res.data[0].zonalApprover
        }
        else if(res.data[0].flag==4)
        {
           this.message="Your Request is Revert to HO Approver:"+res.data[0].hoApprover+" by Zonal Approver:" +res.data[0].zonalApprover;
        }
        else if(res.data[0].flag==2)
        {
          //alert("Rejected")
          this.message="Your  Request is Rejected by HO Approver: "+res.data[0].hoApprover;
        }
        else if(res.data[0].flag==-1)
        {       
          this.message="Your Request is Not_Initiated."
        }  
       
        else {
          this.message=""       
        }
        
      })
    }else
    {
      alert("First Enter Employee Code.")
    }
   
  }
  essData:any[]=[];
  pensionData:any[]=[];
  employeeData:any;
  filterData(){
    if(this.empCode=='' || this.empCode==null)
    {
      alert("Please Enter Employee Code");
      return;
    }else
    {

    }
    this.getEmployeeData()
    this.pensionList();
    this.esslistdata();
   }
   applyFilter1(filterValue: string) {
   
  }
  pensionList()
  {
    let data = {
     "employeeCode":this.empCode
      }
 
      this._Service.getUpcomPsnReport('getpensionfilestatus', data).subscribe((res:any) => {
       
       if(res.status=="SUCCESS")
       {
 console.log(res.data)
 let data=res.data;
 if(data.length>0)
 {
  data =data.sort();
  data=data.reverse()
  console.log("data",data)
 }
this.pensionData=data;
 this.dataSource = new MatTableDataSource(data);
 this.dataSource.paginator = this.pension;
       }
       

  })
  }
  getEmployeeData = () => {

    this._Service.postNewEmployee('getEmployeeDetailsByType', {
      employeeId:this.empCode , inType: 8
    }).subscribe({
      next: res => {
       console.log("res",res.data.employeeOtherDetails[0])
       this.employeeData=res.data.employeeOtherDetails[0]
      }, error: err => {
      }
    })
  }
  View_Objection(reqId:any){
    if(reqId)
    {
      this.dialog.open(CommonDialogComponent,
        {
          maxWidth: '60vw',
          maxHeight: 'auto',
          width: '100%',
          panelClass: 'dialog-w-50', autoFocus: false
          , data: {
            message: 'View Objection',id:20,reqId:reqId.toString()
          }
        }
      );
    }else
    (
      alert("Request id not present.")
    )
   
  }
  esslistdata()
  {
    let data = {
      "employeeCode":this.empCode
       }
  
       this._Service.postEmployee('getemployeefilestatus', data).subscribe((res:any) => {
        // console.log("empdata",res)
        if(res.status=="SUCCESS")
        {
  console.log("empdata",res.data)
  let data=res.data;
  if(data.length>0)
  {
   data =data.sort();
   data=data.reverse()
   console.log("data",data)
 
 this.essData=data;
  this.dataSource1 = new MatTableDataSource(data);
  this.dataSource1.paginator = this.ess;
}else{
  let data:any[]=[]
  this.essData=data;
  this.dataSource1 = new MatTableDataSource(data);
  this.dataSource1.paginator = this.ess;
}
        }
        
 
   })
    
  }
}