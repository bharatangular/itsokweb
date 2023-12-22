import { Action } from 'rxjs/internal/scheduler/Action';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AppConfig } from '../app.config';

// const httpOptions = environment.httpOptions;


interface FileAttachement {
  file: string;
  employeeId:3385530;
  docTypeId:15;
}

@Injectable({
  providedIn: 'root'
})


export class PensionServiceService {
  private menuConfig = new BehaviorSubject({ url: 'Inbox' });
  redirectEsignUrl="";
  mainurl:any='';
  url="Inbox"
  BaseUrl: any;
  //employeeNewUrl:any;
  userActivated = new Subject;
  userActivated1 = new Subject;
  stringSubject = new Subject;
  headers = new HttpHeaders();
  docList:any[]=[];
  multiEsign:any;
currentDate:any='';
redirectMultiEsignUrl:any;
  constructor(private http: HttpClient, private _errService:ErrorService, private router:Router) {
    let purl:string=this.router['location']._platformLocation.location.origin;
    // console.log(purl);
    if(purl.includes("http://localhost") || purl.includes("http://ifmsdev.rajasthan.gov.in" ) || purl.includes("http://172.22.32.157:4200" ))
    {
      this.mainurl = "http://ifmsdev.rajasthan.gov.in/";
      // this.mainurl = "https://ifms.rajasthan.gov.in/";
      // this.mainurl = "https://ifmstest.rajasthan.gov.in/";
      this.multiEsign="http://172.22.36.201:8090/"+"esign/multi/"
      this.rvnlUrl = "http://172.22.36.239:8080/pensionExt/v1.0/pensionExt/"
      this.baseUrl8080 = this.mainurl+"pension/";
      this.baseUrl8080pension = this.mainurl+"pension/v1.0/"
      this.baseUrl8081 = this.mainurl+"employee/mst/v1.0/";
      this.baseUrl9010 = this.mainurl+"employee/mst/v1.0/";
      this.baseUrl8082=this.mainurl+"pension/wf/v1.0/";
      this.baseUrlToken8085=this.mainurl+"mp/";
      this.baseUrlToken=this.mainurl;
      this.baseUrlLoan = this.mainurl+"loanDetails/";
      this.baseUrlAdd=this.mainurl+"pension/";
      this.esignUrlNew=this.mainurl+"esign/"
      this.userRoleUrl=this.mainurl+"pension/wf/v1.0/";
      this.billUrl=this.mainurl+"pension/v1.0/";
      this.deduction=this.mainurl+"pension/v1.0/";
      this.hoapprover=this.mainurl+"pension/wf/v1.0/";
      this.baseUrl9010Pensioner=this.mainurl+"employee/mst/v1.0/";
      this.integrationUrl=this.mainurl+"integration/v1.0/";
      this.logoutUrl=this.mainurl+"ifmssso/";
      this.pssRequestUrl=this.mainurl+"pss/v1.0/pss/";
      // this.pssRequestUrl='http://172.22.36.214:8089/pss/v1.0/pss/'
      this.employeeUrl=this.mainurl+"employee/wf/v1.0/";
      this.employeeNewUrl=this.mainurl+"employee/mst/v2.0/";
      this.testurl=this.testurl+"pension/v1.0/"
      this.redirectEsignUrl="https://122.187.9.65:9006/esign/2.1/signdoc/"
      this.redirectMultiEsignUrl="https://122.187.9.65:9006/esign/3.2/signdocservice/"
      this.psnDetailView=this.mainurl+"pension/wf/v1.0/";
      this.getPsnUrl=this.getPsnUrl+"pss/v1.0/pss/";
      this.aprovedoc=this.mainurl+"pension/v1.0/";
      this.lmdmurl=this.mainurl+"employee/lmdm/v1.0/"
      this.mdmurl=this.mainurl+"employee/mdm/v1.0/"
      this.vpo=this.mainurl+"vbo/v1.0/vendor/"
      this.ifmshome=this.mainurl+"ifmshomesrvc/v1.0/sso/";
      //this.upcomingPsnRep =this.upcomingPsnRep+"employee/mst/v1.0/";

     // http://ifmstest.rajasthan.gov.in/pension/v1.0/getpensionenhancereport
      //http://172.22.36.214:808255555555
     // http://localhost:8082/pension/wf/v1.0/viewpensioner

    }
    else if(purl.includes("https://ifms.rajasthan.gov.in" )) {
    this.mainurl = "https://ifms.rajasthan.gov.in/";
    this.multiEsign=this.mainurl+"/multipleesign/esign1.0/"
    this.baseUrl8080 = this.mainurl+"pension/";
    this.rvnlUrl = this.mainurl+"pensionExt/v1.0/pensionExt/"
    this.ifmshome=this.mainurl+"ifmshomesrvc/v1.0/sso/";
      this.baseUrl8080pension = this.mainurl+"pension/v1.0/"
      this.baseUrl8081 = this.mainurl+"employee/mst/v1.0/";
      this.baseUrl9010 = this.mainurl+"employee/mst/v1.0/";
      this.baseUrl8082=this.mainurl+"pension/wf/v1.0/";
      this.baseUrlToken8085=this.mainurl+"mp/";
      this.baseUrlToken=this.mainurl;
      this.baseUrlLoan = this.mainurl+"loanDetails/";
      this.baseUrlAdd=this.mainurl+"pension/";
      this.esignUrlNew=this.mainurl+"esign/"
      this.userRoleUrl=this.mainurl+"pension/wf/v1.0/";
      this.billUrl=this.mainurl+"pension/v1.0/";
      this.deduction=this.mainurl+"pension/v1.0/";
      this.hoapprover=this.mainurl+"pension/wf/v1.0/";
      this.baseUrl9010Pensioner=this.mainurl+"employee/mst/v1.0/";
      this.integrationUrl=this.mainurl+"integration/v1.0/";
      this.logoutUrl=this.mainurl+"ifmssso/";
      this.pssRequestUrl=this.mainurl+"pss/v1.0/pss/";
      this.employeeUrl=this.mainurl+"employee/wf/v1.0/";
      this.employeeNewUrl=this.mainurl+"employee/mst/v2.0/";
      this.testurl=this.mainurl+"pension/v1.0/"
      this.redirectEsignUrl="https://esign.rajasthan.gov.in/esign/2.1/signdoc/"
      this.redirectMultiEsignUrl="https://esign.rajasthan.gov.in/esign/3.2/signdocservice/"
      this.psnDetailView=this.psnDetailView+"pension/wf/v1.0/";
      this.getPsnUrl=this.getPsnUrl+"pss/v1.0/pss/";
      this.aprovedoc=this.mainurl+"pension/v1.0/",
      this.lmdmurl=this.mainurl+"employee/lmdm/v1.0/"
      this.mdmurl=this.mainurl+"employee/mdm/v1.0/"
     // this.upcomingPsnRep =this.upcomingPsnRep+"employee/mst/v1.0/";
     // employee/mst/v1.0/getUpcomingPensionersList

      //testurl="http://172.22.36.214:9011/pension/v1.0/";
    }  else if(purl.includes("https://ifmstest.rajasthan.gov.in" )) {
      this.mainurl = "https://ifmstest.rajasthan.gov.in/";
      this.multiEsign=this.mainurl+"/multipleesign/esign1.0/"
      this.baseUrl8080 = this.mainurl+"pension/";
      this.rvnlUrl = this.mainurl+"pensionExt/v1.0/pensionExt/"
      this.ifmshome=this.mainurl+"ifmshomesrvc/v1.0/sso/";
        this.baseUrl8080pension = this.mainurl+"pension/v1.0/"
        this.baseUrl8081 = this.mainurl+"employee/mst/v1.0/";
        this.baseUrl9010 = this.mainurl+"employee/mst/v1.0/";
        this.baseUrl8082=this.mainurl+"pension/wf/v1.0/";
        this.baseUrlToken8085=this.mainurl+"mp/";
        this.baseUrlToken=this.mainurl;
        this.baseUrlLoan = this.mainurl+"loanDetails/";
        this.baseUrlAdd=this.mainurl+"pension/";
        this.esignUrlNew=this.mainurl+"esign/"
        this.userRoleUrl=this.mainurl+"pension/wf/v1.0/";
        this.billUrl=this.mainurl+"pension/v1.0/";
        this.deduction=this.mainurl+"pension/v1.0/";
        this.hoapprover=this.mainurl+"pension/wf/v1.0/";
        this.baseUrl9010Pensioner=this.mainurl+"employee/mst/v1.0/";
        this.integrationUrl=this.mainurl+"integration/v1.0/";
        this.logoutUrl=this.mainurl+"ifmssso/";
        this.pssRequestUrl=this.mainurl+"pss/v1.0/pss/";
        this.employeeUrl=this.mainurl+"employee/wf/v1.0/";
        this.employeeNewUrl=this.mainurl+"employee/mst/v2.0/";
        this.testurl=this.mainurl+"pension/v1.0/"
        this.redirectEsignUrl="https://122.187.9.65:9006/esign/2.1/signdoc/"
        this.redirectMultiEsignUrl="https://122.187.9.65:9006/esign/3.2/signdocservice/"
        this.psnDetailView=this.psnDetailView+"pension/wf/v1.0/";
        this.getPsnUrl=this.getPsnUrl+"pss/v1.0/pss/";
        this.aprovedoc=this.mainurl+"pension/v1.0/",
        this.lmdmurl=this.mainurl+"employee/lmdm/v1.0/"
        this.mdmurl=this.mainurl+"employee/mdm/v1.0/"
       // this.upcomingPsnRep =this.upcomingPsnRep+"employee/mst/v1.0/";
       // employee/mst/v1.0/getUpcomingPensionersList

        //testurl="http://172.22.36.214:9011/pension/v1.0/";
      }
  //  this.getCurrentDate()
  }
  
