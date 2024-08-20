const http = require('http');
const WebSocektServer = require('websocket').server;
let connection;
const server = http.createServer((req, res) => {
  console.log('server is connected');
});

const websocket = new WebSocektServer({
  httpServer: server,
});

websocket.on('request', (request) => {
  connection = request.accept(null, request.origin);
  console.log('connecton is acepted to the websocket ');
  connection.on('open', () => console.log('connection is open'));
  connection.on('close', () => console.log('Closed !!!!'));
  connection.on('message', (message) => {
    console.log(`The message is: ${message.utf8Data}`);
    connection.sendUTF(`Server received: ${message.utf8Data}`);
  });
  sendEveryFiveSeconds();
});

server.listen(8080, () => {
  console.log('my server is listening on 8080');
});

function sendEveryFiveSeconds() {
  connection.send(`Message ${Math.random()}`);
  setTimeout(sendEveryFiveSeconds, 5000);
}
