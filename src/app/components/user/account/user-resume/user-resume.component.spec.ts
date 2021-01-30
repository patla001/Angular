import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResumeComponent } from './user-resume.component';

describe('FacultyResumeComponent', () => {
  let component: UserResumeComponent;
  let fixture: ComponentFixture<UserResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
