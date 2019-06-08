import {Component, OnInit} from '@angular/core';
import {DrawPlayer} from '../../../classes/draw/draw-player';
import {DataService} from '../../../service/data.service';
import {SocketService} from '../../../service/socket.service';

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
    players: Array<object> = [];
    hostID: string = '';

    constructor(public dataservice: DataService, private socketService: SocketService) {
    }

    ngOnInit() {
        this.socketService.joinEmitter.subscribe(player => {
            //     this.players.push(player.players));
            this.players = player.game.players;
            if (this.players.length === 0) {
                this.players.push(new DrawPlayer(this.dataservice.blockzUser.username, null, null, this.dataservice.blockzUser.sessionID));
            }
            this.hostID = player.game.hostID;
            alert(this.hostID);
        });
        this.socketService.connectionEmitter.subscribe(connected => {
            if (!connected) {
                this.socketService.send(JSON.parse('{"type": "leaveGame", "game": "' + this.dataservice.blockzUser.game + '"}'));

                this.socketService.disconnect();
            }
        });

    }

    startGame() {
        if (this.players.length > 1) {
            alert('yeet');
        } else {
            alert('Not enough Players! Min. 2');
        }
    }

}
