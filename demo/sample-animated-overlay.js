import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '../animated-overlay-mixin.js';

class SampleAnimatedOverlay extends AnimatedOverlayMixin(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          background: #ddd;
          bottom: 0;
          display: block;
          right: 0;
          left: 0;
          position: absolute;
          top: 0;
        }

        :host(:focus) {
          border: 2px solid dodgerblue;
        }
      </style>

      Hello!!!
    `;
  }

  static get is() {return 'sample-animated-overlay';}
}

customElements.define(SampleAnimatedOverlay.is, SampleAnimatedOverlay);
