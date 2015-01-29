'use strict';

angular.module('projectApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mathCrush', {
        url: '/mathcrush',
        templateUrl: 'app/mathcrush',
        controller: 'MathCrushCtrl'
      });
  });