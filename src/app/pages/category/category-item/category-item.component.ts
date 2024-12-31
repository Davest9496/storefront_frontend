import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/button/button.component';
import { CategoryItem } from '../../../interfaces/category.interface';

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
