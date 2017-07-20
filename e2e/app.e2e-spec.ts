import { ParticleTracksWebappPage } from './app.po';

describe('particle-tracks-webapp App', () => {
  let page: ParticleTracksWebappPage;

  beforeEach(() => {
    page = new ParticleTracksWebappPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
