"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* ======================================================
 * XyzPlayer
 */
(function () {
    // Comment the following line for Spanish labels
    /*
    const dict = {
        scrubberA11yLabel: "Búsqueda en video",
        scrubberA11yDefault: "Cargando...",
        scrubberA11yVal: (v) => `${formatTime(v.currentTime)} de ${formatTime(v.duration)}`,
        formatNumericProgress: (v) => `${formatTime(v.currentTime)} / ${formatTime(v.duration)}`,
        numericProgressDefault: '0:00 / 0:00',
        pip: 'Pantalla\u00a0en\u00a0Pantalla',
        enterFs: 'Pantalla completa',
        exitFs: 'Salir de pantalla completa',
        pause: 'Pausar',
        play: 'Reproducir',
        forward: "Avanzar",
        rewind: "Retroceder"
    }
    /*/
    var dict = {
        scrubberA11yLabel: "Scrubber",
        scrubberA11yDefault: "Loading...",
        scrubberA11yVal: function scrubberA11yVal(v) {
            return formatTime(v.currentTime) + " out of " + formatTime(v.duration);
        },
        formatNumericProgress: function formatNumericProgress(v) {
            return formatTime(v.currentTime) + " / " + formatTime(v.duration);
        },
        numericProgressDefault: '0:00 / 0:00',
        pip: "Picture\u2011in\u2011picture",
        enterFs: 'Fullscreen',
        exitFs: "Exit\xA0Fullscreen",
        pause: 'Pause',
        play: 'Play',
        forward: "Fast\u2011forward",
        rewind: "Rewind"
        // */

    };var temp = document.createElement('template');
    temp.innerHTML = "\n        <style>\n            /* Must be defined by BOTH the host and the custom element for some reason?? */\n            @import url(\"https://fonts.googleapis.com/css?family=Material+Icons|Roboto:400,500\");\n            *, *::before, *::after {\n                box-sizing: border-box;\n            }\n            :host {\n                display: block;\n                position: relative;\n                contain: content;\n                font-family: \"Roboto\", sans-serif;\n                line-height: 1.5;\n                overflow: visible;\n                margin: 1rem;\n                font-size: 16px;\n                font-weight: 400;\n                background: #000;\n                color: #fff;\n                --accent: #448aff;\n                --tooltip-bg: #424242;\n                --scrubber-head-size: 14px;\n                --idle-scrubber-thickness: 4px;\n                --hover-scrubber-thickness: 6px;\n                --standard-curve: cubic-bezier(0.4, 0, 0.2, 1);\n            }\n            i.material-icons { display: block; }\n            video {\n                display: block;\n                margin: auto;\n                height: 100%; width: 100%;\n            }\n\n            .xyz-player {\n                display: flex;\n                min-height: 4.5rem;\n                height: 100%; width: 100%;\n            }\n\n            .xyz-controls {\n                background: linear-gradient(transparent, rgba(0,0,0, .52));\n                /* border: 1px solid blue; */\n                padding: 1.5rem 1rem;\n                padding-bottom: 0;\n                position: absolute;\n                left: 0; right: 0; bottom: 0;\n                opacity: 1;\n                transition: opacity var(--standard-curve) .2s;\n            }\n            .xyz-controls:hover .xyz-controls__scrubber__head { opacity: 1; }\n            .xyz-player--hide-controls { cursor: none; }\n            .xyz-player--hide-controls .xyz-controls { opacity: 0; }\n\n            .xyz-controls__btn {\n                position: relative;\n                cursor: pointer;\n                background: 0; border: 0; padding: 0;\n                margin: 8px;\n                min-width: 24px;\n                color: inherit;\n                outline: none;\n            }\n            .xyz-controls__btn:focus { color: var(--accent); }\n            .xyz-controls__btn[title]::after {\n                display: block;\n                opacity: 0;\n                pointer-events: none;\n                transition: opacity var(--standard-curve) .2s;\n                position: absolute;\n                content: attr(title);\n                top: 0; left: 50%;\n                transform: translate(-50%, -100%);\n                font-size: 10px;\n                /* min-width: 4.5rem; */\n                min-width: 100%;\n                text-align: center;\n                background: var(--tooltip-bg);\n                color: #fff;\n                padding: 4px 6px;\n                z-index: 10;\n            }\n            .xyz-controls__btn[title]:hover::after {\n                opacity: 1;\n            }\n            .xyz-controls__time { cursor: auto; }\n\n            .xyz-controls__scrubber {\n                display: block;\n                position: relative;\n                height: var(--idle-scrubber-thickness);\n                width: 100%;\n                /* background: rgba(255,255,255,0.52); */\n                border-radius: var(--hover-scrubber-thickness);\n                touch-action: none;\n                cursor: pointer;\n                outline: none;\n            }\n            .xyz-controls__scrubber:hover .xyz-controls__scrubber__head::after,\n            .xyz-controls__scrubber:focus .xyz-controls__scrubber__head::after {\n                opacity: 1;\n            }\n            .xyz-controls__scrubber-loaded {\n                width: 100%;\n                height: var(--idle-scrubber-thickness);\n                border-radius: var(--idle-scrubber-thickness);\n                background: rgba(255,255,255, .52);\n                position: absolute;\n                top: 0; bottom: 0; left: 0; right: 0;\n            }\n\n            .xyz-controls__scrubber__progress {\n                position: relative;\n                height: 100%;\n                background: var(--accent);\n                border-radius: var(--hover-scrubber-thickness);\n            }\n            .xyz-controls__scrubber__head {\n                position: absolute;\n                right: 0; bottom: 0;\n                opacity: 0;\n                transform: translate(50%, calc(var(--scrubber-head-size) / 2 - var(--idle-scrubber-thickness) / 2));\n                transition: opacity var(--standard-curve) .2s;\n                height: var(--scrubber-head-size); width: var(--scrubber-head-size);\n                border-radius: 50%;\n                background: var(--accent);\n            }\n            .xyz-controls__scrubber__head::after {\n                position: absolute;\n                display: block;\n                opacity: 0;\n                content: attr(data-time);\n                top: -24px; left: 50%;\n                transform: translateX(-50%);\n                background: var(--tooltip-bg);\n                font-size: 12px;\n                padding: 2px 4px;\n                transition: opacity var(--standard-curve) .2s;\n            }\n\n            .xyz-controls__btn-group { display: flex; }\n            .xyz-spacer { flex: 1 }\n        </style>\n        <div class=\"xyz-player\">\n            <video></video>\n            <div class=\"xyz-controls\">\n                <div class=\"xyz-controls__scrubber\" tabindex=\"0\" role=\"slider\"\n                    aria-label=\"" + dict.scrubberA11yLabel + "\"\n                    aria-valuetext=\"" + dict.scrubberA11yDefault + "\"\n                    draggable=\"false\"\n                    aria-valuemin=\"0\" aria-valuemax=\"0\" aria-valuenow=\"0\"\n                    style=\"touch-action: none;\">\n                    <canvas class=\"xyz-controls__scrubber-loaded\" height=\"8\"></canvas>\n                    <div class=\"xyz-controls__scrubber__progress\" style=\"width: 0%;\">\n                        <div class=\"xyz-controls__scrubber__head\"\n                            data-time=\"0:00\"></div>\n                    </div>\n                </div>\n\n                <div class=\"xyz-controls__btn-group\">\n                    <button class=\"xyz-controls__btn\"\n                        data-action=\"f-rewind\"\n                        title=\"" + dict.rewind + "\"\n                        aria-label=\"" + dict.rewind + "\">\n                        <i class=\"material-icons\">fast_rewind</i>\n                    </button>\n                    <button class=\"xyz-controls__btn\"\n                        data-action=\"pp\"\n                        title=\"" + dict.play + "\"\n                        aria-label=\"" + dict.play + "\">\n                        <i class=\"material-icons\">play_arrow</i>\n                    </button>\n                    <button class=\"xyz-controls__btn\"\n                        data-action=\"f-forward\"\n                        title=\"" + dict.forward + "\"\n                        aria-label=\"" + dict.forward + "\">\n                        <i class=\"material-icons\">fast_forward</i>\n                    </button>\n                    <span class=\"xyz-controls__btn xyz-controls__time\"\n                        aria-label=\"\">\n                        " + dict.numericProgressDefault + "\n                    </span>\n                    <div class=\"xyz-spacer\"></div>\n                    <button class=\"xyz-controls__btn\"\n                        data-action=\"pip\"\n                        title=\"" + dict.pip + "\"\n                        aria-label=\"" + dict.pip + "\">\n                        PIP\n                    </button>\n                    <button class=\"xyz-controls__btn\"\n                        data-action=\"fs\"\n                        title=\"" + dict.enterFs + "\"\n                        aria-label=\"" + dict.enterFs + "\">\n                        <i class=\"material-icons\">fullscreen</i>\n                    </button>\n                </div>\n            </div>\n        </div>\n    ";

    var init = function init(that) {
        var shadow = that.shadowRoot;

        var v = shadow.querySelector('video');
        var container = shadow.querySelector('.xyz-player');
        var controls = shadow.querySelector('.xyz-controls');
        var scrubber = shadow.querySelector('.xyz-controls__scrubber');
        var scrubberProgress = shadow.querySelector('.xyz-controls__scrubber__progress');
        var scrubberHead = shadow.querySelector('.xyz-controls__scrubber__head');
        var canvas = shadow.querySelector('.xyz-controls__scrubber-loaded');
        var ctx = canvas.getContext('2d');
        var progress = shadow.querySelector('.xyz-controls__time');

        var fr = shadow.querySelector('[data-action="f-rewind"]');
        var pp = shadow.querySelector('[data-action="pp"]');
        var ff = shadow.querySelector('[data-action="f-forward"]');
        var fs = shadow.querySelector('[data-action="fs"]');
        var pip = shadow.querySelector('[data-action="pip"]');

        that.setAttribute('tabindex', 0);

        // Hide the PIP button if the browser doesn't support it.
        shadow.querySelector('[data-action="pip"]').hidden = !document.pictureInPictureEnabled;

        // Keyboard controls
        that.addEventListener('keydown', function (e) {
            /**
             * (Space)  Play/Pause
             * <        Rewind 5 seconds
             * >        Fast-forward 5 seconds
             * 0-9      Numeric leaps (like what YouTube does)
             * f        Toggle Fullscreen
             * p        Toggle Picture-in-picture
            **/
            restartIdleTimeout();
            switch (e.key) {
                case ',': // <
                case 'Left':
                case 'ArrowLeft':
                    v.currentTime -= 5;
                    updateScrubberProgress();
                    break;
                case '.': // >
                case 'Right':
                case 'ArrowRight':
                    v.currentTime += 5;
                    updateScrubberProgress();
                    break;
                case ' ':
                    // spacebar lmao
                    v.paused ? v.play() : v.pause();
                    e.preventDefault();
                    break;
                // Numeric leaps
                case '0': // lemme
                case '1': // just
                case '2': // waste
                case '3': // some
                case '4': // space
                case '5': // for
                case '6': // no
                case '7': // particular
                case '8': // reason
                case '9':
                    // whatsoever
                    var unit = v.duration / 10;
                    v.currentTime = unit * +e.key;
                    updateScrubberProgress();
                    break;
                // Fullscreen
                case 'f':
                    getFullscreenElement() === that ? _exitFullscreen() : _enterFullscreen(that);
                    break;
                // Picture-in-picture
                case 'p':
                    if (document.pictureInPictureEnabled) {
                        !document.pictureInPictureElement ? v.requestPictureInPicture() : document.exitPictureInPicture();
                    }
                    break;
            }
        });

        that.addEventListener('mousemove', function () {
            return restartIdleTimeout();
        });

        // Video event listeners
        v.addEventListener('click', function () {
            v.paused ? v.play() : v.pause();
        });

        v.addEventListener('timeupdate', function () {
            // A11y attributes
            scrubber.setAttribute('aria-valuemax', ~~v.duration);
            scrubber.setAttribute('aria-valuenow', ~~v.currentTime);
            scrubber.setAttribute('aria-valuetext', dict.scrubberA11yVal(v));

            // Progress
            progress.textContent = dict.formatNumericProgress(v);
            updateScrubberProgress();
        });
        v.addEventListener('durationchange', function () {
            progress.textContent = dict.formatNumericProgress(v);
            // Antialiasing sucks.
            canvas.width = canvas.offsetWidth * 2;
        });
        v.addEventListener('progress', function () {
            updateScrubberProgress();
        });

        // 'play' event: (Attempt to) start playing.
        // 'playing' event: Video is definitely playing, but it may have jumped / seeked.
        v.addEventListener('play', function () {
            pp.innerHTML = "<i class=\"material-icons\">pause</i>";
            pp.setAttribute('title', dict.pause);
            pp.setAttribute('aria-label', dict.pause);
        });
        v.addEventListener('pause', function () {
            pp.innerHTML = "<i class=\"material-icons\">play_arrow</i>";
            pp.setAttribute('title', dict.play);
            pp.setAttribute('aria-label', dict.play);
        });

        // Controller event listeners
        ff.addEventListener('click', function () {
            v.currentTime += 5;
            updateScrubberProgress();
        });
        fr.addEventListener('click', function () {
            v.currentTime -= 5;
            updateScrubberProgress();
        });
        pp.addEventListener('click', function () {
            v.paused ? v.play() : v.pause();
        });
        pip.addEventListener('click', function () {
            if (document.pictureInPictureEnabled) {
                !document.pictureInPictureElement ? v.requestPictureInPicture() : document.exitPictureInPicture();
            }
        });

        scrubber.addEventListener('click', function (e) {
            var rect = scrubber.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width;
            v.currentTime = v.duration * x;
            updateScrubberProgress();
        });

        fs.addEventListener('click', function () {
            getFullscreenElement() === that ? _exitFullscreen() : _enterFullscreen(that);
        });

        var fsChangeHandler = function fsChangeHandler() {
            if (getFullscreenElement() === that) {
                // I'm in fullscreen
                fs.innerHTML = "<i class=\"material-icons\">fullscreen_exit</i>";
                fs.setAttribute('title', dict.exitFs);
                fs.setAttribute('aria-label', dict.exitFs);
            } else {
                // No longer in fullscreen
                fs.innerHTML = "<i class=\"material-icons\">fullscreen</i>";
                fs.setAttribute('title', dict.enterFs);
                fs.setAttribute('aria-label', dict.enterFs);
            }
        };

        document.addEventListener("fullscreenchange", fsChangeHandler);
        document.addEventListener("webkitfullscreenchange", fsChangeHandler);
        document.addEventListener("mozfullscreenchange", fsChangeHandler);
        document.addEventListener("MSFullscreenChange", fsChangeHandler);

        // Scrubber update
        function updateScrubberProgress() {
            // Scrubber Progress
            var ratio = v.currentTime / v.duration * 100;
            if (Number.isFinite(ratio)) {
                if (scrubberProgress.attributeStyleMap) {
                    var perc = CSS.percent(ratio);
                    scrubberProgress.attributeStyleMap.set('width', perc);
                } else {
                    scrubberProgress.style.width = ratio + '%';
                }
                scrubberHead.setAttribute('data-time', formatTime(v.currentTime));
            }
            // Loaded progress
            var unit = canvas.width / v.duration;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // ctx.fillStyle = 'rgba(255,255,255, .52)';
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(255,255,255, .72)';

            for (var i = 0; i < v.buffered.length; i++) {
                var start = v.buffered.start(i) * unit;
                var end = v.buffered.end(i) * unit;
                var delta = end - start;

                ctx.fillRect(~~start, 0, ~~delta, canvas.height);
                ctx.stroke();
            }
        }
        // Hide controls on idle
        var idleTimeout = null;
        function restartIdleTimeout() {
            clearTimeout(idleTimeout);
            container.classList.remove('xyz-player--hide-controls');
            idleTimeout = setTimeout(function () {
                container.classList.add('xyz-player--hide-controls');
            }, 3000);
        }
    };

    // Class definition

    var XyzPlayer = function (_HTMLElement) {
        _inherits(XyzPlayer, _HTMLElement);

        function XyzPlayer() {
            _classCallCheck(this, XyzPlayer);

            var _this = _possibleConstructorReturn(this, (XyzPlayer.__proto__ || Object.getPrototypeOf(XyzPlayer)).call(this));

            var shadow = _this.attachShadow({ mode: 'open' });
            shadow.appendChild(temp.content.cloneNode(true));
            return _this;
        }

        _createClass(XyzPlayer, [{
            key: "connectedCallback",
            value: function connectedCallback() {
                init(this);
            }
        }, {
            key: "attributeChangedCallback",
            value: function attributeChangedCallback(name, oldVal, newVal) {
                var shadow = this.shadowRoot;
                var v = shadow.querySelector('video');
                switch (name) {
                    case "src":
                        v.src = newVal;
                        break;
                    case "data-accent":
                        this.style.setProperty('--accent', newVal);
                        break;
                    default:
                        v[name] = newVal;
                }
            }
        }, {
            key: "enterFullscreen",

            // Exposed methods
            value: function enterFullscreen() {
                _enterFullscreen(this);
            }
        }, {
            key: "exitFullscreen",
            value: function exitFullscreen() {
                _exitFullscreen();
            }
        }, {
            key: "debug",
            value: function debug() {
                var ret = {};
                var v = this.video;

                ret.now = v.currentTime;
                ret.length = v.duration;
                ret.percComplete = v.currentTime / v.duration;
                ret.state = ['Nothing', 'Meta', 'Now', 'Future', 'End'][v.readyState];
                ret.networkState = ['Empty', 'Idle', 'Loading', 'NoSource'][v.networkState];
                ret.noOfBuffers = v.buffered.length;

                for (var i = 0; i < v.buffered.length; i++) {
                    var end = v.buffered.end(i),
                        now = v.currentTime;
                    if (now <= end) {
                        ret.lookahead = end - now;
                    }
                }
                return ret;
            }
        }, {
            key: "video",
            get: function get() {
                return this.shadowRoot.querySelector('video');
            }
        }], [{
            key: "register",
            value: function register() {
                var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'xyz-player';
                customElements.define(name, XyzPlayer);
            }
        }, {
            key: "observedAttributes",
            get: function get() {
                return ['src', 'data-accent'];
            }
        }]);

        return XyzPlayer;
    }(HTMLElement);

    // Helpers (hoisted)


    function formatTime(timeInSeconds) {
        timeInSeconds = timeInSeconds === timeInSeconds ? timeInSeconds : 0;
        var sign = Math.abs(timeInSeconds) === timeInSeconds;
        timeInSeconds = Math.abs(timeInSeconds);
        var hrs = ~~(timeInSeconds / 3600),
            mins = ~~(timeInSeconds % 3600 / 60),
            secs = ~~(timeInSeconds % 60),
            ret = ""; // just to piss everyone off

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return (sign ? '' : '-') + ret;
    }
    // Fullscreen functions
    function _enterFullscreen(el) {
        return (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen).bind(el)();
    }
    function _exitFullscreen() {
        return (document.exitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen || document.cancelFullScreen).bind(document)();
    }
    function getFullscreenElement() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement;
    }

    // Export the class
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = XyzPlayer;
    }
    this.XyzPlayer = XyzPlayer;
    // To enable the class, call XyzPlayer.register()
})();