var nComponents = 0;
var nLines = 0;
var nConnections = 0;

var compRowElem = '<div class="compRow">Component #{0} x: <input type="number" id="c{0}x"> y: <input type="number" id="c{0}y"></div>';

var lineRowElem = '<div class="lineRow"><div>Line #{0}</div> <div>start x: <input type="number" id="l{0}sx"> start y: <input type="number" id="l{0}sy"><br>end x: <input type="number" id="l{0}ex"> end y: <input type="number" id="l{0}ey"></div></div>';

var connRowElem = '<div class="connRow"><div>Connection #{0}</div> <div>start x: <input type="number" id="conn{0}sx"> start y: <input type="number" id="conn{0}sy"><br>end x: <input type="number" id="conn{0}ex"> end y: <input type="number" id="conn{0}ey"></div></div>';

function printMatrix(matrix, shape) {
    "use strict";
    var i, j;
    var str = "[ \n";
    for (i = 0; i < shape[0]; i++) {
        str += " [ ";
        for (j = 0; j < shape[1]; j++) {
            str += matrix[i][j] + ", ";
        }
        str += " ],\n";
    }
    str += " ];";
    console.log(str);
}

function buildMatrix(shape) {
    "use strict";
    var i, j, cx, cy;
    var matrix = []
    for (i = 0; i < shape[0]; i++) {
        matrix[i] = []
    }

    for (i = 1; i <= nComponents; i++) {
        cx = parseInt($(format("#c{0}x", i)).val(), 10);
        cy = parseInt($(format("#c{0}y", i)).val(), 10);
        console.log(cx + ", " + cy);
        matrix[cy][cx] = -1;
    }

    for (i = 0; i < shape[0]; i++) {
        for (j = 0; j < shape[1]; j++) {
            if (matrix[i][j] === undefined) {
                matrix[i][j] = 0;
            }
        }
    }
    return matrix;
}

function buildLines(shape) {
    "use strict";
    var i, j, lsx, lsy, esx, esy;
    var lines = []
    for (i = 0; i < shape[0]; i++) {
        lsx = parseInt($(format("#l{0}sx", i + 1)).val(), 10);
        lsy = parseInt($(format("#l{0}sy", i + 1)).val(), 10);
        esx = parseInt($(format("#l{0}ex", i + 1)).val(), 10);
        esy = parseInt($(format("#l{0}ey", i + 1)).val(), 10);
        lines[i] = [
            [lsy, lsx],
            [esy, esx]
        ]
    }
    return lines;
}

function buildConnections(shape) {
    "use strict";
    var i, j, lsx, lsy, esx, esy;
    var connections = []
    for (i = 0; i < shape[0]; i++) {
        lsx = parseInt($(format("#conn{0}sx", i + 1)).val(), 10);
        lsy = parseInt($(format("#conn{0}sy", i + 1)).val(), 10);
        esx = parseInt($(format("#conn{0}ex", i + 1)).val(), 10);
        esy = parseInt($(format("#conn{0}ey", i + 1)).val(), 10);
        connections[i] = [
            [lsy, lsx],
            [esy, esx]
        ]
    }
    return connections;
}


$("document").ready(function() {
    var addComponentA = $("#addComponent");
    addComponentA.click(function() {
        $(format(compRowElem, ++nComponents)).insertBefore(addComponentA);
    });

    var addLineA = $("#addLine");
    addLineA.click(function() {
        $(format(lineRowElem, ++nLines)).insertBefore(addLineA);
    });

    var addConnectionA = $("#addConnection");
    addConnectionA.click(function() {
        $(format(connRowElem, ++nConnections)).insertBefore(addConnectionA);
    });

    $("#draw").click(function() {
        var dim = parseInt($("#sqd").val(), 10);
        var matrixShape = [parseInt($("#mh").val(), 10), parseInt($("#mw").val(), 10)];
        var matrix = buildMatrix(matrixShape);
        var linesShape = [nLines, 2];
        var lines = buildLines(linesShape);
        var connectionsShape = [nConnections, 2];
        var connections = buildConnections(connectionsShape)

        var t0 = new Date().getTime();
        var solved = bestMatrix(matrix, lines);
        var t1 = new Date().getTime();
        console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");

        var myCanvas = document.getElementById("myCanvas");
        var ctx = myCanvas.getContext("2d");
        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        ctx.lineWidth = 1;
        ctx.fillStyle = "red";
        ctx.strokeStyle = 'black';
        drawArrows(ctx, solved, lines, connections, dim);
    });
});
