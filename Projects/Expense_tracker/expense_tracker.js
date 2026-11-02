const { MongoClient } = require("mongodb");
const { loadEnvFile } = require("node:process");
loadEnvFile("/home/misbah/Documents/Mashup/Node/Expense_tracker/.env");
const readline = require("readline/promises");

const url = process.env.URL;
const dbName = process.env.DB_NAME;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const expenseData = [
  {
    user: "jane_doe88",
    category: "Groceries",
    amount: 124.5,
    note: "Weekly grocery run at Supreme",
    date: "28-10-2026",
  },
  {
    user: "michael_chen",
    category: "Transportation",
    amount: 25.0,
    note: "Uber ride to MashupStack",
    date: "27-10-2026",
  },
  {
    user: "jane_doe88",
    category: "Utilities",
    amount: 85.2,
    note: "Monthly electricity bill",
    date: "25-10-2026",
  },
];

async function connectAndInsert() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log(`Connected to db:${dbName} Successfully`);
    const db = client.db(dbName);
    const collection = db.collection("expenseInfo");
    //to clear existing collections
    await collection.deleteMany({});
    console.log(`Collection cleared initially`);

    const insertExpense = await collection.insertMany(expenseData);
    console.log(
      `inserted ${(await insertExpense).insertedCount} docs of expense data `,
    );
    const dispaly = await collection
      .find({}, { projection: { _id: 0 } })
      .toArray();
    console.table(dispaly);
    //
  } catch (error) {
    console.error(error);
  }
}

async function addExpense() {
  console.log("Add expense by Filling the appropriate details below");
  const inUser = await rl.question("username:");
  const inCategory = await rl.question("Category:");
  const inAmount = await rl.question("Amount:");
  const inNote = await rl.question("note:");
  const indate = await rl.question("date:");
  const amount = Number(inAmount);
  if (amount < 0) {
    console.log(`Amount must be a positive number`);
    return;
  }
  if (!Number.isFinite(amount)) {
    console.log(`Amount must be valid numeric value`);
    return;
  }

  // success
  expenseData.push({
    user: inUser.trim(),
    category: inCategory.trim(),
    amount: amount.trim(),
    note: inNote.trim(),
    date: indate.trim(),
  });
  console.log(`Expense added successfully`);
}
