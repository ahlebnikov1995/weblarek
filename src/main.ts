import './scss/styles.scss';
import {ProductCatalog} from './components/Models/ProductCatalog'
import { apiProducts } from './utils/data';
import {Cart} from './components/Models/Cart'
import { Api } from './components/base/Api';  // путь к вашему Api классу
import { ApiService } from './components/services/ApiService';
import {API_URL} from './utils/constants'

const productsModel = new ProductCatalog();
productsModel.setProducts(apiProducts.items); 

console.log('Массив товаров из каталога: ', productsModel.getProducts());

console.log('Конкретный товар: ', productsModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390"));

productsModel.setSelectedProduct(productsModel.getProducts()[0]);

console.log('Выбран следующий товар: ', productsModel.getSelectedProduct());

const cartModel = new Cart();

cartModel.addItem(apiProducts.items[0]);

cartModel.addItem(apiProducts.items[1]);

console.log('В корзину добавлены 2 товара, содержимое корзины: ', cartModel.getItems());

console.log('Количество элементов в корзине: ', cartModel.getItemCount());

console.log('общая стоимость: ', cartModel.getTotalPrice());

cartModel.removeItem(cartModel.getItems()[1]);

console.log('Из корзины удалён один предмет, содержимое корзины: ', cartModel.getItems());

cartModel.clear();

console.log('корзина очищена, содержимое корзины: ', cartModel.getItems());


console.log('-----API-----');

const api = new Api(API_URL); 
const apiService = new ApiService(api);

const products = await apiService.getProducts();

productsModel.setProducts(products.items);

console.log('Массив товаров из каталога: ', productsModel.getProducts());

console.log('Конкретный товар: ', productsModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390"));

productsModel.setSelectedProduct(productsModel.getProducts()[0]);

console.log('Выбран следующий товар: ', productsModel.getSelectedProduct());



cartModel.addItem(products.items[0]);
cartModel.addItem(products.items[0]);

console.log('В корзину добавлены 2 товара, содержимое корзины: ', cartModel.getItems());

console.log('Количество элементов в корзине: ', cartModel.getItemCount());

console.log('общая стоимость: ', cartModel.getTotalPrice());

cartModel.removeItem(cartModel.getItems()[1]);

console.log('Из корзины удалён один предмет, содержимое корзины: ', cartModel.getItems());

cartModel.clear();

console.log('корзина очищена, содержимое корзины: ', cartModel.getItems());