import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema({
  name:               String,
  institution:        String,
  description:        String
});

const Program = mongoose.model('Program', ProgramSchema);

export { Program }
