import { Component, OnInit } from '@angular/core';

/*
 * Page Not Found
 * This component displays when the user is attempting to access
 * protected components without proper authentication. This may also
 * display if the url to any of the router links is incorrect.
 */
@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

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
