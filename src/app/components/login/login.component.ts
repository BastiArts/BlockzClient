import {Component, OnInit} from '@angular/core';
import {DataService} from '../../service/data.service';
import {SocketService} from '../../service/socket.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    constructor(public dataservice: DataService, private socketService: SocketService, private router: Router) {
    }

    ngOnInit() {
        this.socketService.connect('ws://localhost:8025/websockets/blockz');

    }

    loginNewPlayer() {
        if (this.dataservice.blockzUser.username !== '') {
            this.socketService.send(JSON.parse('{"type": "login", "username": "' + this.dataservice.blockzUser.username + '"}'));
            this.router.navigate(['games']);
        }
    }

}
