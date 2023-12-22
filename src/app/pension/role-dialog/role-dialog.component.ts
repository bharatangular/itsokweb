import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-dialog',
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss']
})
export class RoleDialogComponent implements OnInit {

  constructor(public dialog:MatDialog,public router:Router) { }

  ngOnInit(): void {
  }
  redirectToDashboard(){
    let purl: string = this.router['location']._platformLocation.location.origin;
    //window.location.replace();
    //location.href = purl+"/ifmssso/#/moduleinfo";
    this.dialog.closeAll();
  }
}
