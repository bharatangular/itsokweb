import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration.component';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from 'src/app/shared/shared.module';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { AddressComponent } from './address/address.component';
import { FamilyDetailsComponent } from './family-details/family-details.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { PayEntitlementComponent } from './pay-entitlement/pay-entitlement.component';
import { UploadDocumetComponent } from './upload-documet/upload-documet.component';
import { ProgressComponent } from './progress/progress.component';
import { CommonModalComponent } from './common-modal/common-modal.component';
import { EssComponent } from './ess/ess.component';
import { CommutationComponent } from './commutation/commutation.component';
import { AlternateNomineeComponent } from './ess/alternate-nominee/alternate-nominee.component';
import { PdfPreviewComponent } from './ess/pdf-preview/pdf-preview.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { PayManagerDetailsDialogComponent } from './ess/pay-manager-details-dialog/pay-manager-details-dialog.component';
import { BasicDetailsPopupComponent } from './ess/basic-details-popup/basic-details-popup.component';
import { PreviewPensionEssComponent } from './ess/preview-pension-ess/preview-pension-ess.component';



const routes: Routes = [{
  path: '',
  component: RegistrationComponent
}, {
  path: '/{prams}',
  component: RegistrationComponent
},
{
  path: 'personal-detail',
  component: EssComponent,
  data: { page_id: 1 }
}, {
  path: 'address-detail',
  component: EssComponent,
  data: { page_id: 5 }
}, {
  path: 'bank-detail',
  component: EssComponent,
  data: { page_id: 3 }
},
{
  path: 'commutation',
  component: EssComponent,
  data: { page_id: 8 }
},
{
  path: 'AlternateNominee',
  component: EssComponent,
  data: { page_id: 7 }
},
{
  path: 'family-detail',
  component: EssComponent,
  data: { page_id: 2 }
}, {
  path: 'service-details',
  component: EssComponent,
  data: { page_id: 4 }
}, {
  path: 'pay-entitlement',
  component: EssComponent,
  data: { page_id: 6 }
}]
@NgModule({
  declarations: [
    RegistrationComponent, PersonalDetailsComponent, ServiceDetailsComponent,CommutationComponent,
    AddressComponent, FamilyDetailsComponent, BankDetailsComponent, PayEntitlementComponent,
    UploadDocumetComponent, ProgressComponent, CommonModalComponent, EssComponent, 
    AlternateNomineeComponent,
    PdfPreviewComponent,
    PayManagerDetailsDialogComponent,
    BasicDetailsPopupComponent,
    PreviewPensionEssComponent,
 
  ],
  imports: [
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule,
    MatProgressSpinnerModule,
    FormsModule,

  ],
})
export class RegistrationModule { }
