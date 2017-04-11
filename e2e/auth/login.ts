import {browser, element, by, protractor} from 'protractor';
let EC = protractor.ExpectedConditions;

exports.testLogin = (userlogin: string, userpass: string) => {
  describe('login', () => {

    it("should redirect to login page", () => {
      browser.get("/login");
      let username = element(by.css("input[formControlName=username]"));
      browser.wait(EC.visibilityOf(username), 3000);
      expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'login');
    });

    it("login button should be inactive", () => {
      let submitBtn = element(by.name("submit"));
      browser.wait(EC.visibilityOf(submitBtn), 3000);
      expect(submitBtn.isEnabled()).toBe(false);
    });

    it("should be active login button", () => {
      let username = element(by.css("input[formControlName=username]")),
        password = element(by.css("input[formControlName=password]")),
        submitBtn = element(by.name("submit"));

      username.sendKeys(userlogin);
      password.sendKeys(userpass);
      expect(submitBtn.isEnabled()).toBe(true);
    });

    it("should login into system and pass to user dashboard", () => {
      let submitBtn = element(by.name("submit"));
      submitBtn.click();
      let profileMenu = element(by.id("single-button"));
      browser.wait(EC.visibilityOf(profileMenu), 3000);
      expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'user');
    });

  });
};