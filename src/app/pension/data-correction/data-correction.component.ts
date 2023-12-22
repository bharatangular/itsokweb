import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { AppConfig } from 'src/app/app.config';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-data-correction',
  templateUrl: './data-correction.component.html',
  styleUrls: ['./data-correction.component.scss']
})
export class DataCorrectionComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  displayedColumns: any ={
    'srNo': 'SR.NO.',
    'employeeId': 'EMP ID',
    'employeeCode':'Emp Code',
    'name': 'Name',
    "ppoNo": "PPO No.",
    "update": "Update"
  };
  objectKeys = Object.keys;
  empinfo: any = {};
  userDetails: any = {};
  levelDetail: any = {};
  documentToUpdate: any = {};
  docToUpdateId: number;
  docToUpdateName: string;
  janaadhaarList: any = [];
  employeeList: any = [];
  empDetail: any = {};
  janMemberData: any = {};
  officeId: any = "";
  departmentList:any = [];
  officeList: any = [];
  deptControl = new FormControl();
  officeControl = new FormControl();
  filterdOfficelist      !: Observable<any>;
  filteredDept !: any;
  ssoDetail = new BehaviorSubject<Object>({});
  config: AppConfig = new AppConfig();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  private paginator1!: MatPaginator;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator1 = mp;
    this.dataSource.paginator = this.paginator1;
  }
  constructor(public _service:PensionServiceService, private tokenInfo:TokenManagementService,private apiService: ApiEssService,
    public dialog: MatDialog, private load: LoaderService,private snackbar: SnackbarService,) {
      this.userDetails = this.config.getUserDetails();
      this.empinfo = this.tokenInfo.empinfoService;
       if(sessionStorage.getItem('selected-roledetail')){
        let leveldetaildata  = sessionStorage.getItem('selected-roledetail');
        let decLevelData: any = this.config.decrypt(leveldetaildata);
        decLevelData = JSON.parse(decLevelData);
        this.levelDetail = decLevelData;
       }

       if(sessionStorage.getItem('jwt_token')){
        let sso_data: any  = sessionStorage.getItem('jwt_token');
        sso_data =  jwt_decode(sso_data);
        this.ssoDetail.next(sso_data);
       }

  }

  ngOnInit(): void {
      this.getUpdateDocumentList();  
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUpdateDocumentList(){
    this.documentToUpdate = [
      {id: '1', name: 'Pan No. is null'},
      {id: '2', name: 'Mobile No. is null'},
      {id: '3', name: 'SSO ID is null'},
      {id: '4', name: 'Office ID is null'}
    ]
  }


  getSelectedDetails()
  {
    if(this.docToUpdateId == 1){
      this.docToUpdateName = 'Pan';
    }else if(this.docToUpdateId == 2){
      this.docToUpdateName = 'Mobile';
    }else if(this.docToUpdateId == 3){
      this.docToUpdateName = 'SSO ID';
    }else if(this.docToUpdateId == 4){
      this.docToUpdateName = 'OFFICE ID';

      if(this.empinfo.ssoId == 'IFMS.TEST' || this.empinfo.ssoId == 'IFMSPENSION.TEST'){
        this.deptControl.reset();
        this.officeControl.reset();
        this.getDepartmentList();
      }
    }

    this.dataSource = new MatTableDataSource();
    let url = 'getPsnCorrectionData';

    this.load.show();
    let data = {
      "inMstType" : this.docToUpdateId
    }
    this.apiService.postloantype1(data, url).subscribe({
      next: (res: any) =>{
        if(res && res.status && res.status=='SUCCESS'){
          this.load.hide();
          if(res.data.length > 0 && !res.data[0].msg) {
            if(!res.data[0].Error && !res.data[0].message){
              this.dataSource = new MatTableDataSource(res.data);
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
    this.dataSource.filter = event.target.value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async getEmpDetails(employeeCode: any){
    if (employeeCode === null) { return }
    if (employeeCode) {

      try{  
          this.empDetail = await this.apiService.empServicese('updateDataUsingApi', { empCode:  employeeCode, panNo : 0}).
          toPromise().then((res: any)=>{
            if(res && res.data && Array.isArray(res.data) && res.data.length > 0){
              if(res.data.msg != 'no data available'){
                const data = res.data[0];
                return data;
              }else{
                return {};
              }
            }else{
              return {};
            }
          })
      }catch(error){
        console.log(error)
      }
    }
  }


  async getJanAadharDetails(janaadhaarId: any){
    try{
      this.janMemberData =  await this.apiService.postIfms('janaadhaar/familyinfo', { janAadharId: janaadhaarId, enrId: 0, aadharId: 0 }).
      toPromise().then((res: any)=>{
        if(res && res.root && res.root.personalInfo && res.root.personalInfo.member){
          const data = res.root.personalInfo.member;
          this.janaadhaarList = data;
          let jan_member_data = this.janaadhaarList.filter((x: any) => x.janaadhaarId == janaadhaarId)[0];
          return jan_member_data;
        }
      })
    }catch(error){
      console.log(error);
    }
  }

  // async getSsoDetails(){
  //   try{
  //     this.ssoDetail =  await this.apiService.postIfms('', { id: ''}).
  //     toPromise().then((res: any)=>{
  //       if(res && res.data){
  //         const data = res.data;
  //         return data;
  //       }
  //     })
  //   }catch(error){
  //     console.log(error);
  //   }
  // }


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
            this.filteredDept = this.deptControl.valueChanges
            .pipe(
            startWith(""),
            map((value: any) => (value ? this._filterDept(value) : this.departmentList))
            );
          }
        },
    
      })
    }
    
    private _filterDept(value: any) {      
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
  
    getOfficeDetailsByDeptId(){
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


  getPensionerDetails(row: any){
    let panNo = '';
    let mobile = '';
    let ssoId = '';
    if(this.docToUpdateName == 'Pan'){
      this.getEmpDetails(row.employeeCode).then((data: any) =>{
        if(this.empDetail){
          panNo =  this.empDetail.panNo;
          if(panNo || panNo == null || panNo == '' || panNo.length < 10){
            this.getJanAadharDetails(row.janaadhaarId).then((data: any)=>{
              if(this.janMemberData){
                panNo = this.janMemberData.panNo;
                if(panNo && panNo.length == 10){
                  this.updatePensionerDetails(row.employeeId, panNo, this.docToUpdateId);
                }else{
                  this.snackbar.show('Pan No. not found', 'danger');
                }
              }else{
                this.snackbar.show('Pan No. not found', 'danger');
              }
            
            })
          }else{
            this.updatePensionerDetails(row.employeeId, panNo, this.docToUpdateId);
          }
        }
      })
    }else if(this.docToUpdateName == 'Mobile'){
      this.getEmpDetails(row.employeeCode).then((data: any) =>{
        if(this.empDetail){
          mobile =  this.empDetail.mobile;
          if(!mobile || mobile == null || mobile == ''){
            this.getJanAadharDetails(row.janaadhaarId).then((data: any)=>{
              mobile = this.janMemberData.mobile;

              if(!mobile || mobile == null || mobile == ''){
                this.ssoDetail.subscribe((data: any)=>{
                  if(data){
                    mobile = data.mobile;
                    if(mobile && mobile != ''){
                      this.updatePensionerDetails(row.employeeId, mobile, this.docToUpdateId);
                    }else{
                      this.snackbar.show('Mobile No. not found', 'danger');
                    }
                  }else{
                    this.snackbar.show('Mobile No. not found', 'danger');
                  }
                })
              }else{
                this.updatePensionerDetails(row.employeeId, mobile, this.docToUpdateId);
              }
            
            })
          }else{
            this.updatePensionerDetails(row.employeeId, mobile, this.docToUpdateId);
          }
        }
      })
    }else if(this.docToUpdateName == 'SSO ID'){
      this.getEmpDetails(row.employeeCode).then((data: any) =>{
        if(this.empDetail){
          ssoId =  this.empDetail.ssoId;
              if(!ssoId || ssoId == null || ssoId == ''){
                this.ssoDetail.asObservable().subscribe((data: any)=>{
                  if(data){
                    mobile = data.mobile;
                  if(data){
                    ssoId = data.ssoId;
                    if(ssoId && ssoId != ''){
                      this.updatePensionerDetails(row.employeeId, ssoId, this.docToUpdateId);
                    }else{
                      this.snackbar.show('SSO ID not found', 'danger');
                    }
                  }else{
                    this.snackbar.show('SSO ID not found', 'danger');
                  }
                }
              })
              }else{
                this.updatePensionerDetails(row.employeeId, ssoId, this.docToUpdateId);
              }
        }
      })
    }else if(this.docToUpdateName == 'OFFICE ID'){
      this.officeId = this.officeControl?.value?.vId ? this.officeControl?.value?.vId : this.levelDetail.OfficeId;
      this.updatePensionerDetails(row.employeeId, this.officeId, this.docToUpdateId);
    }
  }

  updatePensionerDetails(empId:any, value: any, docId: any){

    let url = 'updateDataApi';

    let data: any = {
      empId: empId,
      inType: docId
    }

    if(docId == 1){
      data['panNo'] = value
    }else if(docId == 2){
      data['mobile'] = value
    }else if(docId == 3){
      data['ssoId'] = value
    }else if(docId == 4){
      data['officeId'] = value
    }
    this.apiService.postloantype1(data, url).subscribe({
      next: (res: any) => {
        if (res.status === "SUCCESS") {
          this.snackbar.show(res.data, 'success');
          this.getSelectedDetails();
        }else{
          this.snackbar.show(res.data, 'danger');
        }
      },
      error: (err: any) => {
        this.snackbar.show('Some Error Occured!', 'danger');
      }
    }) 
  }
}


