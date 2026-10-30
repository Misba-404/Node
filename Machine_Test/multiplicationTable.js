const readline = require("readline/promises");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const number = await rl.question("Enter a number for multiplication:");
  console.log(`Your number is ${number}`);
  rl.close();
}
main();
