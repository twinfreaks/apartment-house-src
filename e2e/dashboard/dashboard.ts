import {browser, element, by, protractor} from 'protractor';

let funcs = require('./funcs.ts'),
    EC = protractor.ExpectedConditions,
    sleep = function (ms) {
      browser.sleep(ms)
    },
    wait = function (condition) {
      return browser.driver.wait(condition)
    },
    waitForPresent = function (element) {
      browser.driver.wait(function () {
        return browser.isElementPresent(element)
      });
    },
    waitForDisplay = function (element) {
      browser.driver.wait(function () {
        return element.isDisplayed();
      })
    };

exports.test = () => {
  describe('app', function () {
    beforeAll(function () {
      funcs.login()
    });
    // afterAll(function () {
    //   it("Should successfully logout", function () {
    //     logout();
    //   })
    // });
    describe('dashboard', () => {
      let vBlogs = element(by.name('viewBlogs')),
          vEvents = element(by.name('viewEvents')),
          vProtocols = element(by.name('protocolCheck')),
          vCalculations = element(by.name('calculationCheck')),
          toggleSettings = element(by.id('settings')),
          blogLim = element(by.name('blogLimit')),
          eventLim = element(by.name('eventLimit')),
          protLim = element(by.name('protocolLimit')),
          titles = element.all(by.id("itemTitle")),
          collapse = element(by.className('collapsing')),
          saveBtn = element(by.name('saveCfg')),
          langs = element.all(by.className('flag')),
          dbTitle = element(by.id('dashboardTitle')),
          navBlogs = element(by.css("a[href='/user/blogs']")),
          navEvents = element(by.css("a[href='/user/events']")),
          navProtocols = element(by.css("a[href='/user/protocols']")),
          navCalculations = element(by.css("a[href='/user/calculations']")),
          navBrand = element(by.className('navbar-brand')),
          bLogo = element(by.className('b-logo')),
          eLogo = element(by.className('e-logo')),
          pLogo = element(by.className('p-logo')),
          cLogo = element(by.className('c-logo')),
          userBtn = element(by.css("button[id='single-button']")),
          userMenuItems = element.all(by.css("li[role='menuitem']")),
          blogCard = element(by.css("div[class='card card-custom card-outline-primary'")),
          eventCard = element(by.css("div[class='card card-custom card-outline-success'")),
          protCard = element(by.css("div[class='card card-custom card-outline-info'")),
          requestBtn = element(by.className('collapse-button btn btn-info')),
          requestBody = element(by.id('userReqBody')),
          reqCloseBtn = element(by.id('closeRequest')),
          categorySelect = element(by.id('categories')),
          requestSubmitBtn = requestBody.element(by.css("button[type='submit']")),
          blogsTitle = element(by.cssContainingText("span[id='itemTitle']", 'Blogs')),
          eventsTitle = element(by.cssContainingText("span[id='itemTitle']", 'Events')),
          dragPlaces = element.all(by.id("drag-place")),
          itemsCards = element.all(by.id("item-card"));

      describe('Default Config', () => {
        it("/user and all 4 checkboxes in CFG section should be TRUE", function () {
          waitForPresent(vBlogs);
          expect(browser.getCurrentUrl()).toMatch('http://localhost:4200/user');
          expect(vBlogs.getAttribute('checked')).toMatch('true');
          expect(vEvents.getAttribute('checked')).toMatch('true');
          expect(vProtocols.getAttribute('checked')).toMatch('true');
          expect(vCalculations.getAttribute('checked')).toMatch('true');
        });
        it("all limits in CFG should equal 3", function () {
          expect(blogLim.getAttribute('value')).toBe('3');
          expect(eventLim.getAttribute('value')).toBe('3');
          expect(protLim.getAttribute('value')).toBe('3');
        });
        it("default order or items should be BEPC", function () {
          expect(titles.get(0).getText()).toMatch('Blogs');
          expect(titles.get(1).getText()).toMatch('Events');
          expect(titles.get(2).getText()).toMatch('Protocols');
          expect(titles.get(3).getText()).toMatch('Calculations')
        });
        it("open settings check", function () {
          let toast = element(by.className('toast'));
          waitForDisplay(toast);
          toast.click();
          wait(EC.invisibilityOf(toast));
          toggleSettings.click();
          waitForDisplay(saveBtn);
          expect(collapse.getCssValue('height')).not.toMatch('0px')
        });
        it("close settings check", function () {
          toggleSettings.click();
          expect(collapse.getCssValue('height')).not.toMatch('389px')
        });
      });

      describe('Navbar', () => {
        it("UA flag check", function () {
          let ua = langs.get(1);
          ua.click();
          waitForDisplay(dbTitle);
          expect(dbTitle.getText()).toMatch('Оголошення')
        });
        it("ENG flag check", function () {
          let eng = langs.get(0);
          eng.click();
          waitForDisplay(dbTitle);
          expect(dbTitle.getText()).toMatch('Dashboard')
        });
        it("Navbar>Blogs check", function () {
          navBlogs.click();
          expect(browser.getCurrentUrl()).toContain('/user/blogs')
        });
        it("Navbar>Events check", function () {
          navEvents.click();
          expect(browser.getCurrentUrl()).toContain('/user/events')
        });
        it("Navbar>Calculations check", function () {
          navCalculations.click();
          expect(browser.getCurrentUrl()).toContain('/user/calculations')
        });
        it("Navbar>Protocols check", function () {
          navProtocols.click();
          expect(browser.getCurrentUrl()).toContain('/user/protocols')
        });
        it("Navbar>LOGO check", function () {
          navBrand.click();
          expect(browser.getCurrentUrl()).toContain('/user')
        });
        it("Navbar>User>Profile check", function () {
          userBtn.click();
          userMenuItems.get(0).click();
          expect(browser.getCurrentUrl()).toContain('/user/profile');
        })
      });

      describe('BEPC buttons', () => {
        it("B-icon check", function () {
          navBrand.click();
          bLogo.click();
          expect(browser.getCurrentUrl()).toContain('/user/blogs')
        });
        it("E-icon check", function () {
          navBrand.click();
          eLogo.click();
          expect(browser.getCurrentUrl()).toContain('/user/events')
        });
        it("P-icon check", function () {
          navBrand.click();
          pLogo.click();
          expect(browser.getCurrentUrl()).toContain('/user/protocols')
        });
        it("C-icon check", function () {
          navBrand.click();
          cLogo.click();
          expect(browser.getCurrentUrl()).toContain('/user/calculations');
        });
      });

      describe("Manage Config", function () {
        it("Should make blogs invisible and blogs limit disabled", function () {
          navBrand.click();
          wait(EC.elementToBeClickable(toggleSettings));
          toggleSettings.click();
          wait(EC.elementToBeClickable(saveBtn));
          vBlogs.click();
          saveBtn.click();
          wait(EC.invisibilityOf(collapse));
          expect(titles.count()).toBe(3);
          expect(blogLim.isEnabled()).not.toBe(true);
        });
        it("Should make blogs invisible and blogs limit disabled", function () {
          toggleSettings.click();
          wait(EC.elementToBeClickable(saveBtn));
          vEvents.click();
          saveBtn.click();
          wait(EC.invisibilityOf(collapse));
          expect(titles.count()).toBe(2);
          expect(eventLim.isEnabled()).not.toBe(true);
        });
        it("Should make blogs invisible and blogs limit disabled", function () {
          toggleSettings.click();
          wait(EC.elementToBeClickable(saveBtn));
          vProtocols.click();
          saveBtn.click();
          wait(EC.invisibilityOf(collapse));
          expect(titles.count()).toBe(1);
          expect(protLim.isEnabled()).not.toBe(true);
        });
        it("Should make blogs invisible", function () {
          toggleSettings.click();
          wait(EC.elementToBeClickable(saveBtn));
          vCalculations.click();
          saveBtn.click();
          wait(EC.invisibilityOf(collapse));
          expect(titles.count()).toBe(0);
          funcs.setDefaultCfg();
        });
        it("Blogs limit change", function () {
          let blogLis = blogCard.all(by.id('item-li'));
          toggleSettings.click();
          wait(EC.elementToBeClickable(saveBtn));
          blogLim.sendKeys('1');
          blogLim.sendKeys('1');
          saveBtn.click();
          waitForDisplay(blogCard);
          expect(blogLis.count()).toBe(1)
        });
        it("Events limit change", function () {
          let eventLis = eventCard.all(by.id('item-li'));
          toggleSettings.click();
          wait(EC.elementToBeClickable(saveBtn));
          eventLim.sendKeys('1');
          eventLim.sendKeys('1');
          saveBtn.click();
          waitForDisplay(eventCard);
          expect(eventLis.count()).toBe(1)
        });
        it("Protocols limit change", function () {
          let protLis = protCard.all(by.id('item-li'));
          toggleSettings.click();
          wait(EC.elementToBeClickable(saveBtn));
          protLim.sendKeys('1');
          protLim.sendKeys('1');
          saveBtn.click();
          waitForDisplay(protCard);
          expect(protLis.count()).toBe(1)
        });
      });

      describe("Request tests", function () {
        it("Open request, submit button should be disabled", function () {
          requestBtn.click();
          expect(requestBody.getCssValue('width')).not.toMatch('0px');
          waitForDisplay(requestSubmitBtn);
          expect(requestSubmitBtn.isEnabled()).toBe(false)
        });
        it("Request close(x) button", function () {
          reqCloseBtn.click();
          wait(EC.invisibilityOf(requestBody));
          expect(requestBody.getCssValue('width')).toMatch('42px')
        });
        it("After category picked and textarea filled, Submit button should be enabled", function () {
          let catSelectOpt = categorySelect.all(by.tagName('option')).get(1),
              requestText = requestBody.element(by.id('message'));
          requestBtn.click();
          wait(EC.visibilityOf(requestSubmitBtn));
          categorySelect.click();
          wait(EC.visibilityOf(catSelectOpt));
          catSelectOpt.click();
          requestText.sendKeys('Test Message');
          expect(requestSubmitBtn.isEnabled()).toBe(true)
        });
        it("On Submit Request window should be closed", function () {
          requestSubmitBtn.click();
          wait(EC.invisibilityOf(requestBody));
          expect(requestBody.getCssValue('width')).toMatch('42px')
        });
      });

      describe("Drag'n'Drop", function () {
        it("Blogs from 1 to 2", function () {
          wait(EC.elementToBeClickable(blogsTitle));
          funcs.dnd(blogsTitle, dragPlaces.get(1), true);
          wait(EC.elementToBeClickable(blogsTitle));
          expect(itemsCards.get(1).getAttribute('class')).toContain('primary');
        });
        it("Blogs from 2 to 3", function () {
          wait(EC.elementToBeClickable(blogsTitle));
          funcs.dnd(blogsTitle, dragPlaces.get(2), true);
          wait(EC.elementToBeClickable(blogsTitle));
          expect(itemsCards.get(2).getAttribute('class')).toContain('primary');
        });
        it("Blogs from 3 to 4", function () {
          wait(EC.elementToBeClickable(blogsTitle));
          funcs.dnd(blogsTitle, dragPlaces.get(3), true);
          wait(EC.elementToBeClickable(blogsTitle));
          expect(itemsCards.get(3).getAttribute('class')).toContain('primary');
        });
        it("Blogs from 4 to 3", function () {
          wait(EC.elementToBeClickable(blogsTitle));
          funcs.dnd(blogsTitle, dragPlaces.get(2), false);
          wait(EC.elementToBeClickable(blogsTitle));
          expect(itemsCards.get(2).getAttribute('class')).toContain('primary');
        });
        it("Blogs from 3 to 2", function () {
          wait(EC.elementToBeClickable(blogsTitle));
          funcs.dnd(blogsTitle, dragPlaces.get(1), false);
          wait(EC.elementToBeClickable(blogsTitle));
          expect(itemsCards.get(1).getAttribute('class')).toContain('primary');
        });
        it("Blogs from 2 to 1", function () {
          wait(EC.elementToBeClickable(blogsTitle));
          funcs.dnd(blogsTitle, dragPlaces.get(0), false);
          wait(EC.elementToBeClickable(blogsTitle));
          expect(itemsCards.get(0).getAttribute('class')).toContain('primary');
        });
      });

      describe("Preview tests", function () {
        let blogLi = dragPlaces.get(0).element(by.id("item-li")),
            eventLi = dragPlaces.get(1).element(by.id("item-li")),
            protLi = dragPlaces.get(2).element(by.id("item-li")),
            downloadBtn = element(by.className("fa fa-cloud-download fa-2x")),
            modalHeader = element(by.className("modal-header")),
            closeModalBtn = element(by.id("close-modal"));
        it("Blog preview should open a modal window", function () {
          blogLi.click();
          wait(EC.visibilityOf(modalHeader));
          expect(modalHeader.isDisplayed()).toBe(true);
          closeModalBtn.click();
        });
        it("Event preview should open a modal window", function () {
          sleep(1000);
          eventLi.click();
          wait(EC.visibilityOf(modalHeader));
          expect(modalHeader.isDisplayed()).toBe(true);
          closeModalBtn.click();
        });
        it("Protocol preview should open a modal window", function () {
          sleep(1000);
          protLi.click();
          wait(EC.visibilityOf(modalHeader));
          expect(modalHeader.isDisplayed()).toBe(true);
          expect(downloadBtn.isDisplayed()).toBe(true);
          closeModalBtn.click();
        });
        it("Should set default cfg and successfully logout", function () {
          sleep(1000);
          funcs.setDefaultCfg();
          wait(EC.invisibilityOf(vBlogs));
          funcs.logout();
          expect(browser.getCurrentUrl()).toContain('/login')
        })
      });
    });
  });
};