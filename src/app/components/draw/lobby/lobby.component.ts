import {Component, OnInit} from '@angular/core';
import {DrawPlayer} from '../../../classes/draw/draw-player';
import {DataService} from '../../../service/data.service';
import {SocketService} from '../../../service/socket.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
    players: Array<object> = [];
    hostID: string = '';

    constructor(public dataservice: DataService, private socketService: SocketService, private router: Router) {
    }

    ngOnInit() {
        if (this.players.length === 0) {
            this.players.push(new DrawPlayer(this.dataservice.blockzUser.username, null, null, this.dataservice.blockzUser.sessionID));
        }
        this.socketService.joinEmitter.subscribe(player => {
            //     this.players.push(player.players));
            this.players = player.game.players;

            this.hostID = player.game.hostID;
        });

        this.socketService.connectionEmitter.subscribe(connected => {
            if (!connected) {
                this.socketService.send(JSON.parse('{"type": "leaveGame", "game": "' + this.dataservice.blockzUser.game + '"}'));
                this.socketService.disconnect();
                this.router.navigate(['login']);
            }
        });
        this.socketService.drawGameEmitter.subscribe(res => {
            if (res.type === 'start') {
                this.router.navigate(['drawgame']);
            }
        });

    }

    startGame() {
        if (this.players.length > 1) {
            this.socketService.send(JSON.parse('{"type": "startGame"}'));
            this.router.navigate(['drawgame']);
        } else {
            alert('Not enough Players! Min. 2');
        }
    }

}
