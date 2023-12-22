import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { AppConfig } from 'src/app/app.config';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-process-task-action',
  templateUrl: './process-task-action.component.html',
  styleUrls: ['./process-task-action.component.scss']
})
export class ProcessTaskActionComponent implements OnInit {


  displayedColumns: string[] = ['processName', 'processId', 'processLevelName', 'processLevelId', 'processTaskRoleName', 'processTaskRoleId', 'processActionName', 'processActionId', 'processTaskActionId',  'effStartDate', 'isActive',  'Action'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  userDetails: any = {};

  processTaskActionForm: FormGroup;
  myControl: any = new FormControl('');
  form: FormGroup;
  config: AppConfig = new AppConfig();

  apidata2: any[] = [];
  processData: any[] = [];
  processLevelData: any[] = [];
  processTaskRolesData: any[] = [];
  actionDropDownData: any[] = [];
  disableButton: boolean = false;
  updateProcessIs = ''
  updateprocessTaskId = ''
  updatedProcessTaskActionId = ''

  constructor(private fb: FormBuilder,private api: ApiEssService, private load: LoaderService, private snackbar: SnackbarService,) {
    
   }

  ngOnInit(): void {

    this.userDetails = this.config.getUserDetails();
    console.log(this.userDetails)

    let assignmentId
    assignmentId = this.userDetails.assignmentid


    this.processTaskActionForm = this.fb.group({
      processName: ['', Validators.required],
      levelName: ['', Validators.required],
      levelRole: ['', Validators.required],
      actionName: ['', Validators.required],
      // processTaskActionId: ['', Validators.required],
      effStartDate: new FormControl({ value: "", disabled: false }, [
        Validators.required]),
      isActive: [{ value: '1', disabled: false }],
    });



    this.initialApi();
    this.processNameAndId();
    this.actionDropDownListData();

  }



  // .......................................................................

  processid = 0

  initialProcess() {
    // call api
    let response = 1
    this.processid = response
  }

  getdate(data: any) {
    if (data) {
      let data2: any = data.split(" ")
      return data2[0];
    } else {
      return "";
    }
  }

// ........................................................................................



initialApi() {

  let Date1 = this.processTaskActionForm.controls['effStartDate'].value;
  let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');



  let obj1 = {
    "assignmentId": this.userDetails.assignmentid,
    "processName": '',
    "processId": 0,
    "processLevelName": '',
    "processLevelId": 0,
    "processTaskRoleName": '',
    // "processTaskRoleId": 0,
    "processTaskId": 0,
    "processActionName": '',
    "processActionId": 0,
    "processTaskActionId": 0,
    "isActive": '',
    "effStartDate": fDate,
    "inType": "19",
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

    let findprocessObj : any =  this.processData.find((option) => option['processName'] == this.processTaskActionForm.value.processName ) ?? '';
    console.log(findprocessObj)

    let obj1 = {

      "processName": "",
      "processId" : findprocessObj.processId,
      "processLevelName": "",
      "processLevelId": "0",
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
      this.processLevelData = JSON.parse(res.data)
      console.log(this.processLevelData);

       
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


  processLevelRoleandTaskId(){

    let findprocessLevelRoleObj : any =  this.processLevelData.find((option) => option['processLevelId'] == this.processTaskActionForm.value.levelName ) ?? '';
    console.log(findprocessLevelRoleObj)

    let obj1 = {

      "processLevelName": findprocessLevelRoleObj.processLevelRoleName,
      "processLevelId" : findprocessLevelRoleObj.processLevelId,
      "processTaskRoleName": "",
      // "processTaskId": findprocessLevelRoleObj.processLevelId,
       "tempId": "1",
   
      "inType": "22"
    
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

          // if(res.status == 'SUCCESS' || res.data == 'CLOB is null'){
          //   this.processTaskRolesData = res.data
          //   console.log(this.processTaskRolesData);
          // }else{
          //   this.processTaskRolesData = JSON.parse(res.data)
          //   console.log(this.processTaskRolesData);
          // }
     
          this.processTaskRolesData = JSON.parse(res.data)
            console.log(this.processTaskRolesData);
       
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


  actionDropDownListData(){
    let obj1 = {

      "processLevelId": "0",
    
      "processName": "",
       "tempId": "1",
   
      "inType": "14"
    
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
      this.actionDropDownData = JSON.parse(res.data)
      console.log(this.actionDropDownData);

       
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


    let Date1 = this.processTaskActionForm.controls['effStartDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');

    // let findprocessObj : any =  this.processData.find((option) => option['processName'] == this.processTaskActionForm.value.processName ) ?? '';

    let findProcessLevelNameandIdObj : any =  this.processLevelData.find((option) => option['processLevelId'] == this.processTaskActionForm.value.levelName ) ?? '';
    console.log(findProcessLevelNameandIdObj)

    let findProcessTaskRolesNameandIdObj : any =  this.processTaskRolesData.find((option) => option['processTaskId'] == this.processTaskActionForm.value.levelRole ) ?? '';
    console.log(findProcessTaskRolesNameandIdObj)

    let findProcessActionNameandIdObj : any =  this.actionDropDownData.find((option) => option['processActionId'] == this.processTaskActionForm.value.actionName ) ?? '';
    console.log(findProcessActionNameandIdObj)
    
    // let findlevelObj : any =  this.levelData.find((option)  =>{return option['processLevelId'] == this.processTaskActionForm.value.levelType} ) ?? '' ;
    // console.log(findlevelObj)
   
  console.log(this.processTaskActionForm.value);
 

  if (this.processTaskActionForm.valid) {
    console.log(this.processTaskActionForm.value)
    
   

    
       let obj = {
        "assignmentId": this.userDetails.assignmentid,
        "isActive": this.processTaskActionForm.value.isActive,
        "effStartDate": fDate,
        "inType": "18",
        "tempId": "1",
        "modifiedBy" : this.userDetails.assignmentid,
        "processTaskId" : findProcessTaskRolesNameandIdObj.processTaskId,
        "processActionId" :findProcessActionNameandIdObj.processActionId,
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
          this.processTaskActionForm.reset();
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



  update(){

    let Date1 = this.processTaskActionForm.controls['effStartDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');

    // let findprocessObj : any =  this.processData.find((option) => option['processName'] == this.processTaskActionForm.value.processName ) ?? '';

    let findProcessLevelNameandIdObj : any =  this.processLevelData.find((option) => option['processLevelId'] == this.processTaskActionForm.value.levelName ) ?? '';
    console.log(findProcessLevelNameandIdObj)

    let findProcessTaskRolesNameandIdObj : any =  this.processTaskRolesData.find((option) => option['processTaskId'] == this.processTaskActionForm.value.levelRole ) ?? '';
    console.log(findProcessTaskRolesNameandIdObj)

    let findProcessActionNameandIdObj : any =  this.actionDropDownData.find((option) => option['processActionId'] == this.processTaskActionForm.value.actionName ) ?? '';
    console.log(findProcessActionNameandIdObj)
    
    // let findlevelObj : any =  this.levelData.find((option)  =>{return option['processLevelId'] == this.processTaskActionForm.value.levelType} ) ?? '' ;
    // console.log(findlevelObj)
   
  console.log(this.processTaskActionForm.value);
 

  if (this.processTaskActionForm.valid) {
    console.log(this.processTaskActionForm.value)
    
   

    
       let obj = {
        "assignmentId": this.userDetails.assignmentid,
        "isActive": this.processTaskActionForm.value.isActive,
        "effStartDate": fDate,
        "inType": "23",
        "tempId": "1",
        "modifiedBy" : this.userDetails.assignmentid,
        "processTaskId" : findProcessTaskRolesNameandIdObj.processTaskId,
        "processActionId" :findProcessActionNameandIdObj.processActionId,
        "processTaskActionId" : this.updatedProcessTaskActionId,
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
          this.processTaskActionForm.reset();
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

    this.updatedProcessTaskActionId = row.processTaskActionId
    console.log(this.updatedProcessTaskActionId)
  
    this.updateProcessIs = row.processLevelId
    console.log(this.updateProcessIs)

    this. updateprocessTaskId = row.processTaskId
    console.log(this.updateprocessTaskId)
  
    this.processTaskActionForm.controls['processName'].setValue(row.processName)
    this.processTaskActionForm.controls['levelName'].setValue(row.processLevelId)
    this.processTaskActionForm.controls['levelRole'].setValue(row.processTaskId)
    this.processTaskActionForm.controls['actionName'].setValue(row.processActionId);
    this.processTaskActionForm.controls['effStartDate'].setValue(moment(row.effStartDate, "DD/MM/YYYY").format('YYYY-MM-DD[T]HH:mm:ss'));
    // this.processTaskActionForm.controls['effStartDate'].setValue(moment(row.effStartDate, "DD/MM/YYYY").format('DD-MM-YYYY[T]HH:mm:ss'));
    this.processTaskActionForm.controls['isActive'].patchValue(row.isActive);
    // this.processTaskActionForm.controls['expiryDay'].patchValue(row.taskActionExpiryDay);
    // this.processTaskActionForm.controls['esign'].setValue(row.isEsign);

    this.disableButton = true;
    // this.masterprocessconfigForm.patchValue(row)
    // this.masterprocessconfigForm.patchValue(row)
  }





}
