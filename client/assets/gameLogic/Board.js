// Simple Boards implementation by Pranay and Alex Tseung
	// v 0.0.1 (01/23/15)

var Board = function() {
	this.state = [[]];
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

Board.prototype.create = function(m,n,operation, difficulty) {
	this.rows = m || 12;
	this.cols = n || 6;
	this.op = this.operation = operation || this.opsList.add;
	this.diff = this.difficulty = difficluty || 1;
	this.state = this.board = this.makeBoard(this.rows, this.cols);
	return this.state;
}

Board.prototype.makeBoard = function(m,n) {
	var board = [];
	for(var i = 0; i < m; i++) {
		board[i] = [];
		for (var j = 0; j < n; j++) {
			board[i][j] = null;
		}
	}
	this.init();
	return board;
}

// Come back to if time allows
// Board.prototype.setRange = function() {
// 	var op = this.operation;
// 	var diff = this.difficulty;

// };

Board.prototype.setBoardInit = Board.prototype.init =  function(min, max){
	this.range = [(min||0), (max||9)];
	this.target = this.range[0] + this.range[1];
	var board = this.state;
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			board[i][j] = this.ran(); 
		}
	}
}

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

Board.prototype.operatesToTarget = Board.prototype.operates = function(currentTuple, proposedTuple target, operation, board){
	target = target || this.target;
	operation = operation || this.operation;
	board = board || this.board;
	var tuple = currentTuple;
	return !!this.isMatch(tuple, proposedTuple).length
}

Board.prototype.swap = Board.prototype.makeSwap = function(t1, t2){
	if (!t1 || !t2){throw new Error ('cannot call sway without two tuples')}
	if (typeof t1 !== 'object' || typeof t2 !== 'object'){throw new Error ('cannot call sway without two tuples')}
	if (!!t1.length || !!t2.length){throw new Error ('cannot call sway without two tuples')}
	if (t1.length !== 2 || t2.length !== 2){throw new Error ('cannot call sway without two tuples')}

	if (!this.isValidSwap(t1,t2)) {
		throw new Error ('has inValid swap. Call the isValidSwap fn before calling swap.')
	}

	

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

var g1 = new Board([[1,2], [0, 2, 3], [1,2], [1]]);
var g2 = new Board([[3], [3,2], [1], [0,1]]);
var g3 = new Board([[1,2], [], [1], [1]]);