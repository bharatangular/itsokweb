import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { AppConfig } from 'src/app/app.config';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-process-task-config',
  templateUrl: './process-task-config.component.html',
  styleUrls: ['./process-task-config.component.scss']
})
export class ProcessTaskConfigComponent implements OnInit {

  displayedColumns: string[] = ['processName', 'processId', 'levelType', 'processLevelId', 'rolesName', 'taskRoleId', 'expiryDay', 'processSeq', 'effStartDate', 'isActive', 'esign', 'Action'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  userDetails: any = {};

  processTaskConfigForm: FormGroup;
  myControl: any = new FormControl('');
  form: FormGroup;
  config: AppConfig = new AppConfig();

  apidata2: any[] = [];
  processData: any[] = [];
  levelData: any[] = [];
  rolesData: any[] = [];
  webData:any[] = [];
  one: number = 1;
  zero: number = 0;
  isDisabled: boolean = false;
  updateProcessIs = ''
  updateprocessTaskId = ''
  taskroleId:any = ''
  disableButton: boolean = false;

 arr3:any[] = [];
  

//   webData = [
//     {
//      "actionId": "1",         "actionName": "INITIATE", "actionCode": "CRE"
//     },     
//     {
//     "actionId": "3",         "actionName": "FORWARD", "actionCode": "FWD"
//     },    
//  {
// "actionId": "4",         "actionName": "REJECT", "actionCode": "REJ"
// },     
// {
// "actionId": "5",         "actionName": "REVERT", "actionCode": "REV"
// },   
// {
// "actionId": "6", "actionName": "APPROVE", "actionCode": "ARV"
// }, 
// {
// "actionId": "7", "actionName": "APPROVE-COMPLETE", "actionCode": "CMP"
// }, 
// {
// "actionId": "8", "actionName": "PULLBACK", "actionCode": "PBK"
// },
//  {
// "actionId": "9", "actionName": "DRAFT", "actionCode": "DFT"
// }
//   ];


  constructor(private fb: FormBuilder, private api: ApiEssService, private load: LoaderService, private snackbar: SnackbarService,) {

  }

  ngOnInit(): void {

    this.userDetails = this.config.getUserDetails();
    console.log(this.userDetails)

    let assignmentId
    assignmentId = this.userDetails.assignmentid

    this.processTaskConfigForm = this.fb.group({
      processName: ['', Validators.required],
      levelType: ['', Validators.required],
      rolesName: ['', Validators.required],
      processSeq: ['', Validators.required],
      expiryDay: ['', Validators.required],
      effStartDate: new FormControl({ value: "", disabled: false }, [
        Validators.required]),
      isActive: [{ value: '1', disabled: false }],
      esign: [{ value: '1', disabled: false }],
      deType: new FormControl({ value: "", disabled: false }, [
      ]),
      // actions: new FormArray([])

    });

    this.initialApi();
    this.processNameAndId();
    this.rolesNameandId();
    // this.checkBoxListData();
    
   

  }



  // ...........................  For Number Pattern or Integer Input field only ................................

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    // console.log(charCode);
    // if(charCode !==47 &&  charCode !==45){
    // if(charCode !==47 ){
      if (charCode > 31 && (charCode < 48 || charCode > 57 )) {
        return false;
      }
    // }

    // if(event.target.value > 10){
    //   return false;
    // }
   
    return true;
  }


  // var regex = new RegExp("^[a-zA-Z0-9 ]+$");
  // var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  // if (regex.test(str)) {
  //     return true;
  // }

  validate(event: any){
   let value:any= this.processTaskConfigForm.controls['expiryDay'].value
    if(value.length >2 ){
      event.preventDefault()
      this.processTaskConfigForm.controls['expiryDay'].setValue(value.slice(0 ,value.length-1))
    }
   
  }

  numberOnlyZerotoNintyNine(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    // console.log(charCode);
    // if(charCode !==47 &&  charCode !==45){
    // if(charCode !==47 ){
      if (charCode > 31 && (charCode < 48 || charCode > 57 )) {
        return false;
      }
    // }

    if(event.target.value >= 100 ){
      event.preventDefault()
      return false;
    }
   
    return true;
  }

  // ............................................................................................................


  processid = 0

  initialProcess() {
    // call api
    let response = 1
    this.processid = response
  }


  dcRadio(rbNo: string) {
    if (rbNo == '1') {
      this.isDisabled = false;
      // this.masterprocessconfigForm.get('deType').enable()
    }
    else {
      this.isDisabled = true;
      // this.masterprocessconfigForm.get('deType').disable()
    }
  }

  getdate(data: any) {
    if (data) {
      let data2: any = data.split(" ")
      return data2[0];
    } else {
      return "";
    }
  }


 




  // get actionsFormArray() {
  //   return this.processTaskConfigForm.controls['actions'] as FormArray;
  // }

