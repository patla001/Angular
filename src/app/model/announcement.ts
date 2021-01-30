/*
 * Announcement interface
 * Model describing data about a general announcement.
 *
 * (date: string) - the date and time that the announcement was posted
 * (title: string) - the title of the announcement
 * (author: string) - the user that posted the announcement, possibly pass the
 *                  name of the user from the User model to this property as a string
 * (description: string) - the content of the announcement, the details of the post
 */

export interface Announcement {
    id: string;
    title: string;
    author: string;
    description: string;
    timestamp: Date;
}
