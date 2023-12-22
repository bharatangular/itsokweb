import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { RPensionComponent } from './r-pension/r-pension.component';
import { RevisedPensionerListComponent } from './revised-pensioner-list/revised-pensioner-list.component';
import { RevisedPensionerDetailsComponent } from './revised-pensioner-details/revised-pensioner-details.component';
import { NgxPrintModule } from 'ngx-print';
import { MakerPensionerListComponent } from './maker-pensioner-list/maker-pensioner-list.component';





const routes: Routes = [
   
  {
    path: 'revised-pension',
    component: RPensionComponent  
  },
  {
    path: 'revised-pension-list',
    component:RevisedPensionerListComponent   
  },
  {
    path: 'revised-pension-details',
    component:RevisedPensionerDetailsComponent   
  },
  {
    path: 'maker-pensioner-list',
    component:MakerPensionerListComponent   
  },
  {
    path: 'pension-ess',
    loadChildren: () => import('../../pension-related-request/registration.module').then((m) => m.RegistrationModule),
   },
  ]

@NgModule({
  declarations: [
    RPensionComponent,
    RevisedPensionerListComponent,
    RevisedPensionerDetailsComponent,
    MakerPensionerListComponent
  
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule,
    NgxPrintModule
  ]
})
export class revisedPension { }
