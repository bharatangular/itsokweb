import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItsokService } from 'src/app/services/itsok.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  constructor(public api: ItsokService, public router: Router) { }

  ngOnInit(): void {
    this.api.configMenu = { url: "Admin Login" };
  }
  username: string = "";
  password: string = "";
  show: boolean = false;

  submit() {
    console.log("user name is " + this.username + "   password is " + this.password)
    if (!this.username) {
      alert("Enter user name");
      return;
    }

    if (!this.password) {
      alert("Enter Password");
      return;
    }

    let data = {
      'name': this.username,
      'password': this.password
    }
    console.log("data", data)
    this.api.postisok("adminLogin", data).subscribe((res: any) => {
      console.log("res", res);
      if (res.count == 1) {
        this.router.navigate(['itsok/dashboard'])
      } else {
        alert("Please enter right username or password.")
      }
    })
    this.clear();
  }

  clear() {
    this.username = "";
    this.password = "";
    this.show = true;
  }

}
