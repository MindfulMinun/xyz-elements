# xyz-player

## In the browser
```html
<script src="/path/to/xyz-player.js"></script>
<script>
    // XyzPlayer gets defined in the global namespace.
    // Use .register or customElements.define(name, XyzPlayer)
    // to register the element.
    // Registered as "xyz-player" by default, pass a string
    // to name the element something else (must contain a hyphen)
    XyzPlayer.register();
</script>

<!-- ... -->

<xyz-player src="/path/to/my-vid.mp4"></xyz-player>
```

## CommonJS
```js
const XyzPlayer = require('/path/to/xyz-player.js');
// XyzPlayer is the inert, unregistered class
// Use .register or customElements.define(name, XyzPlayer)
// to register the element.
// Registered as "xyz-player" by default, pass a string
// to name the element something else (must contain a hyphen)
XyzPlayer.register();

// ...

const player = document.createElement('xyz-player');
player.setAttribute('src', '/path/to/my-vid.mp4');
```

## API
```js
// Reference to the video element. Pretty much
// everything can be done with this reference.
XyzPlayer.video;

// Sets the src
XyzPlayer.setAttribute('src', '/path/to/my-vid.mp4');

// So does this
XyzPlayer.video.src = 'path/to/my-vid.mp4';

// Sets the accent of the various controls. Default is #448AFF
XyzPlayer.setAttribute('data-accent', '#FF0000');

// So does this
XyzPlayer.style.setProperty('--accent', '#FF0000');

```

```html
<xyz-player
    src="/path/to/my-vid.mp4"
    data-accent="#FF0000"
    style="--accent: #FF0000"
></xyz-player>
<!--
 * src: The video source
 * data-accent: The color of the various controls. Default is #448AFF
 * Accent can also be changed with the --accent CSS variable
 * The <xyz-player> tag doesn't currently handle <slot>
!-->
```
