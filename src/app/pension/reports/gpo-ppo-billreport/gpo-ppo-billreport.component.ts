import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-gpo-ppo-billreport',
  templateUrl: './gpo-ppo-billreport.component.html',
  styleUrls: ['./gpo-ppo-billreport.component.scss']
})
export class GpoPpoBillreportComponent implements OnInit {

  myGroup:FormGroup;
  selectedValue:string;
  dataSource!: MatTableDataSource<any>;
  dataSourceForRoleWiseReport!: MatTableDataSource<any>;
  displayedColumns: string[] =[ 
    "employeeCode",
    "pensionerId",
    "empName",
    "payManager",
    "billType",
    "grossAmt",
    "netAmt",
    
  ];

  fromDate:any;
  toDate1:any;
  constructor(private fb: FormBuilder, public apiService:PensionServiceService,private datePipe: DatePipe) { }
  
get getFromDate() {
  return this.myGroup.get('fromDate')
}

get getToDate() {
  return this.myGroup.get('toDate')
}

get getppoGpo() {
  return this.myGroup.get('ppoGpo')
}
  ngOnInit(): void {
    this.myGroup = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      ppoGpo: ['',Validators.required],
      
    });

  }

  onRadioChange(event:any){
   
    this.selectedValue=event.value;
    // this.getCPoInfo(this.selectedValue);
   
  }

    getDate(event:any,dateType:any){
    //alert(dateType)
    if(dateType=='FROM')
    {  
      const formattedDate = this.datePipe.transform(event, 'dd-MM-yyyy');
      this.fromDate=formattedDate;
      
    }
    else if(dateType=='TO'){
      const formattedDateTo= this.datePipe.transform(event, 'dd-MM-yyyy');
      this.toDate1=formattedDateTo
      //alert(this.toDate1)
    }
    else {
      this.fromDate='';
      this.toDate1=''

    }
  
  }
  onSearch(key:any){
   //alert(key)
   //this.getCPoInfo(key)
  // this.searchForm.valid
  if(this.myGroup.valid){
    //alert("Search Fun is calling")
    let payLoad= {
      
      "inBillSubType": this.selectedValue,
      "inFromDt": this.fromDate,
      "inToDate": this.toDate1

     }
      this.apiService.getPsnDetailsList('getpaymanagerdetailsservice',payLoad).subscribe((res:any)=> {
        console.log("Data Of this API CPO,GPO",res)
        debugger
        this.dataSource=res.data;
      
      })
  }
  else{
    alert("All Fields are Required.")
  }
  }

 

  // getCPoInfo(getValue:any){

  //  // alert(getValue)
  //   //console.log("from date",this.fromDate)
  //   //console.log("to date",this.toDate1)

  //   // if(this.fromDate=='' && this.toDate1=='' && getValue=='')
  //   // {
  //   //   alert("From Date & To Date and CPO-GPO Can't Null, Please select these")

  //   // }
  //   //else {
  //   let payLoad= {
      
  //     "inBillSubType": JSON.stringify(getValue.value),
  //     "inFromDt": this.fromDate,
  //     "inToDate": this.toDate1

  //    }
  //     this.apiService.getPsnDetailsList('getpaymanagerdetailsservice',payLoad).subscribe((res:any)=> {
  //       alert(res.data.msg)
  //       if(res.data.msg=='no data available'){
  //         alert("Data is not Available!!")
  //       }
  //       else {
  //         console.log("Data Of this API CPO,GPO",res)
  //         this.dataSource=res.data;
  //       }      
  //     })
  //   //}

  // }

  

}
