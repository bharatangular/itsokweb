import { Component, OnInit, ViewChild, OnChanges, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonDialogComponent } from '../../common-dialog/common-dialog.component';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FirstPensionDialogComponent } from '../first-pension-dialog/first-pension-dialog.component';
import { auto } from '@popperjs/core';
import { PdfPreviewComponent } from '../pdf-preview/pdf-preview.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { CommonService } from 'src/app/services/common.service';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { MonthlyPensionDialogComponent } from '../monthly-pension-dialog/monthly-pension-dialog.component';


interface serviceCatList{
  serviceCategoryId:number
  serviceCategoryNameEn:string;
}

@Component({
  selector: 'app-first-pension',
  templateUrl: './first-pension.component.html',
  styleUrls: ['./first-pension.component.scss']
})


export class FirstPensionComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


// paginator!;
// @ViewChild('paginatorElement', {read: ElementRef})
fromNo:any=1;
toNo:any=50;
holdDocument:any[]=[];
holdReason:any[]=[];
otherDeduction:any[]=[];
paginatorHtmlElement!: ElementRef;

selectPensioner:boolean[]=[];
selectedPensionerList:any[]=[];
selectDropList:any[]=[50,100,200,500,1000,5000,10000]
selectedTreasury:any="1800";
  gpoCpoData:any=[];
  ObjecteCpoData:any=[];
  serviceCategory:any[]=[];
  ppoNo:any='';
  empId:any='';
  ppoNo1:any='';
  empId1:any='';
  serviceCat:any=0;
  department:any='';
  Treasury:any='';
  isCPO:boolean=true;
  name:any;
  checkboxValue:any;
  myForm!: FormGroup;
  isButtonEnable:boolean =true;
  empInfo:any;
  stopReasonForm!:FormGroup;
  objectedPensionerColumns: string[] = ['Pensioner Details','PPO Number','Service Category','Treasury Name','CPO Amt. & Budget Head','Issuance Date','Date of Retirement','Total Deduction','Net Payable Amount'];
  displayedColumns: string[] = ['check','Pensioner Details','PPO Number',"GPO Number",'Service Category','Treasury Name','CPO Amt. & Budget Head','Issuance Date','Date of Retirement','isDe','Total Deduction','Net Payable Amount','Action'];
  monthlydisplayedColumns: string[] = ['Pensioner Details',"pensionerId",'PPO Number',"Pension Kit","pensionAmount","dr",'drAmt',"recovery","Tax","CPO Deduction",'Net Payable Amount','Other Deduction','saveDeduction','Action'];
  monthlyObjectedColumns: string[] = ['Pensioner Details','pensionerId','PPO Number',"Pension Kit",'holdReason','frmDate','Action'];
  dataSource = new MatTableDataSource();
  dataSourcePensioner = new MatTableDataSource();
  dataSourceMonthly = new MatTableDataSource();
  selection: any;
  flag:any;
  myObject:any;
  netPayableAmount:any;
  BudgetHead:any;
  options = ["Internet Explorer", "Edge", "Firefox", "Chrome", "Opera", "Safari"]
  items = [
    {
      productId: 446,
      artName: "CASUAL",
    },
    {
      productId: 459,
      artName: "test",

    }
  ];
  data=[5,25, 50, 500,1000]
  numberField!: string;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  selectedProp: string=''


  is_Disabled:boolean=true;
  constructor(public _dialog: MatDialog,private pensionService: PensionServiceService,private fb: FormBuilder,private _Service: PensionServiceService
    ,private formBuilder:FormBuilder,public dialog: MatDialog,private tokenInfo:TokenManagementService,public common:CommonService,public load:LoaderService) {
    // this.selection.changed.subscribe(item=>{
    //   this.isButtonEnable = this.selection.selected.length == 0;
    // })
   }
   config: AppConfig = new AppConfig();
  ngOnInit(): void {
    this._Service.configMenu = { url: "First Pension" };
    this.getTreasury();
    this.getPensionerDetailsGPO();
    this.getHoldReasons();
    this.empInfo = this.tokenInfo.empinfoService;

    // this.userDetails = sessionStorage.getItem("selected-roledetail");;

   console.log("empInfo",this.empInfo)
    this.myForm = this.fb.group({
      checkboxValue: ['']
    });
    // this. getPensionerDetailsCPO();

  

  }


  hitMe() {
    
    this.selectedProp = this.selectedProp;
  }
  filterValue:any;
  getPensionerDetailsCPO(){
    this.isCPO=true;
    this.name="CPO Amt. & Budget Head"
    
    // const index = this.displayedColumns.indexOf('CPO Number');
    // if (index > -1) { 
    // }else{
    //   this.displayedColumns.splice(3, 0, "CPO Number")
    // }
    
   this.displayedColumns=['check','Pensioner Details','PPO Number',"CPO Number",'Service Category','Treasury Name','CPO Amt. & Budget Head','Issuance Date','Date of Retirement','isDe','Total Deduction','Net Payable Amount','Action'];
    
    this.gpoCpoData=[];
    let data = {
      isActive:"Y"
    };
    this.pensionService.getPensionerDetail(data, 'getCpoOfPensioners').subscribe({
      next: (res) => {
        if (res.status === 'SUCCESS') {
            this.gpoCpoData=res.data;
            let mymap = new Map();
            const unique = this.gpoCpoData.filter((el: { serviceCategoryNameEn: any; }) => {
              const val = mymap.get(el.serviceCategoryNameEn);
              if(val) {
                  if(el.serviceCategoryNameEn < val) {
                      mymap.delete(el.serviceCategoryNameEn);
                      mymap.set(el.serviceCategoryNameEn, el.serviceCategoryNameEn);
                      return true;
                  } else {
                      return false;
                  }
              }
              mymap.set(el.serviceCategoryNameEn, el.serviceCategoryNameEn);
              return true;
          });

            this.serviceCategory=unique;

            this.gpoCpoData.forEach(function(item: any){
              item['is_Disabled']=true
            });
            // let newList:any[]=[];
            // for(let i=0;i<this.gpoCpoData.length;i++)
            // {
            //   if(this.gpoCpoData[i].dmsDocId!=null)
            //   {
            //     newList.push(this.gpoCpoData[i])
            //   }
            // }
            this.dataSource = new MatTableDataSource(this.gpoCpoData);
            this.dataSource.paginator = this.paginator;

            this.netPayableAmount=res.data.netPayableAmount;
            this.BudgetHead=res.data.cpoBudgetHead;
        //     
        //     for (let i = 0; i < res.data.length; i++) {
        //       this.filterValue = res.data[i].serviceCategoryNameEn;
        //      break;
        //     }
        //  this.serviceCategory=this.gpoCpoData.filter = this.filterValue.trim().toLowerCase();

        }
      },
      error: (err) => {
        console.log(err);
        // this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      },
    });
  }

  getPensionerDetailsGPO() {
    this.isCPO=false;
    this.name="GPO Amt. & Budget Head"
    this.numberField=""
    // const index = this.displayedColumns.indexOf('CPO Number');
    // if (index > -1) { // only splice array when item is found
    //   this.displayedColumns.splice(index, 1); // 2nd parameter means remove one item only
    // }
    this.displayedColumns=['check','Pensioner Details','PPO Number',"GPO Number",'Service Category','Treasury Name','CPO Amt. & Budget Head','Issuance Date','Date of Retirement','isDe','Total Deduction','Net Payable Amount','Action'];
    this.gpoCpoData='';
    let data = {
      isActive:"Y"
    };
   
    this.pensionService.getPensionerDetail(data, 'getGpoOfPensioners').subscribe({
      next: (res) => {
        if (res.status === 'SUCCESS') {
          if (res == '') {
            alert('Not Record Found');
          } else {
            this.gpoCpoData=res.data;
            let mymap = new Map();
            const unique = this.gpoCpoData.filter((el: { serviceCategoryNameEn: any; }) => {
              const val = mymap.get(el.serviceCategoryNameEn);
              if(val) {
                  if(el.serviceCategoryNameEn < val) {
                      mymap.delete(el.serviceCategoryNameEn);
                      mymap.set(el.serviceCategoryNameEn, el.serviceCategoryNameEn);
                      return true;
                  } else {
                      return false;
                  }
              }
              mymap.set(el.serviceCategoryNameEn, el.serviceCategoryNameEn);
              return true;
          });

            this.serviceCategory=unique;
            this.gpoCpoData.forEach(function(item: any){
              item['is_Disabled']=true
            });
            // let newList:any[]=[];
            // for(let i=0;i<this.gpoCpoData.length;i++)
            // {
            //   if(this.gpoCpoData[i].dmsDocId!=null)
            //   {
            //     newList.push(this.gpoCpoData[i])
            //   }
            // }
            this.dataSource = new MatTableDataSource(this.gpoCpoData);
            this.dataSource.paginator = this.paginator;
            this.netPayableAmount=res.data.netPayableAmount;
            this.BudgetHead=res.data.gpoBudgetHead;
          }
        }
      },
      error: (err) => {
        console.log(err);
        // this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      },
    });
  }

  onTabChanged($event:any) {
    if($event.index==1){
      this.getObjectedPensionersGPO();
    }
    if($event.index==2){

    }

  }
  unique:any;
 
  getObjectedPensionersCPO(){
    this.isCPO=true;
    this.name="CPO Amt. & Budget Head"
    this.numberField="CPO Number"
    const index = this.objectedPensionerColumns.indexOf('CPO Number');
    if (index > -1) { 
    }else{
      this.objectedPensionerColumns.splice(2, 0, "CPO Number")
    }
   
    this.ObjecteCpoData=[];
    let data = {
      isActive:"N"
    };
    this.pensionService.getPensionerDetail(data, 'getCpoOfPensioners').subscribe({
      next: (res) => {
        if (res.status === 'SUCCESS') {
          this.ObjecteCpoData=[]
         
            this.ObjecteCpoData=res.data;
           
            if(this.ObjecteCpoData.length>0)
            {
              let mymap = new Map();
              const unique = this.ObjecteCpoData.filter((el: { serviceCategoryNameEn: any; }) => {
                const val = mymap.get(el.serviceCategoryNameEn);
                if(val) {
                    if(el.serviceCategoryNameEn < val) {
                        mymap.delete(el.serviceCategoryNameEn);
                        mymap.set(el.serviceCategoryNameEn, el.serviceCategoryNameEn);
                        return true;
                    } else {
                        return false;
                    }
                }
                mymap.set(el.serviceCategoryNameEn, el.serviceCategoryNameEn);
                return true;
            });
  
              this.serviceCategory=unique;
  
  
              this.ObjecteCpoData.forEach(function(item: any){
                item['is_Disabled']=true
              });
              this.netPayableAmount=res.data.netPayableAmount;
              this.BudgetHead=res.data.cpoBudgetHead;
          console.log()
            }
            
            this.dataSourcePensioner = new MatTableDataSource(this.ObjecteCpoData);
            // this.dataSourcePensioner.paginator = this.paginator;
        }
      },
      error: (err) => {
        console.log(err);
        // this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      },
    });
  }
  getGpoPpoCpoPreview(pensionerId:any,i:any)
  { let data:any;
    if(i==1)
    {
      // ppo
      data={
        "reportPath":"/Pension/Pension_Kit/Report/PENSION_PPO.xdo",
        "name":"pensioner_id",
        "value":pensionerId,
        "redirectUrl":"pension/PaymentDisbursement/FirstPension"
      }
    }else if(i==2)
    {
      // GPO
      data={
        "reportPath":"/Pension/Pension_Kit/Report/PENSION_GPO.xdo",
        "name":"pensioner_id",
        "value":pensionerId,
        "redirectUrl":"pension/PaymentDisbursement/FirstPension"
      }
    }else if(i==3)
    {
      // CPO
      data={
        "reportPath":"/Pension/Pension_Kit/Report/PENSION_CPO.xdo",
        "name":"pensioner_id",
        "value":pensionerId,
        "redirectUrl":"pension/PaymentDisbursement/FirstPension"
      }
    }
   this.common.Preview(data);
  }
  getObjectedPensionersGPO() {
    this.isCPO=false;
    this.name="GPO Amt. & Budget Head"
    this.numberField=""
    const index = this.objectedPensionerColumns.indexOf('CPO Number');
    if (index > -1) { // only splice array when item is found
      this.objectedPensionerColumns.splice(index, 1); // 2nd parameter means remove one item only
    }
    this.ObjecteCpoData=[];

    let data = {
      isActive:"N"
    };
 
    // this.dataSourcePensioner = new MatTableDataSource(this.ObjecteCpoData);
    this.pensionService.getPensionerDetail(data, 'getGpoOfPensioners').subscribe({
      next: (res) => {
        if (res.status === 'SUCCESS') {
          if (res == '') {
            alert('Not Record Found');
          }

          else {

            this.ObjecteCpoData=res.data;
            let mymap = new Map();
            const unique = this.ObjecteCpoData.filter((el: { serviceCategoryNameEn: any; }) => {
              const val = mymap.get(el.serviceCategoryNameEn);
              if(val) {
                  if(el.serviceCategoryNameEn < val) {
                      mymap.delete(el.serviceCategoryNameEn);
                      mymap.set(el.serviceCategoryNameEn, el.serviceCategoryNameEn);
                      return true;
                  } else {
                      return false;
                  }
              }
              mymap.set(el.serviceCategoryNameEn, el.serviceCategoryNameEn);
              return true;
          });

            this.serviceCategory=unique;
            this.ObjecteCpoData.forEach(function(item: any){
              item['is_Disabled']=true
            });
            this.dataSourcePensioner = new MatTableDataSource(this.ObjecteCpoData);
            // this.dataSourcePensioner.paginator = this.paginator;
            this.netPayableAmount=res.data.netPayableAmount;
            this.BudgetHead=res.data.gpoBudgetHead;
          }

        }
      },
      error: (err) => {
        console.log(err);
        // this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      },
    });
  }




  filteredData2:any;
  filteredData:any;
  filterData(){
  this.filteredData=this.gpoCpoData;

    if(this.ppoNo!=''){
     this.filteredData=this.filteredData.filter((a: { ppoNumber: any; })=>a.ppoNumber==this.ppoNo)
     this.dataSource=this.filteredData;
    }

   if(this.empId!=''){
   this.filteredData=this.filteredData.filter((a: { employeeCode: any; })=>a.employeeCode.toLowerCase()==this.empId.toLowerCase())
   this.dataSource=this.filteredData;
   }

   if(this.Treasury!=''){
    this.filteredData=this.filteredData.filter((a: { treasuryCode: any; })=>a.treasuryCode==this.Treasury)
   this.dataSource=this.filteredData;
   }

   if(this.serviceCat!=''){
    this.filteredData=this.filteredData.filter((a: { serviceCategoryId: any; })=>a.serviceCategoryId==this.serviceCat)
   this.dataSource=this.filteredData;
   }
   if(this.ppoNo=='' && this.empId=='' && this.serviceCat=='' && this.Treasury==''){
    this.dataSource=this.filteredData;
    this.dataSource.paginator = this.paginator;
   }
 }
 filterData2(){
  this.filteredData=this.gpoCpoData;

    if(this.ppoNo!=''){
     this.filteredData=this.filteredData.filter((a: { ppoNumber: any; })=>a.ppoNumber==this.ppoNo)
     this.dataSourceMonthly=this.filteredData;
    }

   if(this.empId!=''){
   this.filteredData=this.filteredData.filter((a: { employeeCode: any; })=>a.employeeCode.toLowerCase()==this.empId.toLowerCase())
   this.dataSourceMonthly=this.filteredData;
   }

  

   if(this.serviceCat!=''){
    this.filteredData=this.filteredData.filter((a: { serviceCategoryId: any; })=>a.serviceCategoryId==this.serviceCat)
   this.dataSourceMonthly=this.filteredData;
   }
   if(this.ppoNo=='' && this.empId=='' && this.serviceCat=='' && this.Treasury==''){
    this.dataSource=this.filteredData;
    this.dataSourceMonthly.paginator = this.paginator;
   }
 }
 treasurylist:any;
  getTreasury() {

    let data ={
      "attrValue":2
    }

    this._Service.postloantype(data, "getpensiontreasury").subscribe({
      next: (res) => {
        if (res.status = 200) {
        
this.treasurylist=res.data
let t=this.treasurylist?.filter((x:any)=>x.treasCode==this.empInfo?.treasCode)
if(t.length==1)
{
this.selectedTreasury=this.empInfo.treasCode;
}
//console.log(this.treasurylist);
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
documentList: any;
getPdfPreview(emp:any,i:any) {
  let data:any
if(i=="1")
{
  
 data={
  "type": "pension",
  "sourceId": 2,
  "docs": [
    {
      "docId": emp.dmsDocId
    }
  ]
}
}else if(i=="2")
{
  
 data={
  "type": "pension",
  "sourceId": 2,
  "docs": [
    {
      "docId": emp.billInnerDocId
    }
  ]
}
}else if(i=="3")
{
 
 data={
  "type": "pension",
  "sourceId": 2,
  "docs": [
    {
      "docId": emp.billOuterdoCId
    }
  ]
}
}else if(i=="4")
{

 data={
  "type": "pension",
  "sourceId": 2,
  "docs": [
    {
      "docId": emp.billscheduledocId
    }
  ]
}
}

console.log("single report data",data)
this._Service.postOr("wcc/getfiles",data).subscribe((res:any)=>{
  console.log("res",res.data.document[0].content);
  if(res.data.document[0].content)
  
  {
    let data={
      "base64Pdf":res.data.document[0].content,
      "redirectUrl":"PaymentDisbursement/FirstPension"
      }
console.log("data",data);

     this.dialog.open(PdfPreviewComponent,{  width: '70%', data: {message: data },  disableClose: false});
 

  }
})
   

  
}
showbill:boolean=true;
billPreview(ref_no:any,issueDate:any,i:any)
{

  let date1=new Date(issueDate);
let billSubTypeId:any;
if(this.isCPO)
{
  billSubTypeId=4;
}else
{
  billSubTypeId=3;
}
  let data={
    "billNo": 87,
    "billTypeId": 23,
    "billSubTypeId": billSubTypeId,
    "billYear": date1.getFullYear(),
    "billMonth": date1.getMonth(),
    "sourceId": 1,
    "type": "C",
    "params": [
        {
            "name": "REF_NO",
            "value": ref_no
        }
    ]
}
console.log("data",data)

this._Service.postOr("report/billreport",data).subscribe((res:any)=>{
  console.log("res",res.data.report[1].content)
  let data:any;
  res.data.report.forEach((element:any) => {
  if((element.billRptId=='61' || element.billRptId=='64') && i==1)
  {
    data={
      "base64Pdf":element.content,
      "redirectUrl":"PaymentDisbursement/FirstPension"
      }
 
  }else if((element.billRptId=='62' || element.billRptId=='65') && i==2)
  {
    data={
      "base64Pdf":element.content,
      "redirectUrl":"PaymentDisbursement/FirstPension"
      }
      
  }
});
    // let data:any;
    // if(i==1)
    // {
    //    data={
    //     "base64Pdf":res.data.report[0].content,
    //     "redirectUrl":"PaymentDisbursement/FirstPension"
    //     }
    // }else if(i==2)
    // {
    //   data={
    //     "base64Pdf":res.data.report[1].content,
    //     "redirectUrl":"PaymentDisbursement/FirstPension"
    //     }
    // }
    
console.log("data",data);

     this.dialog.open(PdfPreviewComponent,{  width: '70%', data: {message: data },  disableClose: false});
 


  
})

}
stopReason(title: any,field:any) {
  this._dialog.open(FirstPensionDialogComponent, {
    autoFocus: false,
    panelClass:'dialog-w-50',
    // [config]="{backdrop:'static'}",
    width:auto,
    height: auto,
    data: {
      title: title,
      ppoNumber:field.ppoNumber,
      gpoNumber:field.gpoNumber,
      cpoNumber:field.cpoNumber,
      aid:this.empInfo.aid,
      userId:this.empInfo.userId
    },
  });
}

filteredData1:any;
filterData1(){

this.filteredData1=this.ObjecteCpoData;

  if(this.ppoNo1!=''){
   this.filteredData1=this.filteredData1.filter((a: { ppoNumber: any; })=>a.ppoNumber==this.ppoNo1)
   this.dataSourcePensioner=this.filteredData1;
  }

 if(this.empId1!=''){
 this.filteredData1=this.filteredData1.filter((a: { employeeCode: any; })=>a.employeeCode==this.empId1)
 this.dataSourcePensioner=this.filteredData1;
 }

 if(this.Treasury!='' ){
  this.filteredData1=this.filteredData1.filter((a: { treasuryCode: any; })=>a.treasuryCode==this.Treasury)
 this.dataSourcePensioner=this.filteredData1;
 }

 if(this.serviceCat!=''){
  this.filteredData1=this.filteredData1.filter((a: { serviceCategoryId: any; })=>a.serviceCategoryId==this.serviceCat)
 this.dataSourcePensioner=this.filteredData1;
 }
 if(this.ppoNo=='' && this.empId=='' && this.serviceCat=='' && this.Treasury==''){
  this.dataSourcePensioner=this.filteredData1;
  this.dataSourcePensioner.paginator = this.paginator;
 }
}

applyFilter1(filterValue: string) {
  // this.filteredData1=this.ObjecteCpoData;

  this.dataSourcePensioner.filter = filterValue.trim().toLowerCase();

  // this.filteredData1=this.filteredData1.filter((a: { ppoNumber: any; })=>a.ppoNumber==filterValue)
  // this.dataSourcePensioner=this.filteredData1;
}
MonthlyPensionTreasury(a:any)
{

}
totalLength:any=0;
monthlyPensionList:any[]=[];
getMonthlyPensionList(h:any)
{
  let data:any
 
 if(h==0)
 {
   data={
    "inType":h,
    "treasCode":this.selectedTreasury,
    "rowFrom":this.fromNo,
    "rowUpto":this.toNo
  }
 }else if(h==4)
 {
  data={
    "inType":h,
    "treasCode":this.selectedTreasury
  }
 }
  
  this.load.show()
  this._Service.postdetype(data,"getMonthlyPsnCalData").subscribe((res:any)=>{
    console.log("qqq",res.data)

      if(res.data)
      {
        this.monthlyPensionList=res.data;
        if(this.monthlyPensionList[0]?.msg=="No Data Available")
        {
          this.monthlyPensionList=[]
        }
        this.dataSourceMonthly = new MatTableDataSource(this.monthlyPensionList);
        // this.dataSourceMonthly.paginator = this.paginator;
        if(this.monthlyPensionList.length>0)
        {
          this.totalLength=this.monthlyPensionList[0]?.allCases;
       
          for(let i=0;i<this.monthlyPensionList.length;i++)
        {
         if(h==0)
         {
          // this.selectPensioner[i]=false;
          // this.otherDeduction[i]=0;
          // this.holdDocument[i]=0
          // this.holdReason[i]="";
         }
         if(i==this.monthlyPensionList.length-1)
          {
            this.load.hide()
          }
        }
        if(this.monthlyPensionList.length>10000)
        {
        
          this.selectDropList.push(this.monthlyPensionList.length);
        }
       
      }else
      {
        this.monthlyPensionList=[];
        this.dataSourceMonthly = new MatTableDataSource(this.monthlyPensionList);
        this.load.hide()
      }
    }else{
      this.load.hide();
    }

  },(error)=>{
    this.load.hide()
  })
}
selectMultipalPensioner(j:any)
{
  console.log(j.value)
  if(this.monthlyPensionList.length>=j.value)
  {
    for(let i=0;i<this.monthlyPensionList.length;i++)
    {
      this.selectPensioner[i]=true;
      if(this.selectedPensionerList.toString().includes(this.monthlyPensionList[i].pensionerId.toString()))
      {}else
      {
        this.selectedPensionerList.push(this.monthlyPensionList[i].pensionerId)
      }
    }
    
  }else
  {
    alert("Total Pensioner:"+this.monthlyPensionList.length)
  }
  console.log(this.selectedPensionerList)
}
unselectAll(){
  for(let i=0;i<this.monthlyPensionList.length;i++)
  {
    this.selectPensioner[i]=false;
  }
  this.selectedPensionerList=[];
}

onTabMainChanged(index:any)
{
  console.log("index",index.index)
  if(index.index==0)
  {
    this.getPensionerDetailsGPO();
  }else if(index.index==1)
  {
    this.monthlyPensionList=[];
    this.dataSourceMonthly = new MatTableDataSource(this.monthlyPensionList);
    this.getMonthlyPensionList(0);
    // this.getHoldReasons()
  }
}
onTabmonthlyChanged(index:any)
{
  if(index.index==0)
  {
    this.monthlyPensionList=[];
    this.dataSourceMonthly = new MatTableDataSource(this.monthlyPensionList);
    this.getMonthlyPensionList(0);
  }else if(index.index==1)
  {
    this.monthlyPensionList=[];
    this.dataSourceMonthly = new MatTableDataSource(this.monthlyPensionList);
    this.getMonthlyPensionList(4);
  }
}
selectPensionerpush(i:any)
{
  if(this.selectedPensionerList.toString().includes(this.monthlyPensionList[i].pensionerId.toString()))
  {}else
  {
    this.selectedPensionerList.push(this.monthlyPensionList[i].pensionerId)
  }
  console.log(this.selectedPensionerList)
}
// holdReasonsList:any[]=[];
// getHoldReasons()
// {
//   this._Service.postdetype({"inType":3},"getMonthlyPsnCalData").subscribe((res:any)=>{
//     console.log("qqq",res.data)

//       if(res.data)
//       {
//         this.holdReasonsList=res.data;
//         console.log("holdReasonsList",this.holdReasonsList)
//     }

//   },(error)=>{
    
//   })
// }
holdMonthlyPension(element:any,i:any)
{
  this.dialog.open(MonthlyPensionDialogComponent,{  width: '70%', data: {message: element ,id:2},  disableClose: true}).afterClosed()
  .subscribe((data:any) => {
   console.log(data)
   
  });
  // if(!this.holdReason[i])
  // {
  //   alert("Please select hold reason");
  //   return;
  // }
  // if(confirm("Are you sure to hold pension of "+element?.employeeName))
  // {
  //   let data={
  //     "inType":2,
  //     'ppoNumber':Number(element?.ppoNumber),
  //     'pensionerId':Number(element?.pensionerId),
  //     'frmDate':element?.psnMonthYear,
  //     'todate':"",
  //     'holdReasonId':Number(this.holdReason[i]),
  //     'withArrear':"",
  //     'psnReqid':Number(element?.psnReqid),
  //     'otherDocumentNo':this.holdDocument[i]
  //   }
  //   console.log("hold data",data)
  //   this._Service.postdetype(data,"getMonthlyPsnCalData").subscribe((res:any)=>{
  //     console.log(res)
  //     if(res.data[0].Message=="inserted successfully")
  //     {
  //       element.otherDeduction=this.otherDeduction[i];
  //       this.getMonthlyPensionList(0)
  //     }else
  //     {
  //       alert("Some error occur");
  //     }

  //   },(error)=>{
      
  //   })
  // }

}
saveDeduction(element:any,i:any)
{
  this.dialog.open(MonthlyPensionDialogComponent,{  width: '70%', data: {message: element ,id:1},  disableClose: true}).afterClosed()
  .subscribe((data:any) => {
   console.log(data)
   this.monthlyPensionList[i].otherDeduction=data?.data.otherDeduction;
   this.monthlyPensionList[i].netPayableAmount=this.monthlyPensionList[i].netPayableAmount-data?.data.otherDeduction;
   this.dataSourceMonthly = new MatTableDataSource(this.monthlyPensionList);
   this.dataSourceMonthly.paginator = this.paginator;
  });
  
 
  // if(confirm("Are you sure..after save, amount "+this.otherDeduction[i]+" ₹ will not be changable."))
  // {
  //   let data={
  //     "inType":5,
  //     "psnReqid":Number(element.psnReqid),
  //     "otherDeduction":this.otherDeduction[i]
  //   }
  //   console.log('data',data);
  //   this._Service.postdetype(data,"getMonthlyPsnCalData").subscribe((res:any)=>{
  //     console.log("qqq",res)
  //     if(res.data[0].Message=="Updated successfully")
  //     {
  //       element.otherDeduction=this.otherDeduction[i];
  //     }else
  //     {
  //       alert("Some error occur");
  //     }
      
  //   },(error)=>{
      
  //   })
  // }
  
}
otherDeductionchange(element:any,i:any)
{
  if(this.otherDeduction[i]>Number(element.netPayableAmount))
  {
    this.otherDeduction[i]=0;
    alert("Please insert deduction below Net payble amount")
  }
  
}
uploadDoc(event: any,i:any) {

  let time1 = new Date();
 
  let file = event.target.files[0];
  let ex2: any[] = file.name.split(".");
  console.log("size", file.size / 1024)
  if (ex2[1].includes('PDF') || ex2[1].includes('pdf')) {

  } else {
    alert("Only PDF file format allowed")
    return;
  }

  if ((file.size / 1024) > 2048) {
    alert("Max 2 MB file size allowed")
    return;
  }

  let fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + "." + ex2[1];
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("filename", fileName);

  const docTypeId = "20"

  this._Service.postOr("wcc/uploadfile", formData).subscribe((res: any) => {
    if (res.data.document[0].docId) {
      this.holdDocument[i]=res.data.document[0].docId;
      alert("Document upload successfully");
    }

  }, (error) => {
    
    alert("Some Error Occured")
  })



}
releasePension(element:any)
{
  this.dialog.open(MonthlyPensionDialogComponent,{  width: '70%', data: {message: element ,id:3,fromDate:this.getholdmonth(element.fromHoldDate)},  disableClose: true}).afterClosed()
  .subscribe((data:any) => {
   console.log(data)
   
  });
}
nextStepc() {
  this.fromNo=this.toNo+1;
  this.toNo=this.toNo+50;
  this.getMonthlyPensionList(0);
}
prevStepc() {
  if(this.fromNo>1)
  {
    this.fromNo=this.fromNo-50;
    this.toNo=this.toNo-50;
    this.getMonthlyPensionList(0);
  }
  
}
ppoNo2:any;
empId2:any;
serarchPensioner()
{
  let data={
    'inType':6,
    'employeeCode':this.empId2?this.empId2:"",
    "ppoNumber":this.ppoNo2?Number(this.ppoNo2):"",
    "treasCode":this.selectedTreasury
  }
  console.log("data",data);
  this.load.show();
  this._Service.postdetype(data,"getMonthlyPsnCalData").subscribe((res:any)=>{
    console.log("qqq",res.data)
    this.load.hide();
      if(res.data)
      {
        this.monthlyPensionList=res.data;
        if(this.monthlyPensionList[0]?.msg=="No Data Available")
        {
          this.monthlyPensionList=[]
        }
        this.dataSourceMonthly = new MatTableDataSource(this.monthlyPensionList);
        // this.dataSourceMonthly.paginator = this.paginator;
        if(this.monthlyPensionList.length>0)
        {
          this.totalLength=1;
      }else
      {
        this.monthlyPensionList=[];
        this.dataSourceMonthly = new MatTableDataSource(this.monthlyPensionList);
        this.load.hide()
      }
    }else{
     
    }

  },(error)=>{
    this.load.hide()
  })
}
RemovrDeduction(element:any,i:any)
{
  if(confirm("Are you sure to remove deduction "+element?.otherDeduction+" of "+element?.employeeName))
  {


  let data={
    'inType':7,
    "psnReqid":Number(element?.psnReqid),
  }
  console.log("data",data);
  this.load.show();
  this._Service.postdetype(data,"getMonthlyPsnCalData").subscribe((res:any)=>{
    console.log("qqq",res.data)
    this.load.hide()
    if(res.data[0].Message=="Remove successfully")
      {
        this.monthlyPensionList[i].netPayableAmount=Number(this.monthlyPensionList[i].netPayableAmount)+Number(this.monthlyPensionList[i].otherDeduction);
        this.monthlyPensionList[i].otherDeduction=0;
        this.dataSourceMonthly = new MatTableDataSource(this.monthlyPensionList);
        alert("Remove successfully")
      }else
      {
        alert("Some error occur");
      }

  },(error)=>{
    this.load.hide()
  })
}
}
getHoldReason(i:any)
{
  if(i)
  {
    if(this.holdReasonsList)
    {
      return this.holdReasonsList.filter((x:any)=>x.id==i)[0].holdReason
    }
  }
}
holdReasonsList:any[]=[];
getHoldReasons()
{
  this._Service.postdetype({"inType":3},"getMonthlyPsnCalData").subscribe((res:any)=>{
    console.log("qqq",res.data)

      if(res.data)
      {
        this.holdReasonsList=res.data;
        console.log("holdReasonsList",this.holdReasonsList)
    }

  },(error)=>{
    
  })
}
getholdmonth(i:any)
{
 
  let month;
  let year;
  if(i)
  {
  month=i.slice(-2);
  
  year=i.substring(0,4);
    // console.log(month+"  "+year+" "+j)
    
  }
  return month+"/"+year
}
}
