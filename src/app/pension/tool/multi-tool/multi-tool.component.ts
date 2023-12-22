import { Component, OnInit } from '@angular/core';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { PensionInitiateOfficeComponent } from '../../e-pension/pension-initiate-office/pension-initiate-office.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-multi-tool',
  templateUrl: './multi-tool.component.html',
  styleUrls: ['./multi-tool.component.scss']
})
export class MultiToolComponent implements OnInit {
  empCode:any;
  empData:any;
  constructor(public api:PensionServiceService,
    public dialog:MatDialog) { }

  ngOnInit(): void {
  }
  getDetails()
  {
   
    let data={
      "employeeCode": this.empCode,
      "inType": 17
  }
  console.log("data",data);
  this.api.postUpcomingpension(data,"insertPsnEmpCommon").subscribe((res:any)=>{
    console.log("res",res)
    if(res.data)
    {
      this.empData=res.data;
    }
  })
  }
  changeInitiateOffice()
  {
    this.dialog.open(PensionInitiateOfficeComponent, { panelClass: 'dialog-w-60', data: { message: this.empData } , disableClose: true }).afterClosed()
    .subscribe((data:any) => {
      
     
    });;
  }
}
