import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {GameViewComponent} from './components/game-view/game-view.component';
import {AuthGuard} from './service/auth.guard';
import {CreateGameComponent} from './components/create-game/create-game.component';

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
    {
        path: 'games', component: GameViewComponent, canActivate: [AuthGuard], children: [
            {path: 'create', component: CreateGameComponent},
        ]
    },
  // Fallback route if not logged in
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
