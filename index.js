// Warn if overriding existing method
if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function(array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {
    enumerable: false
});

function isNeighborAConnectedComponent(m, p, l, ii, jj, i, j, t) {
    "use strict";
    return ((m[ii][jj] == -1) && (l[m[i][j][t] - 1][0].equals([ii, jj])) ||
        l[m[i][j][t] - 1][1].equals([ii, jj]));
}

function isLineContinued(m, ii, jj, i, j, t) {
    "use strict";
    return (typeof(m[ii][jj]) == "object" &&
        (m[ii][jj].indexOf(m[i][j][t]) != -1));
}

function drawArrows(cx, m, p, l, sq_dim) {
    "use strict";
    var neighbors = [
        [-1, 0], // TOP
        [0, -1], // LEFT
        [0, 1], // RIGHT
        [1, 0]
    ]; // BOTTOM
    var n_formula = [
        [sq_dim / 2, 0], // TOP
        [0, sq_dim / 2], // LEFT
        [sq_dim, sq_dim / 2], // RIGHT
        [sq_dim / 2, sq_dim]
    ]; // BOTTOM
    var i, j, k, t, moved, ii, jj, tmp_x, tmp_xx, tmp_y, tmp_yy;

    for (i = 0; i < m.length; i++) {
        for (j = 0; j < m[i].length; j++) {
            if (m[i][j] == -1) {
                // Draw component
                cx.fillRect(j * sq_dim, i * sq_dim, sq_dim, sq_dim);
            } else if (typeof(m[i][j]) == "object") {
                // We found an array that describes a segment of one or more lines
                for (t = 0; t < m[i][j].length; t++) {
                    if (m[i][j][t] > 0) {
                        moved = false;
                        cx.beginPath();
                        // We look for neighbors of this cell
                        for (k = 0; k < 4; k++) {
                            ii = i + neighbors[k][0];
                            jj = j + neighbors[k][1];
                            if (m[ii] !== undefined && m[ii][jj] !== undefined) {
                                // A line can be either continued to a neighbor cell or connected to a component
                                if (isNeighborAConnectedComponent(m, p, l, ii, jj, i, j, t) ||
                                    isLineContinued(m, ii, jj, i, j, t)) {
                                    if (!moved) {
                                        // Start point in this cell
                                        tmp_x = j * sq_dim + n_formula[k][0];
                                        tmp_y = i * sq_dim + n_formula[k][1];
                                        cx.moveTo(tmp_x, tmp_y);
                                        moved = true;
                                    } else {
                                        // End point in this cell
                                        tmp_xx = j * sq_dim + n_formula[k][0];
                                        tmp_yy = i * sq_dim + n_formula[k][1];
                                        if ((tmp_x !== tmp_xx) && (tmp_y !== tmp_yy)) {
                                            // The line will be diagonal
                                            // Draw a 90° corner to connect start and end point
                                            if (k == 1) {
                                                cx.lineTo(tmp_x, tmp_yy);
                                            } else if (k == 2) {
                                                cx.lineTo(tmp_x, tmp_yy);
                                            } else if (k == 3) {
                                                cx.lineTo(tmp_xx, tmp_y);
                                            }
                                        }
                                        cx.lineTo(tmp_xx, tmp_yy);
                                    }
                                }
                            }
                        }
                        cx.stroke();
                    }
                }
            }
        }
    }
}

function test() {
    "use strict";
    var ctx = document.getElementById("myCanvas").getContext("2d");
    ctx.lineWidth = 1;
    ctx.fillStyle = "red";
    ctx.strokeStyle = 'black';
    drawArrows(ctx, complexMatrixSolved2, complexLines2, complexLinks2, dim);
}

