const { WebSocket, WebSocketServer } = require('ws');
const http = require('http');
const uuidv4 = require('uuid').v4;
const words = ['Banana','Whisper','Sunshine','Puzzle','Cookie','Tornado','Unicorn','Jazz','Moonlight','Giggles','Backpack','Secret','Dinosaur','Bubbles','Enchanted','Magic','Pancake','Flamingo','Pineapple']
// Spinning the http server and the WebSocket server.
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

// I'm maintaining all active connections in this object
const clients = {};
// I'm maintaining all active users in this object
const users = {};

var currentGame = {
  guesser: '',
  gameName: '',
  guessCount: 0,
  password: ''
};
// User activity history.
let userActivity = [];

// Game Activity history
let gameActivity = [];

// Event types
const typesDef = {
  USER_EVENT: 'userevent',
  CONTENT_CHANGE: 'contentchange',
  GAME_EVENT: 'gameevent',
  START_GAME: 'startgame',
  SET_GUESSER: 'setguesser',
  PASSWORD: 'password'
}

function broadcastMessage(json) {
  // We are sending the current data to all connected clients
  const data = JSON.stringify(json);
  for(let userId in clients) {
    let client = clients[userId];
    if(client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  };
}

function handleMessage(message, userId) {
  const dataFromClient = JSON.parse(message.toString());
  const json = { type: dataFromClient.type };
  
  // START GAME AND TIMER
  if (dataFromClient.type === typesDef.START_GAME) {
    let time = 120;
    let countdown = setInterval(timer, 1000);
    function timer() {
        let min = Math.floor(time / 60);
        let sec = time % 60;
        console.log(`${min}:${sec}`);
        broadcastMessage({type: 'timerevent', data: `${min}:${sec}`});
        time--;
        if (min == 0 && sec == 0) clearInterval(countdown);
    }
  }

  // USEREVENT
  if (dataFromClient.type === typesDef.USER_EVENT) {
    users[userId] = dataFromClient;
    userActivity.push(`${dataFromClient.username} joined to play`);
    json.data = { users, userActivity };
  } else {
    currentGame.gameName = JSON.parse(message.toString()).content;
    json.data = { userActivity };
  }
  var tmpUsers = [];
    if (Object.keys(users).length === 2) {
      let key = Object.keys(users)[0];
      users[key].guesser = true;
      for ( let key in users) {
        tmpUsers.push({username: users[key].username, guesser: false});
        console.log('key', key)
      };
      let guesser = Object.values(users);
      tmpUsers[0].guesser = true;
      console.log('JSON: ', json);
    }
    // users[userId].guesser = true;
    json.data = {users, tmpUsers, userActivity};
  
  console.log('users: ', users);
  broadcastMessage(json);
}

function handleDisconnect(userId) {
    console.log(`${userId} disconnected.`);
    const json = { type: typesDef.USER_EVENT };
    const username = users[userId]?.username || userId;
    userActivity.push(`${username} left the game`);
    json.data = { users, userActivity };
    delete clients[userId];
    delete users[userId];
    currentGame = {};
    broadcastMessage(json);
}

// A new client connection request received
wsServer.on('connection', function(connection) {
  // Generate a unique code for every user
  const userId = uuidv4();
  console.log('Recieved a new connection');

  // Store the new connection and handle messages
  clients[userId] = connection;
  console.log(`${userId} connected.`);
  connection.on('message', (message) => handleMessage(message, userId));
  // User disconnected
  connection.on('close', () => handleDisconnect(userId));
});
