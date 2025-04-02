import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private assetBaseUrl = environment.assetUrl;

  constructor() {}

  /**
   * Resolves an asset path to a full URL
   * Handles both local assets and remote S3 assets
   *
   * @param path The relative or absolute path to the asset
   * @returns The full URL to the asset
   */
  getAssetUrl(path: string | undefined): string {
    if (!path) {
      return `${this.assetBaseUrl}placeholder-image.jpg`;
    }

    // If it's already an absolute URL, return it as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // If it's an asset path that already includes the assets directory prefix
    if (path.startsWith('assets/')) {
      // In production, replace assets/ with the S3 base URL
      if (environment.production) {
        return path.replace('assets/', this.assetBaseUrl);
      }
      // In development, just return the path as is (with leading slash)
      return `/${path}`;
    }

    // For paths without the assets/ prefix
    return `${this.assetBaseUrl}${path}`;
  }
}
