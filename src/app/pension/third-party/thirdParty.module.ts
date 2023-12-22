import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatSortModule } from '@angular/material/sort';


import { NgxPrintModule } from 'ngx-print';
import { MatCard, MatCardModule } from '@angular/material/card';
import { RvnlDetailsComponent } from './rvnl-details/rvnl-details.component';
import { ViewRvnlDetailsComponent } from './view-rvnl-details/view-rvnl-details.component';





const routes: Routes = [
  {
    path: 'rvnl-details',
     component: RvnlDetailsComponent
  },
  // {
  //   path: 'view-rvnldetails',
  //   component: ViewRvnlDetailsComponent,
  // }
  {
    path: 'view-rvnldetails/:pensionerId',
     component: ViewRvnlDetailsComponent
  }
  ]

@NgModule({
  declarations: [
    RvnlDetailsComponent,
    ViewRvnlDetailsComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule,
    MatSortModule,
    NgxPrintModule,
    MatCardModule
  ]
})
export class thirdParty { }
