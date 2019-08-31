import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService]
})
export class TimelineComponent implements OnInit {
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
    // public _sidebarComponent: SidebarComponent
  ) {
    this.identity = this._userService.getIdentidad();
    this.token = this._userService.getToken();
    this.title = 'Time Line';
    this.url = GLOBAL.url;
    this.page = 1;
   }
  public identity;
  public token;
  public title: string;
  public url: string;
  public status: string;
  public stats;
  public page;
  public total;
  public pages;
  public publications: Publication[];
  public items_per_page;
  public noMore = false;
  public showImage;
  @ViewChild(SidebarComponent) sidebar: SidebarComponent;

  ngOnInit() {
    console.log('componente timeline cargado!!');
    this.getPublicaciones(this.page);
  }
  getPublicaciones (page, adding = false) {
    this._publicationService.getPublications(this.token, page).subscribe(
      Response => {
        if (Response.publications) {
          this.total = Response.total_items;
          this.pages = Response.pages;
          this.items_per_page = Response.items_per_page;
          if (!adding) {
            this.publications = Response.publications;
          } else {
            // tslint:disable-next-line:prefer-const
            let arrayA = this.publications;
            // tslint:disable-next-line:prefer-const
            let arrayB = Response.publications;
            this.publications = arrayA.concat(arrayB);
            $('html, body').animate({ scrollTop: $('body').prop('scrollHeight')}, 500);
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
  /*viewMore() {
    console.log(this.publications.length + ' ' + this.total);
    if (this.publications.length === this.total) {
      this.noMore = true;
    } else {
      this.page += 1;
    }

    this.getPublicaciones(this.page, true);
  }*/
  viewMore() {
    this.page += 1;
    if (this.page === this.pages) {
        this.noMore = true;
    }
    this.getPublicaciones(this.page, true);
  }
  refresh(event = null) {
    this.noMore = false;
    this.sidebar.refreshCounters(this.identity._id);
    this.getPublicaciones(1);
  }
  showThisImage(id) {
    this.showImage = id;
  }
  deletePublication(id) {
    this._publicationService.deletePublication(this.token, id).subscribe(
      Response => {
        this.refresh();
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
