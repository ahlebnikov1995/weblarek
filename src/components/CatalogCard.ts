import { Card } from './Card';
import {CDN_URL} from '../utils/constants';
import {categoryMap} from '../utils/constants';

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
     const targetClass = categoryMap[value as keyof typeof categoryMap];
     this._category.className = 'card__category'; 
     if (targetClass) {
      this._category.classList.add(targetClass);
     }
    this._category.textContent = value;
  }

  set image(value: string) {
    value = value.replace("svg","png");
    const url = CDN_URL + value;
    console.log(url);
    this.setImage(this._image, url, this._title.textContent ?? '');
  }
}