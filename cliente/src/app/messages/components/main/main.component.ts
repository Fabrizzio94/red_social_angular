import { Component, OnInit, DoCheck } from '@angular/core';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    public title: string;
    constructor() {
        this.title = 'Mensajeria';
    }

    ngOnInit() {
        console.log('Mensajeria cargada!');
    }
}
