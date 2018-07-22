import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '../overlay-mixin.js';

class SampleOverlay extends OverlayMixin(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          background: #ddd;
          display: block;
          height: 200px;
          position: absolute;
          width: 200px;
        }

        :host(:focus) {
          border: 2px solid dodgerblue;
        }
      </style>

      Hello!!!
    `;
  }

  static get is() {return 'sample-overlay';}
}

customElements.define(SampleOverlay.is, SampleOverlay);
