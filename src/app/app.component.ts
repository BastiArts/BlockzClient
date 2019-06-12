import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
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
            if (event instanceof NavigationStart) {
                if (!event.url.endsWith('lobby') || !event.url.endsWith('game')) {
                    if (this.dataservice.wasInLobby) {
                        
                    }
                }
            }
        });
    }
}
