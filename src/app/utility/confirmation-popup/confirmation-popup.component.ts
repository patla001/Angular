import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


/*
 * Confirmation Popup
 * Displays a simple popup box that takes in the title and
 * confirmation message, and contains a negative and positive
 * action button that returns false or true, respectively
 * to the host component.
 */
@Component({
    selector: 'app-confirmation-popup',
    templateUrl: './confirmation-popup.component.html',
    styleUrls: ['./confirmation-popup.component.css']
})
export class ConfirmationPopupComponent implements OnInit {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    // I/O
    /*
        Input
        (confirmationInitData: String[]) - expects data to be sent from
            parent component with specifications for each of the following
            indices:
            [0] = confirmation title
            [1] = confirmation message/details

        Output
        (emitOnConfirmationOutputResult) - sends data back to parent with
            two possible values:
            true = confirm
            false = cancel
    */
    @Input() confirmationInitData: string[];
    @Output() onConfirmationOutputResult = new EventEmitter<boolean>();

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor() { }

    ngOnInit() {

    }

    /*==========================================================
                            METHODS
    ==========================================================*/
    emitOnConfirmationOutputResult(value: boolean) {
        this.onConfirmationOutputResult.emit(value);
    }
}
