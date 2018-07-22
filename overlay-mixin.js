/**
 * @mixin
 * @polymer
 */
window.OverlayMixin = subclass => class extends subclass {

  static get properties() {
    return {

      opened: {type: Boolean, notify: true, observer: '_openedChanged'},

      noCancelOnEscKey: {type: Boolean, value: false},

      cancelOnPopState: {type: Boolean, value: false},

      cancelOnOutsideClick: {type: Boolean, value: false},

      removeOnClose: {type: Boolean, value: false},

      closeOthers: {type: Boolean, value: false},

      onDetach: {type: Function},

      canceled: {type: Boolean, readOnly: true, value: false},

      noAutoFocus: {type: Boolean, value: false},

      parentContainer: {type: Object, value: document.body},

    };
  }

  constructor() {
    super();
    this.__movingToContainer = false;
    this.__onOverlayKeydown = this.__onOverlayKeydown.bind(this);
  }

  connectedCallback() {
    this._ensureAttribute('tabindex', -1);
    if (!this.opened) {
      this.style.display = 'none';
    }
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.__movingToContainer) {
      return;
    }      
    if (this.opened) {
      this.opened = false;
      this.__dispatchEvent('overlay-closed', {node: this.parentContainer});
    }
    this.__dispatchEvent('overlay-detached', {node: this.parentContainer});
    this.__dispatchEvent('overlay-detached');
    if (typeof this.onDetach === 'function') {
      this.onDetach();
    }
  }

  /**
   * Polymer call observers once the element is attached.
   * If the overlay is created programmatically, setting the opened property
   * to true won't trigger the '_openedChanged' method. Instead use this
   * method.
   */
  open() {
    this.opened = true;
    if (!this.isConnected) {
      // This will attach the the overlay to the DOM and call observers.
      this.__beforeOpen();
    }
  }

  _openedChanged(opened, old) {
    if (opened) {
      this.__beforeOpen();
      this.__toggleOverlayListeners({enable: true});
      this._setCanceled(false);
      this.style.display = '';
      if (!this.noAutoFocus) {
        this.focus();
      }
      this.__dispatchEvent('overlay-opened');
    } else {
      this.__toggleOverlayListeners({enable: false});
      this.style.display = 'none';
    }
    if (old) {
      this.__dispatchEvent('overlay-closed');
    }
    if (!opened && this.removeOnClose) {
      this.remove();
    }
  }

  __beforeOpen() {
    this.__dispatchEvent('before-open-overlay', {
      node: document.body
    });
    if ((!this.isConnected) ||
        (this.parentElement !== this.parentContainer)) {
      if (this.isConnected) {
        this.__movingToContainer = true;
      }
      // Attach the overlay to the parentContainer
      this.__attachToParentContainer();
      this.__movingToContainer = false;  
    }
  }

  __attachToParentContainer() {
    try {
      this.parentContainer.appendChild(this);
    } catch(e) {}
  }

  __toggleOverlayListeners({enable}) {
    const m = enable ? 'addEventListener' : 'removeEventListener';
    this[m]('keydown', this.__onOverlayKeydown);
  }

  __onOverlayKeydown(event) {
    const escKey = 27;
    if (!this.noCancelOnEscKey && event.keyCode === escKey) {
      this._setCanceled(true);
      this.opened = false;
    }
  }

  __dispatchEvent(eventName, {node=this, cancelable=false} = {}) {
    node.dispatchEvent(new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      cancelable,
      detail: {
        overlay: this
      }
    }));
  }

};
