import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

const key = CryptoJS.enc.Utf8.parse('7061737323313233');
const key2 = CryptoJS.enc.Utf8.parse('IFMS!@#$2023');
const iv = CryptoJS.enc.Utf8.parse('7061737323313233');
export class AppConfig {

  HostUrl: any = 'http://localhost:59776/';

  public readonly ErrorMSG = 'The system is experiencing technical difficulties please ' +
    'refresh the page if the error persists then please login again';

  constructor() {
    //localStorage.setItem('LanType', 'en');
  }

 
  encrypt(text: any) {
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
  }
  decrypt(text: any) {
    return CryptoJS.AES.decrypt(text, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }
  // tokendecrypt(value) {
  //   var key = CryptoJS.PBKDF2(this.PASSWORD, this.SALT, {
  //     keySize: 256 / 32,
  //     iterations: 65536
  //   })
  //   var decrypted = CryptoJS.AES.decrypt(value, key, {
  //     iv: this.toWordArray(this.Key_IV),
  //     padding: CryptoJS.pad.Pkcs7,
  //     mode: CryptoJS.mode.CBC
  //   })
  //   return decrypted.toString(CryptoJS.enc.Utf8);
  // }
//}



  // getLoggedInUser(): Observable<any> {
  //   const userinfo = localStorage.getItem('current_user');
  //   const decryptuserinfo: any = this.decrypt(userinfo);
  //   const current_user = JSON.parse(decryptuserinfo);
  //   const headers = new Headers({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${current_user.Token}`
  //   })
  //   return headers;
  // }


  private jwtwithfile(): HttpHeaders {

    // create authorization header with jwt token
    const userinfo = this.getDetails('current_user');
    const decryptuserinfo: any = this.decrypt(userinfo);
    const current_user = JSON.parse(decryptuserinfo);
    const headers = new HttpHeaders();
    if (current_user && current_user.Token) {
      headers.set('Authorization', 'Bearer ' + current_user.Token);
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      return headers;
    }
    else {
      return headers;
    }
  }
 
  public jwt(): HttpHeaders {


    const userinfo = this.getDetails('current_user');
    if (userinfo && userinfo !== null && userinfo !== 'null') {
      const decryptuserinfo: any = this.decrypt(userinfo);
      const current_user = JSON.parse(decryptuserinfo);
      if (current_user && current_user.Token) {

            const headers = new HttpHeaders().set('Authorization', 'Bearer ' + current_user.Token);
            return headers;
        
      }
      else {
        const headers = new HttpHeaders().set('Authorization', 'Bearer 0');
        return headers;
      }
    }
    else {
      const headers = new HttpHeaders().set('Authorization', 'Bearer 0');
      return headers;
    }

  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }
storeUserDetails(userDetails:any)
{
  let enuser:any=this.encrypt(JSON.stringify(userDetails));
  sessionStorage.setItem('userDetails',enuser);

}

getUserDetails()
{
  var enuser:any=sessionStorage.getItem('userDetails');
  if(enuser){
  var dyuser:any=this.decrypt(enuser);
  console.log(dyuser)
  if(JSON.stringify(dyuser).includes("roleid"))
  {
    dyuser=JSON.parse(dyuser);
  }else{
    dyuser={"role":"",
    "roleid" :"",
    "officeid":"",
    "treasCode":"",
    "treasName":"",
   "assignmentid":"",
   "deptId":''};
  }
  
}else{
  dyuser={"role":"",
  "roleid" :"",
  "officeid":"",
  "treasCode":"",
  "treasName":"",
 "assignmentid":"",
 "deptId":''};
}
  return dyuser;

}
storeLoginDetails(loginDetails:any)
{
  let enuser:any=this.encrypt(JSON.stringify(loginDetails));
  sessionStorage.setItem('loginDetails',enuser);

}
getLoginDetails()
{
  var enuser:any=sessionStorage.getItem('loginDetails');
  if(enuser){
  var dyuser:any=this.decrypt(enuser);
  if(dyuser)
  {
    dyuser=JSON.parse(dyuser);
  }
  
}else{
  dyuser={"role":"",
  "roleid" :"",
  "officeid":"",
  "treasCode":"",
  "treasName":"",
 "assignmentid":""};;
}
  return dyuser;

}
storeDetails(key:any,Details:any)
{
  let enuser:any=this.encrypt(Details);
  sessionStorage.setItem(key,enuser);
}
getDetails(key:any)
{
  var enData:any=sessionStorage.getItem(key);
  if(enData){
    
  var dyuser:any=this.decrypt(enData);
 
  }
  return dyuser;
}
}