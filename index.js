const express = require("express");
const app = express();
const mongo = require('mongodb').MongoClient;
const config = require("./lib/loadconfig.js")();
const institution_email = require('./lib/institution_email.js');
const bodyParser = require('body-parser');
import { createUnactivatedUser, activateUser } from './lib/college_users.js';

const mongoUrl = config.mongoUrl;
const webPort = config.webPort;
app.use(bodyParser.json());
app.set('view engine', 'html');

app.get('/', function (req, res) {
  res.send("Hello");
});

const queryMongo = (queryMethod) => {
  mongo.connect(mongoUrl, { useNewUrlParser: true })
    .then(queryMethod)
    .catch(err => {
      if (err) {
        console.log("wasn't able to connect to the db");
        throw err;
      }
    });
}

app.get('/colleges', function (req, res) {
  queryMongo((db) => {
    const college = db.db("college");
    const response = college.collection("college").find({}).toArray(function (err, result) {
      res.json(result);
      db.close();
    });
  })
});

app.get('/blackademias', function (req, res) {
  queryMongo(db => {
    const college = db.db("college");
    const response = college.collection("blackademia").find({}).toArray(function (err, result) {
      res.json(result);
      db.close();
    });
  })
});

app.post('/activate' , (req, res) => {
  activateUser(req.body.email, req.body.activation_code).then(() => {
    res.status(200).json({})
  });
})

app.post('/registeremail', function(req, res) {
  //verify that the email is supported and derive the instution from it
  const institution = institution_email(req.body.email);
  if (!institution) {
    res.send(403, "institution not supported");
    return;
  }

  createUnactivatedUser(req.body.email, institution)
    .then((code)=>{
      res.status(200).json({msg:'acont created', verificationCode:code});
    });
})

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
