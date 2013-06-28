(function() {
	"use strict";
	var socket, messageList, sendBtn, messageInput;

	/** Initiate the socket connection with the current URL */
	socket = io.connect(document.location.origin);

	/** Grab all DOM elements */
	messageList = document.getElementById('messageList');
	sendBtn = document.getElementById('sendBtn');
	messageInput = document.getElementById('messageInput');

	/** Listen for any messages from the server */
	socket.on('message', function(data) {
		// If the payload has a message
		if (data.message) {
			// Create a new list element
			// and push it to the chat list
			var msg = document.createElement('li');
			msg.innerHTML = data.message;
			messageList.appendChild(msg);
		}
	});

	/** Add an event listener to the send button */
	sendBtn.addEventListener('click', function(e) {
		// Send a message to the server
		// when the user clicks the send button
		var message = messageInput.value || "";
		// ..if there is any content
		if (message.length > 0) {
			socket.emit('send', {
				"message": messageInput.value
			});
		}
	});
}());
