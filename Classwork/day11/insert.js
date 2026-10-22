const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017/";
MongoClient.connect(url)
  .then((client) => {
    const db = client.db("MonogNode");
    const collection = db.collection("leads");
    const myobj = [
      { name: "Arjun", city: "Kannur" },
      { name: "Meera", city: "Kochi" },
      { name: "Lakshmi", city: "Calicut" },
    ];
    return collection
      .insertMany(myobj)
      .then(() => {
        console.log("Documents inserted");
        return collection.findOne(
          { city: "Kochi" },
          { projection: { _id: 0, name: 1, city: 1 } },
        );
      })
      .then((result) => {
        console.log(result);
        client.close();
      });
  })
  .catch((err) => {
    console.error(err);
  });
