// Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset.
require("@babel/register")({
  presets: ["@babel/preset-env"]
});

// Import the rest of our application.
// require('./apps/generate_institutions.js')
require('./apps/generate_programs.js')
