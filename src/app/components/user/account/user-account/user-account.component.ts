import { Component, OnInit } from '@angular/core';

/*
 * User Account
 * Component acting as a container for the navigation links
 * pertaining to the current user, and contains the following
 * child components:
 *
 * - Profile
 * - Resume
 * - Settings
 */
@Component({
    selector: 'app-user-account',
    templateUrl: './user-account.component.html',
    styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {

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
