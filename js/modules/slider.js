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