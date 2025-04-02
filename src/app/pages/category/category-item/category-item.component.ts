import { Component, Input } from '@angular/core';
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
export class CategoryItemComponent {
  @Input({ required: true }) item!: CategoryItem;

  constructor(
    private router: Router,
    private assetService: AssetService,
  ) {}

  // Use the asset service to get the correct URL
  getImageUrl(path: string | undefined): string {
    return this.assetService.getAssetUrl(path);
  }

  navigateToProduct(): void {
    this.router.navigate(['/product', this.item.id]);
  }
}
