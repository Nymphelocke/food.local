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