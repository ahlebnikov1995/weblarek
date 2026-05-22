import { Card } from './Card';

export interface IPreviewCardData {
  title: string;
  price: number | null;
  category: string;
  image: string;
  description: string;
  id: string;
  buttonText: string;
}

export class PreviewCard extends Card {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, onBuy: () => void) {
    super(container);
    this._category = container.querySelector('.card__category') as HTMLElement;
    this._image = container.querySelector('.card__image') as HTMLImageElement;
    this._description = container.querySelector('.card__text') as HTMLElement;
    this._button = container.querySelector('.card__button') as HTMLButtonElement;
    this._button.addEventListener('click', onBuy);
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set category(value: string) {
    this._category.textContent = value;
  }

  set image(value: string) {
    this.setImage(this._image, value, this._title.textContent ?? '');
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set buttonText(value: string) {
    this._button.textContent = value;
  }
}