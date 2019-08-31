import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from '../../../models/message';
import { Follow } from '../../../models/follow';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { FollowService } from '../../../services//follow.service';
import { MessageService } from '../../../services/message.service';
import { GLOBAL } from '../../../services/global';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'received',
    templateUrl: './received.component.html',
    styleUrls: ['./received.component.css'],
    providers: [UserService, MessageService]
})
export class ReceivedComponent implements OnInit {
    public title: string;
    public identity;
    public token;
    public url: string;
    public status: string;
    public messages: Message[];
    public page;
    public pages;
    public total;
    public next_page;
    public prev_page;
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _messageService: MessageService,
        private _userService: UserService
    ) {
        this.title = 'Mensaje recibidos';
        this.identity = this._userService.getIdentidad();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }
    ngOnInit() {
        console.log('Received cargado!');
        this.actualPage();

    }
    getMensajes(token, page) {
        this._messageService.getMensajes(token, page).subscribe(
            Response => {
                if (Response.messages) {
                    this.messages = Response.messages;
                    this.total = Response.total;
                    this.pages = Response.pages;
                }
            },
            error => {
                console.log(<any>error);
            }
        );
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
          // listado de usuarios
          this.getMensajes(this.token, this.page);
        });
      }
}
