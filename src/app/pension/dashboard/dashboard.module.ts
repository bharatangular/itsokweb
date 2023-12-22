import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpcomingRetirementsComponent } from './upcoming-retirements/upcoming-retirements.component';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { FilteruniquePipe } from './filterunique.pipe';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DashFilterComponent } from './dash-filter/dash-filter.component';
import { DashDialogComponent } from './dash-dialog/dash-dialog.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UpcomingRetirementsComponent,
    DonutChartComponent,
    FilteruniquePipe,
    DashFilterComponent,
    DashDialogComponent,
    
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ]
  ,providers: [
    // ...,
     {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: { floatLabel: 'always' },
      },]
})
export class DashboardModule { }
