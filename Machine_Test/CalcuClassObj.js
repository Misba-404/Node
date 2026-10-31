const readline = require("readline/promises");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
// const { addListener } = require("node:cluster");

class Calculator {
  constructor(num1, num2) {
    this.num1 = num1;
    this.num2 = num2;
  }
  addition() {
    return console.log("Sum:", this.num1 + this.num2);
  }
  substraction() {
    return console.log("Difference:", this.num1 - this.num2);
  }
  multiplication() {
    return console.log("Product:", this.num1 * this.num2);
  }
  division() {
    return console.log("Result:", this.num1 / this.num2);
  }
}

async function main() {
  const fnum = Number(await rl.question("Enter the First number:"));
  const snum = Number(await rl.question("Enter the second number:"));
  // obj
  const calc = new Calculator(fnum, snum);
  console.log("CALCULATOR");
  console.log("1.Addition");
  console.log("2.Substarction");
  console.log("3.Multiplication");
  console.log("4.Division");
  const choice = await rl.question("Choose an operation (1-4):");

  switch (choice) {
    case "1":
      await calc.addition();
      break;
    case "2":
      await calc.substraction();
      break;
    case "3":
      await calc.multiplication();
      break;
    case "4":
      await calc.division();
      break;
    default:
      console.log("Choose a valid number from 1-4");
      break;
  }
  rl.close();
}
main();
