import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public title: string;
  constructor() {
    this.title = 'Home';
  }

  ngOnInit() {
    console.log('componente home cargado');
  }

}
