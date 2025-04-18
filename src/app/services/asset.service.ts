import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private assetBaseUrl = environment.assetUrl || '/assets/';
  private serverApiUrl = environment.apiUrl;

  // Use the SVG file for placeholders
  private placeholderImagePath = '/assets/placeholder-image.svg';

  constructor() {
    console.log('AssetService initialized with base URL:', this.assetBaseUrl);
    console.log('API URL:', this.serverApiUrl);
    console.log('Using backend images:', environment.useBackendImages || false);
  }

  /**
   * Resolves an asset path to a full URL
   * Handles both local assets and remote S3 assets
   *
   * @param path The relative or absolute path to the asset
   * @returns The full URL to the asset
   */
  getAssetUrl(path: string | undefined, isRetry = false): string {
    if (!path) {
      console.log('No path provided, returning placeholder');
      return this.placeholderImagePath;
    }

    // Prevent infinite loops
    if (path === this.placeholderImagePath || isRetry) {
      return path;
    }

    // Debug logging
    if (environment.debug) {
      console.log('AssetService: Processing path:', path);
    }

    // If it's a placeholder reference, return the SVG file path
    if (
      path === 'placeholder-image.jpg' ||
      path === '/assets/placeholder-image.jpg'
    ) {
      return this.placeholderImagePath;
    }

    // If it's already an absolute URL, return it as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // Handle API-specific paths (if API returns its own path format)
    if (path.startsWith('/api/uploads/') || path.startsWith('api/uploads/')) {
      const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      const serverRoot = this.serverApiUrl.split('/api')[0];
      return `${serverRoot}/${cleanPath}`;
    }

    // Decide whether to use local assets or connect to the backend for images
    if (environment.useBackendImages || environment.production) {
      // Using backend/S3 for images
      // Strip any leading 'assets/' as the backend wouldn't have that prefix
      const cleanPath = path.replace(/^assets\//, '');

      // Check if it's a gallery image path (contains image-gallery)
      if (path.includes('image-gallery-')) {
        if (environment.debug) {
          console.log('Gallery image identified:', path);
        }
        return `${this.assetBaseUrl}${cleanPath}`;
      }

      // Check if it's a product image path
      if (
        path.includes('/mobile/') ||
        path.includes('/tablet/') ||
        path.includes('/desktop/')
      ) {
        if (environment.debug) {
          console.log('Product image identified:', path);
        }
        return `${this.assetBaseUrl}${cleanPath}`;
      }

      // Default product image handling
      return `${this.assetBaseUrl}${cleanPath}`;
    } else {
      // Using local assets
      // If it already has the assets/ prefix, just ensure there's a leading slash
      if (path.startsWith('assets/')) {
        return `/${path}`;
      }

      // For product images, construct the proper path for local assets
      // This ensures we always have the /assets/ prefix for local files
      if (!path.startsWith('/')) {
        return `/assets/${path}`;
      } else {
        return path;
      }
    }
  }

  /**
   * Gets a gallery image path for a product
   *
   * @param productId The product ID
   * @param category The product category
   * @param imageNumber The gallery image number (1, 2, 3)
   * @param size The image size (mobile, tablet, desktop)
   * @returns The full URL to the gallery image
   */
  getGalleryImageUrl(
    productId: string,
    category: string | undefined,
    imageNumber: number,
    size: 'mobile' | 'tablet' | 'desktop',
  ): string {
    if (!productId || !category) {
      console.warn('Missing product info for gallery image');
      return this.placeholderImagePath;
    }

    try {
      // Construct the base folder name
      const baseFolder = `product-${productId}-${category.toLowerCase()}`;

      // Construct the path
      const path = `${baseFolder}/${size}/image-gallery-${imageNumber}.jpg`;

      if (environment.debug) {
        console.log(`Generated gallery image path: ${path}`);
      }

      return this.getAssetUrl(path);
    } catch (error) {
      console.error('Error generating gallery image path:', error);
      return this.placeholderImagePath;
    }
  }
}
