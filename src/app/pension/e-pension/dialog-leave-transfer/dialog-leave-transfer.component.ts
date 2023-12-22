import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfig } from 'src/app/app.config';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-dialog-leave-transfer',
  templateUrl: './dialog-leave-transfer.component.html',
  styleUrls: ['./dialog-leave-transfer.component.scss']
})
export class DialogLeaveTransferComponent implements OnInit {
  markLeaveForm !: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  displayedColumns: string[] = ['S.No.','Request ID','Initiator','Created Date','Received From','Status','Remarks','New Assignee', 'Action'];
  objectKeys = Object.keys;
  empinfo: any = {};
  userDetail: any = {};
  fromDate: any = '';
  toDate: any = '';
  isShow: boolean=true;
  selectedJson: any = [];
  requestIds: any[] = [];
  allAssigneeList: any[] = [];
  newAssignee: any = [];
  matList !: any;
  isChecked:boolean[]=[];
  cases: number;
  heading: any = '';
  selectedPopup: any = '';
  isSubmitted: boolean= false;
  config: AppConfig = new AppConfig();
  private paginator!: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }

  constructor(private formbuilder: FormBuilder,private _Service: PensionServiceService, @Inject(MAT_DIALOG_DATA)
  public dialog:MatDialog, private date: DatePipe,private snackbar: SnackbarService, public _service:PensionServiceService,
  private apiService: ApiEssService,private load: LoaderService,@Inject(MAT_DIALOG_DATA)
  public data: any, private dialogRef: MatDialogRef<DialogLeaveTransferComponent>) { 

    this.userDetail = data.details;

    this.heading = data.heading;
    this.selectedPopup = data.id;
    this.cases = data.cases;
    console.log(data)

    this.markLeaveForm = this.formbuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      assignmentId: [this.userDetail.assignmentId],
      remarks: ['', Validators.required],
      createdBy: [data.aId]
    })

  }

  ngOnInit(): void {
    if(this.data.id == 'transfer'){
      this.getWorkStatusList();

    }
  }

  updateTaskStatus(){
    let data = {
      assignmentId: this.userDetail.assignmentId,
      modifiedBy: this.empinfo.userId,
      isActive: this.userDetail.isActive == 'Y' ? 'N' : 'Y'
    }
    this.load.show();
    this.apiService.postWf('updateTaskStatus', data).subscribe({
      next: (res) => {
          console.log("res", res);
          this.data.getUserAssignList();
          let status = data.isActive== 'Y' ? 'Activated' : 'Inactivated'
          this.snackbar.show(`Assignee ${this.userDetail.assignmentId} is ${status} Successfully`, 'success');
        this.load.hide()
      },
      error: (err) => {
        this.snackbar.show(err?.error.description, 'danger');
        this.load.hide();
      }, complete: ()=> {
        this.load.hide();
      }
    });
  }

  countcaseByAssignmentId(){
    let data = {
      assignMentId: this.userDetail.assignmentId
    }
    this.apiService.postWf('countCaseByAssignMentId', data).subscribe({
      next: res => {
        console.log(res)
        if(res.status=='SUCCESS' && res.data && res.data.length > 0){
          this.cases = parseInt(res.data[0].cases);
          console.log("cases.......", res.data[0].cases);
          if(this.cases == 0){
            console.log(this.cases);
            this.heading = 'Apply Leave';
            this.selectedPopup = 'leave';
            // this.dialog.closeAll();
            // this.updateTaskStatus();
          }else if(this.cases > 0){
            this.heading = 'Pending Cases';
            this.selectedPopup='transfer';
          }
          console.log(this.selectedPopup, this.heading)
        }
      }, error: err => {
        this.snackbar.show(err?.error.description, 'danger');
      }
    })
  }



  dateChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement){
    let fromDate: any = '';
    let toDate: any = '';
    fromDate = new Date(dateRangeStart.value);
    toDate = new Date(dateRangeEnd.value);
    console.log(fromDate);
    console.log(toDate);
    this.fromDate = this.date.transform(fromDate, 'dd-MM-yyyy');
    this.toDate =  this.date.transform(toDate, 'dd-MM-yyyy');
  }

  markLeaveSubmit(){
    this.isSubmitted = true;
    if(this.markLeaveForm.valid){
      this.apiService.postloantype1({...this.markLeaveForm.value, fromDate: this.fromDate, toDate: this.toDate}, 'markLeave').subscribe({
        next: res => {
          if(res.data){
            this.snackbar.show(res.data, 'success');
            this.markLeaveForm.reset();
            this.dialogRef.close();
            this.getWorkStatusList();
          }
        }, error: err => {
          this.snackbar.show(err?.error.description, 'danger');
        }
      })
    }

  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getWorkStatusList(){
    if(this.data){
      this.load.show();
      let workStatusData: any = [];
      /* Show All Records Selected */
    let url = 'getWorkStatusLeaveMark';
    let data = {
      "processId" : 1,
      "assignmentId": this.userDetail.assignmentId,
      "officeId":  this.data.officeId,
      "role": this.userDetail.role
    }
    this.apiService.postWf(url,data).subscribe({
      next: (res: any) =>{
        if(res.status=='SUCCESS'){
          this.load.hide();
          workStatusData =  res.data;
              let tableData = workStatusData;
              for(let eachDataIndex in tableData) {
                tableData[eachDataIndex]["checked"] = false;
                this.isChecked[Number(eachDataIndex)]=false
              };
              this.dataSource = new MatTableDataSource();
              this.dataSource = new MatTableDataSource(tableData)
              // this.dataSource.paginator = this.paginator;
              // this.paginator.firstPage();
        }else{
          this.load.hide();
      }
    },error: (err: any)=>{
      this.load.hide();
        alert('Some Error Occred');
    }
    });
  }
  }

  getAssigneeList(detail: any, index: number){
    console.log(detail);
    let data = {
      "processTaskId":detail.processTaskId,
      "processId":detail.processId,
      "assignmentId":detail.currentAssignmentId
    }

      let url = 'getotheruserbyprocesstask';
      this.apiService.postWf(url,data).subscribe({
        next: (res: any) =>{
          if(res.status=='SUCCESS'){
            if(res.data && res.data.length > 0){
              this.allAssigneeList[index] = res.data;
              this.isChecked[index]=true;
            }else{
              this.allAssigneeList[index] = [];
              // Uncheck the checkbox
              if(this.allAssigneeList[index] && this.allAssigneeList[index].length == 0){
                let tabledata = this.dataSource.filteredData;
                this.isChecked[index]=false
                this.dataSource = new MatTableDataSource(tabledata);
              }
              this.snackbar.show(`No Assignee found on Request Id : ${detail.requestId}`, 'danger');
            }
          }else{
            this.allAssigneeList[index] = [];
            if(this.allAssigneeList[index] && this.allAssigneeList[index].length == 0){
              let tabledata = this.dataSource.filteredData;
              this.isChecked[index]=false
              this.dataSource = new MatTableDataSource(tabledata);
            }
          }

      },error: (err: any)=>{
        this.allAssigneeList[index] = [];
        if(this.allAssigneeList[index] && this.allAssigneeList[index].length == 0){
          let tabledata = this.dataSource.filteredData;
          this.isChecked[index]=false
          this.dataSource = new MatTableDataSource(tabledata);
        }
      }
      });
  }
  
  selectRow(event: any, row: any, index: number){
    console.log(this.selectedJson)
      if(event.checked){
        this.newAssignee[index] = "";
          this.getAssigneeList(row, index);
      }else{
        console.log(this.selectedJson);
        let selectedIndex: any = this.selectedJson.findIndex((item: any) => item.requestId == row.requestId);
        console.log(selectedIndex);
        this.isChecked[index]=false;
        this.allAssigneeList[index] = [];
        if(selectedIndex > 0){
          this.selectedJson.splice(selectedIndex, 1);
        }
        
      }
      console.log(this.selectedJson)
  }

  selectAssignee(detail: any, index: number){
    console.log(detail)
    if(this.isChecked[index] && this.allAssigneeList && this.allAssigneeList[index].length > 0){
      this.selectedJson.push({requestId: detail.requestId, taskTranId: detail.taskTranId, newAssignmentId: this.newAssignee[index]});
      this.requestIds =  this.selectedJson.map((item: any) => item.requestId);
      console.log(this.selectedJson)
    }
  }


  sendToNewAssignee(){
    console.log("isChecked", this.isChecked)
    console.log("requestIds", this.requestIds)
    console.log("newAssignee",this.newAssignee)
    console.log("allAssigneeList",this.allAssigneeList)
    console.log("selectedJson",this.selectedJson)
    // console.log(this.data)

      let url = 'updateAssignMentIdByMultipleRequestId';

      let sendDetails = {
        "filetransfer": this.selectedJson
      }
        this.load.show();
        this.apiService.postWf(url, sendDetails).subscribe({
          next: (res: any) =>{
          if(res.status == 'SUCCESS'){
            this.load.hide();
            let data =  res.data; 
            alert('Cases submitted successfully');
            this.countcaseByAssignmentId();
          }else{
            this.load.hide();
          }
        },error: (err: any)=>{
          this.load.hide();
            alert('Some Error Occred');
        }});
  }

}
