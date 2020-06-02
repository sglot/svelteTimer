import {writable} from 'svelte/store';
var list = {
    settings: 'Параметры',
    countdown: 'Обратный отсчёт',
    work: 'Нагрузка',
    relax: 'Отдых',
    pause: 'Пауза',
    end: 'Конец'
};

export 
    const 
        state = writable('settings'), 
        stateList = writable(list),
        runAttempts = writable(0),
        mute = writable(false);
