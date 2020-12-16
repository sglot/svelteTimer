import { expect } from 'chai';
// import { } from 'mocha';
import {HistoryRepository } from '../src/repository/HistoryRepository';

var assert = require('assert');

describe('Class History repository', () => {

    it('Golden test. validationDataIntegrity', () => {
        // expect(true).to.be.true;
        
        let inputStr = `[{"id":1,"date":"2020-12-3","work":1,"relax":1,"laps":1,"success":true},{"id":1,"date":"2020-12-3","work":1,"relax":1,"laps":1,"success":true},{"id":2,"date":"2020-12-3","work":1,"relax":1,"laps":1,"success":true},{"id":2,"date":"2020-12-4","work":4,"relax":3,"laps":1,"success":true},{"id":2,"date":"2020-12-4","work":1,"relax":1,"laps":1,"success":true,"time":"14:28:42"},{"id":6,"date":"2020-12-4 14:32:48","work":1,"relax":1,"laps":1,"success":true},{"id":7,"date":"04.12.2020, 14:59:55","work":1,"relax":1,"laps":1,"success":true},{"id":8,"date":"14.12.2020, 21:52:27","work":1,"relax":1,"laps":1,"success":true},{"id":9,"date":"14.12.2020, 21:52:50","work":1,"relax":1,"laps":1,"success":true},{"id":10,"date":"14.12.2020, 21:54:00","work":1,"relax":1,"laps":1,"success":true},{"id":11,"date":"14.12.2020, 21:57:41","work":1,"relax":1,"laps":1,"success":true},{"id":12,"date":"14.12.2020, 22:01:52","work":1,"relax":1,"laps":1,"success":true},{"id":13,"date":"14.12.2020, 22:55:33","work":1,"relax":1,"laps":1,"success":true},{"id":14,"date":"14.12.2020, 22:56:09","work":1,"relax":1,"laps":1,"success":true},{"id":15,"date":"14.12.2020, 22:57:01","work":1,"relax":1,"laps":1,"success":true},{"id":16,"date":"14.12.2020, 23:00:17","work":1,"relax":1,"laps":1,"success":true},{"id":17,"date":"14.12.2020, 23:10:22","work":1,"relax":1,"laps":1,"success":true},{"id":18,"date":"14.12.2020, 23:21:13","work":1,"relax":1,"laps":1,"success":true}]`;
        let needleResult = inputStr;

        let historyRepository: HistoryRepository = new HistoryRepository;
        let SUT = historyRepository.validationDataIntegrity(inputStr, HistoryRepository.RULES, false);

        assert.equal(typeof SUT == "object", true);
        assert.equal(JSON.stringify(SUT), needleResult);
    });





    it('.Method modify. Separate date and time', () => {
        // expect(true).to.be.true;
        
        let historyRow: historyRow = {
            "id": 1,
            "date": "2020-20-20, 24:00",
            "work": 10,
            "relax": 10,
            "laps": 1,
            "success": true
        };

        let historyRepository: HistoryRepository = new HistoryRepository;
        let row = historyRepository.modify(historyRow);

        assert.equal(row.date, "2020-20-20");
        assert.equal(row.time, "24:00");
    });
});