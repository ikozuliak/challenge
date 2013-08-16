'use strict';

function extendObject(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}

function distanceTo(pointA, pointB) {
    var dx = Math.abs(pointA.x - pointB.x);
    var dy = Math.abs(pointA.y - pointB.y);

    return Math.sqrt(dx * dx + dy * dy);
}

function getRandom(min, max) {
    return ~~(Math.random() * (max - min + 1) + min);
}

function scrollX() {
    return window.pageXOffset || window.document.documentElement.scrollLeft;
}

function scrollY() {
    return window.pageYOffset || window.document.documentElement.scrollTop;
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();


