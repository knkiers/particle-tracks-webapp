/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { EventDisplayService } from './event-display.service';

describe('EventDisplay Service', () => {
  beforeEachProviders(() => [EventDisplayService]);

  it('should ...',
      inject([EventDisplayService], (service: EventDisplayService) => {
    expect(service).toBeTruthy();
  }));
});