  set configMenu(value) {
    this.menuConfig.next(value);
  }

  get configMenu(): any | Observable<any> {
    return this.menuConfig.asObservable();
  }

  config:AppConfig=new AppConfig();
  httpOptions= {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'token':this.config.getDetails('token')!
    })
  }
//  baseUrlLocal = "http://localhost:8082/pension/wf/v1.0/";

 vpo="http://ifmstest.rajasthan.gov.in/vbo/v1.0/vendor/"
 baseUrl8080 = "http://ifmstest.rajasthan.gov.in/pension/";
 baseUrl8080pension = "http://ifmstest.rajasthan.gov.in/pension/v1.0/"
 baseUrl8081 = "http://ifmstest.rajasthan.gov.in/employee/mst/v1.0/";
 baseUrl9010 = "http://ifmstest.rajasthan.gov.in/employee/mst/v1.0/";
 baseUrl8082="http://ifmstest.rajasthan.gov.in/pension/wf/v1.0/";
 baseUrlToken8085="http://ifmstest.rajasthan.gov.in/mp/";
 baseUrlToken="http://ifmstest.rajasthan.gov.in/";
 baseUrlLoan = "http://ifmstest.rajasthan.gov.in/loanDetails/";
 baseUrlAdd="http://ifmstest.rajasthan.gov.in/pension/";
 esignUrlNew="http://ifmstest.rajasthan.gov.in/esign/"
 userRoleUrl="http://ifmstest.rajasthan.gov.in/pension/wf/v1.0/";
 billUrl="http://ifmstest.rajasthan.gov.in/pension/v1.0/";
