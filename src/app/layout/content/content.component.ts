import { Component, HostListener, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { PensionServiceService } from 'src/app/services/pension-service.service';

import { ViewChild } from '@angular/core';
import { MatDrawer,} from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { ItsokService } from 'src/app/services/itsok.service';
// import menu1 from '../../shared/menu.json';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  @ViewChild('drawer') public drawer!: MatDrawer;
  public getScreenWidth: any;
  panelOpenState :boolean=false;
  panelOpenState2 :boolean=false;
  panelOpenState1 :boolean=true;
  
  showFiller = false;
  Window = window;
  event: any;
  empinfo:any;
  currentRoute:any;
  rotater: any = document.getElementsByClassName('toggler-button');
  sidebarElement:any=document.getElementsByClassName('sidebar');
  getSmSidebar: any;
  myElement:any;


// accordian start
url:any
userDetails:any={"role":"",
  "roleid" :"",
 "assignmentid":""};
 config:AppConfig=new AppConfig();
 report:boolean=false;
 mainUrl:any;
 isDev:boolean=false;
 RevisedCommutationCount:any;
 officerType:any;
 isMaster:boolean=false
  constructor(public api:ItsokService, public service:PensionServiceService,private tokenInfo:TokenManagementService,public router:Router) { }

  ngOnInit(): void {

    // console.log(this.Window.location.origin)

    this.empinfo=this.tokenInfo.empinfoService;
    this.mainUrl=window.location.origin;
  //  console.log("aaa",this.empinfo.roleId)
    
    if(this.mainUrl.includes('ifmsdev') || this.mainUrl.includes('localhost'))
    {
      this.isDev=true;
    }
 
    this.api.configMenu.subscribe((item: any) => {
      
        this.url = item.url;
        this.report=item.report;
        console.log( this.url)
    })
    this.userDetails = this.config.getUserDetails();
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",this.empinfo)
    console.log(this.userDetails);
    this.url=this.service.url;
console.log("this.url",this.url)
    this.getScreenWidth = window.innerWidth;
    this.router.events.subscribe((evt=>{
      if (evt instanceof NavigationEnd) {
        this.currentRoute = evt.url;
      }
  
    }));
    if(this.userDetails.roleid=='3')
    {
      this.getRevisedCommutationCount();
    }
    // this.getGazetted()
    // this.selectMenu();
// alert(this.service.mainurl)
  }
  getGazetted()
  {
    let data={
      "userAssignmentDtlsId":this.userDetails.assignmentid
    }
    this.service.postCumm("approverForLifeCertificate",data).subscribe((res:any)=>{
      console.log("res",res);
      
      if(res.data)
      {
        this.officerType=res.data[0].officerType;
      }
    })
  }
  getRevisedCommutationCount()
  {
    let data={
      "assignmentId":this.userDetails.assignmentid
    }
    this.service.getPensionerDetail(data,"getRevisedPendencyCount").subscribe((res:any)=>{
      console.log("res",res);
      if(res.data)
      {
        this.RevisedCommutationCount=res.data[0].totalPendency;
      }
    })
  }
  gotoDashboard()
  {
    
    if(this.userDetails.roleid=='99')
    {
      this.router.navigate(['pension/dashboard'])
    }else
    {
      this.router.navigate(['pension/Inbox'])
    }
  }
  nevigateToHomePension()
  {
   
    this.router.navigate(['/']);
  }
  redirectedLifeCertificate()
  {
    this.router.navigate(['pension/pss/LifeOtherCertificate']);
  }
  redirectedtoautoApproved()
  {
    this.router.navigate(['pension/autoApprovePensioner']);
  }
  redirectedtoUpcomingPen()
  {
    this.router.navigate(['pension/e-Pension/PensionerList']);
  }
  redirectedtorevisedAutoApproved()
  {
    this.router.navigate(['pension/revisedAutoApprove'])
  }
  
  redirectedtoUserRole()
  {
    this.router.navigate(['pension/e-Pension/processrole']);
  }
  redirectedtohoApproved()
  {
    this.router.navigate(['pension/e-Pension/hoApproveList']);
  }
  redirectedtoEsign()
  {
    this.router.navigate(['pension/e-Pension/pendingEsign']);
  }
  redirectedtoAllApproved()
  {
    this.router.navigate(['e-Pension/kitdownload']);
  }
  redirecttoInfo()
  {
    let purl: string = this.router['location']._platformLocation.location.origin;
    window.location.replace(purl+"/ifmssso/#/moduleinfo");
    window.location.reload();
  }
  redirectedtoPensioners()
  {
    this.router.navigate(['e-Pension/adPensionerList']);
  }
  redirecttosenddata()
  {
    this.router.navigate(['pension/sendData']);
  }
  toggle_sm(e: any) {
    this.sidebarElement[0].classList.toggle("sm-sidebar");
    this.showFiller = !this.showFiller
    this.panelOpenState = false;
   }
  
   rotate() {
    this.rotater[0].classList.toggle("active")
  }


   toggle_menu(e: any) {
  
    if(Object.values(this.myElement.classList).includes('sm-sidebar')){
        this.rotate();
      }
    this.panelOpenState = true
     this.sidebarElement[0].classList.remove('sm-sidebar');
     this.showFiller = true;
   }


   @HostListener('window:resize', ['$event'])
   isLargeScreen() {
     this.myElement = document.getElementById('side-bar');
     this.getScreenWidth = window.innerWidth;
 
     if (this.getScreenWidth > 991) {
       this.showFiller = false;
       this.getSmSidebar == document.getElementsByClassName('sm-sidebar')
       // this.panelOpenState = true;
       return true;
     }
     else if (this.getScreenWidth < 992 && this.getScreenWidth > 768) {
       if (this.showFiller == true) {
         this.sidebarElement[0].classList.remove('sm-sidebar');
       }
       else {
         if (this.panelOpenState == false || this.showFiller == false) {
           this.sidebarElement[0].classList.add('sm-sidebar');
         }
       }
       return true;
     }
     else {
       this.sidebarElement[0].classList.remove('sm-sidebar');
       return false;
     }
   }

  // toggler icon rotate function
 
 
  hideSidenavAfterClick() {
   if (window.innerWidth < 768) {
     this.drawer.close();
   }
 }
 menuList:any;
  // selectMenu()
  // {
  //   if (this.userDetails.roleid=='1') {

  //     this.menuList = menu1;
  //     this.menuList = this.menuList.maker;

  //   } else if (this.userDetails.roleid=='2') {

  //     this.menuList = menu1;
  //     this.menuList = this.menuList.chekar;
      

  //   } else if (this.userDetails.roleid=='3') {

  //     this.menuList = menu1;
  //     this.menuList = this.menuList.approver;

  //   } else if (this.userDetails.roleid=='4') {

  //     this.menuList = menu1;
  //     this.menuList = this.menuList.auditor;

  //   } else if (this.userDetails.roleid=='5') {

  //     this.menuList = menu1;
  //     this.menuList = this.menuList.aao;

  //   } else if (this.userDetails.roleid=='6') {

  //     this.menuList = menu1;
  //     this.menuList = this.menuList.zonalApprover;

  //   } else if (this.userDetails.roleid=='99') {

  //     this.menuList = menu1;
  //     this.menuList = this.menuList.psnAdmin;

  //   }
  // }
 }
 
  
  



















 
 