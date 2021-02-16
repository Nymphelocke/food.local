/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((module) => {

function calc() {
    const c_result = document.querySelector('.calculating__result span');

    let height, weight, age,
        sex,
        ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex')
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female')
    }

    if (localStorage.getItem('ratio')) {
        sex = localStorage.getItem('ratio')
    } else {
        sex = 1375;
        localStorage.setItem('ratio', 1375)
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(`${selector} div`);

        elements.forEach(item => {
            item.classList.remove(activeClass);
            if (item.getAttribute('id') === localStorage.getItem('sex')) {
                item.classList.add(activeClass)
            }
            if (item.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                item.classList.add(activeClass)
            }
        })
    }

    initLocalSettings('#gender', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big', 'calculating__choose-item_active')

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            c_result.textContent = '####'
            return;
        }
        if (sex === 'female') {
            c_result.textContent = Math.round(((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio)).toString()
        } else {
            c_result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio).toString()
        }
    }

    calcTotal();

    function getStaticInfo(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`)

        elements.forEach(item => {
            item.addEventListener('click', (event) => {
                if (event.target.getAttribute('data-ratio')) {
                    ratio = +event.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +event.target.getAttribute('data-ratio'))
                } else {
                    sex = event.target.getAttribute('id');
                    localStorage.setItem('sex', event.target.getAttribute('id'))
                }

                elements.forEach(item => {
                    item.classList.remove(activeClass)
                })
                event.target.classList.add(activeClass);
                calcTotal();
            })
        })
    }

    getStaticInfo('#gender', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red'
            } else {
                input.style.border = 'none'
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        })
    }

    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');
}

module.exports = calc;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

function cards() {

    class Card {
        constructor(bgImgUrl, alt, subtitle, desc, price, parentDiv, ...classes) {
            this.bgImg = bgImgUrl;
            this.alt = alt;
            this.subtitle = subtitle;
            this.desc = desc;
            this.price = price;
            this.classes = classes; // array
            this.parentDiv = document.querySelector(parentDiv).firstElementChild;
        }

        addToPage() {
            let newCard = document.createElement('div');
            if (this.classes.length === 0) this.classes.push('menu__item');
            this.classes.forEach(className => {
                newCard.classList.add(className)
            });
            newCard.innerHTML = `
                <img src="${this.bgImg}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.subtitle}</h3>
                <div class="menu__item-descr">${this.desc}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `
            this.parentDiv.append(newCard)
        }
    }

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new Card(img, altimg, title, descr, price, '.menu__field').addToPage();
            })
        })

}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms() {
    const forms = document.querySelectorAll('form');

    const messages = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    }

    forms.forEach(item => {
        bindPostData(item)
    })

    // async/await

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: data
        });

        return await res.json();
    }

    // отправка без перезагрузки
    function bindPostData(form) {
        form.addEventListener('submit', (event) => {
            // убираем стандартное поведение перезагрузки
            event.preventDefault();

            // создаем доп блок
            const statusMessage = document.createElement('img');
            statusMessage.src = messages.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form); // создаем объект для работы с формами

            const jsonData = JSON.stringify(Object.fromEntries(formData.entries()))

            postData('http://localhost:3000/requests', jsonData)
                .then(data => {
                    console.log(data);
                    showThanksModal(messages.success);
                    statusMessage.remove()
                })
                .catch(() => {
                    showThanksModal(messages.failure)
                })
                .finally(() => {
                    form.reset();
                })
        })
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide'); // скрываем контент
        openModal(); // еще раз открываем

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>&times;</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }
}

module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

function modal() {

    const modalWindow = document.querySelector('.modal');
    const offerButtons = document.querySelectorAll('[data-modal]');

    offerButtons.forEach((item) => {
        item.addEventListener('click', openModal)
    })

    function openModal() {
        modalWindow.classList.remove('hide');
        modalWindow.classList.add('show');
        document.body.style.overflow = 'hidden'; // убираем прокрутку
        clearInterval(modalTimerId); // очищаем таймер
        window.removeEventListener('scroll', showModalByScroll); // убираем показ по скроллу
    }

    function closeModal() {
        modalWindow.classList.add('hide');
        modalWindow.classList.remove('show');
        document.body.style.overflow = ''; // возвращаем прокрутку
    }

    // закрытие на клики вне области окна ли по клику на крестик
    modalWindow.addEventListener('click', (event) => {
        if (event.target === modalWindow || event.target.getAttribute('data-close') === '') {
            closeModal();
        }
    })

    // закрытие по нажатии клавиши ESC
    document.addEventListener('keydown', (event) => {
        // console.log(event.code) // вывод кнопки которая нажимается
        if (event.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModal()
        }
    })

    // таймер открытия модального окна
    const modalTimerId = setTimeout(openModal, 50000);

    // показ окна по прокрутке
    function showModalByScroll() {
        // window.pageYOffset - сколько пикселей прокручено
        // document.documentElement.clientHeight - высота экрана
        // document.documentElement.scrollHeight - высота прокрутки в пикселях
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll); // убираем обработчик после первого показа
        }
    }

    // открытие модального окна по достижении конца страницы
    window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

function slider() {
    const Slider = {
        mainDiv: document.querySelector('.offer__slider'),
        prevBtn: document.querySelector('.offer__slider-prev'),
        nextBtn: document.querySelector('.offer__slider-next'),
        counter: document.querySelector('#current'),
        imageBox: document.querySelector('#slider-image'),
        dots: '',
        imagesUrl: [
            'img/slider/pepper.jpg',
            'img/slider/food-12.jpg',
            'img/slider/olive-oil.jpg',
            'img/slider/paprika.jpg'
        ],
        position: 0,
        sliderInit: function () {
            this.imageBox.src = this.imagesUrl[this.position]
        },
        slideChanger: function (slide_id) {
            if (slide_id > 3) slide_id = 0;
            if (slide_id < 0) slide_id = 3;
            this.position = slide_id;
            this.setActiveDot(slide_id);
            this.counter.innerHTML = '0' + (slide_id + 1).toString();
            this.imageBox.src = this.imagesUrl[slide_id]
        },
        sliderButtonsInit: function () {
            this.prevBtn.addEventListener('click', () => {
                this.slideChanger(this.position - 1)
            });
            this.nextBtn.addEventListener('click', () => {
                this.slideChanger(this.position + 1)
            });
        },
        sliderNavigation: function () {
            this.mainDiv.style.position = 'relative';
            const indicators = document.createElement('ol');
            indicators.classList.add('carousel-indicators');
            this.mainDiv.append(indicators)
            for (let i = 0; i < this.imagesUrl.length; i++) {
                const dot = document.createElement('li');
                dot.setAttribute('data-slide', i.toString());
                dot.classList.add('dot');
                if (i === 0) dot.style.opacity = '1';
                indicators.append(dot);
            }
            this.dots = document.querySelectorAll('[data-slide]');
            this.dots.forEach((elem, key) => {
                elem.addEventListener('click', () => {
                    this.slideChanger(key);
                })
            })
        },
        setActiveDot: function (elem_id) {
            this.dots.forEach(item => {
                item.style.opacity = '.5';
            })
            this.dots[elem_id].style.opacity = '1';
        },
        sliderStart: function () {
            this.sliderNavigation();
            this.sliderInit();
            this.sliderButtonsInit();
            setInterval(() => {
                this.slideChanger(this.position + 1)
            }, 7000)
        }
    }
    Slider.sliderStart();
}

module.exports = slider;

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs() {

    const tabs = document.querySelectorAll('.tabheader__item')
    const tabsContent = document.querySelectorAll('.tabcontent')
    const tabsParent = document.querySelector('.tabheader__items')

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide')
            item.classList.remove('show', 'fade')
        })
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active')
        })
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade')
        tabsContent[i].classList.remove('hide')
        tabs[i].classList.add('tabheader__item_active')
    }

    hideTabContent()
    showTabContent()

    tabsParent.addEventListener('click', (event) => {
        const target = event.target

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target === item) {
                    hideTabContent()
                    showTabContent(i)
                }
            })
        }
    })
}

module.exports = tabs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer() {

    const deadline = '2021-03-28 13:00';

    function getTimeRemaining(deadline) {

        const t = Date.parse(deadline) - Date.parse(new Date()); // return ms
        let days = Math.floor(t / (1000 * 60 * 60 * 24));
        let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((t / 1000 / 60) % 60);
        const seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }

    // ADD ZEROES - TYPE 2
    function getZero(num) {
        if (num < 10 && num >= 0) {
            return `0${num}`
        } else {
            return num
        }
    }

    function setClock(selector, deadline) {

        const timer = document.querySelector(selector);
        const days = timer.querySelector('#days');
        const hours = timer.querySelector('#hours');
        const minutes = timer.querySelector('#minutes');
        const seconds = timer.querySelector('#seconds');
        const timeInterval = setInterval(updateClock, 1000);

        updateClock(); // перебиваем дефолтные значения при загрузке страницы

        function updateClock() {
            const t = getTimeRemaining(deadline);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
                document.querySelector('.timer').remove();
                document.querySelector('#timerTitle').innerHTML = 'Акция завершена!';

            }
        }
    }

    setClock('.timer', deadline)
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./js/index.js ***!
  \*********************/
window.addEventListener('DOMContentLoaded', () => {
    const
        tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
        modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
        timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js"),
        slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js"),
        forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
        cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
        calc = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js");

    tabs();
    modal();
    timer();
    slider();
    forms();
    cards();
    calc();
})
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map