import mongoose from "mongoose";

const InstitutionSchema = new mongoose.Schema({
  institution_name: String,
  wiki_link:        String
});

const Institution = mongoose.model('Institution', InstitutionSchema);

export { Institution }
