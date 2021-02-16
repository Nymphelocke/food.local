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