// billUrl="172.22.36.214"
 deduction="http://ifmstest.rajasthan.gov.in/pension/v1.0/";
 hoapprover="http://ifmstest.rajasthan.gov.in/pension/wf/v1.0/";
 baseUrl9010Pensioner="http://ifmstest.rajasthan.gov.in/employee/mst/v1.0/";
 rvnlUrl = "http://172.22.36.239:8080/pensionExt/v1.0/pensionExt/"
 integrationUrl="http://ifmstest.rajasthan.gov.in/integration/v1.0/";
 logoutUrl="http://ifmstest.rajasthan.gov.in/ifmssso/";
lmdmurl="http://ifmstest.rajasthan.gov.in/employee/lmdm/v1.0/"
mdmurl="http://ifmstest.rajasthan.gov.in/employee/mdm/v1.0/"
 pssRequestUrl='http://ifmstest.rajasthan.gov.in/pss/v1.0/pss/';

 //deduction='http://localhost:9011/pension/v1.0/';
 ifmshome='http://ifmstest.rajasthan.gov.in/ifmshomesrvc/v1.0/sso';
 employeeUrl="http://ifmstest.rajasthan.gov.in/employee/wf/v1.0/";
 employeeNewUrl="http://ifmstest.rajasthan.gov.in/employee/mst/v2.0/";
 //psnDetailView="http://172.22.36.214:8082/";
 psnDetailView="http://ifmstest.rajasthan.gov.in/pension/wf/v1.0/";
 getPsnUrl="http://ifmstest.rajasthan.gov.in/";
 //upcomingPsnRep="http://ifmstest.rajasthan.gov.in/";
 //getPsnUrl="http://172.22.36.239:8089/";
 aprovedoc="http://ifmstest.rajasthan.gov.in/"+"pension/v1.0/"
 fileSize:any=2048;
