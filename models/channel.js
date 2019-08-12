import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
  channel_id:          String,
  institution_name:    String,
});

const Channel = mongoose.model('Channel', ChannelSchema);

export { Channel }
