import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Category } from '../interfaces/category.interface';
import { environment } from '../../environments/environment';

interface CategoriesResponse {
  categories: Category[];
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/category`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<CategoriesResponse>(this.apiUrl).pipe(
      map((response) => response.categories),
      catchError((error) => {
        console.error('Error fetching categories:', error);
        return of([]);
      }),
    );
  }

  getCategoryByName(name: string): Observable<Category | undefined> {
    return this.http.get<Category>(`${this.apiUrl}/${name}`).pipe(
      catchError((error) => {
        console.error(`Error fetching category ${name}:`, error);
        return of(undefined);
      }),
    );
  }

  // Additional methods for CRUD operations
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      catchError((error) => {
        console.error('Error creating category:', error);
        throw error;
      }),
    );
  }

  updateCategory(name: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${name}`, category).pipe(
      catchError((error) => {
        console.error(`Error updating category ${name}:`, error);
        throw error;
      }),
    );
  }

  deleteCategory(name: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${name}`).pipe(
      catchError((error) => {
        console.error(`Error deleting category ${name}:`, error);
        throw error;
      }),
    );
  }
}
