const mongo = require("mongodb").MongoClient;
const config = require("./../lib/loadconfig.js")();
const mongoUrl = config.mongoUrl;
const mongoose = require("mongoose");
const Channel = require("../models/channel.js").Channel;

const newChannels = [
  {
    "institution_name": "University of Waterloo",
    "channel_id": "uwaterloo"
  },
  {
    "institution_name": "University of British Columia",
    "channel_id": "ubc"
  },
  {
    "institution_name": "Stanford University",
    "channel_id": "ustanford"
  }
]

mongoose.connect(mongoUrl + 'college')

for (let channelData of newChannels){
  const channel = new Channel(channelData);
  channel.save();
}

process.exit();
