import {Component, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {DataService} from './service/data.service';
import {SocketService} from './service/socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'BlockzClient';

    constructor(private router: Router, private dataservice: DataService, private socketService: SocketService) {
    }

    ngOnInit(): void {
        // Listening to route-changes and send a leave!
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (!event.url.endsWith('lobby') && !event.url.endsWith('drawgame')) {
                    if (this.dataservice.wasInLobby) {
                        this.socketService.send(JSON.parse('{"type": "leaveGame", "lobbyID": "' + this.dataservice.blockzUser.game + '"}'));
                    }
                }
            }
        });
    }
}
