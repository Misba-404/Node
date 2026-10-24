const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017/";
const dbName = "nodeBook";

const bookData = [
  { title: "Java Basics", author: "John", location: "Shelf A" },
  { title: "Node.js Guide", author: "Dean", location: "Shelf B" },
  { title: "Python 101", author: "Deepak", location: "Shelf D" },
  { title: "C++ Mastery", author: "Dean", location: "Shelf C" },
  { title: "Data Structures", author: "Ravi", location: "Shelf B" },
  { title: "React Handbook", author: "Derek", location: "Shelf D" },
];

async function run() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log(`Connected to db: ${dbName} Succesfully`);

    const db = client.db(dbName);
    const collection = db.collection("books");

    await collection.deleteMany({});
    console.log("Collection cleared Initially");

    const insertBook = await collection.insertMany(bookData);
    console.log(`No of docs inserted ${insertBook.insertedCount}`);

    const updateJavaLoc = await collection.updateOne(
      { title: "Java Basics" },
      { $set: { location: "Shelf Z" } },
    );
    console.log(`Updated Java basics location`);
    console.log(`Modified Count: ${updateJavaLoc.modifiedCount}`);

    // Update Books ny Dean
    const updateDeanLoc = await collection.updateMany(
      { author: "Dean" },
      { $set: { location: "Shelf E" } },
    );
    console.log(`Updated Books by Dean Location`);
    console.log(`Modified Count: ${(await updateDeanLoc).modifiedCounta}`);

    // Delete Python
    const deletePython = await collection.deleteMany({ title: "Python 101" });
    console.log("Deleted Python");
    console.log(`Deleted Count:${deletePython.deletedCount}`);

    const dltDbooks = await collection.deleteMany({ title: { $regex: /^D/ } });
    console.log("Deleted Books title starting with Letter 'D'");
    console.log(`Deleted docs count:${dltDbooks.deletedCount}`);

    const finalOut = await collection
      .find({}, { projection: { _id: 0 } })
      .toArray();
    console.log(`Remaining Books are :`);
    console.log(finalOut);

    // END
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Database connection closed");
    await client.close();
  }
}
run();
