const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://en.wikipedia.org/wiki/Rankings_of_universities_in_the_United_States';
const mongo  = require('mongodb').MongoClient;

const mongo_url = "mongodb://127.0.0.1:27017/";

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
    mongo.connect(mongo_url, (err, db)=>{
      if(err) {
        console.log("wasn't able to connect to the db");
        throw err;
      }
      colleges = db.db("college");
      for(let i = 0; i < collegeData.length; i++) {
        colleges
        .collection("college")
        .update(collegeData[i], collegeData[i], {upsert:true});
      }
    })
  })
  .catch(function(err){
    //handle error
    console.log("Failed to load college data from wikipedia")
    throw err;
  });