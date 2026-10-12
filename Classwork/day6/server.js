const http = require("http");
const fs = require("fs");
const server = http.createServer(function (req, res) {
  fs.readFile("user.txt", function (err, data) {
    if (err) throw err;
    res.write(data);
    function checkName(name) {
      if (data.includes(name)) {
        console.log(`The name:${name} was found `);
      } else {
        console.log(`The name ${name} was not found`);
      }
    }
    
    checkName("John");

    return res.end();
  });
});
server.listen(8080);
