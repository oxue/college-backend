const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://en.wikipedia.org/wiki/Rankings_of_universities_in_the_United_States';
const mongo  = require('mongodb').MongoClient;

const config = require("./../lib/loadconfig.js")();
const mongoUrl = config.mongoUrl;

rp(url)
  .then((html)=>{
    const data = $('table > tbody > tr > td > a', html);
  	const collegeData = data.map(function(i, e){
  		return {
  			"university_name": e.children[0].data,
  			"wiki_link": e.attribs.href
  		};
  	}).filter(function(i, e){
      return !e["wiki_link"].includes("/wiki/File") && !e["wiki_link"].includes("/wiki/Portal");
    }).get();

    // Connect to MongoDB now
    mongo.connect(mongoUrl, { useNewUrlParser: true }, (err, db)=>{
      if(err) {
        console.log("wasn't able to connect to the db");
        throw err;
      }
      colleges = db.db("college");
      for(let i = 0; i < collegeData.length; i++) {
        colleges
        .collection("college")
        .updateOne(collegeData[i], { $set: collegeData[i] }, { upsert:true });
      }
      db.close();
    })
  })
  .catch(function(err){
    //handle error
    console.log("Failed to load college data from wikipedia")
    throw err;
  });
