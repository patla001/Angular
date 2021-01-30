import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/auth.service';

/*
 * Login
 * The landing page of the app. Users and administrators
 * may log in.
 *
 * If the user is a faculty/professor or a student, then
 * the user is directed to the protected user component.
 *
 * If the user is an administrator, then the user is directed
 * to the protected register component.
 */
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    @ViewChild('ang_email') emailInput: ElementRef;

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor(public auth: AuthService) { }

    ngOnInit() {
        this.setFocusToEmail();
    }

    ngOnDestroy() {

    }

    /*==========================================================
                            METHODS
    ==========================================================*/
    setFocusToEmail(): void {
        this.emailInput.nativeElement.focus();
    }

    login(email: string, password: string): void {
        console.log("Email is: " + email + "\nPassword is: " + password);

        this.auth.loginWithEmailAndPassword(email, password);
    }
}
