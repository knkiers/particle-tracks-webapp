import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForTeachersComponent } from './for-teachers.component';

describe('ForTeachersComponent', () => {
  let component: ForTeachersComponent;
  let fixture: ComponentFixture<ForTeachersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForTeachersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
