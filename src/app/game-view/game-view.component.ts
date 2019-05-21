import {Component, OnInit} from '@angular/core';
import {SocketService} from '../service/socket.service';
import {Game} from '../classes/game';

@Component({
    selector: 'app-game-view',
    templateUrl: './game-view.component.html',
    styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {
    games: Array<Game>;

    constructor(private socketService: SocketService) {
    }

    ngOnInit() {
        this.socketService.send(JSON.parse('{"type": "getGames"}'));
        this.socketService.infoEmitter.subscribe(info => {
            this.games = info.games;
        });
    }

    createGame() {
        // create Game logic
    }

    joinGame(game: Game) {
        // Join Game logic
        this.socketService.send(JSON.parse('{"type": "join", "game": "' + game.gameID + '"}'));
    }
}
