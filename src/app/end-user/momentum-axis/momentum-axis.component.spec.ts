/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { MomentumAxisComponent } from './momentum-axis.component';

describe('Component: MomentumAxis', () => {
  it('should create an instance', () => {
    let component = new MomentumAxisComponent();
    expect(component).toBeTruthy();
  });
});
