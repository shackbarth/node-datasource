/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._;

  // https://localtest.com/file?recordType=XM.File&id=40

  /**
    Used to serve up files to the client. Uses Content-Type to prompt browser to
    save the file

    @extends X.Route
    @class
   */
  X.fileRoute = X.Route.create({

    contentTypes: {
      csv: { contentType: "text/csv", encoding: "utf-8" },
      txt: { contentType: "text/plain", encoding: "utf-8" },
      png: { contentType: "image/png", encoding: "binary" },
      jpg: { contentType: "image/jpeg", encoding: "binary" },
      jpeg: { contentType: "image/jpeg", encoding: "binary" },
      gif: { contentType: "image/gif", encoding: "binary" }
    },

    getContentType: function (extension) {
      if (this.contentTypes.hasOwnProperty(extension.toLowerCase())) {
        return this.contentTypes[extension];
      }
      return { contentType: "application/" + extension, encoding: "binary" };
    },
rtrim: function (str, charlist) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Erkekjetter
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Onno Marsman
  // +   input by: rem
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: rtrim('    Kevin van Zonneveld    ');
  // *     returns 1: '    Kevin van Zonneveld'
  charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
  var re = new RegExp('[' + charlist + ']+$', 'g');
  return (str + '').replace(re, '');
},

is_scalar: function (mixed_var) {
  // http://kevin.vanzonneveld.net
  // +   original by: Paulo Freitas
  // *     example 1: is_scalar(186.31);
  // *     returns 1: true
  // *     example 2: is_scalar({0: 'Kevin van Zonneveld'});
  // *     returns 2: false
  return (/boolean|number|string/).test(typeof mixed_var);
},

  convert_uudecode: function (str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Ole Vrijenhoek
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // -    depends on: is_scalar
    // -    depends on: rtrim
    // *     example 1: convert_uudecode('+22!L;W9E(%!(4\"$`\n`');
    // *     returns 1: 'I love PHP'

// Not working perfectly
        //console.log(str);

    // shortcut
    var chr = function (c) {
        return String.fromCharCode(c);
    };

    if (!str || str=="") {
        return chr(0);
    } else if (!this.is_scalar(str)) {
        return false;
    } else if (str.length < 8) {
        return false;
    }

    var decoded = "", tmp1 = "", tmp2 = "";
    var c = 0, i = 0, j = 0, a = 0;
    var line = str.split("\n");
    var bytes = [];

    for (i in line) {
        if (!line.hasOwnProperty(i)) {
          continue;
        }
        if (line[i].indexOf("begin 644 internal") >= 0) {
          continue;
        } else if (line[i].indexOf('end') === 0) {
          break;
        }
        console.log(i + ": " + line[i]);
        c = line[i].charCodeAt(0);
        bytes = line[i].substr(1);
        // Convert each char in bytes[] to a 6-bit
        for (j in bytes) {
            if (!bytes.hasOwnProperty(j)) {
              continue;
            }
            tmp1 = bytes[j].charCodeAt(0)-32;
            tmp1 = tmp1.toString(2);
            while (tmp1.length < 6) {
                tmp1 = "0" + tmp1;
            }
            if (tmp1 === '01110100') {
              console.log("Here's the t");
            }
            tmp2 += tmp1
        }
        console.log(i);
        console.log(typeof i);
        if (false && i === "2") {
          console.log("performing substitution");
          console.log(tmp2);
          tmp2 = "10000001000000100000000101100010011000000010010000001001101010011100000110001000000100000010000001000000000110010111010001000101010110000111010001000011011011110110110101101101011001010110111001110100100000000100001101110010011001010110000101110100011001010110010000100000011101110110100101110100011010000010000001000111010010010100110101010000010101111000000100001110";
}
        for (i=0; i<=(tmp2.length/8)-1; i++) {
            tmp1 = tmp2.substr(a, 8);
            if (tmp1 == "01100000") {
              console.log(decoded);
              decoded += chr(0);
            } else {

              console.log(tmp1);
              console.log(parseInt(tmp1, 2));
              console.log(chr(parseInt(tmp1, 2)));
              decoded += chr(parseInt(tmp1, 2));
            }
            a += 8;
        }
        a = 0;
        tmp2 = "";
    }
    return this.rtrim(decoded, "\0");
},
convert_uuencode: function (str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Ole Vrijenhoek
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   reimplemented by: Ole Vrijenhoek
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: is_scalar
  // *     example 1: convert_uuencode("test\ntext text\r\n");
  // *     returns 1: '0=&5S=`IT97AT('1E>'0-"@``'
  // shortcut
  var chr = function (c) {
    return String.fromCharCode(c);
  };

  if (!str || str == "") {
    return chr(0);
  } else if (!this.is_scalar(str)) {
    return false;
  }

  var c = 0,
    u = 0,
    i = 0,
    a = 0;
  var encoded = "",
    tmp1 = "",
    tmp2 = "",
    bytes = {};

  // divide string into chunks of 45 characters
  var chunk = function () {
    bytes = str.substr(u, 45);
    for (i in bytes) {
            if (!bytes.hasOwnProperty(i)) {
              continue;
            }
      bytes[i] = bytes[i].charCodeAt(0);
    }
    if (bytes.length != 0) {
      return bytes.length;
    } else {
      return 0;
    }
  };

  while (chunk() !== 0) {
    c = chunk();
    u += 45;

    // New line encoded data starts with number of bytes encoded.
    encoded += chr(c + 32);

    // Convert each char in bytes[] to a byte
    for (i in bytes) {
            if (!bytes.hasOwnProperty(i)) {
              continue;
            }
      tmp1 = bytes[i].charCodeAt(0).toString(2);
      while (tmp1.length < 8) {
        tmp1 = "0" + tmp1;
      }
      tmp2 += tmp1;
    }

    while (tmp2.length % 6) {
      tmp2 = tmp2 + "0";
    }

    for (i = 0; i <= (tmp2.length / 6) - 1; i++) {
      tmp1 = tmp2.substr(a, 6);
      if (tmp1 == "000000") {
        encoded += chr(96);
      } else {
        encoded += chr(parseInt(tmp1, 2) + 32);
      }
      a += 6;
    }
    a = 0;
    tmp2 = "";
    encoded += "\n";
  }

  // Add termination characters
  encoded += chr(96) + "\n";

  return encoded;
},

    handle: function (xtr) {
      var that = this,
        url = require("url"),
        querystring = require("querystring"),
        originalUrl = xtr.get("url"),
        args = url.parse(originalUrl).query,
        parsedArgs = querystring.parse(args),
        recordType = parsedArgs.recordType,
        recordId = parsedArgs.id,
        cookie = xtr.request.cookies.xtsessioncookie,
        session,
        sessionParams,
        response = xtr.get("response"),
        queryPayload,
        query;

      if ((recordType !== 'XM.File' && recordType !== 'XM.Image') || !recordId) {
        // XXX this still needs some work
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("Invalid request");
        response.end();
        return;
      }

      if (!cookie) {
        // XXX this still needs some work
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("You need a valid cookie!");
        response.end();
        return;
      }

      sessionParams = JSON.parse(cookie);
      if (!sessionParams.sid) {
        // XXX this still needs some work
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("You need a valid cookie!");
        response.end();
        return;
      }

      queryPayload = '{"requestType":"retrieveRecord","recordType":"%@","id":"%@"}'.f(recordType, recordId);
      query = "select xt.retrieve_record('%@')".f(queryPayload);

      //sessionParams.payload = JSON.parse(queryPayload); // XXX do I really need to pass the payload?

      session = X.Session.create(sessionParams);

      session.once("isReady", function () {
        session.query(query, function (err, res) {
          var content, data, filename, extension, fileDesc, encoding, buffer;

          if (err) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write("Error querying database");
            response.end();
          } else if (res.rowCount === 0) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write("Record not found");
            response.end();
          } else {
            content = JSON.parse(res.rows[0].retrieve_record);

            if (!content || !content.data) {
              response.writeHead(500, {"Content-Type": "text/plain"});
              response.write("Record content not found");
              response.end();
              return;
            }

            filename = content.description;
            extension = filename ? filename.substring(filename.lastIndexOf('.') + 1) : '';
            fileDesc = that.getContentType(extension);
            encoding = fileDesc.encoding;

            // pg represents bytea data as hex. For text data (like a csv file)
            // we need to read to a buffer and then convert to utf-8. For binary
            // data we can just send the buffer itself as data.
            //
            // The first two characters of the data from pg is \x and must be ignored

            // here's the wall. The following two lines of code should be used to decode files...
            //buffer = new Buffer(content.data.substring(2), "hex");
            //data = encoding === 'binary' ? buffer : buffer.toString(encoding);

            // ... and this line of code should be used to decode files, but it doesn't quite work.
            data = that.convert_uudecode(content.data);
            console.log(data);

            response.writeHead(200, {"Content-Type": fileDesc.contentType, "Content-Disposition": "attachment; filename = %@".f(filename) });
            response.write(data);
            response.end();
          }
        });
      });
    },

    handles: "file /file".w()
  });
}());
