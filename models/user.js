import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email:              String,
  institution:        String,
  activation_code:    String,
  activated:          Boolean,
});

const User = mongoose.model('User', UserSchema);

export { User }
