import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from '../shared/shared.module';
import { MedicineUpdateComponent } from './admin/medicine-update/medicine-update.component';
import { MedicineUpdateDialogComponent } from './admin/medicine-update-dialog/medicine-update-dialog.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminSignupComponent } from './admin/admin-signup/admin-signup.component';
import { AddMedicineComponent } from './admin/add-medicine/add-medicine.component';
import { UploadExcelComponent } from './admin/upload-excel/upload-excel.component';
import { WhatsappEntryComponent } from './admin/whatsapp-entry/whatsapp-entry.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderDetailsDialogComponent } from './admin/order-details-dialog/order-details-dialog.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';









const routes: Routes = [
  {
    path: '',
    component: AdminLoginComponent
  },
  {
    path: 'medicine-update',
    component: MedicineUpdateComponent
  },
  {
    path: 'add-medicine',
    component: AddMedicineComponent
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'signup',
    component: AdminSignupComponent
  },
  {
    path: 'upload-excel',
    component: UploadExcelComponent
  },
  {
    path: 'whatsapp',
    component: WhatsappEntryComponent
  }
  ,
  {
    path: 'order-details',
    component: OrderDetailsComponent
  }
]

@NgModule({
  declarations: [
    MedicineUpdateComponent,
    MedicineUpdateDialogComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AdminSignupComponent,
    AddMedicineComponent,
    UploadExcelComponent,
    WhatsappEntryComponent,
    OrderDetailsComponent,
    OrderDetailsDialogComponent,
    ImagePreviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule,
  ]
})
export class itsok { }
