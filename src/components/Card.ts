import { Component } from './base/Component';

export interface ICardData {
  title: string;
  price: number | null;
}

export abstract class Card extends Component<ICardData> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  protected constructor(container: HTMLElement) {
    super(container);
    this._title = container.querySelector('.card__title') as HTMLElement;
    this._price = container.querySelector('.card__price') as HTMLElement;
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    this._price.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }
}