import "core-js/stable";
import "regenerator-runtime/runtime";
import * as request from 'request-promise'
import cheerio from 'cheerio'
import { Institution } from '../models/institution.js'
import mongoose from "mongoose";
const $ = cheerio

const url = 'https://en.wikipedia.org/wiki/Rankings_of_universities_in_the_United_States';
const config = require("./../../lib/loadconfig.js")();
const mongoUrl = config.mongoUrl;

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/blackademia", { useNewUrlParser: true });

    const html = await request.get(url)
    const data = $('table > tbody > tr > td > a', html);
    const institutions = data.map((i, e) => {
      return {
        "institution_name": e.children[0].data,
        "wiki_link": e.attribs.href
      }
    })
    .filter((i, e) => !e["wiki_link"].includes("/wiki/File") && !e["wiki_link"].includes("/wiki/Portal"))
    .map((i, e) => new Institution(e)).get();

    const results = await Promise.all(institutions.map(e => e.save()))
    console.log(results)
    mongoose.connection.close()
  } catch (e) {
    throw e
  }
}

run()
