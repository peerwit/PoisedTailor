// Simple Boards implementation by Pranay
	// v 0.0.1 (01/29/15)

// BOARD CLASS - gives you a new playable board DEPENDS on Graphyc.js
var Board = function(m, n, operation, target, difficulty) {
	this.state = this.board = [[]];
	this._create(m, n, operation, target, difficulty);
	this.score = 0;
	this.__render = false;
	this.__map = {board: 'state', state: 'board'};
}


// Takes a string or an array and gets board attributes
// WILL mutate array
Board.prototype.get = function(attr) {
	var that = this;
	if (typeof attr === 'string'){
		return this[attr];
	}
	else if (typeof attr === 'object' && Array.isArray(attr)){
		return attr.map(function(e) {
			return this[e];
		}.bind(this));
	}
	else {
		throw new Error('attribute must be an array or a string')
	}
}

Board.prototype.set = function(attr, val) {
	if (attr in this.__map) {
		this[this.__map[attr]] = val
	}
	this[attr] = val;
}

	
Board.prototype.operationsList = Board.prototype.opsList = {
	add:function (a, b){return a + b},
	addition:function (a, b){return a + b},
	sub:function (a, b){return a - b},
	subtraction:function (a, b){return a - b},
	multiplication:function (a, b) {return a * b},
	div:function (a, b) {return a / b},
	division:function (a, b) {return a / b},
	modulo:function (a, b) {return a % b},
	mod:function (a, b) {return a % b}
}

Board.prototype._create = function(m, n, operation, target, difficulty) {
	this.rows = m || this.rows || 12;
	this.cols = n || this.cols || 6;
	this.target = this.target || target || 9;
	this.op = this.operation = operation || this.op || this.opsList.add;
	this.opName = operation || "addition";
	this.diff = this.difficulty = difficulty || this.diff || 1;
	this.state = this.board = this._makeBoard(this.rows, this.cols);
	this._isPlayable()?null:this._refresh();
	return this;
}

Board.prototype.swap = Board.prototype.makeSwap = function(t1, t2, cb, cb2){
	if (!t1 || !t2){throw new Error ('cannot call swap without two tuples')}
	if (typeof t1 !== 'object' || typeof t2 !== 'object'){throw new Error ('cannot call swap without two tuples')}
	if (!t1.length || !t2.length){throw new Error ('cannot call swap without two tuples')}
	if (t1.length !== 2 || t2.length !== 2){throw new Error ('cannot call swap without two tuples')}

	if (!this.isValidSwap(t1,t2)) {
		throw new Error ('has inValid swap. Call the isValidSwap fn before calling swap.')
	}

	cb = cb || function(){};
	cb2 = cb2 || function(){};

	var array = this.idMatches(t1, t2).concat(this.idMatches(t2,t1));
	// console.log("FDs", array, this.idMatches(t1, t2), this.idMatches(t1, t2));
	// swaps the tuples on the board
	var temp = this._get(t1);
	this._set(t1, this._get(t2));
	this._set(t2, temp);

	// callback for interacting with the nodes which operate to the target
	cb(array);
	this._regenConsumedNodes(array);
	this._isPlayable()?null:this._refresh();
	this.score += (1000 * array.length);
	return this;
}

Board.prototype.swapForce = function(t1, t2, cb, cb2){
	if (!t1 || !t2){throw new Error ('cannot call swap without two tuples')}
	if (typeof t1 !== 'object' || typeof t2 !== 'object'){throw new Error ('cannot call swap without two tuples')}
	if (!t1.length || !t2.length){throw new Error ('cannot call swap without two tuples')}
	if (t1.length !== 2 || t2.length !== 2){throw new Error ('cannot call swap without two tuples')}

	if (!this.isValidSwap(t1,t2)) {
		throw new Error ('has inValid swap. Call the isValidSwap fn before calling swap.')
	}

	cb = cb || function(){};
	cb2 = cb2 || function(){};

	var array = this.idMatches(t1, t2).concat(this.idMatches(t2,t1));
	// console.log("FDs", array, this.idMatches(t1, t2), this.idMatches(t1, t2));
	// swaps the tuples on the board
	var temp = this._get(t1);
	this._set(t1, this._get(t2));
	this._set(t2, temp);

	// callback for interacting with the nodes which operate to the target
	cb(array);
	this._regenConsumedNodes(array);
	this.score += (1000 * array.length);
	return this;
}

// Come back to if time allows
// Board.prototype.setRange = function() {
// 	var op = this.operation;
// 	var diff = this.difficulty;

// };

Board.prototype.generateRandom = Board.prototype.ran = function() {
	var range = this.range;
	var target = this.target;
	return Math.floor(Math.random()*(this.range[1] - this.range[0])) + this.range[0];
}

