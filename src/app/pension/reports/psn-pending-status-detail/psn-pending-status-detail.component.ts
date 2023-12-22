import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfig } from 'src/app/app.config';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-psn-pending-status-detail',
  templateUrl: './psn-pending-status-detail.component.html',
  styleUrls: ['./psn-pending-status-detail.component.scss']
})

export class PsnPendingStatusDetailComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['Employee Code','Name','Father Name','Office Name','Admin Dept. Name','Mobile No.','Email Id','Date of Ret.'];
  dataSource!: MatTableDataSource<any>;
  userdetails:any;
  selected = '';
  psnPendingFiles:any;
  config:AppConfig=new AppConfig()
  constructor(private ApiUrlService: PensionServiceService, 
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.userdetails=this.config.getUserDetails();
    console.log("this.userdetails",this.userdetails)
    this.getMonthYear();
   
  }
  reportYear:any;
  reportmonth:any;
  psnmonth:any[]=[];
  psnYear:any[]=[];
  getMonthYear()
  {
    this.ApiUrlService.postUpcomingpension({}, "getYearMonth").subscribe((res:any)=>{
  console.log("res",res.data)
  this.psnmonth=res.data;
  
  this.psnYear = [...new Map(this.psnmonth.map((item:any) =>
    [item['psnYear'], item])).values()];
  
    let date=new Date();
    console.log("month",date.getFullYear())
    this.reportmonth=date.getMonth()+1;
    this.reportYear=date.getFullYear();
    this.psnPendingFilesByOffice();
    });
  
  }
  reset()
  {
    let date=new Date();
    console.log("month",date.getFullYear())
    this.reportmonth=date.getMonth()+1;
    this.reportYear=date.getFullYear();
    this.psnPendingFilesByOffice();
  }
  psnPendingFilesByOffice(){
    console.log(this.userdetails)
    console.log(this.commonService.getGlobalId)
     let data = {
        "assignmentId":this.userdetails.assignmentid,
        //"assignmentId":"58408", 
        "roleId":this.commonService.getGlobalId,        
       }
       this.ApiUrlService.getPsnDetailsView('getpendingstatusdetails', data).subscribe((res:any) =>{        
             this.psnPendingFiles = res;
             this.dataSource = new MatTableDataSource(res.data);
             this.dataSource.paginator = this.paginator;
             console.log(">>>>",this.psnPendingFiles)
          })         
  }

   
  applyFilter(event:any){}
  
}

