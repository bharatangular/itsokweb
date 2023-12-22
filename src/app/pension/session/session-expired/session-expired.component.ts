import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SessionExpiredComponent implements OnInit {

  title: any;
  id: any;
  dialogText: any;

  constructor(
    private dialogRef: MatDialogRef<SessionExpiredComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
) {
  dialogRef.disableClose = true;
  this.title = data.title;
  this.id = data.id;
  this.dialogText = data.dialogText;
 }


  ngOnInit(): void {
   
  }

  logout() {
      sessionStorage.clear();
      localStorage.clear();
  }

  login(){
    this.logout();
    const ifmsssourl = `${window.location.origin}/ifmssso`;
    window.location.href = ifmsssourl;

  }

}
