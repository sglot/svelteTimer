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
  bgColor:        string,
  frontColor:     string, 
  bgLineWidth:    number,
  frontLineWidth: number
}

type advancedSettings = {
  label:          string,
  enabled?:       boolean,
  selected?:      selectedType,
  value?:         number,
}

type selectedType = progressBarType | themeType;

type progressBarType = "default" | "separated" | "tiny"

type progressBar = {
  name:           progressBarType,
  label:          string,
}

type themeType = "theme-snow" | "theme-night"

type theme = {
  name:           themeType,
  label:          string,
}

type required_fields  = readonly string[];

type ruleType         = "required";

type rules            = Record<ruleType, readonly string[]>

type history = [...historyRow];

type historyRow = {
  id:         number,
  date:       string,
  work:       number,
  relax:      number,
  laps:       number,
  success:    boolean,
  time?:      string,
  weight:     number,
  comment:    string
}