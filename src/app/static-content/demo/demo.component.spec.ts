import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {NeutralDecaysComponent} from '../../shared/static-content/neutral-decays/neutral-decays.component';
import {ChargedDecaysComponent} from '../../shared/static-content/charged-decays/charged-decays.component';

import { DemoComponent } from './demo.component';

describe('DemoComponent', () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
