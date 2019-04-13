const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3006
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

io.on('connection', (socket) => {
    console.log('connected');
    socket.on('send', function (data) {
        io.sockets.emit('new', data);
    });
})

app.post('/postid', function (req, res) {
    var msg = req.body.msg;
    console.log("received msg: " + msg);
    console.log('connected, post from python')
    io.sockets.emit('new', msg);
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end()
});

app.post('/testpostid', function (req, res) {
    
    var rfid = req.body.rfid;
    var date_time = req.body.date_time;

    io.sockets.emit('incoming_record', {
        rfid : rfid,
        date_time : date_time
    });
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end()

});

server.listen(port, () => {
    console.log(`listening to port ${port}`);
})
