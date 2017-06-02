const restify = require('restify');
const mazeBot = require('./mazeBot');

const server = restify.createServer();
server.use(restify.bodyParser());


function _onName(req, res, next) {
  res.status(200);
  res.contentType = 'json';

  const name = "egueto-" + (new Date()).getTime();
  const response = {
    name: name,
    email: "edgar.gueto@ext.privalia.com"
  };
  res.send(response);
}


function _onMove(req, res, next) {
  res.status(200);
  res.contentType = 'json';

  let moveResult = "right";
  try {
    const params = req.body || {};

    params.game = params.game || {};
    params.player = params.player || {};
    params.maze = params.maze || {};
    params.ghosts = params.ghosts || {};

    moveResult = mazeBot.processNextMovement(params);
  } catch(e) {
    console.error("EXCEPTION", e);
  }
  const response = {
    move: moveResult
  };
  res.send(response);
}

function _onHome(req, res, next) {
  res.status(200);
  res.contentType = 'json';

  const response = {
    hello: "This is an API for Privalia Code Challenge 2017 - egueto"
  };
  res.send(response); 
}

server.get('/', _onHome);
server.get('/name', _onName);
server.post('/name', _onName);
server.post('/move', _onMove);

server.listen(8080, function () {});
