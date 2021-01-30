import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { Announcement } from '../../../../model/announcement';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';


enum AnnouncementState {
    NEW,
    EDIT
}

/*
 * Add Announcement
 */
@Component({
    selector: 'app-add-announcement',
    templateUrl: './add-announcement.component.html',
    styleUrls: ['./add-announcement.component.css']
})
export class AddAnnouncementComponent implements OnInit, OnDestroy {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    id: string;
    private announcementDoc: AngularFirestoreDocument<Announcement>;
    announcement$: Observable<Announcement>;
    announcement: Announcement;
    subscriptions: Subscription = new Subscription();

    // Flags
    gettingAnnouncement: boolean = false;
    submittingAnnouncement: boolean = false;
    updatingAnnouncement: boolean = false;

    // Forms
    announcementFormGroup: FormGroup;

    // States
    currentAnnouncementState: AnnouncementState = AnnouncementState.NEW;

    // Constants
    private ANNOUNCEMENT_GET: string = "Retrieving announcement...";
    private ANNOUNCEMENT_SUBMIT: string = "Adding new announcement...";
    private ANNOUNCEMENT_UPDATE: string = "Updating announcement...";


    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor(
        private afs: AngularFirestore,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        // Initilaize form group
        this.announcementFormGroup = new FormGroup({
            'titleControl': new FormControl('', [
                Validators.required,
                Validators.maxLength(100)
            ]),
            'quillControl': new FormControl('', [
                Validators.required
            ])
        });

        // Check if activated route has any query parameters
        this.subscriptions.add(
            this.activatedRoute.queryParamMap.subscribe(params => {

                this.id = params.get('id') || null;

                // Announcement state is NEW
                if (this.id == null) {
                    console.log("No query parameters, adding new announcement.");
                    this.currentAnnouncementState = AnnouncementState.NEW;
                }
                // Announcement state is EDIT
                else {
                    console.log("Query parameter exists with id: " + params.get('id'));
                    this.currentAnnouncementState = AnnouncementState.EDIT;

                    // Get announcement using id and populate the inputs
                    this.getAnnouncement();
                }
            },
            (error: any) => {
                console.log("Error in getting parameter id");
                console.log(error);
            },
            () => {
                console.log("Retrieved parameter id from url");
            })
        );
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }

    /*==========================================================
                            METHODS
    ==========================================================*/
    returnToAnnouncements() {
        this.router.navigate(['user/courses/announcements']);
    }

    onSubmit() {
        let success: boolean = true;

        // Get handle on quill editor
        // let quillEditor: any = document.querySelector('.ql-editor');
        let quillEditorElement: any = document.querySelector('#editor quill-editor');

        if (this.announcementFormGroup.get('quillControl').hasError('required')) {
            console.log("Failed - editor is empty");
            quillEditorElement.style.border = "1px solid red";
            success = false;
        } else {
            quillEditorElement.style.border = "initial";
        }

        // console.log("\n\tQuill editor html is:\n" + quillEditor.innerHTML);

        // if (quillEditor.classList.contains('ql-blank')) {
        //     console.log("Editor is empty");
        //     success = false;
        //     quillEditorElement.style.border = "1px solid red";
        // } else {
        //     console.log("Editor has content");
        //     quillEditorElement.style.border = "initial";
        // }

        if (this.announcementFormGroup.invalid) {
            success = false;
        }

        if (success) {
            if (this.currentAnnouncementState == AnnouncementState.NEW) {
                this.setNewAnnouncement();
            }
            else if (this.currentAnnouncementState == AnnouncementState.EDIT) {
                this.updateAnnouncement();
            }
        } else {
            console.log("submit failed");
        }
    }

    setNewAnnouncement() {
        console.log("setNewAnnouncement()");

        this.submittingAnnouncement = true;

        // Get reference to firestore path and create new id
        let announcementCollection = this.afs.collection<Announcement>('University of California, Santa Barbara/courses/2019 Fall/courseId/announcements');
        let newAnnouncementId = this.afs.createId();

        // Get handle on quill editor
        // let quillEditor = document.querySelector(".ql-editor");
        console.log("Description of control is " + this.announcementFormGroup.get('quillControl').value);

        let newAnnouncement = {
            id: newAnnouncementId,
            title: this.announcementFormGroup.get('titleControl').value,
            author: "-placeholder-",
            description: this.announcementFormGroup.get('quillControl').value,
            timestamp: new Date()
        };

        announcementCollection.doc(newAnnouncementId).set(newAnnouncement)
            .then(() => {
                console.log("New announcement successfully created and set");

                this.submittingAnnouncement = false;

                this.returnToAnnouncements();
            })
            .catch((error) => {
                console.log("Error adding new announcement document to firestore", error);

                this.submittingAnnouncement = false;
            });
    }

    getAnnouncement() {
        console.log("getAnnouncement()");

        this.gettingAnnouncement = true;

        this.announcementDoc = this.afs.doc<Announcement>('University of California, Santa Barbara/courses/2019 Fall/courseId/announcements/' + this.id);
        this.announcement$ = this.announcementDoc.valueChanges();
        this.subscriptions.add(
            this.announcement$.subscribe((value: Announcement) => {
                console.log("Succesfully retrieved announcement with id: " + this.id);

                this.announcement = value;

                this.gettingAnnouncement = false;

                this.populateAnnouncement();
            },
            (error: any) => {
                console.log("Error retrieving announcement");
                console.log(error);

                this.gettingAnnouncement = false;
            },
            () => {
                console.log("Retrieving announcement complete");

                this.gettingAnnouncement = false;
            })
        );
    }

    populateAnnouncement() {
        this.announcementFormGroup.get('titleControl').setValue(this.announcement.title);
        this.announcementFormGroup.get('quillControl').setValue(this.announcement.description);
    }

    getSubmitButtonTitle(): string {
        return (this.currentAnnouncementState == AnnouncementState.NEW) ? "Submit" : "Update";
    }

    getProgressBarTitle(): string {
        if (this.gettingAnnouncement) {
            return this.ANNOUNCEMENT_GET;
        }
        else if (this.submittingAnnouncement) {
            return this.ANNOUNCEMENT_SUBMIT;
        }
        else if (this.updatingAnnouncement) {
            return this.ANNOUNCEMENT_UPDATE;
        }
        else {
            return "";
        }
    }

    updateAnnouncement() {
        console.log("updateAnnouncement()");

        this.updatingAnnouncement = true;

        this.announcementDoc = this.afs.doc<Announcement>('University of California, Santa Barbara/courses/2019 Fall/courseId/announcements/' + this.id);

        // // Test
        // let test = this.announcementFormGroup.get('quillControl').value;
        // console.log("Quill editor value is: " + test);

        let updatedAnnouncement = {
            title: this.announcementFormGroup.get('titleControl').value,
            description: this.announcementFormGroup.get('quillControl').value,
            timestamp: new Date()
        }

        this.announcementDoc.update(updatedAnnouncement)
            .then(() => {
                console.log("Announcement with id " + this.id + " successfully updated");

                this.updatingAnnouncement = false;

                this.returnToAnnouncements();
            })
            .catch((error) => {
                console.log("Error updating announcement with id " + this.id, error);

                this.updatingAnnouncement = false;
            })
    }
}
