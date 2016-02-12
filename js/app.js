'use strict';

var wardrobeApp = angular.module('wardrobeApp', []);

wardrobeApp.controller('mainController', ['$scope', '$compile', function ($scope, $compile) {
    $scope.count = 0;
    $scope.multiplyCoeff = 2;
    $scope.block = [];
    $scope.stepsIndex = [];
    $scope.stepsCurrentIndex = 0;
    $scope.defaultRectCoords = {
        width: 30,
        height: 30
    };

    $scope.wardrobeWidth = 200;
    $scope.wardrobeHeight = 200;
    $scope.wardrobeWidthRatio = $scope.wardrobeWidth * $scope.multiplyCoeff;
    $scope.wardrobeHeightRatio = $scope.wardrobeHeight * $scope.multiplyCoeff;

    $scope.limits = {
        blockLimitWidth: $scope.wardrobeWidth * $scope.multiplyCoeff
    };

    $scope.replaceHeight = function (index) {                
        $scope.block[index].y--;
        $compile(document.getElementById('rect' + index))(scope);
    }
    $scope.checkOffsets = function (index) {
        console.log(this);
    };
    $scope.checkWardrobe = function () {
        $scope.wardrobeWidthRatio = $scope.wardrobeWidth * $scope.multiplyCoeff;
        $scope.wardrobeHeightRatio = $scope.wardrobeHeight * $scope.multiplyCoeff;
    };
    $scope.findIndexFirstElementPreviousStep = function () {
        return $scope.stepsIndex[$scope.stepsIndex.length - 2][0];
    };

    $scope.manageStepsIndex = function () {
        if ($scope.stepsIndex[$scope.stepsCurrentIndex] == undefined) {
            $scope.stepsIndex[$scope.stepsCurrentIndex] = [];
        }
    };

    $scope.placeRect = function () {
        if ($scope.block.length > 1) {
            var lastBlock = $scope.block[$scope.block.length - 2];
            if ((lastBlock.x + ($scope.defaultRectCoords.width * $scope.multiplyCoeff) + ($scope.defaultRectCoords.width * $scope.multiplyCoeff)) < $scope.limits.blockLimitWidth) {
                $scope.manageStepsIndex();
                $scope.stepsIndex[$scope.stepsCurrentIndex].push($scope.count);
                return {
                    x: lastBlock.x + (lastBlock.width * $scope.multiplyCoeff) + 1,
                    y: lastBlock.y
                };
            } else {
                $scope.stepsCurrentIndex++;
                $scope.manageStepsIndex();
                $scope.stepsIndex[$scope.stepsCurrentIndex].push($scope.count);
                return {
                    x: 0,
                    y: $scope.block[$scope.findIndexFirstElementPreviousStep()].y - $scope.defaultRectCoords.height * $scope.multiplyCoeff
                };
            }
        } else {
            $scope.manageStepsIndex();
            $scope.stepsIndex[$scope.stepsCurrentIndex].push($scope.count);
            return {
                x: 0,
                y: $scope.wardrobeHeightRatio - ($scope.defaultRectCoords.height * $scope.multiplyCoeff)
            };
        }
    };
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
                    x: 0,
                    y: 0,
                    width: scope.defaultRectCoords.width,
                    height: scope.defaultRectCoords.height,
                    fill: "#FF0000",
                    index: scope.count
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
                        '<input type="number" id="block-height' + scope.count + '" placeholder="Hauteur" ng-model="block[' + scope.count + '].height" ng-change="checkOffsets(' + scope.count + '); replaceHeight(' + scope.count + ')">' +
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
                    scope.block[scope.count].x = coords.x;
                    scope.block[scope.count].y = coords.y;
                    rect.setAttribute('ng-attr-width', "{{block[" + scope.count + "].width * " + scope.multiplyCoeff + "}}");
                    rect.setAttribute('ng-attr-height', "{{block[" + scope.count + "].height * " + scope.multiplyCoeff + "}}");
                    rect.setAttribute('ng-attr-fill', "{{block[" + scope.count + "].fill}}");
                    rect.setAttribute('id', "rect" + scope.count);

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