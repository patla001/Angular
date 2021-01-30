import { Component, OnInit, Input } from '@angular/core';
import {User} from "../../../../model/user";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators, NgForm} from "@angular/forms";
import { Observable, Subscription } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

// export enum LinksActionButton {
//     EDIT = "Edit",
//     DELETE = "Delete",
//     CANCEL = "Cancel",
//     SAVE = "Save"
// }
// export enum LinksState {
//     DEFAULT,
//     EDIT
// }

@Component({
    selector: 'app-edit-user-profile',
    templateUrl: './edit-user-profile.component.html',
    styleUrls: ['./edit-user-profile.component.css']
})
export class EditUserProfileComponent implements OnInit {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    private courseIdDoc: AngularFirestoreDocument<User>;
    course$: Observable<User>;
    subscriptions: Subscription = new Subscription();

    currentUser: User;

    userLinks: string[] = [];
    userUpdateLinks: string;
    link: string;
    tempLink: string;
    // linksActionButton = LinksActionButton;
    // linksActionButton1 = this.linksActionButton.EDIT;
    // linksActionButton2 = this.linksActionButton.DELETE;
    // linksState = LinksState;
    // currentLinksState = this.linksState.DEFAULT;

    selectedLinkIndex: number = undefined;

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
    goBack(){
        this.router.navigate(['/user/account/profile']);
    }

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


    // Edit/Cancel
    linksActionButton1Clicked(index: number) {
        console.log("linksActionButton1Clicked()");

    }

    saveProfileClicked() {
        console.log("saveProfileClicked()");
        this.updateLinksOnFirestore();
        // Call updateLinksOnFirestore();
    }

    onEdit(index: number) {

    }
    onDelete(index: number) {

    }

    openLink(link: string){
        window.open(link);
    }


    /*---------------------------------------------------------
                            Firestore
    ----------------------------------------------------------*/
    updateSingleLinkOnFirestore() {
        console.log("updateLinksOnFirestore()");
        // With the changes made to the userLinks array, stringify the array
        // using JSON.stringify();

        // Get reference to firestore using path

        this.courseIdDoc = this.afs.doc<User>('University of California, Santa Barbara/users/faculty/facultyid12345');
        this.course$ = this.courseIdDoc.valueChanges();
        this.userLinks.push(this.userUpdateLinks);
        this.currentUser.links = JSON.stringify(this.userLinks);
        //console.log(this.currentUser.links);
        this.courseIdDoc.update(this.currentUser)

        // Be careful not to delete entire user object, use update() instead of set(). Search up
        // angularfire documentation, under documents section is explains it
        // https://github.com/angular/angularfire2/blob/master/docs/firestore/documents.md

    }

    updateLinksOnFirestore() {
        this.courseIdDoc = this.afs.doc<User>('University of California, Santa Barbara/users/faculty/facultyid12345');
        this.course$ = this.courseIdDoc.valueChanges();
        //this.userLinks.push(this.userUpdateLinks);
        this.currentUser.links = JSON.stringify(this.userLinks);
        //console.log(this.currentUser.links);
        this.courseIdDoc.update(this.currentUser)
    }

    // onSubmit(form: NgForm) {
    //     let data = Object.assign({}, form.value);
    //     delete data.id;
    //     if (form.value.uid == null) {
    //         this.afs.collection('users').add(data)
    //     }
    //     else {
    //         this.afs.doc('users' + form.value.id).update(data)
    //     }
    // }
}
