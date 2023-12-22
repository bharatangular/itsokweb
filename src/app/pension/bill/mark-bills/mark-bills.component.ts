import { Component, ElementRef, OnInit, ViewChild ,AfterViewInit, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import 'jspdf-autotable';
import { CommonService } from 'src/app/services/common.service';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-mark-bills',
  templateUrl: './mark-bills.component.html',
  styleUrls: ['./mark-bills.component.scss']
})
export class MarkBillsComponent implements OnInit, AfterViewInit {
  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = ['sNo','refNo',"employeeCode","name","billcreatedDt","pensionerId","sanctionNo", "action"];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('content', { static: false }) el!: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datalist: any = [];
  showerror: boolean = false;
  error: string = '';
  empinfo: any;
  isShow=true;
  encryptMode: boolean= false;  
  userdetails:any;
  config:AppConfig=new AppConfig()
  enhancePsnList: any;
  reportYear:any;
  reportmonth:any;
  psnmonth:any[]=[];
  psnYear:any[]=[];
  selected:any = [];
  selectedJson: any = [];

  selection = new SelectionModel<any> (true, []);
 
  constructor(public dialog: MatDialog, 
    private load:LoaderService,
    private tokenInfo:TokenManagementService,
    private ApiUrlService: PensionServiceService,
    private _snackBar: MatSnackBar,
    public _dialog: MatDialog,
    private routers: Router,
    private commonService: CommonService) { }

  ngOnInit(): void {
    
    this.empinfo=this.tokenInfo.empinfoService;
    this.userdetails=this.config.getUserDetails();
    console.log("this.userdetails",this.userdetails)
    // this.getMonthYear();
    this.enhancePensionDtls();
  }
  

  ngAfterViewInit() {

    if(this.dataSource){
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise, clear the selection. */
  masterToggle() {
    if(this.isAllSelected()){
      this.selection.clear();
      this.selectedJson = [];
    }else{
      this.dataSource.data.forEach(row =>{
        this.selection.select(row)
        this.selectedJson.push({refNo: row.refNo})
      });
    }
  }

  selectBills(event: any, row: any, index: number){
    this.selection.toggle(row);
    console.log(row, index);
    if(event.checked){
      this.selectedJson.push({refNo: row.refNo})
      console.log(this.selectedJson)
    }else{
      let selectedIndex: any = this.selectedJson.findIndex((item: any) => item.refNo == row.refNo);
      console.log(selectedIndex)
      this.selectedJson.splice(selectedIndex, 1);
      console.log(this.selectedJson)
    }
  }
  filterBills(value: number){
    let filteredList: any  = [];
    if(value == 1){
      filteredList = this.enhancePsnList.filter((data: any)=> data.payManager == 1);
    }else{
      filteredList = this.enhancePsnList.filter((data: any)=> !data.payManager);
    }
    this.dataSource = new MatTableDataSource(filteredList);
    this.dataSource.paginator = this.paginator;

  }

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
      this.enhancePensionDtls();
    });
  }

  reset()
  {
    let date=new Date();
    console.log("month",date.getFullYear())
    this.reportmonth=date.getMonth()+1;
    this.reportYear=date.getFullYear();
    this.enhancePensionDtls();
  }

  enhancePensionDtls()
  {
    this.ApiUrlService.getUpcomPsnReport('getPayManagerlist', {}).subscribe({next: (res:any) => {
      this.enhancePsnList = res.data;
      this.enhancePsnList.forEach((element: any, i: number) => {
          this.selected.push(false);
      });

      this.dataSource = new MatTableDataSource(this.enhancePsnList);
      this.dataSource.paginator = this.paginator;

    },
    error: (error: any)=>{
      console.log(error);
      this.dataSource = new MatTableDataSource();
      this.dataSource.paginator = this.paginator;
    }})
  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  submitForm(){
    let data = {
      refIds: this.selectedJson
    }
    console.log(data)
    this.load.show();
    if(confirm("Are you sure you want to submit")){
      this.ApiUrlService.getUpcomPsnReport('updatePayManagerList', data).subscribe({next: (res:any) => {
        this.load.hide();
        if(res && res.data && res.data.status == 'Success'){
          if(res.data.message){
            this._snackBar.open('Success :- ',res.data.message, {
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.enhancePensionDtls();
          }
        }else{
          this._snackBar.open('error :- ',res.data.message ? res.data.message : 'Some Error Occured', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      },
      error: (error: any)=>{
        this.load.hide();
        this._snackBar.open('error :- ',error.message ? error.message : 'Some Error Occured', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }})
    }
  }
}
