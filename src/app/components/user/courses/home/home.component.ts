import { Component, OnInit } from '@angular/core';


/*
 * Home
 * The homepage of the selected course. Each course will have default
 * 'home' and 'course overview' tabs.
 */
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    background = 'primary';

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor() { }

    ngOnInit() {
    }

    /*==========================================================
                            METHODS
    ==========================================================*/

}
