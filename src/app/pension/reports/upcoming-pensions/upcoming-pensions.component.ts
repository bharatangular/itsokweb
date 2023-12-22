import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort'; 
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { CommonService } from 'src/app/services/common.service';
import { LoaderService } from 'src/app/services/loader.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { TokenManagementService } from 'src/app/services/token-management.service';

@Component({
  selector: 'app-upcoming-pensions',
  templateUrl: './upcoming-pensions.component.html',
  styleUrls: ['./upcoming-pensions.component.scss']
})
export class UpcomingPensionsComponent implements OnInit {
 


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() EmpId = new EventEmitter();
  
selectedOptions = [5,10,25,100]
  displayedColumns: string[] =[ 
    'sNo',
    'empNameAndCode',
    "deptName",     
    "designation",
    "dob",
    "doj",
    "dor",  
    "ofcName",
    "treasCode",
    "servcCat",
    "essInitated",
    "psnInitated",
    
    'view'
  ]
  // "accountNo",
  // displayedColumns: string[] = ['empCode','name', 'designation','accountNo','dateOfBirth','dateOfJoining', 'officeName', 'deptName'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('content', { static: false }) el!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  selected = '';
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
  upcomingPensionList:any[] = [];
  length: number=0;
  pageSize: number = 5;
  pageIndex: number=0;
  zoneFlag: any;
  office_id_selection_flag?: boolean;
  filterDetails: any;
  isNavigate: boolean = false;
  isDate: any;
  // errorMessage: string;
  departmentId : any;
  constructor(public dialog: MatDialog, 
    private route: ActivatedRoute,
    private _Service: PensionServiceService, 
    private _snackBar: MatSnackBar,
    private router:Router,
    private load:LoaderService,
    private commonService: CommonService,
    private tokenInfo:TokenManagementService) 
    { 
       this.encryptMode = true;
    }

