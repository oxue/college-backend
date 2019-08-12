const mongo = require("mongodb").MongoClient;
const config = require("./../lib/loadconfig.js")();
const mongoUrl = config.mongoUrl;

newChannels = [
  {
    "college_name": "University of Waterloo",
    "channel_name": "uwaterloo"
  },
  {
    "college_name": "University of British Columia",
    "channel_name": "ubc"
  },
  {
    "college_name": "Stanford University",
    "channel_name": "ustanford"
  }
]

mongo.connect(mongoUrl, { useNewUrlParser: true }, (err, db)=>{
  if(err) {
    console.log("wasn't able to connect to the db");
    throw err;
  }
  colleges = db.db("college");
  for(let i = 0; i < newChannels.length; i++){
    let channel = newChannels[i];
    colleges
      .collection("channel")
      .updateOne(channel, {$set: channel}, {upsert:true});
  }
  db.close();
})
