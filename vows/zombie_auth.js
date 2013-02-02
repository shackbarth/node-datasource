/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XM:true, XV: true */

// global objects
XT = {};
XM = {};
XV = {};

var assert = require('assert'),
  zombie = require('zombie');
(function () {
  "use strict";

  var loadApp = function (username, password, masterCallback) {
    zombie.visit('http://localhost:2000', {debug: false}, function (e, browser) {
      //
      // This is the login screen
      //
      browser
        .fill('id', username)
        .fill('password', password)
        .pressButton('submit', function () {
          //
          // We skip the scope screen because we're using a user that only has one org
          //
          // Note: make sure the app is built

          // not quite sure why zombie doesn't do this redirect, but oh well.
          browser.visit('http://localhost:2000/client/index.html', function (e, browser) {
            browser.wait(function (window) {
              // this function defines what we're waiting for: for the app state to be 6 (= RUNNING)
              return window.XT.app.state === 6;
            }, function () {
              // this is the function that gets run when the above function returns true

              // add the global objects to our global namespace
              XM = browser.window.XM;
              XT = browser.window.XT;
              XV = browser.window.XV;

              // give control back to whoever called us
              masterCallback();
            });
          });
        });
    });
  };

  exports.loadAdd = loadApp;

  var sampleUse = function () {
    loadApp('admin', 'somenew', function () {
      //console.log("App is loaded");
      //console.log(XM.incidentCategories.toJSON());
      //console.log(XT.session.schema.toJSON());
      process.exit(0);
    });
  };

}());
