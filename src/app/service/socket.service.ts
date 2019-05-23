import {EventEmitter, Injectable, Output} from '@angular/core';
import {StatusMessage} from '../classes/status-message';
import {GameConfig} from '../classes/game-config';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private ws: WebSocket;

    @Output()
    connectionEmitter: EventEmitter<boolean> = new EventEmitter(true);

    @Output()
    gameEmitter: EventEmitter<GameConfig> = new EventEmitter(true);

    @Output()
    statusEmitter: EventEmitter<StatusMessage> = new EventEmitter(true);
    @Output()
    infoEmitter: EventEmitter<string> = new EventEmitter(true);

    constructor() {
    }

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
        switch (object.type) {
            case 'games':
                if (object.games != null) {
                    console.log(object.games.length);
                    this.infoEmitter.emit(object);
                }
                break;
            case 'status':
                this.statusEmitter.emit(new StatusMessage(object.code, object.message));
                break;
            case 'update':
                this.gameEmitter.emit(new GameConfig(object.game, object.players, object.cubes));
                break;
            default:
                break;
        }

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

}
