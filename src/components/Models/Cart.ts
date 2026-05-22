import { IProduct } from '../../types';
import { EventEmitter } from './EventEmitter';

export class Cart extends EventEmitter {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return [...this.items];
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    // Генерация события об изменении корзины (добавление)
    this.emit('cartChanged', { action: 'add', product, items: this.getItems() });
  }

  removeItem(product: IProduct): void {
    const index = this.items.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this.items.splice(index, 1);
      // Генерация события об изменении корзины (удаление)
      this.emit('cartChanged', { action: 'remove', product, items: this.getItems() });
    }
  }

  clear(): void {
    this.items = [];
    // Генерация события об изменении корзины (очистка)
    this.emit('cartChanged', { action: 'clear', items: [] });
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => {
      return item.price !== null ? sum + item.price : sum;
    }, 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}