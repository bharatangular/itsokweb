import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import { FileExcelService } from 'src/app/services/file-excel-service.service';
import { ItsokService } from 'src/app/services/itsok.service';

@Component({
  selector: 'app-add-medicine',
  templateUrl: './add-medicine.component.html',
  styleUrls: ['./add-medicine.component.scss']
})
export class AddMedicineComponent implements OnInit {
  imageUrl: any;
  imageUrl2: any;
  medicine: any;
  constructor(
    public api: ItsokService,
    private formbuilder: FormBuilder,
    public filetoexcel: FileExcelService) { }

  ngOnInit(): void {
    this.api.configMenu = { url: "Add Medicine" };
    this.medicine = this.formbuilder.group({

      code: ['', Validators.required,],
      name: ['', Validators.required,],
      type: ['', Validators.required,],
      mrp: ['', Validators.required,],
      sales_price: ['', Validators.required,]
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
  excelUpload(event: any) {

    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      console.log("type", fileType)


      this.filetoexcel.convertExcelToJson(file).then((res: any) => {
        res = JSON.parse(res);
        console.log("res", res);
        let data = {
          "jsonData": res
        }
        console.log("data", data);
        this.api.postisok("insertMedicineExcel", data).subscribe((res: any) => {
          console.log(res)
        })
      })



    }

  }
  insertMedicine() {
    if (this.medicine.invalid) {
      alert("Please fill all fields properly");
      return;
    }
    console.log(this.medicine.value);
    this.api.postisok("insertMedicine", this.medicine.value).subscribe((res: any) => {
      console.log(res)
    })
  }

}
