const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }))

const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

let postdata = '';

app.get('/', (request, response) => {
	response.sendFile(path.resolve('../client/index.html'));
});

app.post('/room', function(request, response) {
    response.sendFile(path.resolve('../client/room.html'));
    console.log(response.body);
    // postdata = response.body.username;
});

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
		// username: postdata
	};
	clientList.push(clientObj);

	// console.log(clientObj.username);

    let clientForMessage = {};
	clientForMessage = clientObj;
	delete clientForMessage.id;

    let connectedMessage = {
        status: 'newUserJoined',
        data: clientForMessage
    };

    console.log(stringifyJSON(connectedMessage));

	client.send(connectedMessage);

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

		//TODO: switch for message types
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

var stringifyJSON = function(object){
    // Base case: If not object and is a string,
    // wrap in quotes and return.
    // If not passed in (i.e., null),
    // return empty string.
    if(typeof object !== 'object' || object === null){
        if(typeof object === 'string'){
            object = '"' + object + '"';
        }
        return String(object);
    } else {
        // If object or array:
        var property = [];
        var value = [];
        var json = [];

        // Boolean that's toggling whether an array is passed in.
        var array = (object && object.constructor === Array);

        // For each key/value pair, if value is a string,
        // wrap in quotes and reassign. However,
        // if value is present and is, itself, an object,
        // recall function and pass it value (because it's an object).
        for(property in object){
            value = object[property];
            if(typeof value === 'string'){
                value = addEscapeChars(value);
                value = '"' + value + '"';
            } else if(typeof value === 'function' || typeof value === 'undefined'){
                delete object[property];
                return stringifyJSON(object);
            } else if(typeof value === 'object' && value !== null){
                value = stringifyJSON(value);
            }
            json.push((array ? '' : '"' + property + '":') + String(value));
        }
        // Wrap in appropriate bracket type and return.
        return (array ? '[' : '{') + String(json) + (array ? ']' : '}');
    }
};

var addEscapeChars = function(string){
    var result = [];
    var chars = string.split('');
    for(var i = 0, len = chars.length; i < len; i++){
        if(chars[i] === String.fromCharCode(34) ||
            chars[i] === String.fromCharCode(92) ){
            result.push(String.fromCharCode(92));
            result.push(chars[i]);
        } else {
            result.push(chars[i]);
        }
    }
    return result.join('');
};

app.listen('1616', () => console.log('API Server started and listening on port 1616'));