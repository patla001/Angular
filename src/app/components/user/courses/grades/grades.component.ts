import { Component, OnInit } from '@angular/core';


/*
 * Grades
 * Student view:
 *     Displays the categories and each assignment under. Each
 *     assignment row will display the grade and clicking on the
 *     assignment will display more information about the grade
 *     in a new component. Within new component, a link is available
 *     to navigate student to assignment details.
 *
 * Faculty view:
 *     Displays the categories and each assignment under. Each
 *     assignment row will display the class average grade, clicking
 *     on the assignment will display more statistics about the class
 *     average, as well as a modified roster of students wherein each
 *     row displays their grade.
 *     The faculty can scope into a specific student's grade by clicking
 *     on the student in this modified roster, and the view becomes similar
 *     to the student view.
 */
@Component({
    selector: 'app-grades',
    templateUrl: './grades.component.html',
    styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor() { }

    ngOnInit() {
    }

    /*==========================================================
                            METHODS
    ==========================================================*/
}
