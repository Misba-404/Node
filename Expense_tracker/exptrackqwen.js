const { MongoClient, ObjectId } = require("mongodb");
const { loadEnvFile } = require("node:process");
const readline = require("readline/promises");
const fs = require("fs");
const path = require("path");

// Load environment variables (fallback to dotenv if node:process loadEnvFile is unavailable)
try {
  loadEnvFile(path.join(__dirname, ".env"));
} catch (err) {
  try {
    require("dotenv").config();
  } catch (e) {
    console.warn(
      "Warning: Could not load .env file. Ensure URL and DB_NAME are set.",
    );
  }
}

const url = process.env.URL || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "expense_tracker";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper to ensure the categories collection exists for the $lookup requirement
async function ensureCategoriesCollection(db) {
  const collections = await db
    .listCollections({ name: "categories" })
    .toArray();
  if (collections.length === 0) {
    const categoryCollection = db.collection("categories");
    const defaultCategories = [
      { _id: "Groceries", name: "Groceries" },
      { _id: "Transportation", name: "Transportation" },
      { _id: "Utilities", name: "Utilities" },
      { _id: "Entertainment", name: "Entertainment" },
      { _id: "Other", name: "Other" },
    ];
    await categoryCollection.insertMany(defaultCategories);
    console.log(
      "✅ Seeded default 'categories' collection for $lookup reports.",
    );
  }
}

async function addExpense(client, dbName) {
  console.log("\n--- Add Expense ---");
  const inUser = (await rl.question("username: ")).trim();
  const inCategory = (await rl.question("Category: ")).trim();
  const inAmountStr = (await rl.question("Amount: ")).trim();
  const inNote = (await rl.question("note: ")).trim();
  const inDate = (await rl.question("date (DD-MM-YYYY): ")).trim();

  const amount = Number(inAmountStr);

  if (!Number.isFinite(amount)) {
    console.log("❌ Error: Amount must be a valid numeric value.");
    return;
  }

  if (amount <= 0) {
    console.log("❌ Error: Amount must be a positive number.");
    return;
  }

  const newExpense = {
    user: inUser,
    category: inCategory,
    amount: amount,
    note: inNote,
    date: inDate,
  };

  try {
    const db = client.db(dbName);
    const collection = db.collection("expenseInfo");
    const result = await collection.insertOne(newExpense);
    console.log(`✅ Expense added successfully with ID: ${result.insertedId}`);
  } catch (error) {
    console.error("❌ Error saving expense to database:", error.message);
  }
}

async function deleteExpense(client, dbName) {
  console.log("\n--- Delete Expense ---");
  const idStr = (
    await rl.question("Enter the MongoDB Document ID to delete: ")
  ).trim();

  if (!ObjectId.isValid(idStr)) {
    console.log("❌ Error: Invalid MongoDB ObjectID format.");
    return;
  }

  try {
    const db = client.db(dbName);
    const collection = db.collection("expenseInfo");
    const result = await collection.deleteOne({ _id: new ObjectId(idStr) });

    if (result.deletedCount === 1) {
      console.log("✅ Expense deleted successfully.");
    } else {
      console.log("❌ Error: No expense found with the specified ID.");
    }
  } catch (error) {
    console.error("❌ Error deleting expense:", error.message);
  }
}

async function monthlyReport(client, dbName) {
  console.log("\n--- Monthly Report ---");
  try {
    const db = client.db(dbName);
    const collection = db.collection("expenseInfo");

    // Pipeline: match all -> group by MM-YYYY (extracted from DD-MM-YYYY) -> sort chronologically -> project
    const pipeline = [
      { $match: {} },
      {
        $group: {
          _id: { $substr: ["$date", 3, 7] }, // Extracts "MM-YYYY" from "DD-MM-YYYY"
          totalExpense: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } }, // Sort chronologically (string sort works for MM-YYYY)
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalExpense: { $round: ["$totalExpense", 2] },
        },
      },
    ];

    const results = await collection.aggregate(pipeline).toArray();

    if (results.length === 0) {
      console.log("📊 No expenses found to generate a report.");
      return;
    }

    console.log("📊 Monthly Expense Summary:");
    console.table(results);
  } catch (error) {
    console.error("❌ Error generating monthly report:", error.message);
  }
}

