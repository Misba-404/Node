const http = require("http");
const server = http.createServer(function (req, res) {
  console.log("URL:", req.url);
  console.log("Method:", req.method);
  if (req.url === "/") {
    res.end("Welcome to ABC collage");
  } else if (req.url === "/about") {
    res.end("<h1>About ABC Collage</h1>");
  } else {
    res.statusCode = 404;
    res.statusMessage = "not Found";
    res.end("Page not foudn");
  }
});
server.listen(8080);
