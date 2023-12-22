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



@Component({
  selector: 'app-dynamic-report',
  templateUrl: './dynamic-report.component.html',
  styleUrls: ['./dynamic-report.component.scss']
})
export class DynamicReportComponent implements OnInit {


  @Output() EmpId = new EventEmitter();
  config:AppConfig=new AppConfig();
  displayedColumns: string[] = ["report"];
  dataSource!: MatTableDataSource<any>;
header:any[]=["report"];
reportData:any[]=[]
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
// this.listDetails();

let data=
{
  "displayedColumns":["requestid",'employeeCode','name','ppoNo'],
  "header":["Request Id",'Employee Code','Name','PPO No'],
  "reportData":[
    {
      "requestid":1,'employeeCode':2,'name':3,'ppoNo':4
    }
  ]
}
this.displayedColumns=data.displayedColumns;
this.header=data.header;
this.reportData=data.reportData;
this.dataSource = new MatTableDataSource(this.reportData);
this.dataSource.paginator = this.paginator;
  }

  listDetails() {
    let data={
      "createdByaId":this.userDetails.assignmentid
    }
    this.load.show();
    this._Service.postPssRequest(data, "getpensionerlist").subscribe({
      next: (res) => {
        this.load.hide();
          console.log("res",res.data);
          
        if (res.status === "SUCCESS") {
          if (res == '') {
            alert("Not Record Found");
          }
          else {
            let data=res.data;
            let result: any[] = [];
           for(let i=0;i<data.length;i++)
           {
            if(i==0)
            {
              result.push(data[i])
            }else
            {let count=0
              for(let j=0;j<result.length;j++)
              {
                
                if(result[j].employeeCode==data[i].employeeCode)
                {
                  count=1
                  
                }
              }
              if(count==0)
              {
                result.push(data[i])
              }
            }

           }
            console.log("list",result);
            this.dataSource = new MatTableDataSource(result);
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
            "redirectUrl":"pension/e-Pension/adPensionerList"
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

}


