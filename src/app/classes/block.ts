import {BlockzPlayer} from './blockz-player';
import * as THREE from 'three';

export class Block {
    constructor(public owner: BlockzPlayer, public block: THREE.Mesh) {
    }
}
