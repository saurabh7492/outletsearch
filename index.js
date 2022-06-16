const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const express = require("express");
const app = express();

require("dotenv").config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const port = 8080;

app.listen(port, () => {
  console.log(`Server Runing On Port ${port}`);
});

const mongoKey = process.env.MONGOKEY;
const mongoUsr = process.env.MONGOUSR;
const mongoCluster = process.env.MONGOCLUSTER;

const uri = `mongodb+srv://${mongoUsr}:${mongoKey}@${mongoCluster}`;

const client = new MongoClient(uri, { useNewUrlParser: true });

app.post("/search", (req, res) => {
  const user = req.body.userName;
  client.connect((err, db) => {
    if (err) {
      console.log("cannot connect db" + err);
      return;
    }
    console.log("DataBase connection made successfully");
    const options = {
      sort: "userName"
    };
    const collection = db.db().collection("UserData");
    // collection.findOne({ userName: user }, options, (err, doc) => {
    //   if (err) {
    //     console.log("cannot make query" + err);
    //     res.statusMessage = "Cannot Make Query";
    //     res.statusCode = 400;
    //     return;
    //   }
    //   let document = doc.userName;
    //   console.log(document);
    // });
    collection.find(
///here I created a regex using a template literal with the variable that holds the input
  { userName: { $regex: `.*${user}.*`, $options: "i" } },
  { userName: 1 })
/// then I use .forEach because if there was many coincidence I wanted to see all of them
.forEach(doc => {
  let usrName = doc.userName;
  let usrEmail = doc.email;
  let usrAge = doc.age;
///And at the end, I hold every value of the user that I wanted to save on an object called userInfo and I printed it on console.
  let userInfo = {
    usrName,
    usrAge,
    usrEmail
  };
  console.log(userInfo);
});
  });
});
