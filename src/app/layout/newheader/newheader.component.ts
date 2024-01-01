import { Component, OnInit } from '@angular/core';
import { userInfo } from 'os';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import jwt_decode from 'jwt-decode';
import { AppConfig } from 'src/app/app.config';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { log } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { RoleDialogComponent } from 'src/app/pension/role-dialog/role-dialog.component';
import { TokenManagementService } from 'src/app/services/token-management.service';


@Component({
  selector: 'app-newheader',
  templateUrl: './newheader.component.html',
  styleUrls: ['./newheader.component.scss']
})
export class NewheaderComponent implements OnInit {
  userEmp_Details: any
  empinfo: any;
  makerToken: any;
  userDetails: any = {};
  empShowDetails: any = {
    'DDO_Code': "",
    "Office_ID": "",
    "offcice_details": "",
    "roleName": ""
  }
  config: AppConfig = new AppConfig();
  roleList: any[] = [
  ];
  userName: any;
  selectedrole: any;
  ssoimg: any;
  decLevelData: any;
  constructor(private _Service: PensionServiceService,
    public router: Router,
    public dialog: MatDialog,
    private tokenInfo: TokenManagementService, private activateRoute: ActivatedRoute,) {

    let purl: string = this.router['location']._platformLocation.location.origin;
    let url2: string = this.router.url;
    let mainUrl = purl + "/#" + url2;
    //alert(url2)
    //a
    // if(url2=="/")
    // {     
    //   this.getRoleNew("57698");
    // }else
    // {
    // this.getRoleNew(this.userDetails.assignmentid);
    // }

    //  a
  }

  ngOnInit(): void {


  }
  backToSpace() {
    const ifmsssourl = `${window.location.origin}/ifmssso/#/ssoroleselection`;
    window.location.href = ifmsssourl;
  }

  changeDeskAndRole() {
    const ifmsssourl = `${window.location.origin}/ifmssso/#/userhome`;
    window.location.href = ifmsssourl;
  }

  logout1() {
    if (confirm("Are you sure you want to log out?")) {
      sessionStorage.clear();
      localStorage.clear();
      let purl: string = this.router['location']._platformLocation.location.origin;

      window.location.href = purl + "/ifmssso/"
    }

  }
  getRoleNew() {

    var url = "getuserpayeerolebyassignmentid";
    var data = {
      "assignmentId": this.empinfo?.aid
    };

    //     this._Service.postho(url,data).subscribe((res: any) => {

    //       console.log("rolelist11",res);
    //       if(res.status=='SUCCESS')
    //       {
    //         let data:any[]=res.data;
    //         if(data){
    //         for(let i=0;i<data.length;i++)
    //         {
    //            if(i==0)
    //            {
    //              this.roleList.push(data[i]);             
    //            }else
    //            {
    //             // console.log("zzzzzzzzzzzzz",this.roleList.length);
    //             let count=0;
    //              for(let j=0;j<this.roleList.length;j++)
    //              {
    //               // console.log("this.roleList[j].payeeRoleName",this.roleList[j].payeeRoleName+data[i].payeeRoleName);

    //              if(this.roleList[j].payeeRoleName==data[i].payeeRoleName)
    //              {
    //               count++;
    //              }
    //            }
    //            if(count==0)
    //            {
    //             this.roleList.push(data[i]);
    //            }
    //            }
    //           //  console.log("token Info",this.empinfo)
    //         }


    //          if(this.empinfo.roleId=="29")
    //           {
    //             this.router.navigate(['PaymentDisbursement/FirstPension'])
    //           } else if(this.roleList[0]?.payeeRoleId=="99")
    //           {
    //             this.router.navigate(['pension/dashboard'])
    //           }
    //           else
    //           {

    //           }
    //         }

    //       }

    //     // this.userDetails=this.config.getUserDetails();
    //     // if(this.empinfo.roleId=="47" || this.empinfo.roleId=="48" ||this.empinfo.roleId=="49")
    //     // {
    //     //   this.router.navigate(['pension/e-Pension/processrole'])
    //     // }else

    //     // this.roleList=res.data;

    // console.log("this.roleList",this.roleList);


    //     this.config.storeUserDetails(this.userDetails)
    //   if(this.roleList.length==1)
    //   {
    //     this.userDetails['role']=this.roleList[0].payeeRoleName;
    //     this.userDetails['roleid']=this.roleList[0].payeeRoleId;   
    //     this.userDetails['officeid']=this.roleList[0].levelValueId;
    //     this.userDetails['treasCode']=this.roleList[0].treasCode;
    //     this.userDetails['treasName']=this.roleList[0].treasName;
    //     this.userDetails['deptId']=this.roleList[0].deptId;
    //     this.userDetails['assignmentid']=this.empinfo.aid;
    //     this.userDetails['treasCode']=this.decLevelData?.treasCode;
    //     this.selectedrole = this.roleList[0].payeeRoleName;

    //     this.config.storeUserDetails(this.userDetails)

    //   }else if(this.roleList.length<1){


    //    console.log("aaa12",this.decLevelData)
    //      let data={
    //             "levelValueCode":this.empinfo?.levelValueCode?this.empinfo?.levelValueCode:"",
    //             "levelValueId":this.empinfo?.levelValueId?this.empinfo?.levelValueId:"",
    //             "levelValueDesc":this.decLevelData?.levelValueDesc
    //           }
    //           this.selectedrole=this.empinfo.roleName;         
    //           this.roleList.push(data);
    //           console.log("this.roleList1",this.roleList);
    //           this.userDetails=this.decLevelData;
    //           // this.config.storeUserDetails(this.userDetails)
    //   }  
    //       }
    //     )
  }
  redirectToDashboard() {

    this.router.navigate(['itsok/dashboard']);
  }
  redirectToAdminLogin() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
  getDecodedAccessToken(makerToken: string): any {

    try {
      let mytoken = jwt_decode(makerToken);

      this.config.storeDetails('userInfo', JSON.stringify(mytoken))
      this.empinfo = this.tokenInfo.empinfoService;

    }
    catch (Error) {
      return null;
    }
  }

  fetchServicesdetail() {
    let data = {
      "userAssignmentDtlsId": +this.empinfo.aid
    }
    this._Service.postRequestpension(data, 'getAdditionalEmployeeDetails').subscribe({
      next: (res) => {
        if ((res.status = 200)) {
          this.userEmp_Details = res.data;
          // localStorage.setItem('treasury_name',res.data.TREAS_NAME_EN?res.data.TREAS_NAME_EN:"");
          this.config.storeDetails('treasury_name', res.data.TREAS_NAME_EN ? res.data.TREAS_NAME_EN : "");
        }
      },
      error: (err) => {

      }
    });
  }


  redirecttodashoboard() {
    let login = this.config.getDetails("login");
    if (login == "1")
      this.router.navigate(['itsok/dashboard'])
    else
      alert("First login.");

  }
}
