import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ContentTabBarEnum } from './content-tab-bar-enum';


/*
 * Content TabBar Popup
 * Used in Content component and displays when the faculty
 * wants to add a file type under the content directory.
 * The following outputs are specified below.
 */
@Component({
    selector: 'app-content-tab-bar-popup',
    templateUrl: './content-tab-bar-popup.component.html',
    styleUrls: ['./content-tab-bar-popup.component.css']
})
export class ContentTabBarPopupComponent implements OnInit {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    // I/O
    /*
        Output
        (cancelPopupOutput) - notifies parent to cancel the popup
        (onAddFileOutput) - emits file to parent component
        (onAddLinkOutput) - emits link title and url to parent component
                        [0]: link title
                        [1]: link url
        (onAddTextOutput) - emits text title and content to parent component
                        [0]: text title
                        [1]: text content
        (onAddHtmlOutput) - emits html title and content to parent component
                        [0]: html title
                        [1]: html content
    */
    @Output() onCancelPopupOutput = new EventEmitter();
    @Output() onAddFileOutput = new EventEmitter<any>();
    @Output() onAddLinkOutput = new EventEmitter<string[]>();
    @Output() onAddTextOutput = new EventEmitter<string>();
    @Output() onAddHtmlOutput = new EventEmitter<string>();

    contentTabBarEnum = ContentTabBarEnum;
    currentTab: ContentTabBarEnum = this.contentTabBarEnum.FILE;

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor() { }

    ngOnInit() {

    }

    /*==========================================================
                            METHODS
    ==========================================================*/
    /*
     * Sets current tab, either "Upload File" or "Enter Text"
     */
    setCurrentTab(tab: ContentTabBarEnum) {
        this.currentTab = tab;
    }

    /*
     * After input file detects change in file, read the file
     */
    onFileSelected() {
        let selectedFileInput: any = document.querySelector('#input-file');

        if (typeof (FileReader) !== 'undefined') {
            let reader = new FileReader();

            reader.onload = (e: any) => {
                // this.pdfSrc = e.target.result;
                // console.log("pdfSrc = " + this.pdfSrc);
                console.log("input file = " + selectedFileInput.files[0]);
            };

            reader.readAsArrayBuffer(selectedFileInput.files[0]);
        }
    }

    /*
     * Validate the file by checking that extension is .pdf
     */
    validateFile(name: string): boolean {
        var extension = name.substring(name.lastIndexOf('.') + 1);
        if (extension.toLowerCase() == 'pdf') {
            return true;
        }
        else {
            return false;
        }
    }

    /*==========================================================
                            OUTPUT
    ==========================================================*/
    emitOnCancelPopupOutput() {
        this.onCancelPopupOutput.emit();
    }
    emitOnAddOutput() {
        switch (this.currentTab) {
            case this.contentTabBarEnum.FILE: {
                // Grab handle on input file
                let selectedFileInput: any = document.querySelector('#input_file');
                const selectedFile = selectedFileInput.files[0];

                // Check that file was selected
                if (selectedFile == null || selectedFile == undefined) {
                    console.log("No file selected");
                    return;
                }

                // Check that selected file was within list of accepted extensions
                if (!this.validateFile(selectedFile.name)) {
                    console.log("Selected file does not match acceptable extensions")
                    return;
                }

                this.emitOnAddFileOutput(selectedFile);
                break;
            }
            case this.contentTabBarEnum.LINK: {
                let linkUrlTitle: any = document.querySelector("#link_input_title");
                let linkUrlInput: any = document.querySelector("#link_input_url");
                let title = linkUrlTitle.value;
                let link = linkUrlInput.value;
                this.emitOnAddLinkOutput(title, link);
                break;
            }
            case this.contentTabBarEnum.TEXT: {
                this.emitOnAddTextOutput("");
                break;
            }
            case this.contentTabBarEnum.HTML: {
                this.emitOnAddHtmlOutput("");
                break;
            }
        }
    }
    emitOnAddFileOutput(value: any) {
        this.onAddFileOutput.emit(value);
    }
    emitOnAddLinkOutput(title: string, value: string) {
        this.onAddLinkOutput.emit([title, value]);
    }
    emitOnAddTextOutput(value: string) {
        this.onAddTextOutput.emit(value);
    }
    emitOnAddHtmlOutput(value: string) {
        this.onAddHtmlOutput.emit(value);
    }
}