async function categoryBreakdown(client, dbName) {
  console.log("\n--- Category Breakdown ---");
  try {
    const db = client.db(dbName);
    const collection = db.collection("expenseInfo");

    // Pipeline uses $facet to get both grand total and category totals in one go,
    // then calculates the percentage share.
    const pipeline = [
      {
        $facet: {
          totalExpenses: [
            { $group: { _id: null, grandTotal: { $sum: "$amount" } } },
          ],
          categoryTotals: [
            { $group: { _id: "$category", total: { $sum: "$amount" } } },
            {
              $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "catDetails",
              },
            },
            {
              $unwind: {
                path: "$catDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      { $unwind: "$totalExpenses" },
      { $unwind: "$categoryTotals" },
      {
        $project: {
          _id: 0,
          category: {
            $ifNull: ["$categoryTotals.catDetails.name", "$categoryTotals._id"],
          },
          totalAmount: { $round: ["$categoryTotals.total", 2] },
          percentageShare: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$categoryTotals.total",
                      "$totalExpenses.grandTotal",
                    ],
                  },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
      { $sort: { totalAmount: -1 } },
    ];

    const results = await collection.aggregate(pipeline).toArray();

    if (results.length === 0) {
      console.log("📊 No expenses found to generate a breakdown.");
      return;
    }

    console.log("📊 Category Expense Breakdown:");
    console.table(results);
  } catch (error) {
    console.error("❌ Error generating category breakdown:", error.message);
  }
}

async function exportToCSV(client, dbName) {
  console.log("\n--- Export to CSV ---");
  try {
    const exportDir = path.join(__dirname, "exports");

    // Create export directory if it does not exist
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const fileName = `report-${Date.now()}.csv`;
    const filePath = path.join(exportDir, fileName);

    const db = client.db(dbName);
    const collection = db.collection("expenseInfo");
    const expenses = await collection
      .find({}, { projection: { _id: 0 } })
      .toArray();

    if (expenses.length === 0) {
      console.log("⚠️ No expenses to export.");
      return;
    }

    const writeStream = fs.createWriteStream(filePath);
    const header = "user,category,amount,note,date\n";

    writeStream.write(header);

    for (const exp of expenses) {
      // Escape quotes and wrap note in quotes to handle commas safely in CSV
      const safeNote = `"${(exp.note || "").replace(/"/g, '""')}"`;
      const row = `${exp.user},${exp.category},${exp.amount},${safeNote},${exp.date}\n`;
      writeStream.write(row);
    }

    writeStream.on("error", (err) => {
      console.error("❌ Stream error while writing CSV:", err.message);
    });

    writeStream.on("finish", () => {
      console.log(`✅ Export completed successfully!`);
      console.log(`📁 File saved at: ${filePath}`);
    });

    writeStream.end();
  } catch (error) {
    console.error("❌ Error exporting to CSV:", error.message);
  }
}

async function showMenu(client, dbName) {
  let exit = false;

  while (!exit) {
    console.log("\n========== EXPENSE TRACKER ==========");
    console.log("1. Add Expense");
    console.log("2. Delete Expense");
    console.log("3. Monthly Report");
    console.log("4. Category Breakdown");
    console.log("5. Export to CSV");
    console.log("6. Exit");

    const choice = (await rl.question("Choose an option: ")).trim();

    switch (choice) {
      case "1":
        await addExpense(client, dbName);
        break;
      case "2":
        await deleteExpense(client, dbName);
        break;
      case "3":
        await monthlyReport(client, dbName);
        break;
      case "4":
        await categoryBreakdown(client, dbName);
        break;
      case "5":
        await exportToCSV(client, dbName);
        break;
      case "6":
        console.log("Goodbye! 👋");
        exit = true;
        break;
      default:
        console.log(
          "❌ Invalid option. Please choose a number between 1 and 6.",
        );
    }
  }
}

async function connectAndRun() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log(`✅ Connected to database: ${dbName} successfully`);

    const db = client.db(dbName);

    // Ensure categories collection exists for the $lookup requirement
    await ensureCategoriesCollection(db);

    // Optional: Seed initial data if collection is empty (for testing)
    const expenseCollection = db.collection("expenseInfo");
    const count = await expenseCollection.countDocuments();
    if (count === 0) {
      const initialData = [
        {
          user: "jane_doe88",
          category: "Groceries",
          amount: 124.5,
          note: "Weekly grocery run",
          date: "28-10-2026",
        },
        {
          user: "michael_chen",
          category: "Transportation",
          amount: 25.0,
          note: "Uber ride",
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
      await expenseCollection.insertMany(initialData);
      console.log("✅ Seeded initial expense data for testing.");
    }

    // Start the interactive menu
    await showMenu(client, dbName);
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
  } finally {
    await client.close();
    rl.close(); // Gracefully terminate the readline interface
    console.log("🔌 Database connection closed.");
  }
}

// Start the application
connectAndRun();
