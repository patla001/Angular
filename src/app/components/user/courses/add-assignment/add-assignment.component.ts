import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

import { Assignment } from '../../../../model/assignment';

/*==========================================================
                        ENUMS
==========================================================*/
// The following enum is static
// export enum AddAssignmentType {
//     NONE = "Select a type",
//     FILE = "File",
//     TEXT = "Text"
// }

/*
 * Add Assignment
 * Allows faculty members to add a new assignment, listed under
 * a specified category, with properties from the Assignment model.
 * Valiation must pass before submitting the new information,
 * otherwise error messages will display.
 *
 * HH:mm am|pm regexp
 * https://www.regextester.com/104041
 *
 * Validators
 * (nameControl) - check that name is not empty and doesn't exceed 100 characters
 * (pointsControl) - check that points is not empty, a number, and doesn't exceed
 *              10 digits
 * (categoryControl) - check that a category is selected
 * (submissionControl) - check that submission type is selected
 * (dueDateControl) - check that due date is not empty,
 * (timeControl) - check that time is selected and follows pattern (possible that it outputs
 *              'invalid time')
 * (gradeControl) - none
 */
@Component({
    selector: 'app-add-assignment',
    templateUrl: './add-assignment.component.html',
    styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent implements OnInit {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    addAssignmentCategories: string[] = [
        "Assignments", "Quizzes", "Papers", "Other"
    ];
    addAssignmentTypes: string[] = [
        "File Upload", "Text Response", "Online Quiz/Exam", "Turnitin", "External Link", "None"
    ]

    isViewingDefinitions: boolean = false;

    // Forms
    assignmentFormGroup: FormGroup;
    gradeChecked: boolean = false;
    timepickerInput: string = "";

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor(
        private afs: AngularFirestore,
        private router: Router
    ) { }

    ngOnInit() {
        this.assignmentFormGroup = new FormGroup({
            'nameControl': new FormControl('', [
                Validators.required,
                Validators.maxLength(100)
            ]),
            'pointsControl': new FormControl('', [
                Validators.required,
                Validators.maxLength(10),
                Validators.pattern(/^\d{1,10}$/)
            ]),
            'categoryControl': new FormControl('', [
                Validators.required
            ]),
            'submissionControl': new FormControl('', [
                Validators.required
            ]),
            'dueDateControl': new FormControl('', [
                Validators.required
            ]),
            'timeControl': new FormControl('', [
                Validators.required,
                Validators.pattern(/^((1[0-2]|0[1-9]):([0-5][0-9]) ([AaPp][Mm])$)/)
            ]),
            'gradeControl': new FormControl(false)
        });
    }

    /*==========================================================
                            METHODS
    ==========================================================*/
    returnToAssignments() {
        this.router.navigate(['user/courses/assignments']);
    }

    toggleIsViewingDefinitions() {
        this.isViewingDefinitions = !this.isViewingDefinitions;
    }
    viewDefinitionsText(): string {
        return (this.isViewingDefinitions) ? "Hide" : "View";
    }

    onConfirmClicked() {
        console.log("onConfirmClicked()");

        let success: boolean = true;

        // Output status
        this.debugCheckValidators();

        // Touch time control
        this.assignmentFormGroup.get('timeControl').markAsTouched();

        // Get handle on quill editor
        let quillEditor: any = document.querySelector('.ql-editor');
        let quillEditorElement: any = document.querySelector('#editor quill-editor');

        console.log("\n\tQuill editor html is:\n" + quillEditor.innerHTML);

        if (quillEditor.classList.contains('ql-blank')) {
            console.log("Editor is empty");
            success = false;
            quillEditorElement.style.border = "1px solid red";
        } else {
            console.log("Editor has content");
            quillEditorElement.style.border = "initial";
        }

        if (this.assignmentFormGroup.invalid) {
            success = false;
        }

        if (success) {
            this.setNewAssignment();
        } else {
            console.log("Confirm Failed.");
        }
    }

    /*-------------------------- DEBUG --------------------------*/
    debugCheckValidators() {
        if (this.assignmentFormGroup.invalid) {
            console.log("\tassignmentFormGroup INVALID");
        } else {
            console.log("\tassignmentFormGroup VALID");
        }

        if (this.assignmentFormGroup.get('nameControl').invalid) {
            console.log("\tnameControl INVALID");
        } else {
            console.log("\tnameControl VALID");
        }
        if (this.assignmentFormGroup.get('pointsControl').invalid) {
            console.log("\tpointsControl INVALID");
        } else {
            console.log("\tpointsControl VALID");
        }
        if (this.assignmentFormGroup.get('categoryControl').invalid) {
            console.log("\tcategoryControl INVALID");
        } else {
            console.log("\tcategoryControl VALID");
        }
        if (this.assignmentFormGroup.get('submissionControl').invalid) {
            console.log("\tsubmissionControl INVALID");
        } else {
            console.log("\tsubmissionControl VALID");
        }
        if (this.assignmentFormGroup.get('dueDateControl').invalid) {
            console.log("\tdueDateControl INVALID");
        } else {
            console.log("\tdueDateControl VALID");
        }
        if (this.assignmentFormGroup.get('timeControl').hasError('required')) {
            console.log("\ttimeControl INVALID - required");
        }
        else if (this.assignmentFormGroup.get('timeControl').hasError('pattern')) {
            console.log("\ttimeControl INVALID - pattern");
        }
        else {
            console.log("\ttimeControl VALID");
        }

        console.log("\tGrade checked status = " + this.assignmentFormGroup.get('gradeControl').value);

        let dateString = this.assignmentFormGroup.get('dueDateControl').value + " " +
            this.assignmentFormGroup.get('timeControl').value;
        console.log("dateString is: " + dateString);
    }
    /*-----------------------------------------------------------*/

    /*---------------------------------------------------------
                            Parsing and Validation
    ----------------------------------------------------------*/
    /*
        Parse input of date by splitting with expected separator '/'
        and return array of string with parsed month, day, and year
    */
    parseDateControl(): string[] {
        console.log("parseDate()");

        let dateInput: any = document.querySelector('#date_input');
        let dateString: string = dateInput.value;
        let dateStringArray: string[] = dateString.split("/");

        console.log("\tdateString = " + dateString);
        console.log("\tdateStringArray = " + dateStringArray);

        return dateStringArray;
    }

    /*
        Parse input of time by taking substring of value, format in 24hr,
        and return array of string with parsed hour and min
    */
    parseTimeControl(): string[] {
        console.log("parseTimeControl()");

        let timeFormControl = this.assignmentFormGroup.get('timeControl').value;
        let timeHourSubstr: string = timeFormControl.substring(0, 2);
        let timeMinSubstr: string = timeFormControl.substring(3, 5);
        let timeAmPmSubstr: string = timeFormControl.substring(timeFormControl.length - 2, timeFormControl.length);

        if ( (timeAmPmSubstr === "am" && parseInt(timeHourSubstr) === 12) ) {
            timeHourSubstr = (parseInt(timeHourSubstr) - 12).toString();
        }
        else if ( (timeAmPmSubstr === "pm") && parseInt(timeHourSubstr) < 12 ) {
            timeHourSubstr = (parseInt(timeHourSubstr) + 12).toString();
        }

        console.log("\ttimeHourSubstr: |" + timeHourSubstr + "|");
        console.log("\ttimeMinSubstr: |" + timeMinSubstr + "|");
        console.log("\ttimeAmPmSubstr: |" + timeAmPmSubstr + "|");

        return [timeHourSubstr, timeMinSubstr];
    }

    isEmpty(value: string): boolean {
        return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
    }
    /*---------------------------------------------------------
                            Errors
    ----------------------------------------------------------*/
    getDateErrorMessage(): string {
        return this.assignmentFormGroup.get('dueDateControl').hasError('required') ? 'You must enter or select a date' :
            this.assignmentFormGroup.get('dueDateControl').hasError('matDatepickerFilter') ? 'Input is invalid.' : '';
    }
    getTimeErrorMessage(): string {
        return this.assignmentFormGroup.get('timeControl').hasError('required') ? 'You must select a time' :
            this.assignmentFormGroup.get('timeControl').hasError('pattern') ? 'Time must have format HH:mm am|pm' : '';
    }

    /*---------------------------------------------------------
                            Firestore
    ----------------------------------------------------------*/
    /*
     * Retrieve current timestamp to set as key for assignments document
     */
    get timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }

    /*
     * Add a new assignment to firestore
     */
    setNewAssignment() {
        console.log("setNewAssignment()");

        // Get reference to firestore path and create new id
        let assignmentsCollection = this.afs.collection<Assignment>('University of California, Santa Barbara/courses/2019 Fall/courseId/assignments');
        let newAssignmentId = this.afs.createId();

        // Parse date and time
        let dateStringArray = this.parseDateControl();
        let timeStringArray = this.parseTimeControl();

        let completeDueDate: Date = new Date(
            parseInt(dateStringArray[2]),
            parseInt(dateStringArray[0]),
            parseInt(dateStringArray[1]),
            parseInt(timeStringArray[0]),
            parseInt(timeStringArray[1]),
            0
        );
        console.log("Complete date object is: " + completeDueDate);

        // Get handle on quill editor
        let quillEditor = document.querySelector(".ql-editor");

        // Construct new assignment
        let newAssignment: Assignment = {
            id: newAssignmentId,
            title: this.assignmentFormGroup.get('nameControl').value,
            points: parseInt(this.assignmentFormGroup.get('pointsControl').value),
            category: this.assignmentFormGroup.get('categoryControl').value,
            submissionType: this.assignmentFormGroup.get('submissionControl').value,
            dueDate: completeDueDate,
            graded: this.assignmentFormGroup.get('gradeControl').value,
            details: quillEditor.innerHTML,
            timestamp: new Date()
        };

        assignmentsCollection.doc(newAssignmentId).set(newAssignment)
            .then(() => {
                console.log("New assignment successfully created and set");
            })
            .catch((error) => {
                console.log("Error adding new assignment document to firestore", error);
            });
    }
}
