;(function (name, root, factory) {
    // UMD: https://git.io/fjxpW
    if (typeof define !== 'undefined' && define.amd) {
        define([], factory)
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory()
    } else {
        root[name] = factory()
    }
})('XyzProgress', typeof self !== 'undefined' ? self : this, function () {

    const styles = `
        :host {
            --anim-std: cubic-bezier(0.4, 0.0, 0.2, 1);
            --progression-width: 0%;
            position: relative;
            display: block;
            margin: 1em 0;
            padding-top: .5em;
            overflow: hidden;
        }
        .xyz-progress__track {
            position: absolute;
            top: 0; left: 0; bottom: 0; right: 0;
            background-color: var(--accent, #448aff);
            opacity: .4;
        }
        .xyz-progress__bar {
            position: absolute;
            top: 0; left: 0; bottom: 0; right: 0;
            width: 0%;
            width: var(--progression-width);
            background-color: var(--accent, #448aff);
            transition: width var(--anim-std) 300ms,
                        left  var(--anim-std) 300ms;
        }

        :host(:not([value])) .xyz-progress__bar:nth-of-type(2) {
            animation: decrease 2s .5s infinite;
        }
        :host(:not([value])) .xyz-progress__bar:nth-of-type(3) {
            animation: increase 2s infinite;
        }

        @keyframes increase {
            from { left: -5%; width: 5%; }
            to { left: 130%; width: 100%; }
        }
        @keyframes decrease {
            from { left: -80%; width: 80%; }
            to { left: 110%; width: 10%; }
        }
    `

    class XyzProgress extends HTMLElement {
        constructor() {
            super()
        }

        connectedCallback() {
            // Shadow the Hedgehog for Smash
            const shadow = this.attachShadow({ mode: 'open' })

            const track = document.createElement('div')
            const bar = document.createElement('div')
            const indet = document.createElement('div')
            track.classList.add('xyz-progress__track')
            bar.classList.add('xyz-progress__bar')
            indet.classList.add('xyz-progress__bar')

            shadow.appendChild(createStyles())
            shadow.appendChild(track)
            shadow.appendChild(bar)
            shadow.appendChild(indet)
        }

        attributeChangedCallback(name, old, current) {
            if (name === 'value') {
                if (current === null) {
                    return
                }

                old = +old || 0
                current = +current || 0
    
                if (!Number.isFinite(current)) {
                    console.log(`Value wasn't finite. Setting to ${old}`)
                    this.setAttribute('value', old || 0)
                    return
                }
    
                if ((current < 0) || (1 < current)) {
                    console.log("Value wasn't between 0 and 1, clamped.")
                    const val = Math.max(0, Math.min(current, 1))
                    this.setAttribute('value', val)
                    return
                }
                this.style.setProperty('--progression-width', `${current * 100}%`)
            }
        }

        static get observedAttributes() {
            return ['value']
        }

        static register(name = 'xyz-progress') {
            customElements.define(name, XyzProgress)
        }
    }

    function createStyles() {
        const styleEl = document.createElement('style')
        styleEl.innerText = styles
        return styleEl
    }

    return XyzProgress

})
