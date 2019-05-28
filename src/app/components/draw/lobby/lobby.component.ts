import {Component, OnInit} from '@angular/core';
import {DrawPlayer} from '../../../classes/draw/draw-player';
import {DataService} from '../../../service/data.service';

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
    players: Array<DrawPlayer> = [];

    constructor(public dataservice: DataService) {
    }

    ngOnInit() {
        this.players.push(new DrawPlayer(this.dataservice.blockzUser.username, this.dataservice.blockzUser.game));
    }

}
