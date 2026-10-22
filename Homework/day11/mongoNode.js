const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017/";
MongoClient.connect(url).then((client) => {
  const db = client.db("nodeTest");
  const collection = client.collection("leads");
  const myobj = [
    { john: "trivandrum" },
    { rahul: "calicut" },
    { dean: "trivandrum" },
    { ashwin: "calicut" },
    { rolley: "alleppy" },
    { nikhil: "kottayam" },
    { raymond: "trivandrum" },
  ];
});
