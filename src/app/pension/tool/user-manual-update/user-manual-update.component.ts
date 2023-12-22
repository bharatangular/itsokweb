import { PensionServiceService } from 'src/app/services/pension-service.service';
import { dataSource } from './../../reports/psn-pending-files/psn-pending-files.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Console } from 'console';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { CommonService } from 'src/app/services/common.service';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { UserManualFormComponent } from '../user-manual-form/user-manual-form.component';

@Component({
  selector: 'app-user-manual-update',
  templateUrl: './user-manual-update.component.html',
  styleUrls: ['./user-manual-update.component.scss'],
})
export class UserManualUpdateComponent implements OnInit {
  stateValue: string;
  act: boolean = false;
  deact: boolean = true;
  userManual: any = {};
  selected: string;
  showForm: boolean = false;
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  serviceRecordDatanew: any;
  userDetails: any;
  userManualName: string;
  flag: number = 0;
  jsonString: any;
  mstType: string = '4';
  mstList: any = {};
  userTypeList: any[] = [];
  uniqueUserTypes: any[] = [];
  IsAcc: boolean = false;
  file: any;
  fileName: string;
  docIdValue: any;
  docId: any;
  isLoading2: boolean;
  documentlist: any;
  userManualform: any;
  displayedColumns: string[] = [
    'sno',
    'userManualName',
    'userType',
    'createdDt',
    'modifiedDt',
    'view',
    'Action',
    'isActive',
  ];
  dataSource!: MatTableDataSource<any>;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selectedUserTypeText: any;
  isDeStatus: boolean;
  // sortedData:this.userTypeList;
  constructor(
    private fb: FormBuilder,
    private _Service: PensionServiceService,
    public common: CommonService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.userManualform = this.fb.group({
    //   user_manual_name: new FormControl('', Validators.required),
    //   doc_id: new FormControl('',Validators.required),
    //   user_type: new FormControl('', Validators.required),
    //   isActive : new FormControl('', Validators.required)
    // });

    this.mstList = {
      mstType: this.mstType,
    };

    this.jsonString = JSON.stringify(this.mstList);
    console.log(this.jsonString);

    console.log('hello');

    this.getmanuals();


  }
  getStatusText(isActive: string): string {
    return isActive === 'Y' ? 'Active' : 'Deactive';
  }
  getStatusStyle(isActive: string): { [key: string]: string } {
    if (isActive === 'Y') {
      return { color: 'green' };
    } else {
      return { color: ' rgb(40, 5, 243)' };
    }
  }



  getmanuals() {
    let mstList = {
      mstType: this.mstType,
    };

    this._Service
      .getPsnDetailsView('getManuals', mstList)
      .subscribe((res: any) => {
        console.log('works');
        console.log(res.data);
        this.userTypeList = res.data;
        this.dataSource = new MatTableDataSource(this.userTypeList);
        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
        this.sort.sort({id:'createdDt',start:'desc',disableClear:false})

        // console.log(this.userTypeList);
        // console.log(res.data);
      });
  }

  // convertintoString(data:any)
  // {
  //   if(typeof(data)=='object')
  //   {
  //     return JSON.stringify(data)
  //   }
  //   else {
  //     return data
  //   }

  // }

  // checkar_doc(event: any) {

  //   let time1 = new Date();

  //   this.file = event.target.files[0];
  //   let ex2: any[] = this.file.name.split(".");
  //   console.log("size", this.file.size / 1024)
  //   if (ex2[1].includes('PDF') || ex2[1].includes('pdf')) {

  //   } else {
  //     alert("Only PDF file format allowed")
  //     return;
  //   }

  //   if ((this.file.size / 1024) > 2048) {
  //     alert("Max 2 MB file size allowed")
  //     return;
  //   }

  //   this.fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + "." + ex2[1];
  //   this.fileName = this.fileName.replace(" ", "")
  //   const formData = new FormData();
  //   formData.append("file", this.file);
  //   formData.append("filename", this.fileName);
  //   this.isLoading2=true
  //   const docTypeId = "20"

  //   this._Service.postOr("wcc/uploadfile",formData).subscribe((res:any)=>{
  //     this.documentlist = res.data.document;

  //     console.log("docId ---->  "  + res.data.document[0].docId);

  //     this.docIdValue = res.data.document[0].docId;

  //     this.docId  = res.data.document[0].docId;
  //     console.log(this.documentlist);
  //     console.log(res.data.document);
  //     this.isLoading2=false;
  //     let data =
  //       {
  //         "docTypeId": docTypeId,
  //         "dmsDocId": res.data.document[0].docId,
  //         "docName": "User Manual Document",
  //       }

  //       if (res.data.document[0].docId) {
  //         let rajIndex = -1;
  //         console.log("document list" + this.documentlist)
  //         this.documentlist.filter((data: any, index: number) => {
  //           console.log("data " + data);
  //           if (data.docName == "User Manual Document") {
  //             // console.log(data.docName);
  //             rajIndex = index;
  //             console.log("rajIndex : " + rajIndex);
  //             return data;
  //           }
  //         })
  //         if (rajIndex == -1) {
  //           console.log()
  //           this.documentlist.push(data);
  //         } else {
  //           this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
  //         }
  //         console.log("document_list", this.documentlist);

  //         alert("Document Uploaded Successfully.")
  //         this.IsAcc = true;
  //       } else {
  //         alert("Some error occured.")
  //       }

  //   },(error)=>{
  //     this.isLoading2=false;
  //     alert("Some Error Occured")
  //   })
  // }

  editItem(item: any) {
    console.log("Here in edit >>>>>>>>>>>>>>>>>>>>>>>>")
    console.log(item.docId);
    console.log(item.createdDt);
    console.log(item.userManualName);
    console.log(item.userTypeId);
    console.log(item.userType)
    console.log(this.userTypeList);
    this.flag = 1;
    let data = {
      userManualName: item.userManualName,
      userTypeId: item.userTypeId,
      isActive: item.isActive,
      flag: this.flag,
      createdDt:item.createdDt,
      docId:item.docId,
      userType:item.userType
    };

    console.log("inside edit ",data)

    this.dialog.open(UserManualFormComponent, {
      width: '70%',
      data: { message: data },
      disableClose: false,
    });

    console.log(item);

    console.log(item.userType);

    this.userManualform.patchValue({
      user_manual_name: item.userManualName,
      user_type: item.userTypeId,
    });

    console.log(this.userManualform);
  }

  // activate(){
  //   this.act  = ! this.act
  //   this.deact = ! this.deact

  //   const currentControlValue = this.userManualform.get('isActive').value;

  //   console.log("current control value " +  currentControlValue);

  //   if(currentControlValue){
  //     this.stateValue = 'Y'
  //   }
  //   else{
  //     this.stateValue = 'N'
  //   }

  //   console.log("status " + this.stateValue);
  //   //  this.userManualform.get('isActive').setValue(currentControlValue === true ? 'Y' : 'N');
  //   // console.log(  this.userManualform.get('isActive'));

  // }

  clickAdd() {
    this.dialog.open(UserManualFormComponent, {
      width: '70%',
      disableClose: false,
    });
  }

  // onSubmit(){

  //   if (this.userManualform.invalid) {
  //     // If the form is invalid, do not submit
  //     console.log("not submitting");
  //     return;
  //   }

  //   console.log(this.userManualform);
  //   alert(this.userManualform);

  //   const currentDate = new Date();

  // // Format the date as "YYYY-MM-DD"
  // const year = currentDate.getFullYear();
  // const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  // const day = String(currentDate.getDate()).padStart(2, '0');

  // const formattedDate = `${year}-${month}-${day}`;

  //   console.log("#############")
  //   console.log(this.userManualform.value.doc_id)

  //   let data = {
  //     "user_manual_name":this.userManualform.value.user_manual_name,
  //     "doc_id": this.docIdValue,
  //     "created_dt" :formattedDate,
  //     "modified_dt":formattedDate,
  //     "isActive":this.stateValue,
  //     "user_type": this.selectedUserTypeText,
  //     "user_type_id":this.userManualform.value.user_type,
  //     "flag":this.flag
  //   }

  //   this._Service.saveUserManual(data,"usermanual").subscribe((res:any)=>{

  //     console.log(res.data);

  //   })

  // }

  // fetchUserType(event:any){
  //   alert("hello");

  //    const selectedUserTypeId = event.value;

  // // Find the corresponding userType object based on userTypeId
  //   const selectedUserType = this.userTypeList.find(userType => userType.userTypeId === selectedUserTypeId);

  // // Now, selectedUserType contains the whole userType object
  //  if (selectedUserType) {
  //   this.selectedUserTypeText = selectedUserType.userType;
  // } else {
  //   this.selectedUserTypeText = ''; // Handle the case when no matching userType is found
  // }
  //   console.log(this.selectedUserTypeText);
  // }

  // showHideFields(val: any) {

  //   if (val === 1) {
  //     this.isDeStatus = true;
  //   } else {
  //     this.isDeStatus = false;

  //   }

  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
