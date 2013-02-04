/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, console:true*/

/*
  Beware that we don't actually verify the password here. We
  just pull the user by username. Password verification gets
  done in passport.js.

  Note also that I'm assuming all users are off their
  old MD5 passwords by now.
*/
exports.findByUsername = function (username, done) {
  "use strict";
  var user = new XM.User(),
    options = {};

  options.success = function (res) {
    done(null, res);
  };

  options.error = function (res, err) {
    if (err.code === 'xt1007') {
      // XXX should "result not found" really be an error?
      done(null, false);
    } else {
      X.log("Error authenticating user", arguments);
      done(err);
    }
  };

  // The user id we're searching for.
  options.id = username;

  // The user under whose authority the query is run.
  options.username = X.options.globalDatabase.nodeUsername;

  user.fetch(options);
};



    // TODO We might want to use this again in order to increase the
    // entropy of the bcrypt passwords, so we'll keep in in here for now.
    /**
    Switches a user's password hash from MD5 to bcrypt after they have logged in.

    @param {X.Reponse} xtr
    @param {X.Session} session
    @param {login payload data with bcrypt password} data
    recryptPassword: function (xtr, session, data) {
      var K = this.get("model"),
          options = {},
          saveOptions = {},
          user = new K();

      options.success = function (res) {
        // Update the user's password with a bcrypt value.
        user.set({password: data.bcryptpass});
        user.save(null, saveOptions);
      };
      options.error = function (model, err) {
// TODO Not sure how best to handle an error here. But this should go away soon.
        X.debug("recryptPassword fetch user error: ", err);
        xtr.error({isError: true, reason: "You broke it."});
      };

      saveOptions.success = function (res) {
        xtr.write(session.get("details")).close();
      };
      saveOptions.error = function (model, err) {
// TODO Not sure how best to handle an error here. But this should go away soon.
        X.debug("recryptPassword save user error: ", err);
        xtr.error({isError: true, reason: "You broke it."});
      };

      options.id = data.id;
      options.password = data.md5pass;
      options.username = X.options.globalDatabase.nodeUsername;
      saveOptions.username = X.options.globalDatabase.nodeUsername;

      // Reload the user so we have access privs.
      user.fetch(options);
    },
   */

