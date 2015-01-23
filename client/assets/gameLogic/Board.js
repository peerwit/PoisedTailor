// Simple Boards implementation by Pranay and Alex Tseung
	// v 0.0.1 (01/23/15)

var Board = function() {
	this.state = [[]];
}

Board.prototype.create = function(m,n,operation, difficulty) {
	this.rows = m || 12;
	this.cols = n || 6;
	this.op = this.operation = operation || "+";
	this.diff = this.difficulty = difficluty || 1;
	this.state = this.makeBoard(this.rows, this.cols);
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
	this.sum = this.range[0] + this.range[1];
	var board = this.state;
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			board[i][j] = this.ran(); 
		}
	}
}

Board.prototype.generateRandom = Board.prototype.ran = function() {
	var range = this.range;
	var sum = this.sum;
	return Math.floor(Math.random()*(this.range[1] - this.range[0])) + this.range[0];
}

Board.prototype.isInBounds = function(t1, t2) {
	if (t1[0] > board.length - 1 || t1[0] < 0 || t1[1] > board[0].length - 1 || t1[1] < 0 ||
		t2[0] > board.length - 1 || t2[0] < 0 || t2[1] > board[0].length - 1 || t2[1] < 0) {
		return false;
	}
	return true;
} 

// Pass in two arrays t1 = [i1, j1] &&  t2 = [i2, j2]
Board.prototype.isValid = function(t1, t2){
	// are t1 && t2 neighbors ? continue; break;
	if (!this.isInBounds(t1,t2)) {
		return false;
	}
	else {
		
	}
}

Board.prototype.isConnected = function(){
	return this.BFS().length === this.al.length
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