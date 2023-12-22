import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-update-document',
  templateUrl: './update-document.component.html',
  styleUrls: ['./update-document.component.scss']
})
export class UpdateDocumentComponent implements OnInit {
  addDocumentForm !: FormGroup;
  Object = Object;
  pensionerDetails !: any;
  isAdded: boolean = false;
  isSubmitted: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private apiService: ApiEssService,
    public load:LoaderService
    ) { 
    this.addDocumentForm = this.formBuilder.group({
      pensionerId: ['', Validators.required],
      typeId: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  addDocument(){
    debugger;
    this.isAdded = true;
    if(this.addDocumentForm.valid){
      this.load.show();
      let data = this.addDocumentForm.value;
      this.apiService.postloantype1(data, 'getPssProfileDetails').subscribe({
        next: res => {
          if(res.status == 'SUCCESS' && res.data && res.data.length > 0){
            this.pensionerDetails = res.data[0];
            this.pensionerDetails['typeId'] = this.addDocumentForm.controls['typeId'].value;
          }else{
            this.pensionerDetails = null;
          }
        }, error: err => {
          this.load.hide();
          this.pensionerDetails = null;
          this.snackbar.show('Some Error Occured', 'danger');
        },complete: ()=> {
          this.load.hide();
        }
      })
    }
  }

  resetSearch(){
    this.addDocumentForm.reset();
    this.pensionerDetails = null;
  }


  isValidJson(value: any): boolean{
    try {
      JSON.parse(value);
    } catch (e) {
      return false;
    }

    return true;
  }
  

  submitDocumentForm(value: any){
    this.isSubmitted = true;
    console.log(value);
    if(this.isValidJson(value)){
      this.load.show();
      this.apiService.postloantype1(JSON.parse(value), 'updatePsnProfileDetails').subscribe({
        next: res => {
          if(res.data && res.data['status']){
            this.snackbar.show(res.data['msg'], 'success');
          }else{
            this.snackbar.show('Some Error Occured', 'danger');
          }
        }, error: err => {
          console.log(err)
          this.load.hide();
          if(err?.error && err?.error.description){
            this.snackbar.show(err?.error.description, 'danger');
          }else{
            this.snackbar.show('Some Error Occured', 'danger');
          }
          
        },complete: ()=> {
          this.load.hide();
        }
      })
    }else{
      this.snackbar.show("Entered JSON is not valid", 'danger');
    }
  }

}