/**
 * Created by claudio on 26/11/16.
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Array.prototype.isValidPoint = function (x, y) {
    "use strict";

    var obj = this[x];
    if (obj == undefined) return false;
    obj = obj[y];
    if (obj == undefined) return false;
    return true;
};
Array.prototype.mergeMatrix = function (matrix) {
    "use strict";

    return this.map(function (value, pos) {
        return value.map(function (value2, pos2) {
            var valueM = matrix[pos][pos2];
            if (!Array.isArray(value2)) {
                if (value2 == -1) return -1;
                if (!Array.isArray(valueM)) return 0;

                return valueM;
            }
            if (!Array.isArray(valueM)) return value2;
            return value2.concat(matrix[pos][pos2]);
        });
    });
};

Object.prototype.search = function (x, y, value) {
    "use strict";

    var obj = this;
    if (!Array.isArray(obj)) return false;
    if (!this.isValidPoint(x, y)) return false;
    obj = obj[x][y];
    if (!Array.isArray(obj)) return false;
    var ret = obj.indexOf(value);
    return ret >= 0;
};

Object.prototype.clone = function () {
    "use strict";

    return JSON.parse(JSON.stringify(this));
};

Math.randBounds = function (low, upper) {
    "use strict";

    var rnd = Math.random();
    rnd *= upper - low + 1; //+1 to reach the upper bound
    rnd = Math.floor(rnd);
    if (rnd > upper) //to fix the case where random returns exactly 1
        rnd = upper;
    rnd += low;
    return rnd;
};

Array.newWithElement = function (size, element) {
    "use strict";

    var ret = [];
    for (var i = 0; i < size; i++) {
        ret.push(element);
    }return ret;
};

// CONFIG
var LENGTH_SCORE = 1;
var ANGLE_SCORE = 5;
var OVERLAPPING_SCORE = 30;
var RIGHT_CONSTRAINT = true; //the arrows cannot come back in the horizontal line (if I start from the right side I can go only to left)
var ALLOW_TWO_ANGLES = false; //allow to have two near angles, in the case this bring to go to the original direction
var ANGLE_LIMITS = 3; //limits of the number of angle for each line
var NO_PATHS_GREATER_THAN = 2; //the limit is based on the best solution find until that moment
/*
 * BEST CONFIG for performance
 * RIGHT_CONSTRAINT = true;
 * ALLOW_TWO_ANGLES = false;
 */

function bestMatrix(matrix, lines) {
    "use strict";

    var score = 1000000;
    var ret = [];
    allMatrices(matrix, lines).forEach(function (value) {
        var tmpScore = calculateScore(value);
        if (tmpScore < score) {
            score = tmpScore;
            ret = value;
        }
    });
    console.log(score);
    return ret;
}

function allMatrices(matrix, lines) {
    "use strict";

    var matrices = lines.map(function (line, pos) {
        return findMatricesOfLine(matrix, lines, pos + 1);
    });
    var combinations = getCombinations(matrices);
    return combinations;
}

function getCombinations(matrices, choosen, level) {
    "use strict";

    level = level || 0;
    var combinations = [];
    choosen = choosen || Array.newWithElement(matrices.length, -1);
    var firstElement = 0;
    for (; choosen[firstElement] != -1 && firstElement < choosen.length; firstElement++) {}
    //console.log(level, firstElement, choosen);
    if (firstElement == choosen.length && choosen[firstElement] != -1) {
        return [choosen.reduce(function (a, b, pos) {
            return a.mergeMatrix(matrices[pos][b]);
        }, matrices[choosen.length - 1][choosen.pop()])]; //remove last
    }

    matrices[firstElement].forEach(function (value, pos) {
        var tmpChosen = choosen.clone();
        tmpChosen[firstElement] = pos;
        combinations = combinations.concat(getCombinations(matrices, tmpChosen, level + 1));
    });
    return combinations;
}

function findMatricesOfLine(matrix, lines, pos) {
    "use strict";

    var x = lines[pos - 1][0][0];
    var y = lines[pos - 1][0][1];
    matrix = matrix.clone();
    matrix[x][y] = [pos];
    return new paths().allPaths(matrix, lines[pos - 1], x, y, pos, 0, lines[pos - 1][0][1] < lines[pos - 1][1][1]);
}

function calculateScore(matrix) {
    "use strict";

    var score = 0;
    for (var valueIndex = 0; valueIndex < matrix.length; valueIndex++) {
        var value = matrix[valueIndex];
        for (var value2Index = 0; value2Index < value.length; value2Index++) {
            var value2 = value[value2Index];
            if (!Array.isArray(value2)) continue;
            score += (value2.length - 1) * OVERLAPPING_SCORE;
            score += value2.length * LENGTH_SCORE;
            score += calculateAnglesNumber(matrix, valueIndex, value2Index) * ANGLE_SCORE;
        }
    }
    return score;
}

