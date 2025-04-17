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

    // Log for debugging
    console.log('AssetService: Processing path:', path);

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
    if (environment.production) {
      // In production, connect to S3
      // Strip any leading 'assets/' as the backend wouldn't have that prefix
      const cleanPath = path.replace(/^assets\//, '');

      // Check if it's a product image path
      if (
        path.includes('/mobile/') ||
        path.includes('/tablet/') ||
        path.includes('/desktop/')
      ) {
        console.log('Product image identified:', path);
        return `${this.assetBaseUrl}${cleanPath}`;
      }

      // Default product image handling
      return `${this.assetBaseUrl}${cleanPath}`;
    } else {
      // In development, use local assets or the specified asset URL
      if (path.startsWith('assets/')) {
        return `/${path}`;
      }

      // For product images, construct the proper path for local assets
      return `/assets/${path}`;
    }
  }
}
