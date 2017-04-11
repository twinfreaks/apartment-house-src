import {browser, element, by, protractor} from 'protractor';

let EC = protractor.ExpectedConditions;

exports.goToCalendarEventsViaNavbar = (role) => {
  it("go to events calendar after click navbar item", () => {
    let navBarEvent = element(by.css('a.nav-link[href="/' + role +'/events"]'));
    navBarEvent.click();
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + role + '/events');
  });
}

exports.reloadCalendarEvents = (role) => {
  it("reload events calendar component", () => {
    element(by.css('.navbar-brand')).click();
    expect(browser.getCurrentUrl()).not.toBe(browser.baseUrl + role + '/events');
    let navBarEvent = element(by.css('a.nav-link[href="/' + role +'/events"]'));
    navBarEvent.click();
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + role + '/events');
  });
}

exports.clickOnEnFlag = () => {
  let flags = element.all(by.css('.flag')),
      en = flags.get(0),
      uk = flags.get(1);
  it('click on en flag', () => {
      browser.wait(EC.elementToBeClickable(en), 5000);
      en.click();
      expect(en.getCssValue('opacity')).toBe('1');
  });
}

