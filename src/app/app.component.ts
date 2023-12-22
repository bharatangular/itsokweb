import { Component, HostListener } from '@angular/core';

import { TokenManagementService } from './services/token-management.service';
import { IdleTimeoutService } from './services/idle-timeout.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Pension Module'; 
  isRefreshTokenGet: boolean;
  sessionExpired: boolean = true;
  constructor(private consoleToggleService: TokenManagementService,private idleTimeoutService: IdleTimeoutService) {

    this.consoleToggleService.disableConsoleInProduction();
    // this.setValues();
  }
  setValues(){
    if(this.idleTimeoutService.checkIfTokenFailed()){
      this.sessionExpired = true;
      this.idleTimeoutService.openSessionExpireModal();
    } else {
      this.sessionExpired = false;
      this.initializeIdleTimeout();
    }
    
  }
  initializeIdleTimeout(){
    this.idleTimeoutService.setTokenExp();
    this.idleTimeoutService.startIdleTimer(600); 
    this.idleTimeoutService.isIdle().subscribe((isIdle) => {
      // if (isIdle) {
        // this.idleTimeoutService.openModal();
      // }
    });
    interval(1000)
      .subscribe(() => {
        const isUserIdle = this.idleTimeoutService.isUserIdle();
        this.idleTimeoutService.updateIdleStatus(isUserIdle);
        if(!isUserIdle){
          if(this.idleTimeoutService.checkIfGetNewtoken()){
            if(!this.isRefreshTokenGet){
              this.isRefreshTokenGet = true;
              this.getRefreshToken();
            }
          }
        } else {
          this.idleTimeoutService.openModal();
        }
      });
  }
  getRefreshToken(){
    this.idleTimeoutService.getRefreshToken().subscribe((res:any)=>{
      const token = res?.data?.token;
      if(token){
        sessionStorage.setItem('MpJwtToken',token);
        this.idleTimeoutService.setTokenExp();
        this.isRefreshTokenGet=false;
      }
    });
  }
  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keypress', ['$event'])
  @HostListener('document:click', ['$event'])
  @HostListener('document:scroll', ['$event'])
  resetIdleTimer(event: Event): void {
    this.idleTimeoutService.resetIdleTimer();
  }
  }
