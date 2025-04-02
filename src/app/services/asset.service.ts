import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private assetBaseUrl = environment.assetUrl;
  private serverApiUrl = environment.apiUrl;

  // Use the existing SVG file
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
  getAssetUrl(path: string | undefined): string {
    if (!path) {
      return this.placeholderImagePath;
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

    // If it's an asset path that already includes the assets directory prefix
    if (path.startsWith('assets/')) {
      // In production, replace assets/ with the S3 base URL if needed
      if (environment.production && this.assetBaseUrl !== '/assets/') {
        return path.replace('assets/', this.assetBaseUrl);
      }
      // In development, just return the path as is (with leading slash)
      return `/${path}`;
    }

    // For paths without the assets/ prefix
    return `${this.assetBaseUrl}${path}`;
  }
}
