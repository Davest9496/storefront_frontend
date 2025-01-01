// category.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.services';
import { CategoryItemComponent } from './category-item/category-item.component';
import { Category, CategoryItem } from '../../interfaces/category.interface';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, CategoryItemComponent],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  private _category?: Category;

  get hasCategory(): boolean {
    return !!this._category;
  }

  get categoryData(): Category {
    if (!this._category) {
      throw new Error('Category not found');
    }
    return this._category;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const categoryName = this.route.snapshot.params['category'];
    this._category = this.categoryService.getCategoryByName(categoryName);

    if (!this._category) {
      this.navigateHome();
    }
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }

  trackById(index: number, item: CategoryItem): string {
    return item.id;
  }
}
