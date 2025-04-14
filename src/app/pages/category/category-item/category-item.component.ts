import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryItem } from '../../../interfaces/category.interface';
import { ButtonComponent } from '../../../components/button/button.component';
import { AssetService } from '../../../services/asset.service';

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
})
export class CategoryItemComponent implements OnInit {
  @Input({ required: true }) item!: CategoryItem;

  // Default placeholders in case images are missing
  placeholderImagePath = '/assets/placeholder-image.svg';
  mobileSrc = this.placeholderImagePath;
  tabletSrc = this.placeholderImagePath;
  desktopSrc = this.placeholderImagePath;

  constructor(
    private router: Router,
    private assetService: AssetService,
  ) {}

  ngOnInit(): void {
    // Process image paths when component initializes
    this.processImagePaths();
    console.log('CategoryItem initialized with item:', this.item);
  }

  // Process all image paths to ensure they're valid
  private processImagePaths(): void {
    console.log('Processing image paths for item:', this.item);

    if (this.item.images) {
      if (this.item.images.mobile) {
        this.mobileSrc = this.assetService.getAssetUrl(this.item.images.mobile);
        console.log('Mobile src:', this.mobileSrc);
      }

      if (this.item.images.tablet) {
        this.tabletSrc = this.assetService.getAssetUrl(this.item.images.tablet);
        console.log('Tablet src:', this.tabletSrc);
      }

      if (this.item.images.desktop) {
        this.desktopSrc = this.assetService.getAssetUrl(
          this.item.images.desktop,
        );
        console.log('Desktop src:', this.desktopSrc);
      }
    } else {
      console.warn('Item has no images:', this.item);
    }
  }

  // Handle image error events safely
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement && imgElement instanceof HTMLImageElement) {
      console.warn('Image failed to load:', imgElement.src);
      // Prevent infinite loop by checking if we're already using the placeholder
      if (imgElement.src !== this.placeholderImagePath) {
        imgElement.src = this.placeholderImagePath;
      }
    }
  }

  navigateToProduct(): void {
    console.log('Navigating to product with ID:', this.item.id);
    this.router.navigate(['/product', this.item.id]);
  }
}
