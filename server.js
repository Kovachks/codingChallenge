// var config = require("./config/config.js")
var express = require("express");
var bodyParser = require("body-parser");
const socketIO = require('socket.io');
app = module.exports.app = express();
// const server = require('http').Server(app)
var PORT = process.env.PORT || 8000;
// var http = require('http').Server(app);
var http = require('http')

var server = http.createServer(app);




require('dotenv').config();

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("public"));

require("./routes/api-routes.js")(app);

require("./routes/html-routes.js")(app);

// require('./routes/api-routes.js')(io)

// app.listen(PORT, function() {
//     console.log("App listening on PORT " + PORT);
// });

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))


const io = socketIO(server);



io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);