const { MongoClient, MongoChangeStreamError, Collection } = require("mongodb");
const { error } = require("node:console");
const url = "mongodb://localhost:27017/";

MongoClient.connect(url).then((client) => {
  const db = client.db("NodeUpdate");
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
  return db
    .collection("registrations")
    .insertMany(sampleRegistrations)
    .then((res) => {
      console.log("Number of documents inserted:" + res.insertedCount);
      client.close();
    })
    .catch((err) => {
      console.error(err);
      client.close();
    });
});
