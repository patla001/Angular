import { Component, OnInit, Input } from '@angular/core';

/*
    Code Credit:
    https://codepen.io/shalimano/pen/wBmNGJ?editors=1100
    (working) http://dev.gojko.net/web/2015/09/19/material-design-progress-pure-css.html
*/

/*
 * Indeterminate Progress Bar
 * Used to notify use that a confirmed action is under progress. For this
 * app, use this as a busywait when firing actions to firestore, storage,
 * or database.
 */
@Component({
    selector: 'app-indeterminate-progress-bar',
    templateUrl: './indeterminate-progress-bar.component.html',
    styleUrls: ['./indeterminate-progress-bar.component.css']
})
export class IndeterminateProgressBarComponent implements OnInit {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    // I/O
    /*
        Input
        (progressTitle: string) - the title or message to display
    */
    @Input() progressTitle: string;

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
