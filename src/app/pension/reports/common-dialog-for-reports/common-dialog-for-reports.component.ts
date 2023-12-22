import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';
import { LoaderService } from 'src/app/services/loader.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { CommonDialogComponent } from '../../common-dialog/common-dialog.component';
@Component({
  selector: 'app-common-dialog-for-reports',
  templateUrl: './common-dialog-for-reports.component.html',
  styleUrls: ['./common-dialog-for-reports.component.scss']
})
export class CommonDialogForReportsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public dataSourceForRoleWiseReport!: MatTableDataSource<any>;
  public roleWiseReportName: string = "";
  // public employeeSummaryRoleWiseList: any[] = [];
  // public pensionerRoleWiseList: any[] = []
  public displayedColumnsForRoleWiseReport: string[] = [];
  // public zoneOfficeRoleWiseList: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {departmentId:string,zoneId?:string,  name:string, isRole: string, inPendingRole: string, reportName: string, officeId: string, inYear: string, inMonth: string, flag : string,displayedColumnsForRoleWiseReport: any[], isDate: any},
    public dialog: MatDialog,
    private load:LoaderService,
    private commonService: CommonService,
    private _Service: PensionServiceService, 


  ) { }

  ngOnInit(): void {

    
this.displayedColumnsForRoleWiseReport = this.data.displayedColumnsForRoleWiseReport;

    if(this.data ) {
      if(this.data.name === "Employee Summary") {
       this.getEmployeeSummaryRoleWise();
      }
       else if(this.data.name === "Pension Summary") { 
        this.getPensionSummayRoleWise()
      } else if(this.data.name === "Zonal User Wise Pendency Report") {
this.getZoneOfficeSummaryRoleWise()
      }
    }
  }

