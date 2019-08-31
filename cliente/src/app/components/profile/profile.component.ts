import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params, ResolveEnd } from '@angular/router';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { PublicationService } from '../../services/publication.service';

import { SidebarComponent } from '../sidebar/sidebar.component';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService, PublicationService]
})
@Injectable()
export class ProfileComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  public identity;
  public token;
  public url;
  public stats;
  public followed;
  public following;
  public followUserOver;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService,
    private _publicationService: PublicationService
  ) {
    this.title = 'Perfil';
    this.identity = this._userService.getIdentidad();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.followed = false;
    this.following = false;
   }
  @ViewChild(SidebarComponent) sidebar: SidebarComponent;
  ngOnInit() {
    console.log('Componente profile cargado!!');
    this.loadPage();
  }

  loadPage() {
    this._route.params.subscribe(params => {
      // tslint:disable-next-line:prefer-const
      let id = params['id'];
      this.getUser(id);
      this.sidebar.refreshCounters(id);
      this.getContadores(id);
      // console.log(id + ' ' + this.user);
    });
  }
  getUser(id) {
    this._userService.getUser(id).subscribe(
      Response => {
        if (Response.user) {
          this.user = Response.user;
          if (Response.following && Response.following._id) {
            this.following = true;
          } else {
            this.following = false;
          }
          if (Response.followed && Response.followed._id) {
            this.followed = true;
          } else {
            this.followed = false;
          }
        } else {
          this.stats = 'error';
        }
      },
      error => {
        console.log(<any>error);
        this._router.navigate(['/perfil', this.identity._id]);
      }
    );
  }
  getContadores(id) {
    this._userService.getContadores(id).subscribe(
      Response => {
        // console.log(Response);
        this.stats = Response;
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  followUser (followed) {
    // tslint:disable-next-line:prefer-const
    let follow = new Follow('', this.identity._id, followed, '');
    this._followService.addFollow(this.token, follow).subscribe(
      Response => {
        this.following = true;
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  unfollowUser(followed) {
    this._followService.deleteFollow(this.token, followed).subscribe(
      Response => {
        this.following = false;
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }
  mouseLeave() {
    this.followUserOver = 0;
  }
  deletePublication(id) {
    this._publicationService.deletePublication(this.token, id).subscribe(
      Response => {
        this.loadPage();
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
}
