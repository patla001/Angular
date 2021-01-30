import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTabBarPopupComponent } from './upload-tab-bar-popup.component';

describe('UploadTabBarPopupComponent', () => {
  let component: UploadTabBarPopupComponent;
  let fixture: ComponentFixture<UploadTabBarPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadTabBarPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadTabBarPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
