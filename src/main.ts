import './scss/styles.scss';
import {ProductCatalog} from './components/Models/ProductCatalog'
import {Cart} from './components/Models/Cart'
import { Api } from './components/base/Api';  // путь к вашему Api классу
import { ApiService } from './components/services/ApiService';
import {API_URL} from './utils/constants'
import { Buyer } from './components/Models/Buyer';
import { Header } from './components/Header';
import { Gallery } from './components/Gallery';
import { Basket } from './components/Basket';
import { Modal } from './components/Modal';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { CatalogCard } from './components/CatalogCard';
import { PreviewCard } from './components/PreviewCard';
import { BasketCard } from './components/BasketCard';
import { EventEmitter } from './components/Models/EventEmitter';



// 4. Импорт типов
import { IProduct, TPayment, IOrderRequest } from './types';

// ==================== ИНИЦИАЛИЗАЦИЯ СЕРВИСОВ И КОМПОНЕНТОВ ====================
// Место для создания всех экземпляров. Этот код выполняется один раз при загрузке скрипта.

// 1. Создание экземпляров API 
const api = new Api(API_URL);
console.log("api - ", api );
const apiService = new ApiService(api);
console.log("service - ", apiService);


// 2. Создание экземпляров моделей данных
const productCatalog = new ProductCatalog();
const cart = new Cart();
const buyer = new Buyer();

// 3. Поиск контейнеров в DOM-дереве
const appContainer = document.querySelector('.page') as HTMLElement;
console.log("страница - ", appContainer);
const headerContainer = appContainer.querySelector('.header') as HTMLElement;
const galleryContainer = appContainer.querySelector('.gallery') as HTMLElement;

const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketElement = basketTemplate.content.cloneNode(true) as DocumentFragment;
const basketContainer = basketElement.firstElementChild as HTMLElement;

const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

const templateOrder = document.querySelector('#order') as HTMLTemplateElement;
const orderElement = templateOrder.content.cloneNode(true) as DocumentFragment;
const orderFormContainer = orderElement.querySelector('.form') as HTMLElement;


const templateContacts = document.querySelector('#contacts') as HTMLTemplateElement;
const contactsElement = templateContacts.content.cloneNode(true) as DocumentFragment;
const contactsFormContainer = contactsElement.querySelector('.form') as HTMLElement;




// 4. Создание экземпляров компонентов представления.
//    Колбэки в конструкторах немедленно генерируют события для презентера.

// events.ts (или любой другой файл инициализации)
const eventEmitter = new EventEmitter();


const header = new Header(headerContainer, () => {
    eventEmitter.emit('openCartClicked');
});

const gallery = new Gallery(galleryContainer);

const basket = new Basket(basketContainer, () => {
    eventEmitter.emit('checkoutClicked');
});


const modalContainer = document.querySelector('#modal-container') as HTMLElement;

const modal = new Modal(modalContainer, () => modal.close());


const orderForm = new OrderForm(
    orderFormContainer,
    (payment: 'cash' | 'card') => {
        eventEmitter.emit('formDataChanged', { field: 'payment', value: payment });
    },
    (address: string) => {
        eventEmitter.emit('formDataChanged', { field: 'address', value: address });
    },
    () => {
        eventEmitter.emit('proceedToFormClicked');
    }
);

const contactsForm = new ContactsForm(
    contactsFormContainer,
    (email: string) => {
        eventEmitter.emit('formDataChanged', { field: 'email', value: email });
    },
    (phone: string) => {
        eventEmitter.emit('formDataChanged', { field: 'phone', value: phone });
    },
    () => {
        eventEmitter.emit('payOrderClicked');
    }
);


// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ОТ МОДЕЛЕЙ ДАННЫХ ====================
// Эти функции вызываются автоматически, когда модели оповещают об изменении своего состояния.
// Здесь происходит обновление пользовательского интерфейса.

// Обработчик 1: Изменение каталога товаров
productCatalog.on('productsChanged', (products: IProduct[]) => {
    const cardElements = products.map(product => {
        // Создание DOM-элемента карточки из шаблона (шаблон должен быть в index.html)
        const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
        const cardElement = cardTemplate.content.cloneNode(true) as DocumentFragment;
        const cardContainer = cardElement.firstElementChild as HTMLElement;

        // Инициализация компонента CatalogCard. Его колбэк генерирует событие 'cardSelected'.
        const card = new CatalogCard(cardContainer, () => {
           eventEmitter.emit('cardSelected', { productId: product.id });
        });

        // Наполнение карточки данными продукта
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = product.image;
        console.log(card.image);

        return cardContainer;
    });
    // Команда компоненту Gallery отрендерить все созданные карточки
    gallery.items = cardElements;
});

// Обработчик 2: Изменение выбранного товара (для просмотра деталей)
productCatalog.on('selectedProductChanged', (product: IProduct) => {
    // Создание карточки для модального окна предпросмотра
    const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
    const previewElement = previewTemplate.content.cloneNode(true) as DocumentFragment;
    const previewContainer = previewElement.firstElementChild as HTMLElement;

    const previewCard = new PreviewCard(previewContainer, () => {
        if(!cart.hasItem(product.id)){
            eventEmitter.emit('addToCartClicked', { productId: product.id });
            previewCard.buttonText = "уже в корзине";
        }else{
           eventEmitter.emit('removeFromCartClicked', { productId: product.id });
           previewCard.buttonText = "В корзину";
        }
    });

    previewCard.title = product.title;
    previewCard.price = product.price;
    previewCard.category = product.category;
    previewCard.image = product.image;
    previewCard.description = product.description || '';
    previewCard.buttonText = cart.hasItem(product.id) ? 'Уже в корзине' : 'В корзину';

    // Вставка карточки в модальное окно и его открытие
    modal.content = previewCard.render();
    modal.open();
});

