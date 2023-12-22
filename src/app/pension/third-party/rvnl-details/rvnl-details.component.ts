import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfig } from 'src/app/app.config';
import { ViewPensionEssComponent } from '../../e-pension/view-pension-ess/view-pension-ess.component';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LoaderService } from 'src/app/services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewRvnlDetailsComponent } from '../view-rvnl-details/view-rvnl-details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rvnl-details',
  templateUrl: './rvnl-details.component.html',
  styleUrls: ['./rvnl-details.component.scss'],
})
export class RvnlDetailsComponent implements OnInit {
  displayedColumns: string[] = [
    'employeeId',
    'name',
    'dateOfRetirement',
    'mobileNo',
    'Action',
  ];

  dataSource!: MatTableDataSource<any>;
  isShow = true;
  config: AppConfig = new AppConfig();
  userList: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  error: string = '';


  constructor(
    public dialog: MatDialog,
    private _Service: PensionServiceService,
    private load: LoaderService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.getRvnlData();
  }

  getRvnlData() {
    let data={};
    debugger;
    this._Service.postRvnlDetails(data,"getRvnlPersonalDtls").subscribe({
      next: (res) => {
        this.load.hide();
        if (res.status === "SUCCESS") {
          if (res == '') {
            alert("Not Record Found");
          }
          else {

            console.log("pensioner list",res.data);
            this.dataSource = new MatTableDataSource(res.data);
            this.dataSource.paginator = this.paginator;
          }
        }
      },
      error: (err) => {
        this.load.hide();
        console.log(err);
        this.error = err

      }
    })
    // this._Service.postVBO('getRvnlPersonalDtls',"").subscribe({
    // // this._Service.postRvnlDetails('getRvnlPersonalDtls').subscribe({
    //   next: (res:any) => {
    //     this.load.hide();
    //     if (res.status === 'SUCCESS') {
    //       if (res == '') {
    //         alert('Not Record Found');
    //       } else {
    //         console.log('pensioner list', res.data);
    //         this.dataSource = new MatTableDataSource(res.data);
    //         // this.dataSource = new MatTableDataSource(this.userList);

    //         this.dataSource.paginator = this.paginator;
    //       }
    //     }
    //   },
    //   error: (err) => {
    //     this.load.hide();
    //     console.log(err);
    //     this.error = err;
    //   },
    // });
    // this._Service.postRvnlDetails("getRvnlPersonalDtls").subscribe()
  }

  View_Details(row:any){

    console.log(row.pensionerId);


    // let data = {
    //   // isdialog: true,
    //   empData: row,
    // };

     this.router.navigate(['/pension/third-party/view-rvnldetails',row.pensionerId]);


    // this.dialog
    // .open(ViewRvnlDetailsComponent, {
    //   panelClass: 'dialog-w-30',
    //   disableClose:true,
    //   data: { message: data },
    //   height: '70%',
    //   width: '80%',
    // })
    // .afterClosed()
    // .subscribe((data: any) => {});

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  View_ESSPension(employeeCode: any, employeeId: any, psnType: any, row: any) {
    console.log(employeeCode,employeeId,row)
    this.config.storeDetails('employeeCode', employeeCode);
    this.config.storeDetails('employeeId', employeeId);
    this.config.storeDetails('psnType', psnType);
    this.config.storeDetails('pkEsignData', '');
    this.config.storeDetails('esigntype', '');
    this.config.storeDetails('approverSubmitData', '');
    console.log('inside view calculation ', row);
    let data = {
      isdialog: true,
      empData: row,
    };
    this.dialog
      .open(ViewPensionEssComponent, {
        panelClass: 'dialog-w-30',
        disableClose:true,
        data: { message: data },
        height: '70%',
        width: '80%',
      })
      .afterClosed()
      .subscribe((data: any) => {});
    //  this.router.navigate(['/pension/e-Pension/ViewESSPension']);
    //  localStorage.setItem("employeeCode",employeeCode)
    //  localStorage.setItem("employeeId",employeeId)
    //  localStorage.setItem("psnType",psnType)
  }
}
