import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AppConfig } from "src/app/app.config";
import { CommonService } from "src/app/services/common.service";
import { PensionServiceService } from "src/app/services/pension-service.service";
import { TokenManagementService } from "src/app/services/token-management.service";
import { MarkEmpDeDialogComponent } from "../mark-emp-de-dialog/mark-emp-de-dialog.component";

@Component({
  selector: 'app-mark-all-de-list',
  templateUrl: './mark-all-de-list.component.html',
  styleUrls: ['./mark-all-de-list.component.scss']
})
export class MarkAllDeListComponent implements OnInit {
  displayedColumns: string[] = ['employeeCode','name','office',"deStatus",'deType','document','Action'];
  dataSource!: MatTableDataSource<any>;
  dataSource1!: MatTableDataSource<any>;
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
    public common:CommonService,
    private tokenInfo:TokenManagementService) {
    this.encryptMode = true;
  }
  ngOnInit(): void {

    this.empinfo=this.tokenInfo.empinfoService;
    this.userdetails=this.config.getUserDetails();
    console.log("this.userdetails",this.userdetails)
    this.getDeType()
    this.getMarkDEList();
    this.config.storeDetails("employeeCode",'')
    this.config.storeDetails("employeeId",'')
    this._Service.url="Inbox >  PensionerList"
  }

  relieveEmployee(empDetail: any){
    this.dialog.open(MarkEmpDeDialogComponent, { panelClass: 'dialog-w-30', data: { empDetail: empDetail,empDe:false, }, height: '60%', width: '80%' }).afterClosed()
    .subscribe((data:any) => {
  
      this.getMarkDEList();
    });;
  }
  relieveEmployeePension(empDetail: any){
    this.dialog.open(MarkEmpDeDialogComponent, { panelClass: 'dialog-w-30', data: { empDetail: empDetail,empDe:true }, height: '60%', width: '80%' }).afterClosed()
    .subscribe((data:any) => {
  
      this.getMarkDEList();
    });;
  }
detypelist:any;
getDeType() {

  
  let data ={
  
  }

  this._Service.postdetype(data, "getDeTypes").subscribe({
    next: (res) => {
      if (res.status = 200) {
    
this.detypelist=res.data;
console.log(this.detypelist)

      }
    },
    error: (err) => {
      let errorObj = {
        message: err.message,
        err: err,
        response: err
      }
    }
  })

}
getdeTypeName(i:any)
{

  if(i==0 ||i==null || i==undefined|| i=='')
  {
    return 'N/A'
  }else
  {
       return this.detypelist.filter((element:any)=>element.deTypeId=Number(i))[0].deTypeName;
  }

}



getMarkDEList()
{
  this._Service.getPensionerDetail({'officeId':'398'},'getPensionDeDetails').subscribe((res:any)=>{
    console.log('res',res)
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
  this._Service.getPensionerDetail({'officeId':'28202'},'getPensionEmpDeDetails').subscribe((res:any)=>{
    console.log('res',res)
    if(res.data)
    {
      let data=res.data;
      data=data.sort();
      this.dataSource1=new MatTableDataSource(data)
    }
    else
    {
let data:any[]=[];
this.dataSource1=new MatTableDataSource(data)
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


