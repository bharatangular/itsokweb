import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItsokService } from 'src/app/services/itsok.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-order-details-dialog',
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.scss']
})
export class OrderDetailsDialogComponent implements OnInit {

  imageUrl: any;
  imageUrl2: any;
  medicine: any;
  orderdetails: any[] = [];
  displayedColumns: string[] = ['id', 'p_order_id', 'price_each', 'product_id', 'quantity_ordered'];

  dataSource = new MatTableDataSource();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<OrderDetailsDialogComponent>, private imageCompress: NgxImageCompressService,
    public api: ItsokService, public dialog: MatDialog,
    private formbuilder: FormBuilder,
    public router: Router,
    public common: CommonService) { }

  ngOnInit(): void {

    this.medicine = this.formbuilder.group({

      code: ['', Validators.required,],
      name: ['', Validators.required,],
      type: ['', Validators.required,],
      mrp: ['', Validators.required,],
      sales_price: ['', Validators.required,]
    })

    this.getorderDetails()

  }
  getorderDetails() {
    let data = {
      "inType": 4,
      "requestJson": {
        "orderId": this.data?.message?.o_id
      }

    }
    this.api.postisok("orderdetails", data).subscribe((res: any) => {

      this.orderdetails = res[0];
      console.log("res", this.orderdetails);
      this.imageUrl = this.orderdetails[0].prescription;
      this.dataSource = new MatTableDataSource(this.orderdetails);
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
  preview() {
    this.common.imagePreview(this.orderdetails[0].prescription);
  }

}