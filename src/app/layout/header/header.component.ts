import { Component, HostListener, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showMenu:boolean=false;
  innerWidth: string | undefined;
  userDetails:any={};
  config:AppConfig=new AppConfig();
  Rolename:any;
  roleList:any;
  userName:any;
  constructor(_Service:PensionServiceService) { }

  ngOnInit(): void {
    document.getElementById("mySidenav1")!.style.display = "none";
    this.userDetails = this.config.getUserDetails();
    this.Rolename = this.userDetails.role;
    console.log("this.Rolename", this.Rolename);
  }
  getRoleNew() {
    var url = "getuserpayeerolebyassignmentid";
    var data = {
      "assignmentId": this.userDetails.assignmentid
    };
    // this.load.show();
    // this._Service.postho(url, data).subscribe((res: any) => {
    //   console.log("result", res);
    //   if (res.status == 'SUCCESS') {
    //     let data: any[] = res.data;
    //     if (data) {
    //       for (let i = 0; i < data.length; i++) {
    //         if (i == 0) {
    //           this.roleList.push(data[i]);
    //         } else {
    //           console.log("zzzzzzzzzzzzz", this.roleList.length);
    //           let count = 0;
    //           for (let j = 0; j < this.roleList.length; j++) {
    //             console.log("this.roleList[j].payeeRoleName", this.roleList[j].payeeRoleName + data[i].payeeRoleName);

    //             if (this.roleList[j].payeeRoleName == data[i].payeeRoleName) {
    //               count++;
    //             }
    //           }
    //           if (count == 0) {
    //             this.roleList.push(data[i]);
    //           }
    //         }
    //       }
    //     }

    //     console.log("this.roleList", this.roleList);
    //     this.userName = this.roleList[0].levelValueDesc;
      
    //   }
    // })
  }
  // ngOnChanges(changes:SimpleChange):void{
  //   console.log(changes.previousValue);
  //   console.log(this.showMenu);
  //   if(changes){
  //     console.log(changes.previousValue);
  //   }
  // }

  // openMenu(){
  //   this.showMenu=true;
    
  // }
  openMenu():void {
    document.getElementById("mySidenav1")!.style.display = "block";
  }

 
  // closeMenu():void{
  //   this.showMenu=false;
  // }
  @HostListener('window:scroll', [])
onWindowScroll(event: Event) {
    //set up the div "id=nav"
    if (document.body.scrollTop > 40 ||
        document.documentElement.scrollTop > 40) {
        document.getElementById('myHeader')!.classList.add('sticky');
    }
    else {
        document.getElementById('myHeader')!.classList.remove('sticky');
        this.innerWidth = 'auto';
    }
}
}
