//'use strict';

var wardrobeApp = angular.module('wardrobeApp', []);

wardrobeApp.controller('mainController', ['$scope', function ($scope) {
    $scope.count = 0;
    
    $scope.wardrobeWidth = 100;
    $scope.wardrobeHeight = 100;

	/*
    $scope.checkOffsets = function (){
        console.log("bitch");
    }
	*/
/*
    $scope.addBlock = function () {        
        var li = document.createElement("li");
        li.setAttribute('generate-block', "");
        angular.element(document.getElementById('blocks-list')).append(li);
    }*/
}]);


wardrobeApp.directive('generateSvg', function () {
    return {
        restrict: 'A',
        template: '<rect fill="rgb(0,0,255)">'
    }
});


wardrobeApp.directive('generateblockbutton', function (){	
    return {
        restrict: 'E',
        template: '<button generateli>Ajouter un bloc</button>'
    }
});

wardrobeApp.directive('generateli', function ($compile){
    return function (scope, element, attrs){
		element.bind('click', function (){

            if ( typeof scope.blockType != 'undefined' ) {

                angular.element(document.getElementById('blocks-list')).append(
                    $compile(
                        '<li>' +
                            '<div>' +
                                '<label for="block-width' + scope.count + '">Largeur du bloc</label>' +
                                '<input type="number" id="block-width' + scope.count + '" placeholder="Largeur" ng-model="blockWidth' + scope.count + '">' +
                            '</div>' +
                            '<div>' +
                                '<label for="block-height' + scope.count + '">Hauteur du bloc</label>' +
                                '<input type="number" id="block-height' + scope.count + '" placeholder="Hauteur" ng-model="blockHeight' + scope.count + '">' +
                            '</div>' +
                            '<div>' +
                                '<label for="block-color' + scope.count + '">Couleur du bloc</label>' +
                                '<input type="color" id="block-color' + scope.count + '" ng-model="blockColor' + scope.count + '">' +
                            '</div>' +
                        '</li>'
                    )
                (scope));

                var svg = document.getElementById('wardrobe-svg');

                if ( scope.blockType == 'shelf' ) {

                    angular.element(svg).append(
                        $compile(
                            '<polygon>'
                        )
                    (scope));
                }
                else if ( scope.blockType == 'drawer' ) {
                    angular.element(svg).append(
                        $compile(
                            '<polygon>'
                        )
                    (scope));
                }
                else {// closet
                    angular.element(svg).append(
                        $compile(
                            '<polygon>'
                        )
                    (scope));
                }

                scope.count++;
            }		
		});	
	};
});

// http://jsfiddle.net/ftfish/KyEr3/