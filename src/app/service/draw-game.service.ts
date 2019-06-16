import {Injectable} from '@angular/core';
import {ScoreboardUser} from '../classes/draw/scoreboard-user';

@Injectable({
    providedIn: 'root'
})
export class DrawGameService {

    private round = 1;
    private maxRounds = 3;
    private timer = 2; // 2 Minuten
    private scoreboard: Array<ScoreboardUser> = [];
    // User, who guessed the word --> in zukunft wird es Serverseitig gespeichert
    private guessedRight: Array<string> = [];

    constructor() {
    }

    resetAll() {
        this.round = 1;
        this.maxRounds = 3;
        this.timer = 2;
        this.scoreboard = [];
    }

    resetTimer() {
        this.timer = 2;
    }

    nextRound() {
        if (this.round <= this.maxRounds) {
            this.resetTimer();
            this.round += 1;
        }
    }

    getRound() {
        return this.round;
    }

    getMaxRounds() {
        return this.maxRounds;
    }

    getScoreboard() {
        return this.scoreboard;
    }

    getTimer() {
        return this.timer;
    }
}
