import {browser, element, by, protractor} from 'protractor';
import * as moment from "moment/moment";
import * as _ from "lodash";

let EC = protractor.ExpectedConditions,
    sharedFunc = require('../shared/shared-function.ts'),
    dateFormats = require('../shared/date-formats'),
    adminFunc = require('./admin-function.ts');

exports.testDragDropAndEdit = () => {
    describe('Drag&Drop and Edit functionalities', () => {

        let toast = element(by.className('toast-top-right')),
                days = element.all(by.css('.cal-day-cell')),
                dayFrom, dayTo, eventStartDate, eventEndDate,
                modal = element(by.css('.modal')),
                modalClose = modal.element(by.css('.close')),
                modalTitle = modal.element(by.css('.modal-title')),
                openDay = element(by.css('.cal-month-view .cal-open-day-events')),
                titleOfMovedEvent, numOfEvents, indexOfEventInDayTo;

        it('find first day of month with events', () => {
            function check(className){
                return (_.includes(className, 'cal-in-month') && _.includes(className, 'cal-has-events'));
            }
            let done = false;
            for(let i = 0; i < 28; i++){
                days.get(i).getAttribute('class').then((value) => {
                    if(!done && check(value)){
                        done = true;
                        dayFrom = days.get(i);
                        dayTo = days.get(i + 1);
                    }
                });
            }
        });

        it('show modal after click on event info', () => {
            dayFrom.element(by.css('.cal-cell-top')).click();
            browser.wait(EC.visibilityOf(openDay), 4000);
            browser.actions().mouseDown(openDay.all(by.css('.white')).first()).mouseUp().perform();
            browser.wait(EC.elementToBeClickable(modalClose), 4000);
            modal.element(by.id('start-date')).getText().then((value) => {
                eventStartDate = value;
            });
            modal.element(by.id('end-date')).isPresent().then((value) => {
                if(value){
                    modal.element(by.id('end-date')).getText().then((value) => {
                        eventEndDate = value;
                    });
                } else {
                    eventEndDate = null;
                }
            });
            modalTitle.getText().then((value) => {
                titleOfMovedEvent = value;
            });
            expect(modal.isDisplayed()).toBe(true);
        });

        it('close info modal', () => {
            modalClose.click();
            browser.driver.wait(function(){
                return element(by.tagName('body')).getAttribute('class').then((value) => {
                return !_.includes(value, 'modal-open');
                });
            });
            expect(modal.isDisplayed()).toBe(false);
        });

        it('show modal after move event to the next day, check title', () => {
            dayFrom.all(by.css('.cal-event')).count().then((value) => {
                numOfEvents = value;
            });
            let calendarEvent = dayFrom.element(by.css('.cal-event:nth-child(1)'));
            browser.actions().dragAndDrop(calendarEvent, dayTo).perform();
            browser.wait(EC.elementToBeClickable(modalClose), 4000);
            modalTitle.getText().then((value) => {
                expect(value).toContain(titleOfMovedEvent);
            });
        });

        adminFunc.confirmChanges();

        adminFunc.clickOnSuccessToast();

        it('event moved from day', () => {
            browser.driver.wait(() => {
                return dayFrom.all(by.css('.cal-event')).count().then((value) => {
                    return value < numOfEvents;
                });
            });
            expect(dayFrom.all(by.css('.cal-event')).count()).toBe(numOfEvents - 1);
        });

        sharedFunc.reloadCalendarEvents('admin');

        it('open active day after click on day where event should be', () => {
            browser.driver.wait(() => {
                return element.all(by.css(".cal-event")).first().isPresent();
            });
            browser.wait(EC.elementToBeClickable(dayTo.element(by.css('.cal-cell-top'))), 5000);
            dayTo.element(by.css('.cal-cell-top')).click();
            browser.wait(EC.visibilityOf(openDay), 4000);
            expect(openDay.isDisplayed()).toBe(true);
        });

        it('event moved to next day and saved in db', () => {
            let eventTitles = openDay.all(by.css('.cal-event-title')),
                result,
                ev = eventTitles.get(0);
            browser.wait(EC.visibilityOf(ev), 4000);
            eventTitles.getText().then((value) => {
                _.forEach(value, (str, index) => {
                    if(_.includes(titleOfMovedEvent, str)){
                        indexOfEventInDayTo = index;
                        result = true;
                    }
                });
                expect(result).toBe(true);
            });
        });

        it('show edit component after click on edit event icon', () => {
            browser.wait(EC.elementToBeClickable(openDay.all(by.css('.yellow')).get(indexOfEventInDayTo)), 4000);
            browser.actions().mouseDown(openDay.all(by.css('.yellow')).get(indexOfEventInDayTo)).mouseUp().perform();
            browser.wait(EC.visibilityOf(element(by.id('add-edit-event'))), 4000);
            expect(element(by.id('add-edit-event')).isPresent()).toBe(true);
            expect(element(by.id('calendar-events')).isPresent()).toBe(false);
        });

        it('Edit event title correct', () => {
            expect(element(by.css('.container > h3')).getText()).toBe('Edit Event');
        });

        it('check by event title if open right event', () => {
            element(by.id('event-title')).getAttribute('value').then((value) => {
                expect(value).toBe(titleOfMovedEvent);
            });
            expect(element(by.id('event-title')).getAttribute('value')).toBe(titleOfMovedEvent);
        });

        it('set start and end date as before drag&drop', () => {
            let start = moment(moment(eventStartDate, dateFormats.formats.fullDate)).format(dateFormats.formats.datePicker);
            let startInput = element(by.css('p-calendar[formcontrolname=start] input'));
            startInput.clear();
            startInput.sendKeys(start);
            if(eventEndDate){
                let end = moment(moment(eventEndDate, dateFormats.formats.fullDate)).format(dateFormats.formats.datePicker)
                let endInput = element(by.css('p-calendar[formcontrolname=end] input'));
                endInput.clear();
                endInput.sendKeys(end);
                expect(endInput.getAttribute('value')).toBe(end);
            }
            expect(startInput.getAttribute('value')).toBe(start);
        });

        it('show modal after click save button', () => {
            element(by.css('p-calendar[formcontrolname=end] .ui-datepicker')).isPresent().then((value) => {
                if(value){
                    element(by.css('p-calendar[formcontrolname=end] .ui-datepicker-trigger')).click();
                }
            });
            browser.wait(EC.invisibilityOf(element(by.css('p-calendar[formcontrolname=end] .ui-datepicker'))), 4000);
            element(by.css('button[type=submit]')).click();
            browser.wait(EC.elementToBeClickable(modalClose), 4000);
            expect(modal.isDisplayed()).toBe(true);
        });

        it('correct data in modal', () => {
            modal.element(by.id('start-date')).getText().then((value) => {
                expect(value).toBe(eventStartDate);
            });
            if(eventEndDate){
                modal.element(by.id('end-date')).getText().then((value) => {
                    expect(value).toBe(eventEndDate);
                });
            }
        });

        adminFunc.confirmChanges();

        adminFunc.clickOnSuccessToast();

        sharedFunc.reloadCalendarEvents('admin');

        it('event moved back to day and saved in db', () => {
            browser.driver.wait(() => {
                return element.all(by.css(".cal-event")).first().isPresent();
            });
            browser.driver.wait(() => {
                return dayFrom.all(by.css('.cal-event')).first().isPresent();
            });
            browser.driver.wait(() => {
                return dayFrom.all(by.css('.cal-event')).count().then((value) => {
                    return value === numOfEvents;
                });
            });
            expect(dayFrom.all(by.css('.cal-event')).count()).toBe(numOfEvents);
        });

    });
}