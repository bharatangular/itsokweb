import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, of, startWith, switchMap } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-pension-initiate-office',
  templateUrl: './pension-initiate-office.component.html',
  styleUrls: ['./pension-initiate-office.component.scss']
})
export class PensionInitiateOfficeComponent implements OnInit {
  isOffice: boolean = false;
  pensionInitOffice:any
  office:any;
  officeData:any={
    "officeName":"",
    "officeHoName":""
  }
  oOfficeId:any;
  pofficeId:any
  pdeptId:any
  searchdepartment = new FormControl();
  serchOffice = new FormControl();
  userdetails:any;
  config:AppConfig=new AppConfig()
  constructor(public _Service:PensionServiceService,@Inject(MAT_DIALOG_DATA) public data: {message: any},private dialogRef: MatDialogRef<PensionInitiateOfficeComponent>) { }

  ngOnInit(): void {
    console.log("data",this.data)
    this.userdetails=this.config.getUserDetails();
   console.log("this.userdetails",this.userdetails);

    this.getDepartmentList();
    this.getPensionInitiateoffice()
  }
  departmentList:any
  getDepartmentList()
  {
    let data = {
      "inMstType":21,
      "inValue":0,
      "inValue2":0,
      "inValue3":""
      }
    this._Service.postho('allmstdata', data).subscribe({
      next: (res:any) => {
        
        if (res.status = 200) {
          this.departmentList = JSON.parse(res.data);
          console.log("this.officeList",this.departmentList)

          this.$searchdepartment = this.searchdepartment.valueChanges.pipe(
            startWith(null),
            debounceTime(200),
            switchMap((res: any) => {
              if (!res) return of(this.departmentList);
              let fff = res;
              //console.log("shyam",fff);
              return of(
                 this.departmentList.filter(
                    (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0
  
                 )
              );
            })
          );

        }
      },
  
    })
  }

  $searchdepartment = this.searchdepartment.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((res: any) => {
      if (!res) return of(this.departmentList);
      let fff = res;
      //console.log("shyam",fff);
      return of(
         this.departmentList.filter(
            (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0

         )
      );
    })
  );

  $serchOffice = this.serchOffice.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((res: any) => {
      if (!res) return of(this.officeList);
      let fff = res;
      //console.log("shyam",fff);
      return of(
         this.officeList.filter(
            (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0

         )
      );
    })
  );
  
  selectOption(event: any){
    console.log(this.office)
   // alert(this.isSaveEnable)
   // this.isSaveEnable=true;
    if(event.value == 1){
      this.isOffice = true;
      this.isList=false
      this.isKnow=false
     this.pensionInitOffice=this.office;
    }else{
      this.isOffice = false;
      this.isKnow=true
      this.isList=true
     
    }
  }
  isKnow:boolean=true
  isList:boolean=true
  selectOption2(event: any){
    if(event.value == 1){
     
      this.isList=true
    }else{
     
      this.isList=false
    }
  }
  getPensionInitiateoffice()
  {
    
    let data={
      "employeeId": this.data?.message?.employeeId,
      "inType": 14
    }
    console.log("data",data)
    this._Service.postUpcomingpension(data,"insertPsnEmpCommon").subscribe((res:any)=>
    {
      console.log("pOffice",res)
      if(res.data)
      {
     if(res?.data?.pensionIniOffice!="0")
     {
      this.pofficeId=res?.data?.pensionIniOffice;
      this.checkOfficeId(2)
     }
      }
    },(error)=>{
        alert("Error in revisionflag service");
    })
   
  }
  officeList:any
  getOfficeList()
  {
    let data = {
      "inMstType":22,
      "inValue":this.pdeptId,
      "inValue2":0,
      "inValue3":""
      }
    this._Service.postho('allmstdata', data).subscribe({
      next: (res:any) => {
        
        if (res.status = 200) {
          this.officeList = JSON.parse(res.data);
          console.log("this.officeList",this.officeList)
          this.$serchOffice = this.serchOffice.valueChanges.pipe(
            startWith(null),
            debounceTime(200),
            switchMap((res: any) => {
              if (!res) return of(this.officeList);
              let fff = res;
              //console.log("shyam",fff);
              return of(
                 this.officeList.filter(
                    (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0
  
                 )
              );
            })
          );
        }
      },
  
    })
  }
  checkOfficeId(i:any)
  {
    let data:any;
    if(i==1)
    {
      if(this.oOfficeId==null || this.oOfficeId=='')
      {
        alert("Insert office id")
        
      }
      data = {
        "inMstType":28,
        "inValue":this.oOfficeId,
        "inValue2":0,
        "inValue3":""
        }
       // this.payEntitlement.patchValue({newPensionInitOffice : this.oOfficeId});

    }else if(i==2)
      {
        data = {
          "inMstType":28,
          "inValue":this.pofficeId,
          "inValue2":0,
          "inValue3":""
          }
      }
   console.log("check office",data);
   this._Service.postho('allmstdata', data).subscribe({
    next: (res:any) => {
      
      if (res.status = 200) {
       let data1 = JSON.parse(res.data);
        console.log("check res",data1)
        if(data1!=null)
        {
          this.officeData.officeHoName=data1[0]?.officeHoName;
          this.pensionInitOffice=data1[0]?.officeId;
          this.officeData.officeName=data1[0]?.officeName;
         
        }else
        {
          alert("Please insert right office id and try again or you can used 'Do'nt Know' option.")
        }
      }
    },

  })
  }
  submit()
  {
    if(this.pensionInitOffice)
    {
      let data={
        'inType':13,
        'officeId':Number(this.pensionInitOffice),
        'employeeId':this.data.message.employeeId
      }

      this._Service.postUpcomingpension(data,"insertPsnEmpCommon").subscribe((res:any)=>{
        console.log("res",res)
        alert(res.data.message);
        this.dialogRef.close({data:"Y"});
     
      },(error)=>{
        alert("Some error in service.")
      })
    }else{
      alert("Please select pension initiate office.")
    }
   
  }
}
