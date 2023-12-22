import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error);
  }

  post(url: string, data: any = {}, options: any = {}): Observable<any> {
    return this.http.post<any>(url, data, options)
      .pipe(catchError(this.handleError));
  }

  get(url: string, params: any = {}, headers: any = {}): Observable<any> {
    const options = {
      headers: new HttpHeaders(headers),
      params: params
    };
    return this.http.get<any>(url, options)
      .pipe(catchError(this.handleError));
  }
}
