import './scss/styles.scss';
import {ProductCatalog} from './components/Models/ProductCatalog'
import { apiProducts } from './utils/data';
import {Cart} from './components/Models/Cart'
import { Api } from './components/base/Api';  // путь к вашему Api классу
import { ApiService } from './components/services/ApiService';
import {API_URL} from './utils/constants'
import { Buyer } from './components/Models/Buyer';

const productsModel = new ProductCatalog();
productsModel.setProducts(apiProducts.items); 

console.log('Массив товаров из каталога: ', productsModel.getProducts());

console.log('Конкретный товар: ', productsModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390"));

productsModel.setSelectedProduct(productsModel.getProducts()[0]);

console.log('Выбран следующий товар: ', productsModel.getSelectedProduct());

const cartModel = new Cart();

cartModel.addItem(apiProducts.items[0]);

cartModel.addItem(apiProducts.items[1]);

cartModel.addItem(apiProducts.items[2]);

console.log('В корзину добавлены 3 товара, содержимое корзины: ', cartModel.getItems());

console.log('Количество элементов в корзине: ', cartModel.getItemCount());

console.log('общая стоимость: ', cartModel.getTotalPrice());

cartModel.removeItem(cartModel.getItems()[1]);

console.log('Из корзины удалён один предмет, содержимое корзины: ', cartModel.getItems());

cartModel.clear();

console.log('корзина очищена, содержимое корзины: ', cartModel.getItems());


const buyer = new Buyer();

buyer.setAddress("улица пушкина дом колотушкина 5");
buyer.setEmail("cool@yandex.ru");
buyer.setPayment("card");
buyer.setPhone("");

console.log('созданный покупатель: ', buyer);

console.log('результат валидации: ', buyer.validate());

buyer.clear();

console.log('покупатель после очистки: ', buyer);


console.log('-----API-----');

const api = new Api(API_URL); 
const apiService = new ApiService(api);

try{
    const products = await apiService.getProducts();

    productsModel.setProducts(products.items);

    console.log('Массив товаров из каталога: ', productsModel.getProducts());

    console.log('Конкретный товар: ', productsModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390"));

    productsModel.setSelectedProduct(productsModel.getProducts()[0]);

    console.log('Выбран следующий товар: ', productsModel.getSelectedProduct());



    cartModel.addItem(products.items[0]);
    cartModel.addItem(products.items[1]);
    cartModel.addItem(products.items[2]);

    console.log('В корзину добавлены 3 товара, содержимое корзины: ', cartModel.getItems());

    console.log('Количество элементов в корзине: ', cartModel.getItemCount());

    console.log('общая стоимость: ', cartModel.getTotalPrice());

    cartModel.removeItem(cartModel.getItems()[1]);

    console.log('Из корзины удалён один предмет, содержимое корзины: ', cartModel.getItems());

    cartModel.clear();

    console.log('корзина очищена, содержимое корзины: ', cartModel.getItems());
} catch(err) {
    console.log(err);
}