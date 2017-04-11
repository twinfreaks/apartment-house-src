import {browser, element, by, protractor} from 'protractor';
import * as _ from "lodash";

const EC = protractor.ExpectedConditions;
const blogText = 'ОСББ “ІДЕАЛ ПЛЮС”';
const nextBlogButton = element(by.cssContainingText('button', 'Next blog'));
const commentsText = ['test comment 2', 'test comment 3', 'test comment 4', 'test comment 5'];
const adminCommentsText = ['some comment from admin'];
const answerText5 = ['answer for 5th comment #1', 'answer for 5th comment #2', 'answer for 5th comment #3', 'answer for 5th comment #4', 'answer for 5th comment #5', 'answer for 5th comment #6'];
const answerText3 = ['this is answer for 3th comment #1'];
const answerText4 = ['admin answer for comment #4'];
const toastSuccess = element(by.css('.toast-success'));
const toastInfo = element(by.css('.toast-info'));
let parentCommentsCount = 1;
const commentsParent = element.all(by.css('.parent-comment'));
const commentsChild = element.all(by.css('.child-comment'));
const writeComentParent = element(by.cssContainingText('button', 'Write a comment'));
const sendCommentButton = element(by.cssContainingText('.add-button', 'Send'));
const showMoreComments = element(by.cssContainingText('.show-more', 'Show more comments'));

it('should login button to be disabled', () => {
  browser.get('/');
  browser.wait(EC.visibilityOf(element(by.name('submit'))), 5000);
  expect(element(by.name('submit')).isEnabled()).toBe(false);
});

loginToDashboard('user', 'user');

navToSingleBlog('user');

it('should switch to previous blog with no comments in it', () => {
  element(by.cssContainingText('button', 'Previous blog')).click();
  browser.wait(EC.visibilityOf(element(by.css('.blog-post-title'))), 5000);
  expect(element(by.css('.blog-post-title')).getText()).toEqual('Конкурс для ОСББ: “Енергозбереження у багатоквартирних будинках”');
  expect(element(EC.visibilityOf(element(by.css('.no-comments')))));
});

it('should switch to first blog again', () => {
  nextBlogButton.click();
  browser.wait(EC.visibilityOf(element(by.css('.blog-post-title'))), 5000);
  expect(element(by.css('.blog-post-title')).getText()).toEqual('Обслуговуюча організація');
});

it('should be disabled button "Next blog"', () => {
  browser.wait(EC.visibilityOf(element(by.css('.blog-post-title'))), 5000);
  expect(nextBlogButton.isEnabled()).toBe(false);
});

it('should be at least one comment in blog', () => {
  expect(commentsParent.count()).toBe(parentCommentsCount);
});

it('should add 4 new comments', () => {
  addComments('user');
  expect(commentsParent.count()).toBe(parentCommentsCount);
});

it('should add an answer to comment №3', () => {
  makeAnswer(3);
  expect(commentsChild.count()).toBe(1);
});

it('should add a 4 answers to comment №5', () => {
  makeAnswer(5);
  expect(commentsChild.count()).toBe(answerText5.length + 1);
});

it('should update comment №3', () => {
  updateComment('test comment 3', 'We have updated the comment text');
});

it('should logout of user account', () => {
  browser.sleep(2000);
  browser.wait(EC.visibilityOf(element(by.cssContainingText('#single-button', 'user'))), 5000);
  element(by.cssContainingText('#single-button', 'user')).click();
  browser.wait(EC.visibilityOf(element(by.cssContainingText('.dropdown-item', 'Logout'))), 5000);
  element(by.cssContainingText('.dropdown-item', 'Logout')).click();
  toastInfo.click();
  expect(EC.visibilityOf(toastSuccess));
});

loginToDashboard('adminblog', 'user');

navToSingleBlog('blogadmin');

it('should add new comment as admin', () => {
  addComments('adminblog');
  parentCommentsCount --;
  expect(commentsParent.count()).toBe(parentCommentsCount);
});

it('should delete comment №2', () => {
  let a = null;
  browser.wait(EC.visibilityOf(element(by.css('.parent-comment'))), 5000);
  element.all(by.css('.parent-comment')).each((el, index) => {
           el.element(by.css('.parent-comment-text')).getText().then((text) => {
             if (text === 'test comment 2') {
               a = index;
               return a;
             }
           });
         })
         .then(() => {
           browser.wait(EC.elementToBeClickable(element.all(by.css('.parent-comment')).get(a).element(by.css('.btn-danger.delete-button'))), 5000);
           element.all(by.css('.parent-comment')).get(a).element(by.css('.btn-danger.delete-button')).click();

           browser.wait(EC.visibilityOf(toastSuccess), 5000);
           browser.wait(EC.elementToBeClickable(toastSuccess), 5000);
           toastSuccess.click();
           browser.wait(EC.visibilityOf(writeComentParent), 5000);
           expect(EC.visibilityOf(element(by.css('.btn-success.delete-button'))));
         });
});

