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

let progBarList: progressBar[] =
    [
        {
            name: "default",
            label: "Стандартный"
        },
        {
            name: "separated",
            label: "С отсечками"
        },
        {
            name: "tiny",
            label: "Тонкий"
        },
    ];

export let advSettings: Record<string, advancedSettings> = {
    "saveHistory":              {
        label:      "Сохранение результатов в историю",
        enabled:    true,
    },

    "autoloadSettingsConfig":   {
        label:      "Автозагрузка сохранённой конфигурации",
        enabled:    true
    },

    "progressBar":              {
        label:      "Индикатор прогресса",
        selected:   progBarList[0].name
    },
    
    "barWeight": {
        label:      "Дополнительный вес в кг",
        value:      0
    },
    "introduction": {
        label:      "Показывать введение",
        enabled:    true
    },
}


export function makeDefaultSettings(): selectableParametersConfiguration {
    return {
        workTime:   30,
        relaxTime:  30,
        laps:       3
    }
}

export 
    const 
        state                   = writable('Параметры'), 
        stateList               = writable(list),
        runAttempts             = writable(0),
        mute                    = writable(false),
        timeFromStart           = writable(0),
        savedSettings           = writable(makeDefaultSettings()),
        settings                = writable(makeDefaultSettings()),
        advancedSettings        = writable(advSettings),
        progressBarList         = writable(progBarList);
