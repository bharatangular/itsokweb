import { Component, OnInit, Output,EventEmitter, Input  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import {Observable,of,from} from 'rxjs';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  // pensionMonth            : any    = new Date().getMonth() +1;
  pensionMonth            : any    = "0";
  psnMonthYearList        : any =[];
  // pensionYear             : any = new Date().getFullYear();
  pensionYear             : any = "0";
  psnYearList             : any;
  psnMonthList             : any;
  myControl               = new FormControl("");
  offcmyControl         = new FormControl("");
  $filterdOfficelist      !: Observable<any>;
  departmentList           :any; 
  officeList              :any;
  filteredOptions         !: any;
  zoneList                :any;
  zoneselection           :any = 0;
  @Output() dataParmsFilter  = new EventEmitter<any>();
  @Output("filterDash") filterDash: EventEmitter<any> = new EventEmitter();
  @Input() isNavigateFromDashbord: boolean = false;
  @Input() filtersData: any = {};
  @Input() hideSomeFilter: boolean;
  @Input() pageName: string;

  deptData: any = [];
  getOfficeDeptListNew: any = [];
  constructor(private dashboardService : PensionServiceService) { }

  ngOnInit(): void {

    // if(this.pageName == 'upcomingPensions'){
    //   this.pensionMonth = (new Date().getMonth() +1).toString();
    //   this.pensionYear  = (new Date().getFullYear()).toString();
    // }
    
    this.getMonthYear()
    this.getDeptList()
    this.getZoneAndOffice()

    // this.getDeptList()
    // this.getZoneAndOffice()
    // this.getOfficeDetailsByDeptId()

    // this.dataParmsFilter.emit({month:this.pensionMonth, year:this.pensionYear})
  }




    /**
   * This method used for get month and year
   */
    getMonthYear(){
      this.dashboardService.getYearMonth('getYearMonth',{}).subscribe({
        next:(res:any)=>{
          if(res.status == 'SUCCESS'){

             this.psnMonthYearList = res.data;
              //console.log(this.psnMonthYearList)
             // const filteredArray = this.psnMonthYearList.filter((item:any) => item.psnYear === 2034);
              //console.log(filteredArray)

                this.psnYearList = [...new Map(this.psnMonthYearList.map((item:any) => [item['psnYear'], item])).values()];
                this.psnYearList.sort((a:any, b:any) => a.psnYear - b.psnYear);

                this.psnMonthList = this.psnMonthYearList.filter((item:any) => item.psnYear === this.pensionYear);


                if(this.isNavigateFromDashbord) {
                  // this.pensionMonth = Number(this.filtersData.month);
                  // this.pensionYear = Number(this.filtersData.year);
                  this.pensionMonth = (this.filtersData.month).toString();
                  this.pensionYear = (this.filtersData.year).toString();
                  this.psnMonthList = this.psnMonthYearList.filter((item:any) => item.psnYear === this.pensionYear);
                  this.zoneselection = Number(this.filtersData.selectedZone);
                  const departmentObj = {v_dept_name: this.filtersData.deptName, v_DEPT_ID: this.filtersData.deptId }
                  const officeObj = {officName: this.filtersData.officeName, officeId: this.filtersData.officeId}
                  // const displayFnValue = this.displayFn(departmentObj)
                  this.myControl.setValue(departmentObj);
                  // const displayofFnValue = this.displayofFn(officeObj);
                  this.offcmyControl.setValue(officeObj);
               
                }
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
      
    }
  


    getOfficeDetailsByDeptId(event?: Event){
      // this.dataParms.emit({dept_id:this.myControl.value.v_DEPT_ID, offc_id:this.offcmyControl.value.v_OFC_ID})
    //   let payload = {
    //     "deptId": this.myControl.value.v_DEPT_ID
    // }

    if(this.pageName != 'pensionUserList'){
      let payload = {
        
        "deptId":this.myControl?.value?.v_DEPT_ID ? this.myControl?.value?.v_DEPT_ID : 0,
        "zoneId": this.zoneselection ? this.zoneselection : "0"
    
    
        }
        // this.dashboardService.getOfficeDetailsByDeptId('getOfficeDetailsByDeptId',payload).subscribe({
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
    else{

      let payload = {
        "flag":1,
        "deptId":this.myControl?.value?.v_DEPT_ID ? this.myControl?.value?.v_DEPT_ID : 0,
      }
      this.dashboardService.getOfficeDetailsByDeptId('getOfficeDeptList',payload).subscribe({
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
      
    }

    
  
    getDeptList(){
      
      if(this.pageName !== 'pensionUserList'){
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
              // this.getZoneAndOffice();
    
          },
          error:(err:any)=>{
    
          },
          complete: ()=>{
            // 
          }
        })
      }
      else{
        let payload = {
          "flag":2,
          "deptId":0
      }
      
        this.dashboardService.postOfficeList('getOfficeDeptList',payload).subscribe({
          next:(res:any)=>{
            
            this.deptData = res.data;
           //console.log(this.deptData);
            let obj:any ={};
            //getOfficeDeptListNew
            this.getOfficeDeptListNew = this.deptData.map((item:any) => ({
              "v_DEPT_ID": item.deptId,
              "v_dept_name": item.deptName
            }))
            

            console.log(this.getOfficeDeptListNew);
           
            this.filteredOptions = this.myControl.valueChanges
             .pipe(
               startWith(""),
               map(value => (value ? this._filter(value) : this.getOfficeDeptListNew))
               );
            
          },
          error:(err:any)=>{
            //this.loader.hide()
          },
          complete: ()=>{
            //this.loader.hide()
          }
        })
      }
      
    }

    checkDeptIsExist(dept:any){
      if(dept.value == ''){
        this.$filterdOfficelist = from<any>([]);
      }
    }

    
    private _filter(value: any) {
      

      // alert(isNaN(value))
     if(isNaN(value)) 
      return this.departmentList && this.departmentList.filter((option:any) => option.v_dept_name.toLowerCase().includes(value ));
      else {
        return this.departmentList && this.departmentList.filter((option: any) => {
          const deptId = option?.v_DEPT_ID.toString(); // Convert to string
          return deptId.toLowerCase().includes(value);
        });
      }
    }
    private _filteroffc(value: any) {
      if(isNaN(value)) 
      return this.officeList && this.officeList.filter((option:any) => option.officName.toLowerCase().includes(value  ));
      else {
        // return this.officeList && this.officeList.filter((option:any) => option.offcId == value );
        return this.officeList && this.officeList.filter((option:any) => {
          
          const officID = option?.offcId.toString(); // Convert to string
          
        return  officID?.toLowerCase().includes(value )
        
        });
        }
    }

    
    // filterEmploye(){
    //   this.filterEmplist = this.employeeList.filter((item:any)=>{
    //     this.offcmyControl.value.v_ofc_name == item.ofcName
    //   })
    
    // }
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
       
        if(this.pageName != "pensionUserList"){
          // if(this.offcmyControl?.value?.offcId){
          //   this.dataParmsFilter.emit({month:this.pensionMonth, year:this.pensionYear, zone : this.offcmyControl.value.offcId,officeID : true,departmentControl: this.myControl.value, isDate:isDate})
          // } else {
          //   this.dataParmsFilter.emit({month:this.pensionMonth, year:this.pensionYear, zone : this.zoneselection,departmentControl: this.myControl.value, isDate:isDate})
          // }
          if(this.offcmyControl?.value?.offcId){
            this.dataParmsFilter.emit({month:this.pensionMonth, year:this.pensionYear, zone : this.offcmyControl.value.offcId, selectedZone:  this.zoneselection, officeID : true, psnMonthYearList: this.psnMonthYearList, departmentControl: this.myControl.value, officeControl: this.offcmyControl.value, isDate:isDate })
          } else {
            this.dataParmsFilter.emit({month:this.pensionMonth, year:this.pensionYear, zone : this.zoneselection, selectedZone:  this.zoneselection, psnMonthYearList: this.psnMonthYearList, departmentControl: this.myControl.value, officeControl: this.offcmyControl.value, isDate:isDate })
          }
        }
        else{
          this.dataParmsFilter.emit({month:null, year:null, zone : null,departmentControl: this.myControl.value, officeControl: this.offcmyControl.value})
        }
      }


      // onSubmitFilter(){
      //   if(this.offcmyControl?.value?.offcId){
      //     this.dataParmsFilter.emit({month:this.pensionMonth, year:this.pensionYear, zone : this.offcmyControl.value.offcId, selectedZone:  this.zoneselection, officeID : true, psnMonthYearList: this.psnMonthYearList, departmentControl: this.myControl.value, officeControl: this.offcmyControl.value })
      //   } else {
          
      //     this.dataParmsFilter.emit({month:this.pensionMonth, year:this.pensionYear, zone : this.zoneselection, selectedZone:  this.zoneselection, psnMonthYearList: this.psnMonthYearList, departmentControl: this.myControl.value, officeControl: this.offcmyControl.value })
      //   }
      //   }
      onSubmitReset(){


        if(this.pageName == "pensionUserList"){

          this.offcmyControl.reset()
          this.myControl.reset()
          this.filterDash.emit({month:null, year:null, zone : null,departmentControl: 0, officeControl: 0});

        }
        // else if(this.pageName == "upcomingPensions"){

        //   this.offcmyControl.reset()
        //   this.myControl.reset()
        //   this.$filterdOfficelist =from<any>([]);
        //   this.zoneselection = 0;
        //   this.pensionMonth =  (new Date().getMonth() +1).toString();
        //   this.pensionYear  =  (new Date().getFullYear()).toString();
        //   this.psnMonthList = this.psnMonthYearList.filter((item:any) => item.psnYear === this.pensionYear);
        //   this.filterDash.emit({month:this.pensionMonth, year:this.pensionYear, zone : this.zoneselection,   departmentControl: this.myControl.value, isDate:1});

        // }
        else{

          this.offcmyControl.reset()
          this.myControl.reset()
          this.$filterdOfficelist =from<any>([]);
          this.zoneselection = 0;
          this.pensionMonth =  "0";
          this.pensionYear  =  "0";
          this.psnMonthList = [];
          this.filterDash.emit({month:this.pensionMonth, year:this.pensionYear, zone : this.zoneselection,   departmentControl: this.myControl.value, isDate:0});

        }

      
        }
}
