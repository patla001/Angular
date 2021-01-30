import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AngularFirestore, AngularFirestoreDocument,
    DocumentReference, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { Assignment } from '../../../../model/assignment';

import { Observable, Subscription } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material';


export enum ViewByOption {
    CATEGORY = "Category",
    ALL = "All"
}

/*
 * Assignments
 * Displays every assignment from each created category from this
 * particular course. Can navigate to AddAssignmentComponent and
 * AssignmentDetailsComponent.
 */
@Component({
    selector: 'app-assignments',
    templateUrl: './assignments.component.html',
    styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit, OnDestroy {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    private assignmentsCollection: AngularFirestoreCollection<Assignment>;
    assignments$: Observable<Assignment[]>;
    assignments: Assignment[] = [];
    listOfCategories: string[] = [];

    subscriptions: Subscription = new Subscription();

    gettingAssignments: boolean = false;

    // Forms
    assignmentFormGroup: FormGroup;

    viewByOptionEnum = ViewByOption;
    // currentViewByOption: ViewByOption = this.viewByOptionEnum.CATEGORY;

    displayedColumns: string[] = ['title', 'dueDate', 'points'];
    dataSource: MatTableDataSource<Assignment>[];
    // dataSource: MatTableDataSource<Assignment>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    // @ViewChild(MatTableModule) table: MatTableModule;

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor(
        private afs: AngularFirestore,
        private router: Router
    ) { }

    ngOnInit() {
        this.getCourseAssignments();

        this.assignmentFormGroup = new FormGroup({
            'viewByRadioControl': new FormControl(this.viewByOptionEnum.CATEGORY),
            'searchControl': new FormControl('', [
                Validators.maxLength(100)
            ])
        });

        // Mat Table
        // this.dataSource = new MatTableDataSource(users);
        // this.dataSource = new MatTableDataSource(this.assignments);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }

    /*==========================================================
                            METHODS
    ==========================================================*/
    navigateToAddAssignment() {
        console.log("navigateToAddAssignment()");

        this.router.navigate(['/user/courses/add-assignment']);
    }

    navigateToAssignmentDetails(id: string) {
        this.router.navigate(['/user/courses/assignment-details', id]);
    }

    onRowClicked(row: Assignment) {
        this.navigateToAssignmentDetails(row.id);
    }

    // filteredDataSources(category: string): MatTableDataSource<Assignment> {
    //     console.log("filteredDataSource() - " + category);
    //     let filteredAssignments: Assignment[] = this.assignments.filter((assignment: Assignment) => {
    //         assignment.category == category;
    //     });
    //
    //     console.log("filteredAssignments: " + filteredAssignments);
    //
    //     this.dataSource.data = filteredAssignments;
    //     return this.dataSource;
    // }

    // filterAssignmentsByCategory(category: string): MatTableDataSource<Assignment> {
    //     let filteredAssignments: Assignment[] = this.assignments.filter((assignment: Assignment) => {
    //         assignment.category == category;
    //     });
    //
    //     let tableDataSource: MatTableDataSource<Assignment> = new MatTableDataSource<Assignment>(filteredAssignments);
    //     tableDataSource.paginator = this.paginator;
    //     tableDataSource.sort = this.sort;
    //     return tableDataSource;
    // }

    /*---------------------------------------------------------
                            Firestore
    ----------------------------------------------------------*/
    /*
     * Retrieve the assignments of each category from this
     * particular course
     */
    getCourseAssignments() {
        console.log("getCourseAssignments()");

        this.gettingAssignments = true;

        this.assignmentsCollection = this.afs.collection<Assignment>('University of California, Santa Barbara/courses/2019 Fall/courseId/assignments', ref => ref.orderBy('timestamp', 'desc') );

        this.assignments$ = this.assignmentsCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as Assignment;
                // const id = a.payload.doc.id;
                return data;
                // return { id, ...data};
            });
        });

        this.subscriptions.add(
            this.assignments$.subscribe(
                (afsAssignment: Assignment[]) => {
                    console.log("Retrieved assignments");
                    this.assignments = afsAssignment;
                    this.buildListOfCategories();
                    // this.dataSource.renderRows();
                    this.gettingAssignments = false;
                },
                (error: any) => {
                    console.log("Error in retrieving assignments");
                    console.log(error);
                    this.gettingAssignments = false;
                },
                () => {
                    console.log("Retrieving assignments complete");
                    this.gettingAssignments = false;
                }
            )
        );
    }

    /*
     * Retrieve the set of categories (unique values)
     */
    buildListOfCategories() {
        console.log("buildListOfCategories()");

        for (let assignment of this.assignments) {
            if (!this.listOfCategories.includes(assignment.category)) {
                this.listOfCategories.push(assignment.category);
            }
        }

        this.filterDataSource();
    }

    filterDataSource() {
        console.log("filterDataSource()");
        this.dataSource = [];

        for (let category of this.listOfCategories) {
            console.log("\tCategory = " + category);

            let filteredAssignments = this.assignments.filter((assignment: Assignment) => {
                return assignment.category == category;
            });

            console.log("Pushing filteredAssignents = " + filteredAssignments);

            let tableDataSource = new MatTableDataSource<Assignment>(filteredAssignments)
            tableDataSource.paginator = this.paginator;
            tableDataSource.sort = this.sort;
            this.dataSource.push(tableDataSource);
        }
    }
}
