/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { CircleBindingService } from './circle-binding.service';

describe('CircleBinding Service', () => {
  beforeEachProviders(() => [CircleBindingService]);

  it('should ...',
      inject([CircleBindingService], (service: CircleBindingService) => {
    expect(service).toBeTruthy();
  }));
});
