import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor() {

  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    //  const authToken:any= sessionStorage.getItem('MpJwtToken');
    const authToken:any= 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaWZtc3Rlc3QucmFqYXN0aGFuLmdvdi5pbiIsImF1ZCI6InRhcmdldFNlcnZpY2UiLCJqdGkiOiJiZjRmMGVlNC05MTFkLTQ3NGQtYjMyYS0yY2QzOTE4NzVjOWQiLCJleHAiOjE3MDI2MjEyNjQsImlhdCI6MTcwMjYyMDA2NCwic3ViIjoiSUZNU1RFU1QiLCJ1cG4iOiJJRk1TVEVTVCIsInByZWZlcnJlZF91c2VybmFtZSI6IklGTVMgVE9LRU4iLCJzc29JZCI6IlBSQVZFSy5WQU5TV0FSIiwibGV2ZWxWYWx1ZUlkIjpudWxsLCJkaXNwbGF5TmFtZSI6IlBSQVZFSyBWQU5TV0FSIChJTikiLCJyb2xlSWQiOiI0OCIsImxldmVsSWQiOiIyIiwicm9sZU5hbWUiOiJIb0QiLCJlbXBsb3llZUlkIjoiUkpKUDIwMjIwMDAwMDAxMCIsImxldmVsTmFtZSI6IkRlcHQiLCJsZXZlbFZhbHVlQ29kZSI6IjEwOTAiLCJ1c2VySWQiOiI1OTg2NiIsImFpZCI6Ijk2Nzk1IiwidHJlYXNDb2RlIjoiMjEwMCIsImdyb3VwcyI6W119.NxqYF31_PMQp9kyk8ul_rSMcr7hZn7xmjjtWlkSMNeOm3Z4SgVd8zREFgFJKzcXFhhufB-XaYNGgk4T8W32PPzrraEeyj8tpLZczFczQNijTo-n136T9_knsDHTNYIx51E9eBj7BP8psXTXUAaG3lM1vEIbkCnKV10mSt2uosAawZ2X7mEIs8BgRsJjNejFi66z75XkXazVDSOGKAZShbDE-FweATK8BxX7Bi1us1wq3BK3DoFOT5dyINMFUDCYff-Wl2ShzNPSTjpQQr2c7HP70BKmDBUk3VupHR47nLV6RLNGpyeb2fkcDIzSE7g_vRStG1ASkjFheSaHe2Ry-qw';
  
    //console.log("myToken",authToken.replace(/^["'](.+(?=["']$))["']$/, '$1'));

        const modifiedReq = request.clone({
          // params: new HttpParams().set("auth", authToken)
          // setHeaders: {Authorization: `Bearer ${authToken.replace(/^["'](.+(?=["']$))["']$/, '$1')}`}
         
          // setHeaders: { "auth": authToken }          

        });
        //console.log("modified request", modifiedReq);
          return next.handle(modifiedReq);
          // return next.handle(request);
  }
}

