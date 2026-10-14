var formidable = require("formidable");
var http = require("http");
var fs = require("fs");
var path = require("path");

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
        res.end("File uploaded and moved!");
      });
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(
      '<form action="/fileupload" method="post" enctype="multipart/form-data">',
    );
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write("</form>");
    res.end();
  }
});

server.listen(8080, () => {
  console.log("Server listening on port 8080");
});
