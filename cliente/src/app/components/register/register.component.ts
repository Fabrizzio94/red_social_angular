import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  public title: string;
  public user: User;
  public valorInput: string;
  public status: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.title = 'Registrate';
    this.user = new User('', '', '', '', '', '', 'ROLE_USER', '', '');
  }

  ngOnInit() {
    console.log('Componente de registro guardado');
  }
  datePicker() {
    $('#datetimepicker').datepicker({
      format: 'dd-mm-yyyy',
      language: 'es',
      autoclose: true,
      todayHighlight: true,
      orientation: 'bottom'
    });
    console.log('Fecha es: ' +  $('input[name = "dp"]').val());
  }
  onSubmit(form) {
    this.valorInput = $('input[name = "dp"]').val();
    if (this.valorInput === '') {
      return alert('Fecha de nacimiento necesaria');
    } else {
      this.user.fecha = $('input[name = "dp"]').val();
    }
    this._userService.registro(this.user).subscribe(
      Response => {
        if (Response.user && Response.user._id) {
          // console.log(Response.user);
          this.status = 'success';
          form.reset();
        } else {
          // console.log(Response.user);
          this.status = 'error';
        }
      },
      error => {
        console.log(<any>error);
      }
    );

    // $('#datetimepicker').datepicker('update', ''); */
  }
}

