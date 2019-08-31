import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { GLOBAL } from './global';
@Injectable()
export class UserService {
    public url: string;
    public identity;
    public token;
    public stats;
    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
    }
    registro (user: User): Observable <any> {
        // console.log(userRegister);
        // tslint:disable-next-line:prefer-const
        let params = JSON.stringify(user);
        // tslint:disable-next-line:prefer-const
        let headers =  new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'register', params, {headers: headers});
    }

    singUp(user: User, gettoken = null): Observable<any> {
        if (gettoken != null) {
            // user = Object.assign(user, {gettoken});
            user.gettoken = gettoken;
        }
        // tslint:disable-next-line:prefer-const
        let params = JSON.stringify(user);
        // tslint:disable-next-line:prefer-const
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'login', params, {headers: headers});
    }
    getIdentidad() {
        // tslint:disable-next-line:prefer-const
        let identity = JSON.parse(localStorage.getItem('Identity'));
        if ( identity !== 'undefined' ) {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }
    getToken() {
        // tslint:disable-next-line:prefer-const
        let token = localStorage.getItem('token');
        if (token !== 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }
    getEstado() {
        // tslint:disable-next-line:prefer-const
        let stats = JSON.parse(localStorage.getItem('stats'));
        if (stats !== 'undefined') {
            this.stats = stats;
        } else {
            this.stats = null;
        }
        return this.stats;
    }
    getContadores(userId = null): Observable<any> {
        // tslint:disable-next-line:prefer-const
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                    .set('Authorization', this.getToken());
        if (userId !=  null) {
            return this._http.get(this.url + 'counters/' + userId, {headers: headers});
        } else {
            return this._http.get(this.url + 'counters/', {headers: headers});
        }
    }

    updateUser(user: User): Observable<any> {
        // tslint:disable-next-line:prefer-const
        const params = JSON.stringify(user);
        // tslint:disable-next-line:prefer-const
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                    .set('Authorization', this.getToken());
        return this._http.put(this.url + 'update-user/' + user._id, params, {headers: headers});
    }
    updateUserIdSocket(id, socketId): Observable<any> {
        // const params = JSON.stringify(user);
        // console.log('pa' + params);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                    .set('Authorization', this.getToken());
        return this._http.put(this.url + 'updateUserIdSocket/' + id, socketId, {headers: headers});
    }
    // Listado de n usuarios
    getUsers(page = null): Observable<any> {
        // tslint:disable-next-line:prefer-const
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());
        return this._http.get(this.url + 'users/' + page, {headers: headers});
    }
    // Listado de usuario logeado
    getUser(id): Observable<any> {
        // tslint:disable-next-line:prefer-const
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());
        return this._http.get(this.url + 'user/' + id, {headers: headers});
    }
}

