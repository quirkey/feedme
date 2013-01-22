var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    five = require("johnny-five"),
    events = require("events"),
    util = require("util"),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    _ = require('underscore');


// Use imagesnap to get the machines camera and pipe to stdout
function getCameraImage(callback) {
  console.log("image snapping");
   return exec("imagesnap -w 3 - | convert - -quality 70 -format jpeg -strip -width 600x -", callback);
}

// FEEDER OBJECT
function Feeder(pin) {
  this.board = new five.Board();
  this.pin = pin;
  this.board.on("ready", function() {
    this.servo = new five.Servo({
      pin: pin,
      range: [40, 150]
    });
    this.firmata = this.board.firmata;
    this.mode = this.firmata.MODES.SERVO;
    this.board.repl.inject({
      servo: this.servo,
      feeder: this
    });
    this.servo.min();
    this.disable();
  }.bind(this));
}

util.inherits(Feeder, events.EventEmitter);

Feeder.prototype.disable = function() {
  setTimeout(function() {
    this.board.pinMode(this.pin, 1);
  }.bind(this), 1000);
};

Feeder.prototype.enable = function() {
  this.board.pinMode(this.pin, this.mode);
};

Feeder.prototype.feed = function(seconds) {
  this.enable();
  this.servo.sweep();
  this.emit('feeding');
  setTimeout(function() {
    this.servo.stop();
    this.emit('done-feeding');
    setTimeout(function() {
      this.servo.min();
      this.disable();
    }.bind(this), 2000);
  }.bind(this), 1000 * seconds);
};

var feeder = new Feeder(9);

io.sockets.on('connection', function (socket) {
  socket.on('feed', function() {
    console.log('FEED');
    feeder.feed(10);
  });
  feeder.on('feeding', function() {
    console.log("FEEDING");
    socket.emit('feeding');
  });
  feeder.on('done-feeding', function() {
    console.log("DONE FEEDING");
    socket.emit('done-feeding');
  });
});

// EXPRESS APP //

app.use('/js', express['static'](__dirname + '/js'));
app.use('/css', express['static'](__dirname + '/css'));
app.use('/img', express['static'](__dirname + '/img'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/camera', function(req, res) {
  res.type('image/jpeg');
  getCameraImage(function(err, stdout, stderr) { res.send(200, stdout) });
});

// Boot
server.listen(4330);
console.log("Web Listening on 4330");
