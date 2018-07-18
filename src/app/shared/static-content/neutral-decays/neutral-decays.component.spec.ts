import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecaysComponent } from './neutral-decays.component';

describe('DecaysComponent', () => {
  let component: DecaysComponent;
  let fixture: ComponentFixture<DecaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
