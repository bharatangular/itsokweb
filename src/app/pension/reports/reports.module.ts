import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { UpcomingPensionerListComponent } from './upcoming-pensioner-list/upcoming-pensioner-list.component';
import { EnhancePensionReportComponent } from './enhance-pension-report/enhance-pension-report.component';
import { PsnPendingFilesComponent } from './psn-pending-files/psn-pending-files.component';
import { OfficeDetailByOfficeIdComponent } from './office-detail-by-office-id/office-detail-by-office-id.component';
import { PsnPendingStatusDetailComponent } from './psn-pending-status-detail/psn-pending-status-detail.component';
import { PsnPendingFilesOfficeWiseComponent } from './psn-pending-files-office-wise/psn-pending-files-office-wise.component';
import { FirstPensionReportComponent } from './first-pension-report/first-pension-report.component';
import { OfficeRolebyReportComponent } from './office-roleby-report/office-roleby-report.component';
import { PaymentRejectionReportComponent } from './payment-rejection-report/payment-rejection-report.component';
import { ZonalWiseFinalCaseReportComponent } from './zonal-wise-final-case-report/zonal-wise-final-case-report.component';
import { EmployeeSummaryComponent } from './employee-summary/employee-summary.component';
import { PensionSummaryComponent } from './pension-summary/pension-summary.component';
import { UpcomingPensionsComponent } from './upcoming-pensions/upcoming-pensions.component';
import { FiltersComponent } from './filters/filters.component';
import { CommonDialogForReportsComponent } from './common-dialog-for-reports/common-dialog-for-reports.component';
import { ZoneOfficeWisePendencyReportComponent } from './zone-office-wise-pendency-report/zone-office-wise-pendency-report.component';
import { GpoPpoBillreportComponent } from './gpo-ppo-billreport/gpo-ppo-billreport.component';
import { TotalRetirementCategoryComponent } from './total-retirement-category/total-retirement-category.component';
import { EmployeeEssPensionStatusComponent } from './employee-ess-pension-status/employee-ess-pension-status.component';
import { RevisedCommutationReportComponent } from './revised-commutation-report/revised-commutation-report.component';
import { EmployeEssPensionStatusComponent } from './employe-ess-pension-status/employe-ess-pension-status.component';
import { PensionUserListComponent } from './pension-user-list/pension-user-list.component';
import { PssLifeCertificateReportComponent } from './pss-life-certificate-report/pss-life-certificate-report.component';


const routes: Routes = [
   
    {
      path: 'upcomingPensionerReport',
      component: UpcomingPensionerListComponent
    },
    {
      path: 'enhancePensionReport',
      component: EnhancePensionReportComponent
    }, 
    {
      path: 'firstPensionReport',
      component: FirstPensionReportComponent
    },
    {
      path: 'zonalwisefinalreport',
      component: ZonalWiseFinalCaseReportComponent
    },
    {
      path: 'pendingFiles',
      component: PsnPendingFilesComponent
    },  
    {
      path: 'officeDetByOffId',
      component: OfficeDetailByOfficeIdComponent
    },
    {
      path: 'psnPendFilesOfficeWise',
      component: PsnPendingFilesOfficeWiseComponent
    },   
    {
      path: 'rolesbyreport',
      component: OfficeRolebyReportComponent
    },   
    {
      path: 'psnPendingStatusDetails',
      component: PsnPendingStatusDetailComponent
    },
    
    
    {
      path: 'psnpaymentrejection',
      component : PaymentRejectionReportComponent
    },
    {
      path: 'bill-push-paymanager',
      component : GpoPpoBillreportComponent
    },
  
    {
      path: 'employeeSummary',
      component : EmployeeSummaryComponent
    },
    {
      path: 'pensionSummary',
      component : PensionSummaryComponent
    },
    {
      path: 'upcomingPensions',
      component: UpcomingPensionsComponent
    },
    {
      path: 'zoneofficewisependancyreport', 
      component: ZoneOfficeWisePendencyReportComponent
    },
    {
      path: 'totalretirement', 
      component: TotalRetirementCategoryComponent
    },
    {
      path: 'employeepensionstatus', 
      component: EmployeEssPensionStatusComponent
    },
    {
      path: 'commutationrequest',
      component: RevisedCommutationReportComponent
    },
    {
      path: 'pensionuserlist',
      component: PensionUserListComponent
    },
    {
      path: 'psslifecertificate',
      component: PssLifeCertificateReportComponent
    }
  ]

@NgModule({
  declarations: [
    UpcomingPensionerListComponent, 
    EnhancePensionReportComponent,
    FirstPensionReportComponent,
    PsnPendingFilesComponent,
    OfficeDetailByOfficeIdComponent,
    PsnPendingStatusDetailComponent,
    PsnPendingFilesOfficeWiseComponent, 
    OfficeRolebyReportComponent, 
    PaymentRejectionReportComponent, 
    ZonalWiseFinalCaseReportComponent, 
    EmployeeSummaryComponent, 
    PensionSummaryComponent, 
    UpcomingPensionsComponent, 
    FiltersComponent, CommonDialogForReportsComponent, ZoneOfficeWisePendencyReportComponent,GpoPpoBillreportComponent, TotalRetirementCategoryComponent, EmployeeEssPensionStatusComponent, RevisedCommutationReportComponent, EmployeEssPensionStatusComponent, PensionUserListComponent, PssLifeCertificateReportComponent
   ],

  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonModule,
    
  ]
})
export class ReportsModule { }
