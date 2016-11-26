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

var matrixDemo = [
    [-1,-1,[1],-1],
    [-1,-1,[1],-1],
    [[1],[1],[1],[2]],
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

function drawArrows(cx, m, l, sq_dim) {
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
          cx.fillStyle = "red";
          cx.fillRect(j * sq_dim, i * sq_dim, sq_dim, sq_dim);
      }
      else if (typeof(m[i][j]) == "object") {
        for (t = 0; t < m[i][j].length; t++) {
          if (m[i][j][t] > 0) {
            moved = false;
            cx.beginPath();
            for (k = 0; k < 4; k++) {
              ii = i + neighbors[k][0];
              jj = j + neighbors[k][1];
              if (m[ii] !== undefined && m[ii][jj] !== undefined) {
                if (((m[ii][jj] == -1) && (l[m[i][j][t] - 1][0].equals([i, j])) || 
                    l[m[i][j][t] - 1][1].equals([i, j])) || 
                   (typeof(m[ii][jj]) == "object" && 
                    (m[ii][jj].indexOf(m[i][j][t]) != -1))) {
                  if (!moved) {
                    tmp_x = j * sq_dim + n_formula[k][0]
                    tmp_y = i * sq_dim + n_formula[k][1]
                    cx.moveTo(tmp_x , tmp_y);
                    moved = true;
                  } else {
                    tmp_xx = j * sq_dim + n_formula[k][0]
                    tmp_yy = i * sq_dim + n_formula[k][1]
                    if ((tmp_x !== tmp_xx) && (tmp_y !== tmp_yy)) {
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

var ctx = document.getElementById("myCanvas").getContext("2d");
ctx.lineWidth = 1;
ctx.strokeStyle = 'black';
drawArrows(ctx, matrixDemo, lines, dim)

