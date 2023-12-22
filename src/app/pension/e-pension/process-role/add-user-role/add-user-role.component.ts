import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';


import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PensionServiceService } from 'src/app/services/pension-service.service';



@Component({
  selector: 'app-add-user-role',
  templateUrl: './add-user-role.component.html',
  styleUrls: ['./add-user-role.component.scss']
})

export class AddUserRoleComponent implements OnInit, AfterViewInit {
  UserDataList: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  displayedColumns: string[] = ['SR.NO.',"processName", 'Role', 'Remove'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  RolesList: any = [];
  processList: any;
  modulelist:any[]=[];
  levelList: any;
  roleList: any;
  processId: any;
  roleId: any;
  assignroleList: any
  moduleId:any
  private paginator1!: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator1 = mp;
    this.dataSource.paginator = this.paginator1;
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: any },
   public _service:PensionServiceService) {
    console.log("data", this.data.message);

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getProcessName(item:any)
  {
    // if(this.moduleId==2)
    if (item.processId !== undefined)
      return this.processList.filter((x: any) => x.processId == item.processId)[0].processName;
    // return "V";
  }
  
  getLevelName(item:any)
  {
    if (item.processId !== undefined)
    this.getwflevel(item.processId)
    return this.processList.filter((x: any) => x.processId == item.processId)[0].processName;
  }
  ngOnInit(): void {
    // this.getUserDetails();
    this.getwfmodule();
    //this.getwfprocess();
    
  }


  submitAddRole(role: any) {
    if (role) {
      alert("submit!!");
    } else {
      alert("Please add Role!!");
    }
  }

  applyFilter(event: any) {
    // const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = event.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getUserDetails() {
    var url = "this.apiurl.url.getstate";
    var data = {};
    console.log(url);

    this._service.post(url,data).subscribe((res: any) => {

      console.log("result", res);
      if (res.status == 'SUCCESS') {
        this.UserDataList = res.data;
        // this.dataSource = new MatTableDataSource(res.data)
      }
    })

    this.UserDataList = [{
      sr_No: '1',
      officer_name: 'Suresh Kumar',
      mobile_no: '95665665656',
      level: 'District',
      work_space: 'jaipur',
      office: 'Deputy Director Horticulture Jaipur',
      designation: 'Agriculture officer horticulture - 1',
      role: 'Agriculture Officer Dist',
      post: 'Agriculture Officer Dist Horticulture - 1'
    }]

    this.dataSource = new MatTableDataSource(this.UserDataList);
  }

  getwfmodule() {
    //var url = "getwfprocess";
    var data =[{
      "name": "Employee",
      "id": "2"
    },
    {
      "name": "Pension",
      "id": "1"
    }
  ]

    // this.load.show();
    //this._service.post(url, data).subscribe((res: any) => {

      console.log("data module", data);
      //if (res.status == 'SUCCESS') {
        this.modulelist = data;
        console.log(this.modulelist)
      //}
    //})
  }


  getwfprocess(id:any) {
    this.moduleId=id
   
    if(id==1)
    {
      var url = "getwfprocess";
      var data = { };
     
      // this.load.show();
      this._service.post(url, data).subscribe((res: any) => {

        console.log("process", res);
        if (res.status == 'SUCCESS') {
          this.processList = res.data;
        }
        this.getAssignrolelist();
      })
     
    }
    else
    {
      var url = "getwfprocess";
      var data = { };
      
      // this.load.show();
      this._service.postEmployee(url, data).subscribe((res: any) => {

        console.log("process", res);
        if (res.status == 'SUCCESS') {
          this.processList = res.data;
        }
        this.getAssignrolelist();
      })
      
    }
  }

  getwflevel(i: any) {
    this.processId = i;
    console.log(i);
    var url:any
    if(this.moduleId==2)
    {
      url = "getemployeewflevel";
      var data = {
        "processId": this.processId,
        "userAssignmentDtlsId":this.data.message.assignmentId
      }
      // this.load.show();
      this._service.postEmployee(url, data).subscribe((res: any) => {
        console.log("levelList", res);
        if (res.status == 'SUCCESS') {
          this.levelList = res.data;
        }
      })
    }else if(this.moduleId==1)
    {
      url = "getpensionwflevel";
      var data = {
        "processId": this.processId,
        "userAssignmentDtlsId":this.data.message.assignmentId
      }
      // this.load.show();
      this._service.post(url, data).subscribe((res: any) => {
        console.log("levelList", res);
        if (res.status == 'SUCCESS') {
          this.levelList = res.data;
        }
      })
    }
   
   
  }
  getmstworktask(i: any) {
    console.log("process id", i);
    var url = "getmstworktask";
    var data = {
      "processLevelId": i
    }
    if(this.moduleId==2)
    {
    // this.load.show();
    this._service.postEmployee(url, data).subscribe((res: any) => {

      console.log("roleList", res);
      if (res.status == 'SUCCESS') {
        this.roleList = res.data;
      }
    })
  }else if(this.moduleId==1)
  {
    this._service.post(url, data).subscribe((res: any) => {

      console.log("roleList", res);
      if (res.status == 'SUCCESS') {
        this.roleList = res.data;
      }
    })
  }
  }
  getRoletask(i: any) {
    this.roleId = i;
  }
  assignRole() {
    var data:any;
if(this.data.message.data.assignmentId)
{  
  data = {
    "assignData": {
      "processId": this.processId,
      "processTaskId": this.roleId,
      "assignmentId": this.data.message.data.assignmentId,
      "assignmentBy": this.data.message.data.assignmentId,
      "userNo": this.data.message.assignmentId
    }
  }

}
else{

  //this.data.message.data.ssoId


  data = {
    "assignData": {
      "processId": this.processId,
      "processTaskId": this.roleId,
      "assignmentId": this.data.message.data.assignmentId,
      "assignmentBy": this.data.message.data.assignmentId,
      "userNo": this.data.message.assignmentId
    }
  }
}



    // var data1 ={"assignData":{"processId":"10","processTaskId":3,"assignmentId":"58175","assignmentBy":"58175","userNo":"58175"}}
    console.log("add role data", data);
    if(this.moduleId==2)
    {
      
      let url = "saveassign";
    this._service.postEmployee(url, data).subscribe((res: any) => {

      console.log("role data", res);
      // this.processId="";
      // this.roleId=""
      this.getAssignrolelist();
    })
    }else if(this.moduleId==1)
    {
      let url = "saveassign";
      this._service.post(url, data).subscribe((res: any) => {
  
        console.log("role data", res);
        this.getAssignrolelist();
      })
    }
   
      
    
  }
  getAssignrolelist() {

    var data = {
      "assignmentId": this.data.message.data.assignmentId
    }
if(
  this.moduleId=="2"
)
{
  console.log("role data", data);
    let url = "gettaskrolename";
    this._service.postEmployee(url, data).subscribe((res: any) => {
      this.assignroleList = res.data;
      console.log("Assign role data", this.assignroleList);
      this.dataSource = new MatTableDataSource(this.assignroleList)
      

    })
}
else if(this.moduleId=="1")
{
  console.log("role data", data);
  let url = "gettaskrolename";
  this._service.post(url, data).subscribe((res: any) => {
    this.assignroleList = res.data;
    console.log("Assign role data", this.assignroleList);
    this.dataSource = new MatTableDataSource(this.assignroleList)
  })
}

  }




  removeRole(item: any) {

    var data = {
      "processId": item.processId,
      "processTaskId": item.processTaskId,
      "assignmentId": item.assignmentId
    }
if(
  this.moduleId==2
)
{
  if(item.pendingRqust==0)
  {
    if (confirm("Are you sure you want to remove?")) {
      console.log("remove role data", data);
      let url = "removeassignrole";
      this._service.postEmployee(url, data).subscribe((res: any) => {
  
        console.log("remove", res);
        this.getAssignrolelist();
      })
    }
  }else{
    alert("It have pending requests.");
    return
  }
  
}else if(this.moduleId==1)
{
  if(item.pendingRqust==0)
  {
  if (confirm("Are you sure you want to remove?")) {
    console.log("remove role data", data);
    let url = "removeassignrole";
    this._service.post(url, data).subscribe((res: any) => {

      console.log("remove", res);
      this.getAssignrolelist();
    })
}
  }else{
    alert("It have pending requests.");
    return
  }
    
    
}}
}

