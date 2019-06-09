import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../service/data.service';
import {SocketService} from '../../../service/socket.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-draw-game',
    templateUrl: './draw-game.component.html',
    styleUrls: ['./draw-game.component.css']
})
export class DrawGameComponent implements OnInit {

    constructor(public dataservice: DataService, private socketService: SocketService, private router: Router) {
    }

    ngOnInit() {
        // Gets invoked if the connection is lost to the Server
        this.socketService.connectionEmitter.subscribe(connected => {
            if (!connected) {
                this.socketService.send(JSON.parse('{"type": "leaveGame", "game": "' + this.dataservice.blockzUser.game + '"}'));
                this.socketService.disconnect();
                this.router.navigate(['login']);
            }
        });


    }


}
