import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { AppConfig } from 'src/app/app.config';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-process-level-mapping',
  templateUrl: './process-level-mapping.component.html',
  styleUrls: ['./process-level-mapping.component.scss']
})
export class ProcessLevelMappingComponent implements OnInit {

  displayedColumns: string[] = ['processName', 'processId',  'levelType', 'levelTypeId', 'processSeq', 'effStartDate', 'isActive', 'Action'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userDetails: any = {};
  myControl: any = new FormControl('');
  processLabelMappingForm: FormGroup;
  config: AppConfig = new AppConfig();
  isDisabled: boolean = false;
  apidata2: any[] = [];
  apidata3: any[] = [];
  one: number = 1;
  zero: number = 0;
  disableButton: boolean = false;
  processData : any[] = [];
  levelData : any[] = []; 
  updateProcessIs = ''
  

  constructor(private fb: FormBuilder, private api: ApiEssService, private load: LoaderService, private snackbar: SnackbarService,) { }

  ngOnInit(): void {

    this.userDetails = this.config.getUserDetails();
    console.log(this.userDetails)

    let assignmentId
    assignmentId = this.userDetails.assignmentid

    this.processLabelMappingForm = this.fb.group({
      processName: ['', Validators.required],
      levelType: ['', Validators.required],
      processSeq: ['', Validators.required],
      effStartDate: new FormControl({ value: "", disabled: false }, [
        Validators.required]),
      isActive: [{ value: '1', disabled: false }],
      deType: new FormControl({ value: "", disabled: false }, [
      ]),
    });

    this.initialApi();
    this.processNameAndId()
    this.levelTypeAndId()

  }



// ...........................  For Number Pattern or Integer Input field only ................................

  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // ............................................................................................................



  initialApi() {

    let Date1 = this.processLabelMappingForm.controls['effStartDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');

    let obj1 = {
      "assignmentId": this.userDetails.assignmentid,
      "processName": '',
      "processId": 0,
      "levelType": '',
      "levelTypeId": 0,
      "processSeq": "2",
      "isActive": '',
      "effStartDate": fDate,
      "inType": "5",
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
          console.log("sghdhsdh",this.apidata2 )
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


  // let processNameandId
  // processNameandId : any =
  // this.apidata2.find(
  //   (option) =>
  //     option['processId'] ==
  //     this.processLabelMappingForm.value.processId
  // ) ?? '';
  getdate(data:any)
  {

    if(data)
    {
      let data2:any=data.split(" ")
      return data2[0];
    }else
    {
      return "";
    }
  }

  processNameAndId(){
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
  
  levelTypeAndId(){
    let obj1 = {

      // "processId": "0",
    
      // "processName": "",
       "tempId": "1",
   
      "inType": "7"
    
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

  


  // .................................................................................................//

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


  submit(){

      let findprocessObj : any =  this.processData.find((option) => option['processName'] == this.processLabelMappingForm.value.processName ) ?? '';
      let findlevelObj : any =  this.levelData.find((option) => option['levelTypeId'] == this.processLabelMappingForm.value.levelType ) ?? '';

    console.log(this.processLabelMappingForm.value);
    let Date1 = this.processLabelMappingForm.controls['effStartDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let obj = {
      "assignmentId": this.userDetails.assignmentid,
      "processName": findprocessObj.processName,
      "processId": findprocessObj.processId,
      "levelType": findlevelObj.levelType,
      "levelTypeId": findlevelObj.levelTypeId,
      "processSeq": this.processLabelMappingForm.value.processSeq,
      "isActive": this.processLabelMappingForm.value.isActive,
      "effStartDate": fDate,
      "inType": "4",
      "tempId": "1",
    }

    if (this.processLabelMappingForm.valid) {

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
            this.processLabelMappingForm.reset();
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

    
    let findprocessObj : any =  this.processData.find((option) => option['processName'] == this.processLabelMappingForm.value.processName ) ?? '';
    console.log(findprocessObj)
    let findlevelObj : any =  this.levelData.find((option) => option['levelTypeId'] == this.processLabelMappingForm.value.levelType ) ?? '';
    // let findprocessObj1 : any =  this.apidata3.find((option) => option['processLevelId'] == this.apidata3.processLevelId) ?? '';
    // console.log(findprocessObj1)

    console.log(this.processLabelMappingForm.value);
    let Date1 = this.processLabelMappingForm.controls['effStartDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let obj = {
      "assignmentId": this.userDetails.assignmentid,
      "processName": findprocessObj.processName,
      "processId": findprocessObj.processId,
      "processLevelId":this.updateProcessIs,
      "levelType": findlevelObj.levelType,
      "levelTypeId": findlevelObj.levelTypeId,
      "processSeq": this.processLabelMappingForm.value.processSeq,
      "isActive": this.processLabelMappingForm.value.isActive,
      "effStartDate": fDate,
      "inType": "8",
      "tempId": "1",

      // ................
      // "assignmentId": this.userDetails.assignmentid,
      // "processName": '',
      // "processId": 0,
      // "levelType": '',
      // "levelTypeId": '',
      // "processSeq": "2",
      // "isActive": '',
      // "effStartDate": fDate,
      // "inType": "5",
      // "tempId": "1",
      // ..............
      //  "assignmentUserId": "2",


    }
    if (this.processLabelMappingForm.valid) {

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
            this.processLabelMappingForm.reset();
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


//  levelTypes=[
//   {
//     levelType :  "HOD",
//   levelTypeId  :  "1"
// },
//   {
//     levelType :  "PeNSION",
//   levelTypeId  :  "2"
// }
// ]

  // updateProcessIs = ''

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

    this.processLabelMappingForm.controls['processName'].setValue(row.processName)
    this.processLabelMappingForm.controls['levelType'].setValue(row.levelTypeId)
    this.processLabelMappingForm.controls['processSeq'].setValue(row.processSeq)
    this.processLabelMappingForm.controls['effStartDate'].setValue(moment(row.effStartDate,"DD/MM/YYYY").format('YYYY-MM-DD[T]HH:mm:ss'))
    this.processLabelMappingForm.controls['isActive'].patchValue(row.isActive);
    this.disableButton = true;
    // this.masterprocessconfigForm.patchValue(row)
    // this.masterprocessconfigForm.patchValue(row)
  }

}
