const express = require('express');
const socketIO = require('socket.io');
const app = express();
const PORT = '9000';

app.get('/', (req, res) => {
    res.send('socket.io server');
});

const server = app.listen(PORT, () => {
    console.log(`socket.io server is running on port: ${PORT}`);
});

const io = socketIO.listen(server);
io.on('connection', (client) => {
    console.log('client connected.');

    client.on('donate', () => { // เมื่อมีการบริจาคเข้ามาจาก browser
        console.log('donate success.');
        client.broadcast.emit('reload');
        // io.emit('reload'); // ส่งไปให้ทุกๆ client โหลดข้อมูลใหม่ทาง browser
    });
});