const { type } = require("os");
const { stdin, stdout, constrainedMemory } = require("process");
const readline = require("readline/promises");
const account = {
  accountNumber: "123456",
  pin: "1234",
  balance: 10000,
};
const transactions = [];
let withdrawalCount = 0;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function authenticate() {
  let attempts = 0;
  while (attempts <= 3) {
    const inputAcc = await rl.question("Enter Account number: ");
    const inputPin = await rl.question("Enter your pin: ");

    if (inputAcc == account.accountNumber && inputPin == account.pin) {
      console.log(`Login Successfull`);
      return true;
    }
    attempts += 1;
    // 3 is the max login attempts
    const remaining = 3 - attempts;
    if (remaining > 0) {
      console.log(
        `Invalid username or password. You have ${remaining} attempts remaining`,
      );
    }
  }
  console.log(`Maximum attempts Reached. try again later`);
  return false();
}

async function checkBalance() {
  const balance = account.balance;
  console.log(`Current Balance: ${balance}`);
}

async function withdraw() {
  if (withdrawalCount > 3) {
    console.log(`You have exceeded the  wothdrawaal limit per session`);
    return;
  }
  const inputAmount = await rl.question("Enter the amout to withdraw:");
  const amount = await Number(inputAmount);
  if (isNaN(amount) || amount <= 0) {
    console.log(`Invalid amount. Amount must be greater than zero`);
    return;
  }
  if (amount % 100 != 0) {
    console.log(`The amount must be a multiple of 100!`);
    return;
  }
  if (amount > account.balance) {
    console.log(`Insufficient balance!`);
    return;
  }

  // Success
  account.balance -= amount;
  withdrawalCount++;
  transactions.push({
    type: "Withdrawal",
    amount: amount,
    "Updated Balance": account.balance,
  });
  console.log(`Withdrawal of ${amount} is successfull`);
  console.log(`Remaining Balance:${account.balance}`);
}
