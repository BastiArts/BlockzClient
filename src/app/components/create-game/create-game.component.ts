import {Component, OnInit} from '@angular/core';
import {DataService} from '../../service/data.service';
import {SocketService} from '../../service/socket.service';
import {StatusMessage} from '../../classes/status-message';
import {Router} from '@angular/router';

@Component({
    selector: 'app-create-game',
    templateUrl: './create-game.component.html',
    styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {
    infoText = '';

    constructor(private dataService: DataService, private socketService: SocketService, private router: Router) {
    }

    ngOnInit() {
    }

    createGame() {
        this.socketService.send(JSON.parse('{"type": "createGame", "game": "' + this.dataService.blockzUser.game.replace(' ', '-') + '"}'));
        this.socketService.statusEmitter.subscribe((message: StatusMessage) => {
            if (message.statusCode === 199) { // See the status codes in StatusMessage.ts
                this.infoText = '';
                this.router.navigateByUrl('game');
            } else {
                this.infoText = message.message;
            }
        });
    }
}
