import {BlockzPlayer} from './blockz-player';
import * as THREE from 'three';

export class Block {

    constructor(public owner: BlockzPlayer, public color, public x: number, public y: number, public z: number) {
    }
}
