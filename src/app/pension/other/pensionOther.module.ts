import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestPayManagerComponent } from './request-pay-manager/request-pay-manager.component';


const routes: Routes = [
    {
    path: 'request-paymanager',
    component: RequestPayManagerComponent
  }
  ]

@NgModule({
  declarations: [
    RequestPayManagerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule,
  ]
})
export class pensionOther { }