//getDeduction
 testurl="http://ifmstest.rajasthan.gov.in/";
// psnDetailView="http://172.22.36.214:8082/";
 Url={
  "pensionerInfo":"getpensionerpersonaldetails",
  "getPsnKit":"wcc/getfiles",
  "getEmployeeDetails":"http://ifmstest.rajasthan.gov.in/employee/mst/v1.0/getEmployeeDetails",
  "pensionCalculatorService":"http://ifmstest.rajasthan.gov.in/employee/mst/v1.0/callPensionCalculationRuleEngine",
  "getabsentprocessrole":"getabsentprocessrole",
  "getppodetails":"getppodetails",
  "getpensiontype":"getpensiontype",
  "getemptybankandifsc":"getemptybankandifsc",
  "viewpensioner":"viewpensioner",
  "updatephotoid":"updatephotoid"

}
getCurrentDate()
{

  this.requestApplication({}, 'currentdate').subscribe({
    next: (res) => {


        this.currentDate=res.data;
        console.log("res" ,this.currentDate)
    },
    error: (err) => {
      let errorObj = {
        message: err.message,
        err: err,
        response: err
      }
    }
  })

}
userInfo(): any {
  let token: any;
  const IsEss = sessionStorage.getItem('landtoken');
  token = IsEss === '0' ? sessionStorage.getItem('MpJwtToken') : sessionStorage.getItem('jwt_token');
  if (token !== null) {
    return this.config.getDecodedAccessToken(token);
  }
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

  postEmployee(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.employeeUrl}${url}`, data, {
      headers: this.headers,
      withCredentials: true
    });
  }
  postEmployeeMDM(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.mdmurl}${url}`, data, {
      headers: this.headers,
      withCredentials: true
    });
  }
  getRefreshToken() {
    let url=this.mainurl+"'mp/getRefreshToken";
  let authToken:any = sessionStorage.getItem('MpJwtToken');
  if (!authToken) {
    authToken = sessionStorage.getItem('jwt_token');
  }
  const header:HttpHeaders = new HttpHeaders().append("token", authToken);
  const options:any = {
    headers: header,
  }
  return this.http.post(url, {}, options);
}
  postNewEmployee(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.employeeNewUrl}${url}`, data, {
      headers: this.headers,
      withCredentials: true
    });
  }
  directPost(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(url, data, {
      headers: this.headers,
      withCredentials: true
    });
  }
  postEmployeeLmdm(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.lmdmurl}${url}`, data, {
      headers: this.headers,
      withCredentials: true
    });
  }
  posthoReleive(url: any,data: any)
   {
     this.createAuthorizationHeader(this.headers);
       this.headers = new HttpHeaders().append("contentType", "text/xml");
       //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
       return this.http.post(`${this.aprovedoc}${url}`, data, {
         headers: this.headers,
         withCredentials: true
       });
   }
   postifmshome(url: any,data: any)
   {
     this.createAuthorizationHeader(this.headers);
       this.headers = new HttpHeaders().append("contentType", "text/xml");
       //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
       return this.http.post(`${this.ifmshome}${url}`, data, {
         headers: this.headers,
         withCredentials: true
       });
   }
   postVBO(url: any,data: any)
   {
     this.createAuthorizationHeader(this.headers);
       this.headers = new HttpHeaders().append("contentType", "text/xml");
       //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
       return this.http.post(`${this.vpo}${url}`, data, {
         headers: this.headers,
         withCredentials: true
       });
   }
  postPssRequest(data: any, ACTION: string)
  {
 ACTION = `${this.pssRequestUrl}` + ACTION;
      return this.http.post<any>(ACTION, data,{
        headers: this.headers,
          withCredentials: true
      }).pipe(
      catchError(this._errService.handleError)
      )
  }
  getPensionerDetail(data:any,ACTION:string)
  {
    ACTION = `${this.deduction}` + ACTION;
    return this.http.post<any>(ACTION, data,{
      headers: this.headers,
         withCredentials: true
    });
  }
  add_Reason(data:any,ACTION:string)
   {
     ACTION = `${this.deduction}` + ACTION;
     return this.http.post<any>(ACTION, data,{
      headers: this.headers,
         withCredentials: true
    });
   }

   getStopReasonList(ACTION:string){
    ACTION = `${this.deduction}` + ACTION;

    return this.http.post<any>(ACTION, this.httpOptions);
  }
   postho(url: any,data: any)
   {
     this.createAuthorizationHeader(this.headers);
       this.headers = new HttpHeaders().append("contentType", "text/xml");
       //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
       return this.http.post(`${this.hoapprover}${url}`, data, {
         headers: this.headers,
         withCredentials: true
       });
   }
   postOr(url: any,data: any)
   {
     this.createAuthorizationHeader(this.headers);
       this.headers = new HttpHeaders().append("contentType", "text/xml");
       //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
       return this.http.post(`${this.integrationUrl}${url}`, data, {
        headers: this.headers,
         withCredentials: true
       });
   }
  post(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    return this.http.post(`${this.userRoleUrl}${url}`, data, {
      headers: this.headers,
         withCredentials: true
    });
  }


  postPensionCalculate(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${url}`,data,{headers: this.headers});
  }

  postEmpBankData(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${this.testurl}${url}`,data,{headers: this.headers});
  }

  getPsnDetailsView(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${this.psnDetailView}${url}`,data,{headers: this.headers});
  }

  getPsnDetailsList(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${this.getPsnUrl}${url}`,data,{headers: this.headers});
  }

  getUpcomPsnReport(url: any,data: any): Observable<any> {

    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${this.billUrl}${url}`,data,{headers: this.headers});
  }


  getPensionReport(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${this.billUrl}${url}`,data,{headers: this.headers});
  }

