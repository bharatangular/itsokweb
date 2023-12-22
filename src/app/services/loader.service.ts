import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

 
@Injectable({
  providedIn: 'root'
})
export class LoaderService  {
  
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  show() {
     this.isLoading.next(true);
  }

  hide() {
       this.isLoading.next(false);
  }
}