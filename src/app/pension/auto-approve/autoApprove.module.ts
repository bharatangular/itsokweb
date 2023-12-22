import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MarkAutoApproveComponent } from './mark-auto-approve/mark-auto-approve.component';




const routes: Routes = [
    {
    path: 'mark-auto-approve',
    component: MarkAutoApproveComponent
  }

  ]

@NgModule({
  declarations: [
    MarkAutoApproveComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule
  ]
})
export class AutoApprove { }
