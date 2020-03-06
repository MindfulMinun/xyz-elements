/* ======================================================
 * XyzPlayer
 */
(function () {
    // Comment the following line for Spanish labels
    /*
    const dict = {
        scrubberA11yLabel: "Búsqueda en video",
        scrubberA11yDefault: "Cargando...",
        scrubberA11yVal: (v) => `${a11yTime(v.currentTime)} de ${a11yTime(v.duration)}`,
        formatNumericProgress: (v) => `${formatTime(v.currentTime)} / ${formatTime(v.duration)}`,
        numericProgressDefault: '0:00 / 0:00',
        pip: 'Pantalla\u00a0en\u00a0Pantalla',
        screenshot: 'Capturar\u00a0fotograma',
        enterFs: 'Pantalla completa',
        exitFs: 'Salir de pantalla completa',
        pause: 'Pausar',
        play: 'Reproducir',
        forward: "Avanzar",
        rewind: "Retroceder",
        time: {
            hrs: 'hrs',
            mins: 'min',
            secs: 'seg'
        }
    }
    /*/
    const dict = {
        scrubberA11yLabel: "Scrubber",
        scrubberA11yDefault: "Loading...",
        scrubberA11yVal: (v) => `${a11yTime(v.currentTime)} out of ${a11yTime(v.duration)}`,
        formatNumericProgress: (v) => `${formatTime(v.currentTime)} / ${formatTime(v.duration)}`,
        numericProgressDefault: '0:00 / 0:00',
        pip: 'Picture\u2011in\u2011picture',
        screenshot: 'Screenshot',
        enterFs: 'Fullscreen',
        exitFs: 'Exit\u00a0Fullscreen',
        pause: 'Pause',
        play: 'Play',
        forward: "Fast\u2011forward",
        rewind: "Rewind",
        time: {
            hrs: 'hrs',
            mins: 'min',
            secs: 'sec'
        }
    }
    // */

    const temp = document.createElement('template')
    temp.innerHTML = `
        <style>
            /* Must be defined by BOTH the host and the custom element for some reason?? */
            @import url("https://fonts.googleapis.com/css?family=Material+Icons|Roboto:400,500");
            *, *::before, *::after {
                box-sizing: border-box;
            }
            :host {
                display: block;
                position: relative;
                contain: content;
                font-family: "Roboto", sans-serif;
                line-height: 1.5;
                overflow: visible;
                margin: 1rem;
                font-size: 16px;
                font-weight: 400;
                background: #000;
                color: #fff;
                --accent: #448aff;
                --tooltip-bg: #424242;
                --scrubber-head-size: 14px;
                --idle-scrubber-thickness: 4px;
                --hover-scrubber-thickness: 6px;
                --standard-curve: cubic-bezier(0.4, 0, 0.2, 1);
            }
            i.material-icons { display: block; }
            video {
                display: block;
                margin: auto;
                height: 100%; width: 100%;
                transition: opacity var(--standard-curve) .2s;
            }

            :host ::cue {
                color: #fff;
                background-color: rgba(0, 0, 0, 0.6);
            }

            .xyz-player {
                display: flex;
                min-height: 4.5rem;
                height: 100%; width: 100%;
            }

            .xyz-controls {
                background: linear-gradient(transparent, rgba(0,0,0, .52));
                /* border: 1px solid blue; */
                padding: 1.5rem 1rem;
                padding-bottom: 0;
                position: absolute;
                left: 0; right: 0; bottom: 0;
                opacity: 1;
                transition: opacity var(--standard-curve) .2s;
            }
            .xyz-controls:hover .xyz-controls__scrubber__head { opacity: 1; }
            .xyz-player--hide-controls { cursor: none; }
            .xyz-player--hide-controls .xyz-controls { opacity: 0; }
            .xyz-player--seeking { cursor: ew-resize; }
            .xyz-player--seeking video { opacity: .52; }

            .xyz-controls__btn {
                position: relative;
                cursor: pointer;
                background: 0; border: 0; padding: 0;
                margin: 8px;
                min-width: 24px;
                color: inherit;
                outline: none;
            }
            .xyz-controls__btn:focus { color: var(--accent); }
            .xyz-controls__btn[title]::after {
                display: block;
                opacity: 0;
                pointer-events: none;
                transition: opacity var(--standard-curve) .2s;
                position: absolute;
                content: attr(title);
                top: 0; left: 50%;
                transform: translate(-50%, -100%);
                font-size: 10px;
                /* min-width: 4.5rem; */
                min-width: 100%;
                text-align: center;
                background: var(--tooltip-bg);
                color: #fff;
                padding: 4px 6px;
                z-index: 10;
            }
            .xyz-controls__btn[title]:hover::after {
                opacity: 1;
            }
            .xyz-controls__time { cursor: auto; }

            .xyz-controls__scrubber {
                display: block;
                position: relative;
                height: var(--idle-scrubber-thickness);
                width: 100%;
                /* background: rgba(255,255,255,0.52); */
                border-radius: var(--hover-scrubber-thickness);
                touch-action: none;
                cursor: pointer;
                outline: none;
            }
            .xyz-controls__scrubber:hover .xyz-controls__scrubber__head::after,
            .xyz-controls__scrubber:focus .xyz-controls__scrubber__head::after {
                opacity: 1;
            }
            .xyz-controls__scrubber-loaded {
                width: 100%;
                height: var(--idle-scrubber-thickness);
                border-radius: var(--idle-scrubber-thickness);
                background: rgba(255,255,255, .52);
                position: absolute;
                top: 0; bottom: 0; left: 0; right: 0;
            }

            .xyz-controls__scrubber__progress {
                position: relative;
                height: 100%;
                background: var(--accent);
                border-radius: var(--hover-scrubber-thickness);
            }
            .xyz-controls__scrubber__head {
                position: absolute;
                right: 0; bottom: 0;
                opacity: 0;
                transform: translate(50%, calc(var(--scrubber-head-size) / 2 - var(--idle-scrubber-thickness) / 2));
                transition: opacity var(--standard-curve) .2s;
                height: var(--scrubber-head-size); width: var(--scrubber-head-size);
                border-radius: 50%;
                background: var(--accent);
            }
            .xyz-controls__scrubber__head::after {
                position: absolute;
                display: block;
                opacity: 0;
                content: attr(data-time);
                top: -24px; left: 50%;
                transform: translateX(-50%);
                background: var(--tooltip-bg);
                font-size: 12px;
                padding: 2px 4px;
                transition: opacity var(--standard-curve) .2s;
            }

            .xyz-controls__btn-group { display: flex; }
            .xyz-spacer { flex: 1 }
        </style>
        <div class="xyz-player">
            <video></video>
            <div class="xyz-controls">
                <div class="xyz-controls__scrubber" tabindex="0" role="slider"
                    aria-label="${dict.scrubberA11yLabel}"
                    aria-valuetext="${dict.scrubberA11yDefault}"
                    draggable="true"
                    aria-valuemin="0" aria-valuemax="0" aria-valuenow="0"
                    style="touch-action: none;">
                    <canvas class="xyz-controls__scrubber-loaded" height="8"></canvas>
                    <div class="xyz-controls__scrubber__progress" style="width: 0%;">
                        <div class="xyz-controls__scrubber__head"
                            data-time="0:00"></div>
                    </div>
                </div>

                <div class="xyz-controls__btn-group">
                    <button class="xyz-controls__btn"
                        data-action="f-rewind"
                        title="${dict.rewind}"
                        aria-label="${dict.rewind}">
                        <i class="material-icons">fast_rewind</i>
                    </button>
                    <button class="xyz-controls__btn"
                        data-action="pp"
                        title="${dict.play}"
                        aria-label="${dict.play}">
                        <i class="material-icons">play_arrow</i>
                    </button>
                    <button class="xyz-controls__btn"
                        data-action="f-forward"
                        title="${dict.forward}"
                        aria-label="${dict.forward}">
                        <i class="material-icons">fast_forward</i>
                    </button>
                    <span class="xyz-controls__btn xyz-controls__time"
                        aria-label="">
                        ${dict.numericProgressDefault}
                    </span>
                    <div class="xyz-spacer"></div>
                    <button class="xyz-controls__btn"
                        data-action="pip"
                        title="${dict.pip}"
                        aria-label="${dict.pip}">
                        PIP
                    </button>
                    <button class="xyz-controls__btn"
                        data-action="screenshot"
                        title="${dict.screenshot}"
                        aria-label="${dict.screenshot}">
                        <i class="material-icons">aspect_ratio</i>
                    </button>
                    <button class="xyz-controls__btn"
                        data-action="fs"
                        title="${dict.enterFs}"
                        aria-label="${dict.enterFs}">
                        <i class="material-icons">fullscreen</i>
                    </button>
                </div>
            </div>
        </div>
    `

    const init = function (that) {
        const shadow = that.shadowRoot

        /** @type HTMLVideoElement */
        const v = shadow.querySelector('video')
        const container = shadow.querySelector('.xyz-player')
        const controls = shadow.querySelector('.xyz-controls')
        const scrubber = shadow.querySelector('.xyz-controls__scrubber')
        const scrubberProgress = shadow.querySelector('.xyz-controls__scrubber__progress')
        const scrubberHead = shadow.querySelector('.xyz-controls__scrubber__head')
        const canvas = shadow.querySelector('.xyz-controls__scrubber-loaded')
        const ctx = canvas.getContext('2d')
        const progress = shadow.querySelector('.xyz-controls__time')

        const fr = shadow.querySelector('[data-action="f-rewind"]')
        const pp = shadow.querySelector('[data-action="pp"]')
        const screenshot = shadow.querySelector('[data-action="screenshot"]')
        const ff = shadow.querySelector('[data-action="f-forward"]')
        const fs = shadow.querySelector('[data-action="fs"]')
        const pip = shadow.querySelector('[data-action="pip"]')

        requestAnimationFrame(() => {
            v.append(...that.children)
        })

        that.setAttribute('tabindex', 0)

        // Hide the PIP button if the browser doesn't support it.
        pip.hidden = !document.pictureInPictureEnabled
        screenshot.hidden = true

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
            restartIdleTimeout()
            switch (e.key) {
                case ',': // <
                case 'Left':
                case 'ArrowLeft':
                    v.currentTime -= 5
                    updateScrubberProgress()
                    break
                case '.': // >
                case 'Right':
                case 'ArrowRight':
                    v.currentTime += 5
                    updateScrubberProgress()
                    break
                case ' ': // spacebar lmao
                    v.paused ? v.play() : v.pause()
                    e.preventDefault()
                    break
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
                case '9': // whatsoever
                    let unit = v.duration / 10
                    v.currentTime = unit * +e.key
                    updateScrubberProgress()
                    break
                // Fullscreen
                case 'f':
                    (getFullscreenElement() === that) ?
                        exitFullscreen() : enterFullscreen(that)
                    break
                // Picture-in-picture
                case 'p':
                    if (document.pictureInPictureEnabled) {
                        !document.pictureInPictureElement ?
                            v.requestPictureInPicture() : document.exitPictureInPicture()
                    }
                    break
            }
        })

        that.addEventListener('mousemove', () => restartIdleTimeout() )

        // Video event listeners
        v.addEventListener('click', function () {
            v.paused ? v.play() : v.pause()
        })

        v.addEventListener('timeupdate', function () {
            // A11y attributes
            scrubber.setAttribute('aria-valuemax', ~~v.duration)
            scrubber.setAttribute('aria-valuenow', ~~v.currentTime)
            scrubber.setAttribute('aria-valuetext',
                dict.scrubberA11yVal(v)
            )

            // Progress
            progress.textContent = dict.formatNumericProgress(v)
            updateScrubberProgress()
        })
        v.addEventListener('durationchange', function () {
            progress.textContent = dict.formatNumericProgress(v)
            screenshot.hidden = taints(v)
            // Antialiasing sucks.
            canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1)
        })
        v.addEventListener('progress', () => {
            updateScrubberProgress()
        })

        // 'play' event: (Attempt to) start playing.
        // 'playing' event: Video is definitely playing, but it may have jumped / seeked.
        v.addEventListener('play', () => {
            pp.innerHTML = `<i class="material-icons">pause</i>`
            pp.setAttribute('title', dict.pause)
            pp.setAttribute('aria-label', dict.pause)
        })
        v.addEventListener('pause', () => {
            pp.innerHTML = `<i class="material-icons">play_arrow</i>`
            pp.setAttribute('title', dict.play)
            pp.setAttribute('aria-label', dict.play)
        })

        // Controller event listeners
        ff.addEventListener('click', () => {
            v.currentTime += 5
            v.currentTime = unit * +e.key
            updateScrubberProgress()
        })
        fr.addEventListener('click', () => {
            v.currentTime -= 5
            updateScrubberProgress()
        })
        pp.addEventListener('click', () => {
            v.paused ? v.play() : v.pause()
        })
        pip.addEventListener('click', () => {
            if (document.pictureInPictureEnabled) {
                !document.pictureInPictureElement ?
                    v.requestPictureInPicture() : document.exitPictureInPicture()
            }
        })
        screenshot.addEventListener('click', () => {
            const c = document.createElement('canvas')
            const a = document.createElement('a')
            const ctx = c.getContext('2d')
                ;
        
            [c.height, c.width] = [v.videoHeight, v.videoWidth]
            
            ctx.drawImage(v, 0, 0, c.width, c.height)
            a.href = c.toDataURL()
            
            document.body.appendChild(a)
            a.setAttribute('download', 'frame.png')
            a.click()
            document.body.removeChild(a)
        })

        scrubber.addEventListener('click', e => {
            var rect = scrubber.getBoundingClientRect()
            var x = (e.clientX - rect.left) / rect.width
            v.currentTime = v.duration * x
            updateScrubberProgress()
        })

        let stateBeforeScrub = null
        scrubber.addEventListener('dragstart', e => {
            const img = new Image()
            img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
            e.dataTransfer.setDragImage(img, 20, 20)
            e.dataTransfer.effectAllowed = 'none'
        })
        scrubber.addEventListener('drag', e => {
            if (!stateBeforeScrub) {
                stateBeforeScrub = v.paused ? 'paused' : 'playing'
                v.pause()
            }
            container.classList.add('xyz-player--seeking')
            // After dragging, the drop position is set to to zero for some reason.
            // Just assume the scrubber isn't in the top left corner and ignore (0, 0)
            if (e.screenX + e.screenY + e.clientX + e.clientY !== 0) {
                var rect = scrubber.getBoundingClientRect()
                var x = (e.clientX - rect.left) / rect.width
                v.currentTime = v.duration * x
                updateScrubberProgress(x)
            }
            restartIdleTimeout()
        }, { passive: true })
        scrubber.addEventListener('dragend', e => {
            var rect = scrubber.getBoundingClientRect()
            var x = (e.clientX - rect.left) / rect.width
            v.currentTime = v.duration * Math.min(Math.max(x, 0), 1)

            container.classList.remove('xyz-player--seeking')
            updateScrubberProgress()
            restartIdleTimeout()
            if (stateBeforeScrub === 'playing') {
                v.play()
            }
            stateBeforeScrub = null
        })

        fs.addEventListener('click', () => {
            (getFullscreenElement() === that) ? exitFullscreen() : enterFullscreen(that)
        })

        let fsChangeHandler = function () {
            if (getFullscreenElement() === that) {
                // I'm in fullscreen
                fs.innerHTML = `<i class="material-icons">fullscreen_exit</i>`
                fs.setAttribute('title', dict.exitFs)
                fs.setAttribute('aria-label', dict.exitFs)
            } else {
                // No longer in fullscreen
                fs.innerHTML = `<i class="material-icons">fullscreen</i>`
                fs.setAttribute('title', dict.enterFs)
                fs.setAttribute('aria-label', dict.enterFs)
            }
        }
        
        that.updateMediaAttributes()

        document.addEventListener("fullscreenchange", fsChangeHandler)
        document.addEventListener("webkitfullscreenchange", fsChangeHandler)
        document.addEventListener("mozfullscreenchange", fsChangeHandler)
        document.addEventListener("MSFullscreenChange", fsChangeHandler)

        // Scrubber update
        function updateScrubberProgress(linearinterop) {
            // Scrubber Progress
            
            if (v.seeking && !linearinterop) { return }
            linearinterop = (linearinterop * v.duration) || v.currentTime

            let ratio = linearinterop / v.duration * 100
            if (Number.isFinite(ratio)) {
                if (scrubberProgress.attributeStyleMap) {
                    let perc = CSS.percent(ratio)
                    scrubberProgress.attributeStyleMap.set('width', perc)
                } else {
                    scrubberProgress.style.width = ratio + '%'
                }
                scrubberHead.setAttribute('data-time', formatTime(v.currentTime))
            }
            // Loaded progress
            var unit = canvas.width / v.duration
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // ctx.fillStyle = 'rgba(255,255,255, .52)';
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(255,255,255, .72)'

            for (var i = 0; i < v.buffered.length; i++) {
                var start = v.buffered.start(i) * unit
                var end = v.buffered.end(i) * unit
                var delta = end - start

                ctx.fillRect(~~start, 0, ~~delta, canvas.height)
                ctx.stroke()
            }
        }
        // Hide controls on idle
        let idleTimeout = null
        function restartIdleTimeout() {
            clearTimeout(idleTimeout)
            container.classList.remove('xyz-player--hide-controls')
            idleTimeout = setTimeout(function () {
                container.classList.add('xyz-player--hide-controls')
            }, 3000)
        }
    }

    // Class definition
    class XyzPlayer extends HTMLElement {
        constructor() {
            super()
            let shadow = this.attachShadow({ mode: 'open' })
            shadow.appendChild(temp.content.cloneNode(true))
        }
        connectedCallback() {
            init(this)
        }
        attributeChangedCallback(name, oldVal, newVal) {
            var shadow = this.shadowRoot
            var v = shadow.querySelector('video')
            switch (name) {
                case "src":
                    v.src = newVal
                    break
                case "data-accent":
                    this.style.setProperty('--accent', newVal)
                    break
                case "poster":
                    v.setAttribute('poster', newVal)
                    this.updateMediaAttributes()
                    break
                default:
                    v[name] = newVal
            }
        }
        static get observedAttributes() { return ['src', 'poster', 'data-accent', 'data-media'] }
        get video() { return this.shadowRoot.querySelector('video') }
        // Exposed methods
        enterFullscreen() { enterFullscreen(this) }
        exitFullscreen() { exitFullscreen() }
        debug() {
            let ret = {}
            let v = this.video

            ret.now = v.currentTime
            ret.length = v.duration
            ret.percComplete = v.currentTime / v.duration
            ret.state = ['Nothing', 'Meta', 'Now', 'Future', 'End'][v.readyState]
            ret.networkState = ['Empty', 'Idle', 'Loading', 'NoSource'][v.networkState]
            ret.noOfBuffers = v.buffered.length

            for (var i = 0; i < v.buffered.length; i++) {
                let end = v.buffered.end(i)
                ,   now = v.currentTime
                ;
                if (now <= end) {
                    ret.lookahead = end - now;
                }
            }
            return ret
        }
        updateMediaAttributes() {
            if ('mediaSession' in navigator) {
                const obj = {}
                const ms = navigator.mediaSession
    
                if (this.video.getAttribute('poster')) {
                    Object.assign(obj, {
                        artwork: [{
                            sizes: '320x180',
                            src: this.video.getAttribute('poster'),
                            type: ''
                        }]
                    })
                }
                if (this.dataset.media) {
                    Object.assign(obj, JSON.parse(this.dataset.media))
                }
                ms.metadata = new MediaMetadata(obj)
                ms.setActionHandler('seekforward', () => this.video.currentTime += 5)
                ms.setActionHandler('seekbackward', () => this.video.currentTime -= 5)
            }
        }
        static register(name = 'xyz-player') { customElements.define(name, XyzPlayer) }
    }

    // Helpers (hoisted)
    function formatTime(seconds) {
        const chunks = timeToChunks(seconds)
        let ret = ""

        if (chunks.hrs > 0) {
            ret += chunks.hrs + ":" + (chunks.mins < 10 ? "0" : "")
        }
        ret += chunks.mins + ":" + (chunks.secs < 10 ? "0" : "")
        ret += chunks.secs
        return (chunks.sign === '+' ? '' : '-') + ret
    }
    function timeToChunks(timeInSeconds) {
        timeInSeconds = (timeInSeconds === timeInSeconds) ? timeInSeconds : 0
        var sign = Math.abs(timeInSeconds) === timeInSeconds
        timeInSeconds = Math.abs(timeInSeconds)
        var hrs  = ~~(timeInSeconds / 3600)
        ,   mins = ~~((timeInSeconds % 3600) / 60)
        ,   secs = ~~(timeInSeconds % 60)
        ,   out  = {}
        ;   // just to piss everyone off

        out.hrs = hrs
        out.mins = mins
        out.secs = secs
        out.sign = (sign ? '+' : '-')
        return out
    }
    function a11yTime(seconds) {
        const chunks = timeToChunks(seconds)
        let out = ''
        if (chunks.hrs > 0) {
            out += `${chunks.hrs} ${dict.time.hrs} `
        }
        out += `${chunks.mins} ${dict.time.mins} `
        out += `${chunks.secs} ${dict.time.secs}`
        return out
    }
    function taints(video) {
        try {
            const c = document.createElement('canvas')
            const x = c.getContext('2d')
            ;[c.height, c.width] = [video.videoHeight, video.videoWidth];
            x.drawImage(video, 0, 0, 10, 10)
            const p = x.getImageData(0, 0, c.height, c.width)
            return false
        } catch (err) {
            return (err.code === 18)
        }
    }
    // Fullscreen functions
    function enterFullscreen(el) {
        return (
            el.requestFullscreen ||
            el.webkitRequestFullscreen ||
            el.mozRequestFullScreen ||
            el.msRequestFullscreen
        ).bind(el)()
    }
    function exitFullscreen() {
        return (
            document.exitFullscreen ||
            document.webkitCancelFullScreen ||
            document.mozCancelFullScreen ||
            document.msExitFullscreen ||
            document.cancelFullScreen
        ).bind(document)()
    }
    function getFullscreenElement() {
        return (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement ||
            document.webkitFullscreenElement
        )
    }

    // Export the class
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = XyzPlayer
    }
    this.XyzPlayer = XyzPlayer
    // To enable the class, call XyzPlayer.register()
}());
