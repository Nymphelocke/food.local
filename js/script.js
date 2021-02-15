window.addEventListener('DOMContentLoaded', () => {

    // TABS

    const tabs = document.querySelectorAll('.tabheader__item');
    const tabsContent = document.querySelectorAll('.tabcontent');
    const tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        })
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active')
        })
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide')
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i)
                }
            })
        }
    })

    // TIMER

    const deadline = '2021-03-28 13:00';

    function getTimeRemaining(deadline) {

        const t = Date.parse(deadline) - Date.parse(new Date()); // return ms
        let days = Math.floor(t / (1000 * 60 * 60 * 24)); // округление
        let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((t / 1000 / 60) % 60);
        const seconds = Math.floor((t / 1000) % 60);

        // ADD ZEROES - TYPE 1
        // if (days < 10) {
        //     days = '0' + days;
        // }
        // if (hours < 10) {
        //     hours = '0' + hours
        // }

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        } // return object
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

    // MODAL

    // TYPE 1 - VIA JS SELECTOR

    // const modal = document.querySelector('.modal');
    // const modalClose = document.querySelector('.modal__close');
    // const secondOfferButton = document.querySelector('.header__right-block').parentNode;
    // const offerButton = document.querySelector('.offer__action').parentNode;
    //
    // modalClose.addEventListener('click', () => {
    //     modal.style.display = 'none';
    // })
    //
    // secondOfferButton.addEventListener('click', () => {
    //     modal.style.display = 'block';
    // })
    //
    // offerButton.addEventListener('click', () => {
    //     modal.style.display = 'block';
    // })

    // TYPE 2 - VIA DATA SELECTOR IN HTML
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

    // закрытие по кнопке

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

    // Карточки
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

    // const getResource = async () => {
    //     const res = await fetch('http://localhost:3000/menu');
    //
    //     if (!res.ok) {
    //         throw new Error(`Fetch to ${url} failed, status: ${res.status}`);
    //     }
    //
    //     return await res.json();
    // }

    // using axios
    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new Card(img, altimg, title, descr, price, '.menu__field').addToPage();
            })
        })

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

    // slider practice
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
                if (i == 0) dot.style.opacity = 1;
                indicators.append(dot);
            }
            this.dots = document.querySelectorAll('[data-slide]');
            this.dots.forEach((elem, key) => {
                elem.addEventListener('click', (event) => {
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

})