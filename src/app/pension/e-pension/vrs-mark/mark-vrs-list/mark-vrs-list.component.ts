
import { Component, ElementRef, OnInit, ViewChild ,AfterViewInit, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import * as CryptoJS from 'crypto-js';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { MarkVrsComponent } from '../mark-vrs/mark-vrs.component';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-mark-vrs-list',
  templateUrl: './mark-vrs-list.component.html',
  styleUrls: ['./mark-vrs-list.component.scss']
})
export class MarkVrsListComponent implements OnInit {


  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = ['requestId','employeeCode',"VRS-Date",'dateOfRetirement','document'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  datalist: any = [];
  countDetail: any;
  inboxData: any = [];

  showerror: boolean = false;
  error: string = '';
  empinfo: any;
  isShow=true;

  encryptMode: boolean= false;
  textToConvert: any;
  password: any;
  conversionOutput: any;
  userdetails:any;
config:AppConfig=new AppConfig()
  constructor(public dialog: MatDialog, 
    private _Service: PensionServiceService, 
    private modalService: NgbModal,
    private _snackBar: MatSnackBar,
    private router:Router,
    private load:LoaderService,
    public common:CommonService,
    private tokenInfo:TokenManagementService) {
    this.encryptMode = true;
  }
  ngOnInit(): void {

    this.empinfo=this.tokenInfo.empinfoService;
   this.userdetails=this.config.getUserDetails();
   console.log("this.userdetails",this.userdetails)

    this.getMarkVrsList();
    // localStorage.setItem("employeeCode",'')
    // localStorage.setItem("employeeId",'')
    this.config.storeDetails("employeeCode",'')
    this.config.storeDetails("employeeId",'')
this._Service.url="Inbox >  PensionerList"
  }
// aa
openMarkVRS()
{
  this.dialog.open(MarkVrsComponent, { width: '60%', data: { message: '' }, disableClose: true }).afterClosed()
  .subscribe((data:any) => {
    // this.getRevisedPensionerList();
    this.getMarkVrsList();
   
   
  });
}
getMarkVrsList()
{
  this._Service.postCumm('getMarkvrsListByOfficeId',{'officeId':this.userdetails.officeid}).subscribe((res:any)=>{
    console.log('res',res)
    let msg=res.data[0]?.msg;
    if(res.data)
    {
      let data=res.data;
      data=data.sort();
      this.dataSource=new MatTableDataSource(data)
    }
    else
    {
let data:any[]=[];
this.dataSource=new MatTableDataSource(data)
    }
  })
}



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}

