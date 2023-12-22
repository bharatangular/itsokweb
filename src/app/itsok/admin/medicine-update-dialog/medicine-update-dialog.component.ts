import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItsokService } from 'src/app/services/itsok.service';
import { NgxImageCompressService } from 'ngx-image-compress';
@Component({
  selector: 'app-medicine-update-dialog',
  templateUrl: './medicine-update-dialog.component.html',
  styleUrls: ['./medicine-update-dialog.component.scss']
})
export class MedicineUpdateDialogComponent implements OnInit {
  imageUrl: any;
  imageUrl2: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: any, id: any, fromDate: any },
    private dialogRef: MatDialogRef<MedicineUpdateDialogComponent>, private imageCompress: NgxImageCompressService,
    public api: ItsokService, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.getimage();
  }
  getimage() {
    let data = {
      "medId": this.data?.message?.med_id
    }
    this.api.postisok("medicineImage", data).subscribe((res: any) => {

      if (res[0].image == '0') {
        this.imageUrl = "assets/itsokMedicine/no_image.jpg"
      } else {

        this.imageUrl = res[0].image
      }
      console.log("this.imageUrl", this.imageUrl);
    })
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
          let data = {
            "medId": this.data?.message?.med_id,
            "image": base64String
          }
          console.log(data)
          this.api.postisok("medicineImageUpdate", data).subscribe((res: any) => {
            console.log("res", res);
            if (res?.affectedRows == 1) {
              this.imageUrl = base64String
              alert('Updated');

            } else {
              alert("error in update")
            }
          })

        };
        reader.readAsDataURL(file);

      }
      else {

        alert("Selected file is not a PDF or image");

      }
    }

  }


}