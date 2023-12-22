
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import moment from 'moment';
import { Subject } from 'rxjs';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { debounceTime, of, startWith, switchMap } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DashboardService } from 'src/app/services/dashboard.service';
 
import { AppConfig } from 'src/app/app.config';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-familydetail-request-list',
  templateUrl: './familydetail-request-list.component.html',
  styleUrls: ['./familydetail-request-list.component.scss']
  //changeDetection: ChangeDetectionStrategy.Default
})

export class FamilydetailRequestListComponent implements OnInit {
 
  config1=new AppConfig();
  familyDetails: any;
  EmployeeFamilyDetails: any = { familyDetails: [], nomineeDetails: [] }
  EmployeeAlternateyDetails: any = { alternateNominee: [] }
  
  index: number = 0;
  datePipe: any;
  date: Date;
  alternateSchemeList: Array<any> = [];
  FamilyRelationAlllist: Array<any> = [];
  pensionerDtls:any;
  familyDetailsData:any;
  action = ''; 
  userDetails:any;


  constructor(private formbuilder: FormBuilder,public api:PensionServiceService, private snackbar: SnackbarService, private dashboardService:DashboardService,
    private router: Router) 
   { this.date = new Date(); }
  

  ngOnInit(): void {
    this.userDetails = this.config1.getUserDetails();
    console.log("Abe ja na user deatials leke aa, bhag ke jaa", this.userDetails)
    // this.pensionerDtls= this.api.getPensionerDtls;  
    this.getfamilydetailsnew();
  }


  // Get Family List  //
getfamilydetailsnew(){    
  var url = 'getfamilydtlspensionerwise';
  var data = {    
    "officeId": 9060,     
    //"officeId": this.userDetails.officeid,     
  };
  console.log ("officeId>>>>----",this.userDetails.officeid)
  this.api.postPssRequest(data,url).subscribe((res: any) => {
    console.log("result>>>", res);
    this.EmployeeFamilyDetails.familyDetails=res.data;
        console.log("Family details ka Data Lao londee >>>>", this.familyDetails)    
      })  
    }  
  // Get Family List //  End   //

    // View Details Used By Psn_ID  Satart // 
    View = (index: number) => {
      this.index = index;        
      const data = this.EmployeeFamilyDetails.familyDetails[index];
      console.log("asda",data)      
    }
     // View Details Used By Psn_ID  //  End  // 

     /// get Family dtls click New page //  Start // 
    getfamilydtlpsnId(row: any){

      this.router.navigate(['/pension/pss/family-update'],
      {
        queryParams: {
          pensionerid: row.pensionerId
        }
      })
     }
     /// get Family dtls click New page //  End  // 

}












