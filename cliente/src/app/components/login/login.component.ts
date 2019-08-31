import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  public identity;
  public token;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.title = 'Identificate';
    this.user = new User('', '', '', '', '', '', 'ROLE_USER', '', '');
  }

  ngOnInit() {
    console.log('Componente login cargado');
  }

  onSubmit() {
    // console.log(this.user);
    this._userService.singUp(this.user).subscribe(
      Response => {
        this.identity = Response.user;
        // console.log(this.identity);
        if (!this.identity || !this.identity._id) {
          this.status = 'error';
        } else {
          // this.status = 'success';
          // Persistencia de datos del usuario
          localStorage.setItem('Identity', JSON.stringify(this.identity));
          // token
          this.getToken();
        }
      },
      error => {
        // tslint:disable-next-line:prefer-const
        let errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null ) {
          this.status = 'error';
        }
      }
    );
  }
  getToken () {
    this._userService.singUp(this.user, 'true').subscribe(
      Response => {
        this.token = Response.token;
        // console.log(this.token);
        if (this.token.length <= 0) {
          this.status = 'error';
        } else {
          // this.status = 'success';
          // Persistencia de datos del usuario en el localstorage
          localStorage.setItem('token', this.token);
          // Marcadores de usuario
          this.getContadores();
        }
      },
      error => {
        // tslint:disable-next-line:prefer-const
        let errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null ) {
          this.status = 'error';
        }
      }
    );
  }

  getContadores () {
    this._userService.getContadores().subscribe(
      Response => {
        // console.log(Response);
        localStorage.setItem('stats', JSON.stringify(Response));
        this.status = 'success';
        this._router.navigate(['/home']);
      },
      error => {
        console.log(<any>error);
      }
    );
  }
}