  ngOnInit(): void {

    this.empinfo=this.tokenInfo.empinfoService;
    this.userdetails=this.config.getUserDetails();
    console.log("this.userdetails",this.userdetails)
    // this.getMonthYear();
    // const params = this.route.snapshot.state;
    this.route.paramMap.subscribe(params => {
      
      const passedData = window.history.state; 
     

if(passedData && passedData.isNavigate) {
this.isNavigate = true;
  const year = passedData.year;
  const month = passedData.month;
  this.office_id_selection_flag= passedData.office_id_selection_flag === "true" ? true : false;
  const zone = passedData.zone ?passedData.zone : 0;
  const  selectedZone  = passedData.selectedZone ? passedData.selectedZone : 0;
  const deptName = passedData.deptName ? passedData.deptName : "";
  const deptId = passedData.deptId ? passedData.deptId : "";
  const offcName = passedData.offcName ? passedData.offcName : "";
  const offcId = passedData.offcId ? passedData.offcId : "";
  const isDate = passedData.isDate || passedData.isDate == 0 ? passedData.isDate : 1;
  this.filterDetails = {month: month, year: year, zone: zone, deptName: deptName, deptId: deptId,  officeName: offcName, officeId: offcId, selectedZone: selectedZone}
  this.reviceParamsfilter({month: month, year: year, zone: zone, deptName: deptName, departmentControl: {v_DEPT_ID: deptId}, officeName: offcName, officeId: offcId, selectedZone: selectedZone, isDate: isDate})
  
} 
else {
  this.isNavigate = false;
  let date=new Date();
  // const reportmonth=(date.getMonth()+1).toString();
  // const reportYear=(date.getFullYear()).toString();
  const reportmonth="0";
  const reportYear="0";
 
  this.reviceParamsfilter({month: reportmonth, year: reportYear, zone: 0, isDate: this.isDate})
} 
    });



     this.config.storeDetails("employeeCode",'')
     this.config.storeDetails("employeeId",'')
     this._Service.url="Inbox >  PensionerList"
    
  }
  reportYear:any;
  reportmonth:any;
  psnmonth:any[]=[];
  psnYear:any[]=[];
 

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
    this.getUpcomingPensionsDlts();
  }
  View_ESSPension(employeeCode:any,employeeId:any,psnType:any){
 
    this.config.storeDetails("employeeCode",employeeCode)
    this.config.storeDetails("employeeId",employeeId)
    this.config.storeDetails("psnType",psnType)
    this.config.storeDetails("pkEsignData","");
    this.config.storeDetails("esigntype","");
    this.config.storeDetails("approverSubmitData","");
     this.router.navigate(['/pension/e-Pension/ViewESSPension']);
 
     
  }
  
  
  reviceParamsfilter(data:any){
    // if((data?.month == 0 && data?.year == 0) || (data?.month == 0 && data?.year != 0)){
    //   alert("Please select Year & Month");
    //   return;
    // }
    console.log(data);
    this.reportmonth = data?.month
    this.reportYear  = data?.year
    this.zoneFlag     = data?.zone

    this.isShow = false
    this.departmentId = data?.departmentControl?.v_DEPT_ID ? data.departmentControl.v_DEPT_ID : "";
     this.isDate = data?.isDate
    if(data?.officeID){
      this.office_id_selection_flag = true
    }else {
      this.office_id_selection_flag = false
    }
    this.getUpcomingPensionsDlts();
  }

  
  getUpcomingPensionsDlts()
  {
    this.error = "";
  if(this.reportYear == "0" && this.reportmonth == "0"){
    this.isDate = 0;
  }
  let data=  {
  "reportType":"1",
  "isRole":    Number(this.zoneFlag) ?  (this.office_id_selection_flag ? 5 : 98) :this.userdetails.roleid,
  "officeId":  Number(this.zoneFlag) ? this.zoneFlag : this.userdetails.officeid,
  'inYear':this.reportYear.toString(),
  'inMonth':this.reportmonth.toString(),
  "deptId"     :this.departmentId ? this.departmentId  : 0,
  
  "isDate": this.isDate || this.isDate == 0 ? this.isDate : 1
  }

 

  this.load.show();

      this._Service.postemploye('getemployeecommonreportbyreporttype', data).subscribe({
      next: (res:any) => {
      this.load.hide();

        let data:any[]=[];
        if (res && res.status === "SUCCESS") {
            if(res.data && res.data != 'no data found') { 
              let data1 =JSON.parse(res.data)
              if(data1.errorMessage){
                data = [];
              } else {
                data=[];
                data = JSON.parse(res.data)
              
                for(let eachDataIndex in data) {
                  data[eachDataIndex]["sNo"] = Number(eachDataIndex) + 1;
                  data[eachDataIndex]["empNameAndCode"] = `${data[eachDataIndex]["name"]} (${data[eachDataIndex]["empCode"]})`
                }                
           
                console.log("data",data)
                  this.dataSource = new MatTableDataSource(data);
                  console.log("Upcoming Pensions: ====> " ,this.dataSource )
                  this.upcomingPensionList = data.map( obj=> {
                    const {sNo, ...restObj } = obj;
                    return restObj
                  });
          
              }
    
            } else{
                data=[];
            }
      } else {
                data=[];
            }

            console.log(data, "data test")
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
  ngAfterViewInit() {
  
  }

  applyFilter(event: Event) {
    
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  generateExcelOrPDFData() {
    const upcomingPensionList = [];
    const filteredData = this.dataSource.filteredData;
    const dataHeaderArray = [
     {
      sNo: "S.No.",
      empNameAndCode: "Employee Name",
      deptName: "Department",     
      designation: "Designation",
      dob: "DOB",
      doj: "DOJ",
      dor: "DOR",  
      ofcName: "Office Name",
      treasCode: "Treasury Code",
      servcCat: "Service Category",
      essInitated: "Pension-ESS Status",
      psnInitated: "e-Pension Status",
      // accountNo: "Account No",
      // view: "View ESS-Pension",
    } 
  ];
for(const eachData of filteredData) {
  let eachObj: any = {}
    eachObj["sNo"] = eachData.sNo;
    eachObj["empNameAndCode"] = eachData?.empNameAndCode ?? "" ;
    eachObj["deptName"] = eachData?.deptName ?? "";
    eachObj["designation"] = eachData?.designation ?? "" ;
    eachObj["dob"] = eachData?.dob ?? "";
    eachObj["doj"] = eachData?.doj ?? "";
    eachObj["dor"] = eachData?.dor ?? "";
    eachObj["ofcName"] = eachData?.ofcName ? eachData?.ofcName + '(' + eachData?.officeId + ')' : ""
    eachObj["treasCode"] = eachData?.treasCode ?? "";
    eachObj["servcCat"] = eachData?.servcCat ?? "";
    eachObj["essInitated"] = eachData?.essInitated ?? "";
    eachObj["psnInitated"] = eachData?.psnInitated ?? "";
    eachObj["accountNo"] = eachData?.accountNo ?? "";
    // eachObj["view"] = eachData?.view ?? "";
    upcomingPensionList.push(eachObj)
  
}  
return [upcomingPensionList, dataHeaderArray];
  }
  
  exportToPdf(id: string, name: string){
    if(this.dataSource && this.dataSource?.filteredData && this.dataSource.filteredData.length){
      let [upcomingPensionList, dataHeaderArray] = this.generateExcelOrPDFData()
     this.load.show()
    this.commonService.downloadPdf(`#${id}`,name, name, upcomingPensionList, dataHeaderArray)
    this.load.hide()    
    }
  }

  exportToExcel(){
    if(this.dataSource && this.dataSource?.filteredData && this.dataSource.filteredData.length){ 
      let [upcomingPensionList, dataHeaderArray] = this.generateExcelOrPDFData()
    this.load.show();
    this.commonService.exportTOExcel(upcomingPensionList, dataHeaderArray, "Upcoming Pensioners Report");
    this.load.hide();   
    } 
  }

 
  
}