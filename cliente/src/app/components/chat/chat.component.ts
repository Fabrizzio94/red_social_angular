import { Component, OnInit } from '@angular/core';
import { User } from '../../models//user';
import { ChatService } from '../../services/chat.service';
import { FollowService } from '../../services/follow.service';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
declare var $: any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService, FollowService, UserService]
})
export class ChatComponent implements OnInit {
  public url: string;
  public user: User;
  public followers;
  public status: string;
  public identity;
  public token;
  public messageText: string;
  public userConnectedArray: Array<{user: String, socket: String}> = [];
  constructor(
    private _chatService: ChatService,
    private _followService: FollowService,
    private _userService: UserService
  ) {
    // this.user = this._userService.getIdentidad();
    // this.identity = this.user;
    this.identity = this._userService.getIdentidad();
    this.token = this._userService.getToken();
    // this.messageArray = [{'user': this.identity.name + this.identity.surname }];
    // this._chatService.newUserJoined().subscribe(data => this.messageArray.push(data));
    // this._chatService.getVal().subscribe({
    //   next(x) { console.log('Socket id: ' + x); }
    // });
   }

  ngOnInit() {
    console.log('Chat cargado! ');
    this.url = GLOBAL.url;
    if (this.identity != null) {
      this.getUsersFollowers(this.identity._id);
    }
  }
  getUsersFollowers (user_id) {
    this._followService.getFollowers(this.token, user_id).subscribe(
      Response => {
        if (!Response.follows) {
          this.status = 'error';
        } else {
          this.followers = Response.follows;
          // console.log(this.followers);
          this.followers.forEach(element => {
            // console.log(element);
            this.userConnectedArray = [{'user': element.user.name + ' ' + element.user.surname ,
                                        'socket': '222'}];
            // this._chatService.getVal().subscribe({
            //   next(x) {
            //     console.log('Socket id: ' + x);
            //   }
            // });
            this.userConnectedArray.forEach(data => {
              console.log(data);
            });
          });
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
  onClickWindow () {
    // tslint:disable-next-line:prefer-const
    let panel_div = $('.panel.panel-chat > .panel-heading > .chatMinimize');
    // $('.panel.panel-chat > .panel-heading > .chatMinimize').click(function() {
      if (panel_div.parent().parent().hasClass('mini')) {
        panel_div.parent().parent().removeClass('mini').addClass('normal');
          $('.panel-body-window').animate({height: '250px'}, 500).show();

          // $('.panel.panel-chat > .panel-footer').animate({height: '75px'}, 500).show();
      } else {
        panel_div.parent().parent().removeClass('normal').addClass('mini');
          $('.panel-body-window').animate({height: '0'}, 500);

          // $('.panel.panel-chat > .panel-footer').animate({height: '0'}, 500);

          setTimeout(function() {
              $('.panel.panel-chat > .panel-body').hide();
          }, 500);
      }
    return false;
  }
  updateSocketIdofUser() {
    console.log('gello');
    // const sho = this._chatService.getSocketIdofUser();
    // this._userService.updateUserIdSocket(this.identity._id, socketId).subscribe(
    //   Response  => {
    //     // console.log(Response);
    //   },
    //   error => {
    //     // tslint:disable-next-line:prefer-const
    //     let errorM = <any>error;
    //     console.log('El error es:' + errorM);
    //   }
    // );
  }
  sendMessage() {
    // this._chatService.sendMessage(this.message);
    // // this.insertChat('me', this.message, 20001);
    // this.message = '';
  }
  // minimizeUserChatList () {
  //   $('.panel.panel-chat > .panel-heading > .chatClose').click(function() {
  //     $(this).parent().parent().remove();
  //   });
  //   return false;
  // }
}
