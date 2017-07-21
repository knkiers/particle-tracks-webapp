/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { EventAnalysisService } from './event-analysis.service';

describe('EventAnalysis Service', () => {
  beforeEachProviders(() => [EventAnalysisService]);

  it('should ...',
      inject([EventAnalysisService], (service: EventAnalysisService) => {
    expect(service).toBeTruthy();
  }));
});
