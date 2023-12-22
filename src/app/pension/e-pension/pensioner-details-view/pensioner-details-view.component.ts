import {ChangeDetectorRef, Component,ElementRef,Input,OnInit, ViewChild} from '@angular/core';
import {STEPPER_GLOBAL_OPTIONS,} from '@angular/cdk/stepper';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
//import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as FileSaver from 'file-saver';
import html2canvas from 'html2canvas';



// import  EmployeeDetail from '../../../shared/empDetail.ts';


@Component({
  selector: 'app-pensioner-details-view',
  templateUrl: './pensioner-details-view.component.html',
  styleUrls: ['./pensioner-details-view.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})

export class PensionerDetailsViewComponent implements OnInit {

  @ViewChild('content', { static: false }) el!: ElementRef;
  jointImageUrl: any = 'assets/images/jointImg.jfif';
  imageUrl: any = 'assets/images/userImg.png';
  personalDetail: any;
  serviceDetails: any;
  empInfo: any;
  empDetails: any;
  Personaldetail: any;
  editFile: boolean = true;
  removeUpload: boolean = false;
  employeeId:any;
  
  constructor(private ApiUrlService: PensionServiceService,
    private _datePipe: DatePipe,
    private formbuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public _dialog: MatDialog,
    private tokenInfo:TokenManagementService,
    private cd: ChangeDetectorRef,
    private _Service: PensionServiceService,private actRoute: ActivatedRoute,private commonService: CommonService,
    )
     { 
      
      this.actRoute.queryParams.subscribe((params:any)=>{
        console.log(params.empId)
        this.employeeId=params.empId;
      })
    }

 
 

  ngOnInit(): void {

    
    console.log(this.employeeId)
    let data = {

      "employeeCode":this.employeeId
    
      }
    this.ApiUrlService.getPsnDetailsView('viewpensioner', data).subscribe((res:any) => {
      this.empDetails = JSON.parse(res.data[0].data)
     // this.jointImageUrl=this.empDetails.personalDetails.jointPhotoId
      this.jointPic(this.empDetails.personalDetails.jointPhotoId);
      this.showPic(this.empDetails.personalDetails.selfPhotoId);
      //this.imageUrl=this.empDetails.personalDetails.selfPhotoId
      console.log(this.empDetails)

    })
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
    console.log("single report data", data)
    this._Service.postOr("wcc/getfiles", data).subscribe((res: any) => {
      //console.log("res", res.data.document[0].content);
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
    console.log("single report data", data)
    this._Service.postOr("wcc/getfiles", data).subscribe((res: any) => {
      console.log("res", res.data.document[0].content);
      if (res.data.document[0].content) {
        this.imageUrl="data:image/jpeg;base64,"+res.data.document[0].content;
      }
    })
  }

  uploadFile(event: any) {

    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.editFile = false;
        this.removeUpload = true;
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }

  // exportToPdf(){
  //   this.commonService.exportToPdf(this.el.nativeElement);
  // }



exportToPdf(el: HTMLElement): void {
 
  const pdf = new jsPDF();
  html2canvas(el).then((canvas) => {
const imgData = canvas.toDataURL('image/png');
   const width = pdf.internal.pageSize.getWidth();
   const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'PNG', 4, 0, width, height);
    pdf.save('exported.pdf');
  });
}

// public exportToPdf(el: HTMLElement): void {
//   let DATA: any = document.getElementById('htmlData');
//   html2canvas(DATA).then((canvas) => {
//     let fileWidth = 208;
//     let fileHeight = (canvas.height * fileWidth) / canvas.width;
//     const FILEURI = canvas.toDataURL('image/png');
//     let PDF = new jsPDF('p', 'mm', 'a4');
//     let position = 0;
//     PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
//     PDF.save('angular-demo.pdf');
//   });
// }


}

