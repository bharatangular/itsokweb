import { Component, OnInit } from '@angular/core';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-trans-data-emp-pension',
  templateUrl: './trans-data-emp-pension.component.html',
  styleUrls: ['./trans-data-emp-pension.component.scss']
})
export class TransDataEmpPensionComponent implements OnInit {

  constructor(public _Service:PensionServiceService) { }
  count:any=0;
  ngOnInit(): void {
  }
  TransferData2()
  {
    this._Service.getPensionerDetail({},"updatePsnDataReport").subscribe((res:any)=>{
      console.log("res",res);
   this.count=1;
      if(res.data)
      {
        this._Service.postCumm("updateEmpReport",{}).subscribe((res:any)=>{
          console.log("res",res);
          this.count=2;
          this.TransferData();
        })
      }
    })
  }
  TransferData()
  {
    this._Service.postCumm("getEmpDataForDashBoard",{}).subscribe((res:any)=>{
      console.log("res",res);
      this.count=3;
      if(res.data)
      {
        this._Service.getPensionerDetail(res.data,"InsertEmpDataForDashBoard").subscribe((res:any)=>{
          console.log("res",res);
          alert(res.data[0].Message);
        })
      }
    })
  }
}
