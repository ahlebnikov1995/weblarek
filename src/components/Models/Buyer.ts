import { IBuyer, TPayment } from '../../types';
import { EventEmitter } from './EventEmitter';

type Errors = Partial<Record<keyof IBuyer, string>>;

export class Buyer extends EventEmitter {
  private payment: TPayment | null = null;
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  setPayment(payment: TPayment): void {
    this.payment = payment;
    // Генерация события об изменении данных покупателя
    this.emit('buyerDataChanged', { field: 'payment', value: payment, data: this.getData() });
  }

  setEmail(email: string): void {
    this.email = email;
    // Генерация события об изменении данных покупателя
    this.emit('buyerDataChanged', { field: 'email', value: email, data: this.getData() });
  }

  setPhone(phone: string): void {
    this.phone = phone;
    // Генерация события об изменении данных покупателя
    this.emit('buyerDataChanged', { field: 'phone', value: phone, data: this.getData() });
  }

  setAddress(address: string): void {
    this.address = address;
    // Генерация события об изменении данных покупателя
    this.emit('buyerDataChanged', { field: 'address', value: address, data: this.getData() });
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    }
  }

  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
    // Генерация события об изменении данных покупателя (сброс)
    this.emit('buyerDataChanged', { action: 'clear', data: this.getData() });
  }

  validate(): Errors {
    const errors: Errors = {};

    if (!this.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.email.trim()) errors.email = 'Укажите email';
    if (!this.phone.trim()) errors.phone = 'Укажите телефон';
    if (!this.address.trim()) errors.address = 'Укажите адрес';

    return errors;
  }
}