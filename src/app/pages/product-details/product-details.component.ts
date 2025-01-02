// src/app/pages/product/product-details.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '@app/interfaces/product.interface';
import { CategoryService } from '../../services/category.services';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];
    this.findProduct(productId);
  }

  private findProduct(productId: string): void {
    // Get all categories and find the product by id
    const categories = this.categoryService.getCategories();
    for (const category of categories) {
      const product = category.items.find((item) => item.id === productId);
      if (product) {
        this.product = product as Product;
        return;
      }
    }
    // If product not found, navigate to home
    this.router.navigate(['/not-found']);
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack(): void {
    window.history.back();
  }
}
