import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-placeholder-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img
      [src]="currentSrc"
      [alt]="alt"
      [class]="className"
      (error)="handleImageError()"
    />
  `,
  styles: [],
})
export class PlaceholderImageComponent {
  @Input() src: string = '';
  @Input() alt: string = 'Product image';
  @Input() className: string = '';
  @Input() fallbackSrc: string = '/assets/placeholder-image.jpg';

  currentSrc: string = '';

  constructor(private assetService: AssetService) {}

  ngOnInit(): void {
    // Process the source on init
    this.currentSrc = this.assetService.getAssetUrl(this.src);
  }

  // Handle image load errors
  handleImageError(): void {
    console.warn(`Image failed to load: ${this.currentSrc}, using fallback`);
    this.currentSrc = this.fallbackSrc;
  }
}
