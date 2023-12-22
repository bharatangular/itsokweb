import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportsModule } from '../reports.module';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfig } from 'src/app/app.config';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { MatPaginator } from '@angular/material/paginator';

export interface dataSource {
  officeName: string;
  makerCount: number;
  checkerCount: number;
  approverCount: number;
  auditorCount: number;
  aaoCount: number;
  adCount: number;
  pendingCases: number;
 
}

const ELEMENT_DATA: dataSource[] = [
  { officeName: 'DOIT', makerCount: 50,checkerCount: 50,approverCount: 50,auditorCount: 50,aaoCount: 50,adCount:20, pendingCases: 50,},
  { officeName: 'DOIT', makerCount: 50,checkerCount: 50,approverCount: 50,auditorCount: 50,aaoCount: 50,adCount:20, pendingCases: 50,},
  { officeName: 'DOIT',  makerCount: 50,checkerCount: 50,approverCount: 50,auditorCount: 50,aaoCount: 50,adCount:20,pendingCases: 50,},
  { officeName: 'DOIT',  makerCount: 50,checkerCount: 50,approverCount: 50,auditorCount: 50,aaoCount: 50,adCount:20,pendingCases: 50,},
  { officeName: 'DOIT', makerCount: 50,checkerCount: 50,approverCount: 50,auditorCount: 50,aaoCount: 50,adCount:20, pendingCases: 50,},
  { officeName: 'DOIT',  makerCount: 50,checkerCount: 50,approverCount: 50,auditorCount: 50,aaoCount: 50,adCount:20,pendingCases: 50,},
  { officeName: 'DOIT', makerCount: 50,checkerCount: 50,approverCount: 50,auditorCount: 50,aaoCount: 50,adCount:20, pendingCases: 50,},
];

@Component({
  selector: 'app-office-detail-by-office-id',
  templateUrl: './office-detail-by-office-id.component.html',
  styleUrls: ['./office-detail-by-office-id.component.scss']
})
export class OfficeDetailByOfficeIdComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selected = "";
  displayedColumns: string[] = ['Office Name','Maker','Checker','Approver','Auditor','AAO','AD','Pending Cases'];
  dataSource = ELEMENT_DATA;
  //dataSource!: MatTableDataSource<any>;
  userdetails:any;
  pensionDetails:any;
  config:AppConfig=new AppConfig()
  constructor(public ApiUrlService:PensionServiceService) { }

  ngOnInit(): void {
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
  this.reportYear=date.getFullYear()
  });

}
reset()
{
  let date=new Date();
  console.log("month",date.getFullYear())
  this.reportmonth=date.getMonth()+1;
  this.reportYear=date.getFullYear();

}
  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  } 
}
