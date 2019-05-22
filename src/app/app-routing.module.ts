import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {GameViewComponent} from './components/game-view/game-view.component';
import {AuthGuard} from './service/auth.guard';
import {CreateGameComponent} from './components/create-game/create-game.component';
import {GameComponent} from './components/game/game.component';
import {GameGuard} from './service/game.guard';

const routes: Routes = [
  // Fallback route if logged in
  {path: '', redirectTo: 'login', pathMatch: 'full'},
    {
        path: 'game', component: GameComponent, canActivate: [GameGuard], children: [
            {path: '**', redirectTo: 'game'}
    ]
    },
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
