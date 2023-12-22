import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestMarkVrsComponent } from './request-mark-vrs/request-mark-vrs.component';







const routes: Routes = [
    {
    path: 'request-vrs-list',
    component: RequestMarkVrsComponent
  }

  ]

@NgModule({
  declarations: [
    RequestMarkVrsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule
  ]
})
export class vrs { }
