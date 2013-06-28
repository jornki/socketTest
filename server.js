/** 
Set up the basic server (http)
Set up Sockets (io)
Set up the file system (fs)
*/
var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	fs = require('fs');

/** Figure out the port or fall back to 1337 */
var port = process.env.PORT || 1337;

/** Start the server */
app.listen(port, function() {
	console.log('App listening on http://localhost:' + port);
});

// === FOR AZURE WEB ===
/** 
Azure websites doesn't support websockets
yet, so we force Sockets.IO to use Long-polling 
*/
/*io.configure(function () {
  io.set('transports', ['xhr-polling']);
});*/
//=======

/** The main application handler */
function handler(req, res) {
	
	// If the request is the html file or the root
	// serve the index.html file
	if (req.url.indexOf('.html') != -1 || req.url === '/') {
		fs.readFile(__dirname + '/index.html',

		function(err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}

			res.writeHead(200);
			res.end(data);
		});
	}
	
	// If the request is for a JavaScript file
	// server the client.js file
	if (req.url.indexOf('.js') != -1) {
		fs.readFile(__dirname + '/client.js',

		function(err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading client.js');
			}

			res.writeHead(200, {
				'Content-Type': 'text/javascript'
			});
			res.end(data);
		});
	}
}

/** 
Setup sockets
When Socket.IO has started
*/
io.sockets.on('connection', function(socket) {
	// .. emit a welcome message to the client
	// which is connecting
	socket.emit('message', {
		message: "Welcome to the chatroom"
	});
	// Listen for incoming messages from clients
	socket.on('send', function(data) {
		// Remove any tags from the message sent by the client
		// Nooo..we don't trust them, this is a server goddammit!
		// ..and you should do more work here if your going to use this!!
		data.message = data.message.replace(/(<([^>]+)>)/ig,"");
		// Send the message back to ALL connected clients
		io.sockets.emit('message', data);
	});
});
