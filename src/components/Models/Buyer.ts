import { IBuyer, TPayment } from '../../types';

export class Buyer {
  private payment: TPayment | null = null;
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  setPayment(payment: TPayment): void {
    this.payment = payment;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setAddress(address: string): void {
    this.address = address;
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
  }

  validate(): Partial<Record<keyof IBuyer, string>> | null {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.email.trim()) errors.email = 'Укажите email';
    if (!this.phone.trim()) errors.phone = 'Укажите телефон';
    if (!this.address.trim()) errors.address = 'Укажите адрес';

    return Object.keys(errors).length > 0 ? errors : null;
  }
}