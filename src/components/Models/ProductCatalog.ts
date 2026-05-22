import { IProduct } from '../../types';
import { EventEmitter } from './EventEmitter';

export class ProductCatalog extends EventEmitter {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  setProducts(products: IProduct[]): void {
    this.products = products;
    // Генерация события об изменении каталога товаров
    this.emit('productsChanged', products);
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | null {
    return this.products.find(product => product.id === id) || null;
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    // Генерация события об изменении выбранного товара
    this.emit('selectedProductChanged', product);
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}