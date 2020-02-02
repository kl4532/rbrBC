import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { GeneralComponent } from './general/general.component';
import { StageComponent } from './stage/stage.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    GeneralComponent,
    StageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
