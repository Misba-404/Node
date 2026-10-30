const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const number = rl.question("Enter a number for multiplication:");
console.log(number);
