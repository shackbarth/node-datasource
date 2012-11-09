/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  X.Functor.create({

    handle: function (xtr, session) {
      var query,
        payload = JSON.parse(xtr.get("data")),
        binaryField = payload.binaryField,
        binaryData,
        encodedData,
        buffer,
        payloadString;

      payload.username = session.get("username");
      payloadString = JSON.stringify(payload);

      // we need to convert js binary into pg hex (see the file route for
      // the opposite conversion). see issue 18661
      if (binaryField) {
        binaryData = payload.dataHash[binaryField];

        // hit a wall on issue 18780. The following two lines should be used to encode files...
        //buffer = new Buffer(binaryData, "binary"); // XXX uhoh: binary is deprecated but necessary here
        //encodedData = '\\x' + buffer.toString("hex");

        console.log(binaryField);
        console.log(binaryData);
        // ... and this line should be used to encode images, but it doesn't quite work the same as QT.
        encodedData = X.fileRoute.convert_uuencode(binaryData);
        encodedData = "begin 644 internal\n" + encodedData + "end";
        console.log(encodedData);

        payload.dataHash[binaryField] = encodedData;
        payloadString = JSON.stringify(payload);
        console.log(payloadString);
      }

      query = "select xt.commit_record($$%@$$)".f(payloadString);

      xtr.debug("commitRecord(): %@".f(query));

      session.query(query, function (err, res) {
        if (err) xtr.error({data: err});
        else xtr.write({data: res}).close();
      });
    },

    handles: "function/commitRecord",

    needsSession: true
  });
}());
