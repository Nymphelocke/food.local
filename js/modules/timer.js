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