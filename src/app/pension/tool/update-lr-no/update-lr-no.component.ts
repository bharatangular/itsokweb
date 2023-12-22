import { Component, OnInit } from '@angular/core';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-update-lr-no',
  templateUrl: './update-lr-no.component.html',
  styleUrls: ['./update-lr-no.component.scss']
})
export class UpdateLrNoComponent implements OnInit {
  EmpCode:any;
  TreasuryCode:any;
  constructor(public _Service:PensionServiceService) { }

  ngOnInit(): void {
  }
  personalDetail:any;
  getEmployeeData = () => {
if(this.EmpCode && this.TreasuryCode)
{
  this._Service.postNewEmployee('getEmployeeDetailsByType', {
    employeeId: this.EmpCode, inType: 1
  }).subscribe((res:any)=>{
           const data = res.data;
          this.personalDetail = data.employeePersonalDetail;
               this.getLRnumber();    
  });
}else
{
  alert("Fill all details.")
}
 
  }
  lRnumber: any = '';
  getLRnumber() {
    let data={
      "inTreasCode":this.TreasuryCode,
      "inEmpId":this.personalDetail.employeeId,
      "inRevised":"0"
    }
    this._Service.post("getlrnumber", data).subscribe((res: any) => {

      console.log("result", res);
      if (res.status == 'SUCCESS') {
        this.lRnumber = res.data;
this.updateLrNo();
      }else
      {
        alert("LR Number not generated.refresh page.")
      }
    })
  }
  updateLrNo()
  {
    let sendata={	 
      "inMstType": 2,
      "requestData": [
    {
              "employeeId": -1,
              "employeeCode":this.EmpCode,
              "lrNumver": this.lRnumber
    }
] 
}

this._Service.getPensionerDetail(sendata,"workMultiTask").subscribe((res:any)=>{

},(error)=>{
alert("update LR service not work.")
})
  }
}
