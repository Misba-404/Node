const { name } = require("nodemailer/lib/package-info.js");
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
  const idNumber = await rl.question(
    "Enter the id number of the student to fetch details:",
  );
  // console.table(studentDetials[idNumber -1]);
  console.table("Id:" + studentDetials[idNumber - 1].id);
  console.table("Name:" + studentDetials[idNumber - 1].name);
}
main();