// aa

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
  postMultiEsign(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.multiEsign}${url}`, data, {
      headers: this.headers,
      withCredentials: true ,
      responseType: "text",
    });
  }
  postRequestpensiondr(data: any, ACTION: string)
   {
    ACTION = `${this.baseUrl8080}` + ACTION;
    return this.http.post<any>(ACTION, data,{
      headers: this.headers,
         withCredentials: true
    }).pipe(
      catchError(this._errService.handleError)
    )
   }
  postdetype(data: any, ACTION: string)
   {
    ACTION = `${this.baseUrl8080pension}` + ACTION;
    return this.http.post<any>(ACTION, data,{
      headers: this.headers,
         withCredentials: true
    }).pipe(
      catchError(this._errService.handleError)
    )
   }
   postloantype(data: any, ACTION: string)
   {
    ACTION = `${this.baseUrl8080pension}` + ACTION;
    return this.http.post<any>(ACTION, data,{
      headers: this.headers,
         withCredentials: true
    }).pipe(
      catchError(this._errService.handleError)
    )
   }
  postdeduction(data: any, ACTION: string)
   {
    ACTION = `${this.deduction}` + ACTION;
    return this.http.post<any>(ACTION, data,{
      headers: this.headers,
         withCredentials: true
    }).pipe(
      catchError(this._errService.handleError)
    )
   }
   postdeduction1(url: any,data: any)
{
  this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.deduction}${url}`, data, {
      headers: this.headers,
      withCredentials: true
    });
}
postCumm(url: any,data: any)
{
  this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.baseUrl9010}${url}`, data, {
      headers: this.headers,
      withCredentials: true
    });
}
postSavebill(url: any,data: any)
{
  this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.billUrl}${url}`, data, {
      headers: this.headers,
      withCredentials: true
    });
}
  postRequestpension(data: any, ACTION: string)
   {
    ACTION = `${this.baseUrl9010}` + ACTION;
    return this.http.post<any>(ACTION, data).pipe(
      catchError(this._errService.handleError)
    )
   }
  postUpcomingpension(data: any, ACTION: string)
   {

    ACTION = `${this.baseUrl9010Pensioner}` + ACTION;
    return this.http.post<any>(ACTION, data,{
      headers: this.headers,
         withCredentials: true
    }).pipe(
      catchError(this._errService.handleError)
    )
   }

   postRvnlDetails(data: any,ACTION: string)
   {

    ACTION = `${this.rvnlUrl}` + ACTION;
    return this.http.post<any>(ACTION, data)
    .pipe(
      catchError(this._errService.handleError)
    )
   }

  //  postGetYearMonth(data: any) {
  //
  //   return this.http.post<any>("http://ifmstest.rajasthan.gov.in/employee/mst/v1.0/getYearMonth",data, {
  //     headers: this.headers,
  //        withCredentials: true
  //   })
  //  }


  postGetYearMonth(data: any) {

  const apiUrl = 'http://ifmstest.rajasthan.gov.in/employee/mst/v1.0/getYearMonth';
  return this.http.post<any>(apiUrl, data, {
    headers: this.headers,
    withCredentials: true
  });
}


   requestApplication(data:any,ACTION:string)
   {
     ACTION = `${this.baseUrl8082}` + ACTION;
     return this.http.post<any>(ACTION, data,{
      headers: this.headers,
         withCredentials: true
    });
   }

   saveUserManual(data:any,ACTION:string){
     ACTION = `${this.baseUrl8082}` + ACTION;
     return this.http.post<any>(ACTION,data,{
      headers:this.headers,
          withCredentials:true
     })
   }



   fetchUserType(data:any,ACTION:string){
    ACTION = `${this.baseUrl8082}` + ACTION;
    return this.http.post<any>(ACTION,data,{
     headers:this.headers,
         withCredentials:true
    })
   }

   downloadPDF(data:any,ACTION:string)
   {
     ACTION = `${this.baseUrl8081}` + ACTION;
     return this.http.post<any>(ACTION, data,{
      headers: this.headers,
         withCredentials: true
    });
   }


  postRequest(data: any, ACTION: string)
   {
    ACTION = `${this.baseUrlLoan}` + ACTION;
    return this.http.post<any>(ACTION, data,{
      headers: this.headers,
         withCredentials: true
    }).pipe(
      catchError(this._errService.handleError)
    )
   }


   postRequestAddress(data: any, ACTION: string)
   {
    ACTION = `${this.baseUrlAdd}` + ACTION;
    return this.http.post<any>(ACTION, data,{
      headers: this.headers,
         withCredentials: true
    }).pipe(
      catchError(this._errService.handleError)
    )
   }
  postRequestPensionSave(data: any, ACTION: string)
   {
    ACTION = `${this.baseUrl8081}` + ACTION;
    return this.http.post<any>(ACTION, data,{
      headers: this.headers,
         withCredentials: true
    }).pipe(
      catchError(this._errService.handleError)
    )
   }


   Token(data:any,ACTION:string)
   {
     ACTION = `${this.baseUrlToken}` + ACTION;
     return this.http.post<any>(ACTION, data,{
      headers: this.headers,
         withCredentials: true
    });
   }

   getWorkFlowId(data:any,ACTION:string)
   {
     ACTION = `${this.baseUrlToken}` + ACTION;
     return this.http.post<any>(ACTION, data, this.httpOptions);
   }

   getWorkFlowToken(data:any,ACTION:string){
     ACTION = `${this.baseUrlToken8085}` + ACTION;
     return this.http.post<any>(ACTION, data, this.httpOptions);
   }


