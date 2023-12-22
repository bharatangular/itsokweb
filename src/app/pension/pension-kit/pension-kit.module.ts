import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PensionKitComponent } from './pension-kit/pension-kit.component';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: 'pensionkitesign',
    component: PensionKitComponent
  }
];

@NgModule({
  declarations: [PensionKitComponent],
  imports: [RouterModule.forChild(routes),
    CommonModule,
    MatStepperModule,
    SharedModule,
    CommonModule
  ]
})
export class PensionKitModule { }
