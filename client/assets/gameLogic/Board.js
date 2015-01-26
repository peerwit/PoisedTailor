// Simple Boards implementation by Pranay and Alex Tseung
	// v 0.0.1 (01/23/15)

var Board = function() {
	this.state = this.board = [[]];
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

Board.prototype.create = function(m, n, operation, difficulty) {
	this.rows = m || 12;
	this.cols = n || 6;
	this.op = this.operation = operation || this.opsList.add;
	this.diff = this.difficulty = difficulty || 1;
	this.state = this.board = this._makeBoard(this.rows, this.cols);
	return this;
}

// Come back to if time allows
// Board.prototype.setRange = function() {
// 	var op = this.operation;
// 	var diff = this.difficulty;

// };


Board.prototype.getValueAtTuple = Board.prototype.getVal =  function(tuple){
	return this.board[tuple[0]][tuple[1]];
}

Board.prototype.generateRandom = Board.prototype.ran = function() {
	var range = this.range;
	var target = this.target;
	return Math.floor(Math.random()*(this.range[1] - this.range[0])) + this.range[0];
}

Board.prototype.isInBounds = function(tuple, board) {
	board = board || this.board;
	if (tuple[0] > board.length - 1 || tuple[0] < 0 || tuple[1] > board[0].length - 1 || tuple[1] < 0) {
		return false;
	}
	return true;
} 

// Pass in two arrays t1 = [i1, j1] &&  t2 = [i2, j2]
Board.prototype.isValidSwap = Board.prototype.isValid = function(t1, t2){
	// are t1 && t2 neighbors ? continue; break;
	if (!this.isInBounds(t1) || !this.isInBounds(t2)) {
		return false;
	}
	else {
		return this.operatesToTarget(t1, t2) || this.operatesToTarget(t2, t1);
	}
}

Board.prototype.operatesToTarget = Board.prototype.operates = function(currentTuple, proposedTuple, target, operation, board){
	target = target || this.target;
	operation = operation || this.operation;
	board = board || this.board;
	var tuple = currentTuple;
	return !!this.isMatch(tuple, proposedTuple).length
}

Board.prototype.swap = Board.prototype.makeSwap = function(t1, t2){
	if (!t1 || !t2){throw new Error ('cannot call swap without two tuples')}
	if (typeof t1 !== 'object' || typeof t2 !== 'object'){throw new Error ('cannot call swap without two tuples')}
	if (!!t1.length || !!t2.length){throw new Error ('cannot call swap without two tuples')}
	if (t1.length !== 2 || t2.length !== 2){throw new Error ('cannot call swap without two tuples')}

	if (!this.isValidSwap(t1,t2)) {
		throw new Error ('has inValid swap. Call the isValidSwap fn before calling swap.')
	}

	return this.idMatches(t1)

}

Board.prototype.idMatches = function(currentTuple, proposedTuple, target, operation, board) {
	target = target || this.target;
	operation = operation || this.operation;
	board = board || this.board;

	var tuple = currentTuple;
	var neighbors = [];
	neighbors.push([tuple[0] + 1, tuple[1]]);
	neighbors.push([tuple[0] - 1, tuple[1]]);
	neighbors.push([tuple[0], tuple[1] - 1]);
	neighbors.push([tuple[0], tuple[1] + 1]);

	neighbors = neighbors.filter(function(e) {
		return this.isInBounds(e);
	});

	return neighbors.filter(function(e) {
		var a = this.getVal(e);
		var b = this.getVal(proposedTuple);
		return this.op(a,b) === target;
	}).concat([tuple]);
}

Board.prototype.d3ify = function(){
	var al = this.al;
	al.map(function(e,i,a) {
		return {name: i, children: e, somePop: {} }
	})
	return al;
}



// private methods not intended to be called directly
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
	return board;
}

Board.prototype._setBoardInit = Board.prototype._init =  function(min, max){
	this.range = [(min||0), (max||9)];
	this.target = this.range[0] + this.range[1];
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
	var neighbors = [];
	neighbors.push([tuple[0] + 1, tuple[1]]);
	neighbors.push([tuple[0] - 1, tuple[1]]);
	neighbors.push([tuple[0], tuple[1] - 1]);
	neighbors.push([tuple[0], tuple[1] + 1]);
	var that = this;
	neighbors = neighbors.filter(function(e) {
		return that.isInBounds(e);
	});

	neighbors.forEach(function(e) {
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

Board.prototype._updateIfMatch = function(tuple){
	var neighborValHash = {};
	var board = this.state;
	var flag = false;
	var that = this;
	this._eachOnNeighbors(tuple, function(c, n) {
		if (board[c[0]][c[1]] === board[n[0]][n[1]]) {
			flag = true;
		}
		neighborValHash[board[n[0]][n[1]]] = true;
	})
	flag ? (board[tuple[0]][tuple[1]] = update(board[tuple[0]][tuple[1]])) : null;
	


	function update(val) {
		while (val in neighborValHash) {
			val = that.ran();
		}
		return val;
	}
}

Board.prototype._removeMatches = function() {
	this._iterate(this._updateIfMatch.bind(this));
}

// ----
var b1 = new Board().create();
console.log(b1.state);
b1._removeMatches();
console.log(b1.state);





