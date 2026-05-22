import { Component } from './base/Component';

export interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketData> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, onOrder: () => void) {
    super(container);
    this._list = container.querySelector('.basket__list') as HTMLElement;
    this._total = container.querySelector('.basket__price') as HTMLElement;
    this._button = container.querySelector('.basket__button') as HTMLButtonElement;

    this._button.addEventListener('click', onOrder);
  }

  set items(value: HTMLElement[]) {
    this._list.replaceChildren(...value);
  }

  set total(value: number) {
    this._total.textContent = `${value} синапсов`;
  }
}