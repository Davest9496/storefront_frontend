// category-item.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryItem } from '../../../interfaces/category.interface';
import { ButtonComponent } from '../../../components/button/button.component';

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
})
export class CategoryItemComponent {
  @Input({ required: true }) item!: CategoryItem;
}