Board.prototype.isInBounds = function(tuple, board) {
	board = board || this.board;
	// console.log(board.length - 1, board[0].length - 1);
	if (+tuple[0] > (board.length - 1) || +tuple[0] < 0 || +tuple[1] > (board[0].length - 1) || +tuple[1] < 0) {
		return false;
	}
	return true;
} 

// Pass in two arrays t1 = [i1, j1] &&  t2 = [i2, j2]
Board.prototype.isValidSwap = Board.prototype.isValid = function(t1, t2){
	if (!this.isInBounds(t1) || !this.isInBounds(t2)) {
		return false;
	}

	if (this._getNeighbors(t2).map(function(e) {return JSON.stringify(e)}).indexOf(JSON.stringify(t1)) === -1) {
		console.log("got one!")
		return false;
	}
	// console.log(t1,t2);
	return this.operatesToTarget(t1, t2) || this.operatesToTarget(t2, t1);
}

Board.prototype.operatesToTarget = Board.prototype.operates = function(t1, t2, target, operation, board){
	target = target || this.target;
	operation = operation || this.operation;
	board = board || this.board;
	var that = this;
	var val1 = this._get(t1);
	var val2 = this._get(t2);
	var n1 = this._getNeighbors(t1);
	var n2 = this._getNeighbors(t2);
	var flag = n1.some(function(e) {
		return operation(val2, that._get(e)) === target;
	});
	if (flag) {return flag}
	flag = n2.some(function(e) {
		return operation(val1, that._get(e)) === target;
	})
	if (flag) {return flag}
	return false;
}

Board.prototype.autoSwapper = function(cb){
	target = target || this.target;
	operation = operation || this.operation;
	board = this.board;
	var that = this;
	this._iterate(function(tuple) {
		var n = that._getNeighbors(tuple);
		for (var i = 0; i < n.length; i++) {
			that.isValidSwap(tuple, n[i]) ? cb(tuple, n[i]) : null;
		}
	});

}

Board.prototype.idMatches = function(currentTuple, proposedTuple, target, operation, board) {
	target = target || this.target;
	operation = operation || this.operation;
	board = board || this.board;
	var that = this;
	var tuple = currentTuple;
	var rA = this._getNeighbors(currentTuple).filter(function(e) {
		// Check for array deep equality to ensure that the proposedTuple returns false
		if (JSON.stringify(JSON.parse(JSON.stringify(e))) !== JSON.stringify(JSON.parse(JSON.stringify(proposedTuple)))) {
			var a = that._get(e);
			var b = that._get(proposedTuple);
			return that.op(a,b) === target;
		}
		return false
	}).concat([currentTuple]);
	return rA.length < 2 ? [] : rA;
}


// private methods not intended to be called directly
Board.prototype._get = function(tuple) {
	return this.board[tuple[0]][tuple[1]];
}

Board.prototype._set = function(tuple, val) {
	this.board[tuple[0]][tuple[1]] = val;
	return true;
}

Board.prototype._makeBoard = function(m,n) {
	var board = [];
	for(var i = 0; i < m; i++) {
		board[i] = [];
		for (var j = 0; j < n; j++) {
			board[i][j] = null;
		}
	}
	this.state = this.board = board;
	this._init();
	this._removeMatches();
	return this.board;
}

Board.prototype._regenConsumedNodes = function(array) {
	var board = this.board;
	var that = this;
	array.forEach(function(e) {
		that._set(e, that.ran());
	})
	array.forEach(function(e) {
		that._updateIfMatch(e);
	})
	return this;
}

Board.prototype._isPlayable = function() {
	var that = this, grandFlag = false;
	this._iterateWithBreak(bfs2.bind(that));
	return grandFlag;

	function bfs2(tuple) {
		var target = this.target;
		var board = this.state;
		var op = this.op;
		var neighbors = this._getNeighbors(tuple);
		var that = this;
		var val = board[tuple[0]][tuple[1]];
		// console.log(tuple, val, board);
		var flag = neighbors.some(function(e) {
			var n2s = that._getNeighbors(e);
			return n2s.some(function(n2e) {
				if (JSON.stringify(tuple) !== JSON.stringify(n2e)) {
					// console.log(op(val, board[n2e[0]][n2e[1]]) === target ? n2e+"p"+tuple : null);
					return op(val, board[n2e[0]][n2e[1]]) === target;
				}
			})
		})
		if (flag) {
			grandFlag = true;
		}
		return !flag;
	}
}

Board.prototype._refresh = function() {
	// console.log('refreshing', this.rows, this.cols)
	this._create(this.rows,this.cols);
	while(!this._isPlayable()){this._makeBoard(this.rows, this.cols)}
	// console.log(this.board);
	if (this.__render) {
		this._render();
	}
}

