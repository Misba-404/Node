let http = require("http");
let server = http.createServer(function (req, res) {
  res.write("hello");
  res.end();
});
server.listen(8080);
