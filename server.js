// DEPENDENCIES	
var express = require('express');

// Server Stuff
var app = express();
var PORT = 3000;

// Static directory
app.use(express.static("public"));

// Routes
require("./routes/html-routes.js")(app);

// Start server
app.listen(PORT, function() {
	console.log("App listening on PORT " + PORT);
});