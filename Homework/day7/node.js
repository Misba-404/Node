let http = require("http");
let url = require("url");
let fs = require("fs");
let events = require("events");
let eventEmitter = new events.EventEmitter();

eventEmitter.on("pageViewed", function (page) {
  console.log(`This ${page} was viewed!`);
});

let server = http.createServer(function (req, res) {
  let q = url.parse(req.url, true);
  // let filename = "." + q.pathname;
  // let filename = "." + (q.pathname === "/" ? "/index.html" : q.pathname);
  let filename;

  if (q.pathname === "/home.html") {
    filename = "home.html";
  } else if (q.pathname === "/services.html") {
    filename = "services.html";
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    console.log("The page was not found");
    return res.end("Sorry, page not found!");
  }
  //
  fs.readFile(filename, function (err, data) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("Sorry, page not found!");
    }
    res.end(data);
    eventEmitter.emit("pageViewed", q.pathname);
  });
});
server.listen(8080);
