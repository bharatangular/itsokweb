
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  // { path: '', redirectTo: 'PensionApplication/Inbox', pathMatch: 'full' },


  {
    path: '',
    loadChildren: () => import('./pension/commonapp.module').then(m => m.CommonappModule)
   },
   {
    path: 'itsok',
    loadChildren: () => import('./pension/commonapp.module').then(m => m.CommonappModule)
   }
  //  , {
  //   path: 'PensionApplication',
  //   loadChildren: () => import('./pension-application/pension-application.module').then(m => m.PensionApplicationModule)
  // },
  // {
  // // {
  // //   path: 'PensionApplication',canActivate:[AuthGuard],
  // //   loadChildren: () => import('./pension-application/pension-application.module').then(m => m.PensionApplicationModule)
  // // },


  // {
  //   path: '',
  //   redirectTo: '',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true, relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]

})
export class AppRoutingModule { }
