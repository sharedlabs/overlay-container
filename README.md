# overlay-container

Overlays rendered anywhere on the DOM can cause stacking order problems (overlays trapped within a z-index).

The `overlay-container` element ensures that overlays will always be rendered on the top layer.

## How to use

Just place the `overlay-container` anywhere on the DOM. (The app shell is a good place). Then use the `OverlayMixin` to create your overlays.
```html
<overlay-container></overlay-container>
```

```js
class MyOverlay extends OverlayMixin(Polymer.Element) {
  ...
}
```

#### Place your overlay anywhere you want

This way your overlay will be teleported to the `overlay-container` before is opened for the first time.

```html
<my-overlay></my-overlay>
```

#### Or use create it with javascript

I personally prefer this way if I don't need databinding. This way you make sure your overlay will be attached just once. You don't need to append your overlay manually, calling open() will place the overlay on the `overlay-container`

```js
const myOverlay = document.createElement('my-overlay');
myOverlay.open();
```
