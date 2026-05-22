import { Component } from './base/Component';

export class Modal extends Component<unknown> {
  protected _content: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, onClose: () => void, content:HTMLElement) {
    super(container);
    this._content = content;
    this._closeButton = container.querySelector('.modal__close') as HTMLButtonElement;

    this._closeButton.addEventListener('click', onClose);
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) onClose();
    });
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this._content.replaceChildren();
  }
}