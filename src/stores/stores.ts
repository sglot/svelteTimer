import {writable} from 'svelte/store';

let list: {[K in state]: string} = {
    settings:   'Параметры',
    countdown:  'Обратный отсчёт',
    work:       'Нагрузка',
    relax:      'Отдых',
    recovery:   'Восстановление сил',
    pause:      'Пауза',
    end:        'Конец'
};


export function makeDefaultSettings(): selectableParametersConfiguration {
    return {
        workTime:   30,
        relaxTime:  30,
        laps:       3
    }
}

export 
    const 
        state           = writable('Параметры'), 
        stateList       = writable(list),
        runAttempts     = writable(0),
        mute            = writable(false),
        timeFromStart   = writable(0),
        savedSettings   = writable(makeDefaultSettings()),
        settings        = writable(makeDefaultSettings());
