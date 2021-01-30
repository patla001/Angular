import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextPopupComponent } from './input-text-popup.component';

describe('InputTextPopupComponent', () => {
  let component: InputTextPopupComponent;
  let fixture: ComponentFixture<InputTextPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTextPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTextPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
