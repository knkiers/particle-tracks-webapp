import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MassesComponent } from './masses.component';

describe('MassesComponent', () => {
  let component: MassesComponent;
  let fixture: ComponentFixture<MassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
