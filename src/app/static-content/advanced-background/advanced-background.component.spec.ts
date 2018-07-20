import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedBackgroundComponent } from './advanced-background.component';

describe('AdvancedBackgroundComponent', () => {
  let component: AdvancedBackgroundComponent;
  let fixture: ComponentFixture<AdvancedBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
