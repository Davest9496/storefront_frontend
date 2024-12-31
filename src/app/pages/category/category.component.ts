// src/app/pages/category/category.component.ts

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
  // Private field to store category data
  private _category?: Category;

  // Public getter to check if category exists
  get hasCategory(): boolean {
    return !!this._category;
  }

  // Public getter to safely access category data
  get categoryData(): Category {
    if (!this._category) {
      throw new Error('Attempting to access category when it is not defined');
    }
    return this._category;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Get category name from route parameters
    const categoryName = this.route.snapshot.params['category'];

    // Fetch category data using the service
    this._category = this.categoryService.getCategoryByName(categoryName);

    // Navigate to home if category is not found
    if (!this._category) {
      this.navigateHome();
    }
  }

  // Helper method for navigation
  navigateHome(): void {
    this.router.navigate(['/']);
  }

  // TrackBy function for better list rendering performance
  trackById(index: number, item: CategoryItem): string {
    return item.id;
  }
}
