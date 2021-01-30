import { Component, OnInit, OnDestroy } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

/*
 * User Resume
 * Displays the resume of the current user. The user may
 * upload a resume which opens up the Upload Tab Bar Popup
 * under utility. The user may also delete the current resume
 * if any exists.
 */
@Component({
    selector: 'app-user-resume',
    templateUrl: './user-resume.component.html',
    styleUrls: ['./user-resume.component.css']
})
export class UserResumeComponent implements OnInit, OnDestroy {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    // Popups
    isPopupVisible: boolean = false;
    isConfirmationPopupVisible: boolean = false;
    confirmationPopupInput: string[] = [
        "Delete the current resume?",
        "Confirming this action will delete the current resume."
    ]
    isProgressBarVisible: boolean = false;
    // progressBarPercent: number = 0;

    // GET Resume
    getResumeTitle: string = "Retrieving resume...";
    resumeDownloadUrl: string;
    resumeDownloadUrl$: Observable<string | null>;

    // pdfBlobToUrl: string = null;

    // POST Resume
    uploadTitle: string = "Uploading resume...";
    uploadPercent: string = "";
    uploadPercent$: Observable<number>;
    downloadUrl$: Observable<string>;
    meta$: Observable<any>;

    /*
        Subscriptions:
            - Getting the resume
            - Uploading percent
            - Uploading file
    */
    subscriptions: Subscription;

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor(private storage: AngularFireStorage) { }

    ngOnInit() {
        this.subscriptions = new Subscription();

        this.getResume();
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }

    /*==========================================================
                            METHODS
    ==========================================================*/

    //------------------------ POPUPS ------------------------//
    setPopupVisible(value: boolean) {
        console.log("setPopupVisible() - value=" + value);
        this.isPopupVisible = value;
    }
    setConfirmationPopupVisible(value: boolean) {
        console.log("setConfirmationPopupVisible() - value=" + value);
        this.isConfirmationPopupVisible = value;
    }
    setProgressBarVisible(value: boolean) {
        console.log("setProgressBarVisible() - value=" + value);
        this.isProgressBarVisible = value;
    }

    //-------------------- GET RESUME (PDF) ------------------//
    getResume() {
        const ref = this.storage.ref('University of California, Santa Barbara/users/faculty/id12345/' + 'Resume - Thuc Nguyen.pdf');
        this.resumeDownloadUrl$ = ref.getDownloadURL();
        this.subscriptions.add(
            this.resumeDownloadUrl$.subscribe((value: string) => {
                this.resumeDownloadUrl = value;
                console.log("Download url is: " + this.resumeDownloadUrl);

                // this.pdfBlobToUrl = URL.createObjectURL(value);
            })
        );
    }

    //------------------ UPLOAD RESUME (PDF) -----------------//
    /*
     * Upload the selected file, expected to be PDF, to cloud storage
     */
    uploadFileToCloudStorage(selectedFile: any) {

        // Make progress bar visible
        this.setProgressBarVisible(true);

        // Prepare path to cloud storage and upload file
        const filePath = 'University of California, Santa Barbara/users/faculty/id12345/' + selectedFile.name;
        const ref = this.storage.ref(filePath);
        const task = ref.put(selectedFile);

        // Observe percentage changes
        this.uploadPercent$ = task.percentageChanges();

        this.subscriptions.add(
            this.uploadPercent$.subscribe((value: number) => {
                this.uploadPercent = value.toString() + "%";
                console.log("Upload Percent:" + this.uploadPercent);
            })
        );

        // Get notified when download url is available
        this.subscriptions.add(
            task.snapshotChanges().pipe(
                finalize(() => {
                    this.downloadUrl$ = ref.getDownloadURL();

                    this.meta$ = ref.getMetadata();
                    console.log("meta = " + this.meta$);

                    this.setProgressBarVisible(false);
                })
            ).subscribe()
        );

        // this.subscriptions.add(
        //     this.uploadPercent$.subscribe(
        //         this.uploadPercentObs(),
        //         this.defaultErrObs()
        //     )
        // );
    }

    // private uploadPercentObs(): any {
    //     const obs = (value) => {
    //         console.log(value);
    //     };
    //     return obs;
    // }
    //
    // private defaultErrObs(): any {
    //     const obs = (err) => {
    //         console.log(err);
    //     };
    //     return obs;
    // }

    //------------------ UPLOAD RESUME (HTML) ----------------//


    //--------------------- DELETE RESUME --------------------//
    deleteResume() {
        if (this.resumeDownloadUrl == null  || this.resumeDownloadUrl == undefined) {
            console.log("There is no resume to delete");
            return;
        }

        this.storage.storage.refFromURL(this.resumeDownloadUrl).delete();
    }

    /*==========================================================
                            OUTPUT
    ==========================================================*/
    onUploadPdfOutput(value: any) {
        this.setPopupVisible(false);
        this.uploadFileToCloudStorage(value);
    }
    onUploadHtmlOutput(value: string) {
        this.setPopupVisible(false);
    }

    onPdfViewerError(error: any) {
        console.log("There was an error displaying the pdf file after GET request");
        console.log("Error = " + error);
    }

    onConfirmationOutputResult(value: boolean) {
        console.log("onConfirmationOutputResult()");

        // Confirm
        if (value) {
            console.log("confirm received");
            this.setConfirmationPopupVisible(false);
            this.deleteResume();
        }
        // Cancel
        else {
            console.log("cancel received");
            this.setConfirmationPopupVisible(false);
        }
    }
}
