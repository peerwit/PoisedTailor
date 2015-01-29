'use strict';

angular.module('projectApp')
  .controller('MathCrushCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];
    $scope.addThing = function() {
      console.log("SADF")
    }
    var board = new Board();
    $scope.board = board.state;
    $scope.rows = board.state;
    $scope.cols = $scope.rows[0]
    console.log($scope.rows);

    // React.render(new MyComponent({name: "Kxprim"}), document.getElementById('react1'));
    // React.render(
    // 	new MyComponent({board: board.state}), 
    // 	document.getElementById('react1')
    // 	);
  });