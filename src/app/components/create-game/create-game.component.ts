import {Component, OnInit} from '@angular/core';
import {DataService} from '../../service/data.service';
import {SocketService} from '../../service/socket.service';
import {StatusMessage} from '../../classes/status-message';

@Component({
    selector: 'app-create-game',
    templateUrl: './create-game.component.html',
    styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {
    infoText: string = '';

    constructor(private dataService: DataService, private socketService: SocketService) {
    }

    ngOnInit() {
    }

    createGame() {
        this.socketService.send(JSON.parse('{"type": "createGame", "game": "' + this.dataService.blockzUser.game + '"}'));
        this.socketService.statusEmitter.subscribe((message: StatusMessage) => {
            if (message.statusCode === 199) { // See the status codes in StatusMessage.ts

            } else {
                this.infoText = message.message;
            }
        });
    }
}