  // private addCheckboxesToForm() {
  //   this.webData.forEach(() => this.actionsFormArray.push(new FormControl(false)));
  // }


  // checkBoxListData(){
  //   let obj = {
  //     "actionId" : 1,
  //     "actionName" : "INITIATE",
  //     "actionCode" : "CRE",
  //      "inType": "14"
  //   }

  //   this.api.postWf('insertwfprcss', obj).subscribe({
  //     next: (res: any) => {
  //       if (res && res.status && res.status == 'SUCCESS') {
  //         this.load.hide();
  //         this.webData = JSON.parse(res.data)
  //         // this.apidata3 = JSON.parse(res.data)
  //         console.log("sghdhsdh>>>>>>", this.webData)
         
  //         this.addCheckboxesToForm();
  //         // console.log("aaaaa",this.apidata3 )
  //       } else {
  //         this.load.hide();
  //       }
  //     }, error: (err: any) => {
  //       this.load.hide();
  //       this.snackbar.show(err?.error.error.description, 'danger');
  //     }
  //   });


  // }

  // ...........................................................................................................//


  initialApi() {

    let Date1 = this.processTaskConfigForm.controls['effStartDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');

    let Day1
    Day1 = this.processTaskConfigForm.controls['expiryDay'].value;

    let obj1 = {
      // "assignmentId": this.userDetails.assignmentid,
      // "processName": '',
      // "processId": 0,
      // "levelType": '',
      // "processLevelId": 0,
      // "taskRoleName": '',
      // "taskRoleId": 0,
      // "taskSeq": "2",
      // "taskSeq": '',
      // "isActive": '',
      // "effStartDate": fDate,
      // "taskActionExpiryDay": Day1,
      "inType": "10",
      "tempId": "1",

      // "isActive":"N",
      //  "assignmentUserId": "2",


    }

    // this.dataSource = this.tableData
    // this.dataSource = new MatTableDataSource(this.tableData)
    // this.dataSource = new MatTableDataSource(this.tableData)
    this.api.postWf('insertwfprcss', obj1).subscribe({
      next: (res: any) => {
        if (res && res.status && res.status == 'SUCCESS') {
          this.load.hide();
          this.apidata2 = JSON.parse(res.data)
          // this.apidata3 = JSON.parse(res.data)
          console.log("sghdhsdh>>>>>>", this.apidata2)
          // console.log("aaaaa",this.apidata3 )

          this.dataSource.data = this.apidata2
          console.log(this.dataSource)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // this.dataSourceFinal.next(this.dataSource)
          // this.changeDetectorRefs.detectChanges();


        } else {
          this.load.hide();

        }
      }, error: (err: any) => {
        this.load.hide();
        this.snackbar.show(err?.error.error.description, 'danger');
      }
    });
  }

  // ................................. DropDowns ke liye ......................................

  processNameAndId() {
    let obj1 = {

      // "processId": "0",
      // "processName": "",

      "tempId": "1",
      "inType": "6"

    }

    // {
    //   "processId": "1",
    //   "processName": "E-PENSION SET REGISTRATION",
    //   "isActive": "Y",
    //   "effStartDate": "05-01-23 11:15:40.805248 AM",
    //   "tempId": "1"
    // }---- for intype=6


    this.api.postWf('insertwfprcss', obj1).subscribe({
      next: (res: any) => {
        if (res && res.status && res.status == 'SUCCESS') {
          this.load.hide();
          this.processData = JSON.parse(res.data)
          console.log(this.processData);
          // this.changeDetectorRefs.detectChanges();
        } else {
          this.load.hide();
        }

      }, error: (err: any) => {
        this.load.hide();
        this.snackbar.show(err?.error.error.description, 'danger');
      }
    });
  }

  selectProcessLevelIdandName(){

    let findprocessObj : any =  this.processData.find((option) => option['processName'] == this.processTaskConfigForm.value.processName ) ?? '';
    console.log(findprocessObj)

    let obj1 = {

      // "processLevelId": this.updateProcessIs,
      // "processLevelId": 1,
      // "processName": "",

      "processId" : findprocessObj.processId,
       "tempId": "1",
   
      "inType": "12"
    
    }

    // {
    //   "processId": "1",
    //   "processName": "E-PENSION SET REGISTRATION",
    //   "isActive": "Y",
    //   "effStartDate": "05-01-23 11:15:40.805248 AM",
    //   "tempId": "1"
    // }---- for intype=6

    
    this.api.postWf('insertwfprcss', obj1).subscribe({
      next: (res: any) => {
        if (res && res.status && res.status == 'SUCCESS') {
          this.load.hide();
      this.levelData = JSON.parse(res.data)
      console.log(this.levelData);

       
          // this.changeDetectorRefs.detectChanges();


        } else {
          this.load.hide();

        }
      }, error: (err: any) => {
        this.load.hide();
        this.snackbar.show(err?.error.error.description, 'danger');
      }
    });

  }


