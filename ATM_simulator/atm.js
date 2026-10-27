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

// auth
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
  return false;
}

// Balance
async function checkBalance() {
  const balance = account.balance;
  console.log(`Current Balance: ${balance}`);
}

// Withdraw
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

// Deposit
async function deposit() {
  const depositAmount = await rl.question("Enter Amount you want to deposit:");
  const amount = await Number(depositAmount);
  if (isNaN(amount) || amount <= 0) {
    console.log(`Enter a valid amount greater than 0 for deposit`);
    return;
  }

  // Success
  account.balance += amount;
  transactions.push({
    type: "Deposit",
    amount: amount,
    "Updated Balance": account.balance,
  });
  console.log(`Deposit of ${amount} is successfull `);
  console.log(`Updated Balance: ${account.balance}`);
}

// transactions
async function displayTransactions() {
  console.log(`========== TRANSACTION HISTORY ==========
`);
  console.table(transactions);
}

// Show menu
async function showMenu() {
  let exit = false;
  while (exit == false) {
    console.log("========== SMART ATM ==========");
    console.log("1. Check Balance");
    console.log("2. Withdraw Money");
    console.log("3. Deposit Money");
    console.log("4. View Transaction History");
    console.log("5. Exit");
    const option = await rl.question("Choose an option:");
    switch (option) {
      case "1":
        checkBalance();
        break;
      case "2":
        withdraw();
        break;
      case "3":
        deposit();
        break;
      case "4":
        displayTransactions();
        break;
      case "5":
        exit = true;
        console.log(`Thanks for using the ATM. Please visit again!`);
        break;
      default:
        console.log("invalid option. choose an option between 1 and 5.");
        break;
    }
  }
}

//
async function run() {
  try {
    authenticate();
    if (authenticate) {
      showMenu();
    }
    console.log("Sorry invalid ");
  } catch (error) {
    console.error(error);
  } finally {
    rl.close();
  }
}
run();
