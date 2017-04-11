import {browser, element, by, protractor} from 'protractor';
import * as moment from "moment/moment";
import * as _ from "lodash";

let EC = protractor.ExpectedConditions,
    //login = require('../shared/login.ts'),
    sharedFunc = require('../shared/shared-function.ts'),
    dateFormats = require('../shared/date-formats');

exports.testAddEditEventForm = () => {
    describe('Test add edit event form', () => {

        let startInput = element(by.css('p-calendar[formcontrolname=start] input')),
            endInput = element(by.css('p-calendar[formcontrolname=end] input')),
            noEndInput = element(by.id('withoutend')),
            subminBtn = element(by.css('button[type=submit]')),
            titleInput = element(by.css('input[formcontrolname=title]')),
            descInput = element(by.css('textarea[formcontrolname=description]'));

        it('With end date and submit button disabled by default', () => {
            expect(subminBtn.isEnabled()).toBe(false);
            expect(noEndInput.isSelected()).toBe(false);
            expect(endInput.isPresent()).toBe(true);
        });

        it("Test with no end date checkbox", () => {
            noEndInput.click();
            expect(noEndInput.isSelected()).toBe(true);
            expect(endInput.isPresent()).toBe(false);
            noEndInput.click();
            expect(noEndInput.isSelected()).toBe(false);
            expect(endInput.isPresent()).toBe(true);
        });

        it('Submit still disabled after set start and end date', () => {
            let firstDayOfMonth = moment().format(dateFormats.formats.firstDayOfMonth);
            startInput.clear();
            startInput.sendKeys(firstDayOfMonth);
            let secondDayOfMonth = moment().format(dateFormats.formats.secondDayOfMonth);
            endInput.clear();
            endInput.sendKeys(secondDayOfMonth);
            expect(subminBtn.isEnabled()).toBe(false);
        });

        it('Enable submit after set title and description', () => {
            titleInput.sendKeys('test');
            descInput.sendKeys('test');
            expect(subminBtn.isEnabled()).toBe(true);
        });

        it('Disable submit after clear title', () => {
            titleInput.clear();
            titleInput.sendKeys('1', protractor.Key.BACK_SPACE);
            expect(subminBtn.isEnabled()).toBe(false);
            titleInput.sendKeys('test');
        });

        it('Disabled submit after set end date before start', () => {
            let firstDayOfMonth = moment().format(dateFormats.formats.firstDayOfMonth);
            endInput.clear();
            endInput.sendKeys(firstDayOfMonth);
            let secondDayOfMonth = moment().format(dateFormats.formats.secondDayOfMonth);
            startInput.clear();
            startInput.sendKeys(secondDayOfMonth);
            expect(subminBtn.isEnabled()).toBe(false);
        });

        it('Enable submit after click with no end checkbox', () => {
            noEndInput.click();
            expect(noEndInput.isSelected()).toBe(true);
            expect(endInput.isPresent()).toBe(false);
            expect(subminBtn.isEnabled()).toBe(true);
        });

        it('Disable submit after click with no end checkbox', () => {
            noEndInput.click();
            expect(noEndInput.isSelected()).toBe(false);
            expect(endInput.isPresent()).toBe(true);
            expect(subminBtn.isEnabled()).toBe(false);
        });
        
    });
}