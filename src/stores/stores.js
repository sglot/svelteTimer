import {writable} from 'svelte/store';
var list = {
    settings: 'Параметры',
    work: 'Нагрузка',
    relax: 'Отдых',
    pause: 'Пауза',
    end: 'Конец'
};

export const state = writable('settings'), stateList = writable(list);
