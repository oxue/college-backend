const mongo = require("mongodb").MongoClient;
const config = require("./../lib/loadconfig.js")();
const mongoUrl = config.mongoUrl;

newBlackademias = [
  {
    "college_name": "University of Waterloo",
    "blackademia_url": "/b/uwaterloo"
  },
  {
    "college_name": "University of British Columia",
    "blackademia_url": "/b/ubc"
  },
  {
    "college_name": "Stanford University",
    "blackademia_url": "/b/ustanford"
  }
]

mongo.connect(mongoUrl, { useNewUrlParser: true }, (err, db)=>{
  if(err) {
    console.log("wasn't able to connect to the db");
    throw err;
  }
  colleges = db.db("college");
  for(let i = 0; i < newBlackademias.length; i++){
    let blackademia = newBlackademias[i];
    colleges
      .collection("blackademia")
      .updateOne(blackademia, {$set: blackademia}, {upsert:true});
  }
  db.close();
})