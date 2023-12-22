import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { CommonService } from 'src/app/services/common.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};
@Component({
  selector: 'app-mark-vrs',
  templateUrl: './mark-vrs.component.html',
  styleUrls: ['./mark-vrs.component.scss'],
  providers: [
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false } },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class MarkVrsComponent implements OnInit {
  @ViewChild('uploadFile') myInputVariable: ElementRef;
  resultNomineeData:any=[{
    nameOfNominee: '',
    relationName: '',
    relationshipId: '', 
    share: ''
  }
  ];
  nomineelist:any=[];
  nomineeArray:any=[];
  isLoading:boolean=false
  // empDocumentArray:any=[];
  selectedNominee: any = [];
  isNominee: boolean = false; 
  searchEmployeeForm : any = FormGroup;
  currentDate: Date = new Date();
  totalAmount: number = 0;
  selectedPerson: any = [];
  parse!: {
    dateInput: 'LL';
  };
  display!: {
    dateInput: 'DD/MM/YYYY';
  };
  otherThenWife = '';
  rType='VRS';
  loading = false;
  resultServiceData:any = '';
  resultEmpData: any = '';
  documentListData: any = [];
  documentId: any = '';
  isSubmitted: boolean = false;
  isSearch: boolean = false;
  fileName: string = '';
  userDetails:any;
  config:AppConfig=new AppConfig();
  notEligible:boolean=true
  constructor(
    private formbuilder: FormBuilder,
    private _Service: PensionServiceService,
    private DatePipe: DatePipe,
    private fb:FormBuilder,
    private datePipe: DatePipe,
    public router:Router,
    public dialogref:MatDialog,
    public common:CommonService
  ) {

    this.searchEmployeeForm = this.formbuilder.group({ 
      retirementTypes: new FormControl('VRS'),
      retirementRemarks: new FormControl('', Validators.required),    
      lastWorkingDate: new FormControl('', Validators.required),    
      attachDocument: new FormControl('',Validators.required ),
      empCode: new FormControl('',Validators.required),     
      nominee: this.fb.array([]),  
      // empDocumentArray: this.fb.array([])
    });  
   }

  ngOnInit(): void {
    // this.employeeDocument();
    this.userDetails=this.config.getUserDetails();
  }

  get searechEmpFormControl() {
    return this.searchEmployeeForm.controls;
  }

  resultNominee(nomineeType:any){
    this.selectedNominee = []; 
    console.log(this.resultNomineeData);
    if(this.resultNomineeData && Array(this.resultNomineeData) && this.resultNomineeData.length > 0){
      if(nomineeType == 'Wife'){
        this.selectedNominee = this.resultNomineeData.filter((item: any)=> item.relationName == nomineeType);
      }else{
        this.selectedNominee = this.resultNomineeData.filter((item: any)=> item.relationName !='Wife');
      }
    }
    

    const nomineeArray = (this.searchEmployeeForm.get('nominee')as FormArray);   

    for(let i=0; i< nomineeArray.length; i++){
      nomineeArray.removeAt(i);
    }

    for(let i=0; i< this.selectedNominee.length; i++){
      nomineeArray.removeAt(i);
    }
    // console.log(nomineeArray)
    for (let i = 0; i < this.selectedNominee.length; i++) {
      nomineeArray.push(new FormGroup({
        nameOfNominee: new FormControl(this.selectedNominee[i]["nameOfNominee"]),
        relationName: new FormControl(this.selectedNominee[i]["relationName"]),
        relationshipId: new FormControl(this.selectedNominee[i]["relation"]),
        share: new FormControl(this.selectedNominee[i]["share"].toString()),
        nomineePersion: new FormControl(),
      }))
    }
  }
  
  clickOtherThenWifeType(types:any){
    this.otherThenWife = types;
    this.selectedNominee = [];
    const controls = (this.searchEmployeeForm.get('nominee')as FormArray);  
    for(let i=0; i< controls.length; i++){
      controls.removeAt(i);
    }     
    this.resultNominee(types);
  }
  
  

  clickRetirementTypes(types:any){
    this.rType=types;
    if(this.rType == 'death'){
      this.otherThenWife = 'No';
    }
    this.selectedNominee = [];
    this.isNominee  = false;
    if(this.rType=="death"){
      this.resultNominee("Wife");
      this.isNominee = true;
    }

    console.log(this.isNominee)
  }

  selectNomineePerson(item:any, i: number){
    let nomineeArray=(this.searchEmployeeForm.get('nominee')as FormArray);
    let nomineeArrayValue=nomineeArray.value;
      if(nomineeArrayValue[i].nomineePersion){
        this.totalAmount += Number(nomineeArrayValue[i].share);
        if(this.totalAmount>100){
          alert("total shares can't be greater than 100 percent");
          nomineeArrayValue[i].nomineePersion=false;
          this.selectedPerson[i] = null;
         }
    }else{
      this.totalAmount -= Number(nomineeArrayValue[i].share);
    }
    console.log(this.totalAmount)
   }

  searchEmpBasiceDetailsApi(empCode: any ){
    this.isSearch = true;
     if(empCode){
      this.loading = true;
      let data = {
        "employeeId": empCode,
        "officeId": this.userDetails.officeid
      }
      
      this._Service.postRequestpension(data, "getEmployeeDetails").subscribe({
        next: (res) => {
          this.loading = false;
          if (res.status = "SUCCESS") {
            if(res.data.msg){
              alert(res.data.msg);
            }else if(res.data){
              this.resultEmpData = res.data.employeePersonalDetail;
              this.resultServiceData = res.data.employeeServiceDetails;
              let resultFamilyData: any = res.data.employeeFamilyDetails.employeeFamilyDetails;
              console.log(resultFamilyData);
              this.resultNomineeData = resultFamilyData?.nomineeDetails;
              
             console.log(this.resultEmpData.dateOfRetirement)
             let minVrsDate=new Date("25-Oct-2023")
             console.log(minVrsDate)
             let data=new Date(this.resultEmpData.dateOfRetirement)
             console.log(data)
           if(data<minVrsDate)
            {
              this.notEligible=false;
              alert("Please mark VRS on IFMS-2.0.Employee is not eligible in IFMS-3.0");
              
            }
            }
          }else{
            alert('Something went wrong');
            this.resultEmpData = '';
            this.resultServiceData = ''; 
          }
        },
        error: (err) => {
          this.loading = false;
          this.resultEmpData = '';
          this.resultServiceData = ''; 
          if(err.description){
            alert(err.description);
          }
        }
      })
    }
  }

  // employeeDocument(){
  // const empDocumentArray = (this.searchEmployeeForm.get('empDocumentArray')as FormArray);  
  //   empDocumentArray.push(new FormGroup({        
  //       attachDocument: new FormControl(),
  //     }))
  // }
file:any;

  uploadfile(event: any) {
    this.file = event.target.files[0];
    let ex22: any[] = this.file.name.split(".");
    console.log("size", this.file.size / 1024)
    if (ex22[1].includes('PDF') || ex22[1].includes('pdf')) {
  
    } else {
      alert("Only PDF file format allowed")
      return;
    }
  
    if ((this.file.size / 1024) > 2048) {
      alert("Max 2 MB file size allowed")
      return;
    }
    if(!this.file)
    {
      alert("Upload sanction order.");
      return
    }
    
    let time1=new Date();
    let ex2: any[] = this.file.name.split(".");
   
    this.fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + "." + ex2[1];;
    

    const formData = new FormData();
    formData.append("file", this.file);
    formData.append("filename", this.fileName);
   this.isLoading=true;
    this._Service.postOr("wcc/uploadfile",formData).subscribe((res:any)=>{
      this.isLoading=false;
        if (res.data.document[0].docId)         
        {
          this.documentId =  res.data.document[0].docId;
        alert("Document upload successfully ")
        }

    },(error)=>{
      this.isLoading=false;
      alert("Some Error Occured in image upload")
    })

    
  }

  onSubmit(){
    this.isSubmitted = true;
    let jsonData: any = {}; 
    let nomineeRowArray:any[] = [];

    if(this.searchEmployeeForm.valid){
      if(confirm('Are you sure you want to submit')){
        let nomineeData= this.searchEmployeeForm.value.nominee;
        nomineeRowArray =  nomineeData.filter((data: any) => data['nomineePersion'] == true);
          jsonData ={
            "employeeId":this.resultEmpData.employeeId,
            "employeeCode": this.searchEmployeeForm.get('empCode').value.toString().trim(),
            "dateOfRetirement":  this.datePipe.transform(this.resultEmpData.dateOfRetirement, 'dd-MMM-yyyy'),
            "lastWorkingDate": this.datePipe.transform(this.searchEmployeeForm.value.lastWorkingDate, 'dd-MMM-yyyy'),
            "retirementTypes":this.searchEmployeeForm.value.retirementTypes,
            "documentId":this.documentId,
            "remark":this.searchEmployeeForm.value.retirementRemarks
          }
          
          jsonData['nominee']=nomineeRowArray;
    
          this._Service.postCumm("savepensionermark",jsonData).subscribe({
            next: (res:any) => {
              this.isLoading=false;
              
              if (res.data) {
               
                this.myInputVariable.nativeElement.value = '';
                this.searchEmployeeForm.attachDocument=''
                if(res.data.message=='Data Save Successfully')
                {
                  this. getRefBaseData();
                  alert("Your request submitted successfully. Your Mark VRS Pension Id is " +res.data.markPnsId);
                }                
                else if(res.data.message=="Data Already Exists ")
                alert("Already Submmited.");
                this.searchEmployeeForm.reset();
                this.resultEmpData = '';
                this.resultServiceData = '';
                this.isSearch = false;
                this.isSubmitted = false;
                this.isNominee = false;
                this.file=''
                this.dialogref.closeAll();
                // this.router.navigate(['pension/Inbox'])
              }else{
                alert("Something went wrong");
              }
            },
            error: (err) => {
              this.isLoading=false;
              alert("Something went wrong");
             
            }
          })
      }

    }else
    {
      alert("Fill all fields properly.")
    }
  }
  getRefBaseData()
  {
    
    let data = {
      "employeeCode": this.searchEmployeeForm.get('empCode').value.toString().trim(),
      "employeeId": 0,
      "empStatus": 1,
      "inType": 4,
    }
    this._Service.postNewEmployee('getPensionRevertEmpDetails', data).subscribe((res: any) => {
 
    },
      (error) => 
          {}
          //console.log(error) 
        )

      }
      deletedocument()
      {
        this.documentId=null;
      }
}

