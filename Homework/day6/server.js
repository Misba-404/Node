const http = require("http");
const fs = require("fs");
const server = http.createServer(function (req, res) {
  fs.readFile("profile.txt", function (err, data) {
    if (err) throw err;
    function checkProfile(name) {
      if (data.includes(name)) {
        console.log(`Profile verified`);
      } else {
        console.log(`Profile not verified`);
      }
    }
    checkProfile("Riya");
    res.end(data);
  });
});
server.listen(8080);
