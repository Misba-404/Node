const fs = require("fs");
const { Buffer } = require("node:buffer");
const { ClientRequest } = require("node:http");

const buf1 = Buffer.from("Node.js buffers are powerfull");
const writtenBytes = buf1.write("FAST", 0, 4);
console.log(buf1.toString());
const buf2 = Buffer.from(" and flexible");

const bufConcat = Buffer.concat([buf1, buf2]);
console.log(bufConcat.toString());

fs.writeFile("buffer_output.txt", bufConcat, (err) => {
  if (err) {
    console.error("Error writing the file:", err);
    return;
  }
  console.log(`File created succesfuly!`);
});
