import { StaticContentModule } from './static-content.module';

describe('StaticContentModule', () => {
  let staticContentModule: StaticContentModule;

  beforeEach(() => {
    staticContentModule = new StaticContentModule();
  });

  it('should create an instance', () => {
    expect(staticContentModule).toBeTruthy();
  });
});
