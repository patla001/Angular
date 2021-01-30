import { Component, OnInit, Input, Output,
    EventEmitter, ElementRef, ViewChild } from '@angular/core';


/*
 * Input Text Popup
 * Takes in a string for the title/message of the popup, and allows
 * user to enter in a string, which is outputted to the parent component.
 */
@Component({
    selector: 'app-input-text-popup',
    templateUrl: './input-text-popup.component.html',
    styleUrls: ['./input-text-popup.component.css']
})
export class InputTextPopupComponent implements OnInit {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    // I/O
    /*
        Input
        (inputTextTitle: string) - the title or message for the popup

        Output
        (onCancelPopupOutput) - notifies parent to cancel the popup
        (onInputTextOutput) - emits the string as output to the parent
            component.
    */
    @Input() inputTextTitle: string;
    @Output() onCancelPopupOutput = new EventEmitter();
    @Output() onInputTextOutput = new EventEmitter<string>();

    @ViewChild('input_text') inputText: ElementRef;

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor() { }

    ngOnInit() {
        this.setFocusToInput();
    }

    /*==========================================================
                            METHODS
    ==========================================================*/
    setFocusToInput(): void {
        this.inputText.nativeElement.focus();
    }

    /*==========================================================
                            OUTPUT
    ==========================================================*/
    emitOnCancelPopupOutput() {
        this.onCancelPopupOutput.emit();
    }

    emitOnInputTextOutput(value: string) {
        this.onInputTextOutput.emit(value);
    }
}
