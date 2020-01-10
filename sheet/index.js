;(function (name, root, factory) {
    // UMD: https://git.io/fjxpW
    if (typeof define !== 'undefined' && define.amd) {
        define([], factory)
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory()
    } else {
        root[name] = factory()
    }
})('XyzSheet', typeof self !== 'undefined' ? self : this, function () {

    const styles = `
        :host {
            --anim-std: cubic-bezier(0.4, 0.0, 0.2, 1);
            --content-height: 0;
            --peek-height: 0;
            display: block;
        }
        
        .xyz-sheet__modal {
            position: fixed;
            display: block;
            top: 0; bottom: 0; left: 0; right: 0;
            width: 100%;
            margin: 0; padding: 0;
            border: 0; opacity: 0;
            background: #000;
            transition: opacity var(--anim-std) 200ms;
            pointer-events: none;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
        }
        
        .xyz-sheet__sheet {
            position: fixed;
            left: 0; right: 0; top: 100%;
            opacity: 1;
            z-index: 3;
            max-height: 100%;
            overflow: scroll;
            color: white;
            transform: translateY(0);
            transition: transform var(--anim-std) 200ms;
        }
        
        .xyz-sheet__peek {
            display: block;
            position: sticky;
            top: 0;
            width: 100%;
            font: inherit;
            color: inherit;
            text-align: inherit;
            border: 0; padding: 0;
            background: #fff;
            color: #000;
        }
        
        .xyz-sheet__peek {
            border: 1px solid #000;
            padding: 1em;
            transition: background var(--anim-std) 200ms;
        }
        
        .xyz-sheet__peek:focus,
        :host:focus .xyz-sheet__peek {
            outline: 2px solid var(--accent, #448aff);
            outline-offset: -2px;
            background-color: #EEEEEE;
        }
        
        :host > .xyz-sheet__sheet > .xyz-sheet__content {
            background-color: #272727;
            transition: opacity var(--anim-std) 200ms;
            display: inline-block;
            opacity: 0;
            padding: 0 1em;
        }
        
        :host([active]) > .xyz-sheet__modal {
            opacity: .52;
            pointer-events: all;
        }
        :host([active]) > .xyz-sheet__modal:focus {
            opacity: .72;
        }
        :host([peek]) > .xyz-sheet__sheet {
            transform: translateY(var(--peek-height));
        }
        :host([active]) > .xyz-sheet__sheet {
            transform: translateY(-100%);
        }
        :host([active]) > .xyz-sheet__sheet > .xyz-sheet__content {
            opacity: 1;
        }
        
        :host([peek]) {
            padding-bottom: var(--peek-height);
        }
        
        
        @media only screen and (min-width: 664px) {
            :host > .xyz-sheet__sheet {
                width: 540px;
                right: 2em;
                left: auto;
            }
        }
    `;


    class XyzSheet extends HTMLElement {
        constructor() {
            super()
        }
        
        connectedCallback() {
            // Shadow the Hedgehog for Smash
            const shadow = this.attachShadow({ mode: 'open' })
            // this.classList.add('xyz-sheet')
            shadow.appendChild(createStyles(this, shadow))
            shadow.appendChild(createSheet(this, shadow))
            shadow.appendChild(createModal(this, shadow))

            const parent = (document.head || document.documentElement)

            if (parent) {
                const styles = document.createElement('style');
                styles.innerHTML = `
                    .xyz-sheet__body-stop-scrolling {
                        overflow: hidden;
                    }
                `;
                document.body.appendChild(styles);
            }
        }

        open() {
            this.setAttribute('active', true)
        }
        close() {
            this.removeAttribute('active')
        }
        toggle() {
            this.toggleAttribute('active')
        }

        attributeChangedCallback(name, oldVal, newVal) {
            if (name === 'active') {
                if (typeof newVal === 'string') {
                    document.body.classList.add('xyz-sheet__body-stop-scrolling')
                } else {
                    document.body.classList.remove('xyz-sheet__body-stop-scrolling')
                }
            }
        }

        static get observedAttributes() {
            return ['peek', 'active']
        }

        static register(name = 'xyz-sheet') {
            customElements.define(name, XyzSheet)
        }
    }

    function createStyles() {
        const styleEl = document.createElement('style')
        styleEl.innerText = styles
        return styleEl
    }

    function createSheet(that, shadow) {
        const sheet = document.createElement('div')
        sheet.classList.add('xyz-sheet__sheet')

        sheet.innerHTML = `
            <button class="xyz-sheet__peek">
                <slot name="peek"></slot>
            </button>
            <div class="xyz-sheet__content">
                <slot name="content"></slot>
            </div>
        `

        let prevPeekHeight = 58
        
        const ro = !("ResizeObserver" in window) ? null : new ResizeObserver(entries => {
            for (let entry of entries) {
                resize(that, sheet, btn)
            }
        })

        const btn = sheet.querySelector('button')
            
        
        btn.addEventListener('click', function () {
            that.toggle()
        })
        
        // Listen for resize lol
        ro && ro.observe(sheet)

        resize(that, sheet, btn)

        requestAnimationFrame(function () {
            console.log(sheet)
            sheet.classList.add('xyz-sheet--ready')
        })

        return sheet
    }

    function createModal(that) {
        const button = document.createElement('button')
        button.classList.add('xyz-sheet__modal')
        button.setAttribute('aria-label', 'Close')
        button.addEventListener('click', function () {
            that.toggle()
            document.activeElement.blur()
        })
        return button
    }

    function resize(that, sheet, btn) {
        const sheetHeight = sheet.getBoundingClientRect().height
        const btnHeight = btn.getBoundingClientRect().height


        that.style.setProperty(
            '--peek-height',
            `${-btnHeight}px`
        )

        that.style.setProperty(
            '--content-height',
            `${sheetHeight - btnHeight}px`
        )
    }

    return XyzSheet
});
