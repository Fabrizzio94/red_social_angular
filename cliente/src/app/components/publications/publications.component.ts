import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { ProfileComponent } from '../profile/profile.component';
// import { $ } from 'protractor';
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  providers: [UserService, PublicationService]
})
export class PublicationsComponent implements OnInit, OnChanges {
  public identity;
  public token;
  public title: string;
  public url: string;
  public status: string;
  public page;
  public total;
  public pages;
  public publications: Publication[];
  public items_per_page;
  public noMore = false;
  @Input() user: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _profileService: ProfileComponent
  ) {
    this.identity = this._userService.getIdentidad();
    this.token = this._userService.getToken();
    this.title = 'Time Line';
    this.url = GLOBAL.url;
    this.page = 1;
   }
  //  @ViewChild(ProfileComponent) _profileComponent: ProfileComponent; // la etiqueta profile no esta en publications
  ngOnInit() {
    console.log('componente publications cargado!!');
    // console.log(this.user);
    this.getPublicaciones(this.user, this.page);
  }
  ngOnChanges(changes: SimpleChanges): void {
    //  Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    this.user = changes['user'].currentValue;
    // console.log('valor actual: ' + this.user);
    this.refresh();
  }
  getPublicaciones (user, page, adding = false) {
    this._publicationService.getPublicationsUser(this.token, user, page).subscribe(
      Response => {
        // console.log(Response);
        if (Response.publications) {
          this.total = Response.total_items;
          this.pages = Response.pages;
          this.items_per_page = Response.items_per_page;
          // console.log(Response.publications);
          if (!adding) {
            this.publications = Response.publications;
            // console.log(this.publications);
          } else {
            // tslint:disable-next-line:prefer-const
            let arrayA = this.publications;
            // tslint:disable-next-line:prefer-const
            let arrayB = Response.publications;
            this.publications = arrayA.concat(arrayB);
            $('html, body').animate({ scrollTop: $('html').prop('scrollHeight')}, 500);
          }
          if (page > this.page) {
            // this._router.navigate(['/home']);
          }
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
  refresh(event = null) {
    this.noMore = false;
    // let stats = JSON.parse(localStorage.getItem('stats'));
    this.getPublicaciones(this.user, this.page);
  }
  viewMore() {
    this.page += 1;
    // console.log(this.page + ' ' + this.pages);
    if (this.page === this.pages) {
        this.noMore = true;
    }
    this.getPublicaciones(this.user, this.page, true);
  }
  deletePublication(id) {
    this._profileService.deletePublication(this.publications[id]._id);
    // this._profileComponent.deletePublication(this.publications[id]._id);
    this.refresh();
  }
}
