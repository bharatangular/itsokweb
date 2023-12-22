import { HoEmployeeComponent } from './ho-employee/ho-employee.component';
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InboxModule } from './inbox/inbox.module';
import { SharedModule } from '../shared/shared.module';
import { CommonDialogComponent } from './common-dialog/common-dialog.component';
import { EsignModalComponent } from './esign-modal/esign-modal.component';
import { ServiceRecordDialogComponent } from './service-record-dialog/service-record-dialog.component';
import { MarkEmpRelieveDialogComponent } from './mark-emp-relieve-dialog/mark-emp-relieve-dialog.component';
import { AdminQueryComponent } from './admin-query/admin-query.component';
import { report } from 'process';
import { ReportsModule } from './reports/reports.module';

import { AutoApproveDialogComponent } from './auto-approve/auto-approve-dialog/auto-approve-dialog.component';

import { MultiESignComponent } from './auto-approve/multi-e-sign/multi-e-sign.component';
import { EPensionModule } from './e-pension/e-pension.module';
import { DynamicAutoApproveComponent } from './auto-approve/dynamic-auto-approve/dynamic-auto-approve.component';
import { PensionEssViewComponent } from './employee-details-view/pension-ess-view/pension-ess-view.component';
import { SendDataComponent } from './bill/send-data/send-data.component';
import { RevisedPensionerListComponent } from './auto-approve/revised-pensioner-list/revised-pensioner-list.component';
import { RevisedAutoApprovedDialogComponent } from './auto-approve/revised-auto-approved-dialog/revised-auto-approved-dialog.component';
import { EssReportComponent } from './tool/ess-report/ess-report.component';
import { ViewObjectionComponent } from './tool/view-objection/view-objection.component';
import { PensionInitiatedComponent } from './pension-initiated/pension-initiated.component';
import { TransDataEmpPensionComponent } from './tool/trans-data-emp-pension/trans-data-emp-pension.component';
import { UpdateDocumentComponent } from './tool/update-document/update-document.component';
import { IdleTimeoutComponent } from './session/idle-timeout/idle-timeout.component';
import { SessionExpiredComponent } from './session/session-expired/session-expired.component';
import { PensionerIdcardComponent } from './pensioner-idcard/pensioner-idcard.component';

import { QRCodeModule } from 'angularx-qrcode';
import { DataCorrectionComponent } from './data-correction/data-correction.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../itsok/itsok.module').then(m => m.itsok)
  },
  {
    path: 'Inbox',
    loadChildren: () => import('./inbox/inbox.module').then(m => m.InboxModule)
  },
  {
    path:'HoEmployee',
    component:HoEmployeeComponent

  },
  {
    path:'service',
    component:ServiceRecordDialogComponent

  },
  {
    path:'view-objection',
    component:ViewObjectionComponent

  },
  {
    path:'ess-report',
    component:EssReportComponent

  },
  {
    path: 'findData',
    component:AdminQueryComponent
  },

  {
    path: 'e-Pension',
    loadChildren: () => import('./e-pension/e-pension.module').then(m => m.EPensionModule)
  },
  {
    path: 'PaymentDisbursement',
    loadChildren: () => import('./payment-disbursement/payment-disbursement.module').then(m => m.PaymentDisbursementModule)
  },
  {
    path: 'autoApprovePensioner',
   component:MultiESignComponent
  },
  {
    path: 'dynamicAutoApprove',
   component:DynamicAutoApproveComponent
  },
  {
    path: 'revisedAutoApprove',
   component:RevisedPensionerListComponent
  },
  {
    path: 'Reports',
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
  },
  {
    path: 'pension',
    loadChildren: () => import('./other/pensionOther.module').then(m => m.pensionOther)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'pensionEssView',
    component:PensionEssViewComponent
  },
  {
    path: 'sendData',
    component:SendDataComponent
  },
  {
    path: 'PensionInitiatedComponent',
    component: PensionInitiatedComponent
  },
  {
    path: 'transferEmpData',
    component: TransDataEmpPensionComponent
  },
  {
    path: 'autoApprove',
    loadChildren: () => import('./auto-approve/autoApprove.module').then(m => m.AutoApprove)
  },
  {
    path: 'pss',
    loadChildren: () => import('./PssUpdateDetails/pssUpdate.module').then(m => m.pssUpdate)
  },
  {
    path: 'tool',
    loadChildren: () => import('./tool/pensionTool.module').then(m => m.pensionTool)
  },
  {
    path: 'psnMenu',
    loadChildren: () => import('./psnMenu/psn-menu.module').then(m => m.PsnMenuModule)
  },
  {
    path: 'third-party',
    loadChildren: () => import('./third-party/thirdParty.module').then(m => m.thirdParty)
  },
  {
    path: 'employee',
    loadChildren: () => import('./employee/employee.module').then(m => m.Employee)
  },
  {
    path: 'revised',
    loadChildren: () => import('./e-pension/revised-e-pension/revisedPension.module').then(m => m.revisedPension)
  },
  {
    path: 'vrs',
    loadChildren: () => import('./e-pension/vrs-mark/vrs.module').then(m => m.vrs)
  },

  {
    path: 'updatedocument',
    component: UpdateDocumentComponent
  },
  {
    path: 'pensioneridcard',
    component: PensionerIdcardComponent
  },
  {
    path: 'datacorrection',
    component: DataCorrectionComponent
  },
  {
    path: 'pensionkit',
    loadChildren: ()=> import('./pension-kit/pension-kit.module').then(m => m.PensionKitModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('../itsok/itsok.module').then(m => m.itsok)
  },
]

@NgModule({
  declarations: [
    CommonDialogComponent,
    EsignModalComponent,
    ServiceRecordDialogComponent,
    MarkEmpRelieveDialogComponent,
    AdminQueryComponent,
    MultiESignComponent,
    AutoApproveDialogComponent,
    PensionEssViewComponent,
    SendDataComponent,
    RevisedPensionerListComponent,
    RevisedAutoApprovedDialogComponent,
    EssReportComponent,
    ViewObjectionComponent,
    PensionInitiatedComponent,
    TransDataEmpPensionComponent,
    UpdateDocumentComponent,
    IdleTimeoutComponent,
    SessionExpiredComponent,
    PensionerIdcardComponent,
    DataCorrectionComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    InboxModule,
    SharedModule,
    ReportsModule,
    QRCodeModule
  ],
  providers: [DatePipe],
})
export class CommonappModule { }
