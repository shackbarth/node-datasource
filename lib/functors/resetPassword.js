/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true */

(function () {
  "use strict";

  var _fs = X.fs, _path = X.path, salt, crypt;

  // TODO: THIS HAS TO CHANGE FOR RELEASE THIS MUST BE GLOBALLY AVAILABLE
  // TO ALL DATASOURCES [ed. note: plural of datasource is datasources]
  salt = _fs.readFileSync(_path.join(X.basePath, X.options.datasource.saltFile), "utf8").trim();

  crypt = function (password) {
    var md5 = X.crypto.createHash('md5');
    md5.update(salt + password);
    return md5.digest('hex');
  };

  /**
    Defines the reset password route.

    @extends X.Route
    @class
   */
  X.Functor.create({
    handle: function (xtr) {
      var data = xtr.get("payload"),
        user,
        session,
        message = "Unknown user or invalid password match",
        fetchSuccess,
        fetchError = function (err) {
          console.log("fetch error");
          xtr.error({isError: true, reason: "No user exists by that ID"});
        };

      //X.debugging = true;
      //X.debug(data);

      if (!data || !data.id) {
        xtr.error({isError: true, reason: "need an ID"});
      } else {
        user = XM.User.findOrCreate(data.payload.id);
        if (user === null) {
          // this bit should not be necessary by my understanding of findOrCreate. Go figure.
          user = new XM.User({id: data.payload.id});
        }
        fetchSuccess = function () {
          // thanks http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
          var newPassword = Math.random().toString(36).substr(2, 10),
            encryptedNewPassword = crypt(newPassword),
            updateError = function (model, err) {
              xtr.error({isError: true, reason: "Error updating password"});
            },
            updateSuccess = function () {
              // TODO: write to e-mail table
              xtr.write({data: {message: "Password change successful!", password: newPassword}}).close();
            },
            // the actual edit will be made under the authority of the node user
            nodeUsername = X.options.globalDatabase.nodeUsername;

          user.set({password: encryptedNewPassword});

          XT.dataSource.commitRecord(user, {success: updateSuccess, error: updateError, force: true, username: nodeUsername});
        };

        // XXX might not be necessary to do this fetch
        user.fetch({success: fetchSuccess, error: fetchError});

      }
    },
    handles: "function/resetPassword",
    needsSession: false
  });
}());
