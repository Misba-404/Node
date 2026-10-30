const readline = require("readline/promises");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const number = await rl.question("Enter a number for multiplication:");
  let i, j;

  for (i = 1; i <= 10; i++) {
    let result = i * number;
    console.log(`${i} x ${number} = ${result}`);
  }

  rl.close();
}
main();
