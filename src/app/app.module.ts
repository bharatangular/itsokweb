import { LayoutModule } from './layout/layout.module';
import { ContentComponent } from './layout/content/content.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FamilyDetailsPopupComponent } from './family-details-popup/family-details-popup.component';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptorInterceptor } from './interceptor/auth-interceptor.interceptor';
import { LoaderComponent } from './shared/loader/loader.component';
// import { MatCardModule } from '@angular/material/card';
// import { MatIconModule } from '@angular/material/icon';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatSidenavModule} from '@angular/material/sidenav';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonDirective } from './directives/common.directive';

import { RoleDialogComponent } from './pension/role-dialog/role-dialog.component';

import { FormsModule } from '@angular/forms';
import { MarkEmpDeDialogComponent } from './pension/mark-de/mark-emp-de-dialog/mark-emp-de-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    FamilyDetailsPopupComponent,
    CommonDirective,
    LoaderComponent,
    RoleDialogComponent,
  
    MarkEmpDeDialogComponent,
  
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule ,
    FormsModule,
    // MatCardModule,
    // MatIconModule,
    // MatExpansionModule,
    // MatSidenavModule,
   
    LayoutModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
