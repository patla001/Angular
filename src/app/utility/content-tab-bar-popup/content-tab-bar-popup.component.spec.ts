import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTabBarPopupComponent } from './content-tab-bar-popup.component';

describe('ContentTabBarPopupComponent', () => {
  let component: ContentTabBarPopupComponent;
  let fixture: ComponentFixture<ContentTabBarPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentTabBarPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTabBarPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
