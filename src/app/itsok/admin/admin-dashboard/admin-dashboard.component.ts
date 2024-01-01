import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { ItsokService } from 'src/app/services/itsok.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  config: AppConfig = new AppConfig();
  constructor(public api: ItsokService, public router: Router,
  ) { }
  menuList: any[] = [];
  ngOnInit(): void {
    let login = this.config.getDetails("login");
    if (login == "1")
      this.router.navigate(['itsok/dashboard'])
    else
      alert("First login.");

    this.api.configMenu = { url: "Admin Dashboard" };
    this.getDashboardMenu()
  }
  getDashboardMenu() {
    let data = {
      "menuId": 1
    }
    console.log("data", data)
    this.api.postisok("menu", data).subscribe((res: any) => {
      console.log("res", res);
      this.menuList = res
    })
  }
  redirctTo(item: any) {
    console.log("data", item.url)
    if (item.url != "")
      this.router.navigate([item.url])
  }
}
