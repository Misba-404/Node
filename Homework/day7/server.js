const http = require("http");
const url = require("url");
const fs = require("fs");
const events = require("events");
const { Http2ServerResponse } = require("http2");

let eventEmitter = new events.EventEmitter();
eventEmitter.on("pageLoaded", function (page) {
  console.log(`${page} was loaded succesfully`);
});
http
  .createServer(function (req, res) {
    let q = url.parse(req.url, true);
    let filename = "." + q.pathname;
    if (q.pathname === "/about.html") {
      filename = "about.html";
    } else if (q.pathname === "/contact.html") {
      filename = "contact.html";
    } else {
      console.log("This page was not found");
      return res.end("Page Not Found");
    }
    fs.readFile(filename, function (err, data) {
      if (err) {
        res.writeHead(404, { "content-type": "text/html" });
        return res.end("404 Not found");
      }
      res.writeHead(200, { "content-type": "text/html" });
      eventEmitter.emit("pageLoaded", q.pathname);
      return res.end(data);
    });
  })
  .listen(8080);
