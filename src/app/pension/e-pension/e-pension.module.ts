import { PensionerListComponent } from './pensioner-list/pensioner-list.component';
import { EPensionComponent } from './e-pension.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule, Routes } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProgressComponent } from './progress/progress.component';
import { FamilyNominationComponent } from './family-nomination/family-nomination.component';
import { LoanAndAdvanceComponent } from './loan-and-advance/loan-and-advance.component';
import { CalculationsComponent } from './calculations/calculations.component';
import { BankAndTreasuryDetailsComponent } from './bank-and-treasury-details/bank-and-treasury-details.component';
import { DocumentsComponent } from './documents/documents.component';
import { ConditionComponent } from './condition/condition.component';
import { EditEmpProfileComponent } from './edit-emp-profile/edit-emp-profile.component';
import { PdfPreviewComponent } from './pdf-preview/pdf-preview.component';
import { UserRoleComponent } from './process-role/user-role/user-role.component';
import { AddUserRoleComponent } from './process-role/add-user-role/add-user-role.component';
import { MarkEmpPensionComponent } from './mark-emp-pension/mark-emp-pension.component';
import { PendingEsignComponent } from './pending-esign/pending-esign.component';
import { MarkEmployeeRelieveComponent } from './mark-employee-relieve/mark-employee-relieve.component';
import { ApprovePensionerListComponent } from './approve-pensioner-list/approve-pensioner-list.component';
import { PensionCalculationComponent } from './pension-calculation/pension-calculation.component';
import { PensionerDetailsViewComponent } from './pensioner-details-view/pensioner-details-view.component';
import { PensionerViewComponent } from './pensioner-view/pensioner-view.component';
import { PsnViewComponent } from './psn-view/psn-view.component';
import { HoApprovePensionerListComponent } from './ho-approve-pensioner-list/ho-approve-pensioner-list.component';
import { ViewPensionEssComponent } from './view-pension-ess/view-pension-ess.component';


import { RevisedPensionComponent } from './revised-pension/revised-pension.component';
import { RevisedCpoComponent } from './revised-cpo/revised-cpo.component';
import { FileStatusComponent } from './file-status/file-status.component';
import { UpdateDocumentDocIdComponent } from './update-document-doc-id/update-document-doc-id.component';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';
import { DynamicReportComponent } from './dynamic-report/dynamic-report.component';
import { PensionInitiateOfficeComponent } from './pension-initiate-office/pension-initiate-office.component';
import { PendingMultiEsignComponent } from './pending-multi-esign/pending-multi-esign.component';
import { DynamicAutoApproveComponent } from '../auto-approve/dynamic-auto-approve/dynamic-auto-approve.component';
import { MarkVrsComponent } from './vrs-mark/mark-vrs/mark-vrs.component';
import { MarkVrsListComponent } from './vrs-mark/mark-vrs-list/mark-vrs-list.component';
import { MarkLeaveComponent } from './mark-leave/mark-leave.component';
import { DialogLeaveTransferComponent } from './dialog-leave-transfer/dialog-leave-transfer.component';
import { MarkEmployeeDeComponent } from '../mark-de/mark-employee-de/mark-employee-de.component';
import { MarkBillsComponent } from '../bill/mark-bills/mark-bills.component';
import { MarkEmpDeComponent } from '../mark-de/mark-emp-de/mark-emp-de.component';
import { NgxPrintModule } from 'ngx-print';




const routes: Routes = [
  {
    path: 'PensionerList',
    component: PensionerListComponent
  },
  {
    path: 'MarkEmpPension',
    component: MarkEmpPensionComponent  
  },
  {
    path: 'mark-vrs',
    component: MarkVrsComponent  
  },
  {
    path: 'mark-vrs-list',
    component: MarkVrsListComponent  
  },
  {
    path: 'ViewESSPension',
    component: ViewPensionEssComponent  
  },
  {
    path: 'markemprelieve',
    component: MarkEmployeeRelieveComponent  
  },
  {
    path: 'Profile',
    component: EPensionComponent
  },
  {
    path: 'processrole',
    component: UserRoleComponent
  },
  {
    path: 'pendingEsign',
    component: PendingEsignComponent
  },
  {
    path: 'pendingMultiEsign',
    component: PendingMultiEsignComponent
  },
  {
    path: 'adPensionerList',
    component: ApprovePensionerListComponent
  },
 
  {
    path: 'EditEmpProfile',
    component: EditEmpProfileComponent
  },
  {
    path: 'pensioncalculation',
    component: PensionCalculationComponent
  },
  {
    path: 'pensionerDetailsView',
    component: PensionerDetailsViewComponent
  },
  {
    path: 'pensionerView',
    component: PensionerViewComponent
  },
  {
    path: 'revisedPension',
    component: RevisedPensionComponent
  },
  {
    path: 'revisedCpo',
    component: RevisedCpoComponent
  },
  {
    path: 'pensionini',
    component: PensionInitiateOfficeComponent
  },
  {
    path: 'checkapplicationstatus',
    component: FileStatusComponent
  },
  {
    path: 'psnview',
    component: PsnViewComponent
  },
  {
    path: 'updatedocid',
    component: UpdateDocumentDocIdComponent
  },
  {
    path: 'report',
    component: DynamicReportComponent
  },
  {
    path: 'hoApproveList',
    component: HoApprovePensionerListComponent
  },
  {
    path: 'uploadPhoto',
    component: UploadPhotoComponent
  },
  {
    path: 'markempde',
    component: MarkEmployeeDeComponent  
  },
  {
    path: 'markleave',
    component: MarkLeaveComponent
  },
  {
    path: 'markbills',
    component:MarkBillsComponent
  },
  {
    path: 'markempde-pension',
    component:MarkEmployeeDeComponent
  },
  {
    path: 'markempde-emp',
    component:MarkEmpDeComponent
  },
  

]

@NgModule({
  declarations: [
    EPensionComponent,
    ProfileComponent,
    ProgressComponent,
    PensionerListComponent,
    FamilyNominationComponent,
    LoanAndAdvanceComponent,
    CalculationsComponent,
    BankAndTreasuryDetailsComponent,
    DocumentsComponent,
    ConditionComponent,
    EditEmpProfileComponent,
    PdfPreviewComponent,
    EPensionComponent,
    AddUserRoleComponent,
    UserRoleComponent,
    MarkEmpPensionComponent,
    PendingEsignComponent,
    MarkEmployeeRelieveComponent,
    ApprovePensionerListComponent,
    PensionCalculationComponent,
    PensionerDetailsViewComponent,
    PensionerViewComponent,
    PsnViewComponent,
    HoApprovePensionerListComponent,
    ViewPensionEssComponent,
    RevisedPensionComponent,
    RevisedCpoComponent,
    FileStatusComponent,
    UpdateDocumentDocIdComponent,
    UploadPhotoComponent,
    DynamicReportComponent,
    PensionInitiateOfficeComponent,
    PendingMultiEsignComponent,
    DynamicAutoApproveComponent,
    MarkVrsComponent,
    MarkVrsListComponent,
    MarkLeaveComponent,
    DialogLeaveTransferComponent,
    MarkEmployeeDeComponent,
    MarkBillsComponent,
    MarkEmpDeComponent,
    MarkEmployeeDeComponent,
   
    
  ],
  imports: [
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule,
    NgxPrintModule
],
})
export class EPensionModule { }