it('should delete first comment', () => {
  let a = null;
  element.all(by.css('.parent-comment')).each((el, index) => {
           el.element(by.css('.parent-comment-text')).getText().then((text) => {
             if (text === 'first comment') {
               a = index;
               return a;
             }
           });
         })
         .then(() => {
           browser.wait(EC.elementToBeClickable(element.all(by.css('.parent-comment')).get(a).element(by.css('.btn-danger.delete-button'))), 5000);
           element.all(by.css('.parent-comment')).get(a).element(by.css('.btn-danger.delete-button')).click();

           browser.wait(EC.visibilityOf(toastSuccess), 5000);
           browser.wait(EC.elementToBeClickable(toastSuccess), 5000);
           toastSuccess.click();
           browser.wait(EC.visibilityOf(writeComentParent), 5000);
           expect(EC.visibilityOf(element(by.css('.btn-success.delete-button'))));
         });
});

it('should undo delete first comment', () => {
  let a = null;
  element.all(by.css('.parent-comment')).each((el, index) => {
           el.element(by.css('.parent-comment-text')).getText().then((text) => {
             if (text === 'first comment') {
               a = index;
               return a;
             }
           });
         })
         .then(() => {
           browser.wait(EC.elementToBeClickable(element.all(by.css('.parent-comment')).get(a).element(by.css('.btn-success.delete-button'))), 5000);
           element.all(by.css('.parent-comment')).get(a).element(by.css('.btn-success.delete-button')).click();
           browser.wait(EC.visibilityOf(toastSuccess), 5000);
           browser.wait(EC.elementToBeClickable(toastSuccess), 5000);
           toastSuccess.click();
           browser.wait(EC.visibilityOf(writeComentParent), 5000);
           expect(EC.visibilityOf(element(by.css('.btn-danger.delete-button'))));
         });
});

it('should update admins comment', () => {
  updateComment('some comment from admin', 'We have updated the comment text as admin. Bla bla bla');
});

it('should add an answer to comment №4', () => {
  makeAnswer(4);
  expect(EC.visibilityOf(element(by.cssContainingText('.child-comment', 'admin answer for comment #4'))));
});

it('should logout of admin account and login as user', () => {
  browser.sleep(2000);
  browser.wait(EC.visibilityOf(element(by.cssContainingText('#single-button', 'adminblog'))), 5000);
  element(by.cssContainingText('#single-button', 'adminblog')).click();
  browser.wait(EC.visibilityOf(element(by.cssContainingText('.dropdown-item', 'Logout'))), 5000);
  element(by.cssContainingText('.dropdown-item', 'Logout')).click();
  browser.wait(EC.visibilityOf(element(by.css('input[type=text]'))), 5000);
  let inputUsername = element(by.css('input[type=text]'));
  inputUsername.sendKeys('user');
  let inputPassword = element(by.css('input[type=password]'));
  inputPassword.sendKeys('user');
  let submit = element(by.cssContainingText('button', 'Log in'));
  submit.click();
  let dashboardTitle = element.all(by.css('h3')).first();
  browser.wait(EC.visibilityOf(dashboardTitle), 5000);
  browser.wait(EC.visibilityOf(element(by.css('.toast-success'))), 5000);
  element(by.css('.toast-success')).click();
  toastInfo.click();
  expect(dashboardTitle.getText()).toEqual("Dashboard");
});

navToSingleBlog('user');

it('should check if comment #2 was deleted by admin', () => {
  let deletedCount = element.all(by.cssContainingText('.comment-deleted-frame', 'The comment was deleted')).count();
  expect(deletedCount).toBe(1);
  browser.sleep(2000);
  browser.wait(EC.visibilityOf(element(by.cssContainingText('#single-button', 'user'))), 5000);
  element(by.cssContainingText('#single-button', 'user')).click();
  browser.wait(EC.visibilityOf(element(by.cssContainingText('.dropdown-item', 'Logout'))), 5000);
  element(by.cssContainingText('.dropdown-item', 'Logout')).click();
  browser.wait(EC.visibilityOf(toastInfo), 5000);
  browser.wait(EC.elementToBeClickable(toastInfo), 5000);
  toastInfo.click();
});

function navToSingleBlog(user: string) {
  it('should navigate to single user blog and show blog content', () => {
    let blogs = element(by.cssContainingText('.nav-link', 'Blog'));
    let singelBlog = element(by.css('.blog-post-title'));
    browser.wait(EC.visibilityOf(blogs), 5000);
    blogs.click();
    let readMoreLink = element.all(by.cssContainingText('a', 'Обслуговуюча організація')).first();
    browser.wait(EC.visibilityOf(readMoreLink), 5000);
    readMoreLink.click();
    browser.wait(EC.visibilityOf(singelBlog), 5000);
    if (user === 'user') {
      expect(element(by.css('.blog-post-title')).getText()).toEqual('Обслуговуюча організація');
      expect(element(by.css('.blog-text')).getText()).toContain(blogText);
      expect(element(by.css('img.blog-img')).getAttribute('src')).toEqual('http://localhost:4200/assets/img/default_blog_logo.jpg');
    } else if (user === 'adminblog') {
      expect(EC.visibilityOf(element(by.cssContainingText('button', 'Show all blog test'))));
    }
  });
}

