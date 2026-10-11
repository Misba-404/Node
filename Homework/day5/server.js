const http = require("http");
const server = http.createServer(function (req, res) {
  if (req.url === "/") {
    res.end("Welcome to our Homepage");
  } else if (req.url === "/about") {
    res.end("This is a simple nodel.js server.");
  } else if (req.url === "/contact") {
    res.end("Contact us at contact@example.com.");
  } else {
    res.end("404 Page not found");
  }
});
server.listen(3000);
