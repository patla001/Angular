import { Component, OnInit, OnDestroy } from '@angular/core';

import { User } from '../../../../model/user';
import { Member } from '../../../../model/member';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable, of, Subscription} from 'rxjs';
import 'rxjs/add/operator/map';


/*
 * Roster
 * Displays all students, faculty, and members of the current course.
 */
@Component({
    selector: 'app-roster',
    templateUrl: './roster.component.html',
    styleUrls: ['./roster.component.css']
})
export class RosterComponent implements OnInit, OnDestroy {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    private membersCollection: AngularFirestoreCollection<Member>;
    members$: Observable<Member[]>;
    members: Member[] = [];

    subscriptions: Subscription = new Subscription();

    indeterminateProgressBarTitle: string = "Retrieving the roster...";
    gettingMembers: boolean = false;

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor(private readonly afs: AngularFirestore) { }

    ngOnInit() {
        this.getMemberIds();
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }

    /*==========================================================
                            METHODS
    ==========================================================*/
    getMemberIds() {
        this.gettingMembers = true;

        this.membersCollection = this.afs.collection<Member>('University of California, Santa Barbara/courses/2019 Fall/courseId/members');

        this.members$ = this.membersCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as Member;
                // const id = a.payload.doc.id;
                return data;
            });
        });

        this.subscriptions.add(
            this.members$.subscribe(
                (afsMembers: Member[]) => {
                    // Empty members in array first
                    // this.members = [];
                    // for (const member of afsMembers) {
                    //     this.members.push(member);
                    // }
                    console.log("Retrieved members.");
                    this.members = afsMembers;
                    this.gettingMembers = false;
                },
                (error: any) => {
                    console.log("Error in retrieving member ids");
                    console.log(error);
                    this.gettingMembers = false;
                },
                () => {
                    console.log("Retrieving member ids complete");
                    this.getStudents();
                    this.gettingMembers = false;
                }
            )
        );
    }

    getStudents() {

    }
}
