import {browser, element, by, protractor} from 'protractor';

let EC = protractor.ExpectedConditions;

exports.goToCalculationsViaNavbar = (role) => {
  it("go to calculations after click navbar item", () => {
    let navBarEvent = element(by.css('a.nav-link[href="/' + role +'/calculations"]'));
    navBarEvent.click();
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + role + '/calculations');
  });
}

exports.reloadCalculations = (role) => {
  it("reload calculations component", () => {
    element(by.css('.navbar-brand')).click();
    expect(browser.getCurrentUrl()).not.toBe(browser.baseUrl + role + '/calculations');
    let navBarEvent = element(by.css('a.nav-link[href="/' + role +'/calculations"]'));
    navBarEvent.click();
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + role + '/calculations');
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

exports.testTitle = () => {
  it('Title is correct', () => {
    expect(element(by.css('h3.title')).getText()).toBe('Calculations');
  });
}

exports.clickToast = () => {
  it('Click on toast', () => {
    let toast = element(by.className('toast-top-right'));
    browser.wait(EC.visibilityOf(toast), 4000);
    toast.click();
    browser.wait(EC.invisibilityOf(toast), 5000);
    expect(toast.isDisplayed()).toBe(false);
  });
}