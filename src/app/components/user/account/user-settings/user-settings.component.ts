import { Component, OnInit} from '@angular/core';
import { DatePipe } from '@angular/common';

import {User} from "../../../../model/user";
import {Router} from "@angular/router";
import { Observable, Subscription } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})


export class UserSettingsComponent implements OnInit {


    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    private courseIdDoc: AngularFirestoreDocument<User>;
    course$: Observable<User>;
    subscriptions: Subscription = new Subscription();

    currentUser: User;

    today : number = Date.now();
    message = 'Dark Mode';

    setToggleSlide(e) {
        if(e.checked)
            this.message = 'Dark Mode';
        else
            this.message = 'Light Mode';
    }
    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor(
        private afs: AngularFirestore,
        private router: Router) {}

    ngOnInit() {
        this.getCurrentUserInfo();

    }
    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }





    /*==========================================================
                            METHODS
    ==========================================================*/


    getCurrentUserInfo() {
        this.courseIdDoc = this.afs.doc<User>('University of California, Santa Barbara/users/faculty/facultyid12345');
        this.course$ = this.courseIdDoc.valueChanges();
        this.subscriptions.add(
            this.course$.subscribe((user: User) => {
                this.currentUser = user;

            })
        );
    }



}
