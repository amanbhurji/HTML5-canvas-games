window.onload = initialize;

var App = {
    "width":    270,
    "height":   480,
    "blockSize": 30,
    "trace": function (msg) {
        var el = document.querySelector("footer");
        el.innerHTML = msg;
    }
};

function initialize () {
    App.sizeW = App.width / App.blockSize;
    App.sizeH = App.height / App.blockSize;

    var map = []; 
    /*
    [
        [1, 1, 2, 4, 0, 4],
        [2, 3, 6, 4, 1, 4],
    ]
    */

    for (var y = 0; y < App.sizeH; y++) {
        map.push([]);
        for (var x = 0; x < App.sizeW; x++) {
            map[y].push(Math.floor(Math.random() * (COLORS.size - 1)) + 1); // random numbers from 1 to 6
        }
    }

    drawMap(map);
}

var drawMap = function (map) {
    var canvas = document.getElementById("game-canvas");
    canvas.width = App.width;
    canvas.height = App.height;
    canvas.addEventListener("click", clicked, false);

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, App.width, App.height);

    for (var y = 0; y < App.sizeH; y++) {
        for (var x = 0; x < App.sizeW; x++) {
            ctx.fillStyle = COLORS[map[y][x]];
            ctx.fillRect(x * App.blockSize, y * App.blockSize, App.blockSize, App.blockSize);
            ctx.strokeStyle = COLORS[0];
            ctx.strokeRect(x * App.blockSize, y * App.blockSize, App.blockSize, App.blockSize);
        }
    }
}

var clicked = function (event) {
    console.log(event);
    var coords = pixelsToIndex(event.offsetX, event.offsetY);
    console.log(coords);
};

var pixelsToIndex = function (x, y) {
    var xi = Math.floor(x / App.blockSize);
    var yi = Math.floor(y / App.blockSize);
    return {"x": xi, "y": yi};
};

var COLORS = {
    0:  "black",
    1:  "red",
    2:  "green",
    3:  "yellow",
    4:  "pink",
    5:  "orange",
    6:  "lightblue",
    "size": 6
}