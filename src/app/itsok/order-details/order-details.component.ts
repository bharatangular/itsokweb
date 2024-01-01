import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { CommonService } from 'src/app/services/common.service';
import { ItsokService } from 'src/app/services/itsok.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  config: AppConfig = new AppConfig();
  constructor(public api: ItsokService,
    public common: CommonService,
    public dialog: MatDialog,
    public router: Router) { }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ["orderNo", "mobileNo", "patientName", "drName", "patientAge", "status", "Action"];
  dataSource = new MatTableDataSource();
  from: any = 1;
  ngOnInit(): void {
    let login = this.config.getDetails("login");
    console.log(login)
    if (login == "1") { }
    else { alert("First login."); }
    this.api.configMenu = { url: "Order Details" };
    this.getOrderList(1)
  }
  getOrderList(i: any) {

    let data = {
      "inType": i,
      "requestJson": {
        "from": this.from,
        "to": this.from + 50
      }

    }
    this.api.postisok("orderdetails", data).subscribe((res: any) => {
      console.log("res", res[0]);
      this.dataSource = new MatTableDataSource(res[0]);

    })
  }
  // editMedicine(medicine: any) {
  //   this.dialog.open(MedicineUpdateDialogComponent, { width: '70%', data: { message: medicine, id: 1 }, disableClose: true }).afterClosed()
  //     .subscribe((data: any) => {
  //       console.log(data)

  //     });
  // }
  viewOrderDeatils(data: any) {

  }
  markCompleteOrder(item: any) {
    let data = {
      "inType": 5,
      "requestJson": {
        "orderId": item.o_id,

      }
    }
    this.api.postisok("orderdetails", data).subscribe((res: any) => {
      console.log("res", res);
      this.getOrderList(1);

    })
  }
  markCancelOrder(item: any) {
    let data = {
      "inType": 6,
      "requestJson": {
        "orderId": item.o_id,

      }
    }
    this.api.postisok("orderdetails", data).subscribe((res: any) => {
      console.log("res", res);
      this.getOrderList(1);

    })
  }
  prevStepc(i: any) {
    this.from = this.from - 50;
    this.getOrderList(i);
  }
  nextStepc(i: any) {
    this.from = this.from + 50;
    this.getOrderList(i);
  }
  onTabMainChanged(index: any) {
    console.log("index", index.index)
    this.from = 1
    if (index.index == 0) {
      this.getOrderList(1);
    } else if (index.index == 1) {
      this.getOrderList(2);

    }
    else if (index.index == 2) {
      this.getOrderList(3);

    }
  }
}

