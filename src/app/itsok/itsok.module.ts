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









const routes: Routes = [
  {
    path: 'medicine-update',
    component: MedicineUpdateComponent
  },
  {
    path: 'login',
    component: AdminLoginComponent
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'signup',
    component: AdminSignupComponent
  }
]

@NgModule({
  declarations: [
    MedicineUpdateComponent,
    MedicineUpdateDialogComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AdminSignupComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule,
  ]
})
export class itsok { }
