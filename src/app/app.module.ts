import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {DataService} from './service/data.service';
import {SocketService} from './service/socket.service';
import {GameViewComponent} from './components/game-view/game-view.component';
import {CreateGameComponent} from './components/create-game/create-game.component';
import {AuthGuard} from './service/auth.guard';
import {GameComponent} from './components/game/game.component';
import {GameGuard} from './service/game.guard';
import {LobbyComponent} from './components/draw/lobby/lobby.component';
import {DrawGameComponent} from './components/draw/draw-game/draw-game.component';
import {ChatBarComponent} from './components/draw/chat-bar/chat-bar.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        GameViewComponent,
        CreateGameComponent,
        GameComponent,
        LobbyComponent,
        DrawGameComponent,
        ChatBarComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule
    ],
    providers: [DataService, SocketService, AuthGuard, GameGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
}
