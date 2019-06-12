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
    hostID: string = '';

    constructor(public dataservice: DataService, private socketService: SocketService, private router: Router) {
    }

    ngOnInit() {
        if (this.dataservice.players.length === 0) {
            this.dataservice.players.push(new DrawPlayer(this.dataservice.blockzUser.username, null, null, this.dataservice.blockzUser.sessionID));
        }
        // Gets invoked if a player joins the Game
        this.socketService.joinEmitter.subscribe(player => {
            this.dataservice.players = player.game.players;
            this.hostID = player.game.hostID;
        });

        // Gets invoked if the connection is lost to the Server
        this.socketService.connectionEmitter.subscribe(connected => {
            if (!connected) {
                this.socketService.send(JSON.parse('{"type": "leaveGame", "game": "' + this.dataservice.blockzUser.game + '"}'));
                this.socketService.disconnect();
                this.router.navigate(['login']);
            }
        });

        // Gets invoked if a Game action is made (Draw or something)
        this.socketService.drawGameEmitter.subscribe(res => {
            if (res.type === 'start') {
                this.dataservice.blockzUser.role = this.dataservice.blockzUser.sessionID === res.drawer ? 'DRAWER' : 'GUESSER';
                this.router.navigate(['drawgame']);
            }
        });
        this.dataservice.wasInLobby = true;
    }

    startGame() {
        if (this.dataservice.players.length > 1) {
            this.socketService.send(JSON.parse('{"type": "startGame"}'));
            this.router.navigate(['drawgame']);
        } else {
            alert('Not enough Players! Min. 2');
        }
    }

    decodeUsername(user) {
        return decodeURIComponent(user.username);
    }

}
