import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Console } from 'console';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';


@Component({
  selector: 'app-master-config-screen',
  templateUrl: './master-config-screen.component.html',
  styleUrls: ['./master-config-screen.component.scss'],
  // imports: [MatFormFieldModule, MatInputModule, MatNativeDateModule, MatDatepickerModule],
})


export class MasterConfigScreenComponent implements OnInit {

  displayedColumns: string[] = ['processName', 'effStartDate', 'isActive', 'Action'];


  tableData: any[] = [

    // {
    //   processName: 'p1w',
    //   isActive: 2,
    //   effStartDate: '09-10-2023',
    // },
    // {
    //   processName: 'p1w',
    //   isActive: 2,
    //   effStartDate: '09-10-2023',
    // },
    // {
    //   processName: 'p1w',
    //   isActive: 2,
    //   effStartDate: '09-10-2023',
    // },
    // {
    //   processName: 'p1w',
    //   isActive: 2,
    //   effStartDate: '09-10-2023',
    // },
    // {
    //   processName: 'p1w',
    //   isActive: 2,
    //   effStartDate: '09-10-2023',
    // },
    // {
    //   processName: 'p1w',
    //   isActive: 2,
    //   effStartDate: '09-10-2023',
    // },
    // {
    //   processName: 'p1w',
    //   isActive: 2,
    //   effStartDate: '09-10-2023',
    // },


  ];


  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // paginator!: MatPaginator;
  // sort!: MatSort;

  myControl: any = new FormControl('');
  masterprocessconfigForm: FormGroup;
  processNameText: any = '';
  config: AppConfig = new AppConfig();
  userDetails: any = {};
  one: number = 1;
  zero: number = 0;
  isDisabled: boolean = false;
  apidata1: any[] = [];
  apidata2: any[] = [];
  disableButton: boolean = false;


  formSubmitted: boolean = false;
  // dataSource: any[] = [];
  dataSourceFinal: BehaviorSubject<any> = new BehaviorSubject([])
  formData: any[] = [];
  changeDetectorRefs: any;
  // MatTableDataSource: any[] =[];


  constructor(private fb: FormBuilder, private api: ApiEssService, private load: LoaderService, private snackbar: SnackbarService, changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.userDetails = this.config.getUserDetails();
    console.log(this.userDetails)

    let assignmentId
    assignmentId = this.userDetails.assignmentid



    this.masterprocessconfigForm = this.fb.group({
      processName: ['', Validators.required],
      effStartDate: new FormControl({ value: "", disabled: false }, [
        Validators.required]),
      isActive: [{ value: '1', disabled: false }],
      deType: new FormControl({ value: "", disabled: false }, [
      ]),
    });


    this.initialApi()

  }






  
  getdate(data: any) {
    if (data) {
      let data2: any = data.split(" ")
      return data2[0];
    } else {
      return "";
    }
  }

  //.......................... already form filled values from api data ........................//

  initialApi() {

    let Date1 = this.masterprocessconfigForm.controls['effStartDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');

    let obj1 = {
      "assignmentId": this.userDetails.assignmentid,
      "processName": '',
      "processId": 0,
      "isActive": '',
      "effStartDate": fDate,
      "inType": "2",
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

  submit() {

    // this.load.show();

    console.log(this.masterprocessconfigForm.value);
    let Date1 = this.masterprocessconfigForm.controls['effStartDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let obj = {

      "assignmentId": this.userDetails.assignmentid,

      "processName": this.masterprocessconfigForm.value.processName,

      "processId": 0,

      "isActive": this.masterprocessconfigForm.value.isActive,

      "effStartDate": fDate,

      "inType": "1"

    }

    if (this.masterprocessconfigForm.valid) {
      this.api.postWf('insertwfprcss', obj).subscribe({
        next: (res: any) => {
          if (res && res.status && res.status == 'SUCCESS') {
            this.load.hide();
            this.apidata1 = res.data
            console.log(this.apidata1)
            this.snackbar.show(res.data, 'success');
            this.initialApi();

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

    console.log(this.masterprocessconfigForm.value);
    let Date1 = this.masterprocessconfigForm.controls['effStartDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let obj = {
      "assignmentId": this.userDetails.assignmentid,
      "processName": this.masterprocessconfigForm.value.processName,
      "processId": this.updateProcessIs,
      "isActive": this.masterprocessconfigForm.value.isActive,
      "effStartDate": fDate,
      "inType": "3",
      //  "assignmentUserId": "2",


    }
    if (this.masterprocessconfigForm.valid) {

      this.api.postWf('insertwfprcss', obj).subscribe({
        next: (res: any) => {
          if (res && res.status && res.status == 'SUCCESS') {
            this.load.hide();
            this.apidata1 = res.data
            console.log(this.apidata1)
            this.dataSource.data = this.apidata1
            console.log(this.dataSource.data)
            this.snackbar.show(res.data, 'success');

            this.initialApi()
            this.masterprocessconfigForm.reset();
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












  onRemoveUser() {
    // this.formData.splice(this.formData.length -1)
    // this.formData = [];
    // this.dataSource = [];
    this.dataSource.data = [];
    // this.dataSourceFinal.next(this.dataSource)
  }

  removeItem(item: any) {
    console.log(this.dataSource)

    this.dataSource.data.splice(item, 1)
    let data3 = this.dataSource.data
    this.dataSource.data = data3

    ///// jab mattabledatasource use karte hain to datasource.data likhte hain kyuki isme
    ///// sort,paginator or sare function call ho jate hain console main isliye .

    // this.changeDetectorRefs.detectChanges();
    // this.dataSourceFinal.next(this.dataSource)
    // this.formData.splice(this.formData.length -1)

  }



  updateProcessIs = ''

  editTable(row: any) {
    console.log(row)
    this.updateProcessIs = row.processId
    this.masterprocessconfigForm.controls['processName'].setValue(row.processName)
    // this.masterprocessconfigForm.controls['effStartDate'].setValue(new Date(row.effStartDate))
    this.masterprocessconfigForm.controls['effStartDate'].setValue(moment(row.effStartDate, "DD/MM/YYYY").format('YYYY-MM-DD[T]HH:mm:ss'));

    this.masterprocessconfigForm.controls['isActive'].patchValue(row.isActive);
    this.disableButton = true;
    // this.masterprocessconfigForm.patchValue(row)
    // this.masterprocessconfigForm.patchValue(row)
  }


}
