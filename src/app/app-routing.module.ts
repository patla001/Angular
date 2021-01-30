import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

/*=============================================================================
                                COMPONENTS
=============================================================================*/
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

// LOGIN AND REGISTRATION
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';

// USER ACCOUNT
import { UserAccountComponent } from './components/user/account/user-account/user-account.component';
import { UserProfileComponent } from './components/user/account/user-profile/user-profile.component';
import { EditUserProfileComponent } from './components/user/account/edit-user-profile/edit-user-profile.component';
import { UserResumeComponent } from './components/user/account/user-resume/user-resume.component';
import { UserSettingsComponent } from './components/user/account/user-settings/user-settings.component';

// USER CALENDAR
import { CalendarComponent } from './components/user/calendar/calendar/calendar.component';

// USER COURSES
import { AddAnnouncementComponent } from './components/user/courses/add-announcement/add-announcement.component';
import { AddAssignmentComponent } from './components/user/courses/add-assignment/add-assignment.component';
import { AnnouncementsComponent } from './components/user/courses/announcements/announcements.component';
import { AssignmentsComponent } from './components/user/courses/assignments/assignments.component';
import { AssignmentDetailsComponent } from './components/user/courses/assignment-details/assignment-details.component';
import { ContentComponent } from './components/user/courses/content/content.component';
import { CourseListComponent } from './components/user/courses/course-list/course-list.component';
import { DiscussionComponent } from './components/user/courses/discussion/discussion.component';
import { GradesComponent } from './components/user/courses/grades/grades.component';
import { GroupsComponent } from './components/user/courses/groups/groups.component';
import { HomeComponent } from './components/user/courses/home/home.component';
import { RosterComponent } from './components/user/courses/roster/roster.component';
import { SyllabusComponent } from './components/user/courses/syllabus/syllabus.component';

import { AttendanceComponent } from './components/user/courses/attendance/attendance.component';

/*=============================================================================
                                ROUTER

NOTE: order of routes matter --> first-match wins (specific > less specific)
=============================================================================*/
const routes: Routes = [
    // Root path
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    // { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    // { path: 'student/studenthome', component: StudenthomeComponent, resolve: { data: UserResolver} },
    // { path: 'faculty/facultyhome', component: FacultyhomeComponent, resolve: {data: UserResolver} },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    // { path: 'faculty/facultyhome', component: FacultyHomeComponent, canActivate: [AuthGuard] },
    { path: 'user', component: UserHomeComponent,
        children: [
            { path: '', redirectTo: 'account', pathMatch: 'full' },
            { path: 'account', component: UserAccountComponent,
                children: [
                    { path: '', redirectTo: 'profile', pathMatch: 'full' },
                    { path: 'profile', component: UserProfileComponent },
                    { path: 'edit-profile', component: EditUserProfileComponent },
                    { path: 'resume', component: UserResumeComponent },
                    { path: 'settings', component: UserSettingsComponent }
                ]
            },
            { path: 'courses', component: CourseListComponent,
                children: [
                    { path: '', redirectTo: 'home', pathMatch: 'full' },
                    { path: 'home', component: HomeComponent },
                    { path: 'add-announcement', component: AddAnnouncementComponent },
                    { path: 'announcements', component: AnnouncementsComponent },
                    { path: 'add-assignment', component: AddAssignmentComponent },
                    { path: 'assignments', component: AssignmentsComponent },
                    { path: 'assignment-details/:id', component: AssignmentDetailsComponent },
                    { path: 'content', component: ContentComponent },
                    { path: 'discussion', component: DiscussionComponent },
                    { path: 'grades', component: GradesComponent },
                    { path: 'roster', component: RosterComponent },
                    { path: 'syllabus', component: SyllabusComponent },
                    { path: 'groups', component: GroupsComponent },
                    { path: 'attendance', component: AttendanceComponent }
                ]
            },
            { path: 'calendar', component: CalendarComponent }
        ]
    },
    // Wildcard (matches every other nonsensical url)
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes,{
            enableTracing: true
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
