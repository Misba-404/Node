const http = require("http");
const fs = require("fs");
const server = http.createServer(function (req, res) {
  fs.readFile("user.txt", function (err, data) {
    if (err) throw err;
    function checkName(name) {
      if (data.includes(name)) {
        console.log(`valid user`);
      } else {
        console.log(`Unknown user`);
      }
    }
    checkName("John");
     res.end(data);
  });
});
server.listen(8080);