function addComments(author: string) {
  let commentsContent = [];
  if (author === 'user') {
    commentsContent = commentsText;
  } else if (author === 'adminblog') {
    commentsContent = adminCommentsText;
  }
    _.forEach(commentsContent, (text) => {
      browser.sleep(500);
      browser.wait(EC.elementToBeClickable(writeComentParent), 5000);
      writeComentParent.click();
      browser.wait(EC.visibilityOf(element(by.css('#text'))), 5000);
      element(by.css('#text')).sendKeys(text);
      browser.wait(EC.elementToBeClickable(sendCommentButton), 5000);
      sendCommentButton.click();
      browser.wait(EC.visibilityOf(toastSuccess), 5000);
      browser.wait(EC.elementToBeClickable(toastSuccess), 5000);
      toastSuccess.click();
      parentCommentsCount ++;
      browser.wait(EC.invisibilityOf(toastSuccess), 5000);
      browser.wait(EC.invisibilityOf(element(by.css('#text'))), 5000);
    });
    browser.wait(EC.invisibilityOf(toastSuccess), 5000);
}

function loginToDashboard(user: string, pass: string) {
  let userName = user;
  let password = pass;
  let dashboardText;
  if (userName === 'user') {
    dashboardText = 'Dashboard';
  } else if (userName === 'adminblog') {
    dashboardText = 'Administrator dashboard';
  }
  it('should login to dashboard', () => {
    browser.wait(EC.visibilityOf(element(by.css('input[type=text]'))), 5000);
    let inputUsername = element(by.css('input[type=text]'));
    inputUsername.sendKeys(userName);
    let inputPassword = element(by.css('input[type=password]'));
    inputPassword.sendKeys(password);
    let submit = element(by.cssContainingText('button', 'Log in'));
    submit.click();
    let dashboardTitle = element.all(by.css('h3')).first();
    browser.wait(EC.visibilityOf(dashboardTitle), 5000);
    browser.wait(EC.visibilityOf(element(by.css('.toast-success'))), 5000);
    element(by.css('.toast-success')).click();
    expect(dashboardTitle.getText()).toEqual(dashboardText);
  });
}

function makeAnswer(commentId: number) {
  let a = null;
  let content = [];
  let compareText: string;
  if (commentId === 3) {
    content = answerText3;
    compareText = 'test comment 3';
  } else if (commentId === 5) {
    content = answerText5;
    compareText = 'test comment 5';
  } else if (commentId === 4) {
    content = answerText4;
    compareText = 'test comment 4';
  }
  _.forEach(content, (text) => {
    browser.sleep(500);
    element.all(by.css('.parent-comment')).each((el, index) => {
             el.element(by.css('.parent-comment-text')).getText().then((text) => {
               if (text === compareText) {
                 a = index;
                 return a;
               }
             });
           })
           .then(() => {
             browser.wait(EC.elementToBeClickable(element.all(by.css('.parent-comment')).get(a).element(by.css('.answer-reply'))), 5000);
             element.all(by.css('.parent-comment')).get(a).element(by.css('.answer-reply')).click();
             browser.wait(EC.visibilityOf(element(by.css('#text'))), 5000);
             element(by.css('#text')).sendKeys(text);
             browser.wait(EC.elementToBeClickable(sendCommentButton), 5000);
             sendCommentButton.click();
             browser.wait(EC.visibilityOf(toastSuccess), 5000);
             browser.wait(EC.elementToBeClickable(toastSuccess), 5000);
             toastSuccess.click();
             browser.wait(EC.visibilityOf(writeComentParent), 5000);
           });
  });
  if (content.length > 1) {
    browser.wait(EC.visibilityOf(showMoreComments), 5000);
    showMoreComments.click();
  }
}

function updateComment(commentId: string, content: string) {
  let a = null;
  element.all(by.css('.parent-comment')).each((el, index) => {
           el.element(by.css('.parent-comment-text')).getText().then((text) => {
             if (text === commentId) {
               a = index;
               return a;
             }
           });
         })
         .then(() => {
           browser.wait(EC.elementToBeClickable(element.all(by.css('.parent-comment')).get(a).element(by.css('.answer-edit-parent'))), 5000);
           element.all(by.css('.parent-comment')).get(a).element(by.css('.answer-edit-parent')).click();
           browser.wait(EC.visibilityOf(element(by.css('#text'))), 5000);
           element(by.css('#text')).sendKeys(content);
           browser.wait(EC.elementToBeClickable(sendCommentButton), 5000);
           sendCommentButton.click();
           browser.wait(EC.visibilityOf(toastSuccess), 5000);
           browser.wait(EC.elementToBeClickable(toastSuccess), 5000);
           toastSuccess.click();
           browser.wait(EC.visibilityOf(writeComentParent), 5000);
           expect(element.all(by.css('.parent-comment')).get(a).getText()).toContain(content);
         });
}