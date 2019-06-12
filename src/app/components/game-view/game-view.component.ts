import {Component, OnInit} from '@angular/core';
import {SocketService} from '../../service/socket.service';
import {Game} from '../../classes/game';
import {Router} from '@angular/router';
import {DataService} from '../../service/data.service';

@Component({
    selector: 'app-game-view',
    templateUrl: './game-view.component.html',
    styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {
    games: Array<Game>;
    createGameCheck = false;

    constructor(private dataservice: DataService, private socketService: SocketService, private router: Router) {
    }

    ngOnInit() {

        this.socketService.send(JSON.parse('{"type": "getGames"}'));
        this.socketService.infoEmitter.subscribe(info => {
            if (info.games != null) {
                this.games = info.games;
            }
        });
        this.dataservice.blockzUser.game = decodeURIComponent(this.dataservice.blockzUser.game);
    }

    createGame() {
        // create Game logic
        this.createGameCheck = true;
        this.router.navigate(['games/create']);
    }

    joinGame(gameID: string) {
        // Join Game logic
        if (this.dataservice.chosenGame === 'blockz') {
            this.socketService.send(JSON.parse('{"type": "join", "game": "' + gameID + '"}'));
            this.dataservice.blockzUser.game = gameID;
            this.router.navigateByUrl('game');
        } else if (this.dataservice.chosenGame === 'draw') {
            this.socketService.send(JSON.parse('{"type": "joinLobby", "lobbyID": "' + gameID + '"}'));
            this.dataservice.blockzUser.game = gameID;
            this.router.navigateByUrl('lobby');
        }

    }

    resolveGameID(g: Game) {
        return decodeURIComponent(g.gameID);
    }
}
