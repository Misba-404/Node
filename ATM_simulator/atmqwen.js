const readline = require("readline/promises");

// In-memory account details (No database allowed)
const account = {
  accountNumber: "123456",
  pin: "1234",
  balance: 10000,
};

// Session state
let transactionHistory = [];
let successfulWithdrawalsCount = 0;
const MAX_LOGIN_ATTEMPTS = 3;
const MAX_WITHDRAWALS_PER_SESSION = 3;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper to format currency (handles the '?' artifact from the prompt, assuming ₹ or $)
const formatCurrency = (amount) => `₹${amount.toLocaleString()}`;

// 1. User Authentication
async function authenticate() {
  let attempts = 0;
  while (attempts < MAX_LOGIN_ATTEMPTS) {
    const accountInput = await rl.question("Enter your account number: ");
    const pinInput = await rl.question("Enter your 4 digit Pin: ");

    if (accountInput === account.accountNumber && pinInput === account.pin) {
      console.log("\nLogin successful!\n");
      return true;
    }
    
    attempts++;
    const remaining = MAX_LOGIN_ATTEMPTS - attempts;
    if (remaining > 0) {
      console.log(`Invalid credentials. ${remaining} attempt(s) remaining.\n`);
    }
  }
  
  console.log("Maximum login attempts reached. Terminating program.");
  return false;
}

// 3. Check Balance
function checkBalance() {
  console.log(`\nYour current balance is: ${formatCurrency(account.balance)}\n`);
}

// 4. Withdraw Money
async function withdraw() {
  if (successfulWithdrawalsCount >= MAX_WITHDRAWALS_PER_SESSION) {
    console.log(`\nError: You have reached the maximum limit of ${MAX_WITHDRAWALS_PER_SESSION} successful withdrawals per session.\n`);
    return;
  }

  const amountStr = await rl.question("Enter withdrawal amount: ");
  const amount = Number(amountStr);

  if (isNaN(amount) || amount <= 0) {
    console.log("Error: Invalid amount. Please enter a number greater than zero.\n");
    return;
  }

  if (amount % 100 !== 0) {
    console.log("Error: Withdrawal amount must be a multiple of ₹100.\n");
    return;
  }

  if (amount > account.balance) {
    console.log("Error: Insufficient balance.\n");
    return;
  }

  // Successful withdrawal
  account.balance -= amount;
  successfulWithdrawalsCount++;
  transactionHistory.push({
    type: "WITHDRAWAL",
    amount: amount,
    balanceAfter: account.balance,
  });

  console.log(`\nWithdrawal successful!`);
  console.log(`Remaining balance: ${formatCurrency(account.balance)}\n`);
}

// 5. Deposit Money
async function deposit() {
  const amountStr = await rl.question("Enter deposit amount: ");
  const amount = Number(amountStr);

  if (isNaN(amount) || amount <= 0) {
    console.log("Error: Invalid amount. Please enter a numeric value greater than zero.\n");
    return;
  }

  // Successful deposit
  account.balance += amount;
  transactionHistory.push({
    type: "DEPOSIT",
    amount: amount,
    balanceAfter: account.balance,
  });

  console.log(`\nDeposit successful!`);
  console.log(`New balance: ${formatCurrency(account.balance)}\n`);
}

// 6. Transaction History
function viewTransactionHistory() {
  console.log("\n========== TRANSACTION HISTORY ==========");
  if (transactionHistory.length === 0) {
    console.log("No transactions made in this session.");
  } else {
    transactionHistory.forEach((tx, index) => {
      console.log(
        `${index + 1}. ${tx.type.padEnd(9)} | ${formatCurrency(tx.amount).padEnd(6)} | Balance: ${formatCurrency(tx.balanceAfter)}`
      );
    });
  }
  console.log("=========================================\n");
}

// 2. ATM Menu
async function showMenu() {
  let exit = false;
  while (!exit) {
    console.log("========== SMART ATM ==========");
    console.log("1. Check Balance");
    console.log("2. Withdraw Money");
    console.log("3. Deposit Money");
    console.log("4. View Transaction History");
    console.log("5. Exit");
    console.log("===============================");

    const choice = await rl.question("Choose an option: ");

    switch (choice.trim()) {
      case "1":
        checkBalance();
        break;
      case "2":
        await withdraw();
        break;
      case "3":
        await deposit();
        break;
      case "4":
        viewTransactionHistory();
        break;
      case "5":
        console.log("\nThank you for using Smart ATM. Goodbye!");
        exit = true;
        break;
      default:
        console.log("\nError: Invalid option. Please choose a number between 1 and 5.\n");
    }
  }
}

// Main execution flow
async function run() {
  try {
    const isAuthenticated = await authenticate();
    if (isAuthenticated) {
      await showMenu();
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  } finally {
    rl.close();
  }
}

run();