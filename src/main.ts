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
const ModalContainer = appContainer.querySelector('.modal__container') as HTMLElement;
console.log("модалка - ", ModalContainer);

const template_basket = document.querySelector('#basket') as HTMLTemplateElement;
const basketModalContainer = template_basket?.content.querySelector('.basket') as HTMLElement;
console.log("элемент корзины - ", basketModalContainer);
const template_card_full = document.querySelector('#card-preview') as HTMLTemplateElement;
const productModalContainer = template_card_full?.content.querySelector('.card_full') as HTMLElement;
console.log("элемент товара - ", productModalContainer);

const template_order = document.querySelector('#order') as HTMLTemplateElement;
const orderFormContainer = template_order?.content.querySelector('.form') as HTMLElement;

const template_contacts = document.querySelector('#contacts') as HTMLTemplateElement;
const contactsFormContainer = template_contacts?.content.querySelector('.form') as HTMLElement;


// 4. Создание экземпляров компонентов представления.
//    Колбэки в конструкторах немедленно генерируют события для презентера.
const header = new Header(headerContainer, () => {
    document.dispatchEvent(new CustomEvent('openCartClicked'));
});

const gallery = new Gallery(galleryContainer);

const basket = new Basket(basketModalContainer, () => {
    document.dispatchEvent(new CustomEvent('checkoutClicked'));
});

const basketModal = new Modal(ModalContainer, () => basketModal.close(), basketModalContainer);

const productModal = new Modal(ModalContainer, () => productModal.close(),productModalContainer);

const orderForm = new OrderForm(
    orderFormContainer,
    (payment: 'cash' | 'card') => {
        document.dispatchEvent(new CustomEvent('formDataChanged', { detail: { field: 'payment', value: payment } }));
    },
    (address: string) => {
        document.dispatchEvent(new CustomEvent('formDataChanged', { detail: { field: 'address', value: address } }));
    },
    () => {
        document.dispatchEvent(new CustomEvent('proceedToFormClicked'));
    }
);

const contactsForm = new ContactsForm(
    contactsFormContainer,
    (email: string) => {
        document.dispatchEvent(new CustomEvent('formDataChanged', { detail: { field: 'email', value: email } }));
    },
    (phone: string) => {
        document.dispatchEvent(new CustomEvent('formDataChanged', { detail: { field: 'phone', value: phone } }));
    },
    () => {
        document.dispatchEvent(new CustomEvent('payOrderClicked'));
    }
);

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ОТ МОДЕЛЕЙ ДАННЫХ ====================
// Эти функции вызываются автоматически, когда модели оповещают об изменении своего состояния.
// Здесь происходит обновление пользовательского интерфейса.

// Обработчик 1: Изменение каталога товаров
productCatalog.on('productsChanged', (products: IProduct[]) => {
    const cardElements = products.map(product => {
        // Создание DOM-элемента карточки из шаблона (шаблон должен быть в index.html)
        const cardTemplate = document.querySelector('.card__template') as HTMLTemplateElement;
        const cardElement = cardTemplate.content.cloneNode(true) as DocumentFragment;
        const cardContainer = cardElement.firstElementChild as HTMLElement;

        // Инициализация компонента CatalogCard. Его колбэк генерирует событие 'cardSelected'.
        const card = new CatalogCard(cardContainer, () => {
            document.dispatchEvent(new CustomEvent('cardSelected', { detail: { productId: product.id } }));
        });

        // Наполнение карточки данными продукта
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = product.image;
        card.id = product.id;

        // Добавление отдельного обработчика для кнопки "Купить"
        const buyButton = cardContainer.querySelector('.card__button');
        if (buyButton) {
            buyButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Чтобы не сработало событие выбора карточки
                document.dispatchEvent(new CustomEvent('addToCartClicked', { detail: { productId: product.id } }));
            });
        }
        return cardContainer;
    });
    // Команда компоненту Gallery отрендерить все созданные карточки
    gallery.items = cardElements;
});

// Обработчик 2: Изменение выбранного товара (для просмотра деталей)
productCatalog.on('selectedProductChanged', (product: IProduct) => {
    // Создание карточки для модального окна предпросмотра
    const previewTemplate = document.querySelector('.preview__template') as HTMLTemplateElement;
    const previewElement = previewTemplate.content.cloneNode(true) as DocumentFragment;
    const previewContainer = previewElement.firstElementChild as HTMLElement;

    const previewCard = new PreviewCard(previewContainer, () => {
        document.dispatchEvent(new CustomEvent('addToCartClicked', { detail: { productId: product.id } }));
    });

    previewCard.title = product.title;
    previewCard.price = product.price;
    previewCard.category = product.category;
    previewCard.image = product.image;
    previewCard.description = product.description || '';
    previewCard.buttonText = cart.hasItem(product.id) ? 'Уже в корзине' : 'В корзину';
    previewCard.id = product.id;

    // Вставка карточки в модальное окно и его открытие
    productModal.content = previewContainer;
    productModal.open();
});

