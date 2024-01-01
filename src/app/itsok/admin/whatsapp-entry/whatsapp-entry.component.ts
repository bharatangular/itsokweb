import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { ItsokService } from 'src/app/services/itsok.service';

@Component({
  selector: 'app-whatsapp-entry',
  templateUrl: './whatsapp-entry.component.html',
  styleUrls: ['./whatsapp-entry.component.scss']
})
export class WhatsappEntryComponent implements OnInit {
  config: AppConfig = new AppConfig();
  imageUrl: any;
  imageUrl2: any;
  medicine: any;
  constructor(
    public api: ItsokService,
    private formbuilder: FormBuilder,
    public router: Router) {


  }

  ngOnInit(): void {
    let login = this.config.getDetails("login");
    console.log(login)
    if (login == "1") { }
    else { alert("First login."); }

    this.api.configMenu = { url: "Add Whatsapp Order" };
    this.medicine = this.formbuilder.group({

      mobile_no: ['', Validators.required,],
      name: [''],
      patient_name: ['', Validators.required,],
      patient_age: ['', Validators.required,],
      dr_name: ['', Validators.required,],
      totalAmount: [''],

    })
    this.imageUrl = "assets/itsokMedicine/no_image.jpg"


  }

  uploadFile(event: any) {

    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;

      if (fileType.includes('pdf')) {
        alert("Selected file is a PDF");
      }
      else if (fileType.includes('image')) {

        if (file.size / 1024 > 1024) {
          alert("please upload less than 1 mb image");
          return
        }
        const reader = new FileReader();
        reader.onloadend = (e: any) => {
          const base64String = e.target.result;
          console.log("base", base64String)
          this.imageUrl2 = base64String

        };
        reader.readAsDataURL(file);

      }
      else {

        alert("Selected file is not a PDF or image");

      }
    }

  }
  // excelUpload(event: any) {

  //   const file = event.target.files[0];
  //   if (file) {
  //     const fileType = file.type;
  //     console.log("type", fileType)


  //     this.filetoexcel.convertExcelToJson(file).then((res: any) => {
  //       res = JSON.parse(res);
  //       console.log("res", res);
  //       let data = {
  //         "jsonData": res
  //       }
  //       console.log("data", data);
  //       this.api.postisok("insertMedicineExcel", data).subscribe((res: any) => {
  //         console.log(res)
  //       })
  //     })



  //   }

  // }
  insertRecord() {


    console.log(this.medicine.value);

    if (!this.medicine.valid) {
      alert("Please fill all fields properly");
      return;
    }
    if (!this.imageUrl2) {
      alert("Please upload pic");
      return;
    }

    let data = {
      "inType": 1,
      "requestJson": {
        "mobile_no": this.medicine.value.mobile_no,
        "image": this.imageUrl2,
        "name": this.medicine.value.name ? this.medicine.value.name : " ",
        "patient_name": this.medicine.value.patient_name ? this.medicine.value.patient_name : " ",
        "patient_age": this.medicine.value.patient_age,
        "dr_name": this.medicine.value.dr_name ? this.medicine.value.dr_name : " ",
        "totalAmount": this.medicine.value.totalAmount ? this.medicine.value.totalAmount : "0",
      }

    }
    console.log(data);

    this.api.postisok("whatsapp", data).subscribe((res: any) => {
      console.log(res[0]);

      if (res[0][0].pStatus == 1) {
        this.medicine.reset();
        this.imageUrl2 = null;
        alert("Insert successfully.")
      } else {
        alert("Error in Insert.")
      }

    }, (error) => {
      alert("Error in Insert.")
    })
  }

}

