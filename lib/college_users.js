const mongo = require('mongodb').MongoClient;
const config = require("./loadconfig.js")();
const sgMail = require('@sendgrid/mail');
import { User } from "../models/user.js"
sgMail.setApiKey("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");

const mongoUrl = config.mongoUrl;

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

const activateUser = (email, activationCode) => new Promise((resolve, reject) => {
  queryMongo(db => {
    User.findOne({email}).then(user=>{
      if (user.activation_code == activationCode) {
        user.activated = true;
        user.save().then(()=>resolve());
      }
    })
    // clean up user data
  })
});

const generateActivationCode = () => {
  return 1234;
}

const sendActivationEmail = (email, code) => {
  const msg = {
    to: email,
    from: 'test@example.com',
    subject: 'Blackademia account acivation',
    text: 'your activation code is ' + code,
    html: '<strong>' + code + '</strong>',
  };
  sgMail.send(msg);
}

const createUnactivatedUser = (email, institution) => new Promise((resolve, reject) => {
  queryMongo(db => {
    User.findOne({email}).then((user)=>{
      if (user) {
        resolve("exists");
      } else {
        const activationCode = generateActivationCode();
        user = new User({
          email:email,
          institution: institution,
          activation_code: activationCode,
          activated: false
        });
        user.save().then(()=>{
          sendActivationEmail(email, activationCode);
        }).catch(err => {
          console.log(err);
        });
      }
    }).catch((err)=>{
      console.log(err);
    });
  });
});

export { createUnactivatedUser, activateUser }
