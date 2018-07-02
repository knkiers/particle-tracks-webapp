import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleProblemsComponent } from './example-problems.component';

describe('ExampleProblemsComponent', () => {
  let component: ExampleProblemsComponent;
  let fixture: ComponentFixture<ExampleProblemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleProblemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
