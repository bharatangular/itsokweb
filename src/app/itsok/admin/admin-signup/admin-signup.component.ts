import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { ItsokService } from 'src/app/services/itsok.service';

@Component({
  selector: 'app-admin-signup',
  templateUrl: './admin-signup.component.html',
  styleUrls: ['./admin-signup.component.scss']
})
export class AdminSignupComponent implements OnInit {
  config: AppConfig = new AppConfig();
  constructor(public api: ItsokService) { }
  ngOnInit(): void {
    this.api.configMenu = { url: "Admin Sign-up" };
  }
  username: any = "";
  mobile: any
  email: any
  password: any = "";
  show: boolean = false;
  submit() {
    console.log("user name is " + this.username + "   password is " + this.password)
    if (!this.username) {
      alert("Enter user name");
      return;
    }
    if (!this.mobile) {
      alert("Enter Mobile No");
      return;
    }
    if (!this.password) {
      alert("Enter password");
      return;
    }

    let data = {
      'name': this.username,
      'mobile_no': this.mobile,
      'e_mail': this.email ? this.email : "test@abc.com",
      'password': this.password
    }
    console.log("data", data)
    this.api.postisok("addAdmin", data).subscribe((res: any) => {
      console.log("res", res);
    })
    this.clear();
  }
  clear() {
    this.username = "";
    this.password = "";
    this.mobile = "";
    this.email = "";
    this.show = true;
  }


}
