/*
 * Member interface
 * Model used to display the students in a class, the
 * members of a roster. (Partial data of the user model).
 *
 * (id: string) - id of the member
 * (firstName: string) - first name of member
 * (middleName?: string) - optional middle name of the member
 * (lastName: string) - last name of the member
 * (email: string) - email of the member
 */

export interface Member {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
}
