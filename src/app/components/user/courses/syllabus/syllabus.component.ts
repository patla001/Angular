import { Component, OnInit, OnDestroy } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';


/*
 * Syllabus
 * Displays, if any, the syllabus for the current course.
 * Implentation is similar to Roster component.
 */
@Component({
    selector: 'app-syllabus',
    templateUrl: './syllabus.component.html',
    styleUrls: ['./syllabus.component.css']
})
export class SyllabusComponent implements OnInit, OnDestroy {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    // Popups
    isPopupVisible: boolean = false;
    isConfirmationPopupVisible: boolean = false;
    confirmationPopupInput: string[] = [
        "Delete the current syllabus?",
        "Confirming this action will delete the current syllabus."
    ]
    isProgressBarVisible: boolean = false;
    // progressBarPercent: number = 0;

    // GET Syllabus
    getSyllabusTitle: string = "Retrieving syllabus...";
    syllabusDownloadUrl: string;
    syllabusDownloadUrl$: Observable<string | null>;

    // POST Syllabus
    uploadTitle: string = "Uploading syllabus...";
    uploadPercent: string = "";
    uploadPercent$: Observable<number>;
    downloadUrl$: Observable<string>;
    meta$: Observable<any>;

    /*
        Subscriptions:
            - Getting the syllabus
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

        this.getSyllabus();
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

    //-------------------- GET Syllabus (PDF) ------------------//
    getSyllabus() {
        const ref = this.storage.ref('University of California, Santa Barbara/users/faculty/id12345/syllabus/' + 'Resume - Thuc Nguyen.pdf');
        this.syllabusDownloadUrl$ = ref.getDownloadURL();
        this.subscriptions.add(
            this.syllabusDownloadUrl$.subscribe((value: string) => {
                this.syllabusDownloadUrl = value;
                console.log("Download url is: " + this.syllabusDownloadUrl);
            })
        );
    }

    //------------------ UPLOAD SYLLABUS (PDF) -----------------//
    /*
     * Upload the selected file, expected to be PDF, to cloud storage
     */
    uploadFileToCloudStorage(selectedFile: any) {

        // Make progress bar visible
        this.setProgressBarVisible(true);

        // Prepare path to cloud storage and upload file
        const filePath = 'University of California, Santa Barbara/users/faculty/id12345/syllabus/' + selectedFile.name;
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

    //------------------ UPLOAD SYLLABUS (HTML) ----------------//


    //--------------------- DELETE SYLLABUS --------------------//
    deleteSyllabus() {
        if (this.syllabusDownloadUrl == null  || this.syllabusDownloadUrl == undefined) {
            console.log("There is no syllabus to delete");
            return;
        }

        this.storage.storage.refFromURL(this.syllabusDownloadUrl).delete();
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

    onConfirmationOutputResult(value: boolean) {
        console.log("onConfirmationOutputResult()");

        // Confirm
        if (value) {
            console.log("confirm received");
            this.isConfirmationPopupVisible = false;
            this.deleteSyllabus();
        }
        // Cancel
        else {
            console.log("cancel received");
            this.isConfirmationPopupVisible = false;
        }
    }
}
