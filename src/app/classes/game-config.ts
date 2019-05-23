import {BlockzPlayer} from './blockz-player';
import {Block} from './block';

export class GameConfig {
    constructor(public gameID: string, public players: Array<BlockzPlayer>, public cubes: Array<Block>) {

    }
}
