import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateLrNoComponent } from './update-lr-no/update-lr-no.component';
import { MasterConfigScreenComponent } from './master-config-screen/master-config-screen.component';
import { ProcessLevelMappingComponent } from './process-level-mapping/process-level-mapping.component';
import { ProcessTaskConfigComponent } from './process-task-config/process-task-config.component';
import { ProcessTaskActionComponent } from './process-task-action/process-task-action.component';
import { MultiRequestComponent } from './multi-request/multi-request.component';
import { MatDialogModule } from '@angular/material/dialog';

import { UserManualUpdateComponent } from './user-manual-update/user-manual-update.component';
import { UserManualFormComponent } from './user-manual-form/user-manual-form.component';
import { UpcomingPensionerToolsListComponent } from './upcoming-pensioner-tools-list/upcoming-pensioner-tools-list.component';
import { MultiToolComponent } from './multi-tool/multi-tool.component';
import { ExtraComponent } from './extra/extra.component';
import { BillPushComponent } from './bill-push/bill-push.component';







const routes: Routes = [
    {
    path: 'update-lr',
    component: UpdateLrNoComponent
  },
  {
    path:'masterconfigscreen',
    component:MasterConfigScreenComponent
  },
  {
    path:'processLabelMapping',
    component: ProcessLevelMappingComponent
  },
  {
    path:'processTaskConfig',
    component: ProcessTaskConfigComponent
  },
  {
    path:'processTaskAction',
    component: ProcessTaskActionComponent
  },
  {
    path: 'multi-request',
    component: MultiRequestComponent
  },
  {
    path:'getEmpDetails',
    component:UpcomingPensionerToolsListComponent
  },
  {
    path: 'userManual',
    component: UserManualUpdateComponent,
  },
  {
    path:'userManualForm',
    component:UserManualFormComponent
  },
  {
    path:'multi-tool',
    component:MultiToolComponent
  },
  {
    path:'extra',
    component:ExtraComponent
  },
  {
    path:'bill',
    component:BillPushComponent
  }
  ]

@NgModule({
  declarations: [

    UpdateLrNoComponent,
    MasterConfigScreenComponent,
    ProcessLevelMappingComponent,
    ProcessTaskConfigComponent,
    ProcessTaskActionComponent,
    MultiRequestComponent,
    UserManualUpdateComponent,
    UserManualFormComponent,
    UpcomingPensionerToolsListComponent,
    MultiToolComponent,
    ExtraComponent,
    BillPushComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule,
  ]
})
export class pensionTool { }
