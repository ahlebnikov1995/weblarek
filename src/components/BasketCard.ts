import { Card } from './Card';

export class BasketCard extends Card {
  protected _indexSpan: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, onRemove: () => void) {
    super(container);
    this._indexSpan = container.querySelector('.basket__item-index') as HTMLElement;
    this._button = container.querySelector('.basket__item-delete') as HTMLButtonElement;
    this._button.addEventListener('click', onRemove);
  }

  set indexSpan(value: string) {
      this._indexSpan.textContent = value;
  }

  

}