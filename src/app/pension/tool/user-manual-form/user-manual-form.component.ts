import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Console } from 'console';
import { CommonService } from 'src/app/services/common.service';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-user-manual-form',
  templateUrl: './user-manual-form.component.html',
  styleUrls: ['./user-manual-form.component.scss'],
})
export class UserManualFormComponent implements OnInit {
  stateValue: string = 'Y';
  act: boolean = false;
  isView:boolean = false;
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
  jsonString: any;
  mstType: string = '4';
  mstList: any = {};
  userTypeList: any[] = [];
  uniqueUserTypes: any[] = [];
  IsAcc: boolean = false;
  file: any;
  fileName: string;
  docIdValue: any;
  //  userTypeList :any = {};
  docId: any;
  isLoading2: boolean;
  documentlist: any;
  userManualform: any;
  displayedColumns: string[] = [
    'usermanualname',
    'usertype',
    'createdDate',
    'modifiedDate',
    'view',
    'Action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedUserTypeText: any;
  isDeStatus: boolean;

  constructor(
    private fb: FormBuilder,
    private _Service: PensionServiceService,
    public common: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserManualFormComponent>,
    private router: Router
  ) {
    console.log('into constructor ====>  ', this.data);

    this.userManualform = this.fb.group({
      userManualName: new FormControl('', Validators.required),
      docId: new FormControl('', Validators.required),
      userType: new FormControl('', Validators.required),
      userTypeId:new FormControl(''),
      isActive: new FormControl(true, Validators.required),
      flag: new FormControl(0),
      createdDt: new FormControl(),
      modifiedDt: new FormControl(),
      // isActive : new FormControl(true)
    });

    // this.userManualform = this.fb.group({
    //   user_manual_name: new FormControl('', Validators.required),
    //   doc_id: new FormControl('', Validators.required),
    //   user_type: new FormControl('', Validators.required),
    //   user_type_id:new FormControl(''),
    //   isActive: new FormControl(true, Validators.required),
    //   flag: new FormControl(0),
    //   created_dt: new FormControl(),
    //   modified_dt: new FormControl(),
    //   // isActive : new FormControl(true)
    // });



  }

  ngOnInit(): void {
    this.mstList = {
      mstType: this.mstType,
    };

    this.jsonString = JSON.stringify(this.mstList);
    console.log(this.jsonString);
    console.log("userTypelIst here: " ,this.userTypeList )
      this.uniqueUserTypes = [{userTypeId:"1",userType:"Employee"},{userTypeId:"2",userType:"Pensioner"},{userTypeId:"3",userType:"Department"},{userTypeId:"4",userType:"All"}]
    // console.log("After Assign " , this.userTypeList)
    this._Service
      .getPsnDetailsView('getManuals', this.mstList)
      .subscribe((res: any) => {
        console.log('works');

        this.userTypeList = res.data;
        console.log("userbhj ====================>", this.userTypeList)




        // this.uniqueUserTypes = Array.from(new Set(this.userTypeList.map(userType => userType.userType)));
        // console.log(this.uniqueUserTypes)
        // this.uniqueUserTypes = Array.from(new Set(this.userTypeList.map(userType => userType.userType))).map(userType => {
        //   return {
        //     userTypeId: this.userTypeList.find(u => u.userType === userType)?.userTypeId || '',
        //     userType: userType
        //   };
        // });

        //this.uniqueUserTypes = this.userTypeList.filter((item, index, self)=> index=== self.findIndex((t:any)=>t.userTypeId === item.userTypeId));
        console.log(" this.uniqueUserTypes",  this.uniqueUserTypes)

//         const userTypeMap :any={};
// this.uniqueUserTypes = this.userTypeList.filter(userType => {
//   if (!userTypeMap[userType.userType]) {
//     userTypeMap[userType.userType] = true;
//     return true;
//   }
//   return false;
// });


        console.log("uniqueTypes ======>" ,this.uniqueUserTypes);
        this.dataSource = new MatTableDataSource(this.userTypeList);
        this.dataSource.paginator = this.paginator;
        console.log(this.userTypeList);
        console.log(res.data);
       });

    console.log('hello');

    console.log("data inside ngOnIt: " , this.data.message.userTypeId)

     this.validateData(this.data);


  }


  getUniqueDataFromList() {
    this.uniqueUserTypes = Array.from(
      new Set(this.userTypeList.map((userType) => userType.userType))
    );
    console.log('unique data =>>>>>', this.uniqueUserTypes);
  }

  convertintoString(data: any) {
    if (typeof data == 'object') {
      return JSON.stringify(data);
    } else {
      return data;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  checkar_doc(event: any) {
    let time1 = new Date();

    this.isView = true;
    this.file = event.target.files[0];
    let ex2: any[] = this.file.name.split('.');
    console.log('size', this.file.size / 1024);
    if (ex2[1].includes('PDF') || ex2[1].includes('pdf')) {
    } else {
      alert('Only PDF file format allowed');
      return;
    }

    if (this.file.size / 1024 > 2048) {
      alert('Max 2 MB file size allowed');
      return;
    }

    this.fileName =
      'doc' +
      time1.getDate() +
      (time1.getMonth() + 1) +
      time1.getFullYear() +
      time1.getHours() +
      time1.getMinutes() +
      time1.getMilliseconds().toString() +
      '.' +
      ex2[1];
    this.fileName = this.fileName.replace(' ', '');
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('filename', this.fileName);
    this.isLoading2 = true;
    const docTypeId = '20';

    this._Service.postOr('wcc/uploadfile', formData).subscribe(
      (res: any) => {
        this.documentlist = res.data.document;

        console.log('docId ---->  ' + res.data.document[0].docId);

        this.docIdValue = res.data.document[0].docId;

        this.docId = res.data.document[0].docId;
        console.log(this.documentlist);
        console.log(res.data.document);
        this.isLoading2 = false;
        let data = {
          docTypeId: docTypeId,
          dmsDocId: res.data.document[0].docId,
          docName: 'User Manual Document',
        };

        if (res.data.document[0].docId) {
          let rajIndex = -1;
          console.log('document list' + this.documentlist);
          this.documentlist.filter((data: any, index: number) => {
            console.log('data ' + data);
            if (data.docName == 'User Manual Document') {
              // console.log(data.docName);
              rajIndex = index;
              console.log('rajIndex : ' + rajIndex);
              return data;
            }
          });
          if (rajIndex == -1) {
            console.log();
            this.documentlist.push(data);
          } else {
            this.documentlist[rajIndex].dmsDocId = res.data.document[0].docId;
          }
          console.log('document_list', this.documentlist);

          alert('Document Uploaded Successfully.');
          this.IsAcc = true;
        } else {
          alert('Some error occured.');
        }
      },
      (error) => {
        this.isLoading2 = false;
        alert('Some Error Occured');
      }
    );
  }

  // editItem(item:any){
  //   console.log(item);

  //   console.log(item.userType);

  //   this.userManualform.patchValue({
  //     user_manual_name: item.userManualName,
  //     user_type: item.userTypeId,
  //   });

  //   console.log(this.userManualform);

  // }

  activate() {
    this.act = !this.act;
    this.deact = !this.deact;

    const currentControlValue = this.userManualform.get('isActive').value;

    console.log('current control value ' + currentControlValue);

    if (currentControlValue) {
      this.stateValue = 'Y';
    } else {
      this.stateValue = 'N';
    }

    console.log('status ' + this.stateValue);
  }

  onSubmit() {
    // if (this.userManualform.invalid) {
    //   // If the form is invalid, do not submit
    //   console.log("not submitting");
    //   return;
    // }

    console.log('&&&&&&&&&&&&&&&&&&&&&&&');

    console.log(this.userManualform);
    // alert(this.userManualform);



    console.log('#############');
    console.log(this.userManualform.value.user_type);
    // console.log(this.userManualform.value.user_type);
    let selectedUserType = this.userTypeList.find(
      (userType) => userType.userTypeId === this.userManualform.value.userType
    );

    console.log(selectedUserType.userType);
    let data = {};
    let jsonDataNew = {};
    if (this.userManualform.value.flag === 0) {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ];
      const month = monthNames[currentDate.getMonth()];
      const year = currentDate.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      this.userManualform = {
        userManualName: this.userManualform.value.userManualName,
        docId: this.docIdValue,
        createdDt: formattedDate,
        modifiedDt: formattedDate,
        isActive: this.stateValue,
        userType: selectedUserType.userType,
        userTypeId: this.userManualform.value.userType,
        flag: this.userManualform.value.flag,
      };

      console.log('While Submit : ', data);
      jsonDataNew=this.userManualform;
      console.log(jsonDataNew)

    }
    else{
      this.userManualform.patchValue({
        userType:selectedUserType.userType,
        userTypeId:selectedUserType.userTypeId
      })

    console.log('While Submit : ', data);
     jsonDataNew =this.userManualform.value;
    console.log(jsonDataNew)
    }


    this._Service
      .getPsnDetailsView('userManual', jsonDataNew)
      .subscribe((res: any) => {
        console.log(res.data);
        alert(' Successfully saved');
        this.dialogRef.close();
      }),
      (error: any) => {
        console.error('Error saving user manual:', error);
        // Handle error here if needed
      };
  }

  fetchUserType(event: any) {
    console.log(event);
    const selectedUserTypeId = event.value;

    // Find the corresponding userType object based on userTypeId
    const selectedUserType = this.userTypeList.find(
      (userType) => userType.userTypeId === selectedUserTypeId
    );

    console.log('unique' + this.uniqueUserTypes);

    // Now, selectedUserType contains the whole userType object
    if (selectedUserType) {
      this.selectedUserTypeText = selectedUserType.userType;
    } else {
      this.selectedUserTypeText = ''; // Handle the case when no matching userType is found
    }
    console.log(this.selectedUserTypeText);
  }

  showHideFields(val: any) {
    if (val === 1) {
      this.isDeStatus = true;
    } else {
      this.isDeStatus = false;
    }
  }

  getDataFromComponent(manualdata: any) {
    console.log("------------------")
    console.log(manualdata);
    // this.common.Previewbydocid(manualdata.message.docId,'/pension/userManualForm');
    // this.isView = true;
    if (manualdata && manualdata.message) {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ];
      const month = monthNames[currentDate.getMonth()];
      const year = currentDate.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;

      console.log(manualdata.message.userType)

      this.userManualform.patchValue({
        userManualName: manualdata.message.userManualName,
        userType: manualdata.message.userTypeId,
        // user_type: manualdata.message.userManualName,
        userTypeId: manualdata.message.userTypeId,
        isActive: manualdata.message.isActive,
        createdDt: manualdata.message.createdDt,
        modifiedDt: formattedDate,
        docId: manualdata.message.docId,
        flag: 1,
      });
    } else {
      console.error('Invalid manualdata:', manualdata);
    }
  }
  validateData(data: any) {

     if(data!=null && data != undefined){
      this.docIdValue = this.data.message?.docId;
      this.getDataFromComponent(data)
      this.isView =true;
     }
     else{
      this.isView = false;
     }

  }

}