Board.prototype._setBoardInit = Board.prototype._init =  function(min, max){
	this.range = [(min||0), (max||9)];
	// this.target = this.range[0] + this.range[1];
	var board = this.state;
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			board[i][j] = this.ran(); 
		}
	}
	return this;
}

Board.prototype._iterate = Board.prototype._each = function(cb) {
	var board = this.state; 
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			cb([i,j]); 
		}
	}
}

Board.prototype._iterateWithBreak = Board.prototype._eachWithBreak = function(cb) {
	var board = this.state; 
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			var flag = cb([i,j]);
			if (!flag) {return;} 
		}
	}
}

Board.prototype._filter = function(cb) {
	var board = this.state; 
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			board[i][j] = cb(board[i][j]) ? board[i][j]: null; 
		}
	}
}

Board.prototype._map = function(cb) {
	var board = this.state; 
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			board[i][j] = cb(board[i][j]); 
		}
	}
}

Board.prototype._eachOnNeighbors = function(tuple, cb) {
	this._getNeighbors(tuple).forEach(function(e) {
		cb(tuple, e);
	})
}

Board.prototype._filterOnNeighbors = function(tuple, cb) {
	var neighbors = [];
	neighbors.push([tuple[0] + 1, tuple[1]]);
	neighbors.push([tuple[0] - 1, tuple[1]]);
	neighbors.push([tuple[0], tuple[1] - 1]);
	neighbors.push([tuple[0], tuple[1] + 1]);

	neighbors = neighbors.filter(function(e) {
		return this.isInBounds(e);
	});
	var results = [];
	neighbors.forEach(function(e) {
		results.push(cb(tuple, e));
	})
	return results;
}

Board.prototype._getNeighbors = function(tuple) {
	var neighbors = [];
	neighbors.push([tuple[0] + 1, tuple[1]]);
	neighbors.push([tuple[0] - 1, tuple[1]]);
	neighbors.push([tuple[0], tuple[1] - 1]);
	neighbors.push([tuple[0], tuple[1] + 1]);
	var that = this;
	return neighbors.filter(function(e) {
		return that.isInBounds(e);
	});
}


Board.prototype._updateIfMatch = function(tuple){
	var neighborValHash = {};
	var board = this.state;
	var flag = false;
	var that = this;
	this._eachOnNeighbors(tuple, function(c, n) {
		if (that.op(board[c[0]][c[1]], board[n[0]][n[1]]) === that.target) {
			flag = true;
		}
		neighborValHash[board[n[0]][n[1]]] = board[n[0]][n[1]];
	})
	flag ? (board[tuple[0]][tuple[1]] = update(board[tuple[0]][tuple[1]], that.op, that.target)) : null;
	this.board = board;


	function update(val, fn, target) {
		var keys = Object.keys(neighborValHash);
		var hash = {};
		var flag = false;
		while(checkAll() && (val in hash)) {
			val = that.ran();
		}
		return val;
		function checkAll(){
			for (var i = 0; i < keys.length; i++) {

				if (fn(+val, +keys[i]) === target) {
					hash[val] = true;
					return true
				}
			}
			return false;
		}
	}
}

Board.prototype._removeMatches = function() {
	this._iterate(this._updateIfMatch.bind(this));
}

Board.prototype.genId = function(tuple) {
	//
}

// var readline = require('readline');

// var rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question("", function(tuples) {
// 	var a = tuples.split("p")
// 	var t1 = JSON.parse(a.shift());
// 	var t2 = JSON.parse(a.shift());
// 	console.log("IS VALID", b1.isValidSwap(t1,t2));
// 	console.log(b1.isValidSwap(t1,t2)?null:"CANNOT SWAP");
// 	b1.swap(t1,t2);
// 	console.log(b1.get(['state', 'target']));
// 	// rl.close();
// });

// ----
var b1 = new Board(2, 4);
b1.set('state', [[1,0,1,0],[0,0,0,0]]);
b1.set('target', 2);
b1.swap([0,0],[0,1])
console.log(b1.get('state'), "+++", b1.get('target'));




/* How to use the board api..

# Instantiate a new Board (new Board())
# Get Board for rendering
# Use user DOM events to swap (call isValidSwap before swapping) -- feedback on whether or not isValidSwap should be called is welcome
# Get Board to re-render 

## Todo points system and timer (should it sync with the server?)

*/




// var testboard = new Board();
// testboard.board = [[1,0,1,0],[0,0,0,0]];
// console.log(testboard.board)
// testboard.target = 2;
// testboard.swap([0,0],[0,1]);
// console.log(testboard.board);



