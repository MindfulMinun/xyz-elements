'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

;(function (name, root, factory) {
    // UMD: https://git.io/fjxpW
    if (typeof define !== 'undefined' && define.amd) {
        define([], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root[name] = factory();
    }
})('XyzSheet', typeof self !== 'undefined' ? self : undefined, function () {

    var styles = '\n        :host {\n            --anim-std: cubic-bezier(0.4, 0.0, 0.2, 1);\n            --accent: #448aff;\n            --peek-calculated-height: 0;\n            line-height: 1.5;\n        }\n        \n        *, *::before, *::after { box-sizing: border-box; }\n        \n        .xyz-sheet__modal {\n            position: fixed;\n            display: block;\n            top: 0; bottom: 0; left: 0; right: 0;\n            width: 100%;\n            margin: 0; padding: 0;\n            border: 0; opacity: 0;\n            background: #000;\n            transition: opacity var(--anim-std) 200ms;\n            pointer-events: none;\n        }\n        \n        .xyz-sheet__sheet {\n            position: fixed;\n            left: 0; right: 0; top: 100%;\n            z-index: 3;\n            max-height: 100%;\n            overflow: scroll;\n            background-color: #272727;\n            color: white;\n            transform: translateY(0);\n            transition: transform var(--anim-std) 200ms;\n        }\n        \n        .xyz-sheet__peek {\n            display: block;\n            position: sticky;\n            top: 0;\n            width: 100%;\n            font: inherit;\n            color: inherit;\n            text-align: inherit;\n            border: 0; padding: 0;\n            background: #fff;\n            color: #000;\n        }\n        \n        .xyz-sheet__peek {\n            border: 1px solid #000;\n            padding: 1em;\n        }\n        \n        .xyz-sheet__peek:focus {\n            outline: 2px solid var(--accent);\n            outline-offset: -2px;\n        }\n        \n        :host > .xyz-sheet__sheet > .xyz-sheet__content {\n            padding: 0 1em;\n        }\n        \n        :host([active]) > .xyz-sheet__modal {\n            opacity: .52;\n            pointer-events: all;\n        }\n        :host([peek]) > .xyz-sheet__sheet {\n            transform: translateY(var(--peek-calculated-height));\n        }\n        :host([active]) > .xyz-sheet__sheet {\n            transform: translateY(-100%);\n        }\n        \n        :host([peek]) {\n            margin-bottom: 4em;\n        }\n        \n        \n        @media only screen and (min-width: 664px) {\n            :host > .xyz-sheet__sheet {\n                width: 540px;\n                right: 2em;\n                left: auto;\n            }\n        }\n    ';

    var XyzSheet = function (_HTMLElement) {
        _inherits(XyzSheet, _HTMLElement);

        function XyzSheet() {
            _classCallCheck(this, XyzSheet);

            return _possibleConstructorReturn(this, (XyzSheet.__proto__ || Object.getPrototypeOf(XyzSheet)).call(this));
        }

        _createClass(XyzSheet, [{
            key: 'connectedCallback',
            value: function connectedCallback() {
                // Shadow the Hedgehog for Smash
                var shadow = this.attachShadow({ mode: 'open' });
                // this.classList.add('xyz-sheet')
                shadow.appendChild(createStyles(this, shadow));
                shadow.appendChild(createModal(this, shadow));
                shadow.appendChild(createSheet(this, shadow));
            }
        }, {
            key: 'open',
            value: function open() {
                this.setAttribute('active', true);
            }
        }, {
            key: 'close',
            value: function close() {
                this.removeAttribute('active');
            }
        }, {
            key: 'toggle',
            value: function toggle() {
                this.toggleAttribute('active');
            }
        }], [{
            key: 'register',
            value: function register() {
                var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'xyz-sheet';

                customElements.define(name, XyzSheet);
            }
        }, {
            key: 'observedAttributes',
            get: function get() {
                return ['peek', 'active'];
            }
        }]);

        return XyzSheet;
    }(HTMLElement);

    function createStyles() {
        var styleEl = document.createElement('style');
        styleEl.innerText = styles;
        return styleEl;
    }

    function createSheet(that, shadow) {
        var sheet = document.createElement('div');
        sheet.classList.add('xyz-sheet__sheet');

        sheet.innerHTML = '\n            <button class="xyz-sheet__peek">\n                <slot name="peek"></slot>\n            </button>\n            <div class="xyz-sheet__content">\n                <slot></slot>\n            </div>\n        ';

        var btn = sheet.querySelector('button');
        var ro = !("ResizeObserver" in window) ? null : new ResizeObserver(function (entries) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var entry = _step.value;

                    if (entry.contentRect.height === 0) {
                        btn.remove();
                    }

                    var calcdHeight = '-' + (entry.contentRect.height + entry.contentRect.y * 2) + 'px';
                    entry.contentRect.height;
                    console.log(entry);
                    that.style.setProperty('--peek-calculated-height', calcdHeight);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        });

        btn.addEventListener('click', function () {
            that.toggle();
        });

        // Listen for resize lol
        ro && ro.observe(btn);

        return sheet;
    }

    function createModal(that) {
        var button = document.createElement('button');
        button.classList.add('xyz-sheet__modal');
        button.addEventListener('click', function () {
            that.toggle();
        });
        return button;
    }

    return XyzSheet;
});