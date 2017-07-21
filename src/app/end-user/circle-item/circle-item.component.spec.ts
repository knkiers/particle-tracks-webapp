/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { CircleItemComponent } from './circle-item.component';

describe('Component: CircleItem', () => {
  it('should create an instance', () => {
    let component = new CircleItemComponent();
    expect(component).toBeTruthy();
  });
});
