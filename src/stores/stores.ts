import {writable} from 'svelte/store';

var list = {
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
        state           = writable('settings'), 
        stateList       = writable(list),
        runAttempts     = writable(0),
        mute            = writable(false),
        savedSettings   = writable(makeDefaultSettings()),
        settings        = writable(makeDefaultSettings());
