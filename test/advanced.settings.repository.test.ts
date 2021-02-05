import { expect } from 'chai';
// import { } from 'mocha';
import { AdvancedSettingsRepository } from '../src/repository/AdvancedSettingsRepository';

var assert = require('assert');

describe('Class Advanced settings repository', () => {

    it('Golden test. validationDataIntegrity', () => {
        // expect(true).to.be.true;
        
        let inputStr = `{"saveHistory":{"label":"Сохранение результатов в историю","enabled":true},"autoloadSettingsConfig":{"label":"Автозагрузка сохранённой конфигурации","enabled":true},"progressBar":{"label":"Индикатор прогресса","selected":"default"},"barWeight":{"label":"Дополнительный вес в кг","value":0},"introduction":{"label":"Показывать приветствие","enabled":true}}`;
        let needleResult = inputStr;

        let repository: AdvancedSettingsRepository = new AdvancedSettingsRepository;
        let SUT = repository.validationDataIntegrity(inputStr, AdvancedSettingsRepository.RULES, false);

        assert.equal(typeof SUT == "object", true);
        assert.equal(JSON.stringify(SUT), needleResult);
    });

});