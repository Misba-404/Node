const http = require("http");
const fs = require("fs");
const server = http.createServer(function (req, res) {
  fs.readFile("profile.txt", "utf-8", function (err, data) {
    if (err) throw err;
    let extractedName = data.split("\\n")[0].replace("Name:", "").trim();
    function checkProfile(name) {
      if (extractedName === name) {
        console.log(`Profile verified`);
      } else {
        console.log(`Profile not verified`);
      }
    }
    checkProfile("Riya");
    res.end(extractedName);
  });
});
server.listen(8080);
