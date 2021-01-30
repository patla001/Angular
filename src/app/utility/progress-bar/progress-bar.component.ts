import { Component, OnInit, Input } from '@angular/core';


/*
 * Progress Bar
 * Used when a user should wait for a confirmed action to complete.
 * Use when the upload task percentage is known.
 */
@Component({
    selector: 'app-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    // I/O
    /*
        Input
        (progressTitle) - the title of the operation
        (progressData) - expects data to be of type string, representing
            the percentage of the operation
    */
    @Input() progressTitle: string;
    @Input() progressData: string;

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
