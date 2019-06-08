import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../service/data.service';

@Component({
    selector: 'app-draw-game',
    templateUrl: './draw-game.component.html',
    styleUrls: ['./draw-game.component.css']
})
export class DrawGameComponent implements OnInit {

    constructor(public dataservice: DataService) {
    }

    ngOnInit() {

    }

}
