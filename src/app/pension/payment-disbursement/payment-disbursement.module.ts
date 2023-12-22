import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstPensionComponent } from './first-pension/first-pension.component';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FirstPensionDialogComponent } from './first-pension-dialog/first-pension-dialog.component';
import { PdfPreviewComponent } from './pdf-preview/pdf-preview.component';
import { PaymanagerBillComponent } from './paymanager-bill/paymanager-bill.component';
import { PaymanagerBillDialogComponent } from './paymanager-bill-dialog/paymanager-bill-dialog.component';
import { MonthlyPensionDialogComponent } from './monthly-pension-dialog/monthly-pension-dialog.component';



const routes: Routes = [
    {
    path: 'FirstPension',
    component: FirstPensionComponent
  },
 
    {
    path: 'FirstPensionModule',
    component: FirstPensionComponent
  },
  {
    path: 'paymanagerBill',
    component: PaymanagerBillComponent
  },
  {
    path: '/{prams}',
    component: FirstPensionComponent
  }


  ]

@NgModule({
  declarations: [
    FirstPensionComponent,
    FirstPensionDialogComponent,
    PdfPreviewComponent,
    PaymanagerBillComponent,
    PaymanagerBillDialogComponent,
    MonthlyPensionDialogComponent,
 

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule
  ]
})
export class PaymentDisbursementModule { }
