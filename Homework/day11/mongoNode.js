const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017/";
MongoClient.connect(url).then((client) => {
  const db = client.db("nodeTest");
  const collection = db.collection("leads");
  const myobj = [
    { name: "john", city: "trivandrum" },
    { name: "rahul", city: "calicut" },
    { name: "dean", city: "trivandrum" },
    { name: "ashwin", city: "calicut" },
    { name: "rolley", city: "alleppy" },
    { name: "nikhil", city: "kottayam" },
    { name: "raymond", city: "trivandrum" },
  ];

  const { MongoClient } = require("mongodb");
  const url = "mongodb://localhost:27017/";

  MongoClient.connect(url)
    .then((client) => {
      const db = client.db("mashupdb");
      const collection = db.collection("leads");

      const myobj = [
        { name: "john", city: "trivandrum" },
        { name: "rahul", city: "calicut" },
        { name: "dean", city: "trivandrum" },
        { name: "deepak", city: "kollam" },
        { name: "ashwin", city: "calicut" },
        { name: "rolley", city: "alleppy" },
        { name: "nikhil", city: "kottayam" },
        { name: "raymond", city: "trivandrum" },
      ];

      return collection
        .insertMany(myobj)
        .then(() => {
          console.log("Documents inserted");

          return collection
            .find({ city: "calicut" }, { projection: { _id: 0, name: 1 } })
            .toArray();
        })
        .then((result) => {
          console.log("Leads from Calicut:");
          result.forEach((lead) => console.log(lead.name));
        })
        .finally(() => client.close());
    })
    .catch((err) => {
      console.error(err);
    });
});
