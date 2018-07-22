let usersList = document.getElementById('users');
let submitForm = document.getElementById('userform');

submitForm.addEventListener('submit', (event) => {
	event.preventDefault();

	document.getElementById('announcement').innerHTML = "Welcome to the room";

    let usernameInput = document.getElementById('username').value;

	let myData = {
		username: usernameInput,
		id: guid()
	};

	console.log(JSON.stringify(myData));

	let socket = new WebSocket('ws://localhost:8080');

    socket.addEventListener('error', function(message) {
        console.log('Wow guy, there was an error.');
        console.log('Here`s the error message:', message);
    });

    socket.addEventListener('open', function(message) {
        message['data'] = myData;
        console.log('Here`s the open message:', message);
    });

    socket.addEventListener('close', function(message) {
        console.log('Here`s the close message:', message);
    });

    socket.addEventListener('message', function(response) {
        console.log('Here`s the server message:', response);
        let message = response;
        message = JSON.parse(message);

        switch(message.type) {
        	case 'newUserJoined':
        	    hesesAllUsers(message.data);
        	    break;
        	case 'allusersList':
        	    break;
        	default:
        	    console.log('unknown situation');
        	    break;
        }

    });
});

function hesesAllUsers(data) {
    usersList.innerHTML += '<li><img src="' + data.img + '">' + data.username + '</li>';
}


function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();

};


function sendMessage() {
	console.log('SENDING MESSAGE...');
	socket.send(JSON.stringify(myData));
}

