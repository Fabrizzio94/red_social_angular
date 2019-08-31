import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Follow } from '../models/follow';
import { GLOBAL } from './global';
@Injectable({
  providedIn: 'root'
})
export class FollowService {
  public url: string;
  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;
   }
  addFollow(token, follow): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let params = JSON.stringify(follow);
    // tslint:disable-next-line:prefer-const
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                  .set('Authorization', token);
    return this._http.post(this.url + 'follow', params, {headers: headers});
  }
  deleteFollow(token, id): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                  .set('Authorization', token);
    return this._http.delete(this.url + 'follow/' + id, {headers: headers});
  }
  /*getFollowStatus(token, user_id): Observable<any> {
    // tslint:disable-next-line:prefer-const
    const params = JSON.stringify(user_id);
    // tslint:disable-next-line:prefer-const
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                  .set('Authorization', token);
    return this._http.get(this.url + 'getstatus/' + user_id, {headers: headers});
  }*/
  getFollowing(token, userId = null, page = 1): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                  .set('Authorization', token);
    // tslint:disable-next-line:prefer-const
    let url = this.url + 'following';
    if (userId != null) {
      url = this.url + 'following/' + userId + '/' + page;
    }
    return this._http.get(url, {headers: headers});
  }
  getFollowers(token, userId = null, page = 1): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                  .set('Authorization', token);
    // tslint:disable-next-line:prefer-const
    let url = this.url + 'followed';
    if (userId != null) {
      url = this.url + 'followed/' + userId + '/' + page;
    }
    return this._http.get(url, {headers: headers});
  }
  getmyFollows(token): Observable <any> {
    // tslint:disable-next-line:prefer-const
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                  .set('Authorization', token);
    return this._http.get(this.url + 'get-my-follows/true', {headers: headers});
  }

}
