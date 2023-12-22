
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { SnackbarService } from 'src/app/services/snackbar.service';
import jwt_decode from 'jwt-decode';

import { AppConfig } from 'src/app/app.config';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-revert-list',
  templateUrl: './revert-list.component.html',
  styleUrls: ['./revert-list.component.scss']
})
export class RevertListComponent implements OnInit {
  displayedColumns: any[] = ['employeeCode', 'employeeId','employeeName','EMPFatherName'];   
  
  dataSource!: MatTableDataSource<any>;
  empinfo:any
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private apiService:PensionServiceService) { }

  ngOnInit(): void {
    this.empinfo = this.apiService.userInfo();
    console.log(this.empinfo);
    this.getList();
  }
getList()
{
  let data={
    'inType':1,
    'officeId':this.empinfo.levelValueCode
  }
  console.log("data",data)
  this.apiService.postNewEmployee('getPensionRevertEmpDetails', data).subscribe({
    next: (res) => {
      console.log("res",res)
      if(res.data.psnRevertEmployeeDetails!=null)
      {
        this.dataSource = new MatTableDataSource(res.data.psnRevertEmployeeDetails);
        this.dataSource.paginator = this.paginator;
      }else{

      }
    }
  })
}
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
