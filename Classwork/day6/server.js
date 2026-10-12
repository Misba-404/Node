const http = require("http");
const fs = require("fs");
const server = http.createServer(function (req, res) {
  fs.read("user.txt", function (err, data) {
    if (err) throw err;
    res.write(data);
    return res.end();
  });
});
server.listen(8080)