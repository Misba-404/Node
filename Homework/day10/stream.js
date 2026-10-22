const fs = require("fs");

const introStream = fs.createReadStream("intro.txt");
const conclusionStream = fs.createReadStream("conclusion.txt");
const wrStream = fs.createWriteStream("full_report.txt");

const introChunks = [];
const conclusionChunks = [];

introStream.on("data", function (chunk) {
  introChunks.push(chunk);
});

introStream.on("end", function () {
  const introBuffer = Buffer.concat(introChunks);
  //conc stream start within intro
  conclusionStream.on("data", function (chunk) {
    conclusionChunks.push(chunk);
  });
  conclusionStream.on("end", function () {
    const conclusionBuffer = Buffer.concat(conclusionChunks);
    const finalBuffer = Buffer.concat([introBuffer, conclusionBuffer]);
    wrStream.write
    introStream.pipe(wrStream);
  });
});
