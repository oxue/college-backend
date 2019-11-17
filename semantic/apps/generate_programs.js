import "core-js/stable";
import "regenerator-runtime/runtime";
import { Program } from '../models/program.js'
import mongoose from "mongoose";

urls = [
  'https://uwaterloo.ca/future-students/programs'
]

async function run(){
  try {
    mongoose.connect("mongodb://127.0.0.1:27017/blackademia", { useNewUrlParser: true });

    //scapeProgramsFrom('https://uwaterloo.ca/future-students/programs', "University of Waterloo")

    let program = new Program({
      institution: "University of Waterloo",
      description: "descrasdasdf",
      name: "Computer Science"
    });

    await program.save()
    console.log(program)
  } catch (e) {
    console.log(e);
  }
  mongoose.connection.close()
}

run()
