

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { SnackbarService } from 'src/app/services/snackbar.service';
import { CommonModalComponent } from '../common-modal/common-modal.component';

import { ApiEssService } from 'src/app/services/api-ess.service';



@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  @Input() EmpAddress: any;
  @Input() mobileNo:any;
  @Input() config: any = {};
  @Output() EmpData = new EventEmitter();
  @Input() userAction: Array<any> = [];
  @Input() personal: Subject<boolean>;
  @Input() isOtpVerified:boolean;
  roleid:any;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  permanentdistrictList: Array<any> = [];
  stateList: Array<any> = [];
  permanentBlockList: Array<any> = [];
  panchayatWarList: Array<any> = [];
  muncipalList: Array<any> = [];
  essEmployeeAddressSavedata: any;
  rid: any;
  saveAddress: any;
  selectedRecord: any;
  State: any;
  district: any;
  blockId: any;
  getBlockdata: any;
  submitted !: boolean;
  Warddata: any;
  flag: any;
  wardlist: Array<any> = [];
  MuncipalID: any;
  block_panchayat: boolean = true;
  Municipal_ward: boolean = false;
  checked: boolean = false

  permanentVillageList: Array<any> = [];
  permanentDistrictList: Array<any> = [];
  permanentPanchayatList: Array<any> = [];
  currentVillageList: Array<any> = [];
  currentPanchayatList: Array<any> = [];
  currentStateList: Array<any> = [];
  currentDistrictList: Array<any> = [];
  currentBlockList: Array<any> = [];
  EmployeeAddressDetails: any = { currentAddress: {}, permanentAddress: {} };

  action = '';
  assemblyList: Array<any> = [];
  isSaveEnable = false;

  constructor(private formbuilder: FormBuilder, private apiService:ApiEssService, private snackbar: SnackbarService,private dialog:MatDialog) { }

  ngOnInit(): void {
    this.getState();
    this.roleid=sessionStorage.getItem("roleId")
    this.saveAddress = this.formbuilder.group({
      permanentState: new FormControl('', Validators.required),
      permanentDistrict: new FormControl('', Validators.required),
      permanentArea: new FormControl(2),
      permanentMunicipal: new FormControl(null),
      permanentBlock: new FormControl(''),
      permanentWard: new FormControl(null),
      permanentPanchayat: new FormControl(''),
      permanentAssembly: new FormControl(''),
      permanentPincode: new FormControl('', Validators.required),
      permanentHouseNo: new FormControl('', Validators.required),
      permanentVillage: new FormControl(''),
      addressType: [false],
      currentState: [''],
      currentDistrict: [''],
      currentBlock: [''],
      currentPanchayat: [''],
      currentMunicipal: new FormControl(null),
      currentWard: new FormControl(null),
      currentVillage: [''],
      currentPincode: [''],
      currentHouseNo: [''],
      currentAssembly: [''],
      currentArea: [''],
    })

   

    if (this.config.isView) {
      this.saveAddress.disable();
    }
    this.config.isModified === true ? this.isSaveEnable = true : this.isSaveEnable = false;
    this.personal.subscribe(v => { 
      // this.onSubmit();
    });
  }

  ngOnChanges(changes: any) {
    
    if (!changes.EmpAddress?.firstChange) {
      {
        
        const address = changes.EmpAddress?.currentValue;
        console.log(address)
        this.saveAddress.patchValue({ ...address });
        //  this.saveAddress.patchValue({permanentPanchayat: address?.permanentAddress?.permanentPanchayat });
       
        const data = changes.EmpAddress?.currentValue;
        this.getCdistrict();
        this.getCblock()
        this.getDistrict();
        this.onBlockChange();
        this.getPanchayatWard2()
        this.getPanchayatWard3();
        this.getPanchayatWard4()
        this.onAreaItemChange();
        this.onDistrictChange();
        this.getCblock();
        this.assembly();
        this.getPanchayatWard();
        this.getPanchayatWardcurrent();
        this.onAreaItemChangeCurrent();
      }
    }
    this.config.isModified === true ? this.isSaveEnable = true : this.isSaveEnable = false;
    if(this.isOtpVerified)
    {
    
      this.isSaveEnable = true
    
    }
    if(this.roleid=='4' || this.roleid=='5')
    {
      this.isSaveEnable = false
    }

  }


  area: string = '';
  state: string = '';

  modify() {
    this.saveAddress.enable();
    this.config.isModified = false;
    this.isSaveEnable = true;
  }

  getState = () => {
    this.apiService.postmdm('getState', {}).subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.stateList = res.data
        }
      },

    })
  }
  stateChange(){
    
    this.saveAddress.patchValue({
      permanentAssembly:"",
      permanentDistrict:"",
      permanentBlock:"",
      permanentPanchayat:"",
      permanentMunicipal:"",                                                                                              
      permanentWard:"",
      permanentVillage:"",
      permanentHouseNo:"",
      permanentPincode:"",                                                                          
     
    })
    this.getDistrict();
  }
  stateChangeCurrent(){
    
    this.saveAddress.patchValue({
      currentAssembly:"",
      currentDistrict:"",
      currentBlock:"",
      currentPanchayat:"",
      currentMunicipal:"",                                                                                              
      currentWard:"",
      currentVillage:"",
      currentHouseNo:"",
      currentPincode:"",                                                                          
     
    })
    this.getCdistrict();
  }
  getDistrict = () => {
    if(this.saveAddress.value.permanentState!=null)
    {
      this.apiService.postmdm('getDistrict', { stateId: this.saveAddress.value.permanentState }).subscribe({
        next: (res) => {
          if (res.status = 200) {
            this.permanentdistrictList = res.data
          }
        },
  
      })
    }
   
  }

  getCdistrict() {
    if(this.saveAddress.value.currentState!=null)
    {
      this.state = this.saveAddress.value.currentState;
      this.apiService.postmdm('getDistrict',{ stateId: this.saveAddress.value.currentState } ).subscribe({
        next: (res) => {
          if (res.status = 200) {
            this.currentDistrictList = res.data
          }
        },
  
      })
    }
  
  }

  onDistrictChange() {
    if(this.saveAddress.value.currentState!=null &&  this.saveAddress.value.currentDistrict!=null )
    {
      this.apiService.postmdm('getBlock', { stateId: this.saveAddress.value.currentState, districtId: this.saveAddress.value.currentDistrict }).subscribe({
        next: (res) => {
          this.currentBlockList = res.data
        }
      })
    }
 
    this.assembly2();
  }
  districtChange()
  {
    this.saveAddress.patchValue({
      permanentAssembly:"",    
      permanentBlock:"",
      permanentPanchayat:"",
      permanentMunicipal:"",                                                                                              
      permanentWard:"",
      permanentVillage:"",
      permanentHouseNo:"",
      permanentPincode:"",                                                                          
     
    })
    this.onBlockChange();
    this.assembly();
  }
  districtChangeCurrent()
  {
    this.saveAddress.patchValue({
      currentAssembly:"",    
      currentBlock:"",
      currentPanchayat:"",
      currentMunicipal:"",                                                                                              
      currentWard:"",
      currentVillage:"",
      currentHouseNo:"",
      currentPincode:"",                                                                          
     
    })
    this.onDistrictChange();
    this.onAreaItemChangeCurrent();
  }
  changeBlock()
  {
    this.saveAddress.patchValue({
    permanentPanchayat:"",
    permanentMunicipal:"",                                                                                              
    permanentWard:"",
    permanentVillage:"",
    permanentHouseNo:"",
    permanentPincode:"",                                                                          
   
  })
    this.getPanchayatWard2()
  }
  changeBlockCurrent()
  {
    this.saveAddress.patchValue({
    currentPanchayat:"",
    currentMunicipal:"",                                                                                              
    currentWard:"",
    currentVillage:"",
    currentHouseNo:"",
    currentPincode:"",                                                                          
   
  })
    this.getCblock()
  }
  changeMuncipal()
  {
    this.saveAddress.patchValue({
                                                                                               
      permanentWard:"",
      permanentVillage:"",
      permanentHouseNo:"",
      permanentPincode:"",                                                                          
     
    })
    this.getPanchayatWard()
  }
  onBlockChange() {
    if(
      this.saveAddress.value.permanentState!=null
      && this.saveAddress.value.permanentDistrict!=null
    )
    {
      this.apiService.postmdm('getBlock', { stateId: this.saveAddress.value.permanentState, districtId: this.saveAddress.value.permanentDistrict }).subscribe({
        next: (res) => {
          if (res.status = 200) {
            this.permanentBlockList = res.data
          }
        },
      })
    }
  
    this.onAreaItemChange();
    
    
  }

  changeValue(event: any) {

    if (event.checked) {
      this.saveAddress.patchValue({
        currentState: this.saveAddress.value.permanentState,
        currentDistrict: this.saveAddress.value.permanentDistrict,
        currentArea: this.saveAddress.value.permanentArea,
        currentBlock: this.saveAddress.value.permanentBlock,
        currentPanchayat: this.saveAddress.value.permanentPanchayat,
        currentMunicipal: this.saveAddress.value.permanentMunicipal,
        currentWard: this.saveAddress.value.permanentWard,
        currentVillage: this.saveAddress.value.permanentVillage,
        currentPincode: this.saveAddress.value.permanentPincode,
        currentHouseNo: this.saveAddress.value.permanentHouseNo,
        currentAssembly: this.saveAddress.value.permanentAssembly
      });
      
      this.getCdistrict();
      this.onDistrictChange();
      this.getPanchayatWardcurrent();
      this.getCblock();   
      this.getPanchayatWard4();      
      this.assembly2();
      this.onAreaItemChangeCurrent();
     
    
      
      // this.permanentDistrictList = this.currentDistrictList;
      // this.permanentBlockList = this.currentBlockList;
      // this.permanentPanchayatList = this.currentPanchayatList;
      // this.permanentVillageList = this.currentVillageList;
    }
    else {
      this.saveAddress.patchValue({
        currentState: [''],
        currentDistrict: [''],
        currentArea: this.saveAddress.value.permanentArea,
        currentBlock: [''],
        currentPanchayat: [''],
        currentMunicipal: [''],
        currentWard: [''],
        currentVillage: [''],
        currentPincode: [''],
        currentHouseNo: [''],
        currentAssembly: [''],
      });
    }

  }

  setRequiredFields() {
    if (this.saveAddress.value.permanentArea === 1) {
      this.saveAddress.patchValue({
        permanentMunicipal: null,
        permanentWard: null,
      })
      // this.saveAddress.get("permanentMunicipal").clearValidators();
      // this.saveAddress.get('permanentMunicipal').updateValueAndValidity();
      // this.saveAddress.get("permanentWard").clearValidators();
      // this.saveAddress.get('permanentWard').updateValueAndValidity();


      // this.saveAddress.get("permanentBlock").addValidators([Validators.required]);
      // this.saveAddress.get('permanentBlock').updateValueAndValidity();
      // this.saveAddress.get("permanentPanchayat").addValidators([Validators.required]);
      // this.saveAddress.get('permanentPanchayat').updateValueAndValidity();
      // this.saveAddress.get("permanentVillage").addValidators([Validators.required]);
      // this.saveAddress.get('permanentVillage').updateValueAndValidity();
      
     
      // this.saveAddress.get("permanentMunicipal").clearValidators();
      // this.saveAddress.get("permanentWard").clearValidators();
    } else {
      // this.saveAddress.get("permanentBlock").clearValidators();
      // this.saveAddress.get('permanentBlock').updateValueAndValidity();
      // this.saveAddress.get("permanentPanchayat").clearValidators();
      // this.saveAddress.get('permanentPanchayat').updateValueAndValidity();
      // this.saveAddress.get("permanentVillage").clearValidators();
      // this.saveAddress.get('permanentVillage').updateValueAndValidity();

      // this.saveAddress.get("permanentMunicipal").addValidators([Validators.required]);
      // this.saveAddress.get('permanentMunicipal').updateValueAndValidity();
      // this.saveAddress.get("permanentWard").addValidators([Validators.required]);
      // this.saveAddress.get('permanentWard').updateValueAndValidity();
      this.saveAddress.patchValue({
        permanentBlock: null,
        permanentPanchayat: null,
        permanentVillage: null
      })
    }
  }
  setRequiredFieldscurrent()
  {
    if (this.saveAddress.value.currentArea === 1) {
      this.saveAddress.patchValue({
        currentMunicipal: null,
        currentWard: null,
      })
      // this.saveAddress.get("currentWard").clearValidators();
      // this.saveAddress.get('currentWard').updateValueAndValidity();
      // this.saveAddress.get("currentMunicipal").clearValidators();
      // this.saveAddress.get('currentMunicipal').updateValueAndValidity();

      // this.saveAddress.get("currentBlock").addValidators([Validators.required]);
      // this.saveAddress.get('currentBlock').updateValueAndValidity();
      // this.saveAddress.get("currentPanchayat").addValidators([Validators.required]);
      // this.saveAddress.get('currentPanchayat').updateValueAndValidity();
      // this.saveAddress.get("currentVillage").addValidators([Validators.required]);
      // this.saveAddress.get('currentVillage').updateValueAndValidity();
     
   
    
    } else {
      // this.saveAddress.get("currentBlock").clearValidators();
      // this.saveAddress.get('currentBlock').updateValueAndValidity();
      // this.saveAddress.get("currentPanchayat").clearValidators();
      // this.saveAddress.get('currentPanchayat').updateValueAndValidity();
      // this.saveAddress.get("currentVillage").clearValidators();
      // this.saveAddress.get('currentVillage').updateValueAndValidity();
    
  
      
    
      // this.saveAddress.get("currentMunicipal").addValidators([Validators.required]);
      // this.saveAddress.get('currentMunicipal').updateValueAndValidity();
      // this.saveAddress.get("currentWard").addValidators([Validators.required]);
      // this.saveAddress.get('currentWard').updateValueAndValidity();
      this.saveAddress.patchValue({
        currentBlock: null,
        currentPanchayat: null,
        currentVillage: null
      })
    }
  }
  onAreaItemChange() {
    if( this.saveAddress.value.permanentDistrict!=null)
    {
      this.apiService.postmdm('getMunicipalArea', { districtId: this.saveAddress.value.permanentDistrict }).subscribe({
        next: (res) => {
          if (res.status = 200) {
            this.muncipalList = res.data
          }
        },
      })
  
    }
   
    this.setRequiredFields();
  }
  onRuralUrbanChange()
  {
    if(this.saveAddress.value==1)
    {
      this.saveAddress.patchValue({
        permanentMunicipal:"",
        permanentWard:""
      })
    }else
    {
      this.saveAddress.patchValue({
        permanentBlock:"",
        permanentPanchayat:"",
        permanentVillage:""
      })
    }

    this.onAreaItemChange();
  }
  onRuralUrbanChangeCurrent()
  {
    if(this.saveAddress.value==1)
    {
      this.saveAddress.patchValue({
        currentMunicipal:"",
        currentWard:""
      })
    }else
    {
      this.saveAddress.patchValue({
        currentBlock:"",
        currentPanchayat:"",
        currentVillage:""
      })
    }

    this.onAreaItemChangeCurrent();
  }
  muncipalListcurrent:any
  onAreaItemChangeCurrent() {
   if(this.saveAddress.value.currentDistrict!=null)
   {
    this.apiService.postmdm('getMunicipalArea', { districtId: this.saveAddress.value.currentDistrict }).subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.muncipalListcurrent = res.data
        }
      },
    })
   }
    

    this.setRequiredFieldscurrent();
  }
  onItemChange1() {
    if(
      this.EmpAddress.value.permanentState!=null &&
       this.EmpAddress.value.permanentDistrict!=null
    )
    {
      let data = {
        "stateId": this.EmpAddress.value.permanentState,
        "districtId": this.EmpAddress.value.permanentDistrict,
      }
      this.apiService.postmdm('getMunicipalArea', data).subscribe({
        next: (res) => {
          if (res.status = 200) {
            this.muncipalList = res.data
          }
        },
  
      })
    }
   
  }

  getCblock() {
    if(
      this.saveAddress.value.currentDistrict!=null &&
       this.saveAddress.value.currentBlock!=null
    )
    {
    const requestedData = {
      "districtId": this.saveAddress.value.currentDistrict,
      "blockId": this.saveAddress.value.currentBlock
    }
    this.apiService.postmdm('getGramPanchayat', { ...requestedData }).subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.currentPanchayatList = res.data
        }
      },

    })
  }
  }

  getPanchayatWard2() {
    if(
      this.saveAddress.value.permanentDistrict!=null &&
       this.saveAddress.value.permanentBlock!=null
    )
    {
    const requestedData = {
     
      "districtId": this.saveAddress.value.permanentDistrict,
      "blockId": this.saveAddress.value.permanentBlock
    }
    this.apiService.postmdm('getGramPanchayat', { ...requestedData }).subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.permanentPanchayatList = res.data
          console.log("this.permanentPanchayatList",this.permanentPanchayatList)
        }
      },

    })
  }
  }

  getvillage() {
    if(
      this.saveAddress.value.permanentDistrict!=null 
    )
    this.apiService.postmdm('getVillage', { distiId: this.saveAddress.value.permanentDistrict }).subscribe({
      next: (res) => {
        this.permanentVillageList = res.data
      }
    })
  }
  
  getPanchayatWard3() {
    if(
     this.saveAddress.value.permanentState!=null &&
     this.saveAddress.value.permanentDistrict!=null &&
     this.saveAddress.value.permanentBlock!=null &&
     this.saveAddress.value.permanentPanchayat!=null
    )
    {
    let data = {
      stateId: this.saveAddress.value.permanentState,
      distiId: this.saveAddress.value.permanentDistrict,
      blockId: this.saveAddress.value.permanentBlock,
      gramPanchayatId: this.saveAddress.value.permanentPanchayat,
    }
    this.apiService.postmdm('getVillage', data).subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.permanentVillageList = res.data
        }
      },

    })
  }
  }
  getPanchayatWard4() {
    if(
      this.saveAddress.value.currentState!=null &&
      this.saveAddress.value.currentDistrict!=null &&
       this.saveAddress.value.currentBlock!=null &&
      this.saveAddress.value.currentPanchayat!=null 
    )
    {

    
    let data = {
      stateId: this.saveAddress.value.currentState,
      distiId: this.saveAddress.value.currentDistrict,
      blockId: this.saveAddress.value.currentBlock,
      gramPanchayatId: this.saveAddress.value.currentPanchayat,
    }
    this.apiService.postmdm('getVillage', data).subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.currentVillageList = res.data
        }
      },

    })
  }
  }
  getPanchayatWard() {
    if(
      this.saveAddress.value.permanentMunicipal!=null &&
      this.saveAddress.value.permanentDistrict
    )
    {
      this.apiService.postmdm('getWard', { municipalId: this.saveAddress.value.permanentMunicipal,districtId:this.saveAddress.value.permanentDistrict }).subscribe({
        next: (res) => {
          this.wardlist = res.data
        }
      })
    }
   
  }
  wardlistcurrent:any;
  getPanchayatWardcurrent() {
    if(this.saveAddress.value.currentMunicipal!=null &&
      this.saveAddress.value.currentDistrict!=null)
      {
        this.apiService.postmdm('getWard', { municipalId: this.saveAddress.value.currentMunicipal ,districtId:this.saveAddress.value.currentDistrict}).subscribe({
          next: (res) => {
            this.wardlistcurrent = res.data
            
          }
        })
      }
   
  }
  assembly = () => {
    if(this.saveAddress.value.permanentDistrict!=null)
    {
      this.apiService.postmdm('getAssembly', { districtId: this.saveAddress.value.permanentDistrict }).subscribe({
        next: (res) => {
          this.assemblyList = res.data
        }
      })
    }
  
  }
  assemblyListCurrent:any;
  assembly2 = () => {
    if(this.saveAddress.value.currentDistrict!=null)
    {
      this.apiService.postmdm('getAssembly', { districtId: this.saveAddress.value.currentDistrict }).subscribe({
        next: (res) => {
          this.assemblyListCurrent = res.data
        }
      })
    }
   
  }
  onSubmit() {
    console.log(this.saveAddress)
   
    const address = {
      permanentAddress: {
        permanentState: this.saveAddress.value.permanentState,
        permanentDistrict: this.saveAddress.value.permanentDistrict,
        permanentArea: this.saveAddress.value.permanentArea,
        permanentMunicipal: this.saveAddress.value.permanentMunicipal,
        permanentBlock: this.saveAddress.value.permanentBlock,
        permanentWard: this.saveAddress.value.permanentWard,
        permanentPanchayat: this.saveAddress.value.permanentPanchayat,
        permanentAssembly: this.saveAddress.value.permanentAssembly,
        permanentPincode: this.saveAddress.value.permanentPincode,
        permanentHouseNo: this.saveAddress.value.permanentHouseNo,
        permanentVillage: this.saveAddress.value.permanentVillage,
      },
      currentAddress: {
        currentState: this.saveAddress.value.currentState,
        currentDistrict: this.saveAddress.value.currentDistrict,
        currentArea: this.saveAddress.value.currentArea,
        currentBlock: this.saveAddress.value.currentBlock,
        currentPanchayat: this.saveAddress.value.currentPanchayat,
        currentMunicipal: this.saveAddress.value.currentMunicipal,
        currentWard: this.saveAddress.value.currentWard,
        currentVillage: this.saveAddress.value.currentVillage,
        currentPincode: this.saveAddress.value.currentPincode,
        currentHouseNo: this.saveAddress.value.currentHouseNo,
        currentAssembly: this.saveAddress.value.currentAssembly
      }
    }
    const data = { step: 3, value: address, action: this.action,validate:true };
    console.log("address",data)
    this.EmpData.emit(data);

  
  }
  verifyMobileNo(): void {
    if(this.roleid=='3')
    {
      this.onSubmit();
    }else{
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
    }
    else
    {
      alert("The Employee mobile number was not found");
    }
    }
    
  }

  verifyOtp(res:any){
    if (this.saveAddress.invalid) {
      alert("Please ensure that all fields are filled correctly and completely");
      return }
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
       
        this.onSubmit();
      }else{
        alert("The OTP (One-Time Password) was not verified")
      }
    
    })
  }
}