function calculateAnglesNumber(matrix, x, y) {
    "use strict";

    var values = matrix[x][y];
    return values.filter(function (value) {
        if (matrix.search(x - 1, y, value) && matrix.search(x, y + 1, value) || matrix.search(x - 1, y, value) && matrix.search(x, y - 1, value) || matrix.search(x + 1, y, value) && matrix.search(x, y + 1, value) || matrix.search(x + 1, y, value) && matrix.search(x, y - 1, value)) return true;
        return false;
    }).length;
}

var paths = function () {
    function paths() {
        _classCallCheck(this, paths);

        this.bestPath = 1000000;
    }

    _createClass(paths, [{
        key: "allPaths",
        value: function allPaths(matrix, line, x, y, value, level, right, angleInfo) {
            "use strict";
            //level = level || 0;

            var matrices = [];
            angleInfo = angleInfo || { direction: 0, turned: 0, previousDirection: 0, previousPreviousDirection: 0, turnedCounter: 0 };

            if (x == line[1][0] && y == line[1][1]) {
                if (level < this.bestPath) this.bestPath = level;
                return [matrix];
            }

            if (angleInfo.turned) angleInfo.turnedCounter++;

            if (angleInfo.turnedCounter > ANGLE_LIMITS) return [];

            if (level > angleInfo.bestPath * NO_PATHS_GREATER_THAN) return [];

            //break if I have two parallel lines? without blank?
            if (angleInfo.turned >= 2 && (!ALLOW_TWO_ANGLES || angleInfo.direction != angleInfo.previousPreviousDirection && angleInfo.previousPreviousDirection != 0)) return [];

            //recursion
            var end = false;

            if (matrix.isValidPoint(x + 1, y) && matrix[x + 1][y] == 0) {
                var tmpMatrix = matrix.clone();
                tmpMatrix[x + 1][y] = [value];
                var tmpAngleInfo = angleInfo.clone();
                tmpAngleInfo.previousPreviousDirection = tmpAngleInfo.previousDirection;
                tmpAngleInfo.previousDirection = tmpAngleInfo.direction;
                tmpAngleInfo.direction = 1;
                if (tmpAngleInfo.direction != angleInfo.direction) tmpAngleInfo.turned++;else tmpAngleInfo.turned = 0;
                var tmp = this.allPaths(tmpMatrix, line, x + 1, y, value, level + 1, right, tmpAngleInfo);
                matrices = matrices.concat(tmp);
            } else end = true;

            if (right || !RIGHT_CONSTRAINT) if (matrix.isValidPoint(x, y + 1) && matrix[x][y + 1] == 0) {
                var _tmpMatrix = matrix.clone();
                _tmpMatrix[x][y + 1] = [value];
                var _tmpAngleInfo = angleInfo.clone();
                _tmpAngleInfo.previousPreviousDirection = _tmpAngleInfo.previousDirection;
                _tmpAngleInfo.previousDirection = _tmpAngleInfo.direction;
                _tmpAngleInfo.direction = 2;
                if (_tmpAngleInfo.direction != angleInfo.direction) _tmpAngleInfo.turned++;else _tmpAngleInfo.turned = 0;
                var _tmp = this.allPaths(_tmpMatrix, line, x, y + 1, value, level + 1, right, _tmpAngleInfo);
                matrices = matrices.concat(_tmp);
            } else end = true;

            if (matrix.isValidPoint(x - 1, y) && matrix[x - 1][y] == 0) {
                var _tmpMatrix2 = matrix.clone();
                _tmpMatrix2[x - 1][y] = [value]; //[value+' '+level];
                var _tmpAngleInfo2 = angleInfo.clone();
                _tmpAngleInfo2.previousPreviousDirection = _tmpAngleInfo2.previousDirection;
                _tmpAngleInfo2.previousDirection = _tmpAngleInfo2.direction;
                _tmpAngleInfo2.direction = 3;
                if (_tmpAngleInfo2.direction != angleInfo.direction) _tmpAngleInfo2.turned++;else _tmpAngleInfo2.turned = 0;
                var _tmp2 = this.allPaths(_tmpMatrix2, line, x - 1, y, value, level + 1, right, _tmpAngleInfo2);
                matrices = matrices.concat(_tmp2);
            } else end = true;

            if (!right || !RIGHT_CONSTRAINT) if (matrix.isValidPoint(x, y - 1) && matrix[x][y - 1] == 0) {
                var _tmpMatrix3 = matrix.clone();
                _tmpMatrix3[x][y - 1] = [value];
                var _tmpAngleInfo3 = angleInfo.clone();
                _tmpAngleInfo3.previousPreviousDirection = _tmpAngleInfo3.previousDirection;
                _tmpAngleInfo3.previousDirection = _tmpAngleInfo3.direction;
                _tmpAngleInfo3.direction = 4;
                if (_tmpAngleInfo3.direction != angleInfo.direction) _tmpAngleInfo3.turned++;else _tmpAngleInfo3.turned = 0;
                var _tmp3 = this.allPaths(_tmpMatrix3, line, x, y - 1, value, level + 1, right, _tmpAngleInfo3);
                matrices = matrices.concat(_tmp3);
            } else end = true;

            /*if(end && validateLine(matrix, line[value-1], value))
             matrices.push(matrix);*/

            return matrices;
        }
    }]);

    return paths;
}();

