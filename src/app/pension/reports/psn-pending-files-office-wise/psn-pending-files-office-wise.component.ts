import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportsModule } from '../reports.module';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfig } from 'src/app/app.config';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { CommonService } from 'src/app/services/common.service';


@Component({ 
  selector: 'app-psn-pending-files-office-wise',
  templateUrl: './psn-pending-files-office-wise.component.html',
  styleUrls: ['./psn-pending-files-office-wise.component.scss']
})
export class PsnPendingFilesOfficeWiseComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['Office Name','Maker','Checker','Approver','Auditor','AAO','AD'];
 // dataSource = ELEMENT_DATA;
  dataSource!: MatTableDataSource<any>;
  userdetails:any;
  psnPendingFiles:any;
  globalId:any;
  selected = ""
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
     let data = {
      "assignmentId":this.userdetails.assignmentid
      //"assignmentId":"58238"
       }
       this.ApiUrlService.getPsnDetailsView('getpendingstatus', data).subscribe((res:any) =>{        
             this.psnPendingFiles = res.data;
             this.dataSource = new MatTableDataSource(res.data);
             this.dataSource.paginator = this.paginator;
             console.log("PSN Pensing Files Office wise Neha",this.psnPendingFiles)
          })  
        
  }

  onClick(event:any){
    this.globalId=event;
    this.commonService.getGlobalId=this.globalId
   // alert(this.globalId)
  }
  applyFilter(event:any){}

}
