import './overlay-mixin.js';

/**
 * @mixin
 * @polymer
 */
window.AnimatedOverlayMixin = subclass => class extends OverlayMixin(subclass) {

  static get properties() {
    return {

      openAnimationConfig: {
        type: Object,
        value: _ => {
          return {
            keyframes: [
              {opacity: 0, transform: 'translateY(100px)'}, 
              {opacity: 1, transform: 'translateY(0)'}               
            ],
            options: {
              duration: 225,
              easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
              fill: 'forwards'
            }
          };
        } 
      },

      closeAnimationConfig: {
        type: Object,
        value: _ => {
          return {
            keyframes: [
              {opacity: 1, transform: 'translateY(0)'},     
              {opacity: 0, transform: 'translateY(100px)'}             
            ],
            options: {
              duration: 300,
              easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
              fill: 'forwards'
            }
          };
        }
      }

    };
  }

  _openedChanged(opened, old) {
    super._openedChanged(opened, old);
    if (opened) {
      this.__animateIn();
    } else if (old) {
      this.__animateOut();
    }
  }

  __animateIn() {
    this.__beforeAnimate();
    requestAnimationFrame(_ => {
      const config = this.openAnimationConfig;
      this.__animation = this.animate(config.keyframes, config.options);
      this.__animation.onfinish = _ => {
        this.__afterAnimate();
        this.dispatchEvent(new CustomEvent('overlay-open-animation-finish', {
          bubbles: true,
          composed: true
        }));
      };
    });
  }

  __animateOut() {
    this.style.display = '';
    this.__beforeAnimate();
    requestAnimationFrame(_ => {
      const config = this.closeAnimationConfig;
      this.__animation = this.animate(config.keyframes, config.options);
      this.__animation.onfinish = _ => {
        this.__afterAnimate();
        this.remove();

        this.dispatchEvent(new CustomEvent('overlay-close-animation-finish', {
          bubbles: true,
          composed: true
        }));
      };
    });
  }

  __beforeAnimate() {
    document.body.style.overflow = 'hidden';
    this.style.willChange = 'transform';
  }

  __afterAnimate() {
    document.body.style.overflow = '';
    this.style.willChange = '';
    this.__animation = null;
  }
};
