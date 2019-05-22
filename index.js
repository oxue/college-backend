const express = require("express");
const app = express();
const mongo = require('mongodb').MongoClient;
const config = require("./lib/loadconfig.js")();

mongoUrl = config.mongoUrl;
webPort = config.webPort;

app.get('/', function (req, res) {
  res.send("Hello");
});

queryMongo = (queryMethod) => {
  mongo.connect(mongoUrl, { useNewUrlParser: true }, (err, db) => {
    console.log("mongo connection");
    if (err) {
      console.log("wasn't able to connect to the db");
      throw err;
    }
    queryMethod(db);
    console.log("query mongo success");
    db.close();
  })
}

app.get('/colleges', function (req, res) {
  queryMongo((db) => {
    colleges = db.db("college");
    response = colleges.collection("college").find({}).toArray(function (err, result) {
      res.json(result);
    });
  })
});

app.get('/blackademias', function(req, res) {
  queryMongo(db=>{
    colleges = db.db("college");
    response = colleges.collection("blackademia").find({}).toArray(function(err, result){
      res.json(result);
    });
  })
});

app.listen(webPort, function () {
  console.log("server started on port " + config.webPort);
});