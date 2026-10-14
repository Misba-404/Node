const formidable = require("formidable");
const http = require("http");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  //nodemailer cofnig and info
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "b7a5a05a73fc49",
    pass: "f09e0b2e181310",
  },
});

var server = http.createServer((req, res) => {
  if (req.url == "/fileupload" && req.method.toLowerCase() === "post") {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("An error occurred during the file upload");
        return;
      }

      var oldpath = files.filetoupload[0].filepath;
      var newpath = path.join(
        process.cwd(),
        "uploads",
        files.filetoupload[0].originalFilename,
      );

      console.log(oldpath);
      console.log(newpath);

      fs.rename(oldpath, newpath, function (err) {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("An error occurred while moving the file");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/plain" });
        // res.end('File uploaded and moved!');
        //nodemailer code below
        transport.sendMail(
          {
            from: "Private Person <from@example.com>",
            to: "A Test User <to@example.com>",
            subject: "File uploaded!",
            text: "A user uploaded a file to the support portal.\nA file has been uploaded by a user. Please check the server.",
          },
          (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log("Message sent: %s", info.messageId);
          },
        );
        console.log(` oldpath: ${oldpath}`);
        res.end("File uploaded, moved, and Email send");
      });
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(
      '<form action="/fileupload" method="post" enctype="multipart/form-data">',
    );
    res.write('<h1>Tech support</h1>')
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write("</form>");
    res.end();
  }
});

server.listen(8080, () => {
  console.log("Server listening on port 8080");
});
