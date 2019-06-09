import {Injectable} from '@angular/core';
import {BlockzUser} from '../classes/blockz-user';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    blockzUser: BlockzUser = new BlockzUser();
    // Game Choosing
    chosenGame: string = '';
    // For the Lobby-Size
    maxPlayers: number = -1;
    // Players in the current Game
    players: Array<object> = [];

    constructor() {
    }

    static decodeString(text) {
        return decodeURIComponent(text);
    }

    static encodeString(text) {
        return encodeURIComponent(text);
    }
}
