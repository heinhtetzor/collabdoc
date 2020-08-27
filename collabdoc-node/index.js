const express = require('express');
const app = express();
const { port, dbport, host, user, password, database } = require('./env.js');
const server = app.listen(port, () => console.log(`Listening at 5500`));

// mysql
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host,
  dbport,
  user,
  password,
  database
});

connection.connect();

connection.query('SELECT * FROM snapshots', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});


const io = require('socket.io').listen(server);
io.on('connection', socket => {
  //initial load
  connection.query('SELECT * FROM snapshots WHERE id = 1', function(error, results, fields) {
    if(error) throw error;
    console.log(results[0].doc)
    socket.emit('docUpdated', results[0].doc);
  })  
  socket.on('docUpdate', d => {
    connection.query({
      sql: 'UPDATE `snapshots` SET `doc`=? WHERE id=1 AND user="John Doe"',
      values: [d]
    }, function(error, results, fields) {
      if(error) throw error;
      socket.broadcast.emit('docUpdated', d);
      // connection.end();
    })
  })
  // socket.on('typeEvent', word => {
  // //   connection.query(`UPDATE snapshots SET doc=${word} WHERE id = 1 AND user = "John Doe"`, (error, results, fields) => {
  // //     if (error) throw error;
  // //     console.log('Good');
  // //     socket.broadcast.emit('w', word);
  // //     connection.end();
  // //   })
  // // })
  // socket.broadcast.emit('w', word);
  // })
})
