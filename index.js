const express = require("express");
const app = express();
const mongo  = require('mongodb').MongoClient;
const config = require("./lib/loadconfig.js")();

mongoUrl = config.mongoUrl;
webPort = config.webPort;

app.get('/', function(req, res){
    res.send("Hello");
});

app.get('/colleges', function(req, res){
    mongo.connect(mongoUrl, { useNewUrlParser: true }, (err, db)=>{
        console.log("mongo connection");
        if(err) {
          console.log("wasn't able to connect to the db");
          throw err;
        }
        colleges = db.db("college");
        response = colleges.collection("college").find({}).toArray(function (err, result){
            console.log(result[0]);
            res.json(result);
        });
        db.close();
      })
});

app.listen(webPort, function(){
    console.log("server started on port " + config.webPort);
});