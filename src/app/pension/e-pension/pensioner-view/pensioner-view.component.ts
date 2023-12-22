import {ChangeDetectorRef, Component,EventEmitter,Input,OnInit, Output,ViewChild} from '@angular/core';
import {STEPPER_GLOBAL_OPTIONS,} from '@angular/cdk/stepper';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DocumentId,DocumentIdList } from 'src/assets/utils/interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfig } from 'src/app/app.config';
import { MatPaginator } from '@angular/material/paginator';
import { PensionerDetailsViewComponent } from '../pensioner-details-view/pensioner-details-view.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-pensioner-view',
  templateUrl: './pensioner-view.component.html',
  styleUrls: ['./pensioner-view.component.scss']
})
export class PensionerViewComponent implements OnInit {


  @Output() EmpId = new EventEmitter();
  userdetails:any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['employeeId','pensionerName','employeeCode','cpoNo','ppoNo','gpoNo','dob','pan','email','mobileNo','Action'];
  dataSource!: MatTableDataSource<any>;
  config:AppConfig=new AppConfig()
  pensionerList: any;
  showerror: boolean = false;
  error: string = '';
  jointImageUrl: any = 'assets/images/jointImg.jfif';
  imageUrl: any = 'assets/images/userImg.png';
  personalDetail: any;
  serviceDetails: any;
  empInfo: any;
  empDetails: any ;
  Personaldetail: any;
  editFile: boolean = true;
  removeUpload: boolean = false;
  encryptMode: boolean= false;


  constructor(private ApiUrlService: PensionServiceService,
    private _datePipe: DatePipe,
    private formbuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public _dialog: MatDialog,
    private tokenInfo:TokenManagementService,
    private cd: ChangeDetectorRef,
    private _Service: PensionServiceService,private routers: Router,) {this.encryptMode = true; }

  ngOnInit(): void {
    this.userdetails=this.config.getUserDetails();
    this.getPensionerList();
  }




  getPensionerList(){

    
    let data = {
      //"officeId": this.userdetails.officeid
      "officeId": 904
      //"employeeCode":"1137240"
      }
    this.ApiUrlService.getPsnDetailsList('getpensionerlistforview', data).subscribe((res:any) => {
      this.pensionerList = res.data
      console.log( this.pensionerList)
       console.log(res.data)
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
  
    })
  }

  View_Profile(empId:any){
   
      this.routers.navigate(['/pension/e-Pension/pensionerDetailsView'], {
        queryParams: {empId: empId}
        //const enData: any =  this.config.encrypt(JSON.stringify(queryParams));
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  jointPic = (id:any) =>{
    let data = {
      "type": "ess",
      "sourceId": 2,
      "docs": [
        {
          "docId":id
        }
      ]
    }
    this._Service.postOr("wcc/getfiles", data).subscribe((res: any) => {
      if (res.data.document[0].content) {
        this.jointImageUrl="data:image/jpeg;base64,"+res.data.document[0].content;
      }
    })
  }

  picData:any='';
  showPic = (id:any) =>{
    let data = {
      "type": "ess",
      "sourceId": 2,
      "docs": [
        {
          "docId":id
        }
      ]
    }
    this._Service.postOr("wcc/getfiles", data).subscribe((res: any) => {
      if (res.data.document[0].content) {
        this.imageUrl="data:image/jpeg;base64,"+res.data.document[0].content;
      }
    })
  }



}
