import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../service/data.service';
import {SocketService} from '../../../service/socket.service';
import {Message} from '../../../classes/draw/message';

@Component({
    selector: 'chatBar',
    templateUrl: './chat-bar.component.html',
    styleUrls: ['./chat-bar.component.css']
})
export class ChatBarComponent implements OnInit {
    messageToChat: string = '';
    history: Array<Message> = [];

    constructor(private dataservice: DataService, private socketService: SocketService) {
    }

    ngOnInit() {
        // JSON FORMAT: {type: "chat", "sender": "username", "message": "Hello World"}
        this.socketService.chatEmitter.subscribe(message => {
            if (message.type === 'chat') {
                const msg: Message = message;
                this.history.push(msg);
            }
        });
    }

    sendMessage() {
        this.socketService.send(JSON.parse('{"type": "chat", "sender": "' + this.dataservice.blockzUser.sessionID + '", "message": "' + this.messageToChat + '"}'));
        this.messageToChat = '';
    }

    resolveDisplayName(message: Message) {
        if (message.sender === this.dataservice.blockzUser.sessionID) {
            return 'Du';
        } else {
            for (const o of this.dataservice.players) {
                if (o['sessionID'] === message.sender) {
                    return o['username'];
                }
            }
        }
    }

}
