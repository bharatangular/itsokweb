import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';
import { ItsokService } from 'src/app/services/itsok.service';
import { MedicineUpdateDialogComponent } from '../medicine-update-dialog/medicine-update-dialog.component';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-medicine-update',
  templateUrl: './medicine-update.component.html',
  styleUrls: ['./medicine-update.component.scss']
})
export class MedicineUpdateComponent implements OnInit {
  config: AppConfig = new AppConfig();
  constructor(public api: ItsokService,
    public common: CommonService,
    public dialog: MatDialog,
    public router: Router) { }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ["code", "name", "type", "mrp", "sales_price", "Action"];
  dataSource = new MatTableDataSource();
  from: any = 1;
  ngOnInit(): void {
    let login = this.config.getDetails("login");
    console.log(login)
    if (login == "1") { }
    else { alert("First login."); }
    this.api.configMenu = { url: "Medicines Upadte" };
    this.getMedicineList()
  }
  getMedicineList() {

    let data = {
      "from": this.from,
      "to": this.from + 50
    }
    this.api.postisok("medicineList", data).subscribe((res: any) => {
      console.log("res", res);
      this.dataSource = new MatTableDataSource(res);

    })
  }
  editMedicine(medicine: any) {
    this.dialog.open(MedicineUpdateDialogComponent, { width: '70%', data: { message: medicine, id: 1 }, disableClose: true }).afterClosed()
      .subscribe((data: any) => {
        console.log(data)

      });
  }
  prevStepc() {
    this.from = this.from - 50;
    this.getMedicineList();
  }
  nextStepc() {
    this.from = this.from + 50;
    this.getMedicineList();
  }
}
