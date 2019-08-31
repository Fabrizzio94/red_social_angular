import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Message } from '../models/message';
import { GLOBAL } from './global';

@Injectable()
export class MessageService {
    public url: string;
    constructor(
        private _http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }
    addMessage(token, message): Observable <any> {
        // tslint:disable-next-line:prefer-const
        let params = JSON.stringify(message);
        // tslint:disable-next-line:prefer-const
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                    .set('Authorization', token);
        return this._http.post(this.url + 'message', params, {headers: headers});
    }
    getMensajes(token, page = 1): Observable <any> {
        // tslint:disable-next-line:prefer-const
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                    .set('Authorization', token);
        return this._http.get(this.url + 'my-messages/' + page, {headers: headers});
    }
    getMensajesEnviados(token, page = 1): Observable <any> {
        // tslint:disable-next-line:prefer-const
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                    .set('Authorization', token);
        return this._http.get(this.url + 'messages/' + page, {headers: headers});
    }
}
