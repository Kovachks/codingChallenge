var express = require("express");
var bodyParser = require("body-parser");
const socketIO = require('socket.io');
app = module.exports.app = express();
var PORT = process.env.PORT || 8000;
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

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))


const io = socketIO(server);



io.on('connection', (socket) => {
  console.log('Client connected');
      socket.on('refresh', function(data) {


        console.log('socket received the refresh message')

        io.emit('refreshData')
    })

  socket.on('disconnect', () => console.log('Client disconnected'));
});