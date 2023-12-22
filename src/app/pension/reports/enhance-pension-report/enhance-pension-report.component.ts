
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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-enhance-pension-report',
  templateUrl: './enhance-pension-report.component.html',
  styleUrls: ['./enhance-pension-report.component.scss']
})
export class EnhancePensionReportComponent implements OnInit {

  @Output() EmpId = new EventEmitter();

  displayedColumns: string[] = [
    'sNo',
    'empNameAndCode',
    // 'name',
    'refNo',
    // 'empCode',
    'ppoNo',
    'dob',
    'ofcName',
    'treasCode',
    'deptName',
    'zoneName',
    'accountNo',
    'psnAmt',
    'death_date',
    'familyPsnName',
    'familyPsnAmt',
    'enhancePsnEnd',
    'enhancePsnAmt', 
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('content', { static: false }) el!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datalist: any = [];
  showerror: boolean = false;
  error: string = '';
  empinfo: any;
  isShow=true;
  encryptMode: boolean= false;  
  userdetails:any;
  config:AppConfig=new AppConfig()
  // enhancePsnList: any= [];
  selected = '';
  zoneFlag: any;
  office_id_selection_flag?: boolean;
  departmentId : any
  constructor(public dialog: MatDialog, 
    
    private load:LoaderService,
    private tokenInfo:TokenManagementService,
    private ApiUrlService: PensionServiceService,
    private _snackBar: MatSnackBar,
    public _dialog: MatDialog,
    private routers: Router,
    private date: DatePipe,
    private commonService: CommonService) {  this.encryptMode = true;}

  ngOnInit(): void {

    this.empinfo=this.tokenInfo.empinfoService;
    this.userdetails=this.config.getUserDetails();
    console.log("this.userdetails",this.userdetails)
   

    let date=new Date();
    console.log("month",date.getFullYear())
    // const reportmonth=(date.getMonth()+1).toString();
    // const reportYear=(date.getFullYear()).toString();
    const reportmonth="0";
    const reportYear="0";
    this.reviceParamsfilter({month: reportmonth, year: reportYear, zone: 0, isDate: this.isDate})    
  }
  reportYear:any;
  reportmonth:any;
  psnmonth:Array<any>=[]
  psnYear:Array<any>=[];
  isDate: any = 0;
  // getMonthYear()
  // {
  //   let date1:any
    
  //   console.log("date1",date1);
  //   this.ApiUrlService.postUpcomingpension({}, "getYearMonth").subscribe((res:any)=>{
  // console.log("res",res.data)
  // this.psnmonth=res.data;
  
  // this.psnYear = [...new Map(this.psnmonth.map((item:any) =>
  //   [item['psnYear'], item])).values()];
  
  //   let date=new Date();
  //   console.log("month",date.getFullYear())
  //   this.reportmonth=date.getMonth()+1;
  //   this.reportYear=date.getFullYear()
  //   this.enhancePensionDtls();
  //   });
  
  // }
  reset(data: any)
  {
    this.reportmonth = data?.month
    this.reportYear  = data?.year
    this.zoneFlag     = data?.zone
    this.departmentId = data?.departmentControl?.v_DEPT_ID ? data.departmentControl.v_DEPT_ID : "";
    this.isDate = data?.isDate
if(data?.officeID){
  this.office_id_selection_flag = true
}else {
  this.office_id_selection_flag = false
}

this.enhancePensionDtls();
}
  enhancePensionDtls()
  {
    
      let data = {
        "reportType":"1",
        // "officeId":this.userdetails.officeid,
        // 'isRole':this.userdetails.roleid,

        "isRole":    this.zoneFlag ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
        "officeId":  this.zoneFlag ? this.zoneFlag : this.userdetails.officeid,

        'inYear':this.reportYear.toString(),
        'inMonth':this.reportmonth.toString(),
        "deptId"     :this.departmentId ? this.departmentId  : 0,
        "isDate" : this.isDate
        // 'isRole':"98"
      }
      // let data = {
      //   "reportType":"1",
      //   "officeId":'904',
      //   'inYear':'2023',
      //   'inMonth':'4',
      //   'isRole':'98'
      // }

      this.load.show()
      this.ApiUrlService.getUpcomPsnReport('getpensioncommonreportbyreporttype', data).subscribe({
        next: (res) => {
          

          console.log('res',res)


        let data: any[]=[];
        if(res && res.status == 'SUCCESS' && res.data){
          if(res.data.errorMessage) {
            data = [];
          } else {
            data = JSON.parse(res.data)
            // data = JSON.parse(res.data)
        // this.dataSource = new MatTableDataSource(data);
            for(let eachDataIndex in data) {
              data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
              data[eachDataIndex]["empNameAndCode"] = `${data[eachDataIndex]["name"]} (${data[eachDataIndex]["empCode"]})` 
            }   
            // this.enhancePsnList = data.map( obj=> {
            //   const {sNo, ...restObj } = obj;
            //   return restObj
            // });
            // console.log('this.firstPensionnList',this.enhancePsnList)
          }
        } else {
          data = [];
        }
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      },
     


      error: (err) => {
        this.load.hide();
        console.log(err);
        this.error = err
      
      }, complete: ()=> {
        this.load.hide()
      }

  })
  }
  
  reviceParamsfilter(data:any){
    
    this.reportmonth = data?.month
    this.reportYear  = data?.year
    this.zoneFlag     = data?.zone
    this.isDate = data?.isDate
    this.departmentId = data?.departmentControl?.v_DEPT_ID ? data.departmentControl.v_DEPT_ID : "";
    if(data?.officeID){
      this.office_id_selection_flag = true
    }else {
      this.office_id_selection_flag = false
    }
    
    this.enhancePensionDtls();
  }
  









  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  generateExcelOrPdfData() {
    const enhancePsnList: any[] = [];
    const filteredData = this.dataSource.filteredData;
    const dataHeaderArray = [
    {
      sNo: "S.No.",
      empNameAndCode: "Name",
      // name:   ,
      refNo: "Ref No",
      // empCode:   ,
      ppoNo: "PPO No",
      dob: "Date of Birth",
      ofcName: "Office Name",
      treasCode: "Treasury Code",
      deptName: "Dept Name",
      zoneName: "Zone Name",
      accountNo: "Account No",
      psnAmt: "PSN Amount",
      death_date:"PSN Death Date",
      familyPsnName: "Family PSN Name",
      familyPsnAmt: "Family PSN Amount",
      enhancePsnEnd: "Enhance PSN End",
      enhancePsnAmt: "Enhance PSN Amount",
          } 
  ];
  for(const eachData of filteredData) {
    let eachObj: any = {}
    eachObj["sNo"] = eachData.sNo;
    eachObj["empNameAndCode"] = eachData?.empNameAndCode ?? "" ;
    eachObj["refNo"] = eachData?.refNo ?? "";
    eachObj["ppoNo"] = eachData?.ppoNo ?? "" ;
    eachObj["dob"] = eachData?.dob ?? "";
    eachObj["ofcName"] = eachData?.ofcName ? eachData?.ofcName + '(' + eachData?.officeId + ')' : "";
    eachObj["treasCode"] = eachData?.treasCode ?? "";
    eachObj["deptName"] = eachData?.deptName ?? "";
    eachObj["zoneName"] = eachData?.zoneName ?? "";
    eachObj["accountNo"] = eachData?.accountNo ?? "";
    eachObj["psnAmt"] = eachData?.psnAmt ?? "";
    eachObj["death_date"] = eachData?.death_date ?? "";
  eachObj["familyPsnName"] = eachData?.familyPsnName ?? "";
  eachObj["familyPsnAmt"] = eachData?.familyPsnAmt ?? "";
  eachObj["enhancePsnEnd"] = eachData?.enhancePsnEnd ?? "";
  eachObj["enhancePsnAmt"] = eachData?.enhancePsnAmt ?? "";
  enhancePsnList.push(eachObj)
  // eachObj["sNo"] = eachData.sNo;
  // eachObj["sNo"] = eachData.sNo;
}
return [enhancePsnList, dataHeaderArray];
  }

  exportToPdf(id: string, name: string){
    if(this.dataSource && this.dataSource?.filteredData && this.dataSource.filteredData.length){
      let  [enhancePsnList, dataHeaderArray] = this.generateExcelOrPdfData()
    this.load.show();
    this.commonService.downloadPdf(`#${id}`, name, name,  enhancePsnList, dataHeaderArray)
    this.load.hide();
    }
}
    
  exportToExcel(name: string){
    if(this.dataSource && this.dataSource?.filteredData && this.dataSource.filteredData.length){
      let  [enhancePsnList, dataHeaderArray] = this.generateExcelOrPdfData();

      this.load.show();
      this.commonService.exportTOExcel(enhancePsnList,dataHeaderArray, name);
      this.load.hide();
    } 
  }
}
