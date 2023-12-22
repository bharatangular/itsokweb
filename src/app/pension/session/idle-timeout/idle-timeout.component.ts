import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { interval } from 'rxjs';

@Component({
  selector: 'app-idle-timeout',
  templateUrl: './idle-timeout.component.html',
  styleUrls: ['./idle-timeout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class IdleTimeoutComponent implements OnInit {
  title: any;
  id: any;
  dialogText: any;
  idleTimeoutTimer: any;
  timeLeft:number = 0;
  startTimer = true

  constructor(
    private dialogRef: MatDialogRef<IdleTimeoutComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
) {
  dialogRef.disableClose = true;
  this.title = data.title;
  this.id = data.id;
  this.idleTimeoutTimer = data.idleTimeoutTimer;
  this.dialogText = data.dialogText;
 }


  ngOnInit(): void {
    let currDate = Date.now();
    this.timeLeft = this.idleTimeoutTimer - currDate;
    interval(1000)
    .subscribe(() => {
   

      if (this.idleTimeoutTimer && this.startTimer) {
        let currDate = Date.now();

        this.timeLeft = this.idleTimeoutTimer - currDate;

        // console.log('this.idleTimeoutTimer',this.idleTimeoutTimer);
        // console.log('this.currDate',currDate);
        // console.log('this.timeLeft',this.timeLeft);

        // let expDatePlus30Mins = parseInt(tokenVal['exp']) + 1800;
          if (this.idleTimeoutTimer < currDate ) {
            this.startTimer = false
            this.dialogRef.close({
              'keepSession':false,
              'logout':false
            })
          } else {


            

            // this.logout();
          
          }
        
  
      }

      

    });
  }

  transform(val: number): string {
    const value: number = Math.floor(val/1000);
    const minutes: number = Math.floor(value / 60);
    if(!minutes){
      return ('00' + Math.floor(value - minutes * 60)).slice(-2) + ' sec';
    } else {
      return ('00' + minutes).slice(-2) + ' min ' + ('00' + Math.floor(value - minutes * 60)).slice(-2) + ' sec';
    }
  }
  logout(){
    sessionStorage.clear();
    localStorage.clear();
    const ifmsssourl = `${window.location.origin}/ifmssso`;
    window.location.href = ifmsssourl;
  }
  keepSession(){
    this.dialogRef.close({
      'keepSession':true,
      'logout':false
    })
  }
  // logout(){
  //   this.dialogRef.close({
  //     'keepSession':false,
  //     'logout':true
  //   })
  // }

}
