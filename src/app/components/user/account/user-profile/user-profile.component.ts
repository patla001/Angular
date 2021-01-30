import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import {Router} from '@angular/router'
import { Observable, Subscription } from 'rxjs';
import { User } from "../../../../model/user";

//import { FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    @Output() objectEvent = new EventEmitter<object>();

    private courseIdDoc: AngularFirestoreDocument<User>;
    course$: Observable<User>;
    subscriptions: Subscription;

    currentUser: User;
    userLinks: string[] = [];

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor(
        private router: Router,
        private afs: AngularFirestore,
    ) { }

    ngOnInit() {
        this.subscriptions = new Subscription();

        this.getCurrentUserInfo();
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }
    //
    // ['cats', 'dogs', 'elephant'] => || => "'cats||dogs||elephant'"
    // [{obj1}, {obj2}, ...] = "[{obj1}, {obj2}, ...]"
    // JSON.stringify()
    /*==========================================================
                            METHODS
    ==========================================================*/
    getCurrentUserInfo() {
        this.courseIdDoc = this.afs.doc<User>('University of California, Santa Barbara/users/faculty/facultyid12345');
        this.course$ = this.courseIdDoc.valueChanges();
        this.subscriptions.add(
            this.course$.subscribe((user: User) => {
                this.currentUser = user;

                if (user.links){
                    this.userLinks = JSON.parse(user.links);
                } 
            })
        );
    }

    navigateToEditProfile(user: User) {
        //this.edituserService.formData = Object.assign({}, user);
        //this.editUser = Object.assign({}, user);
        //this.objectEvent.emit(this.editUser);
        //console.log(this.editUser)
        //this.router.navigate(['/user/account/edit-user-profile'])
        this.router.navigate(['/user/account/edit-profile']);
    }

}
