const express = require("express");
const app = express();
const mongo = require('mongodb').MongoClient;
const config = require("./lib/loadconfig.js")();
const bodyParser = require('body-parser');

mongoUrl = config.mongoUrl;
webPort = config.webPort;
app.use(bodyParser.json());
app.set('view engine', 'html');

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
  })
}

app.get('/colleges', function (req, res) {
  queryMongo((db) => {
    college = db.db("college");
    response = college.collection("college").find({}).toArray(function (err, result) {
      res.json(result);
      db.close();
    });
  })
});

app.get('/blackademias', function (req, res) {
  queryMongo(db => {
    college = db.db("college");
    response = college.collection("blackademia").find({}).toArray(function (err, result) {
      res.json(result);
      db.close();
    });
  })
});

app.post('/admin/blackademia', (req, res) => {
  const name = req.body.name;
  const shortName = req.body.short_name;
  const isPublic = req.body.is_public;
  const channelUrl = req.body.channel_url;
  const requireConfirmedAccount = req.body.require_confirmed_account;

  queryMongo((db) => {
    const college = db.db("college");
    const channel = college.collection("channel");
    channel.findOne({ channelUrl }, (err, c) => {
      if (err) {
        console.log(err);
      }
      if (c == null) {
        const newChannel = {
          name,
          shortName,
          isPublic,
          channelUrl,
          requireConfirmedAccount
        }
        channel.insertOne(newChannel, (err, re) => {
          if (err) {
            console.log(err);
            res.send(401);
          } else {
            console.log("success");
            console.log(re);
            res.send(200)
          }
          db.close();
        });
      } else {
        res.send(403, "already exists");
      }
    });
  });
});

app.listen(webPort, function () {
  console.log("server started on port " + config.webPort);
});