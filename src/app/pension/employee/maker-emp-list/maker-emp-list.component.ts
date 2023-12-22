import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { ApiEssService } from 'src/app/services/api-ess.service';

@Component({
  selector: 'app-maker-emp-list',
  templateUrl: './maker-emp-list.component.html',
  styleUrls: ['./maker-emp-list.component.scss']
})
export class MakerEmpListComponent implements OnInit {
  displayedColumns: string[] = ['employeeCode','name','designationName','deptName','Action'];
  dataSource!: MatTableDataSource<any>;
  constructor(private router:Router,private apiService:ApiEssService) { }
newConfig:AppConfig=new AppConfig();
userDetails:any;
empinfo:any;
upcomingPensioner:any;

allempdata:any
  ngOnInit(): void {
    this.empinfo = this.apiService.userInfo();
    console.log(this.empinfo);
    
    this.userDetails=this.newConfig.getDetails("userDetails");
    if(this.userDetails)
    {
      this.userDetails=JSON.parse(this.userDetails);
      console.log(this.userDetails);
    }
    this.employeeList();
    // this.getUpcomingPensioner();
   
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  finalList:any[]=[];
//   getUpcomingPensioner(){

//     let data = {
//   "ddoId":null,
// //  "officeId":null,
//   "officeId": this.empinfo.levelValueCode,
//   "serviceCategoryId":null,
//   "departmentId":null
//   }
 
//   this.apiService.getEmployeeDetails( "getUpcomingPensionersList",data).subscribe({
//     //this._Service.postRequestpension(data, "getToBeRetiringEmployeeListByDeptId").subscribe({
//       next: (res:any) => {
       
//         if (res.status === "SUCCESS") {
//           this.upcomingPensioner=res.data;
//           this.upcomingPensioner.forEach((element:any) => {
//            this.allempdata.forEach((element2:any,i:any)=>{
//             if(element.employeeCode==element2.employeeCode)
//             {
//               this.finalList.push(element2)
//               console.log(element2)
//             }
//            })
//           });
//           console.log(this.finalList)
//           this.dataSource=new MatTableDataSource(this.finalList);
//         }
//       },
//       error: (err:any) => {
       
      
//       }
//     })
//   }
  View_Profile(employeeCode:any){
    let data={
      "employeeCode":employeeCode
    }
    this.newConfig.storeDetails("makerRequest",JSON.stringify(data))
     this.router.navigate(['/ess/profileUpdate']); 
  }
  employeeList()
  {

    this.apiService.postmst('getEmpOfficeDetail', { officeId: this.userDetails.officeid }).subscribe({
      next: (res) => {
        console.log(res.data)
        this.allempdata=res.data
        this.dataSource=new MatTableDataSource(this.allempdata);
      }
    })


    // let Data=[{
    //   employeeCode:"RJJP198417017033",
    //   employeeName:"RAFIQ KHAN",
    //   employeeId:"",
    // }]

  }
  inProcess(empid:any)
{
  this.apiService.post('getEmpRequestCount', {processId:18, employeeCode: empid }).subscribe({
    next: (res) => {
 
      console.log(res.data)
     
      if(res.data.count==0)
      {
        this.View_Profile(empid)
      }else
      {
        alert("User is already in process");
      }
     
    }
  })
}
  
}

