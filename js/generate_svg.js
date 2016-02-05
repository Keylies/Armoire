'use strict';

var wardrobeApp = angular.module('wardrobeApp', []);

wardrobeApp.directive('generateSvg', function () {
	return {
	    restrict: 'A',
	    template: 
	    	'<svg width="{{wardrobeWidth}}" height="{{wardrobeHeight}}">' +
	    		'<rect width="{{wardrobeWidth}}" height="{{wardrobeHeight}}" style="fill:rgb(0,0,255);">' +
	    	'</svg>'
	};
 });
