"use strict";

var _explored = {
  matrix: [],
  initialized: false,
  width: 0,
  height: 0,
  VISITED: 1,

  visit: function visit(x, y) {
    var idx = x + this.width * y;
    this.matrix[idx] = this.VISITED;
  },
  visited: function visited(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return true;
    }
    var idx = x + this.width * y;
    return this.matrix[idx] === this.VISITED;
  },
  initialize: function initialize(maze, playerPos) {
    if (!_explored.initialized) {
      this.width = maze.width;
      this.height = maze.height;
      this.visit(playerPos.x, playerPos.y);
      this.initialized = true;
    }
  },
  explore: function explore(playerPos, displacement) {
    this.visit(playerPos.x + displacement.x, playerPos.y + displacement.y);
  },
  print: function print(n) {
    console.log("EXPLORED:" + n);
    for (var y = 0; y < this.height; y++) {
      var row = "";
      for (var x = 0; x < this.width; x++) {
        row += this.visited(x, y) ? "1" : "0";
      }
      console.log(row);
    }
  }

};

var MOV_VALID = 1;
var MOV_LESS_VALID = 2;
var TO_LEFT = "left";
var TO_RIGHT = "right";
var TO_TOP = "up";
var TO_BOTTOM = "down";

function _calcNextMovement(maze, playerPos) {
  _explored.initialize(maze, playerPos);
  _explored.print('before');

  // Default mov
  var nextMov = TO_RIGHT;

  // Basic inspection (try to survive!)
  var basicInspect = _basicInspect(maze, playerPos);

  console.log("    ");
  console.log("Basic inspect:", basicInspect);
  console.log("    ");

  if (basicInspect.valid.length) {
    nextMov = _getRandomValue(basicInspect.valid);
  } else if (basicInspect.lessValid.length) {
    nextMov = _getRandomValue(basicInspect.lessValid);
  }

  console.log("    ");
  console.log("Next mov:", nextMov);
  console.log("    ");

  // Historic
  _explored.explore(playerPos, _movVerbToVector(nextMov));
  _explored.print('after');

  return nextMov;
}

exports.calcNextMovement = _calcNextMovement;

/**
 * @desc For each direction, calculates if it is possible to move (2), possible but already explored (1) or not possible (0)
 */
function _basicInspect(maze, playerPos) {
  var atLeft = _basicPositionEval(maze, { x: playerPos.x - 1, y: playerPos.y });
  var atRight = _basicPositionEval(maze, { x: playerPos.x + 1, y: playerPos.y });
  var atTop = _basicPositionEval(maze, { x: playerPos.x, y: playerPos.y - 1 });
  var atBottom = _basicPositionEval(maze, { x: playerPos.x, y: playerPos.y + 1 });

  var valid = [],
      lessValid = [];

  _classifyMovOption(valid, lessValid, atLeft, TO_LEFT);
  _classifyMovOption(valid, lessValid, atRight, TO_RIGHT);
  _classifyMovOption(valid, lessValid, atTop, TO_TOP);
  _classifyMovOption(valid, lessValid, atBottom, TO_BOTTOM);

  return {
    valid: valid,
    lessValid: lessValid
  };
}

function _basicPositionEval(maze, position) {
  return {
    wall: maze.isWall(position.x, position.y),
    ghost: maze.isGhost(position.x, position.y),
    explored: _explored.visited(position.x, position.y)
  };
}

function _classifyMovOption(valid, lessValid, positionEvaluation, dir) {
  if (!positionEvaluation.wall && !positionEvaluation.ghost) {
    if (positionEvaluation.explored) {
      lessValid.push(dir);
    } else {
      valid.push(dir);
    }
  }
}

function _getRandomValue(list) {
  var idx = Math.floor(Math.random() * (list.length - 0.5));
  return list.length ? list[idx] : undefined;
}

function _movVerbToVector(mov) {
  if (mov === TO_LEFT) {
    return { x: -1, y: 0 };
  }
  if (mov === TO_RIGHT) {
    return { x: 1, y: 0 };
  }
  if (mov === TO_TOP) {
    return { x: 0, y: -1 };
  }
  if (mov === TO_BOTTOM) {
    return { x: 0, y: 1 };
  }
  return { x: 0, y: 0 };
}