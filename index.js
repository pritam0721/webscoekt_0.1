const http = require('http');
const { server: WebSocketServer} = require('websocket');

const httpServer = http.createServer((req, res) => {
    console.log('we received a request');
});

const websocket = new WebSocketServer({
    httpServer: httpServer,
});




httpServer.listen(8080, () => {
    console.log('My server is listening on port 8080');
});
websocket.on("request", request => {
    const connection = request.accept(null, request.origin);
    console.log('WebSocket connection accepted.');

    connection.on("open", () => console.log("Opened !!!!"));
    connection.on("close", () => console.log("Closed !!!!"));
    connection.on("message", message => {
        console.log(`The message is: ${message.utf8Data}`);
        connection.sendUTF(`Server received: ${message.utf8Data}`);
    });
    sendevery5seconds(connection);
});

function sendevery5seconds(connection){

    connection.send(`Message ${Math.random()}`);
    setTimeout(()=>sendevery5seconds(connection), 5000);
}
