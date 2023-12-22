import { Component, ElementRef, OnInit, ViewChild ,AfterViewInit,Inject, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import {  MatDialog } from '@angular/material/dialog';
// import { CommonDialogComponent } from '../../common-dialog/common-dialog.componen
import { CommonService } from 'src/app/services/common.service';

import { CommonDialogComponent } from './../../common-dialog/common-dialog.component'
@Component({
  selector: 'app-dash-dialog',
  templateUrl: './dash-dialog.component.html',
  styleUrls: ['./dash-dialog.component.scss']
})
export class DashDialogComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource           !: MatTableDataSource<any>;
  flag                 !: Number;
  displayedColumns     : string[] = ["sNo", "pensionerId","nameEn","empCode","designation","ppoNo",'officeName', "deptName",'zoneName',];
  displayedColumns4    : string[] = ["pensionerId","nameEn","dob","dor","desgignation","ppoNo",'officeName',"deptName",];
  displayedColumns6    : string[] = ["pensionerId","nameEn","dob","dor", "GpoNo","desgignation",'officeName',"deptName"];
  displayedColumns5    : string[] = ["pensionerId","nameEn","dob","dor", "CpoNo","desgignation",'officeName',"deptName",];
  displayedColumns7    : string[] = ["requestId","empCode", "ssoId","desgignation", "officeid",'officeName',"deptName",];
  displayedColumns8    : string[] = ["requestId","empCode","name" ,"ssoId","desgignation","officeid","officeName","deptname"];
  data                 : any = [];
  displayedColumns1     : string[] = ["sNo", "empCode","empName" ,"deptName",'officeName', "dob","dor", 'zoneName',"mobile","status",'pendingFrom' , 'pendingDays' , "Action"];
  displayedColumnsobjection     : string[] = ["sNo", "empCode","empName" ,"deptName",'officeName', "dob","dor", 'zoneName',"mobile","status",'objection' ,'pendingFrom' , 'pendingDays' , "Action"];
  reportType : any;
  displayedColumnsemployee    : string[] = ["sNo","empCode","empName", "deptName", "officeName" , "dob","dor",'zoneName'  ];
  columnName :any
  displayedColumnscpogpo: string[];

    displayedColumnszone: string[] =[ 
  
      "zoneName",
      "pendingInprocess",
   
    ];
    displayedColumnszone2: string[] =[ 
  
      "zoneName",
      "pendingObjection",
   
    ];
    displayedColumnszone1: string[] =[ 
  
      "zoneName",
      "totalPsnKit",
   
    ];

    columnVisibility: boolean[] = [
      true, // empName
      true, // pensionerId
      true, // deptName
      true, // designation
      true, // dor
      true, // ppoNo
      true, // gpoNo
      true, // gpoAmt
      true, // refNo
      true, // cpoNo
      true, // cpoAmt
    ];
    displayedColumnsCommutationRequest1   : string[] = ["sNo", "pensionerId", "employeeName","dob","dor","initiatedDate",'pendingAt'];
    displayedColumnsCommutationRequest   : string[] = ["sNo", "pensionerId", "employeeCode", "employeeName", "dob","officeName", "deptName",  "dor","initiatedDate", "pendingAt"];
    gpoColumnsHide(flag:Number){
      if (flag == 1 || flag == 3) {
        this.columnVisibility[9] = false; // cpoNo
        this.columnVisibility[10] = false; // cpoAmt
      this.displayedColumnscpogpo.splice(9,2)  
      } else if (flag == 2 || flag == 4){
        this.columnVisibility[6] = false; // gpoNo
        this.columnVisibility[7] = false; // gpoAmt
     this.displayedColumnscpogpo.splice(6,2)  
      }
    }
    reportName : any;

  constructor(    private dialogRef: MatDialogRef<DashDialogComponent>, private commonService : CommonService,
      @Inject(MAT_DIALOG_DATA) data: { data: any , flag : any, detail:any,columnName:any,reportName:any,type:any},
      private cdref: ChangeDetectorRef , public dialog: MatDialog,
    ) 
    { 

      
      console.log(data, "test data as")  
      if(data.type == 'GPO'){
        this.displayedColumnscpogpo = [
          'sNo',
          'empName',
          'pensionerId',
          'deptName',
          'designation',
          'dor',
          'ppoNo',
          'gpoNo', 
          'gpoAmt',
          'refNo',
          'cpoNo',
          //'cpoAmt',
          ];
      }
      else if(data.type == 'CPO'){
        this.displayedColumnscpogpo = [
          'sNo',
          'empName',
          'pensionerId',
          'deptName',
          'designation',
          'dor',
          'ppoNo',
          'gpoNo', 
          //'gpoAmt',
          'refNo',
          'cpoNo',
          'cpoAmt',
          ];
      }
      else{
        this.displayedColumnscpogpo = [
          'sNo',
          'empName',
          'pensionerId',
          'deptName',
          'designation',
          'dor',
          'ppoNo',
          'gpoNo', 
          'gpoAmt',
          'refNo',
          'cpoNo',
          'cpoAmt',
          ];
      }
      this.reportName = data ? data?.reportName : ""
      this.flag = data ? data?.flag : 4 
      this.gpoColumnsHide(this.flag)
      this.reportType =  data?.detail ? data?.detail: ""
      this.data = data ? (data?.data ? data?.data : []) : [];
      this.columnName = data ? data?.columnName : ""
        if(this.columnName == 'In-Process (Objection)'){
          this.displayedColumnszone = this.displayedColumnszone2;
          
        }
      if(this.flag == 3 && this.reportType == 'ess'){
        this.displayedColumnsemployee = this.displayedColumns1;
        this.reportType = 'pss'

        this.reportName = 'Pending at ESS'
        this.displayedColumnsemployee.pop()
      }

      if(this.flag ==13 || this.flag ==12 && this.reportType =='pss'){
        // this.displayedColumns1 = this.displayedColumnsemployee
        // this.reportType = 'ess'
        this.displayedColumns1.splice(10,2)  
      }
      // alert(this.reportName)
      if(this.reportName == 'Pending at HoO - Objection'){
        this.displayedColumns1 = this.displayedColumnsobjection
      }

      if(this.reportType == 'commutationRequest' && this.flag == 7 ){
        this.displayedColumnsCommutationRequest = this.displayedColumnsCommutationRequest1;
      }

    }

  ngOnInit(): void {
  }



  ngAfterViewInit() {
    // console.log(this.data, " detail report")
    this.dataSource = new MatTableDataSource(this.data);
    console.log(this.dataSource.filteredData, "data fileter")
    this.dataSource.paginator = this.paginator;
    this.cdref.detectChanges();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  View_History(reqId:any){
    this.dialog.open(CommonDialogComponent,
      {
        maxWidth: '60vw',
        maxHeight: 'auto',
        width: '100%',
        panelClass: 'dialog-w-50', autoFocus: false
        , data: {
          message: 'View History',id:1,reqId:reqId?.toString()
        }
      }
    );
  }
  View_Objection(reqId:any){
    this.dialog.open(CommonDialogComponent,
      {
        maxWidth: '60vw',
        maxHeight: 'auto',
        width: '100%',
        panelClass: 'dialog-w-50', autoFocus: false
        , data: {
          message: 'View Objection',id:20,reqId:reqId?.toString()
        }
      }
    );
  }
  View_Document(reqId:any){
    this.dialog.open(CommonDialogComponent,
      {
        maxWidth: '60vw',
        maxHeight: 'auto',
        width: '100%',
        panelClass: 'dialog-w-50', autoFocus: false
        , data: {
          message: 'View Documents',id:21,reqId:reqId?.toString()
        }
      }
    );
  }
 








  generateExcelOrPDFData() {
    const pensionerList: any[] = [];
      const filteredData = this.dataSource.filteredData;
      const dataHeaderArray = [
       {
        sNo: "S.No",
        empCode: "Emp. Code",
        empName: "Employee Name",
        deptName: "Dept. Name",
        officeName: "Office Name",
        dob: "DOB",
        dor: "DOR",
        zoneName: "Zone Name ",
        mobile: "Mobile Number",
        status: "Status",
        pendingFrom: "Pending From",
        pendingDays: "Total Pending Days "
      } 
    ];

   
  for(const eachData of filteredData) {
    let eachObj: any = {}
      eachObj["sNo"] = eachData.sNo;
      eachObj["empCode"] = eachData.empCode;
      eachObj["empName"] = eachData.empName;
      eachObj["deptName"] = eachData.deptName;
      eachObj["officeName"] = eachData.officeName;
      eachObj["dob"] = eachData.dob ;

      eachObj["dor"] = eachData.dor;
      eachObj["zoneName"] = eachData.zoneName;
      eachObj["mobile"] = eachData.mobile ?? "-";
      eachObj["status"] = eachData.status;
      eachObj["pendingFrom"] = eachData.pendingFrom;
      eachObj["pendingDays"] = eachData.pendingDays ;
      pensionerList.push(eachObj)

  }

  return [dataHeaderArray, pensionerList]
  }
  
  exportToPdf(id: string, name: string){
    if(this.dataSource && this.dataSource.filteredData && this.dataSource.filteredData.length ){
      let dataHeaderArray, pensionerList :any;
      if(this.reportType == 'cpogpo'){
        [dataHeaderArray, pensionerList] = this.cpogpoheaders()
      } else if(this.reportType == 'cpogpodetail'){
        [dataHeaderArray, pensionerList] = this.cpogpoheaderspayment()
      }
      
      else {
     [dataHeaderArray, pensionerList] =   name=='e-Pension Status ess' ? this.generateExcelOrPDFData1() : this.generateExcelOrPDFData();
      }
    console.log(dataHeaderArray,pensionerList, "test" )
    this.commonService.downloadPdf(`#${id}`,this.reportName, this.reportName, pensionerList,dataHeaderArray);
  }
}

    
  exportToExcel(name: string){
    if(this.dataSource && this.dataSource.filteredData && this.dataSource.filteredData.length ){
    // let [dataHeaderArray, pensionerList] = name=='e-Pension Status ess' ? this.generateExcelOrPDFData1() : this.generateExcelOrPDFData()
    let dataHeaderArray, pensionerList :any;
    if(this.reportType == 'cpogpo'){
      [dataHeaderArray, pensionerList] = this.cpogpoheaders()
    }  else if(this.reportType == 'cpogpodetail'){
      [dataHeaderArray, pensionerList] = this.cpogpoheaderspayment()
    }
    
    else {
   [dataHeaderArray, pensionerList] =   name=='e-Pension Status ess' ? this.generateExcelOrPDFData1() : this.generateExcelOrPDFData();
    }
     
    this.commonService.exportTOExcel(pensionerList,dataHeaderArray, this.reportName);
  
  }
}


// ["empCode","empName", "deptName", "officeName" , "dob","dor",'zoneName'  ];
generateExcelOrPDFData1() {
  const pensionerList: any[] = [];
    const filteredData = this.dataSource.filteredData;
    
    const dataHeaderArray = [
     {
      sNo: "S.No",
      empCode: "Emp. Code",
      empName: "Employee Name",
      deptName: "Dept. Name",
      officeName: "Office Name",
      dob: "DOB",
      dor: "DOR",
      zoneName: "Zone Name ",
      // mobile: "Mobile Number",
      // status: "Status",
      // pendingFrmDate: "Pending From",
      // totalPendingDays: "Total Pending Days "
    } 
  ];

 
for(const eachData of filteredData) {
  let eachObj: any = {}
    eachObj["sNo"] = eachData.sNo;
    eachObj["empCode"] = eachData.empCode;
    eachObj["empName"] = eachData.empName;
    eachObj["deptName"] = eachData.deptName;
    eachObj["officeName"] = eachData.officeName 
    eachObj["dob"] = eachData.dob ;

    eachObj["dor"] = eachData.dor;
    eachObj["zoneName"] = eachData.zoneName;
    // eachObj["mobile"] = eachData.mobile;
    // eachObj["status"] = eachData.status;
    // eachObj["pendingFrmDate"] = eachData.pendingFrmDate;
    // eachObj["totalPendingDays"] = eachData.totalPendingDays ;
    pensionerList.push(eachObj)

}

return [dataHeaderArray, pensionerList]
}



// displayedColumns     : string[] = ["sNo", "pensionerId","nameEn","empCode","designation","ppoNo",'officeName', "deptName",'zoneName',];
cpogpoheaders() {
  const pensionerList: any[] = [];
    const filteredData = this.dataSource.filteredData;
    const dataHeaderArray = [
     {
      sNo: "S.No",
      pensionerId: "Pensioner Id",
      nameEn : "Name",
      empCode: "Emp. code",
    
      designation: "Designation",
     
      ppoNo: "PPO No",
      officeName: "Office Name",
      deptName: "Dept. Name",
      zoneName: "Zone Name",
   
    } 
  ];

 
for(const eachData of filteredData) {
  let eachObj: any = {}
    eachObj["sNo"] = eachData.sNo;
    eachObj["pensionerId"] = eachData.pensionerId;
    eachObj["nameEn"] = eachData.nameEn;

    eachObj["empCode"] = eachData.empCode;
  
    eachObj["designation"] = eachData.designation;
  

    eachObj["ppoNo"] = eachData.ppoNo;
    eachObj["officeName"] = eachData.officeName ?? "-";
    eachObj["deptName"] = eachData.deptName;

    eachObj["zoneName"] = eachData.zoneName;

    
    pensionerList.push(eachObj)

}

return [dataHeaderArray, pensionerList]
}





cpogpoheaderspayment() {
  const pensionerList: any[] = [];
    const filteredData = this.dataSource.filteredData;
    const dataHeaderArray = [
     {
      sNo: "S.No",
      empName: "Emp. Name",
      pensionerId: 'Pensioner Id',
      deptName : "Dept. Name",
      designation: "Designation",
      dor: "DOR",
      ppoNo: "PPO No",
      gpoNo: "GPO No",
      gpoAmt: "GPO Amount",
      refNo: "Payement Ref. No.",
      cpoNo: "CPO No",
      cpoAmt: "CPO Amount",
    } 
  ];
for(const eachData of filteredData) {
  let eachObj: any = {}
    eachObj["sNo"] = eachData.sNo;
    eachObj["empName"] = eachData.empName;
    eachObj["pensionerId"] = eachData.pensionerId;
    eachObj["deptName"] = eachData.deptName;
    eachObj["designation"] = eachData.designation;
    eachObj["dor"] = eachData.dor;
    eachObj["ppoNo"] = eachData.ppoNo ?? "-";
    eachObj["gpoNo"] = eachData.gpoNo ?? "-";
    eachObj["gpoAmt"] = eachData.gpoAmt ?? "-";
    eachObj["refNo"] = eachData.refNo  ?? "-";
    eachObj["cpoNo"] = eachData.cpoNo  ?? "-";
    eachObj["cpoAmt"] = eachData.cpoAmt ?? "-";
    pensionerList.push(eachObj)
}

return [dataHeaderArray, pensionerList]
}
}

