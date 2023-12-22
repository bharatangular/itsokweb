import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FamilydetailRequestListComponent } from './familydetail-request-list/familydetail-request-list.component';
import { FamilydetailViewComponent } from './familydetail-view/familydetail-view.component';
import { LifeCertificateComponent } from './life-certificate/life-certificate.component';
import { LifeCertificateDetailsComponent } from './life-certificate-details/life-certificate-details.component';
import { LifeCerRequestComponent } from './life-cer-request/life-cer-request.component';






const routes: Routes = [
    {
    path: 'family-update-list',
    component: FamilydetailRequestListComponent
  },
  {
    path: 'family-update',
    component: FamilydetailViewComponent,
    data:{
      pensionerid: ''
    }
  },
  {
    path: 'LifeOtherCertificate',
    component: LifeCertificateComponent
  },
  {
    path: 'LifeCertificateDetails',
    component: LifeCertificateDetailsComponent
  },
  {
    path: 'request-life-cert',
    component: LifeCerRequestComponent
  }

  ]

@NgModule({
  declarations: [
    FamilydetailRequestListComponent,
    FamilydetailViewComponent,
    LifeCertificateComponent,
    LifeCertificateDetailsComponent,
    LifeCerRequestComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule
  ]
})
export class pssUpdate { }
