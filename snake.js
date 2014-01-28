window.onload = initialize;

var App = {
    "width": 480,
    "height": 270,
    "blockSize": 30,
    "framerate": 1000 ,
    "updateTimeoutId": -1,
    "gameover": false
};

function Vertex (x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
}

function Prey () {
    var color = "red";
    this.x = Math.floor(Math.random() * (App.sizeW - 1)) * App.blockSize;
    this.y = Math.floor(Math.random() * (App.sizeH - 1)) * App.blockSize;
    
    this.paint = function () {
        var ctx = App.canvas.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, App.blockSize, App.blockSize);
    };
}

function Snake () {
    this.length = 1;
    var color = "rgb(121, 127, 256)";
    this.head = new Vertex(-1, -1, "");
    this.tail = new Vertex(-1, -1, "");
    this.turns = [];

    this.paint = function () {
        var ctx = App.canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(this.tail.x, this.tail.y, App.blockSize, App.blockSize);
        
        ctx.fillStyle = color;
        ctx.fillRect(this.head.x, this.head.y, App.blockSize, App.blockSize);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(0, 0, App.width, App.height);
    };

    this.eatPrey = function () {
        this.length += 1;
    };

    this.isColliding = function (vertex) {
        // create copy
        var collisionArray = [];
        collisionArray.push(this.tail);
        collisionArray = collisionArray.concat(this.turns);
        
        // add tail to copy array
        for (var i = 0, ii = collisionArray.length; i < ii - 1; i++) {
            if (collisionArray[i].x == vertex.x && vertex.x == collisionArray[i+1].x) {
                if (collisionArray[i].y <= vertex.y && vertex.y <= collisionArray[i+1].y) {
                    return true;
                }
                if (collisionArray[i].y >= vertex.y && vertex.y >= collisionArray[i+1].y) {
                    return true;
                }
            }

            if (collisionArray[i].y == vertex.y && vertex.y == collisionArray[i+1].y) {
                if (collisionArray[i].x <= vertex.x && vertex.x <= collisionArray[i+1].x) {
                    return true;
                }
                if (collisionArray[i].x >= vertex.x && vertex.x >= collisionArray[i+1].x) {
                    return true;
                }
            }
        }
        return false;
    };
}

function initialize() {
    var canvas = document.getElementById("game-canvas");
    canvas.addEventListener( "keydown", press, false);
    App.canvas = canvas;
    canvas.width = App.width;
    canvas.height = App.height;
    canvas.focus();

    App.sizeW = App.width / App.blockSize;
    App.sizeH = App.height / App.blockSize;

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, App.width, App.height);
    
    var posX = Math.floor(Math.random() * (App.sizeW - 1)) * App.blockSize;
    var posY = Math.floor(Math.random() * (App.sizeW - 1)) * App.blockSize;

    App.snake = new Snake();
    App.snake.head.x = posX;
    App.snake.head.y = posY;
    App.snake.tail.x = App.snake.head.x;
    App.snake.tail.y = App.snake.head.y;

    update();
}

function update() {
    var ctx = App.canvas.getContext('2d');
    if (App.gameover) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, App.width, App.height);
        ctx.fillStyle = "red";
        ctx.fillText("GAME OVER!", 10, 10);
        return;
    }
    if (!App.prey) 
        App.prey = new Prey();
    while(App.snake.isColliding(App.prey)) {
        App.prey = new Prey();
    }
    App.prey.paint();
    
    if (input.keyPressed) {
        App.snake.turns.push(new Vertex(App.snake.head.x, App.snake.head.y, input.dir));
        input.keyPressed = false;
    }

    var newHeadCoordinates = move(App.snake.head.x / App.blockSize, App.snake.head.y / App.blockSize, input.dir);
    App.snake.head.x = newHeadCoordinates.x * App.blockSize;
    App.snake.head.y = newHeadCoordinates.y * App.blockSize;

    if (App.snake.turns.length > 0 && 
        App.snake.turns[0].x == App.snake.tail.x &&
        App.snake.turns[0].y == App.snake.tail.y) {
        App.snake.tail.dir = App.snake.turns[0].dir;
        // consume turn
        App.snake.turns.splice(0, 1);
    }

    var newTailCoordinates = move(App.snake.tail.x / App.blockSize, App.snake.tail.y / App.blockSize, App.snake.tail.dir);

    if (App.snake.head.x == App.prey.x &&
        App.snake.head.y == App.prey.y) {
        // eat prey
        App.snake.eatPrey();
        // keep old tail
        newTailCoordinates = new Vertex(App.snake.tail.x / App.blockSize, App.snake.tail.y / App.blockSize);
        App.prey = null;
    }

    if (App.snake.isColliding(new Vertex(newHeadCoordinates.x * App.blockSize, newHeadCoordinates.y * App.blockSize))) {
        App.gameover = true;
        alert("GAME OVER!");
    }
    
    App.snake.paint();
    App.snake.tail.x = newTailCoordinates.x * App.blockSize;
    App.snake.tail.y = newTailCoordinates.y * App.blockSize;

    App.updateTimeoutId = window.setTimeout(update, App.framerate);
}

var move = function (x, y, dir) {
    var newX = x;
    var newY = y;

    switch (dir) {
        case "up":
            newY = y - 1;
        break;
        case "left":
            newX = x - 1;
        break;
        case "down":
            newY = y + 1;
        break;
        case "right":
            newX = x + 1;
        break;
    }

    if (newX >= App.sizeW || newX < 0 || newY >= App.sizeH || newY < 0) {
        App.gameover = true;
        update();
    }

    /** /
    newX %= App.sizeW;
    newX += newX < 0 ? App.sizeW : 0;
    newY %= App.sizeH;
    newY += newY < 0 ? App.sizeH : 0;
    /**/
    return new Vertex(newX, newY);
}

var KEYS = {
    "W":87, "A":65, "S":83, "D":68,
    "UP":38, "LEFT":37, "DOWN":40, "RIGHT":39
};

var input = {
    dir:    "",
    quit:   "",
    keyPressed: false
};

var press = function (event) {
    input.keyPressed = true;
    switch(event.keyCode) {
        case KEYS.W:
        case KEYS.UP:
            if (input.dir != "up" && input.dir != "down") {
                input.keyPressed = true;
                input.dir = "up";
                window.clearTimeout(App.updateTimeoutId);
                update();
                input.keyPressed = false;
            }
        break;
        case KEYS.A:
        case KEYS.LEFT:
            if (input.dir != "left" && input.dir != "right") {
                input.keyPressed = true;
                input.dir = "left";
                window.clearTimeout(App.updateTimeoutId);
                update();
                input.keyPressed = false;
            }
        break;
        case KEYS.S:
        case KEYS.DOWN:
            if (input.dir != "up" && input.dir != "down") {
                input.keyPressed = true;
                input.dir = "down";
                window.clearTimeout(App.updateTimeoutId);
                update();
                input.keyPressed = false;
            }
        break;
        case KEYS.D:
        case KEYS.RIGHT:
            if (input.dir != "left" && input.dir != "right") {
                input.keyPressed = true;
                input.dir = "right";
                window.clearTimeout(App.updateTimeoutId);
                update();
                input.keyPressed = false;
            }
        break;
    }
};