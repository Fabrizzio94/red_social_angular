import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers:  [ UserService, UploadService]
})
export class UserEditComponent implements OnInit {
  public title: string;
  public user: User;
  public identity;
  public token;
  public status: string;
  public valorInput: string;
  public url: string;
  public filesToUpload: Array<File>;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService,
  ) {
    this.title = 'Actualizados datos';
    this.user = this._userService.getIdentidad();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
   }

  ngOnInit() {
    console.log('user-edit cargado!');
  }
  onSubmit() {
    this.valorInput = $('input[name = "dp"]').val();
    if (this.valorInput === '') {
      return alert('Fecha de nacimiento necesaria');
    } else {
      this.user.fecha = $('input[name = "dp"]').val();
    }
    this._userService.updateUser(this.user).subscribe(
      Response => {
        if (!Response.user) {
          this.status = 'error';
        } else {
          this.status = 'success';
          localStorage.setItem('Identity', JSON.stringify(this.user));
          this.identity = this.user;
          // console.log('response: ' + Response);
          // subida de imagen
          this._uploadService.reqFile(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image')
                              .then((result: any) => {
                                this.user.image = result.user.image;
                                localStorage.setItem('Identity', JSON.stringify(this.user));
                              });
        }
      },
      error => {
        // tslint:disable-next-line:prefer-const
        let messageError = <any>error;
        // console.log('este error' + messageError);
        if (messageError != null ) {
          this.status = 'error';
        }
      }
    );
    // console.log(this.user);
  }
  datePicker() {
    $('#datetimepicker').datepicker({
      format: 'dd-mm-yyyy',
      language: 'es',
      autoclose: true,
      todayHighlight: true,
      orientation: 'bottom'
    });
    // console.log('Fecha es: ' +  $('input[name = "dp"]').val());
  }
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }

}
