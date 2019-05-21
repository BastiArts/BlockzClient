import {EventEmitter, Injectable, Output} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private ws: WebSocket;

    @Output()
    connectionEmitter: EventEmitter<boolean> = new EventEmitter(true);

    @Output()
    //  chatEmitter: EventEmitter<ChatMessage> = new EventEmitter(true);

    @Output()
    //  statusEmitter: EventEmitter<StatusMessage> = new EventEmitter(true);
    @Output()
    infoEmitter: EventEmitter<string> = new EventEmitter(true);

    connect(uri: string) {
        this.ws = new WebSocket(uri);
        this.ws.onopen = () => this.onOpen();
        this.ws.onclose = (ev) => this.onClose(ev);
        this.ws.onmessage = (ev) => this.onMessage(ev);
        this.ws.onerror = (ev) => this.onError(ev);
    }

    disconnect() {
        this.ws.close();
        sessionStorage.clear();
    }

    onOpen() {
        console.log('onopen');
        this.connectionEmitter.emit(true);
    }

    onClose(ev) {
        console.log('onclose' + ev);
        this.connectionEmitter.emit(false);
    }

    onMessage(ev) {
        console.log('onmessage');
        console.log('Received: ' + ev.data);
        const object = JSON.parse(ev.data);
        if (object.games != null) {
            console.log(object.games.length);
            this.infoEmitter.emit(object);
        }
        /*    const message = <Message> JSON.parse(ev.data);

            if (message.type === 'chat') {
                this.chatEmitter.emit(<ChatMessage> message);
            } else if (message.type === 'status') {
                this.statusEmitter.emit(<StatusMessage> message);
            } else {
                console.error('Could not interpret message');
            }*/
    }

    onError(ev) {
        console.log('onerror');
        console.error(ev);
        this.connectionEmitter.emit(false);
    }

    send(message: string) {
        const jsonStr = JSON.stringify(message);
        console.log('Sent: ' + jsonStr);
        this.ws.send(jsonStr);
    }


    constructor() {
    }
}
