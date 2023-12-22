
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

import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-life-cer-request',
  templateUrl: './life-cer-request.component.html',
  styleUrls: ['./life-cer-request.component.scss']
})
export class LifeCerRequestComponent implements OnInit {

  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = ['employeeCode','name','pensionerId','ppono','requestDate',"document","remark","Approve","revert"];
  displayedColumns1: string[] = ['employeeCode','name','pensionerId','ppono','requestDate',"document"];
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
    private tokenInfo:TokenManagementService,
    public common:CommonService) {
    this.encryptMode = true;
  }
  ngOnInit(): void {
    this._Service.configMenu = { url: "Life Certificate List" };
    this.empinfo=this.tokenInfo.empinfoService;
   this.userdetails=this.config.getUserDetails();
   console.log("this.userdetails",this.userdetails)

    this.getrequestList(1);
    // localStorage.setItem("employeeCode",'')
    // localStorage.setItem("employeeId",'')
    this.config.storeDetails("employeeCode",'')
    this.config.storeDetails("employeeId",'')
this._Service.url="Inbox >  PensionerList"
  }
// aa
tabClick(tab:any) {
  console.log(tab.index);
  if(tab.index==0)
  {
    this.getrequestList(1);
  }else if(tab.index==1)
  {
    this.getrequestList(2);
  }
}
getrequestList(i:any){
let data:any;
 if(i==1)
 {
data={
    'inType':2 
}
 }else if(i==2)
 {
data={
    'inType':3 
}
 }
this.load.show();
this._Service.postdetype(data, "requestLifeCertificate").subscribe({
  //this._Service.postRequestpension(data, "getToBeRetiringEmployeeListByDeptId").subscribe({
    next: (res) => {
      this.load.hide();
      if(res?.data)
      {
        console.log("pensioner list",JSON.parse(res.data))
        this.dataSource = new MatTableDataSource(JSON.parse(res.data));
        this.dataSource.paginator = this.paginator;
        let data=JSON.parse(res.data)
        for(let i=0;i<data.length;i++)
        {
          this.remark.push(data[i].remark?data[i].remark:"");
        }
        console.log("remark",this.remark)
      }else
      {
        let data:any=[];
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      }
          
        
      
    },
    error: (err) => {
      this.load.hide();
      console.log(err);
      this.error = err
    
    }
  })
}
remark:any[]=[]
approveLifeCertificate(row:any,flag:any,i:any)
{
  if(confirm("Are you sure..."))
  {
    let data:any;
    if(flag==1)
    {
      data={
        'inType':4,
        'officerAssignmentId':Number(this.userdetails.assignmentid), 
        'officerOfficeId': Number(this.userdetails.officeid), 
        'dmsDocId': Number(row.upload_docid), 
        'lifeCertId': Number(row.lifeCertId),
        'arvFlag': Number(flag),
        'remark': this.remark[i],
    }
    }else if(flag==2)
    {
      if(!this.remark[i])
      {
        alert("Enter remark");
        return
      }
      data={
        'inType':6,
        'officerAssignmentId':Number(this.userdetails.assignmentid), 
        'officerOfficeId': Number(this.userdetails.officeid), 
        'dmsDocId': Number(row.upload_docid), 
        'lifeCertId': Number(row.lifeCertId),
        'arvFlag': Number(flag),
        'remark': this.remark[i],
    }
    }
     console.log("submit life",data);
      this._Service.postdetype(data, "requestLifeCertificate").subscribe({
        //this._Service.postRequestpension(data, "getToBeRetiringEmployeeListByDeptId").subscribe({
          next: (res) => {
            this.load.hide();
            console.log("res",res)
            if(res?.data)
            {
             alert(res?.data);
             this.getrequestList(1);
            }else
            {
              
            }
                
              
            
          },
          error: (err) => {
            this.load.hide();
            console.log(err);
            this.error = err
          
          }
        })
  }

}


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 

  
  
}

