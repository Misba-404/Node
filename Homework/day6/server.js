const http = require("http");
const fs = require("fs");
const server = http.createServer(function (req, res) {
  fs.writeFile(
    "profile.txt",
    "Name: Riya\nAge: 22\nCity: Mumbai",
    function (err) {
      if (err) throw err;
      console.log("File Saved");
      fs.readFile("profile.txt", "utf-8", function (err, data) {
        if (err) throw err;
        let extractedName = data.split("\n")[0].replace("Name:", "").trim();
        function checkProfile(name) {
          if (extractedName === name) {
            console.log(`Profile verified`);
          } else {
            console.log(`Invalid Profile`);
          }
        }
        checkProfile("Riya");
        res.end(extractedName);
        fs.appendFile("profile.txt", "\nStatus:active", function (err) {
          if (err) throw err;
          console.log("File updated!");
          fs.rename("profile.txt", "verified_profile.txt", function (err) {
            if (err) throw err;
            console.log("File renamed!");
          });
        });
      });
    },
  );
});
server.listen(8080);
