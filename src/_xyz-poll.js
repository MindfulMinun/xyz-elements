/* ======================================================
 * XyzPoll
 */
(function() {
    const temp = document.createElement('template');
    temp.innerHTML = `
        <style>
            :host {
                display: block;
                border: 1px solid red;
                padding: 1rem;
            }
            .poll__title {
                font-weight: 500;
                margin: 0;
                margin-bottom: .5rem;
            }
            .poll__options {
                padding-left: 1rem;
            }
            .poll__options .poll__option {
                display: block;
            }
            p { margin: 0; }
        </style>
        <h3 class="poll__title">Poll: Dogs or cats?</h3>
        <div class="poll__options">
            <label class="poll__option">
                <input type="radio" name="XyzPoll"> Dogs
            </label>
            <label class="poll__option">
                <input type="radio" name="XyzPoll"> Cats
            </label>
        </div>
        <button class="poll__submit">Submit</button>
    `;
    class XyzPoll extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({mode: 'open'});
            shadow.appendChild(temp.content.cloneNode(true));

            var submit = shadow.querySelector('.poll__submit');
            submit.addEventListener('click', function () {
                var options = Array.from(shadow.querySelectorAll('.poll__option input[type="radio"]'));
                options.forEach(function (el) {
                    el.disabled = true;
                });
                this.disabled = true;
                this.insertAdjacentHTML('afterEnd', "<p>Thanks for voting!</p>");
            });
        }
    }
    customElements.define('xyz-poll', XyzPoll);
}());