public getEmployeeSummaryRoleWise() {


  const matData:any[] =[]
  this.dataSourceForRoleWiseReport = new MatTableDataSource(matData)
let data = {
  "isRole":    this.data.isRole,
  "officeId":  this.data.officeId,
  'inYear': this.data.inYear,
  'inMonth':this.data.inMonth,
  "flag" : this.data.flag,
  "inPendingRole": this.data.inPendingRole,
  "deptId"     :this.data.departmentId ? this.data.departmentId : 0
  // "inPendingRole": "1"
} 
this.load.show();
this._Service.postemploye( "getEssDetailsReportForDashBoard",data).subscribe({
    next: (res:any) => {
      this.load.hide();
      this.roleWiseReportName =  `${this.data.reportName} Report`;
      console.log("res",res)
      this.load.hide();
      if (res && res.status === "SUCCESS") {
          if(res.data && res.data?.empInfo?.length) { 
            let data:any[]=[];
            for(let resDataIndex in res.data?.empInfo){
              res.data.empInfo[resDataIndex]["sNo"] = Number(resDataIndex) + 1;
              res.data.empInfo[resDataIndex]["empName"] = `${res.data.empInfo[resDataIndex]["empName"]} (${res.data.empInfo[resDataIndex]["employeeCode"]})`
              res.data.empInfo[resDataIndex]["ofcName"] = `${res.data.empInfo[resDataIndex]["ofcName"]} (${res.data.empInfo[resDataIndex]["ofcId"]}) Treasury Code: ${res.data.empInfo[resDataIndex]["treasCode"]}`
            }
            if(this.data.reportName === "Pending at Approver") {
              data = res.data.empInfo.filter((eachObj: any) => eachObj.status.trim() === "PENDING AT APPROVER OFFICE");
            }
            if(this.data.reportName === "Total Approved") {
              data = res.data.empInfoo.filter((eachObj: any) => eachObj.status.trim() === "Complete");
            } if(this.data.reportName === "Rejected") {
              data = res.data.empInfoo.filter((eachObj: any) => eachObj.status.trim() === "Rejected");
            } else {
              data = res.data.empInfo
            }    
            console.log("data",data)
          this.dataSourceForRoleWiseReport = new MatTableDataSource(data);
          console.log("this.dataSourceForRoleWiseReport",this.dataSourceForRoleWiseReport)
          this.dataSourceForRoleWiseReport.paginator = this.paginator;
          // this.employeeSummaryRoleWiseList = data.map( obj=> {
          //   const {sNo, ...restObj } = obj;
          //   return restObj
          // })
        } 
      } else {
        let data:any[]=[];
        this.dataSourceForRoleWiseReport = new MatTableDataSource(data);
        this.dataSourceForRoleWiseReport.paginator = this.paginator;
        console.log(this.dataSourceForRoleWiseReport , "this.dataSourceForRoleWiseReport" );
      }



      console.log(res.data)
    },
    error: (err) => {
      this.load.hide();
      console.log(err);
      // this.error = err
    
    }, complete: ()=> {
      this.load.hide()
    }
  })

}
public getPensionSummayRoleWise() {

  const matData:any[] =[]
  this.dataSourceForRoleWiseReport = new MatTableDataSource(matData)
let data = {
  "isRole":    this.data.isRole,
  "officeId":  this.data.officeId,
  'inYear': this.data.inYear,
  'inMonth':this.data.inMonth,
  "flag" : this.data.flag,
  "inPendingRole": this.data.inPendingRole,
  "deptId"     :this.data.departmentId ? this.data.departmentId : 0
} 
this.load.show();
this._Service.getUpcomPsnReport( "getPsnDetailsReportForDashBoard",data).subscribe({
    next: (res:any) => {
      
      this.load.hide();
      this.roleWiseReportName =  `${this.data.reportName} Report`;
      console.log("res",res)
      this.load.hide();
      if (res && res.status === "SUCCESS") {
          if(res.data && res.data?.psnInfo?.length) { 
            let data:any[]=[]
            
            for(let resDataIndex in res.data.psnInfo){
              res.data.psnInfo[resDataIndex]["sNo"] = Number(resDataIndex) + 1;
            }
            if(this.data.reportName === "Pending at Zonal(Approver)") {
              data = res.data.psnInfo.filter((eachObj: any) => eachObj.status.trim() !== "Complete");
            }
            if(this.data.reportName === "Approved at Zonal") {
              data = res.data.psnInfo.filter((eachObj: any) => eachObj.status.trim() === "Complete");
            } else {
              data = res.data.psnInfo
            }      
              console.log("data",data)
          this.dataSourceForRoleWiseReport = new MatTableDataSource(data);
          console.log("this.dataSourceForRoleWiseReport",this.dataSourceForRoleWiseReport)
          this.dataSourceForRoleWiseReport.paginator = this.paginator;
            // this.pensionerRoleWiseList=data.map( obj=> {
            //   const {sNo, ...restObj } = obj;
            //   return restObj
            // });
          }
      } else {
        let data:any[]=[];
        this.dataSourceForRoleWiseReport = new MatTableDataSource(data);
        this.dataSourceForRoleWiseReport.paginator = this.paginator;
        console.log(this.dataSourceForRoleWiseReport , "this.dataSourceForRoleWiseReport" );
      }



      console.log(res.data)
    },
    error: (err) => {
      this.load.hide();
      console.log(err);
      // this.error = err
    
    }, complete: ()=> {
      this.load.hide()
    }
  })

}


