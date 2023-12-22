
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "../app-routing.module";
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NewfooterComponent } from './newfooter/newfooter.component';
import { ContentComponent } from './content/content.component';
import { NewheaderComponent } from './newheader/newheader.component';
import { TogglesidemenuComponent } from './togglesidemenu/togglesidemenu.component';
import { FooterLandingComponent } from './footer-landing/footer-landing.component';
import { SharedModule } from "../shared/shared.module";




@NgModule({
  declarations: [
    LayoutComponent,
    ContentComponent,
    FooterComponent,
    HeaderComponent,
    NewfooterComponent,
    NewheaderComponent,
    TogglesidemenuComponent,
    FooterLandingComponent
  ],
  imports: [
    CommonModule,AppRoutingModule, MatIconModule, MatSidenavModule, MatButtonModule,SharedModule
  ],
  exports: [LayoutComponent]  
})
export class LayoutModule { }
