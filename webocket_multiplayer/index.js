const http = require('node:http');
const app = require('express')();
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.listen(9091, () => {
  console.log('express app listening on port:9091');
});
const websocketServer = require('websocket').server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log('I am listtening on port:9090'));

//hasmap for the clients
const clients = {};
const games = {};
const wsServer = new websocketServer({
  httpServer: httpServer,
});
wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  connection.on('open', () => console.log('connection is open'));
  connection.on('close', () => console.log('connection is closed'));
  connection.on('message', (message) => {
    // I have recive a message from the client
    const result = JSON.parse(message.utf8Data);
    // a user want to create a new game
    if (result.method === 'create') {
      const clientId = result.clientId;
      const gameId = guid();
      games[gameId] = {
        id: gameId,
        balls: 20,
        clients: [],
      };

      const payLoad = {
        method: 'create',
        game: games[gameId],
      };

      // getting connection from clients hasmap throug client object
      const con = clients[clientId].connection;

      con.send(JSON.stringify(payLoad));
    }
    if (result.method === 'join') {
      const clientId = result.clientId;
      const gameId = result.gameId;
      const game = games[gameId];
      // if (!game) {
      //   console.error(`Game with ID ${gameId} does not exist.`);
      //   return;
      // }

      if (game.clients.length >= 3) {
        //sorry max players reach
        return;
      }
      const color = { 0: 'Red', 1: 'Green', 2: 'Blue' }[game.clients.length];

      game.clients.push({
        clientId: clientId,
        color: color,
      });
      const payLoad = {
        method: 'join',
        game: game,
      };
      game.clients.forEach((c) => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad));
      });
    }
  });

  const clientId = guid();

  clients[clientId] = {
    connection: connection,
  };

  const payLoad = {
    method: 'connect',
    clientId: clientId,
  };

  connection.send(JSON.stringify(payLoad));
});

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group
const guid = () =>
  (
    S4() +
    S4() +
    '-' +
    S4() +
    '-4' +
    S4().substr(0, 3) +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  ).toLowerCase();
