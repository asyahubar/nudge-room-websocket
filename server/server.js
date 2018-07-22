const app = require('express');
const bodyParser = require('body-parser');

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });


var clientList = [];

server.on('connection', function(client) {
	console.log('a new client is here!');
    // console.log(client.data.username);

    let imageIndex = Math.floor(Math.random() * 6);
    let imagePath = "img/" + imageIndex + ".png";

    let clientObj = {
    	img: imagePath,
		client: client,
		id: guid(),
		username: "will be added later",
	};

	clientList.push(clientObj);

    let forMessage = {};
	forMessage = clientObj;
	delete forMessage.id;

    let connectedMessage = {
    	type: 'newUserJoined',
		data: forMessage,
        forConsole: 'new user has joined'
	};

    connectedMessage = JSON.stringify(connectedMessage);

    console.log(connectedMessage);

	// client.send(connectedMessage);

	client.on('close', function(ws) {
		console.log('User has left. :(');

		client.close();
		clientList.forEach((user, key) => {
			if (user.client === client) {
				clientList.splice(key, 1);
			}
		});
	});

	client.on('message', function(message) {
		console.log('here`s a message from client:', message);
		message = JSON.parse(message);

		clientList.forEach((user, key) => {

			user.client.send(message.username);
		});

	});
});

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();

};