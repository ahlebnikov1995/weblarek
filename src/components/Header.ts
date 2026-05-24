import { Component } from './base/Component';

export interface IHeaderData {
  title: string;
  count: number;
}

export class Header extends Component<IHeaderData> {
  protected _title: HTMLElement;
  protected _count: HTMLElement;
  protected _basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, onBasketClick: () => void) {
    super(container);
    this._title = container.querySelector('.header__title') as HTMLElement;
    this._count = container.querySelector('.header__basket-counter') as HTMLElement;
    this._basketButton = container.querySelector('.header__basket') as HTMLButtonElement;

    this._basketButton.addEventListener('click', onBasketClick);
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set count(value: number) {
    this._count.textContent = String(value);
  }
}