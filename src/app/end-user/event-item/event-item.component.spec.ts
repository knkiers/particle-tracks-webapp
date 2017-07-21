/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { EventItemComponent } from './event-item.component';

describe('Component: EventItem', () => {
  it('should create an instance', () => {
    let component = new EventItemComponent();
    expect(component).toBeTruthy();
  });
});
