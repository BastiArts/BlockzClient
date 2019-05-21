import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {GameViewComponent} from './game-view/game-view.component';

const routes: Routes = [
  // Fallback route if logged in
  {path: '', redirectTo: 'login', pathMatch: 'full'},
 /* {
    path: 'game', component: DashboardComponent, canActivate: [AuthService], children: [
      // {path: '', component: this.dataservice.sessionUser.isStudent ? DefaultDashboardComponent : TeacherDashboardComponent},
      {path: '', component: DefaultDashboardComponent},
      {path: 'equipment', component: EquipmentOverviewComponent}, // NOTE: DELETE EQUIPMENT COMPONENT
      {path: 'logout', component: LogoutComponent},
      {path: 'profil', component: ProfileComponent},
      {path: 'settings', component: SettingsComponent},
      {path: '**', redirectTo: 'dashboard'}
    ]
  },*/
  {path: 'login', component: LoginComponent},
  {path: 'games', component: GameViewComponent},
  // Fallback route if not logged in
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
