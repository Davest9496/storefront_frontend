import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, CartState } from '../interfaces/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private initialState: CartState = {
    items: [],
    isVisible: false,
  };

  private cartState = new BehaviorSubject<CartState>(this.initialState);

  getCartState(): Observable<CartState> {
    return this.cartState.asObservable();
  }

  toggleCart(): void {
    const currentState = this.cartState.getValue();
    this.cartState.next({
      ...currentState,
      isVisible: !currentState.isVisible,
    });
  }

  addToCart(
    productId: string,
    categoryName: string,
    name: string,
    price: number,
    quantity: number = 1,
    image: string
  ): void {
    const currentState = this.cartState.getValue();
    const existingItem = currentState.items.find(
      (item) => item.id === productId
    );

    if (existingItem) {
      const updatedItems = currentState.items.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      this.cartState.next({
        ...currentState,
        items: updatedItems,
      });
    } else {
      const newItem: CartItem = {
        id: productId,
        name,
        price,
        quantity,
        image,
        category: categoryName,
      };
      this.cartState.next({
        ...currentState,
        items: [...currentState.items, newItem],
      });
    }
  }

  updateQuantity(productId: string, newQuantity: number): void {
    const currentState = this.cartState.getValue();

    if (newQuantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const updatedItems = currentState.items.map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item
    );

    this.cartState.next({
      ...currentState,
      items: updatedItems,
    });
  }

  removeItem(productId: string): void {
    const currentState = this.cartState.getValue();
    this.cartState.next({
      ...currentState,
      items: currentState.items.filter((item) => item.id !== productId),
    });
  }

  removeAll(): void {
    const currentState = this.cartState.getValue();
    this.cartState.next({
      ...currentState,
      items: [],
    });
  }

  getTotal(): number {
    const currentState = this.cartState.getValue();
    return currentState.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getItemCount(): number {
    const currentState = this.cartState.getValue();
    return currentState.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
