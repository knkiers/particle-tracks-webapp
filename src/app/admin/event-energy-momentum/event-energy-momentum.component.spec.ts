import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventEnergyMomentumComponent } from './event-energy-momentum.component';

describe('EventEnergyMomentumComponent', () => {
  let component: EventEnergyMomentumComponent;
  let fixture: ComponentFixture<EventEnergyMomentumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventEnergyMomentumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventEnergyMomentumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
