import {browser, element, by, protractor} from 'protractor';
let EC = protractor.ExpectedConditions;

exports.testLogout = () => {
  describe('logout', () => {

    it("should open dashboard page", () => {
      browser.get("/user");
      let profileMenu = element(by.id("single-button"));
      browser.wait(EC.visibilityOf(profileMenu), 3000);
      expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'user');
    });

    it("it should logout", () => {
      let profileMenu = element(by.id("single-button")),
          logoutBtn = element(by.css(".dropdown-menu-right > li:last-child")),
          username = element(by.css("input[formControlName=username]"));
      profileMenu.click();
      browser.wait(EC.visibilityOf(logoutBtn), 3000);
      logoutBtn.click();
      browser.wait(EC.visibilityOf(username), 3000);
      expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'login');
    });

  });
};