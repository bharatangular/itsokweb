import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { SnackbarService } from 'src/app/services/snackbar.service';
import { CommonModalComponent } from '../common-modal/common-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationConfig } from 'src/app/layout/registration.config';
import { ApiEssService } from 'src/app/services/api-ess.service';
class Employee {
  employeePersonalDetail: any = {};
  employeeServiceDetails: any = {};
  employeeAddressDetails: any = { currentAddress: {}, permanentAddress: {} };
  employeeFamilyDetails: any = { familyDetails: [], nomineeDetails: [] };
  employeeBankDetails: any = {};
  payEntitlementDetails: any = {};
  actinData: any = {}
}
@Component({
  selector: 'app-ess',
  templateUrl: './ess.component.html',
  styleUrls: ['./ess.component.scss']
})
export class EssComponent implements OnInit {
  employee: Employee = new Employee();
  reqId: string = '';
  taskId: string = '';
  userAction: Array<any> = [];
  cardShow: boolean = true;
  lastPageButton: boolean = true;
  data: any = {};
  config: RegistrationConfig = {
    isView: true,
    isModified: false,
    processId: 0,
    registrationType: 0,
    isFirstWorkflow: 0
  };


  empId: any;
  user: any = {};
  action = 'INI';
  payloadSummery: any = {};
  userType = '';
  requester = 'EMP';


  constructor(
    private apiService: ApiEssService,
    private snackbar: SnackbarService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
  /*   this.route.data.subscribe((data: any) => {
      this.config.processId = data.page_id;
    });

    this.user = this.apiService.userInfo();
    console.log(this.user)
    const session = JSON.parse(sessionStorage.getItem('ifm_emp_in')!);
    if (session !== null) {
      this.reqId = session.reqId;
      this.taskId = session.taskId;
      if(session.action === 'HO'){
        this.requester = session.action;
        this.empId = session.employeeCode;
        this.getEmployeeData(session.employeeCode)
      } else{
        this.getAllData(session.taskId)
      }
    } else if (this.user.hasOwnProperty('employeeId') && this.user.employeeId !== null) {
      this.empId = this.user.employeeId;
      this.getEmployeeData(this.user.employeeId);
    }
    const IsEss = sessionStorage.getItem('landtoken');
    if (IsEss !== null) {
      this.userType = IsEss;
    } */
  }

  ngOnDestroy() {
   // sessionStorage.removeItem('ifm_emp_in');
  }

  getEmployeeData = (empId: any) => {
    this.apiService.postmst('getEmployeeDetailsByType', {
      employeeId: empId, inType: this.config.processId === 7 ? 2 : this.config.processId
    }).subscribe({
      next: res => {
        this.employee = res.data
        if (this.employee.hasOwnProperty('employeeAddressDetails')) {
          this.employee.employeeAddressDetails =
          {
            ...res.data.employeeAddressDetails.currentAddress,
            ...res.data.employeeAddressDetails.permanentAddress
          }
        }
      }, error: err => {
      }
    })
  }


  getAllData = (taskId: number) => {
    this.apiService.post('task', { taskId: taskId }).subscribe({
      next: (response) => {
        if (response.status == 'SUCCESS') {
          this.payloadSummery.employeeCode = response.data.payload.employeeCode;
          this.employee = response.data.payload;
          if (this.employee.hasOwnProperty('employeeAddressDetails')) {
            this.employee.employeeAddressDetails =
            {
              ...response.data.payload.employeeAddressDetails.currentAddress,
              ...response.data.payload.employeeAddressDetails.permanentAddress
            }
          }

          this.userAction = response.data.actionData;
        }
      },
      error: (err) => { },
    });
  };

  goToViewDetails(processId: number) {
    this.config.processId = processId;
    this.getEmployeeData(this.empId);
  }

  getData = (data: any) => {
    if (data.action !== '') { this.action = data.action };
    switch (data.step) {
      case 1:
        this.employee.employeePersonalDetail = data.value;
        console.log(this.employee)
        this.saveData('Your Request Saved Successfully ', 'employeePersonalDetail', data.value);
        break;

      case 2:
        this.employee.employeeServiceDetails = data.value;
        this.saveData('Your Request Saved Successfully ', 'employeeServiceDetails', data.value);
        break;

      case 3:
        this.employee.employeeAddressDetails = data.value;
        this.saveData('Your Request Saved Successfully ', 'employeeAddressDetails', data.value);
        break;

      case 4:
        this.employee.employeeFamilyDetails = data.value;
        this.saveData('Your Request Saved Successfully ', 'employeeFamilyDetails', data.value);
        break;

      case 5:
        this.employee.employeeBankDetails = data.value;
        this.saveData('Your Request Saved Successfully ', 'employeeBankDetails', data.value);
        break;

      case 6:
        this.employee.payEntitlementDetails = data.value;
        this.saveData('Your Request Saved Successfully ', 'payEntitlementDetails', data.value);
        break;
    }
  }

  saveData(message: string, action: string, data: any) {
    const employeeCode = this.userType === '1' ? this.empId : this.payloadSummery.employeeCode;
    const payload = {
      employeeCode: employeeCode,
      requester: this.requester,
      [action]: data
    }

    const processId = sessionStorage.getItem('process_id');

    const actionData = {
      request_data: {
        processId: processId,
        taskSeq: '',
        processTaskSeq: '',
        taskTranId: this.taskId,
        requestId: this.reqId,
        requestDesc: '',
        assignmentId: this.userType === '1' ? employeeCode : this.user.aid,
        initiator: 0,
        person_id: this.userType === '1' ? employeeCode : this.user.aid,
        person_name: 'BARKAT ALI',
        action: this.action,
        remarks: 'Submitted',
        payloadChangeFlag: 'Y',
        userType: this.userType === '1' ? 'E' : 'O'
      },
      payload: {
        ...payload,
      },
      payloadSummery: {
        employeeCode: this.user.employeeId,
        requester: 'EMP',
      }
    };

    this.userConfirm(this.action, actionData, message)
  }


  userConfirm(action: any, actionData: any, message: any) {
    const confirmDialog = this.dialog.open(CommonModalComponent, {
      autoFocus: false,
      width: '550px',
      data: {
        action: action,
        id: 'success'
      },
    });

    confirmDialog.afterClosed().subscribe(data => {
      if (data === 'Y') {
        this.submitRequest(actionData, message)
      }
    })
  }

  submitRequest(actionData: any, message: any) {
    this.apiService.post('action', actionData).subscribe({
      next: res => {
        this.snackbar.show(message + 'and your request id is ' + res.data.requestId, 'success');
        this.router.navigate(['/dashboard'])
      }, error: err => {
        this.snackbar.show(err?.error?.description, 'danger');
      }
    })
  }


}
