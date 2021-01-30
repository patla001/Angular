import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { UploadTabBarEnum } from './upload-tab-bar-enum';


/*
 * Upload Tab Bar Popup
 * Used in the resume and syllabus components and allows the
 * user to add these files to firestore. The outputs are
 * specified below.
 */
@Component({
    selector: 'app-upload-tab-bar-popup',
    templateUrl: './upload-tab-bar-popup.component.html',
    styleUrls: ['./upload-tab-bar-popup.component.css']
})
export class UploadTabBarPopupComponent implements OnInit, OnDestroy {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    // I/O
    /*
        Output
        (cancelPopupOutput) - notifies parent to cancel the popup
        (uploadPdfOutput) - sends the selected pdf file
            back to the parent to be uploaded to storage
        (uploadHtmlOutput) - sends the sanitized html string
            back to the parent to be uploaded to storage
    */
    @Output() onCancelPopupOutput = new EventEmitter();
    @Output() onUploadPdfOutput = new EventEmitter<any>();
    @Output() onUploadHtmlOutput = new EventEmitter<string>();

    uploadTabBarEnum = UploadTabBarEnum;
    currentTab = this.uploadTabBarEnum.CHOOSE_FILE;
    pdfSrc: string;

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor() { }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    /*==========================================================
                            METHODS
    ==========================================================*/
    /*
     * Sets current tab, either "Upload File" or "Enter Text"
     */
    setCurrentTab(tab: UploadTabBarEnum) {
        this.currentTab = tab;
    }

    /*
     * After input file detects change in file, read the file
     */
    onFileSelected() {
        let selectedFileInput: any = document.querySelector('#pdf-input-file');

        if (typeof (FileReader) !== 'undefined') {
            let reader = new FileReader();

            reader.onload = (e: any) => {
                this.pdfSrc = e.target.result;
                console.log("pdfSrc = " + this.pdfSrc);
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
    emitCancelPopupOutput() {
        this.onCancelPopupOutput.emit();
    }
    emitUploadOutput() {
        // If current tab is CHOOSE_FILE, emit resume by file
        if (this.currentTab == this.uploadTabBarEnum.CHOOSE_FILE) {
            // Grab handle on input file
            let selectedFileInput: any = document.querySelector('#pdf-input-file');
            const selectedFile = selectedFileInput.files[0];

            // Check that file was selected
            if (selectedFile == null || selectedFile == undefined) {
                console.log("No file selected");
                return;
            }

            // Check that selected file was pdf
            if (!this.validateFile(selectedFile.name)) {
                console.log("Selected file is not a pdf")
                return;
            }

            this.emitOnUploadPdfOutput(selectedFile);
        }
        // Else if current tab is ENTER_TEXT, emit resume by html string
        else if (this.currentTab == this.uploadTabBarEnum.ENTER_TEXT) {
            this.emitOnUploadHtmlOutput();
        }
    }
    emitOnUploadPdfOutput(value: any) {
        this.onUploadPdfOutput.emit(value);
    }
    // TODO
    emitOnUploadHtmlOutput() {
        this.onUploadHtmlOutput.emit();
    }
}
