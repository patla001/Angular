import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { environment } from '../environments/environment';

/*=============================================================================
                                ROUTING
=============================================================================*/
import { AppRoutingModule } from './app-routing.module';

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
                                SERVICES
=============================================================================*/
import { HttpClientModule } from '@angular/common/http';

/*=============================================================================
                                UTILITY
=============================================================================*/
import { UploadTabBarPopupComponent } from './utility/upload-tab-bar-popup/upload-tab-bar-popup.component';
import { ConfirmationPopupComponent } from './utility/confirmation-popup/confirmation-popup.component';
import { ProgressBarComponent } from './utility/progress-bar/progress-bar.component';
import { IndeterminateProgressBarComponent } from './utility/indeterminate-progress-bar/indeterminate-progress-bar.component';
import { InputTextPopupComponent } from './utility/input-text-popup/input-text-popup.component';
import { ContentTabBarPopupComponent } from './utility/content-tab-bar-popup/content-tab-bar-popup.component';

/*=============================================================================
                                ANGULARFIRE
=============================================================================*/
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
// import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'; // temporary
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

/*=============================================================================
                                IMPORTED LIBRARIES
=============================================================================*/
import { ClickOutsideModule } from 'ng-click-outside';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { QuillModule } from 'ngx-quill';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

/*=============================================================================
                                FORMS AND ANIMATIONS
=============================================================================*/
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*=============================================================================
                                ANGULAR MATERIAL
=============================================================================*/
import {
    MatIconModule,
    MatDatepickerModule, MatNativeDateModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatRadioModule,
    MatToolbarModule, MatTabsModule, MatMenuModule,
    MatProgressBarModule, MatTooltipModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatListModule, MatButtonToggleModule, MatSlideToggleModule } from '@angular/material';



@NgModule({
    declarations: [
        // APP, LOGIN, AND REGISTRATION
        AppComponent,
        PageNotFoundComponent,
        LoginComponent,
        RegisterComponent,
        UserHomeComponent,
        // USER ACCOUNT
        UserAccountComponent,
        UserProfileComponent,
        EditUserProfileComponent,
        UserResumeComponent,
        UserSettingsComponent,
        // USER CALENDAR
        CalendarComponent,
        // USER COURSES
        AddAnnouncementComponent,
        AddAssignmentComponent,
        AnnouncementsComponent,
        AssignmentsComponent,
        AssignmentDetailsComponent,
        ContentComponent,
        CourseListComponent,
        DiscussionComponent,
        GradesComponent,
        GroupsComponent,
        HomeComponent,
        RosterComponent,
        SyllabusComponent,
        AttendanceComponent,
        // UTILITY
        ConfirmationPopupComponent,
        ContentTabBarPopupComponent,
        IndeterminateProgressBarComponent,
        InputTextPopupComponent,
        ProgressBarComponent,
        UploadTabBarPopupComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        // ANGULARFIRE
        AngularFireModule.initializeApp(environment.firebase, 'Coordinate'),
        AngularFireAuthModule, // For firebase auth features
        // AngularFireDatabase, ** Uncomment for fiebase database features **
        AngularFirestoreModule, // For firestore features
        AngularFireStorageModule, // For firebase storage features
        // IMPORTED GITHUB LIBRARIES
        ClickOutsideModule,
        PdfViewerModule,
        QuillModule,
        NgxMaterialTimepickerModule,
        // HttpClient GET, POST
        HttpClientModule,
        // FORMS AND ANIMATIONS
        ReactiveFormsModule,
        FormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        // ANGULAR MATERIAL
        BrowserAnimationsModule, MatIconModule,
        MatDatepickerModule, MatNativeDateModule,
        MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatRadioModule,
        MatToolbarModule, MatTabsModule, MatMenuModule,
        MatProgressBarModule, MatTooltipModule,
        MatTableModule, MatPaginatorModule, MatSortModule,
        MatListModule, MatButtonToggleModule, MatSlideToggleModule
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
