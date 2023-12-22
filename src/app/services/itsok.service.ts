import { Action } from 'rxjs/internal/scheduler/Action';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AppConfig } from '../app.config';


@Injectable({
  providedIn: 'root'
})
export class ItsokService {
  private menuConfig = new BehaviorSubject({ url: 'Inbox' });
  config:AppConfig=new AppConfig();
  headers = new HttpHeaders();
  mainUrl:any="http://127.0.0.1:8090/api/";
  imageUrl:any="E:/itsok/file_structure/"
  constructor(private http: HttpClient, private _errService:ErrorService, private router:Router) { }
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
  postisok(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.mainUrl}${url}`, data, {
      headers: this.headers,
      withCredentials: true
    });
  }
}
