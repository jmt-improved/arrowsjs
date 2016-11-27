// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

dim = 40

var lines = [
    [[0,2],[2,0]],
    [[2,3],[3,0]]
];

var links = [
    [[0,1],[1,0]],
    [[1,3],[1,0]]
];

var matrixDemo = [
    [-1,-1,[1],-1],
    [-1,-1,[1],-1],
    [[1, 2],[1],[1],[2]],
    [[2],[2],[2],[2]],
];

var matrixDemo2 = [
    [-1,-1,[1],-1],
    [-1,-1,[1],-1],
    [[1],[1],[1,2],[2]],
    [[2],[2],[2],0],
];

var matrixDemo3 = [
    [-1,-1,[1],-1],
    [-1,-1,[1],-1],
    [[1],[1],[1,2],[2]],
    [[2],[2],[2],[2]],
];

var complexMatrix = [
    [-1,-1,0,-1, 0, 0, 0],
    [-1,-1,0,-1, 0, 0, 0],
    [0,0,0,0, 0, 0, 0],
    [0,0,0,0, 0, 0, 0],
    [0,0,0,0, 0, 0, 0],
    [0,0,0,0, 0, 0, 0],
    [0,0,0,0, 0, 0, 0],
    [0,0,0,0, 0, 0, 0],
];

var complexMatrixSolved = [ 
  [ -1, -1, 0, -1,              [ 1 ], 0, 0 ],
  [ -1, -1, 0, -1,              [ 1 ], 0, 0 ],
  [ 0, 0, 0,             [ 2 ], [ 1 ], 0, 0 ],
  [ [ 2 ], [ 2 ], [ 2 ], [ 2 ], [ 1 ], 0, 0 ],
  [ 0, 0, 0, 0,                 [ 1 ], 0, 0 ],
  [ 0, 0, 0, 0,                 [ 1 ], 0, 0 ],
  [ [ 1 ], [ 1 ], [ 1 ], [ 1 ], [ 1 ], 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0 ]
];

var complexLines = [
    [[0,4],[6,0]],
    [[2,3],[3,0]]
];

var complexLinks = [
    [[0,3],[6,0]],
    [[1,3],[3,0]]
];

var complexMatrixSolved2 = [ 
  [ -1, -1, 0, -1, [ 1 ], 0, 0 ],
  [ -1, -1, 0, -1, [ 1 ], 0, 0 ],
  [ [ 1 ], [ 2 ], [ 2 ], [ 2 ], [ 1 ], 0, 0 ],
  [ [ 1 ], [ 1 ], [ 1 ], [ 1 ], [ 1 ], 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0 ] 
];

var complexLines2 = [
    [[0,4],[2,0]],
    [[2,3],[2,1]]
];

var complexLinks2 = [
    [[0,3],[1,0]],
    [[1,3],[1,1]]
];



function isNeighborAConnectedComponent(m, p, l, ii, jj, i, j, t) {
  "use strict";
  return ((m[ii][jj] == -1) && (l[m[i][j][t] - 1][0].equals([ii, jj])) || 
                    l[m[i][j][t] - 1][1].equals([ii, jj]))
} 

function isLineContinued(m, ii, jj, i, j, t) {
  "use strict";
  return (typeof(m[ii][jj]) == "object" && 
                    (m[ii][jj].indexOf(m[i][j][t]) != -1))
}

function drawArrows(cx, m, p, l, sq_dim) {
  "use strict";
  var neighbors = [[-1, 0], // TOP
                   [0, -1], // LEFT
                   [0, 1],  // RIGHT 
                   [1, 0]]; // BOTTOM
  var n_formula = [[sq_dim / 2, 0],       // TOP
                   [0, sq_dim / 2],       // LEFT
                   [sq_dim, sq_dim / 2],  // RIGHT
                   [sq_dim / 2, sq_dim]]; // BOTTOM
  var i, j, k, t, moved, ii, jj, tmp_x, tmp_xx, tmp_y, tmp_yy;
  
  for (i = 0; i < m.length; i++) {
    for (j = 0; j < m[i].length; j++) {
      if (m[i][j] == -1) {
        // Draw component
        cx.fillRect(j * sq_dim, i * sq_dim, sq_dim, sq_dim);
      }
      else if (typeof(m[i][j]) == "object") {
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
                    tmp_x = j * sq_dim + n_formula[k][0]
                    tmp_y = i * sq_dim + n_formula[k][1]
                    cx.moveTo(tmp_x , tmp_y);
                    moved = true;
                  } else {
                    // End point in this cell
                    tmp_xx = j * sq_dim + n_formula[k][0]
                    tmp_yy = i * sq_dim + n_formula[k][1]
                    if ((tmp_x !== tmp_xx) && (tmp_y !== tmp_yy)) {
                      // The line will be diagonal 
                      // Draw a 90° corner to connect start and end point
                      if (k == 1) {
                        cx.lineTo(tmp_x, tmp_yy);      
                      }
                      else if (k == 2) {
                        cx.lineTo(tmp_x, tmp_yy);
                      }
                      else if (k == 3) {
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
  drawArrows(ctx, complexMatrixSolved2, complexLines2, complexLinks2, dim)
}

