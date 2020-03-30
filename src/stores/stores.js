import {writable} from 'svelte/store';
var stateList = {
    settings: 'Параметры',
    work: 'Нагрузка',
    relax: 'Отдых',
    pause: 'Пауза',
    end: 'Конец'
};
export const state = writable('settings'), list = writable(stateList);
