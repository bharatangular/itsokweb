import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';
import { ItsokService } from 'src/app/services/itsok.service';
import { MedicineUpdateDialogComponent } from '../medicine-update-dialog/medicine-update-dialog.component';

@Component({
  selector: 'app-medicine-update',
  templateUrl: './medicine-update.component.html',
  styleUrls: ['./medicine-update.component.scss']
})
export class MedicineUpdateComponent implements OnInit {

  constructor(public api:ItsokService,
              public common:CommonService,
              public dialog:MatDialog) { }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] =["code","name","type","mrp","sales_price","Action"];
  dataSource = new MatTableDataSource();
  ngOnInit(): void {
    this.api.configMenu = { url: "Medicines Upadte" };
    this.getMedicineList()
  }
  getMedicineList()
  {
    let from=11400
    let data={
      "from":from,
      "to":from+50
    }
    this.api.postisok("medicineList",data).subscribe((res:any)=>{
      console.log("res",res);
      this.dataSource = new MatTableDataSource(res);
    
    })
  }
  editMedicine(medicine:any)
  {
    this.dialog.open(MedicineUpdateDialogComponent,{  width: '70%', data: {message: medicine ,id:1},  disableClose: true}).afterClosed()
    .subscribe((data:any) => {
     console.log(data)
     
    });
  }
}
