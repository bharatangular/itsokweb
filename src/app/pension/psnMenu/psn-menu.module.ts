import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuMasterComponent } from './menu-master/menu-master.component';
import { RouterModule, Routes } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
  path: 'menu-master',
  component: MenuMasterComponent
}
]


@NgModule({
  declarations: [
    MenuMasterComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule,
  ]
})
export class PsnMenuModule { }
