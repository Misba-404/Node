const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017/";
const dbName = "atmNode";

const loginCreds = [
  {
    accountNumber: "123456",
    pin: "1234",
    balance: 10000,
  },
];

async function run() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("Connected to DB");

    const db = client.db(dbName);
    const collection = db.collection("accounts");

    await collection.deleteMany({});
    console.log("fresh collection loaded");

    const insertAccount = await collection.insertMany(loginCreds);
    console.log(`Number of docs inserted:${insertAccount.insertedCount}`);

    // display details
    // const displayAcc = await collection.find({}).toArray();
    // console.log(displayAcc);
    //
    const number = prompt("enter a numeber:");
  } catch (error) {
  } finally {
    client.close();
    console.log(`DB Connection closed successfully`);
  }
}
run();
