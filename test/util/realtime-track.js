var Line2D = require('line2d');
var P = Line2D.toPoint;
var L = Line2D.toLine;
function lineData(pid1, pid2, lid, x1, y1, x2, y2) {
    return {
        line: L([lid, [pid1, pid2]]),
        p: P([pid1, [x1, y1]]),
        q: P([pid2, [x2, y2]])
    };
}

function makeLineData(user_id) {
    var id = user_id + '_';
    var points = 0;
    var lines = 0;
    return function(x1, y1, x2, y2) {
        var p = id + points;
        var q = id + (points+1);
        var line_id =  id + lines;
        var data = lineData(p, q, line_id, x1, y1, x2, y2);
        points += 2;
        lines += 1;
        return data;
    };
}

var line = {
    cow: makeLineData(3), // cow.id: 3
    bob: makeLineData(2) // bob.id: 2
};
var lines = {
    bob: [
        line.bob(40, 40, 60, 60),
        line.bob(40, 60, 60, 40)
    ],
    cow: [
        line.cow(0, 0, 480, 360),
        line.cow(0, 360, 480, 0)
    ]
};

module.exports = lines;
