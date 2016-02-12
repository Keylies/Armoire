//'use strict';

var wardrobeApp = angular.module('wardrobeApp', []);

wardrobeApp.controller('mainController', ['$scope', function ($scope) {
    $scope.count = 0;
    $scope.block = [];
    $scope.defaultRectCoords = {
        width: 30,
        height: 30
    };

    $scope.wardrobeWidth = 200;
    $scope.wardrobeHeight = 200;
    $scope.wardrobeWidthRatio = $scope.wardrobeWidth * 2;
    $scope.wardrobeHeightRatio = $scope.wardrobeHeight * 2;

    $scope.checkOffsets = function (index) {};
    $scope.checkWardrobe = function () {
        $scope.wardrobeWidthRatio = $scope.wardrobeWidth * 2;
        $scope.wardrobeHeightRatio = $scope.wardrobeHeight * 2;
    };
    $scope.placeRect = function () {
        if ($scope.block.length > 1) {
            return {
                x: 0,
                y: 0
            };
        } else {
            return {
                x: 0,
                y: $scope.wardrobeHeightRatio - $scope.defaultRectCoords.height,
            };
        }
    };
    $scope.placeRectsOnChange = function (){
        
    }
}]);


wardrobeApp.directive('generateSvg', function () {
    return {
        restrict: 'A',
        template: '<rect fill="rgb(0,0,255)">'
    }
});


wardrobeApp.directive('generateblockbutton', function () {
    return {
        restrict: 'E',
        template: '<button generateli>Ajouter un bloc</button>'
    }
});

wardrobeApp.directive('generateli', function ($compile) {
    return function (scope, element, attrs) {
        element.bind('click', function () {

            if (typeof scope.blockType != 'undefined') {
                scope.block.push({
                    width: scope.defaultRectCoords.width,
                    height: scope.defaultRectCoords.height,
                    fill: "#FF0000"
                });

                angular.element(document.getElementById('blocks-list')).append(
                    $compile(
                        '<li>' +
                        '<div>' +
                        '<label for="block-width' + scope.count + '">Largeur du bloc</label>' +
                        '<input type="number" id="block-width' + scope.count + '" placeholder="Largeur" ng-model="block[' + scope.count + '].width" ng-change="checkOffsets(' + scope.count + ')">' +
                        '</div>' +
                        '<div>' +
                        '<label for="block-height' + scope.count + '">Hauteur du bloc</label>' +
                        '<input type="number" id="block-height' + scope.count + '" placeholder="Hauteur" ng-model="block[' + scope.count + '].height" ng-change="checkOffsets(' + scope.count + ')">' +
                        '</div>' +
                        '<div>' +
                        '<label for="block-color' + scope.count + '">Couleur du bloc</label>' +
                        '<input type="color" id="block-color' + scope.count + '" ng-model="block[' + scope.count + '].fill" ng-change="checkOffsets(' + scope.count + ')">' +
                        '</div>' +
                        '</li>'
                    )
                    (scope));

                var svg = document.getElementById('wardrobe-svg');

                if (scope.blockType == 'shelf') {

                    var xmlns = "http://www.w3.org/2000/svg";
                    var rect = document.createElementNS(xmlns, 'rect');
                    var coords = scope.placeRect();                    
                    rect.setAttribute('x', coords.x);
                    rect.setAttribute('y', coords.y);
                    rect.setAttribute('ng-attr-width', "{{block[" + scope.count + "].width}}");
                    rect.setAttribute('ng-attr-height', "{{block[" + scope.count + "].height}}");
                    rect.setAttribute('ng-attr-fill', "{{block[" + scope.count + "].fill}}");                    
                    
                    svg.appendChild(rect);
                    $compile(svg)(scope);
                } else if (scope.blockType == 'drawer') {
                    angular.element(svg).append(
                        $compile(
                            '<polygon>'
                        )
                        (scope));
                } else { // closet
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