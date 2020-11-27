type state = 'settings' | 'countdown' | 'work' | 'relax' | 'recovery' | 'pause' | 'end';

type selectableParametersConfiguration = {
    workTime:   number,
    relaxTime:  number,
    laps:       number
}

type oneLoopValues = {
    balance:    number,
    stateTime:  number,
    nextState:  string,
  };

type engine = {
    "Нагрузка":             () => void,
    "Отдых":                () => void,
    "Восстановление сил":   () => void,
    "Пауза":                () => void,
}

type circleConfig = {
    bgColor: string,
    frontColor: string, 
    bgLineWidth: number,
    frontLineWidth: number
  }