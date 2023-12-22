import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-first-pension-dialog',
  templateUrl: './first-pension-dialog.component.html',
  styleUrls: ['./first-pension-dialog.component.scss'],
})
export class FirstPensionDialogComponent implements OnInit {
  displayedColumns: string[] = ['select', 'module'];

  stopReasonForm!: FormGroup;

  message: string = '';
  id!: number;
  // First Pension Variables
  files: any[] = [];
  listArray: any;
  isBtnHideShow: boolean = false;
  ischecked: boolean = false;
  stopReasonData: any;

  commonRemark: any = '';
  deathDate: any = '';
  orderDate: any = '';
  orderNo: any = '';
  flag: any;
  cheked: any;
  file: any = '';
  chequeFile: any;
  attributesArray: any;
  headerValue: any;
  //  accordianData:any=1;
  chkValue: any;
  panelOpenState = false;
  isDeath: boolean = false;
  hideShowField: any;
  ppoNumber: any;
  gpoNumber: any;
  cpoNumber: any;
  aid: any;
  userId: any;
  isLoading: boolean = false;

  isShow: boolean = false;
  Spinner: boolean = false;
  Showpopup: boolean = true;

  constructor(
    private _Service: PensionServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,private dialog:MatDialogRef<FirstPensionDialogComponent>,private router:Router
  )

  {
    this.message = data.title;
    this.ppoNumber = data.ppoNumber;
    this.gpoNumber = data.gpoNumber;
    this.cpoNumber = data.cpoNumber;
    this.aid = data.aid;
    this.userId = data.userId;
    dialog.disableClose=true;
  }

  ngOnInit(): void {
    this.stopReasonForm = this.formBuilder.group({
      addDynamicElement: this.formBuilder.array([]),
    });
    this.getStopReason();
  }

  get addDynamicElement() {
    return this.stopReasonForm.get('addDynamicElement') as FormArray;
  }
  titleName: any;
  getStopReason() {
   
    this._Service.getStopReasonList('getStopReasons').subscribe({
      next: (res) => {
        if (res.status === 'SUCCESS') {
          if (res == '') {
            alert('Not Record Found');
          } else {
            this.stopReasonData = res.data;
            this.stopReasonData.forEach(function (item: any) {
              item.checked = false;
            });
            this.stopReasonData.forEach((row: any) => {
              this.addDynamicElement.push(
                this.formBuilder.group({
                  reasonName: [row.reasonDesc],
                  reasonId: [row.reasonId],
                  checked: [false],
                  remark: new FormControl(),
                  date: new FormControl(),
                  fileName: new FormControl(),
                  orderNo: new FormControl(),
                  docId: new FormControl(),
                })
              );
            });

            console.log(this.stopReasonData);
          }
        }
      },
      error: (err) => {
        console.log(err);
        // this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      },
    });
  }

  onchangedeath(id: any) {
   
    alert(id);
    this.hideShowField = id;
  }
  onChangeChecked(row: any, evenet: any) {
    console.log(row);
    console.log(row.value.checked);
    /*   if(evenet.checked){
    row.value.checked = true
  } */
    //evenet.checked === true ? row.value.checked = true : row.value.checked = false;
  }

  documentDmsId: any;
  // for browse document 
  onChangeCheque(index: number, event: any) {
    this.file = event.target.files[0];
    //row.value.fileName = event.target.files[0].name;

    this.toBase64(this.file).then((data) => {
      //row.value.base64 = data;
      this.addDynamicElement.at(index).patchValue({
        fileName: event.target.files[0].name,
        base64: data,
      });
      console.log(this.addDynamicElement.value);
    });

    
  }
  fileName:any;
  documentList:any;
uploadDoc()
{if(this.file)
  {
    let time1=new Date()
    this.fileName =  "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() ;
      
      const docTypeId = "8"
      const reader = new FileReader();
      var data4: any;
      reader.onloadend = () => {
        console.log(reader.result);
        // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
        data4 = reader.result;
        let data5 = data4.toString()
        data5 = data5.replace("data:application/pdf;base64,", "")
        console.log(data4);
        let data = {
          "type": "pension",
          "sourceId": 2,
          "docAttributes": [
  
          ],
          "data": [
            {
              "docTypeId": docTypeId,
              "docTypeName": "doc",
              "docName": this.fileName,
              "docTitle": "payStop",
              "content": data5
            }
          ]
        }
        console.log("data", data);
  
        this._Service.postOr("wcc/uploaddocs", data).subscribe((res: any) => {
          console.log("res", res);
          console.log(res.data.document[0].docId)
          let data =
          {
            "docTypeId": docTypeId,
            "dmsDocId": res.data.document[0].docId,
            "docName": "stop_pay",
          }
        this.documentList=data
        console.log( this.documentList)
          if (res.data.document[0].docId) {      
            
           
           
          } else {
            alert("Some error occured.")
          }
          this.stopReasonFun()
        })
      };
      reader.readAsDataURL(this.file);
  }else
  {
    alert("First select document")
  }
  
}


toBase64 = (file: any) =>
    new Promise((resolve, reject) => 
    {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  removeCheque(index: number, event: any)
   {
    this.addDynamicElement.at(index).patchValue({
      fileName: '',
      base64: '',
    });
  }

stopReasonFun() {
  
    
if(!this.documentList.dmsDocId)
{
  alert("First upload all documents successfully");
  return;
}
  

    let data = {
      userData: {
        ppoNumber: this.ppoNumber ? this.ppoNumber : 0,
        gpoNumber: this.gpoNumber ? this.gpoNumber : 0,
        cpoNumber: this.cpoNumber ? this.cpoNumber : 0,
        assignmentId: +this.aid ? this.aid : '',
        userId: +this.userId ? this.userId : '',
        documentList:this.documentList
      },
      payLoad: this.addDynamicElement.value.filter(
        (x: any) => x.checked === true
      ),
    };
   
    console.log("data",data)
    this.isLoading = true;
    this._Service.add_Reason(data, 'saveStopReason').subscribe({
      next: (res) => {
       console.log(res)
        if (res.status === 'SUCCESS') {
          this.isShow = true;
          this.isLoading = false;
        } else {
          alert('Something went wrong........');
          this.isShow = false;
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.log(err);
        // this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      },
    });
  
  }
  redirectTo()
  {
    window.location.reload(); 
   }


    
}
