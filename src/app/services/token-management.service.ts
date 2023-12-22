import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class TokenManagementService {

  constructor() {this.getDecodedAccessToken() }
  disableConsoleInProduction(): void {
    if (environment.production) {
      console.warn(`Console output is disabled on production!`);
      console.log = function (): void { };
      console.debug = function (): void { };
      console.warn = function (): void { };
      console.info = function (): void { };
    }
  }

  empinfoService:any;
  getDecodedAccessToken(): any {
    let makerToken:any = sessionStorage.getItem('MpJwtToken');
 
    // console.log(makerToken);
    try {
      let mytoken = jwt_decode(makerToken);
      
      
      this.empinfoService=mytoken;
    }
    catch (Error) {
      return null;
    }
  }
}




