import { Component, OnInit } from '@angular/core';


/*
 * Course List
 * Dashboard displaying all of the courses that the current user
 * is enrolled in. Students and faculty members can navigate to
 * the courses from this component.
 */
@Component({
    selector: 'app-course-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

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
