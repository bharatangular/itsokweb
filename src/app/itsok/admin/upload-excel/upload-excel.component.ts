import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { CommonService } from 'src/app/services/common.service';
import { FileExcelService } from 'src/app/services/file-excel-service.service';
import { ItsokService } from 'src/app/services/itsok.service';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: ['./upload-excel.component.scss']
})
export class UploadExcelComponent implements OnInit {
  constructor(public api: ItsokService,
    public common: CommonService, public filetoexcel: FileExcelService, public router: Router
  ) { }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ["code", "name", "type", "mrp", "sales_price", "menufacturer", "Action"];
  dataSource = new MatTableDataSource();
  count: any = 0;
  medicineList: any[] = []
  errorList: any[] = []
  config: AppConfig = new AppConfig();
  ngOnInit(): void {

    let login = this.config.getDetails("login");
    console.log(login)
    if (login == "1") { }
    else { alert("First login."); }
    this.api.configMenu = { url: "Upload Excel" };

  }


  excelUpload(event: any) {

    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      console.log("type", fileType)


      this.filetoexcel.convertExcelToJson(file).then((res: any) => {
        res = JSON.parse(res);
        console.log("res", res);
        this.medicineList = res;
        this.errorList = res;
        this.dataSource = new MatTableDataSource(res);

      })



    }

  }
  exportToExcel() {
    this.filetoexcel.SaveToExcel(this.errorList, "remainingToUpload")
  }
  insertMedicine() {
    let data = {
      "inType": 2,
      "requestJson": this.medicineList
    }
    console.log(this.medicineList);


    this.api.postisok("insertMedicineSP", data).subscribe((res: any) => {
      console.log(res)
      alert("Uploded medicines:" + res[1].affectedRows)
    }, (error) => {

    })


  }
}

