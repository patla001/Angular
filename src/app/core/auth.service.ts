import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from '../model/user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user: Observable<User>;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) {

        // Get auth data, then get firestore user document or null
        this.user = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    // return this.afs.doc<User>(`users/${user.firebaseId}`).valueChanges();
                } else {
                    return of(null);
                }
            })
        );
    }

    loginWithEmailAndPassword(email: string, password: string) {
        this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            console.log("Signed in successfully");

            // TODO: Set user as STUDENT or FACULTY
            this.router.navigate(['/user']);
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                console.log("ERROR - Wrong password");
            }
            else if (errorCode === 'auth/invalid-email') {
                console.log("ERROR - Invalid email");
            }
            else if (errorCode === 'auth/user-disabled') {
                console.log("ERROR - User disabled");
            }
            else if (errorCode === 'auth/user-not-found') {
                console.log("ERROR - User not found");
            }
            else {
                console.log(errorMessage);
            }
            console.log(error);
        });
    }

    // Sets user data to firestore on login
    // private updateUserData(user) {
    //     const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    //
    //     const data: User = {
    //         uid: user.uid,
    //         email: user.email,
    //         photoURL: user.photoURL,
    //         firstName: user.firstName,
    //         lastName: user.lastName
    //     }
    //
    //     return userRef.set(data, { merge: true });
    // }

    signOut() {
        this.afAuth.auth.signOut().then(() => {
            this.router.navigate(['/']);
        });

    }
}
