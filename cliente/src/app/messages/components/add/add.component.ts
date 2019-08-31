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
    selector: 'add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.css'],
    providers: [FollowService, MessageService, UserService]
})
export class AddComponent implements OnInit {
    public title: string;
    public message: Message;
    public identity;
    public token;
    public url: string;
    public status: string;
    public follows;
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _messageService: MessageService,
        private _userService: UserService
    ) {
        this.title = 'Crear mensaje';
        this.identity = this._userService.getIdentidad();
        this.message = new Message('', '', '', '', this.identity._id, '');
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('add cargada!');
        this.getMyFollows();
    }
    onSubmit(form) {
        this._messageService.addMessage(this.token, this.message).subscribe(
            Response => {
                this.status = 'success';
                form.reset();
            },
            error => {
                this.status = 'error';
                console.log(<any>error);
            }
        );
    }
    getMyFollows () {
        this._followService.getmyFollows(this.token).subscribe(
            Response => {
                this.follows = Response.follows;
            },
            error => {
                console.log(<any>error);
            }
        );
    }
}
