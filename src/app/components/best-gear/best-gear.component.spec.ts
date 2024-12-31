import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BestGearComponent } from './best-gear.component';

describe('BestGearComponent', () => {
  let component: BestGearComponent;
  let fixture: ComponentFixture<BestGearComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestGearComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestGearComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Layout Structure', () => {
    it('should render the main section with best-gear class', () => {
      const section = element.querySelector('section.best-gear');
      expect(section).toBeTruthy();
    });

    it('should contain picture element with responsive sources', () => {
      const picture = element.querySelector('picture.best-gear_image');
      const sources = picture?.querySelectorAll('source');
      const img = picture?.querySelector('img');

      expect(picture).toBeTruthy();
      expect(sources?.length).toBe(2);
      expect(img).toBeTruthy();
    });

    it('should have proper image sources for different screen sizes', () => {
      const sources = element.querySelectorAll('source');
      const img = element.querySelector('img');

      expect(sources[0].getAttribute('media')).toBe('(min-width: 1200px)');
      expect(sources[0].getAttribute('srcset')).toContain(
        'desktop/image-best-gear.jpg'
      );

      expect(sources[1].getAttribute('media')).toBe('(min-width: 768px)');
      expect(sources[1].getAttribute('srcset')).toContain(
        'tablet/image-best-gear.jpg'
      );

      expect(img?.getAttribute('src')).toContain('mobile/image-best-gear.jpg');
    });
  });

  describe('Content', () => {
    it('should display the correct heading text', () => {
      const title = element.querySelector('.best-gear_title');
      expect(title?.textContent?.trim()).toContain(
        'BRINGING YOU THE BEST AUDIO GEAR'
      );
    });

    it('should highlight the word BEST', () => {
      const highlight = element.querySelector('.best-gear_highlight');
      expect(highlight?.textContent?.trim()).toBe('BEST');
    });

    it('should contain a description paragraph', () => {
      const description = element.querySelector('.best-gear_description');
      expect(description).toBeTruthy();
      expect(description?.textContent?.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have alt text for the image', () => {
      const img = element.querySelector('img');
      expect(img?.hasAttribute('alt')).toBe(true);
      expect(img?.getAttribute('alt')?.length).toBeGreaterThan(0);
    });

    it('should use semantic heading tags', () => {
      const heading = element.querySelector('h2');
      expect(heading).toBeTruthy();
    });
  });
});
