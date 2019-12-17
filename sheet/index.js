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
            --accent: #448aff;
            --peek-calculated-height: 0;
            --peek-inverted-height: 0;
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
        }
        
        .xyz-sheet__sheet {
            position: fixed;
            left: 0; right: 0; top: 100%;
            z-index: 3;
            max-height: 100%;
            overflow: scroll;
            background-color: #272727;
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
        }
        
        .xyz-sheet__peek:focus {
            outline: 2px solid var(--accent);
            outline-offset: -2px;
        }
        
        :host > .xyz-sheet__sheet > .xyz-sheet__content {
            padding: 0 1em;
        }
        
        :host([active]) > .xyz-sheet__modal {
            opacity: .52;
            pointer-events: all;
        }
        :host([peek]) > .xyz-sheet__sheet {
            transform: translateY(var(--peek-inverted-height));
        }
        :host([active]) > .xyz-sheet__sheet {
            transform: translateY(-100%);
        }
        
        :host([peek]) {
            padding-bottom: var(--peek-calculated-height);
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
            shadow.appendChild(createModal(this, shadow))
            shadow.appendChild(createSheet(this, shadow))
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
                <slot></slot>
            </div>
        `

        const btn = sheet.querySelector('button')
        const ro = !("ResizeObserver" in window) ? null : new ResizeObserver(entries => {
            for (let entry of entries) {
                const height = `${
                    entry.contentRect.height +
                    entry.contentRect.y * 2
                }px`


                that.style.setProperty('--peek-calculated-height', height)
                that.style.setProperty('--peek-inverted-height', '-' + height)
            }
        })
            
        
        btn.addEventListener('click', function () {
            that.toggle()
        })
        
        // Listen for resize lol
        ro && ro.observe(btn)

        return sheet
    }

    function createModal(that) {
        const button = document.createElement('button')
        button.classList.add('xyz-sheet__modal')
        button.addEventListener('click', function () {
            that.toggle()
        })
        return button
    }

    return XyzSheet
});
