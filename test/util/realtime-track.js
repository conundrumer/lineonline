
// subject to change
var ENTITY = {
    POINT: 0,
    LINE: 1
};

function point(id, x, y) {
    return {
        type: ENTITY.POINT,
        id: id,
        x: x,
        y: y
    };
}

function linee(id, p1, p2) {
    return {
        type: ENTITY.LINE,
        id: id,
        p1: p1,
        p2: p2
    };
}

function lineData(p1, p2, line_id, x1, y1, x2, y2) {
    return [
        point(p1, x1, y1),
        point(p2, x2, y2),
        linee(line_id, p1, p2),
    ];
}

function makeLineData(user_id) {
    var id = user_id + '_';
    var points = 0;
    var lines = 0;
    return function(x1, y1, x2, y2) {
        var p1 = id + points;
        var p2 = id + (points+1);
        var line_id =  id + lines;
        var data = lineData(p1, p2, line_id, x1, y1, x2, y2);
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
