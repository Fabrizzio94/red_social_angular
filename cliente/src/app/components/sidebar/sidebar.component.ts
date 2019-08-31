import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service';
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService, PublicationService, UploadService]
})
export class SidebarComponent implements OnInit {
  public identity;
  public token;
  public stats;
  public url: String;
  public status;
  public publication: Publication;
  public filesToUpload: Array<File>;
  // output
  @Output() enviado = new EventEmitter();
  sendPublication(event) {
    this.enviado.emit({send: 'true'});
  }
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _uploadService: UploadService
  ) {
    this.identity = this._userService.getIdentidad();
    this.token = this._userService.getToken();
    this.stats  = this._userService.getEstado();
    this.url = GLOBAL.url;
    this.publication = new Publication('', '', '', '', this.identity._id);
   }

  ngOnInit() {
    console.log('Sidebar cargado!');
    this.refreshCounters(this.identity._id);
  }
  onSubmit(form, $event) {
    // tslint:disable-next-line:prefer-const
    let innp = $('#inputFile');
    this._publicationService.addPublication(this.token, this.publication).subscribe(
      Response => {
        if (Response.publication) {
          this.publication = Response.publication;
          if (this.filesToUpload && this.filesToUpload.length) {
            // imagen
              // tslint:disable-next-line:max-line-length
              this._uploadService.reqFile(this.url + 'upload-image-pub/' + Response.publication._id, [], this.filesToUpload, this.token, 'image')
                                  .then((result: any) => {
                                    this.status = 'success';
                                    this.publication.file = result.image;
                                    form.reset();
                                    innp.val('');
                                    this._router.navigate(['/timeline']);
                                    this.enviado.emit({send: 'true'});
                                  }).catch((err) => {
                                    console.log(<any>err);
                                  });
          } else {
            this.status = 'success';
            form.reset();
            innp.val('');
            // this._profileComponent.getContadores(this.identity);
            this._router.navigate(['/timeline']);
            this.enviado.emit({send: 'true'});
          }
          this.refreshCounters(this.identity._id);
        } else {
          this.status = 'error';
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
  fileChangeEvent (fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    if (fileInput.files && fileInput.files[0]) {
      $('.gl-upload').css('color', 'green');
    } else {
      $('.gl-upload').css('color', 'black');
    }
  }
  refreshCounters(id) {
    this.stats = this._userService.getContadores(id).subscribe(
      Response => {
        // console.log(Response);
        this.stats = Response;
        localStorage.setItem('stats', JSON.stringify(Response));
      },
      error => {
        console.log(<any>error);
      }
    );
  }
}
