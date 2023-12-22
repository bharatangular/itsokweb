import { Component, ElementRef, OnInit, ViewChild ,AfterViewInit, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { PdfPreviewComponent } from '../pdf-preview/pdf-preview.component';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { FirstPensionDialogComponent } from '../../payment-disbursement/first-pension-dialog/first-pension-dialog.component';
import { auto } from '@popperjs/core';


@Component({
  selector: 'app-ho-approve-pensioner-list',
  templateUrl: './ho-approve-pensioner-list.component.html',
  styleUrls: ['./ho-approve-pensioner-list.component.scss']
})
export class HoApprovePensionerListComponent implements OnInit {


  @Output() EmpId = new EventEmitter();
  config:AppConfig=new AppConfig();
  displayedColumns: string[] = ["requestid",'lrNo','employeeCode','name','pensionerId','Download',"Stop"];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  datalist: any = [];
  countDetail: any;
  inboxData: any = [];

  showerror: boolean = false;
  error: string = '';
  empinfo: any;
  isShow=true;

  encryptMode: boolean= false;
  textToConvert: any;
  password: any;
  conversionOutput: any;
  userDetails:any={"role":"",
  "roleid" :"",
 "assignmentid":"",
 "officeid":"",
 "treasCode":"",
 "treasName":""
};
  constructor(public dialog: MatDialog,
     private _Service: PensionServiceService,
      private modalService: NgbModal,
      private _snackBar: MatSnackBar,
      private router:Router,
      private load:LoaderService,
      private tokenInfo:TokenManagementService) {
    this.encryptMode = true;
  }
  ngOnInit(): void {
   
    this._Service.configMenu = { url: "Inbox > Approved-Pensioner-List" };
    this.empinfo=this.tokenInfo.empinfoService;
    this.userDetails = this.config.getUserDetails();
this.listDetails();
  }

  listDetails() {
    let data={
      "officeId":this.userDetails.officeid
      // "officeId":'24890'
    }
    this.load.show();
    this._Service.postPssRequest(data, "gethopensionerlist").subscribe({
      next: (res) => {
        this.load.hide();
          console.log("res",res.data);
          
        if (res.status === "SUCCESS") {
          if (res == '') {
            alert("Not Record Found");
          }
          else {
            let data=res.data;
           
            console.log("list",res.data);
            this.dataSource = new MatTableDataSource(res.data);
            this.dataSource.paginator = this.paginator;
            
          }
        }
      },
      error: (err) => {
        this.load.hide();
        console.log(err);
        // this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      }
    })
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  pensionKitPreview(row:any,type:any)
  {
    let docId:any
    if(type=='ps')
    {
       docId=row.psnSetDmsDocId;
       
    }
    else if(type=='fr')
    {
      docId=row.frDmsDocId;
    }
    else if(type=='pk')
    {
      docId=row.psnKitDmsDocId;
    } else if(type=='ss')
    {
      docId=row.kitSDmSDocID;
    }

    
      let data1:any[]=[]
     
      console.log("data1",JSON.stringify(data1)); 
      if(docId)
      {
      let data={
        "type": "pension",
        "sourceId": 2,
        "docs": [
          {
            "docId": docId
          }
        ]
      }
      console.log("single report data",data)
      this._Service.postOr("wcc/getfiles",data).subscribe((res:any)=>{
        console.log("res",res.data.document[0].content);
        if(res.data.document[0].content)
        
        {
          let data={
            "base64Pdf":res.data.document[0].content,
            "redirectUrl":"pension/e-Pension/hoApproveList"
            }
  console.log("data",data);
  
           this.dialog.open(PdfPreviewComponent,{  width: '70%', data: {message: data },  disableClose: false});
       
      
        }
      })
    }else
    {
      alert("Preview Not Available")
    }
    
  }
  stopReason(title: any,field:any) {
    this.dialog.open(FirstPensionDialogComponent, {
      autoFocus: false,
      panelClass:'dialog-w-50',
      // [config]="{backdrop:'static'}",
      width:auto,
      height: auto,
      data: {
        title: title,
        ppoNumber:field.ppoNo,
        gpoNumber:field.gpoNo,
        cpoNumber:field.cpoNo,
        aid:this.userDetails.assignmentid,
        userId:this.userDetails.assignmentid
      },
    });
  }
}

