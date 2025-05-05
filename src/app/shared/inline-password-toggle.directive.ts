import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appInlinePasswordToggle]',
  standalone: true,
})
export class InlinePasswordToggleDirective implements AfterViewInit {
  private isPasswordVisible = false;
  private toggleButton: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit() {
    // Add padding to the right of the input to make room for the toggle button
    this.renderer.setStyle(this.el.nativeElement, 'padding-right', '40px');

    // Create and append the toggle button
    this.createToggleButton();
  }

  private createToggleButton() {
    // Create the toggle button
    this.toggleButton = this.renderer.createElement('button');

    // Style the toggle button
    this.renderer.setAttribute(this.toggleButton, 'type', 'button');
    this.renderer.setAttribute(
      this.toggleButton,
      'class',
      'password-toggle-btn',
    );
    this.renderer.setAttribute(
      this.toggleButton,
      'aria-label',
      'Show password',
    );

    // Position the button
    this.renderer.setStyle(this.toggleButton, 'position', 'absolute');
    this.renderer.setStyle(this.toggleButton, 'right', '10px');
    this.renderer.setStyle(this.toggleButton, 'top', '50%');
    this.renderer.setStyle(this.toggleButton, 'transform', 'translateY(-50%)');
    this.renderer.setStyle(this.toggleButton, 'background', 'none');
    this.renderer.setStyle(this.toggleButton, 'border', 'none');
    this.renderer.setStyle(this.toggleButton, 'cursor', 'pointer');
    this.renderer.setStyle(this.toggleButton, 'padding', '0');
    this.renderer.setStyle(this.toggleButton, 'display', 'flex');
    this.renderer.setStyle(this.toggleButton, 'align-items', 'center');
    this.renderer.setStyle(this.toggleButton, 'justify-content', 'center');
    this.renderer.setStyle(this.toggleButton, 'color', '#6b7280');
    this.renderer.setStyle(this.toggleButton, 'z-index', '2');

    // Create the icon wrapper span
    const iconSpan = this.renderer.createElement('span');
    this.renderer.addClass(iconSpan, 'password-toggle-icon');

    // Add the initial SVG (eye icon)
    iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`;

    // Append the icon to the button
    this.renderer.appendChild(this.toggleButton, iconSpan);

    // Handle click events
    this.renderer.listen(this.toggleButton, 'click', () =>
      this.togglePasswordVisibility(),
    );

    // Handle keyboard events for accessibility
    this.renderer.listen(this.toggleButton, 'keydown.enter', () =>
      this.togglePasswordVisibility(),
    );
    this.renderer.listen(this.toggleButton, 'keydown.space', (event) => {
      event.preventDefault(); // Prevent page scroll
      this.togglePasswordVisibility();
    });

    // Get the parent element to position the toggle button relative to
    const parentElement = this.el.nativeElement.parentElement;
    if (!parentElement) {
      console.warn(
        'Password input must have a parent element for the toggle button to work',
      );
      return;
    }

    // Set the parent to position: relative if it's not already
    const position = getComputedStyle(parentElement).position;
    if (position === 'static') {
      this.renderer.setStyle(parentElement, 'position', 'relative');
    }

    // Append the toggle button to the parent element
    this.renderer.appendChild(parentElement, this.toggleButton);
  }

  private togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;

    // Update the input type
    const newType = this.isPasswordVisible ? 'text' : 'password';
    this.renderer.setAttribute(this.el.nativeElement, 'type', newType);

    // Update the icon and button state
    if (this.toggleButton) {
      const iconSpan = this.toggleButton.querySelector('.password-toggle-icon');
      if (iconSpan) {
        if (this.isPasswordVisible) {
          // Update to show the eye-slash icon
          this.renderer.addClass(iconSpan, 'visible');
          iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>`;
          this.renderer.setAttribute(
            this.toggleButton,
            'aria-label',
            'Hide password',
          );
        } else {
          // Update to show the eye icon
          this.renderer.removeClass(iconSpan, 'visible');
          iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>`;
          this.renderer.setAttribute(
            this.toggleButton,
            'aria-label',
            'Show password',
          );
        }
      }
    }
  }
}
