import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service'
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { Action } from 'rxjs/internal/scheduler/Action';
import { userInfo } from 'os';
import { Router } from '@angular/router';
// import { CommonModalComponent } from '/common-modal/common-modal.component';
import { CommonModalComponent } from '../../common-modal/common-modal.component';
import { breadcrumService } from 'src/app/services/breadcrum.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-commutation',
  templateUrl: './commutation.component.html',
  styleUrls: ['./commutation.component.scss']
})
export class CommutationComponent implements OnInit {
 
  
  displayedColumns: string[] = ["basic", "DA_h", "HRA_h", "Spcl_Pay", "npa", "cca"];
  userAction: Array<any> = [];
  action: string = 'INI';
  reqId: string = '';
  taskId: string = '';
  getCommutationForm!: FormGroup;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  getCommutationList: Array<any> = [];
  dataSource!: MatTableDataSource<any>;
  employeeyInfo: any = {};
  userType: any = '';
  empId: any;
  user: any ={};
  roleid:any;
  @Input() personal: Subject<boolean>;
  constructor(private fb: FormBuilder, public dialog: MatDialog, private apiService: ApiService, private snackbar: SnackbarService, public shareModule: SharedModule,
    private router: Router,private breadcrum:breadcrumService) { }

  ngOnInit(): void {
    this.breadcrum.config= {pageid: 'commutation'}
    this.apiService.configMenu = { IsShow: true }
    this.user = this.apiService.userInfo();
    console.log( this.user)
    const IsEss = sessionStorage.getItem('landtoken');
    if (IsEss !== null) {
      this.userType = IsEss;
      if(this.userType === '1'){
        this.empId = this.user.employeeId;
      }
      this.roleid=sessionStorage.getItem("roleId")
      this.getEmployeeData();
    }

    this.getCommutation();
    this.getCommutationForm = this.fb.group({
      empCommutationFlag: new FormControl('Y', Validators.required),
      empCommutationDate: new FormControl('', Validators.required),
      // empCommutationPercentage: new FormControl('', Validators.required),
      // empCommutationPercentage: ['', [Validators.min(0), Validators.max(50)], [Validators.required]]
      empCommutationPercentage: ['', Validators.compose([Validators.min(0), Validators.max(50)])],

    })

    const user = this.apiService.userInfo();
    const session = JSON.parse(sessionStorage.getItem('ifm_emp_in')!);
    if (session !== null) {
      if (session.aid !== user.aid) {
        this.reqId = session.reqId;
        this.taskId = session.taskId;
        this.getAllData(session.taskId);
      }
    }

  }

  CommutationFormArray: any = []
  getAllData = (taskId: number) => {
    this.apiService.post('task', { taskId: taskId }).subscribe({
      next: (response) => {
        if (response.status == 'SUCCESS') {
          this.CommutationFormArray = response.data.payload;
          this.empId = this.CommutationFormArray.employeeCode;
          response.data.payload.employeeCommutation
          this.employeeyInfo= response.data.payload.employeeCommutation
          this.getCommutationForm.patchValue({ 
            empCommutationFlag: this.employeeyInfo.comFlag === null ? 'Y' : this.employeeyInfo.comFlag,
            empCommutationDate: this.employeeyInfo.comDate,
            empCommutationPercentage: this.employeeyInfo.comPercent,
           });
           let datas:any[]=[];
           if(datas.length<1)
           datas.push(response.data.payload.employeeCommutation)
           this.dataSource = new MatTableDataSource<string>(datas);
           this.dataSource.paginator = this.paginator;
          this.userAction = response.data.actionData;
        }
      },
      error: (err) => { },
    });
  };



  changeCommutation() {
    if (this.getCommutationForm.value.empCommutationFlag === 'N') {
      this.getCommutationForm.controls['empCommutationDate'].disable();
      this.getCommutationForm.controls['empCommutationPercentage'].disable();


      this.getCommutationForm.patchValue({ empCommutationDate: '' })
    } else {
      this.getCommutationForm.controls['empCommutationDate'].enable();
      this.getCommutationForm.controls['empCommutationPercentage'].enable();

    }
  }
  ngOnDestroy() {
    sessionStorage.removeItem('ifm_emp_in');
  }
  onSave() {
    if (this.getCommutationForm.invalid) { 
      alert("Please ensure that all fields are filled correctly and completely");
      return }
    //const user = JSON.parse(sessionStorage.getItem('userInfo')!);
    this.employeeyInfo['comDate']=this.getCommutationForm.value.empCommutationDate === undefined ? '' : this.getCommutationForm.value.empCommutationDate,
    this.employeeyInfo['comPercent']=this.getCommutationForm.value.empCommutationPercentage === undefined ? '' : this.getCommutationForm.value.empCommutationPercentage,
    this.employeeyInfo['comFlag']=this.getCommutationForm.value.empCommutationFlag;
    
console.log("payload",this.employeeyInfo)
    const actionData = {
      request_data: {
        processId: "11",
        taskSeq: '',
        processTaskSeq: '',
        taskTranId: this.taskId,
        requestId: this.reqId,
        requestDesc: '',
        assignmentId: this.userType === '1' ? this.empId : this.user.aid,
        initiator: 0,
        person_id: this.userType === '1' ? this.empId : this.user.aid,
        person_name: '',
        action: this.action,
        remarks: 'Submitted',
        payloadChangeFlag: 'Y',
        userType: this.userType === '1' ? 'E' : 'O'
      },
      payload: {
        employeeCode: this.empId,
        requester: 'EMP',
        employeeCommutation:  this.employeeyInfo
        // {
          // employeeId: this.employeeyInfo.employeeId,
          // empCommutationFlag: this.getCommutationForm.value.empCommutationFlag,
          // empCommutationDate: this.getCommutationForm.value.empCommutationDate === undefined ? '' : this.getCommutationForm.value.empCommutationDate,
          // empCommutationPercentage:  this.getCommutationForm.value.empCommutationPercentage === undefined ? '' : this.getCommutationForm.value.empCommutationPercentage,
         
        // }
      },
      payloadSummery: {
        employeeCode: this.employeeyInfo.employeeId,
        requester: 'EMP',
      }
    }

    this.userConfirm(this.action, actionData);
  }



