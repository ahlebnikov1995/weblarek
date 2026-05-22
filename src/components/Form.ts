import { Component } from './base/Component';

export interface IFormData {
  valid: boolean;
  errors: string;
}

export abstract class Form<T> extends Component<T> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  protected constructor(container: HTMLElement) {
    super(container);
    this._submit = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    this._errors = container.querySelector('.form__errors') as HTMLElement;
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  set errors(value: string) {
    this._errors.textContent = value;
  }
}