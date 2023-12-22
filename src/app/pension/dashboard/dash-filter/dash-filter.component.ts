import { Component, OnInit, Output,EventEmitter  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import {Observable,of,from} from 'rxjs';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';
@Component({
  selector: 'app-dash-filter',
  templateUrl: './dash-filter.component.html',
  styleUrls: ['./dash-filter.component.scss']
})
export class DashFilterComponent implements OnInit {
  pensionMonth            : any    = (new Date().getMonth() +1).toString();
  //pensionMonth            : any    = "0";
  psnMonthYearList        : any =[];
  pensionYear             : any = (new Date().getFullYear()).toString();
  //pensionYear             : any = "0";
  psnYearList             : any;
  psnMonthList            : any;
  myControl               = new FormControl("");
  offcmyControl           = new FormControl("");
  $filterdOfficelist      !: Observable<any>;
  departmentList           :any;
  officeList              :any;
  filteredOptions         !: any;
  zoneList                :any;
  zoneselection           :any = 0;
  @Output() dataParmsFilter  = new EventEmitter<any>();
  @Output("filterDash") filterDash: EventEmitter<any> = new EventEmitter();
  @Output() getmonthyearData : EventEmitter<any>  = new EventEmitter<any>();
  constructor(private dashboardService : PensionServiceService) { 
    // this.userdetails=this.config.getUserDetails();
  }

  ngOnInit(): void {
    this.getMonthYear()
    this.getDeptList()
    this.getZoneAndOffice()
  }
  
  
  
  
  /**
   * This method used for get month and year
  */
 getMonthYear(){
   this.dashboardService.getYearMonth('getYearMonth',{}).subscribe({
     next:(res:any)=>{
       if(res.status == 'SUCCESS'){
         this.psnMonthYearList = res.data;

          this.pensionYear =  this.pensionYear.toString();
          this.psnYearList = [...new Map(this.psnMonthYearList.map((item:any) => [item['psnYear'], item])).values()];
          this.psnYearList.sort((a:any, b:any) => a.psnYear - b.psnYear);

          this.pensionMonth = this.pensionMonth.toString();
          this.psnMonthList = this.psnMonthYearList.filter((item:any) => item.psnYear == this.pensionYear);

          this.getmonthyearData.emit({monthlist: this.psnMonthYearList})
          }
          
         

        },
        error:(err:any)=>{
  
        },
        complete: ()=>{
          
        }
      })
    }

    getMonthFromYear(event: any){
      if(event != 0){
        this.psnMonthList = this.psnMonthYearList.filter((item:any) => item.psnYear === event);
      }
      else{
        this.psnMonthList = [];
      }
      this.pensionMonth = "0";

      // this.psnMonthList = this.psnMonthYearList.filter((item:any) => item.psnYear === event);
      // this.pensionMonth = this.psnMonthList[0].psnMonthNumber;
      
    }
  



    getOfficeDetailsByDeptId(event?: Event){
      let payload = {
        
          "deptId":this.myControl?.value?.v_DEPT_ID ? this.myControl?.value?.v_DEPT_ID : 0,
          "zoneId": this.zoneselection ? this.zoneselection : "0"
      }

        this.dashboardService.getOfficeDetailsByDeptId('getOfficeListByDeptAndZoneId',payload).subscribe({
        next:(res:any)=>{       
          this.officeList = res?.data
          this.$filterdOfficelist = this.offcmyControl.valueChanges
           .pipe(
           startWith(""),
           map(value => (value ? this._filteroffc(value) : this.officeList))
       
      );
        },
        error:(err:any)=>{
  
        },
        complete: ()=>{
          
        }
      })
    }
  


    getDeptList(){

      this.dashboardService.getDeptList('getDeptList',{}).subscribe({
        next:(res:any)=>{
          if(res && res.status == 'SUCCESS'){
           this.departmentList = res.data 
  
          this.filteredOptions = this.myControl.valueChanges
          .pipe(
           startWith(""),
           map(value => (value ? this._filter(value) : this.departmentList))
       
      );
          }
  
        },
        error:(err:any)=>{
  
        },
        complete: ()=>{
          // 
        }
      })
    }

    
    private _filter(value: any) {      
     if(isNaN(value)) 
      return this.departmentList && this.departmentList.filter((option:any) => option.v_dept_name.toLowerCase().includes(value ));
      else {
      // return this.departmentList && this.departmentList.filter((option:any) => option.v_DEPT_ID == value );
      // return this.departmentList && this.departmentList.filter((option:any) => option.v_DEPT_ID.toLowerCase().includes(value ));
        //  return this.departmentList && this.departmentList.filter((option: any) => option.v_DEPT_ID.toLowerCase().includes(value));
        return this.departmentList && this.departmentList.filter((option: any) => {
          const deptId = option.v_DEPT_ID.toString(); // Convert to string
          return deptId.toLowerCase().includes(value);
        });
      }
    }
    private _filteroffc(value: any) {
      
      if(isNaN(value)) 
      return this.officeList && this.officeList.filter((option:any) => option.officName.toLowerCase().includes(value  ));
      else {
       
        return this.officeList && this.officeList.filter((option:any) => {
         
          const officID = option.offcId.toString(); // Convert to string
          
        return  officID.toLowerCase().includes(value )
        
        });
        }
    }
  


    displayFn(departmanet :any){
      return departmanet ? departmanet.v_dept_name : "";
     }
     displayofFn(offc :any){
       return offc ? offc.officName : "";
      }

      getZoneAndOffice(){
        this.dashboardService.postPension('getZoneAndOffice',{}).subscribe({
          next:(res:any)=>{
            if(res.status == 'SUCCESS'){  
              this.zoneList = res.data
              
            }
    
          },
          error:(err:any)=>{
                    
          },
          complete: ()=>{
            
          }
        })
      }



      onSubmitFilter(){
        

        if((this.pensionMonth == "0" && this.pensionYear != "0") || (this.pensionMonth != "0" && this.pensionYear == "0")){
          if(this.pensionMonth == "0" && this.pensionYear != "0"){
            //alert("Please select month or select all year")
            this.func_ataParmsFilter(2);
          }
          if(this.pensionMonth != "0" && this.pensionYear == "0"){
            alert("Please select year or select all month")
          }
        }
        else if (this.pensionMonth == "0" && this.pensionYear == "0"){
          this.func_ataParmsFilter(0);
        }
        else{
          this.func_ataParmsFilter(1);
        }
      
      }

      func_ataParmsFilter(isDate:any){
        if(this.offcmyControl?.value?.offcId){
          this.dataParmsFilter.emit({month:this.pensionMonth, year:this.pensionYear, zone : this.offcmyControl.value.offcId, selectedZone:  this.zoneselection, officeID : true, psnMonthYearList: this.psnMonthYearList, departmentControl: this.myControl.value, officeControl: this.offcmyControl.value, isDate:isDate })
        } else {
          this.dataParmsFilter.emit({month:this.pensionMonth, year:this.pensionYear, zone : this.zoneselection, selectedZone:  this.zoneselection, psnMonthYearList: this.psnMonthYearList, departmentControl: this.myControl.value, officeControl: this.offcmyControl.value, isDate:isDate })
        }
      }

      onSubmitReset(){
        
          this.offcmyControl.reset()
          this.myControl.reset()
          this.$filterdOfficelist =from<any>([]);
          this.zoneselection = 0
          this.pensionMonth =  "0";
          this.pensionYear  =  "0";
          //this.psnMonthList = this.psnMonthYearList.filter((item:any) => item.psnYear === this.pensionYear);
          this.dataParmsFilter.emit({month:this.pensionMonth, year:this.pensionYear, zone : this.zoneselection, selectedZone:  this.zoneselection, psnMonthYearList: this.psnMonthYearList, departmentControl: this.myControl.value, officeControl: this.offcmyControl.value, isDate:0 });
      }
}