  rolesNameandId(){



    let obj1 = {

      // "taskRoleId": "0",
    
      // "taskRoleName": "",

       "tempId": "1",
   
      "inType": "13"
    
    }

    // {
    //   "processId": "1",
    //   "processName": "E-PENSION SET REGISTRATION",
    //   "isActive": "Y",
    //   "effStartDate": "05-01-23 11:15:40.805248 AM",
    //   "tempId": "1"
    // }---- for intype=6

    
    this.api.postWf('insertwfprcss', obj1).subscribe({
      next: (res: any) => {
        if (res && res.status && res.status == 'SUCCESS') {
          this.load.hide();
      this.rolesData = JSON.parse(res.data)
      console.log(this.rolesData);

    

       
          // this.changeDetectorRefs.detectChanges();


        } else {
          this.load.hide();

        }
      }, error: (err: any) => {
        this.load.hide();
        this.snackbar.show(err?.error.error.description, 'danger');
      }
    });

  }
  


  submit(){

    let Date1 = this.processTaskConfigForm.controls['effStartDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');

    let findprocessObj : any =  this.processData.find((option) => option['processName'] == this.processTaskConfigForm.value.processName ) ?? '';
    console.log(findprocessObj)
    let findRolesObj : any =  this.rolesData.find((option) => option['taskRoleName'] == this.processTaskConfigForm.value.rolesName ) ?? '';
    console.log(findRolesObj)
    // console.log(this.levelData);
    
    let findlevelObj : any =  this.levelData.find((option)  =>{return option['processLevelId'] == this.processTaskConfigForm.value.levelType} ) ?? '' ;
    console.log(findlevelObj)
   
  console.log(this.processTaskConfigForm.value);
  // let actions2 = this.processTaskConfigForm.value.actions
  // console.log(actions2)

//  this.arr3 = [];

//   let actions1 = [
//     true,
//     true,
//     true,
//     true,
//     false,
//     false,
//     false,
//     true
// ]

// let webData=[

//   {

//       "actionId": "1",         "actionName": "INITIATE", "actionCode": "CRE"

// },     {

//       "actionId": "3",         "actionName": "FORWARD", "actionCode": "FWD"

// },     {

//       "actionId": "4",         "actionName": "REJECT", "actionCode": "REJ"

// },     {

//       "actionId": "5",         "actionName": "REVERT", "actionCode": "REV"

// },     {

// "actionId": "6", "actionName": "APPROVE", "actionCode": "ARV"

// }, {

// "actionId": "7", "actionName": "APPROVE-COMPLETE", "actionCode": "CMP"

// }, {

// "actionId": "8", "actionName": "PULLBACK", "actionCode": "PBK"

// }, {

// "actionId": "9", "actionName": "DRAFT", "actionCode": "DFT"

// }

// ]

// for(let i=0 ; i<=actions1.length ; i++){
//   if(actions1[i]==true){
//      this.arr3.push(webData[i])
//   } 
//   // let arr4 = ''
// }
// console.log(this.arr3)

// let data5 = this.rolesData[0].taskRoleId
// console.log(data5)
// console.log(obj)

  if (this.processTaskConfigForm.valid) {
    console.log(this.processTaskConfigForm.value)
    
    // for(let i=0 ; i<= this.rolesData.length ; i++){
    //   let data5 = this.rolesData[i] && this.rolesData[i].taskRoleId
    //   console.log(data5)

    
       let obj = {
        "assignmentId": this.userDetails.assignmentid,
        // "processName": findprocessObj.processName,
        // "processId": findprocessObj.processId,
        // "levelType": findlevelObj.levelType,
        "processLevelId": findlevelObj.processLevelId,
        // "taskRoleId": this.apidata2.taskRoleId,
        "taskRoleId": findRolesObj.taskRoleId,
        // "processLevelId":this.updateProcessIs,
        "taskSeq": this.processTaskConfigForm.value.processSeq,
        // ""modifiedBy" : "1",": this.processTaskConfigForm.value.expiryDay,
        "isActive": this.processTaskConfigForm.value.isActive,
        "isEsign": this.processTaskConfigForm.value.esign?'Y':'N',
        "effStartDate": fDate,
        "taskActionExpiryDay": this.processTaskConfigForm.value.expiryDay,
        "inType": "9",
        "tempId": "1",
        "modifiedBy" : this.userDetails.assignmentid,
        "processTaskId" : 0,
        // 'actions': actions2,
      }


    console.log(obj)

    this.api.postWf('insertwfprcss',obj).subscribe({
      next: (res: any) => {
        if (res && res.status && res.status == 'SUCCESS') {
          this.load.hide();
          this.apidata2 = res.data
          console.log(this.apidata2)
          this.dataSource.data = this.apidata2
          console.log(this.dataSource.data)
          this.snackbar.show(res.data, 'success');

          this.initialApi()
          this.processTaskConfigForm.reset();
          this.disableButton = false
        } else {
          this.load.hide();
        }


      }, error: (err: any) => {
        this.load.hide();
        this.snackbar.show(err?.error.error.description, 'danger');
      }

    });
  }
  }



