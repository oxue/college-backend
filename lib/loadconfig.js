const fs = require("fs");

module.exports = function(){
    console.log("loading config file");
    const configFile = fs.readFileSync("config.json");
    const config = JSON.parse(configFile);
    return config;
}