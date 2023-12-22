import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';


import { HttpApiService } from './http-api.service';
import { HttpHeaders } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

import { IdleTimeoutComponent } from '../pension/session/idle-timeout/idle-timeout.component';
import { SessionExpiredComponent } from '../pension/session/session-expired/session-expired.component';

@Injectable({
  providedIn: 'root',
})
export class IdleTimeoutService {
  private idleTimer$ = new BehaviorSubject<boolean>(false);
  public lastActivityTimestamp: number = Date.now();
  private idleTime: number = 0;
  confirmDialog: any;
  tokenExpireTime: number;
  confirmDialogSession: any;

  constructor(
    private dialog: MatDialog,
    private httpApiService: HttpApiService,

    ) {}

  startIdleTimer(timeoutMinutes: number): void {
    // timer(timeoutMinutes * 60 * 1000)
    this.idleTime = timeoutMinutes;
    timer(timeoutMinutes * 1000)
      .pipe(
        switchMap(() => {
          this.idleTimer$.next(true);
          return new Observable(); // Replace with your desired logout logic.
        })
      )
      .subscribe();
  }

  resetIdleTimer(): void {
    this.idleTimer$.next(false);
    this.lastActivityTimestamp = Date.now();
  }

  isIdle(): Observable<boolean> {
    return this.idleTimer$.asObservable();
  }

  updateIdleStatus(isUserIdle: boolean): void {
    this.idleTimer$.next(isUserIdle);
  }

  isUserIdle(): boolean {
    // Calculate the time since the last user activity in milliseconds
    const timeSinceLastActivity = Date.now() - this.lastActivityTimestamp;

    // Define a threshold for idle (e.g., 5 minutes)
    const idleThresholdMilliseconds = this.idleTime * 1000;

    // Check if the time since last activity exceeds the idle threshold
    return timeSinceLastActivity > idleThresholdMilliseconds;
  }

  openModal() {
    if (!this.confirmDialog) {
      this.confirmDialog = this.dialog.open(IdleTimeoutComponent, {
        autoFocus: false,
        disableClose: true,
        panelClass: 'medium-dialog',
        data: {
          title: '',
          id: 'idle-timeout',
          dialogText: '',
          idleTimeoutTimer: Date.now() + (1000 * 120),
        }
      });

      this.confirmDialog.afterClosed().subscribe((res: any) => {
        if (res) {
          if (res.keepSession) {
            this.getRefreshToken().subscribe((res: any) => {
              const token = res?.data?.token;
              if (token) {
                sessionStorage.setItem('MpJwtToken', token);
                this.setTokenExp();
                this.confirmDialog = null;
              }
            });
          }

          if(!res.keepSession && !res.logout){
            sessionStorage.clear();
            localStorage.clear();
            this.openSessionExpireModal();
          }

        }
      });
    }

  }


  
  openSessionExpireModal(){
    console.log('this.confirmDialogSession', this.confirmDialogSession);
    if (!this.confirmDialogSession) {
      this.confirmDialogSession = this.dialog.open(SessionExpiredComponent, {
        autoFocus: false,
        disableClose: true,
        panelClass: 'medium-dialog',
        data: {
          title: '',
          id: '',
          dialogText: '',
        }
      });
    }
    
  }

  getRefreshToken() {
    let authToken:any = sessionStorage.getItem('MpJwtToken');
    if (!authToken) {
      authToken = sessionStorage.getItem('jwt_token');
    }
    const header:HttpHeaders = new HttpHeaders().append("token", authToken);
    const options:any = {
      headers: header,
    }
    let url=window.location.origin+"/mp/getRefreshToken"
    return this.httpApiService.post(url, {}, options);
  }


  checkIfTokenFailed(){
    let authToken: any = sessionStorage.getItem('MpJwtToken');
    if (!authToken) {
      authToken = sessionStorage.getItem('jwt_token');
    }
    if (!authToken) {
      sessionStorage.clear();
      localStorage.clear();
      return true;
    }
    let tokenVal: any = jwt_decode(authToken);
    this.tokenExpireTime = parseInt(tokenVal['exp']);
    let currDate = Math.floor(new Date().getTime()/1000.0);
    if (this.tokenExpireTime < currDate) {
      sessionStorage.clear();
      localStorage.clear();
      return true
    }
    return false;
  }

  setTokenExp(){
    let authToken: any = sessionStorage.getItem('MpJwtToken');
    if (!authToken) {
      authToken = sessionStorage.getItem('jwt_token');
    }
    let tokenVal: any = jwt_decode(authToken);
    this.tokenExpireTime = parseInt(tokenVal['exp']);
  }

  checkIfGetNewtoken(): boolean {
    // let authToken: any = sessionStorage.getItem('MpJwtToken');
    // if (!authToken) {
    //   authToken = sessionStorage.getItem('jwt_token');
    // }
    // let tokenVal: any = jwt_decode(authToken);

    if (this.tokenExpireTime) {
      let currDate = Math.floor(new Date().getTime()/1000.0);
      // let currDate = parseInt(Date.now().toString().substr(0, 10));
      // let expDatePlus30Mins = parseInt(tokenVal['exp']) + 1800;
        if (this.tokenExpireTime < (currDate + 120)) {
          return true;
        } else {
          // this.logout();
          return false;
        }
      

    }
    return false;
  }



}