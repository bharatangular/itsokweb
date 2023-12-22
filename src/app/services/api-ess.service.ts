import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { ErrorHandler } from '@angular/core';
import { AppConfig } from '../app.config';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ApiEssService {
  private menuConfig = new BehaviorSubject({ url: 'Inbox' });
  private pensionUrl='https://ifmstest.rajasthan.gov.in/pss/v1.0/pss/';
  private intregationUrl="https://ifmstest.rajasthan.gov.in/integration/v1.0/";
  private oracalUrl="https://ifmstest.rajasthan.gov.in/integration/v1.0/" ;
  private empUrl='https://ifmstest.rajasthan.gov.in/employee/mst/v1.0/';
  private mdmurl="https://ifmstest.rajasthan.gov.in/employee/mdm/v1.0/";
  private pensionWF="https://ifmstest.rajasthan.gov.in/pension/wf/v1.0/";
  private employeeWF="https://ifmstest.rajasthan.gov.in/employee/wf/v1.0/"
  private employeeV2="https://ifmstest.rajasthan.gov.in/employee/mst/v2.0/";
  private pensionMain="https://ifmstest.rajasthan.gov.in/pension/v1.0/";
  private lmdmurl="https://ifmstest.rajasthan.gov.in/employee/lmdm/v1.0/"
  esignUrlNew:any

  
 


 
  mainurl:any;
  config:AppConfig=new AppConfig();
    ssoId:any;
    url:any;
     headers = new HttpHeaders();
    constructor(private http: HttpClient,private _errService:ErrorHandler,public router:Router) {  this.configMenu={isload:true} 
  
    let purl:string=this.router['location']._platformLocation.location.origin;
    // console.log(purl)111;
    if(purl.includes("http://localhost") || purl.includes("http://ifmsdev.rajasthan.gov.in" ) || purl.includes("http://172.22.32.157" ))
    {
      this.mainurl = "http://ifmsdev.rajasthan.gov.in/";
      this. pensionUrl=this.mainurl+"pss/v1.0/pss/";
      this. intregationUrl=this.mainurl+"integration/v1.0/";
      this. oracalUrl=this.mainurl+"integration/v1.0/" ;
      this. empUrl=this.mainurl+"employee/mst/v1.0/";
      this. mdmurl=this.mainurl+"employee/mdm/v1.0/";
      this. pensionWF=this.mainurl+"pension/wf/v1.0/";
      this. employeeWF=this.mainurl+"employee/wf/v1.0/";
      this. employeeV2=this.mainurl+"employee/mst/v2.0/";
      this. pensionMain=this.mainurl+"pension/v1.0/";
      this. lmdmurl=this.mainurl+"employee/lmdm/v1.0/"
      this.esignUrlNew=this.mainurl+'esign/'
   

    }
    else if(purl.includes("https://ifms.rajasthan.gov.in" )) {
    this.mainurl = "https://ifms.rajasthan.gov.in/";
    this. pensionUrl=this.mainurl+"pss/v1.0/pss/";
      this. intregationUrl=this.mainurl+"integration/v1.0/";
      this. oracalUrl=this.mainurl+"integration/v1.0/" ;
      this. empUrl=this.mainurl+"employee/mst/v1.0/";
      this. mdmurl=this.mainurl+"employee/mdm/v1.0/";
      this. pensionWF=this.mainurl+"pension/wf/v1.0/";
      this. employeeWF=this.mainurl+"employee/wf/v1.0/";
      this. employeeV2=this.mainurl+"employee/mst/v2.0/";
      this. pensionMain=this.mainurl+"pension/v1.0/";
      this. lmdmurl=this.mainurl+"employee/lmdm/v1.0/"
      this.esignUrlNew=this.mainurl+'esign/'
    }  else if(purl.includes("https://ifmstest.rajasthan.gov.in" )) {
      this.mainurl = "https://ifmstest.rajasthan.gov.in/";
      this. pensionUrl=this.mainurl+"pss/v1.0/pss/";
      this. intregationUrl=this.mainurl+"integration/v1.0/";
      this. oracalUrl=this.mainurl+"integration/v1.0/" ;
      this. empUrl=this.mainurl+"employee/mst/v1.0/";
      this. mdmurl=this.mainurl+"employee/mdm/v1.0/";
      this. pensionWF=this.mainurl+"pension/wf/v1.0/";
      this. employeeWF=this.mainurl+"employee/wf/v1.0/";
      this. employeeV2=this.mainurl+"employee/mst/v2.0/";
      this. pensionMain=this.mainurl+"pension/v1.0/";
      this. lmdmurl=this.mainurl+"employee/lmdm/v1.0/"
      this.esignUrlNew=this.mainurl+'esign/'
      }
  
  }
    set configMenu(value) {
      this.menuConfig.next(value);
    }
  
    get configMenu(): any | Observable<any> {
      return this.menuConfig.asObservable();
    }
  
    createAuthorizationHeader(headers: HttpHeaders) {
    
      headers.append("Content-Type", "application/json");
      headers.append("Content-Type", "application/x-www-form-urlencoded");
      headers.append("Content-Type", "json");
      headers.append("Accept", "application/json");
      headers.append("Accept", "text/xml");
      headers.append("Content-Type", "text/xml");
      headers.append("Content-Type", "application/xml");
      headers.append("Accept", "*/*");
      headers.append("Access-Control-Allow-Origin", "*");
      headers.append("Access-Control-Allow-Credentials", "true");
    }
    postNewEmployee(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.employeeV2}${url}`, data, {
        headers: this.headers,     
        withCredentials: true      
      });
    }
    postpension(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);    
      return this.http.post<any>(`${this.pensionUrl}${url}`, data, {headers: this.headers});
    }
    postmdm(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.mdmurl}${url}`, data, {
        headers: this.headers,     
        withCredentials: true      
      });
    }
    postWf(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.pensionWF}${url}`, data, {
        headers: this.headers,     
        withCredentials: true      
      });
    }
    postNewEsign(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.esignUrlNew}${url}`, data, {
        headers: this.headers,
        withCredentials: true ,
        responseType: "text",
      });
    }
    post(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.employeeWF}${url}`, data, {
        headers: this.headers,     
        withCredentials: true      
      });
    }
    postloantype1(data:any,ACTION:string)
    {
      ACTION = `${this.pensionMain}` + ACTION;
      return this.http.post<any>(ACTION, data,{
       headers: this.headers,
          withCredentials: true 
     });
    }
    
  postOr(url: any,data: any)
  {
    this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.oracalUrl}${url}`, data, {
        headers: this.headers
      });
  }
  postlmdm(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.lmdmurl}${url}`, data, {
        headers: this.headers,     
        withCredentials: true      
      });
    }
    postmst(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.employeeV2}${url}`, data, {
        headers: this.headers,     
        withCredentials: true      
      });
    }
    postIntegration(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);    
      return this.http.post<any>(`${this.intregationUrl}${url}`, data, {headers: this.headers});
    }
  
    postIfms(url: any,data: any)
     {
       this.createAuthorizationHeader(this.headers);
         this.headers = new HttpHeaders().append("contentType", "text/xml");
         //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
         return this.http.post(`${this.oracalUrl}${url}`, data, {
           headers: this.headers
         });
     }
  
    private handleError(error: HttpErrorResponse) {
      return throwError(() => error.error);
    }
  
    requestApplication(data:any,ACTION:string)
    {
     // this.url= "https://ifms.rajasthan.gov.in/pension/wf/v1.0/";
     //this.url="http://ifmstest.rajasthan.gov.in/pension/wf/v1.0/";
      ACTION =  (this.url) + ACTION;
      return this.http.post<any>(ACTION, data,{
       headers: this.headers,
          withCredentials: true 
     });
    }
  
  
    requestApplication2(data:any,ACTION:string)
    {
    //this.url="http://ifmstest.rajasthan.gov.in/pension/wf/v1.0/";
      ACTION =  (this.url) + ACTION;
      return this.http.post<any>(ACTION, data,{
       headers: this.headers,
          withCredentials: true 
     });
    }
  
  
    // requestApplication(url: any,data: any)
    // {
    //   alert("update life certificate service calling")
    //   url = url + data;
    //   return this.http.post<any>(url, data,{
    //    headers: this.headers,
    //       withCredentials: true 
    //  });
    // }
    // postIfms(endpoint: string, data: any): Observable<any> {
    //   return this.http.post<any>(this.oracalUrl + endpoint, data)
    //     .pipe(catchError(this.handleError));
    // }
    
    empServicese(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);    
      return this.http.post<any>(`${this.empUrl}${url}`, data, {headers: this.headers});
    }
    userInfo(): any {
      let token: any;
      const IsEss = sessionStorage.getItem('landtoken');
      token = IsEss === '0' ? sessionStorage.getItem('MpJwtToken') : sessionStorage.getItem('jwt_token');
      if (token !== null) {
        return this.config.getDecodedAccessToken(token);
      }
    }
  }
  