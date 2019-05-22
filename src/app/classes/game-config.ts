import {BlockzPlayer} from './blockz-player';
import * as THREE from 'three';

export class GameConfig {
    constructor(public gameID: string, public players: Array<BlockzPlayer>, public scene: THREE.Scene) {

    }
}
