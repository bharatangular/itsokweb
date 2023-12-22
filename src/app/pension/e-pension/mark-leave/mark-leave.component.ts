import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfig } from 'src/app/app.config';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { Observable, Observer, Subject, catchError, debounceTime, from, map, of, startWith, switchMap } from 'rxjs';
import { DialogLeaveTransferComponent } from '../dialog-leave-transfer/dialog-leave-transfer.component';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-mark-leave',
  templateUrl: './mark-leave.component.html',
  styleUrls: ['./mark-leave.component.scss']
})
export class MarkLeaveComponent implements OnInit { 
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  displayedColumns: any ={
    'srNo': 'SR.NO.',
    'ssoId': 'SSO ID',
    'name':'Officer',
    'roleName': 'Role',
    "markLeave": "Mark Leave",
    "Status": "Status",
    "EditStatus": "Action",
  };
  canApply: boolean = false;
  levelDetail: any = {};
  isSubmitted: boolean = false;
  objectKeys = Object.keys;
  departmentList:any = [];
  officeList: any = [];
  empinfo: any = {};
  cases: number;
  userDetails: any = {};
  deptControl = new FormControl();
  officeControl = new FormControl();
  filterdOfficelist      !: Observable<any>;
  config: AppConfig = new AppConfig();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  private paginator1!: MatPaginator;
  filteredDept !: any;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator1 = mp;
    this.dataSource.paginator = this.paginator1;
  }
  constructor(public _service:PensionServiceService, private tokenInfo:TokenManagementService,private apiService: ApiEssService,
    public dialog: MatDialog, private load: LoaderService, private fb: FormBuilder,private snackbar: SnackbarService,) {
      this.userDetails = this.config.getUserDetails();
      this.empinfo = this.tokenInfo.empinfoService;
       console.log("emptoken",this.empinfo);
       console.log(this.userDetails);

       if(sessionStorage.getItem('selected-roledetail')){
        let leveldetaildata  = sessionStorage.getItem('selected-roledetail');
        let decLevelData: any = this.config.decrypt(leveldetaildata);
        decLevelData = JSON.parse(decLevelData);
        this.levelDetail = decLevelData;
       }
  }

  ngOnInit(): void {
    if(this.empinfo.ssoId == 'IFMS.TEST' || this.empinfo.ssoId == 'IFMSPENSION.TEST'){
      this.getDepartmentList();
    }else{
      this.getUserAssignList();
    }    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  getUserAssignList()
  {
    this.dataSource = new MatTableDataSource();
    let url = 'getUserDetailsByOfficeId';

    this.load.show();
    let data = {
      "officeId" : this.officeControl?.value?.vId ? this.officeControl?.value?.vId : this.levelDetail.OfficeId
    }
    this.apiService.postWf(url,data).subscribe({
      next: (res: any) =>{
        if(res && res.status && res.status=='SUCCESS'){
          this.load.hide();
          if(res.data.length > 0 && res.data[0] !== '') {
            if(!res.data[0].Error && !res.data[0].message){
              this.dataSource = new MatTableDataSource(res.data);
              console.log(this.dataSource);
            }else{
              this.dataSource = new MatTableDataSource();
            }
          }else{
            this.dataSource = new MatTableDataSource();
          }
        }else{
          this.load.hide();
          this.dataSource = new MatTableDataSource();
        }
    },error: (err: any)=>{
      this.dataSource = new MatTableDataSource();
      this.load.hide();
      this.snackbar.show(err?.error.error.description, 'danger');
    }
  });
  }

  applyFilter(event: any) {
    console.log(event)
    this.dataSource.filter = event.target.value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Department Search Filter Start

  getDepartmentList(){
    let data = {
      "inMstType":21,
      "inValue":0,
      "inValue2":0,
      "inValue3":""
      }
    this.apiService.postWf('allmstdata', data).subscribe({
      next: (res) => {
        if (res.status = 'SUCCESS') {
          this.departmentList = JSON.parse(res.data);
          console.log("this.officeList",this.departmentList);
          this.filteredDept = this.deptControl.valueChanges
          .pipe(
          startWith(""),
          map((value: any) => (value ? this._filter(value) : this.departmentList))
          );
        }
      },
  
    })
  }
  
  private _filter(value: any) {      
   if(isNaN(value)) 
    return this.departmentList && this.departmentList.filter((option:any) => option.vNameEnglish.toLowerCase().includes(value ));
    else {
    return this.departmentList && this.departmentList.filter((option:any) => option.vId.includes(value));
    }
  }

  displayFn(departmanet :any){
    return departmanet ? departmanet.vNameEnglish +" ("+ departmanet.vId +")" : "";
   }

  // Department Search Filter End

  // Office Search Filter Start

  getOfficeDetailsByDeptId()
  {
    console.log(this.filterdOfficelist)
    this.displayofFn("");
    this.officeControl.reset();
    let data = {
      "inMstType":22,
      "inValue":this.deptControl?.value?.vId ? this.deptControl?.value?.vId : 0,
      "inValue2":0,
      "inValue3":""
      }
    this.apiService.postWf('allmstdata', data).subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.officeList = JSON.parse(res.data);
          console.log("this.officeList",this.officeList)
          this.filterdOfficelist = this.officeControl.valueChanges
           .pipe(
           startWith(""),
           map(value => (value ? this._filteroffc(value) : this.officeList))
          );
        }
      },
    })
  }


  resetOffice(){
    this.officeControl.reset();
    this.dataSource = new MatTableDataSource();
  }

  resetDept(){
    this.deptControl.reset();
    this.officeControl.reset();
    this.dataSource = new MatTableDataSource();
  }

  private _filteroffc(value: any) {   
    if(isNaN(value)) 
    return this.officeList && this.officeList.filter((option:any) => option.vNameEnglish.toLowerCase().includes(value  ));
    else
      return this.officeList && this.officeList.filter((option:any) => option.vId.includes(value));
  }

  displayofFn(offc :any){
    return offc ? offc.vNameEnglish +" ("+ offc.vId +")" : "";
  }
  // Office Search Filter End

  selectOffice()
  {
    let data:any;
    data = {
      "inMstType":28,
      "inValue":this.officeControl?.value?.vId,
      "inValue2":0,
      "inValue3":""
    }
    console.log("check office",data);
    this.getUserAssignList();
  }

  openDialog(userDetail: any, type: any){
    let heading = '';
    let id = '';

    let data = {
      assignMentId: userDetail.assignmentId
    }
    this.apiService.postWf('countCaseByAssignMentId', data).subscribe({
      next: res => {
        console.log(res.data)
        if(res.data && res.data.length > 0 && res.data[0] && res.data[0].cases){
          this.cases = parseInt(res.data[0].cases);
          console.log(res.data[0].cases)
          console.log(this.cases)
          if(type == 'Action'){
            if(this.cases == 0){
              heading = 'Apply Leave';
              id='leave';
            }else if(this.cases > 0){
              heading = 'Pending Cases';
              id='transfer';
            }
            console.log(id, heading)
            this.dialog.open(DialogLeaveTransferComponent,
              {
                maxWidth: '60vw',
                // maxHeight: '75vh',
                width: '100%',
                panelClass: 'dialog-w-50', autoFocus: false
                , data: {
                  heading: heading,
                  id: id,
                  details: userDetail,
                  aId: this.empinfo.aid,
                  officeId: this.officeControl?.value?.vId ? this.officeControl?.value?.vId : this.levelDetail.OfficeId,
                  ssoId: this.empinfo.ssoId,
                  getUserAssignList: this.getUserAssignList(),
                  cases: this.cases
                }
              }
            );
          }else{
            if(this.cases == 0){
              let data = {
                assignmentId: userDetail.assignmentId,
                modifiedBy: this.empinfo.userId,
                isActive: userDetail.isActive == 'Y' ? 'N' : 'Y'
              }
              this.load.show();
              this.apiService.postWf('updateTaskStatus', data).subscribe({
                next: (res) => {
                    console.log("res", res);
                    this.getUserAssignList();
                    let status = data.isActive== 'Y' ? 'Activated' : 'Inactivated'
                    this.snackbar.show(`Assignee ${userDetail.assignmentId} is ${status} Successfully`, 'success');
                  this.load.hide()
                },
                error: (err) => {
                  this.snackbar.show(err?.error.description, 'danger');
                  this.load.hide();
                }, complete: ()=> {
                  this.load.hide();
                }
              });
            }else if(this.cases > 0){
              this.dialog.open(DialogLeaveTransferComponent,
                {
                  maxWidth: '60vw',
                  // maxHeight: '75vh',
                  width: '100%',
                  panelClass: 'dialog-w-50', autoFocus: false
                  , data: {
                    heading: 'Pending Cases',
                    id: 'transfer',
                    details: userDetail,
                    aId: this.empinfo.aid,
                    officeId: this.officeControl?.value?.vId ? this.officeControl?.value?.vId : this.levelDetail.OfficeId,
                    ssoId: this.empinfo.ssoId,
                    getUserAssignList: this.getUserAssignList(),
                    cases: this.cases
                  }
                }
              );
            }
          }
        }
      }, error: err => {
        this.snackbar.show(err?.error.description, 'danger');
      }
    })
  }
}

