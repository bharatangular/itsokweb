import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Console } from 'console';

@Component({
  selector: 'app-family-details-popup',
  templateUrl: './family-details-popup.component.html',
  styleUrls: ['./family-details-popup.component.scss']
})
export class FamilyDetailsPopupComponent implements OnInit {

  fieldEnableDisable = true;

  familyDetails !: any;
  childPage !: any;
  updateConfirm !: Boolean;

  constructor(private formbuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private updateDialogRef: MatDialogRef<FamilyDetailsPopupComponent>) {

  }

  ngOnInit(): void {
    
    this.childPage = this.data.parentPage;
    
    this.familyDetails = this.data.parentPage;

    console.log("AFTER Stringify :"+JSON.stringify(this.childPage));
    console.log("AFTER familyDetails  :"+this.familyDetails);
  }



  // 
  public updateRecord() {
    this.updateConfirm = true;
    this.updateDialogRef.close({data: this.familyDetails});
    // this.updateDialogRef.close({event: `close`, data: this.familyDetails});
  }

}
