import { Form } from './Form';

export interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;

  constructor(
    container: HTMLElement,
    onEmail: (email: string) => void,
    onPhone: (phone: string) => void,
    onSubmit: () => void
  ) {
    super(container);

    this._email = container.querySelector('input[name="email"]') as HTMLInputElement;
    this._phone = container.querySelector('input[name="phone"]') as HTMLInputElement;

    this._email.addEventListener('input', () => onEmail(this._email.value));
    this._phone.addEventListener('input', () => onPhone(this._phone.value));
    this._submit.addEventListener('click', (e) => {
      e.preventDefault();
      onSubmit();
    });
  }

  set email(value: string) {
    this._email.value = value;
  }

  set phone(value: string) {
    this._phone.value = value;
  }
}