  userConfirm(action: any, actionData:any) {
    const confirmDialog = this.dialog.open(CommonModalComponent, {
      autoFocus: false,
      width: '550px',
      data: {
        action: action,
        id: 'success'
      },
    });

    confirmDialog.afterClosed().subscribe(data => {
      let mainData=JSON.parse(data)
      if (mainData.action === 'Y') {
    
        this.submitRequest(actionData,mainData.remark)
      }
    })
  }
  verifyMobileNo(): void {

    // if (this.getCommutationForm.invalid) { 
    //   alert("Fill fields properly");
    //   return }
    if(this.mobileNo)
    {
      let data={
        "ssoId":"RJ121212",
        "sourceId":"1",
        "processId":"18",
        "mobileNo":this.mobileNo,
        "ipAddress":"10.1.1.1"
      }
      this.apiService.postIfms('otp/otpGenerate', data).subscribe({
        next: res => {
  
          console.log(res)
          this.verifyOtp(res);
         }
      })
    }else
    {
      alert("Employee Mobile no not found");
    }
    
  }
  mobileNo:any
  getEmployeeData = () => {
    this.apiService.postmst('getEmployeeDetailsByType', {
      employeeId: this.empId, inType: 1
    }).subscribe({
      next: res => {
        const data = res.data;
        this.mobileNo=data.employeePersonalDetail.mobileNumber 
       
      }, error: err => {
      }
    })
  }
  verifyOtp(res:any){
    const confirmDialog = this.dialog.open(CommonModalComponent, {
      autoFocus: false,
      width: '350px',
      data: {
        action: '',
        id: 'otp',
        otpData:res,
        mobileNo:this.mobileNo
      },
    });

    confirmDialog.afterClosed().subscribe(data => {
      console.log("data",data);
      
      if (data.verified === 'Y') {
        this.Save();
      }else{
        alert("Otp not Verified")
      }
    })
  }
  Save()
  {
    this.employeeyInfo['comDate']=this.getCommutationForm.value.empCommutationDate === undefined ? '' : this.getCommutationForm.value.empCommutationDate,
    this.employeeyInfo['comPercent']=this.getCommutationForm.value.empCommutationPercentage === undefined ? '' : this.getCommutationForm.value.empCommutationPercentage,
    this.employeeyInfo['comFlag']=this.getCommutationForm.value.empCommutationFlag;
    const requestData = {
      employeeCode: this.empId,
      requester: 'EMP',
      employeeCommutation:  this.employeeyInfo
    }
console.log("requestData",requestData);

    this.apiService.postmst('updateEssAddressDetails', requestData).subscribe({
      next: res => {
        this.snackbar.show('Your Address details updated successfully', 'success');
      }, error: err => {
        this.snackbar.show(err?.error.description, 'danger');
      }
    })
  }
  submitRequest(actionData:any,remark:any) {
    if(this.roleid=='1' || this.roleid=='2' || this.roleid=='3')
    {
      actionData.request_data.remarks=remark;
    }
    this.apiService.post('action', actionData).subscribe({
      next: res => {
        this.snackbar.show('Your Request Saved Successfully and your request id is ' + res.data.requestId, 'success');

        this.router.navigate(['/inbox'])
      }, error: err => {
        this.snackbar.show(err?.error?.description, 'danger');
      }
    })
  }

  getCommutation = () => {
    let userInfo = this.apiService.userInfo();
    
    this.apiService.postmst('getCommutation', { "employeeId": userInfo.employeeId }).subscribe({
      next: (res) => {
        this.employeeyInfo = res.data[0];        
        let date1=new Date(this.employeeyInfo.comDate);
        date1.setDate( date1.getDate() + 1 );        
        this.getCommutationForm.patchValue({
          empCommutationFlag: this.employeeyInfo.comFlag === null ? 'Y' : this.employeeyInfo.comFlag,
          empCommutationDate:date1,
          empCommutationPercentage: this.employeeyInfo.comPercent,
        })
        this.dataSource = new MatTableDataSource<string>(res.data);
        this.dataSource.paginator = this.paginator;
      }
    })
  }


}
