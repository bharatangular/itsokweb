import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pension-initiated',
  templateUrl: './pension-initiated.component.html',
  styleUrls: ['./pension-initiated.component.scss']
})
export class PensionInitiatedComponent implements OnInit {
  employeeCode :any
  officecode:any;
  raidobutton:any = 0;
  constructor() { }

  ngOnInit(): void {
  }

  serachEmployee(){
    let data = {
      
    }

  }
  changeOffice(){
    let data = {
      
    }
  }
  getOfficeName(){
    let data = {
      
    }
  }
}
