'use strict';

var wardrobeApp = angular.module('wardrobeApp', []);

wardrobeApp.controller('mainController', ['$scope', function ($scope) {
    $scope.compteur = 0;
    
    $scope.wardrobeWidth = 100;
    $scope.wardrobeHeight = 100;
    
    $scope.checkOffsets = function (){
        console.log("bitch");
    }

    $scope.addBlock = function () {        
        var li = document.createElement("li");
        li.setAttribute('generate-block', "");
        angular.element(document.getElementById('blocks-list')).append(li);
    }
}]);

wardrobeApp.directive('generateSvg', function () {
    return {
        restrict: 'A',
        template: '<rect fill="rgb(0,0,255)">'
    };
});

wardrobeApp.directive('generateBlockButton', function (){
    return {
        restrict: 'E',
        template: '<button generateLi>Ajouter un block</button>'
    }; 
});

wardrobeApp.directive('generateLi', function (){
    return {
        restrict: 'E',
        template: '<li>Width : <input type="number">'
    }; 
});

// http://jsfiddle.net/ftfish/KyEr3/