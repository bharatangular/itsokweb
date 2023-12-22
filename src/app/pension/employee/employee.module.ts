import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MakerEmpListComponent } from './maker-emp-list/maker-emp-list.component';





const routes: Routes = [
    {
    path: 'empList',
    component: MakerEmpListComponent
  }

  ]

@NgModule({
  declarations: [
    MakerEmpListComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule
  ]
})
export class Employee{ }
