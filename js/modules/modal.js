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