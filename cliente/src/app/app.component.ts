import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {
  public title: string;
  public identity;
  public url: string;
  public barraEstado = false;
  public currentUrl: string;
  public llave = false;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.title = '  Patito 1  ';
    this.url = GLOBAL.url;
    this.currentUrl = this._router.url;
  }

  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.identity = this._userService.getIdentidad();
    if (this.currentUrl === '/') {
      this.llave = true;
    }
  }
  ngDoCheck() {
    // Add 'implements DoCheck' to the class.
    this.identity = this._userService.getIdentidad();
  }

  logout() {
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/']);
  }
  ocultarChat($event) {
    this.barraEstado = true;
    $(document).ready(function() {
      $('.frame').click(function() {
        console.log('click');
        $('.contenedor').hide();
        $('.ul-chat').hide();
        $('.frame').hide();
        $('.frame').addClass('hide_wrap_box');
      });
      /*$('.frame').click(function () {
        $('.ul-chat .contenedor .msj-rta .macro .mytext').show();
        $('.frame').removeClass('hide_wrap_box');
    });**/
    });
  }
  mostrarChat($event) {
    this.barraEstado = false;
    $(document).ready(function() {
      $('.ul-chat .contenedor .msj-rta .macro .mytext').show();
    });
  }
}
