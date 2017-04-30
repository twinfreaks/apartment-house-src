import {browser, element, by, protractor} from "protractor";
let EC = protractor.ExpectedConditions;

exports.login = function () {
  browser.get("/");
  let username = element(by.css("input[formControlName=username]")),
      password = element(by.css("input[formControlName=password]")),
      submit = element(by.name("submit"));
  browser.driver.wait(EC.visibilityOf(submit));
  username.sendKeys('user');
  password.sendKeys('user');
  submit.click();
};

exports.logout = function () {
  let userBtn = element(by.css("button[id='single-button']")),
      userMenuItems = element.all(by.css("li[role='menuitem']"));
  userBtn.click();
  userMenuItems.get(1).click();
};

exports.setDefaultCfg = function () {
  let toggleSettings = element(by.id('settings')),
      vBlogs = element(by.name('viewBlogs')),
      vEvents = element(by.name('viewEvents')),
      vProtocols = element(by.name('protocolCheck')),
      vCalculations = element(by.name('calculationCheck')),
      saveBtn = element(by.name('saveCfg')),
      blogLim = element(by.name('blogLimit')),
      eventLim = element(by.name('eventLimit')),
      protLim = element(by.name('protocolLimit'));
  toggleSettings.click();
  browser.driver.wait(EC.visibilityOf(saveBtn));
  vBlogs.getAttribute('checked').then(function (attr) {
    if (attr == null) vBlogs.click();
  });
  vEvents.getAttribute('checked').then(function (attr) {
    if (attr == null) vEvents.click();
  });
  vProtocols.getAttribute('checked').then(function (attr) {
    if (attr == null) vProtocols.click();
  });
  vCalculations.getAttribute('checked').then(function (attr) {
    if (attr == null) vCalculations.click();
  });
  blogLim.sendKeys('3');
  eventLim.sendKeys('3');
  protLim.sendKeys('3');
  saveBtn.click();
};

exports.dnd = function (elFrom, elTo, n) {
  elFrom.getLocation().then(function (elFromCoords) {
    elTo.getCssValue('height').then(function (elToHeight) {
      elTo.getLocation().then(function (elToCoords) {
        elToHeight = parseInt(elToHeight)/2;
        elToCoords.y = n ? elToCoords.y+elToHeight : elToCoords.y;
        return browser.driver.touchActions()
            .tapAndHold({x: Math.round(elFromCoords.x), y: Math.round(elFromCoords.y)})
            .move({x: Math.round(elFromCoords.x), y: Math.round(elToCoords.y)})
            .release({x: Math.round(elFromCoords.x), y: Math.round(elToCoords.y)})
            .perform();
      });
    })
  });

};