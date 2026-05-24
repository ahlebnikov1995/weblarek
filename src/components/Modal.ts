import { Component } from './base/Component';

export class Modal extends Component<unknown> {
  protected _content: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  // Оставляем три аргумента, чтобы не сломать типы, но делаем content необязательным [?]
  constructor(container: HTMLElement, onClose: () => void, content?: HTMLElement) {
    super(container);
    
    // ВАЖНО: Ищем зону контента ИМЕННО внутри самой модалки (внутри container)
    this._content = container.querySelector('.modal__content') as HTMLElement;
    this._closeButton = container.querySelector('.modal__close') as HTMLButtonElement;

    this._closeButton.addEventListener('click', onClose);
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) onClose();
    });
  }

  // Этот сеттер теперь будет чисто и безопасно вставлять любой HTML внутрь <div class="modal__content">
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this._content.replaceChildren(); // Очищаем при закрытии, чтобы не оставалось старых данных
  }
}
