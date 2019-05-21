import {Component, OnInit} from '@angular/core';
import {SocketService} from '../../service/socket.service';
import {Game} from '../../classes/game';
import {Router} from '@angular/router';

@Component({
    selector: 'app-game-view',
    templateUrl: './game-view.component.html',
    styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {
    games: Array<Game>;
    createGameCheck: boolean = false;

    constructor(private socketService: SocketService, private router: Router) {
    }

    ngOnInit() {
        this.socketService.send(JSON.parse('{"type": "getGames"}'));
        this.socketService.infoEmitter.subscribe(info => {
            if (info.type === 'games' && info.games != null) {
                this.games = info.games;
            }
        });
    }

    createGame() {
        // create Game logic
        this.createGameCheck = true;
        this.router.navigate(['games/create']);
    }

    joinGame(game: Game) {
        // Join Game logic
        this.socketService.send(JSON.parse('{"type": "join", "game": "' + game.gameID + '"}'));
    }
}
