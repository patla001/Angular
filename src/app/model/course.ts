import { User } from './user';
import { Announcement } from './announcement';

/*
 * Course interface
 *
 * (id: string) - the id to reference the course
 * (courseName: string) - the name of the course
 * (courseTitle: string) - the title of the course
 * (section: string) - the section of the course
 * (instructor: string) - the instructor for the course, uses User model
 * (units: number) - the number of units the course offers
 * (format: CourseFormat) - the format for the course, uses CourseFormat emum
 * (startTime: number) - starting time in #### military time
 * (endTime: number) - ending time in #### military time
 * (days: string[]) - the list of days the course is in session, uses CourseDay enum
 *
 * (location?: string) - the optional location of where the course takes place
 * (announcements?: Announcement[]) - the list of announcements that the instructor
 *                  posted for the course, uses Announcement model
 */

enum CourseFormat {
    LECTURE,
    SEMINAR,
    LAB
}

enum CourseDay {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
}

export interface Course {
    id: string;
    courseName: string;
    courseTitle: string;
    // section: string;
    instructor: User;
    units: number;
    format: CourseFormat;
    startTime: number;
    endTime: number;
    days: CourseDay[];

    location?: string;
    // announcements?: Announcement[];

    // TODO: assignments
    // assignments?: Assignment[];

    // Members subcollection
    // documentid = user id (student id)
    //           field: id, value: string
    //           ...

    // Grades subcollection
    // documentid = category name
    //           Assignment subcollection (assignment name)
    //              documentid = user id
    //              field: score, value: number

    // TODO: groups
}
