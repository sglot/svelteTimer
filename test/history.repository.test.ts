import { expect } from 'chai';
// import { } from 'mocha';
import {HistoryRepository } from '../src/repository/HistoryRepository';

var assert = require('assert');

describe('Class History repository', () => {
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