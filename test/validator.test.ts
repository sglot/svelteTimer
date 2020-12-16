import * as Format from "../src/core/format";
import { AdvancedSettingsRepository } from "../src/repository/AdvancedSettingsRepository";
import { Validator } from "../src/validator/Validator";
var assert = require('assert');

describe('Validator', () => {
    it('Validate required fields', () => {
        let validator = new Validator();
        let REQUIRED: required_fields = [
            "saveHistory", 
            "autoloadSettingsConfig", 
            "progressBar", 
            "barWeight",
            "introduction"
        ];
        let pa = `{"saveHistory":{"label":"Сохранение результатов в историю","enabled":true},"autoloadSettingsConfig":{"label":"Автозагрузка сохранённой конфигурации","enabled":true},"progressBar":{"label":"Индикатор прогресса","selected":"default"},"barWeight":{"label":"Дополнительный вес в кг","value":0},"introduction":{"label":"Показывать введение","enabled":true}}`;
        let params = JSON.parse(pa) as object;
        assert.equal(true, validator.hasRequired(params, REQUIRED));
    });

    
});