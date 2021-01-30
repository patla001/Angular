import { Component, OnInit } from '@angular/core';

/*
 * User Home
 * Component acting as a container for the outermost navigation
 * links for the following child components:
 *
 * - Account
 * - Courses
 * - Calendar
 */
@Component({
    selector: 'app-user-home',
    templateUrl: './user-home.component.html',
    styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/

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
