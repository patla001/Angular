/*
 * User interface
 *
 * (usertype: UserType) - to identify the user as a student or faculty, uses
 *                      UserType model
 * (firebaseId: string) - the id assigned to the user under authentication
 * (id: string) - identification that the institution assigned to the user
 * (firstName: string) - first name of the user
 * (middleName?: string) - optional middle name of the user
 * (lastName: string) - last name of the user
 * (email: string) - email that the institution assigned to the user
 * (phoneNumber: number) - phone number of the user
 * (major: string) - major of the user
 * (linkedInUrl: string) - optional link to the user's LinkedIn
 * (tagline?: string) - optional tagline of user
 * (description?: string) - optional description of user
 * (resumePath?: string) - optional cloud storage path to user's resume
 * (photoPath?: string) - optional cloud storage path to user's profile picture
 *
 * Faculty-specific properties
 * (title?: string) - title of faculty member
 * (department?: string) - department that faculty member belongs to
 * (courses?: string[]) - list of course ids that the faculty member is teaching
 */

 enum UserType {
     STUDENT,
     FACULTY
 }

export interface User {
    userType: UserType;
    firebaseId: string;
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    major: string;
    linkedInUrl?: string;
    tagline?: string;
    description?: string;
    resumePath?: string;
    photoPath?: string;
    links?: string;

    title?: string;
    department?: string;
    courses?: string[];

}
