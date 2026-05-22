import { Card } from './Card';

export interface IBasketCardData {
  title: string;
  price: number | null;
}

export class BasketCard extends Card {
  constructor(container: HTMLElement) {
    super(container);
  }
}