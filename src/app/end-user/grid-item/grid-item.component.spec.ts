/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { GridItemComponent } from './grid-item.component';

describe('Component: GridItem', () => {
  it('should create an instance', () => {
    let component = new GridItemComponent();
    expect(component).toBeTruthy();
  });
});