public getZoneOfficeSummaryRoleWise() {
  let data = {
    "officeId" : this.data.officeId,
    'inYear'   : this.data.inYear,
    'inMonth'  : this.data.inMonth,
    "flag"     : this.data.flag,
    "zoneId":   this.data.zoneId,
    "deptId"   :this.data.departmentId ? this.data.departmentId : 0,
    "isRole":    this.data.isRole,
    "isDate": this.data?.isDate
    
  } 




  this.load.show();
  
  // getPsnDetailsReportZoneWise
  this._Service.getUpcomPsnReport( "getNewZoneWiseDetailsReport",data).subscribe({
      next: (res:any) => {
        this.load.hide();
        this.roleWiseReportName =  `${this.data.reportName} Report`;
        console.log("res",res)
        this.load.hide();
        if (res && res.status === "SUCCESS") {
            if(res.data && res.data) { 
              let data:any[]=[]
              
              for(let resDataIndex in res.data){
                res.data[resDataIndex]["sNo"] = Number(resDataIndex) + 1;
              }
              data = res.data;
              console.log("data",data)
            this.dataSourceForRoleWiseReport = new MatTableDataSource(data);
            console.log("this.dataSourceForRoleWiseReport",this.dataSourceForRoleWiseReport)
            this.dataSourceForRoleWiseReport.paginator = this.paginator;
              // this.zoneOfficeRoleWiseList=data.map( obj=> {
              //   const {sNo, ...restObj } = obj;
              //   return restObj
              // });
            } else {
              let data:any[]=[];
              this.dataSourceForRoleWiseReport = new MatTableDataSource(data);
              this.dataSourceForRoleWiseReport.paginator = this.paginator;
              console.log(this.dataSourceForRoleWiseReport , "this.dataSourceForRoleWiseReport" );
            }
        } else {
          let data:any[]=[];
          this.dataSourceForRoleWiseReport = new MatTableDataSource(data);
          this.dataSourceForRoleWiseReport.paginator = this.paginator;
          console.log(this.dataSourceForRoleWiseReport , "this.dataSourceForRoleWiseReport" );
        }
  
  
  
        console.log(res.data)
      },
      error: (err) => {
        this.load.hide();
        console.log(err);
        // this.error = err
      
      }, complete: ()=> {
        this.load.hide()
      }
    })
  
}


  exportToPdf(id: string, name: string){
    if(this.dataSourceForRoleWiseReport.filteredData.length) {
      let [pensionerList, dataHeaderArray ]: any = this.generateExcelOrPdfData(name)
      if(name === "Pension Summary Role Wise Report"){
        this.load.show()
        // this.commonService.downloadPdf(`#${id}`,"employee_summary", name)
        this.commonService.downloadPdf(`#${id}`,this.roleWiseReportName && this.roleWiseReportName.replace(/\s/g, ""), this.roleWiseReportName,  pensionerList, dataHeaderArray)
        this.load.hide()    
        }
      if(name === "Employee Summary Role Wise Report"){
        this.load.show()
        this.commonService.downloadPdf(`#${id}`,this.roleWiseReportName && this.roleWiseReportName.replace(/\s/g, ""), this.roleWiseReportName,pensionerList, dataHeaderArray)
        this.load.hide()    
        }
        if(name === "Zonal User Wise Pendency Summary"){
          this.load.show()
          this.commonService.downloadPdf(`#${id}`,this.roleWiseReportName && this.roleWiseReportName.replace(/\s/g, ""), this.roleWiseReportName,pensionerList, dataHeaderArray)
          this.load.hide()    
          }

    }
}


exportToExcel(name: string){

  if(this.dataSourceForRoleWiseReport.filteredData.length) {
    const filteredData: any[] = this.dataSourceForRoleWiseReport.filteredData;
  if(name === "Pension Summary Role Wise Report") {
    let [pensionerList, dataHeaderArray ]: any = this.generateExcelOrPdfData(name)
    this.load.show();
    
    this.commonService.exportTOExcel(pensionerList, dataHeaderArray, this.roleWiseReportName && this.roleWiseReportName.replace(/\s/g, ""));
    this.load.hide();
  }
  if(name === "Employee Summary Role Wise Report") {

    let [employeeSummaryList,dataHeaderArray ]: any = this.generateExcelOrPdfData(name)
    this.load.show()
    this.commonService.exportTOExcel(employeeSummaryList, dataHeaderArray,this.roleWiseReportName && this.roleWiseReportName.replace(/\s/g, ""))
    this.load.hide();
  }
  if(name === "Zonal User Wise Pendency Summary") {
    
   let [zoneOfficeRoleWiseList,dataHeaderArray ]: any = this.generateExcelOrPdfData(name)
    this.load.show()
    this.commonService.exportTOExcel(zoneOfficeRoleWiseList, dataHeaderArray, this.roleWiseReportName && this.roleWiseReportName.replace(/\s/g, ""))
    this.load.hide();
  }
}
}