// Обработчик 3: Изменение состояния корзины
cart.on('cartChanged', () => {
    const items = cart.getItems();
    const total = cart.getTotalPrice();
    const count = cart.getItemCount();

    header.count = count;

    // Обновление списка товаров в виджете корзины
    const basketCardElements = items.map((item, index) => {
        
        const basketCardElement = basketCardTemplate.content.cloneNode(true) as DocumentFragment;
        const cardContainer = basketCardElement.firstElementChild as HTMLElement;

        const basketCard = new BasketCard(cardContainer, () => {
            eventEmitter.emit('removeFromCartClicked', { productId: item.id });
        });
        basketCard.title = item.title;
        basketCard.price = item.price;
        basketCard.indexSpan = String(index + 1);

        return cardContainer;
    });

    
    basket.items = basketCardElements;
    basket.total = total;

    header.count = count;

    localStorage.setItem('cart', JSON.stringify(items));
});


// Обработчик 4: Изменение данных покупателя
buyer.on('buyerDataChanged', () => {
    const data = buyer.getData();
    const errors = buyer.validate();
    console.log(errors);

    // Синхронизация данных модели с полями форм
    orderForm.address = data.address || '';
    orderForm.payment = data.payment;
    contactsForm.email = data.email || '';
    contactsForm.phone = data.phone || '';

    // Управление активностью кнопок отправки форм на основе валидности
    orderForm.valid = !('address' in errors) && !('payment' in errors);
    contactsForm.valid = !('email' in errors) && !('phone' in errors);

    orderForm.errors = [errors.address, errors.payment].filter(Boolean).join('; ')
    contactsForm.errors = [errors.email, errors.phone].filter(Boolean).join('; ')
});

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ОТ ПРЕДСТАВЛЕНИЙ ====================
// Эти функции вызываются, когда пользователь взаимодействует с интерфейсом.
// Здесь происходит изменение состояния моделей данных.
// Обработчики регистрируются на глобальном объекте `document`.
// Обработчик 5: Выбор карточки товара в каталоге
eventEmitter.on('cardSelected', (data: { productId: string }) => {
    const product = productCatalog.getProductById(data.productId);
    if (product) {
        productCatalog.setSelectedProduct(product); // Вызовет событие 'selectedProductChanged'
    }
});

// Обработчик 6: Добавление товара в корзину
eventEmitter.on('addToCartClicked', (data: { productId: string }) => {
    const product = productCatalog.getProductById(data.productId);
    if (product && !cart.hasItem(product.id)) {
        cart.addItem(product); // Вызовет событие 'cartChanged'
    } 
});

// Обработчик 7: Удаление товара из корзины
eventEmitter.on('removeFromCartClicked', (data: { productId: string }) => {
    const product = productCatalog.getProductById(data.productId);
    if (product) {
        cart.removeItem(product); // Вызовет событие 'cartChanged'
    }
});

// Обработчик 8: Открытие модального окна корзины
eventEmitter.on('openCartClicked', () => {
    modal.content = basket.render(); 
    modal.open();
});

// Обработчик 9: Начало оформления заказа (кнопка в корзине)
eventEmitter.on('checkoutClicked', () => {
    if (cart.getItemCount() === 0) {
        return;
    }
    modal.content = orderForm.render(); 
});

// Обработчик 10: Переход от формы заказа к форме контактов
eventEmitter.on('proceedToFormClicked', () => {
    modal.content = contactsForm.render(); 
});

// Обработчик 11: Завершение оформления заказа (отправка на сервер)
eventEmitter.on('payOrderClicked', async () => {
    const errors = buyer.validate();
    console.log(errors);
    if (Object.keys(errors).length > 0) {
        return;
    }

    // Формирование объекта заказа согласно ожидаемому API интерфейсу IOrderRequest
    const orderData: IOrderRequest = {
        payment: buyer.getData().payment,
        email: buyer.getData().email,
        phone: buyer.getData().phone,
        address: buyer.getData().address,
        items: cart.getItems(),
        total: cart.getTotalPrice(),
    };

    try {
        // Сброс состояния приложения после успешного заказа
        cart.clear(); // Вызовет событие 'cartChanged'
        buyer.clear(); // Вызовет событие 'buyerDataChanged'
        modal.close();

        // Использование ApiService для отправки заказа на сервер
        const confirmation = await apiService.createOrder(orderData);

    } catch (error) {
        // получил ошибку 400, не знаю где посмотреть какой объект формировать
        console.error('Ошибка оформления заказа:', error);
    }
});

// Обработчик 12: Изменение данных в полях форм
eventEmitter.on('formDataChanged', (data: { field: string; value: any }) => {
    const { field, value } = data;

    // Обновление соответствующего поля в модели Buyer
    switch (field) {
        case 'payment':
            buyer.setPayment(value as TPayment);
            break;
        case 'address':
            buyer.setAddress(value);
            break;
        case 'email':
            buyer.setEmail(value);
            break;
        case 'phone':
            buyer.setPhone(value);
            break;
    }
    // Методы модели Buyer вызовут событие 'buyerDataChanged'
});


/*
 * Основная функция инициализации, выполняемая после полной загрузки DOM.
 * Загружает товары с сервера и восстанавливает состояние корзины.
 */
async function initApp() {
    try {
       console.log("зашли в инит");
       const products = await apiService.getProducts();
       console.log("продукты - ", products);
       console.log("каталог - ", productCatalog);
       productCatalog.setProducts(products.items);
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
    }
}

initApp();
