import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';

import { Course } from '../../../../model/course';
import { Announcement } from '../../../../model/announcement';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';


/*
 * Announcements
 * Retrieves the list of announcements from firestore.
 * TODO: attempt to set the new reference path for the document
 * as a list of Announcement objects.
 */
@Component({
    selector: 'app-announcements',
    templateUrl: './announcements.component.html',
    styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit, OnDestroy {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    private announcementsCollection: AngularFirestoreCollection<Announcement>;
    announcements$: Observable<Announcement[]>;
    private announcementDoc: AngularFirestoreDocument<Announcement>;
    announcement$: Observable<Announcement>;
    // assignments: Assignment[] = [];

    // private courseIdDoc: AngularFirestoreDocument<Course>;
    // course$: Observable<Course>;

    subscriptions: Subscription = new Subscription();

    announcements: Announcement[] = [];
    announcement: Announcement;

    // indeterminateProgressBarTitle: string = "Retrieving announcements...";
    gettingAnnouncements: boolean = false;
    deletingAnnouncement: boolean = false;

    // Constants
    private ANNOUNCEMENTS_GET: string = "Retrieving announcements...";
    private ANNOUNCEMENT_DELETE: string = "Deleting announcement...";
    // description_style = {
    //     'overflow-wrap': 'break-word',
    //     'border-width': '0px',
    //     'padding-left': '0px',
    //     'padding-right': '0px'
    // };

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor(
        private afs: AngularFirestore,
        private router: Router
    ) { }

    ngOnInit() {
        this.getAnnouncements();
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }

    /*==========================================================
                            METHODS
    ==========================================================*/
    navigateToAddAnnouncement() {
        this.router.navigate(['/user/courses/add-announcement']);
    }
    navigateToAddAnnouncementWithId(id: string) {
        this.router.navigate(['/user/courses/add-announcement'], { queryParams: { id: id } });
    }

    getProgressBarTitle(): string {
        if (this.gettingAnnouncements) {
            return this.ANNOUNCEMENTS_GET;
        }
        else if (this.deletingAnnouncement) {
            return this.ANNOUNCEMENT_DELETE;
        }
        else {
            return "";
        }
    }

    getAnnouncements() {
        console.log("getAnnouncements()");

        this.gettingAnnouncements = true;

        this.announcementsCollection = this.afs.collection<Announcement>('University of California, Santa Barbara/courses/2019 Fall/courseId/announcements', ref => ref.orderBy('timestamp', 'desc') );

        this.announcements$ = this.announcementsCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as Announcement;
                // const id = a.payload.doc.id;
                return data;
                // return { id, ...data};
            });
        });

        this.subscriptions.add(
            this.announcements$.subscribe(
                (afsAnnouncement: Announcement[]) => {
                    console.log("Retrieved assignments");
                    this.announcements = afsAnnouncement;
                    // this.buildListOfCategories();
                    this.gettingAnnouncements = false;
                },
                (error: any) => {
                    console.log("Error in retrieving assignments");
                    console.log(error);
                    this.gettingAnnouncements = false;
                },
                () => {
                    console.log("Retrieving assignments complete");
                    this.gettingAnnouncements = false;
                }
            )
        );
    }

    onEdit(index: number) {
        console.log("onEdit()");

        let id = this.announcements[index].id;

        this.navigateToAddAnnouncementWithId(id);
    }

    onDelete(index: number) {
        console.log("onDelete()");

        this.deletingAnnouncement = true;

        let announcementId: string = this.announcements[index].id;

        this.announcementDoc = this.afs.doc<Announcement>('University of California, Santa Barbara/courses/2019 Fall/courseId/announcements/' + announcementId);

        this.announcementDoc.delete()
            .then(() => {
                console.log("Announcement with id " + announcementId + " successfully deleted");
                this.deletingAnnouncement = false;
            })
            .catch((error) => {
                console.log("Error deleting announcement with id " + announcementId, error);
                this.deletingAnnouncement = false;
            });
    }
}
