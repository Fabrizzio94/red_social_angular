import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models//user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services//follow.service';
import { GLOBAL } from '../../services/global';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService, FollowService]
})
export class UsersComponent implements OnInit {
  public title: String;
  public identity;
  public token;
  public url: String;
  public page;
  public next_page;
  public prev_page;
  public status: String;
  public total;
  public pages;
  public users: User[];
  public follows;
  public followUserOver;
  public requestFriendstatus: string;
  public requestFriendfollowed: string;
  public requestFrienduser: string;
  public array: [];
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {
    this.title = 'Gente';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentidad();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    console.log('Componente usuarios cargado!!');
    this.actualPage();
    // this.statusRequest();
  }
  actualPage() {
    this._route.params.subscribe(params => {
      // tslint:disable-next-line:prefer-const
      let page = +params['page'];
      this.page = page;
      // console.log('pagina: ' + params['page']);
      if (!params['page']) {
        page = 1;
      }
      if (!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;
        if (this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }
      // console.log(page + ' || ' + this.page + '| ' + this.pages + ' || ' + this.next_page);
      // listado de usuarios
      this.getUsers(page);
    });
  }
  getUsers (page) {
    this._userService.getUsers(page).subscribe(
      Response => {
        if (!Response.users) {
          this.status = 'error';
        } else {
          // console.log(Response);
          this.total = Response.total;
          this.users = Response.users;
          this.pages = Response.pages;
          this.follows = Response.users_following;
          // console.log(page + ' | ' + this.page + ' || ' + this.pages);
          if (page > this.pages) {
            this._router.navigate(['/gente', 1]);
          }
        }
      },
      error => {
        // tslint:disable-next-line:prefer-const
        let errorM = <any>error;
        console.log('El error es:' + errorM);
        if (errorM != null) {
          this.status = 'error';
        }
      }
    );
  }
  mouseEnter(user_id) {
    this.followUserOver = user_id;
    // console.log('idactual' + user_id);
    // this.statusRequest();
  }
  mouseLeave(user_id) {
    this.followUserOver = 0;
    this.requestFrienduser = '';
    this.requestFriendfollowed = '';
    this.requestFriendstatus = '';
    // console.log('verf' + this.requestFriend);
  }

  followUser (followed) {
    // tslint:disable-next-line:prefer-const
    let follow  = new Follow('', this.identity._id, followed, '');
    this._followService.addFollow(this.token, follow).subscribe(
      Response => {
        if (!Response.follow) {
          this.status = 'error';
        } else {
          this.status = 'success';
          this.follows.push(followed);
        }
      },
      error => {
        // tslint:disable-next-line:prefer-const
        let errorM = <any>error;
        console.log(errorM);
        if (errorM != null) {
          this.status = 'error';
        }
      }
    );
  }
  /*statusRequest() {
     // tslint:disable-next-line:prefer-const
     this._followService.getFollowStatus(this.token, this.identity).subscribe(
       Response => {

        this.requestFrienduser = Response.user;
        this.requestFriendfollowed = Response.followed;
        this.requestFriendstatus = Response.status;
       },
      error => {
        // tslint:disable-next-line:prefer-const
        let errorM = <any>error;
        console.log('El error es:' + errorM);
        if (errorM != null) {
          this.status = 'error';
        }
      }
     );
  }*/
  unFollowuser(followed) {
    this._followService.deleteFollow(this.token, followed).subscribe(
      Response => {
        // tslint:disable-next-line:prefer-const
        let search = this.follows.indexOf(followed);
        if (search !== -1 ) {
          this.follows.splice(search, 1);
        }
      },
      error => {
        // tslint:disable-next-line:prefer-const
        let errorM = <any>error;
        console.log('El error es:' + errorM);
        if (errorM != null) {
          this.status = 'error';
        }
      }
    );
  }
}
