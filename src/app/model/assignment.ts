export enum SubmissionType {
    FILE,
    TEXT
}

/*
 * Assignment interface
 * Model describing aspects of an assignment.
 *
 * (id: string) - the id of the assignment, use this to delete in firestore
 * (title: string) - the title for the assignment
 * (points: number) - the possible points the assignment is out of
 * (category: string) - the category that the assignment belongs to
 * (submissionType: SubmissionType) - the way the assignment will be submitted
 * (dueDate: Date) - the due date of the assignment
 * (graded: boolean) - if the assignment should be graded or not
 * (details: string) - the details of the assignment (via RichTextArea/HTML)
 * (timestamp: Date) - the date that this object was added to Firestore server
 */

export interface Assignment {
    id: string;
    title: string;
    points: number;
    category: string;
    submissionType: string;
    dueDate: Date;
    graded: boolean;
    details: string;
    timestamp: Date;
}
