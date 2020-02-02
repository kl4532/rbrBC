import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { GeneralComponent } from './general/general.component';
import { StageComponent } from './stage/stage.component';


const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: 'general', component: GeneralComponent },
  { path: 'stage', component: StageComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
