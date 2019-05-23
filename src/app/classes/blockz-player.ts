import {BlockzUser} from './blockz-user';

export class BlockzPlayer {
    public username: string;
    public game: string;
    public height = 1.8;
    public turnSpeed = Math.PI * 0.02;
    public speed = 1; // 0.2
    public position = {};
    public color = 0xfeb74c;

    constructor(blockzuser: BlockzUser) {
        this.username = blockzuser.username;
        this.game = blockzuser.game;
    }
}
