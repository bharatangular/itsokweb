import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItsokService } from 'src/app/services/itsok.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor(public api: ItsokService, public router: Router) { }
  menuList: any[] = [];
  ngOnInit(): void {
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
    console.log("data", item)
    if (item.url != "")
      this.router.navigate([item.url])
  }
}
