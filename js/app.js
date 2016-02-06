'use strict';

var wardrobeApp = angular.module('wardrobeApp', []);

wardrobeApp.controller('blocksController', ['$scope', function ($scope) {

}]);

wardrobeApp.directive('generateSvg', function () {

	return {
	    restrict: 'A',
	    template: '<rect width="{{wardrobeWidth}}" height="{{wardrobeHeight}}" style="fill:rgb(0,0,255);">'
	};
 });