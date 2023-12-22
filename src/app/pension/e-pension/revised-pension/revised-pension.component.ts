import { Component, OnInit } from '@angular/core';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-revised-pension',
  templateUrl: './revised-pension.component.html',
  styleUrls: ['./revised-pension.component.scss'],
})
export class RevisedPensionComponent implements OnInit {
  ppoNo:any;
  empCode:any;
  pensionerId:any;
  constructor(public _Service:PensionServiceService) { }

  ngOnInit(): void {
    this._Service.url="Revise Pension";
   
  }
  filterData(){
    
   }
   applyFilter1(filterValue: string) {
   
  }
}