  update() {

    
    
    let Date1 = this.processTaskConfigForm.controls['effStartDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');

    let findprocessObj : any =  this.processData.find((option) => option['processName'] == this.processTaskConfigForm.value.processName ) ?? '';
    let findRolesObj : any =  this.rolesData.find((option) => option['taskRoleName'] == this.processTaskConfigForm.value.rolesName ) ?? '';
    console.log(findRolesObj)
    // console.log(this.levelData);
    
    let findlevelObj : any =  this.levelData.find((option)  =>{return option['processLevelId'] == this.processTaskConfigForm.value.levelType} ) ?? '' ;
    console.log(findlevelObj)
   
  console.log(this.processTaskConfigForm.value);

   
    let obj = {
      
        "assignmentId": this.userDetails.assignmentid,
        // "processName": findprocessObj.processName,
        // "processId": findprocessObj.processId,
        // "levelType": findlevelObj.levelType,
        "processLevelId": findlevelObj.processLevelId,
        // "taskRoleId": this.apidata2.taskRoleId,
        "taskRoleId": findRolesObj.taskRoleId,
        // "processLevelId":this.updateProcessIs,
        "taskSeq": this.processTaskConfigForm.value.processSeq,
        // "rolesName": this.processTaskConfigForm.value.rolesName,
        // ""modifiedBy" : "1",": this.processTaskConfigForm.value.expiryDay,
        "processTaskId" : this. updateprocessTaskId,
        "isActive": this.processTaskConfigForm.value.isActive,
        "isEsign": this.processTaskConfigForm.value.esign?'Y':'N',
        "effStartDate": fDate,
        "taskActionExpiryDay": this.processTaskConfigForm.value.expiryDay,
        "inType": "17",
        "tempId": "1",
        "modifiedBy" : this.userDetails.assignmentid,
    }


  

    // {
    
    // "isActive"
    
    // "modifiedBy"
    
    // "effStartDate"
    
    // "taskSeq"
    
    // "taskRoleId"
    
    // "taskActionExpiryDay"
    
    // "isEsign"
    
    // }

console.log(obj)

console.log(this.processTaskConfigForm.value)

    if (this.processTaskConfigForm.valid) {

      this.api.postWf('insertwfprcss', obj).subscribe({
        next: (res: any) => {
          if (res && res.status && res.status == 'SUCCESS') {
            this.load.hide();
            this.apidata2 = res.data
            console.log(this.apidata2)
            this.dataSource.data = this.apidata2
            console.log(this.dataSource.data)
            this.snackbar.show(res.data, 'success');

            this.initialApi()
            this.processTaskConfigForm.reset();
            this.disableButton = false
          } else {
            this.load.hide();
          }
        }, error: (err: any) => {
          this.load.hide();
          this.snackbar.show(err?.error.error.description, 'danger');
        }
      });
    }

  }




  editTable(row: any) {
    console.log(row)
  
    // .....................Pura object uthane ke liye or show karane ke liye .....................
    // // let obj={
  
    //     levelType :  row.levelType,
    //   levelTypeId  :  row.levelTypeId
    // }
    // ............................................................................................//
  
    // this.updateProcessIs = row.processId
  
    this.updateProcessIs = row.processLevelId
    console.log(this.updateProcessIs)

    this. updateprocessTaskId = row.processTaskId
    console.log(this.updateprocessTaskId)
  
    this.processTaskConfigForm.controls['processName'].setValue(row.processName)
    this.processTaskConfigForm.controls['levelType'].setValue(row.processLevelId)
    this.processTaskConfigForm.controls['processSeq'].setValue(row.taskSeq)
    this.processTaskConfigForm.controls['effStartDate'].setValue(moment(row.effStartDate, "DD/MM/YYYY").format('YYYY-MM-DD[T]HH:mm:ss'));
    this.processTaskConfigForm.controls['isActive'].patchValue(row.isActive);
    this.processTaskConfigForm.controls['rolesName'].setValue(row.taskRoleName);
    this.processTaskConfigForm.controls['expiryDay'].patchValue(row.taskActionExpiryDay);
    this.processTaskConfigForm.controls['esign'].setValue(row.isEsign);

    this.disableButton = true;
    // this.masterprocessconfigForm.patchValue(row)
    // this.masterprocessconfigForm.patchValue(row)
  }




}