// Обработчик 3: Изменение состояния корзины
cart.on('cartChanged', () => {
    const items = cart.getItems();
    const total = cart.getTotalPrice();
    const count = cart.getItemCount();

    // Обновление списка товаров в виджете корзины
    const basketCardElements = items.map(item => {
        const basketCardTemplate = document.querySelector('.basket-card__template') as HTMLTemplateElement;
        const basketCardElement = basketCardTemplate.content.cloneNode(true) as DocumentFragment;
        const cardContainer = basketCardElement.firstElementChild as HTMLElement;

        const basketCard = new BasketCard(cardContainer);
        basketCard.title = item.title;
        basketCard.price = item.price;

        // Добавление кнопки удаления товара из корзины
        const removeButton = cardContainer.querySelector('.basket-card__button') as HTMLButtonElement;
        if (removeButton) {
            removeButton.addEventListener('click', () => {
                document.dispatchEvent(new CustomEvent('removeFromCartClicked', { detail: { productId: item.id } }));
            });
        }
        return cardContainer;
    });

    basket.items = basketCardElements;
    basket.total = total;

    // Обновление счетчика товаров в заголовке
    header.count = count;

    // Побочный эффект: автосохранение корзины в localStorage
    localStorage.setItem('cart', JSON.stringify(items));
});

// Обработчик 4: Изменение данных покупателя
buyer.on('buyerDataChanged', () => {
    const data = buyer.getData();
    const errors = buyer.validate();
    const isValid = Object.keys(errors).length === 0;

    // Синхронизация данных модели с полями форм
    orderForm.address = data.address || '';
    orderForm.payment = data.payment;
    contactsForm.email = data.email || '';
    contactsForm.phone = data.phone || '';

    // Управление активностью кнопок отправки форм на основе валидности
    orderForm.valid = !!data.address && !!data.payment;
    contactsForm.valid = isValid;
});

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ОТ ПРЕДСТАВЛЕНИЙ ====================
// Эти функции вызываются, когда пользователь взаимодействует с интерфейсом.
// Здесь происходит изменение состояния моделей данных.
// Обработчики регистрируются на глобальном объекте `document`.

// Обработчик 5: Выбор карточки товара в каталоге
document.addEventListener('cardSelected', (event: Event) => {
    const customEvent = event as CustomEvent<{ productId: string }>;
    const product = productCatalog.getProductById(customEvent.detail.productId);
    if (product) {
        productCatalog.setSelectedProduct(product); // Вызовет событие 'selectedProductChanged'
    }
});

// Обработчик 6: Добавление товара в корзину
document.addEventListener('addToCartClicked', (event: Event) => {
    const customEvent = event as CustomEvent<{ productId: string }>;
    const product = productCatalog.getProductById(customEvent.detail.productId);
    if (product && !cart.hasItem(product.id)) {
        cart.addItem(product); // Вызовет событие 'cartChanged'
        showNotification(`Товар «${product.title}» добавлен в корзину`, 'success');
    } else if (product) {
        showNotification(`Товар «${product.title}» уже в корзине`, 'info');
    }
});

// Обработчик 7: Удаление товара из корзины
document.addEventListener('removeFromCartClicked', (event: Event) => {
    const customEvent = event as CustomEvent<{ productId: string }>;
    const product = productCatalog.getProductById(customEvent.detail.productId);
    if (product) {
        cart.removeItem(product); // Вызовет событие 'cartChanged'
        showNotification(`Товар «${product.title}» удален из корзины`, 'info');
    }
});

// Обработчик 8: Открытие модального окна корзины
document.addEventListener('openCartClicked', () => {
    basketModal.open();
});

// Обработчик 9: Начало оформления заказа (кнопка в корзине)
document.addEventListener('checkoutClicked', () => {
    if (cart.getItemCount() === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }
    basketModal.close();
    orderFormContainer.classList.add('form_active'); // Показ первой формы
});

// Обработчик 10: Переход от формы заказа к форме контактов
document.addEventListener('proceedToFormClicked', () => {
    const errors = buyer.validate(); // Валидация адреса и способа оплаты
    if (Object.keys(errors).length === 0) {
        orderFormContainer.classList.remove('form_active');
        contactsFormContainer.classList.add('form_active'); // Показ второй формы
    } else {
        showNotification('Заполните все поля в форме заказа', 'error');
    }
});

// Обработчик 11: Завершение оформления заказа (отправка на сервер)
document.addEventListener('payOrderClicked', async () => {
    const errors = buyer.validate();
    if (Object.keys(errors).length > 0) {
        showNotification('Исправьте ошибки в форме', 'error');
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
        // Использование ApiService для отправки заказа на сервер
        const confirmation = await apiService.createOrder(orderData);
        showNotification('Заказ успешно оформлен!', 'success');

        // Сброс состояния приложения после успешного заказа
        cart.clear(); // Вызовет событие 'cartChanged'
        buyer.clear(); // Вызовет событие 'buyerDataChanged'
        contactsFormContainer.classList.remove('form_active');
        productModal.close();

    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
        showNotification('Не удалось оформить заказ. Попробуйте позже.', 'error');
    }
});

// Обработчик 12: Изменение данных в полях форм
document.addEventListener('formDataChanged', (event: Event) => {
    const customEvent = event as CustomEvent<{ field: string; value: any }>;
    const { field, value } = customEvent.detail;

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


/**
 * Утилита для показа временных уведомлений пользователю.
 * @param message Текст сообщения
 * @param type Тип уведомления, влияющий на его стиль
 */
function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification_${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}


/**
 * Основная функция инициализации, выполняемая после полной загрузки DOM.
 * Загружает товары с сервера и восстанавливает состояние корзины.
 */
async function initApp() {
    try {
       console.log("зашли в инит");
       const products = await apiService.getProducts();
       console.log("продукты - ", products);
       productCatalog.setProducts(products.items);
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
        showNotification('Не удалось загрузить данные каталога', 'error');
    }
}

// Запуск инициализации после полной загрузки DOM-дерева
document.addEventListener('DOMContentLoaded', initApp);
