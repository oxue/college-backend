const mongo = require('mongodb').MongoClient;
const config = require("./loadconfig.js")();
const sgMail = require('@sendgrid/mail');
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
    const college = db.db("college");
    const user = college.collection("user");

    user.findOne({email}).then((useraccount) => {
      if (useraccount.activation_code == activationCode) {
        user.updateOne({email}, {$set: {activated: true}}).then(() => {
          resolve();
        })
      }
    })

    // clean up user data
  })
});

const createUnactivatedUser = (email, institution) => new Promise((resolve, reject) => {
  queryMongo(db => {
    const college = db.db("college");
    const user = college.collection("user");
    user.findOne({email}).then((useraccount) => {
      if (useraccount) {
        resolve("exists");
        return;
      }
      user.insertOne({
        email:email,
        institution: institution,
        activation_code: 1234,
        activated: false
      }).then(re=>{
          const msg = {
            to: email,
            from: 'test@example.com',
            subject: 'Blackademia account acivation',
            text: 'your activation code is ' + 1234,
            html: '<strong>' + 1234 + '</strong>',
          };
          sgMail.send(msg);
          resolve(1234);
      }).catch(err=>{
        console.log(err);
        reject(err)
      }).finally(() => {
          db.close();
      });
    });
  });
});

export { createUnactivatedUser, activateUser }
