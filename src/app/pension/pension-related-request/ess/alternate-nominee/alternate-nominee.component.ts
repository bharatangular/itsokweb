
  import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
  import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiEssService } from 'src/app/services/api-ess.service';
 
  import { SnackbarService } from 'src/app/services/snackbar.service';

  @Component({
    selector: 'app-alternate-nominee',
    templateUrl: './alternate-nominee.component.html',
    styleUrls: ['./alternate-nominee.component.scss']
  })
  export class AlternateNomineeComponent implements OnInit {
    @Input() EmpFamily: any;
    @Input() JanUserList: any;
    @Input() config: any = {};
    @Output() EmpData = new EventEmitter();
    @Output() JanaadhaarUser = new EventEmitter();
    familyDetails: any;
    today = new Date();
    getRelationList: Array<any> = [];
    getGenderList: Array<any> = [];
    getMaritalStatusList: any;
    frmNominee: any;
    getSchemeTypeList: any;
    EmployeeFamilyDetails: any = { familyDetails: [], nomineeDetails: [] }
    IsEdit = false;
    index: number = 0;
    janaadhaarList: Array<any> = [];
    datePipe: any;
    date: Date;
    isSaveEnable = false;
  
    constructor(private formbuilder: FormBuilder, private apiService: ApiEssService, private snackbar: SnackbarService,) {
      this.date = new Date();
    }
    ngOnInit(): void {
      this.familyDetails = this.formbuilder.group({
        name: ['', Validators.required],
        relationship: ['', Validators.required],
        gender: ['', Validators.required],
        maritalStatus: ['', Validators.required],
        dob: ['', Validators.required],
        physicallyDisabled: [false, Validators.required],
        percentageOfDisability: new FormControl({ value: '', disabled: true }, Validators.compose([Validators.min(40), Validators.max(100)])),
        dependent: [false, Validators.required],
        employed: [false, Validators.required],
        janAadharId: ['',],
        memberId: [''],
        //isRajasthan: new FormControl({ value: '', disabled: true },),
        govEmployee: [false, Validators.required],
        employeeId: [''],
      });
  
      this.frmNominee = this.formbuilder.group({
        schemes: ['', Validators.required],
        nameOfNominee: ['', Validators.required],
        relation: ['', Validators.required],
        share: ['', Validators.required],
      })
      this.getRelation();
      this.getGender();
      this.getMaritalStatus();
      this.getSchemeType();
  
  
      if (this.config.isView) {
        this.familyDetails.disable();
        this.frmNominee.disable();
      }
      this.config.isModified === true ? this.isSaveEnable = true : this.isSaveEnable = false;
    }
  
    ngOnChanges(changes: any) {
      if(changes.hasOwnProperty('EmpFamily')){
        this.EmployeeFamilyDetails = changes.EmpFamily.currentValue;
      }
  
      if (changes.hasOwnProperty('JanUserList')) {
        const data = changes.JanUserList.currentValue || [];
        data.forEach((user: any) => {
          this.EmployeeFamilyDetails.familyDetails.push({
            name: user.nameEng,
            memberId: user.jan_mid,
            dob: user.dob,
            janAadharId: user.janaadhaarId,
            relationship: 0,
            gender: 0,
            maritalStatus: '',
            // disabilityId: false,
            // disabilityPercentage: '',
            dependent: false,
            employed: false
          })
        });
      }
    }
  
    modify() {
      this.familyDetails.enable();
      this.frmNominee.enable();
      this.config.isView = false;
      this.isSaveEnable = true;
    }
  
  
  
    getRelation = () => {
      this.apiService.postmdm('getFamilyRelation', {}).subscribe({
        next: (res) => {
          this.getRelationList = res.data;
        }
      })
    }
    getGender = () => {
      this.apiService.postmdm('getGender', {}).subscribe({
        next: (res) => {
          this.getGenderList = res.data;
        }
      })
    }
    getMaritalStatus = () => {
      this.apiService.postmdm('getMaritalStatus', {}).subscribe({
        next: (res) => {
          this.getMaritalStatusList = res.data;
        }
      })
    }
    getSchemeType = () => {
      this.apiService.postmdm('getSchemeType', {}).subscribe({
        next: (res) => {
          this.getSchemeTypeList = res.data;
        }
      })
  
    }
  
    getScheme = (id: number) => {
      if (id !== undefined)
        return this.getSchemeTypeList.filter((x: any) => x.schNomId == id)[0].schNomNameEn;
    }
  
    saveFamily() {
      if (this.familyDetails.invalid) { return }
      if (this.IsEdit) {
  
        this.EmployeeFamilyDetails.familyDetails[this.index] = this.familyDetails.value;
      } else {
        this.EmployeeFamilyDetails.familyDetails.push(this.familyDetails.value);
      }
      this.IsEdit = false;
      this.familyDetails.reset();
  
    }
  
    edit = (index: number) => {
      this.IsEdit = true;
      index = index;
      const data = this.EmployeeFamilyDetails.familyDetails[index];
      this.familyDetails.patchValue({ ...data })
    }
    remove = (index: number) => {
      this.EmployeeFamilyDetails.familyDetails.splice(index, 1);
    }
  
    getGenderName = (id: number) => {
      if (id !== undefined && id !== 0)
        return this.getGenderList.filter((x: any) => x.genId == id)[0].genNameEn;
    }
  
    getRelationName = (id: number) => {
      if (id !== undefined && id !== 0)
        return this.getRelationList.filter((x: any) => x.relationId == id)[0].rNameEn;
    }
  
    saveNominee() {
      if (this.frmNominee.invalid) { return }
      this.IsEdit == true ? this.EmployeeFamilyDetails.nomineeDetails[this.index] = this.frmNominee.value : this.EmployeeFamilyDetails.nomineeDetails.push(this.frmNominee.value)
      this.IsEdit = false;
      this.frmNominee.patchValue({
        schemes: [''],
        nameOfNominee: [''],
        relation: [''],
        share: [''],
      })
    }
  
    edit1 = (index: number) => {
      this.IsEdit = true;
      index = index;
      const data = this.EmployeeFamilyDetails.nomineeDetails[index];
  
      this.frmNominee.patchValue({ ...data })
    }
    remove1 = (index: number) => {
      this.EmployeeFamilyDetails.nomineeDetails.splice(index, 1);
    }
  
  
    onItemChange(event: any) {
      if (event.value == false) {
        this.familyDetails.controls['percentageOfDisability'].disable();
  
      }
      else {
        this.familyDetails.controls['percentageOfDisability'].enable();
  
      }
    }
  
    onItemChanges(event: any) {
  
      if (event.value == false) {
        this.familyDetails.controls['govEmployee'].disable();
      }
      else {
        this.familyDetails.controls['govEmployee'].enable();
      }
    }
  
  
  
    // saveDraft = () => {
    //   debugger
    //   if (this.EmployeeFamilyDetails.familyDetails.length == 0 || this.EmployeeFamilyDetails.nomineeDetails.length == 0)
    //     this.snackbar.show('Please add Family Details and Nominee Details', 'danger');
    //   this.apiService.postdoc('familyDetail/validate', this.EmployeeFamilyDetails).subscribe(res => {
    //     if (res.status == 'SUCCESS') {
    //       const data = { step: 4, value: this.EmployeeFamilyDetails }
    //       this.EmpData.emit(data);
    //     }
    //   })
  
  
    // }
  
    //4807772669
    getJanaadhaar = (value: any) => {
  
      if (value.length === 10) {
        this.apiService.postIfms('janaadhaar/familyinfo', { janAadharId: value, enrId: 0, aadharId: 0 }).subscribe({
          next: (res:any) => {
            const data = res.root.personalInfo.member;
            this.janaadhaarList = data;
            this.JanaadhaarUser.emit(data);
          }
        })
  
      }
    }
    changeMember = () => {
      const data = this.janaadhaarList.filter(x => x.jan_mid === this.familyDetails.value.memberId)[0];
      this.familyDetails.patchValue({
        name: data.nameEng,
        fatherName: data.fnameEng,
        motherName: data.mnameEng,
        dob: new Date(data.dob),
        mobileNumber: data.mobile,
        aadharRefNo: data.aadhar,
        pan: data.panNo
        // gender: data.panNo
      });
  
    }
  
  
  }
  
  
  
  
  
  
  
  
  
  