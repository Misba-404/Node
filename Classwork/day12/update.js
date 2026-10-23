const { MongoClient } = require("mongodb");
const { dirname } = require("node:path");
const { name } = require("nodemailer/lib/package-info.js");
const url = "mongodb://localhost:27017/";
const dbName = "NodeUpdate";
// MongoClient.connect(url).then((client) => {
//   const db = client.db("NodeUpdate");
//   const sampleRegistrations = [
//     { name: "John", city: "Trivandrum" },
//     { name: "Deepak", city: "Kollam" },
//     { name: "Dean", city: "Trivandrum" },
//     { name: "Rahul", city: "Calicut" },
//     { name: "Ashwin", city: "Calicut" },
//     { name: "Rolly", city: "Alleppy" },
//     { name: "Nikhil", city: "Kottayam" },
//     { name: "Raymond", city: "Trivandrum" },
//     { name: "Dean", city: "Calicut" },
//   ];
//   //   return db
//   //     .collection("registrations")
//   //     .insertMany(sampleRegistrations)
//   //     .then((res) => {
//   //       console.log("Number of documents inserted:" + res.insertedCount);
//   //       client.close();
//   //     })
//   //     .catch((err) => {
//   //       console.error(err);
//   //       client.close();
//   //     });

// });
const sampleRegistrations = [
  { name: "John", city: "Trivandrum" },
  { name: "Deepak", city: "Kollam" },
  { name: "Dean", city: "Trivandrum" },
  { name: "Rahul", city: "Calicut" },
  { name: "Ashwin", city: "Calicut" },
  { name: "Rolly", city: "Alleppy" },
  { name: "Nikhil", city: "Kottayam" },
  { name: "Raymond", city: "Trivandrum" },
  { name: "Dean", city: "Calicut" },
];
async function run() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("Connected succesfully to Mongodb");

    const db = client.db(dbName);
    const collection = db.collection("registrations");
    // to delete clear collection before updating

    await collection.deleteMany({});
    console.log("collection cleared!");

    const insertResult = await collection.insertMany(sampleRegistrations);
    console.log(`Number of docs inserted:${insertResult.insertedCount}`);

    const updateJohn = await collection.updateOne(
      { name: "John" },
      { $set: { name: "Johny", city: "chennai" } },
    );
    console.log(`Updated John:${updateJohn.modifiedCount} documents modified!`);

    const updateDeanCity = await collection.updateMany(
      { name: "Dean" },
      { $set: { city: "Kollam" } },
    );
    console.log(
      `Updated Dean:${updateDeanCity.modifiedCount} documents modified!`,
    );

    const deleteDeepak = await collection.deleteOne({ name: "Deepak" });
    console.log(
      `Deleted Deepak registration:${deleteDeepak.deletedCount} document(s) updated`,
    );

    // to remove all with 'D'
    const deleteAllD = await collection.deleteMany({ name: { $regex: /^D/ } });
    console.log(
      `Deleted ${deleteAllD.deletedCount} documents starting with 'D'`,
    );
    const finalOut = await collection.find({},{projection:{_id:0}}).toArray();
    console.log("Remaining registrations are :\n");
    console.log(finalOut);

    //
  } catch (err) {
    console.error("An error occured", err);
  } finally {
      console.log("Database connection closed");
    await client.close();
  }
}
run();
