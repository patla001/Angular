import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AngularFirestore, AngularFirestoreDocument,
    DocumentReference, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Assignment } from '../../../../model/assignment';

import { Observable, Subscription } from 'rxjs';


/*
 * Assignment Details
 * Displays the details for the assignment clicked from the
 * AssignmentsComponent.
 */
@Component({
    selector: 'app-assignment-details',
    templateUrl: './assignment-details.component.html',
    styleUrls: ['./assignment-details.component.css']
})
export class AssignmentDetailsComponent implements OnInit, OnDestroy {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    id: string;
    subscriptions: Subscription = new Subscription();
    gettingAssignmentDetails: boolean = false;

    private assignmentDoc: AngularFirestoreDocument<Assignment>;
    assignment$: Observable<Assignment>;
    assignment: Assignment;

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private afs: AngularFirestore
    ) { }

    ngOnInit() {
        this.gettingAssignmentDetails = true;

        this.subscriptions.add(
            this.activatedRoute.params.subscribe(params => {
                this.id = params['id'];

                // Load details of assignment with specified id
                console.log("Successfully read route parameter with id: " + params['id']);

                this.loadAssignmentDetails();
            },
            (error: any) => {
                console.log("Error in getting parameter id");
                console.log(error);
                this.gettingAssignmentDetails = false;
            },
            () => {
                console.log("Retrieved parameter id from url");
                this.gettingAssignmentDetails = false;
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
    returnToAssignments() {
        this.router.navigate(['user/courses/assignments']);
    }

    loadAssignmentDetails() {
        console.log("loadAssignmentDetails()");

        // this.gettingAssignmentDetails = true;

        this.assignmentDoc = this.afs.doc<Assignment>('University of California, Santa Barbara/courses/2019 Fall/courseId/assignments/' + this.id);

        this.assignment$ = this.assignmentDoc.valueChanges();
        this.subscriptions.add(
            this.assignment$.subscribe((value: Assignment) => {

                console.log("Successfully retrieved assignment object with id");
                console.log("Value = " + value + "\nDetails = " + value.details);

                this.assignment = value;
                this.gettingAssignmentDetails = false;
            },
            (error: any) => {
                console.log("Error retrieving assignment details");
                console.log(error);
                this.gettingAssignmentDetails = false;
            },
            () => {
                console.log("Retrieving assignment details complete");
                this.gettingAssignmentDetails = false;
            })
        );
    }
}
