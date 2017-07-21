/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { RoundRealPipe } from './round-real.pipe';

describe('Pipe: RoundReal', () => {
  it('create an instance', () => {
    let pipe = new RoundRealPipe();
    expect(pipe).toBeTruthy();
  });
});
