import { PensionServiceService } from 'src/app/services/pension-service.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
 import { AddUserRoleComponent } from '../add-user-role/add-user-role.component';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})

export class UserRoleComponent implements OnInit, AfterViewInit {

 
  UserDataList:any[]=[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  displayedColumns: string[] = [ 'empCode','officeName', 'ssoid','office', 'designation', 'showRole'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  empInfo:any;

  constructor(  public _Service :PensionServiceService,
   public dialog:MatDialog,private tokenInfo:TokenManagementService ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
config:AppConfig=new AppConfig();
userDetails:any;
  ngOnInit(): void {
    this.empInfo = this.tokenInfo.empinfoService;
this.userDetails=this.config.getUserDetails();
    console.log("this.userDetails",this.userDetails)
    this._Service.url="Inbox   >  Process-Role-Assign"
    // this.userDetails=this.config.getUserDetails();
    this.getuserassign();
  }

  searchBySSOId(ssoid: any){
    console.log(ssoid);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openRoleDialog(item:any){
    console.log(item);
    let data=
    {
      "assignmentId":this.empInfo.aid,
      "data":item
    }
    this.dialog.open(AddUserRoleComponent,
      {
        height: '60%',
        width: '60%',
        data: {message:data }
      },
      );
  }
  // getuserassign()
  // {
  //   var url="getuserassign";
  //  var data={
  //   "assignmentId":this.empInfo.aid
  //   };


  //   this._Service.post(url,data).subscribe((res: any) => {
  //         console.log("userAssignList",res);
  //     if(res.status=='SUCCESS')
  //     {
  //       let data:any= JSON.parse(res.data);

  //       data=data.UserDetail;
  //       console.log("user details",data);
  //       this.dataSource = new MatTableDataSource(data);
  //     }
  //   })
  // }
  getuserassign()
  {
  //   var url="getuserassign";
  //  var data={
  //   "officeId":this.empInfo.levelValueCode
  //   }
    var data={
      "officeId":this.userDetails.officeid
      };


  this._Service.postNewEmployee('getEmpOfficeDetail', data).subscribe({
    next: (res) => {
      console.log(res.data)
      let data:any[]=[];
      data=res.data;
      //console.log(data[74])
      //console.log(data[0])
      let sortarray:any[]=[];
      for(let i=data.length-1;i>=0;i--)
      {

        sortarray.push(data[i])
        //console.log(data[i])
      }
        console.log(sortarray)
    //   data=data.sort((a:any, b:any) => {
    //     if (a.basicPay < b.basicPay) {
    //         return -1;
    //     }
    //     if (a.basicPay > b.basicPay) {
    //         return 1;
    //     }
    //     return 0;
    // });
  //  data=data.reverse()

    
      this.dataSource=new MatTableDataSource(res.data);
      this.dataSource.paginator=this.paginator
    }
  })
  }
  addAssignmentId(item:any)
  {
    let data = { "ssoid":item.ssoId};
    console.log("sso",data);
    this._Service.postOr("sso/userdetails",data).subscribe((res:any)=>{
      console.log("sso details",res)
      if(res.data)
      {
        this.getAssignmentid(res.data,item)
      }
    
    })
  }
  getAssignmentid(sso:any,item:any)
  {
    console.log("item",item)
    sso['flag']='3';
    sso['assignmentTypeId']='1';
    sso['officeId']=item.officeId;
    
   this._Service.postifmshome("userrolerequest",sso).subscribe((res:any)=>
   {
    console.log("Assignmentid details",res.data)
    if(res.data)
    {
      let data=JSON.parse(res.data)
      if(data.status=='Success')
      {
        if(data.assignmentId!='0')
        {
          item.assignmentId=data.assignmentId;
          console.log("item",item)
          this.openRoleDialog(item);
        }
       
      }
    }

   })
  }

}


