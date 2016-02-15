/*


    J'ai ajouté + 80 ligne 147 car j'ai du aussi ajouter + 80 au svg en y
    afin qu'on puisse voir la profondeur (qui peut aller jusqu'à 80 cm)


 */

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

	$scope.wardrobeWidth = 180;
	$scope.wardrobeHeight = 200;
	$scope.wardrobeDepth = 40;
	$scope.wardrobeWidthRatio = $scope.wardrobeWidth ;
	$scope.wardrobeHeightRatio = $scope.wardrobeHeight ;
	$scope.wardrobeDepthRatio = $scope.wardrobeDepth ;

	$scope.limits = {
		blockLimitWidth: $scope.wardrobeWidth 
	};

	$scope.replaceHeight = function (index, oldCoords) {
		oldCoords = JSON.parse(oldCoords);
		var yScale = $scope.block[index].height - oldCoords.height;
		yScale *= $scope.multiplyCoeff;
		var blocksToMove = $scope.getBlocksAbove($scope.block[index]);
		blocksToMove.push($scope.block[index]);

		var allowedToMove = true;
		// check if move is possible
		blocksToMove.forEach(function (b, i) {
			if (b.y - yScale < 0) {
				allowedToMove = false;
				return;
			}
		});

		if (allowedToMove) {
			blocksToMove.forEach(function (b) {
				b.y -= yScale;
			});
		} else {
			$scope.block[index] = oldCoords;
		}
		$scope.manageFill();
	};
	$scope.getBlocksAbove = function (block) {
		var tmp = [];
		$scope.block.forEach(function (b, i) {
			if (b.y < block.y &&
				((b.x >= block.x && b.x <= block.x + block.width) || ((b.x + b.width >= block.x && b.x + b.width <= block.x + block.width)))
			) {
				tmp.push(b);
			}
		});
		return tmp;
	}
	$scope.replaceWidth = function (index, oldCoords) {
		oldCoords = JSON.parse(oldCoords);
		var xScale = $scope.block[index].width - oldCoords.width;
		xScale *= $scope.multiplyCoeff;
		var blocksToMove = $scope.getBlocksRightSide($scope.block[index]);
		//blocksToMove.push($scope.block[index]);
		var allowedToMove = true;

		// check if move is possible
		blocksToMove.forEach(function (b, i) {
			if (b.x + b.width + xScale > $scope.wardrobeWidthRatio - 30) {
				allowedToMove = false;
				return;
			}
		});


		if (allowedToMove) {
			blocksToMove.forEach(function (b) {
				b.x += xScale;
			});
		} else {
			$scope.block[index] = oldCoords;
		}

		$scope.manageFill();
	};
	$scope.getBlocksRightSide = function (block) {
		var tmp = [];
		$scope.block.forEach(function (b, i) {
			if (b.x > block.x &&
				((b.y >= block.y && b.y <= block.y + block.height) || ((b.y + b.height >= block.y && b.y + b.height <= block.y + block.height)))
			) {
				tmp.push(b);
			}
		});
		return tmp;
	}

	$scope.checkOffsets = function (index) {};
	$scope.checkWardrobe = function () {
		$scope.wardrobeWidthRatio = $scope.wardrobeWidth ;
		$scope.wardrobeHeightRatio = $scope.wardrobeHeight ;
	};
	$scope.findIndexFirstElementPreviousStep = function () {
		return $scope.stepsIndex[$scope.stepsIndex.length - 2][0];
	};

	$scope.manageStepsIndex = function () {
		if ($scope.stepsIndex[$scope.stepsCurrentIndex] == undefined) {
			$scope.stepsIndex[$scope.stepsCurrentIndex] = [];
		}
	};

	$scope.findCollisions = function (x, w) {
		$scope.block.forEach(function (b) {
			if (b.x < x && (b.x + b.width >= x && b.x + b.width < x + w) ||
				b.x > x && (b.x + b.width >= x && b.x + b.width < x + w) ||
				b.x > x && (b.x + b.width > x + w)
			) {
				return b;
			}
		});

		return false;
	}

	$scope.decomposeWardrobe = function () {
		/*
			|
			|
			|
			|
			|
			0------------
		0 = starting Point
		width to height.
		*/

		$scope.wardrobeTable = [];
		var wLimit = parseInt($scope.wardrobeWidthRatio / ($scope.defaultRectCoords.width ));
		var hLimit = parseInt($scope.wardrobeHeightRatio / ($scope.defaultRectCoords.width ));

		for (var i = 0; i < hLimit; i++) {
			for (var j = 0; j < wLimit; j++) {
				var x = ($scope.defaultRectCoords.width ) * j;
				var y = $scope.wardrobeHeightRatio - ($scope.defaultRectCoords.height ) * (i + 1);
				$scope.wardrobeTable.push({
					x: x,
					y: y,
					width: $scope.defaultRectCoords.width ,
					height: $scope.defaultRectCoords.height ,
					blocksIn: [],
					fullFilled: false
				});
			}
		}
	};
	$scope.decomposeWardrobe();

	$scope.manageFill = function () {
		$scope.block.forEach(function (block) {
			$scope.wardrobeTable.forEach(function (ward) {
				var blockX = block.x;
				var blockY = block.y;
				var blockW = block.width ;
				var blockH = block.height ;
				if ((ward.x >= blockX && ward.x + ward.width <= blockX + blockW) &&
					(ward.y >= blockY && ward.y + ward.height <= blockY + blockH)) {
					ward.fullFilled = true;
				}
			})
		});
	};

	$scope.findFirstNoneFullFilled = function () {
		var noneFilled = null;
		for (var i = 0; i < $scope.wardrobeTable.length; i++) {
			if (!$scope.wardrobeTable[i].fullFilled) {
				noneFilled = $scope.wardrobeTable[i];
				break;
			}
		}

		return noneFilled;
	};

	$scope.collision = function (coord, block) {
		if ((block.x >= coord.x && block.x <= coord.x + coord.width ||
				block.x + block.width >= coord.x && block.x + block.width <= coord.x + coord.width)) {
			var collision = true;
		} else {
			var collision = false;
		}
		return (collision);
	}

	$scope.placeRect = function () {
		if ($scope.block.length > 1) {

			var notFullFilled = $scope.findFirstNoneFullFilled();

			return {
				x: notFullFilled.x,
				y: notFullFilled.y

			};
		} else {
			$scope.manageStepsIndex();
			$scope.stepsIndex[$scope.stepsCurrentIndex].push($scope.count);
			return {
				x: 0,
				y: $scope.wardrobeHeightRatio - ($scope.defaultRectCoords.height )
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
						'<input type="number" id="block-width' + scope.count + '" min="30" placeholder="Largeur" ng-model="block[' + scope.count + '].width" ng-change="checkOffsets(' + scope.count + '); replaceWidth(' + scope.count + ', \'{{block[' + scope.count + ']}}\')">' +
						'</div>' +
						'<div>' +
						'<label for="block-height' + scope.count + '">Hauteur du bloc</label>' +
						'<input type="number" id="block-height' + scope.count + '" min="30" placeholder="Hauteur" ng-model="block[' + scope.count + '].height" ng-change="checkOffsets(' + scope.count + '); replaceHeight(' + scope.count + ', \'{{block[' + scope.count + ']}}\')">' +
						'</div>' +
						'<div>' +
						'<label for="block-color' + scope.count + '">Couleur du bloc</label>' +
						'<input type="color" id="block-color' + scope.count + '" ng-model="block[' + scope.count + '].fill" ng-change="checkOffsets(' + scope.count + ')">' +
						'</div>' +
						'<button>Supprimer</button>' +
						'</li>'
					)
					(scope));

				var svg = document.getElementById('wardrobe-svg');
				var xmlns = "http://www.w3.org/2000/svg";
				var coords = scope.placeRect();
				scope.block[scope.count].x = coords.x;
				scope.block[scope.count].y = coords.y;

				scope.manageFill();

				console.log(scope.wardrobeTable);

				var g = document.createElementNS(xmlns, 'g');
				var rect = document.createElementNS(xmlns, 'rect');
				var number = document.createElementNS(xmlns, 'text');

				rect.setAttribute('ng-attr-width', "{{block[" + scope.count + "].width}}");
				rect.setAttribute('ng-attr-height', "{{block[" + scope.count + "].height}}");
				rect.setAttribute('ng-attr-fill', "{{block[" + scope.count + "].fill}}");
				rect.setAttribute('id', "rect" + scope.count);
				rect.setAttribute('ng-attr-x', "{{block[" + scope.count + "].x}}");
				rect.setAttribute('ng-attr-y', "{{block[" + scope.count + "].y + 80}}");
				rect.setAttribute('stroke', "#000");
				rect.setAttribute('stroke-width', "1");
				//rect.setAttribute('y', coords.y + 80);
				
				number.setAttribute('ng-attr-x', "{{block[" + scope.count + "].x + 2}}");
				number.setAttribute('ng-attr-y', "{{block[" + scope.count + "].y + 87}}");
				number.setAttribute('font-size', "7");
				number.appendChild(document.createTextNode(scope.count + 1));
				
				scope.block[scope.count].x = coords.x;
				scope.block[scope.count].y = coords.y;

				g.appendChild(rect);
				g.appendChild(number);

				if (scope.blockType == 'shelf') {

					var secondRect = document.createElementNS(xmlns, 'rect');

					scope.block[scope.count].fill = "#FCDDB1";

					secondRect.setAttribute('width', "{{block[" + scope.count + "].width}}");
					secondRect.setAttribute('height', "3");
					secondRect.setAttribute('x', "{{block[" + scope.count + "].x}}");
					secondRect.setAttribute('y', "{{block[" + scope.count + "].y + (block[" + scope.count + "].height - 3) + 80}}");

					g.appendChild(secondRect);
					
				} else if (scope.blockType == 'drawer') {

					var circle = document.createElementNS(xmlns, 'circle');

					scope.block[scope.count].fill = "#D8D8CB";

					circle.setAttribute('cx', "{{block[" + scope.count + "].x + (block[" + scope.count + "].width / 2)}}");
					circle.setAttribute('cy', "{{block[" + scope.count + "].y + (block[" + scope.count + "].height / 2 + 80)}}");
					circle.setAttribute('r', "2.5");

					g.appendChild(circle);

				} else { // closet

					var secondRect = document.createElementNS(xmlns, 'rect');

					scope.block[scope.count].fill = "#7C99C4";

					secondRect.setAttribute('width', "{{block[" + scope.count + "].width}}");
					secondRect.setAttribute('height', "3");
					secondRect.setAttribute('x', "{{block[" + scope.count + "].x}}");
					secondRect.setAttribute('y', "{{block[" + scope.count + "].y + (block[" + scope.count + "].height / 5 + 80)}}");

					g.appendChild(secondRect);
				}

				svg.appendChild(g);

				$compile(svg)(scope);

				scope.count++;
			}
		});
	};
});