function randomMatrices(model, lines) {
    "use strict";

    var solutions = Array.newWithElement(1000, []);
    return solutions.map(function (value) {
        return randomMatrix(model, lines);
    }).filter(function (matrix) {
        //return true;
        return validateLines(matrix, lines);
    });
}

function randomMatrix(matrix, lines) {
    "use strict";

    return matrix.map(function (value, pos) {
        return value.map(function (value2, pos2) {
            if (value2 == -1) return value2;
            return valuesForPoint(matrix, pos, pos2, lines);
        });
    });
}

function valuesForPoint(matrix, x, y, lines) {
    "use strict";

    var points = lines.map(function (line, pos) {
        return { "pos": pos, "line": line };
    }).filter(function (line) {
        return inStartEnd(line.line, x, y);
    }).map(function (line) {
        return line.pos + 1;
    });
    //if there is at leas one start/end no other points
    if (points.length) return points;
    points = Array.newWithElement(Math.randBounds(0, lines.length), []);
    points = points.map(function (point) {
        return Math.randBounds(1, lines.length);
    }).filter(function (elem, pos, arr) {
        return arr.indexOf(elem) == pos;
    }); //uinique
    if (points.length == 0) return 0;
    return points;
}

function validateLines(matrix, lines) {
    "use strict";

    for (var i = 0; i < lines.length; i++) {
        if (!validateLine(matrix, lines[i], i + 1)) return false;
    }return true;
}

function validateLine(matrix, line, name) {
    "use strict";

    if (!matrix.search(line[0][0], line[0][1], name) || !matrix.search(line[1][0], line[1][1], name)) return false;

    for (var valueIndex = 0; valueIndex < matrix.length; valueIndex++) {
        var value = matrix[valueIndex];
        for (var value2Index = 0; value2Index < value.length; value2Index++) {
            var value2 = value[value2Index];
            var count = validPoint(matrix, valueIndex, value2Index, name);
            var found = matrix.search(valueIndex, value2Index, name);
            //console.log(valueIndex, value2Index, value2, found, isValidPoint(matrix, valueIndex, value2Index, name),
            //    (valueIndex == line[0][0] && value2Index == line[0][1]),(valueIndex == line[1][0] && value2Index == line[1][1]));
            if (found) {
                //TODO check that end or start has count == 1
                //end or start
                if (inStartEnd(line, valueIndex, value2Index)) {
                    if (count < 1) //this can cause more than one enter point in the start/end
                        return false;
                } else if (count <= 1) return false;
            }
        }
    }
    return true;
}

// point with a previous and following point
function validPoint(matrix, x, y, value) {
    "use strict";

    var count = 0;
    if (matrix.search(x - 1, y, value)) count++;
    if (matrix.search(x + 1, y, value)) count++;
    if (matrix.search(x, y - 1, value)) count++;
    if (matrix.search(x, y + 1, value)) count++;
    return count;
}

function inStartEnd(line, x, y) {
    "use strict";

    return x == line[0][0] && y == line[0][1] || x == line[1][0] && y == line[1][1];
}

module.exports = bestMatrix;
