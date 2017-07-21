/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { UnitConversionService } from './unit-conversion.service';

describe('UnitConversion Service', () => {
  beforeEachProviders(() => [UnitConversionService]);

  it('should ...',
      inject([UnitConversionService], (service: UnitConversionService) => {
    expect(service).toBeTruthy();
  }));
});
