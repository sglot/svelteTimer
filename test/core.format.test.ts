import * as Format from "../src/core/format";
var assert = require('assert');

describe('Core', () => {
    // Seconds
    it('Format. Formating time. Seconds < 60', () => {
        assert.equal(Format.getSecondsInTwoDigitFormat(5), "05");
    });

    it('Format. Formating time. Seconds > 60', () => {
        assert.equal(Format.getSecondsInTwoDigitFormat(70), "10");
    });

    it('Format. Formating time. Seconds == 60', () => {
        assert.equal(Format.getSecondsInTwoDigitFormat(60), "00");
    });

    it('Format. Formating time. Seconds == 0', () => {
        assert.equal(Format.getSecondsInTwoDigitFormat(0), "00");
    });

    it('Format. Formating time. Seconds < 0', () => {
        const expectedError = new Error("Секунды не могут быть отрицательными");

        assert.throws(() => Format.getSecondsInTwoDigitFormat(-2), expectedError);
    });

    // Minutes
    it('Format. Formating time. Minutes < 10', () => {
        assert.equal(Format.getMinutesInTwoDigitFormat(5), "05");
    });

    it('Format. Formating time. Minutes > 10', () => {
        assert.equal(Format.getMinutesInTwoDigitFormat(70), "70");
    });

    it('Format. Formating time. Minutes == 60', () => {
        assert.equal(Format.getMinutesInTwoDigitFormat(60), "60");
    });

    it('Format. Formating time. Minutes == 0', () => {
        assert.equal(Format.getMinutesInTwoDigitFormat(0), "00");
    });

    it('Format. Formating time. Minutes < 0', () => {
        const expectedError = new Error("Минуты не могут быть отрицательными");

        assert.throws(() => Format.getMinutesInTwoDigitFormat(-2), expectedError);
    });
});