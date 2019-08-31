import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ChatService {
    public identity;
    public token;
    public stats;
    // private url: string; // 'http://localhost:3800/api/';
    private socket;
    private SocketId; // new BehaviorSubject<any>('');
    constructor(public _http: HttpClient) {
        this.socket = io('http://localhost:3800');
    }
    joinRoom(data) {
        this.socket.emit('join', data);
    }
    // newUserJoined() {
    //     // tslint:disable-next-line:prefer-const
    //     let observable = new Observable<{user: String}>(observer => {
    //         this.socket.on('new user joined', (data) => {
    //             observer.next(data);
    //         });
    //         return () => { this.socket.disconnect(); };
    //     });
    //     return observable;
    // }
    public sendMessage(message) {
        this.socket.emit('new-message', message);
    }
    // public getMessages = () => {
    //     return Observable.create((observer) => {
    //         this.socket.on('new-message', (message) => {
    //             observer.next(message);
    //         });
    //     });
    // }
    getVal() {
        // let observable = new Observable<{socketId: String}>
        // tslint:disable-next-line:prefer-const
        let observable = new Observable(observer => {
            this.socket.on('connect', (data) => {
                data = this.socket.id;
                observer.next(data);
            });
            return () => { this.socket.disconnect(); };
        });
        return observable;
    }

}
