const fs = require("fs");
const data = "Books are a uniquely portable magic.";

const wrStream = fs.createWriteStream("book.txt");
wrStream.write(data, "utf-8");
wrStream.end();

wrStream.on("finish", function () {
  console.log("Writing has completed!");
  const rdStream = fs.createReadStream("book.txt");
  rdStream.setEncoding("utf-8");

  rdStream.on("data", function (chunk) {
    console.log(chunk);
  });

  rdStream.on("end", function () {
    console.log("Reading has completed");
  });

  rdStream.on("error", function (err) {
    console.error("Error occured on reading : ", err.message);
  });
});

wrStream.on("error", function (err) {
  console.error("Error occur on writing: ", err);
});
