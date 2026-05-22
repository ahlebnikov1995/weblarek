import { Form } from './Form';

export interface IOrderFormData {
  payment: 'cash' | 'card' | null;
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  protected _cashButton: HTMLButtonElement;
  protected _cardButton: HTMLButtonElement;
  protected _address: HTMLInputElement;

  constructor(
    container: HTMLElement,
    onPayment: (payment: 'cash' | 'card') => void,
    onAddress: (address: string) => void,
    onSubmit: () => void
  ) {
    super(container);

    this._cashButton = container.querySelector('button[name="cash"]') as HTMLButtonElement;
    this._cardButton = container.querySelector('button[name="card"]') as HTMLButtonElement;
    this._address = container.querySelector('input[name="address"]') as HTMLInputElement;

    this._cashButton.addEventListener('click', () => onPayment('cash'));
    this._cardButton.addEventListener('click', () => onPayment('card'));
    this._address.addEventListener('input', () => onAddress(this._address.value));
    this._submit.addEventListener('click', (e) => {
      e.preventDefault();
      onSubmit();
    });
  }

  set payment(value: 'cash' | 'card' | null) {
    this._cashButton.classList.toggle('button_alt-active', value === 'cash');
    this._cardButton.classList.toggle('button_alt-active', value === 'card');
  }

  set address(value: string) {
    this._address.value = value;
  }
}