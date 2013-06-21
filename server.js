/*var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(port);*/

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');
var port = process.env.PORT || 1337;

app.listen(port, function() {
	console.log('   app listening on http://localhost:' + port);
});

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
	
    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  socket.emit('ready', "Helloooo");
  socket.on('calculate', function (data) {
    socket.emit('calculated', parseInt(data) + 10);
  });
});