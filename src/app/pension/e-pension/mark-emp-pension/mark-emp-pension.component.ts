import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-mark-emp-pension',
  templateUrl: './mark-emp-pension.component.html',
  styleUrls: ['./mark-emp-pension.component.scss']
})
export class MarkEmpPensionComponent implements OnInit {  
  resultNomineeData:any=[{
    nameOfNominee: '',
    relationName: '',
    relationshipId: '', 
    share: ''
  }
  ];
  nomineelist:any=[];
  nomineeArray:any=[];
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
  rType='';
  loading = false;
  resultServiceData:any = '';
  resultEmpData: any = '';
  documentListData: any = [];
  documentId: any = '';
  isSubmitted: boolean = false;
  isSearch: boolean = false;
  fileName: string = '';
  constructor(
    private formbuilder: FormBuilder,
    private _Service: PensionServiceService,
    private DatePipe: DatePipe,
    private fb:FormBuilder,
    private datePipe: DatePipe
  ) {

    this.searchEmployeeForm = this.formbuilder.group({ 
      retirementTypes: new FormControl('',Validators.required),
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
        "employeeId": empCode
      }
      
      this._Service.postRequestpension(data, "getEmployeeDetails").subscribe({
        next: (res) => {
          this.loading = false;
          if (res.status = "SUCCESS") {
            if(res.data.Message){
              alert(res.data.Message);
            }else if(res.data){
              this.resultEmpData = res.data.employeePersonalDetail;
              this.resultServiceData = res.data.employeeServiceDetails;
              let resultFamilyData: any = res.data.employeeFamilyDetails.employeeFamilyDetails;
              console.log(resultFamilyData);
              this.resultNomineeData = resultFamilyData?.nomineeDetails;
              console.log(this.resultNomineeData);
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

  onFileSelected(event: any) {
    let currentdate=new Date();
    let file = event.target.files[0];
    this.fileName = "Mark_Pension"+currentdate.getHours()+currentdate.getMinutes().toString();
    const docTypeId = "17"
    const reader = new FileReader();
    var data4:any;
    reader.onloadend = () => {
        data4=reader.result;
        let data={
          "type": "pension",
          "sourceId": 2,
          "docAttributes": [
              
          ],
          "data": [
              {
                  "docTypeId": 17,
                  "docTypeName": "Mark_Pension",
                  "docName": this.fileName,
                  "docTitle": "Certificate",
                  "content": data4
              }
          ]
      }
      // console.log(data);
        this._Service.postOr("wcc/uploaddocs",data).subscribe((res:any)=>{
          // console.log("res",res);
          this.documentId =  res.data.document[0].docId;
          // const controls = (this.searchEmployeeForm.get('empDocumentArray')as FormArray);  
          // controls.push(new FormGroup({        
          //     attachDocument: new FormControl(this.documentId),
          //   }))
        })
    };
    reader.readAsDataURL(file);
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
            "employeeId":this.resultEmpData.employeeId.toString(),
            "employeeCode": this.searchEmployeeForm.get('empCode').value.toString().trim(),
            "dateOfRetirement":  this.datePipe.transform(this.resultEmpData.dateOfRetirement, 'yyyy-MM-dd'),
            "lastWorkingDate": this.datePipe.transform(this.searchEmployeeForm.value.lastWorkingDate, 'yyyy-MM-dd'),
            "retirementTypes":this.searchEmployeeForm.value.retirementTypes,
            "documentId":this.documentId
          }
          
          jsonData['nominee']=nomineeRowArray;
    
          this._Service.postPssRequest(jsonData, "savepensionermark").subscribe({
            next: (res) => {
              if (res.status == "SUCCESS") {
                let data = JSON.parse(res.data);
                alert("Your request submitted successfully. Your Mark Pension Id is " +data.markPnsId);
                this.searchEmployeeForm.reset();
                this.resultEmpData = '';
                this.resultServiceData = '';
                this.isSearch = false;
                this.isSubmitted = false;
                this.isNominee = false;
              }else{
                alert("Something went wrong");
              }
            },
            error: (err) => {
              alert("Something went wrong");
              let errorObj = {
                message: err.message,
                err: err,
                response: err
              }
            }
          })
      }

    }
  }
}
