import { Component, OnInit, ViewChild, OnChanges, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonDialogComponent } from '../../common-dialog/common-dialog.component';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FirstPensionDialogComponent } from '../first-pension-dialog/first-pension-dialog.component';
import { auto } from '@popperjs/core';
import { config } from 'process';
import { PdfPreviewComponent } from '../pdf-preview/pdf-preview.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { log } from 'console';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { CommonService } from 'src/app/services/common.service';
import { PaymanagerBillDialogComponent } from '../paymanager-bill-dialog/paymanager-bill-dialog.component';


interface serviceCatList{
  serviceCategoryId:number
  serviceCategoryNameEn:string;
}

@Component({
  selector: 'app-paymanager-bill',
  templateUrl: './paymanager-bill.component.html',
  styleUrls: ['./paymanager-bill.component.scss']
})
export class PaymanagerBillComponent implements OnInit {

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator)
// paginator!;
// @ViewChild('paginatorElement', {read: ElementRef})
paginatorHtmlElement!: ElementRef;


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
  displayedColumns: string[] = ['Pensioner Details','PPO Number',"GPO Number",'Service Category','Treasury Name','CPO Amt. & Budget Head','Issuance Date','Date of Retirement','isDe','Total Deduction','Net Payable Amount','Action'];
  dataSource = new MatTableDataSource();
  dataSourcePensioner = new MatTableDataSource();
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
    ,private formBuilder:FormBuilder,public dialog: MatDialog,private tokenInfo:TokenManagementService,public common:CommonService) {
    // this.selection.changed.subscribe(item=>{
    //   this.isButtonEnable = this.selection.selected.length == 0;
    // })
   }

  ngOnInit(): void {

    this.empInfo = this.tokenInfo.empinfoService;
    this.myForm = this.fb.group({
      checkboxValue: ['']
    });
    // this. getPensionerDetailsCPO();
    this.getPensionerDetailsGPO()
this.getTreasury();
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
    
   this.displayedColumns=['Pensioner Details','PPO Number',"CPO Number",'Service Category','Treasury Name','CPO Amt. & Budget Head','Issuance Date','Date of Retirement','isDe','Total Deduction','Net Payable Amount','Action'];
    
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
    this.displayedColumns=['Pensioner Details','PPO Number',"GPO Number",'Service Category','Treasury Name','CPO Amt. & Budget Head','Issuance Date','Date of Retirement','isDe','Total Deduction','Net Payable Amount','Action'];
    this.gpoCpoData='';
    let data = {
      flag:"1"
    };
   
    this.pensionService.getPensionerDetail(data, 'getCpoGpoForPayee').subscribe({
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
      flag:"2"
    };
   
    this.pensionService.getPensionerDetail(data, 'getCpoGpoForPayee').subscribe({
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
 treasurylist:any;
  getTreasury() {

    let data ={
      "attrValue":2
    }

    this._Service.postloantype(data, "getpensiontreasury").subscribe({
      next: (res) => {
        if (res.status = 200) {
        
this.treasurylist=res.data
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
generateBill(title: any,field:any) {
  this._dialog.open(PaymanagerBillDialogComponent, {
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
}

