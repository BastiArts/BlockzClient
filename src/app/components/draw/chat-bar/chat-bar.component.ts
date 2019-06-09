import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../../service/data.service';
import {SocketService} from '../../../service/socket.service';
import {Message} from '../../../classes/draw/message';

@Component({
    selector: 'chatBar',
    templateUrl: './chat-bar.component.html',
    styleUrls: ['./chat-bar.component.css']
})
export class ChatBarComponent implements OnInit {
    @ViewChild('chatBox') private chatBox: ElementRef;
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
                this.scrollBottom();
            }
        });
    }

    sendMessage() {
        this.socketService.send(JSON.parse('{"type": "chat", "sender": "' + this.dataservice.blockzUser.sessionID + '", "message": "' + encodeURIComponent(this.messageToChat) + '"}'));
        this.messageToChat = '';
    }

    resolveDisplayName(message: Message) {
        if (message.sender === this.dataservice.blockzUser.sessionID) {
            return 'Du';
        } else {
            for (const o of this.dataservice.players) {
                if (o['sessionID'] === message.sender) {
                    return decodeURIComponent(o['username']);
                }
            }
        }
    }

    scrollBottom() {
        try {
            this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
        } catch (err) {
        }
    }

    decodeMessage(message: Message) {
        return decodeURIComponent(message.message);
    }
}
