const fs = require("fs");
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
    return res.end(data);
  });
server.listen(8080);