generateExcelOrPdfData(name: string): any{

  if(this.dataSourceForRoleWiseReport.filteredData.length) {
    const filteredData: any[] = this.dataSourceForRoleWiseReport.filteredData;
    const reportData: any[]= [];
    let dataHeaderArray: any[] = [];
  if(name === "Pension Summary Role Wise Report") {
    dataHeaderArray = [
     {
      sNo: "S.No.",
      pendingCurrAssignment: "Pending at Current Assignment",
      pendingSso: "Pending at SSO",
      pendingAtname:"Pending at Name",
      employeeCode: "Employee Code",
      status: "Status"
    } 
  ];
    for(const eachData of filteredData) {
      let eachObj: any = {}
        eachObj["sNo"] = eachData.sNo;
        eachObj["pendingCurrAssignment"] = eachData?.pendingCurrAssignment ?? "-" ;
        eachObj["pendingSso"] = eachData?.pendingSso ?? "0" ;
        eachObj["pendingAtname"] = eachData?.pendingAtname ?? "0" ;
        eachObj["employeeCode"] = eachData?.employeeCode ?? "0" ;
        eachObj["status"] = eachData?.status ?? "-" ;
        reportData.push(eachObj)
    }
    
    // this.load.show();
    // this.commonService.exportTOExcel(pensionerList,dataHeaderArray, name);
    // this.load.hide();
  }
  if(name === "Employee Summary Role Wise Report") {

    // const employeeSummaryList: any[]= []
    dataHeaderArray = [
     {
      sNo: "S.No"  ,
      empName:  "Employee Name" ,
        ofcName:  "Office Name" ,
        srvcCatName:  "Service Category Name" ,
        subSrvcCatName:  "Sub Service Category Name" ,
        dor:  "Date Of Retirement" ,
        zoneoffc:  "Zone Office" ,
        payCommName:  "Pay Commission Name" ,
        status:  "Status" ,
    } 
  ];
    for(const eachData of filteredData) {
      let eachObj: any = {}
        eachObj["sNo"] = eachData.sNo;
        eachObj["empName"] = eachData?.empName ?? "-" ;
        eachObj["ofcName"] = eachData?.ofcName ?? "-" ;
        eachObj["srvcCatName"] = eachData?.srvcCatName ?? "-" ;
        eachObj["subSrvcCatName"] = eachData?.subSrvcCatName ?? "-" ;
        eachObj["dor"] = eachData?.dor ?? "-" ;
        eachObj["zoneoffc"] = eachData?.zoneoffc ?? "-" ;
        eachObj["payCommName"] = eachData?.payCommName ?? "-" ;
        eachObj["status"] = eachData?.status ?? "-" ;
        reportData.push(eachObj)
    }
   return  [reportData, dataHeaderArray ]
    // this.load.show()
    // this.commonService.exportTOExcel(employeeSummaryList, dataHeaderArray,name)
    // this.load.hide();
  }
  if(name === "Zonal User Wise Pendency Summary") {
    // displayedColumnsForRoleWiseReport: string[] =  ["sNo","ssoId","empId","officeName" ,"dor","displayName","pendingAtHodApprover","ddoCode","reqId"
    //     ,"pendingAtHodMaker",  "pendingAtHodCheker",  "currentAssignmentId","empCode","dob","officeid","zoneName","zoneOfficeId", "treasCode","Action"];
    dataHeaderArray = [
     {
      // ["sNo", "empCode","empName" ,"deptName" , "officeName" ,"dob", "dor" ,"zoneName","status"
      //   ,"Action"];
      sNo: "S.No.",
      empCode:"Emp. Code",
      empName: "Employee Name",
      deptName:"Dept. Name" , 
      officeName:" Office Name",
      dob: "DOB",
      dor :"DOR",
      // dob: "dob",
      zoneName:"zoneName",
      status: "status",
      // ddoCode: "ddoCode",
      // reqId: "reqId",
      // pendingAtHodMaker: "pendingAtHodMaker",
      // pendingAtHodCheker:"pendingAtHodCheker",



      // currentAssignmentId: "currentAssignmentId",
      // empCode:"ssoId",
      // dob: "dob",
      // officeid:"officeid",
      // zoneName :"zoneName",
      // zoneOfficeId:"zoneOfficeId",
      // treasCode: "treasCode",
      // Action: "Action",
 

      // empOfcName: "Employee Ofc Name" ,
      // employeeCode: "Employee Code",
      // pendingCurrAssignment: "Pending at Current Assignment",
      // pendingSso: "Pending at SSO",
      // pendingAtname: "Pending at Name",
      // status: "Status",
    } 
  ];
    for(const eachData of filteredData) {
      let eachObj: any = {}
        eachObj["sNo"] = eachData.sNo;
         // displayedColumnsForRoleWiseReport: string[] =  ["sNo","ssoId","empId","officeName" ,"dor","displayName","pendingAtHodApprover","ddoCode","reqId"
    //     ,"pendingAtHodMaker",  "pendingAtHodCheker",  "currentAssignmentId","empCode","dob","officeid","zoneName","zoneOfficeId", "treasCode","Action"];

    // sNo: "S.No.",
    // empCode:"Emp. Code",
    // empName: "Employee Name",
    // deptName:"Dept. Name" , 
    // officeName:" Office Name",
    // dob: "DOB",
    // dor :"DOR",
    // // dob: "dob",
    // zoneName:"zoneName",
    // status: "status",

          eachObj["empCode"] = eachData?.empCode ?? "-" ;
        eachObj["empName"] = eachData?.empName ?? "-" ;
        eachObj["deptName"] = eachData?.deptName ?? "-" ;
        eachObj["officeName"] = eachData?.officeName ?? "-" ;
        eachObj["dob"] = eachData?.dob ?? "-" ;
        eachObj["dor"] = eachData?.dor ?? "-" ;
          eachObj["zoneName"] = eachData?.zoneName ?? "-" ;
        eachObj["status"] = eachData?.status ?? "-" ;
        // eachObj["pendingAtHodMaker"] = eachData?.pendingAtHodMaker ?? "-" ;
        // eachObj["pendingAtHodCheker"] = eachData?.pendingAtHodCheker ?? "-" ;
        // eachObj["currentAssignmentId"] = eachData?.currentAssignmentId ?? "-" ;
        // eachObj["dob"] = eachData?.dob ?? "-" ;
        //   eachObj["officeid"] = eachData?.officeid ?? "-" ;
        // eachObj["zoneName"] = eachData?.zoneName ?? "-" ;
        // eachObj["zoneOfficeId"] = eachData?.zoneOfficeId ?? "-" ;
        // eachObj["treasCode"] = eachData?.treasCode ?? "-" ;
        // eachObj["Action"] = eachData?.Action ?? "-" ;
      


        // eachObj["empOfcName"] = eachData?.empOfcName ?? "-" ;
        // eachObj["employeeCode"] = eachData?.employeeCode ?? "-" ;
        // eachObj["pendingCurrAssignment"] = eachData?.pendingCurrAssignment ?? "-" ;
        // eachObj["pendingSso"] = eachData?.pendingSso ?? "-" ;
        // eachObj["pendingAtname"] = eachData?.pendingAtname ?? "-" ;
        // eachObj["status"] = eachData?.status ?? "-" ;
        reportData.push(eachObj)
    }
    
    // this.load.show()
    // this.commonService.exportTOExcel(zoneOfficeRoleWiseList, dataHeaderArray,name)
    // this.load.hide();
  }
  return [reportData,dataHeaderArray ];
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
        message: 'View History',id:1,reqId:reqId.toString()
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
        message: 'View Objection',id:20,reqId:reqId.toString()
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
        message: 'View Documents',id:21,reqId:reqId.toString()
      }
    }
  );
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceForRoleWiseReport.filter = filterValue.trim().toLowerCase();
  if (this.dataSourceForRoleWiseReport.paginator) {
    this.dataSourceForRoleWiseReport.paginator.firstPage();
  }
}
}