serviceRecord():any{
  return this.config.getDetails("addEditServiceRecordslist")
}
saveRecord(data:any){
return this.http.post('http://localhost:3000/service',data);
}
getCartList(){
  return this.http.get<any>("http://localhost:3000/service/").pipe(map((res:any)=>{
    return res;
  }))
}

updateCartList(id:any,data:any){
  return this.http.put<any>(`http://localhost:3000/service/${id}`,data).pipe(map((res:any)=>{
    return res;
  }))


}


saveDocument(data:File,employeeId:any,docTypeId:any){
const formData=new FormData();


formData.append("file",data);
formData.append("employeeId",employeeId);
formData.append("docTypeId",docTypeId);
  return this.http.post<any>(this.baseUrl9010+'uploadFileInWcc',formData);

  }

  getDocument(){
    return this.http.get<any>("http://localhost:3000/Document/").pipe(map((res:any)=>{
      return res;
    }))
  }




  // Dashboard services
  // http://localhost:9010/employee/mst/v1.0/getYearMonth

  getYearMonth(url: any,data: any): Observable<any> {

    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${this.baseUrl9010}${url}`,data,{headers: this.headers}).pipe(
      catchError(this._errService.handleError)
    );
  }

  upcomingRetireMentDetailsByMonthWise(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${this.baseUrl9010}${url}`,data,{headers: this.headers}).pipe(
      catchError(this._errService.handleError)
    );
  }

  getDeptList(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${this.billUrl}${url}`,data,{headers: this.headers}).pipe(
      catchError(this._errService.handleError)
    );
  }

  getOfficeDetailsByDeptId(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${this.billUrl}${url}`,data,{headers: this.headers}).pipe(
      catchError(this._errService.handleError)
    );
  }

  countGpoCpoPpo(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${this.billUrl}${url}`,data,{headers: this.headers}).pipe(
      catchError(this._errService.handleError)
    );
  }

  getEmployeeDetailsForDashboard(url: any,data: any): Observable<any> {

    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${this.baseUrl9010}${url}`,data,{headers: this.headers}).pipe(
      catchError(this._errService.handleError)
    );
  }

  getStatusAtPensionZonalOffice(url: any,data: any): Observable<any> {

    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${this.baseUrl8080pension}${url}`,data,{headers: this.headers}).pipe(
      catchError(this._errService.handleError)
    );
  }

  postemploye(url: any,data: any): Observable<any> {

    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${this.baseUrl9010}${url}`,data,{headers: this.headers}).pipe(
      catchError(this._errService.handleError)
    );
  }
  postPension(url: any,data: any): Observable<any> {

    this.createAuthorizationHeader(this.headers);
    return this.http.post<any>(`${this.billUrl}${url}`,data,{headers: this.headers}).pipe(
      catchError(this._errService.handleError)
    );
  }

  postPensionSummary(url: any,data: any)
{
  this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.baseUrl8080pension}${url}`, data, {
      headers: this.headers,
      withCredentials: true
    });
}

postOfficeList(url: any,data: any): Observable<any> {
  this.createAuthorizationHeader(this.headers);
  return this.http.post<any>(`${this.billUrl}${url}`,data,{headers: this.headers}).pipe(
    catchError(this._errService.handleError)
  );

}

postPensionUserList(url: any,data: any): Observable<any> {

  this.createAuthorizationHeader(this.headers);
  return this.http.post<any>(`${this.billUrl}${url}`,data,{headers: this.headers}).pipe(
    catchError(this._errService.handleError)
  );
}

postPssLifeCertificate(url: any,data: any): Observable<any> {

  this.createAuthorizationHeader(this.headers);
  return this.http.post<any>(`${this.billUrl}${url}`,data,{headers: this.headers}).pipe(
    catchError(this._errService.handleError)
  );
}

}
