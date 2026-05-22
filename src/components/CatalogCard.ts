import { Card } from './Card';

export interface ICatalogCardData {
  title: string;
  price: number | null;
  category: string;
  image: string;
  id: string;
}

export class CatalogCard extends Card {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);
    this._category = container.querySelector('.card__category') as HTMLElement;
    this._image = container.querySelector('.card__image') as HTMLImageElement;
    container.addEventListener('click', onClick);
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
}