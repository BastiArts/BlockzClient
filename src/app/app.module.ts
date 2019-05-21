import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {DataService} from './service/data.service';
import {SocketService} from './service/socket.service';
import { GameViewComponent } from './game-view/game-view.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GameViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [DataService,SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
