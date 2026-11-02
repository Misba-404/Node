const { name } = require("nodemailer/lib/package-info.js");
const { exit } = require("process");
const readline = require("readline/promises");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const studentDetials = [
  { id: 1, name: "rajesh" },
  { id: 2, name: "rahul" },
  { id: 3, name: "sruthi" },
];

async function main() {
  while (true) {
    const input = await rl.question(
      "Enter the id number of the student to fetch details:",
    );
    const id = Number(input);

    if (id < 1 || id > 3) {
      console.log("ENter a valid id number (1-3)");
      continue;
    }
    console.table(studentDetials[id - 1]);
    break;
  }
  rl.close();
}
main();

// console.table("Id:" + studentDetials[idNumber - 1].id);
// console.table("Name:" + studentDetials[idNumber - 1].name);
