(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var minimax_1 = require("../models/minimax");
var tree_1 = require("../models/tree");
var view_1 = require("../views/view");
// Given a message from the view, return some action
var viewMessageToAction = new Map([
    [0 /* Run */, function () { return view_1.animateMinimax(tree_1.TREE_DEPTH, minimax_1.runMinimax()); }],
    [1 /* NewTree */, function () { return view_1.drawTree(tree_1.TREE_DEPTH, minimax_1.newTree()); }]
]);
window.addEventListener("load", function () {
    view_1.initView(messageFromView);
});
// Execute an action given a message from the view
function messageFromView(message) {
    var action = viewMessageToAction.get(message);
    if (action === undefined) {
        throw "Controller doesn't support message: " + message;
    }
    else {
        action();
    }
}

},{"../models/minimax":2,"../models/tree":3,"../views/view":5}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.runMinimax = exports.newTree = void 0;
var tree_1 = require("./tree");
var root;
function newTree() {
    root = tree_1.buildTree();
    return root;
}
exports.newTree = newTree;
function runMinimax() {
    var animations = [];
    max(root, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0, animations);
    return animations;
}
exports.runMinimax = runMinimax;
function max(gameTreeRoot, alpha, beta, depth, animations) {
    gameTreeRoot.alpha = alpha;
    gameTreeRoot.beta = beta;
    gameTreeRoot.considered = true;
    animations.push(tree_1.deepTreeCopy(root));
    if (depth === tree_1.TREE_DEPTH) {
        return gameTreeRoot.currentValue;
    }
    else {
        var children = [gameTreeRoot.left, gameTreeRoot.right];
        gameTreeRoot.currentValue = Number.NEGATIVE_INFINITY;
        for (var i = 0; i < children.length; i++) {
            gameTreeRoot.currentValue = Math.max(gameTreeRoot.currentValue, min(children[i], gameTreeRoot.alpha, gameTreeRoot.beta, depth + 1, animations));
            gameTreeRoot.alpha = Math.max(gameTreeRoot.alpha, gameTreeRoot.currentValue);
            if (gameTreeRoot.alpha >= gameTreeRoot.beta) {
                break;
            }
        }
        animations.push(tree_1.deepTreeCopy(root));
        return gameTreeRoot.currentValue;
    }
}
function min(gameTreeRoot, alpha, beta, depth, animations) {
    gameTreeRoot.alpha = alpha;
    gameTreeRoot.beta = beta;
    gameTreeRoot.considered = true;
    animations.push(tree_1.deepTreeCopy(root));
    if (depth === tree_1.TREE_DEPTH) {
        return gameTreeRoot.currentValue;
    }
    else {
        var children = [gameTreeRoot.left, gameTreeRoot.right];
        gameTreeRoot.currentValue = Number.POSITIVE_INFINITY;
        for (var i = 0; i < children.length; i++) {
            gameTreeRoot.currentValue = Math.min(gameTreeRoot.currentValue, max(children[i], gameTreeRoot.alpha, gameTreeRoot.beta, depth + 1, animations));
            gameTreeRoot.beta = Math.min(gameTreeRoot.beta, gameTreeRoot.currentValue);
            if (gameTreeRoot.alpha >= gameTreeRoot.beta) {
                break;
            }
        }
        animations.push(tree_1.deepTreeCopy(root));
        return gameTreeRoot.currentValue;
    }
}

},{"./tree":3}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.deepTreeCopy = exports.buildTree = exports.TREE_DEPTH = void 0;
var utils_1 = require("../utils");
exports.TREE_DEPTH = 4;
function buildTree() {
    return buildTreeRecurse(exports.TREE_DEPTH);
    function buildTreeRecurse(depth) {
        var root = deepTreeCopy(emptyNode);
        if (depth === 0) {
            root.currentValue = utils_1.randomIntBetween(1, 100);
        }
        else {
            root.left = buildTreeRecurse(depth - 1);
            root.right = buildTreeRecurse(depth - 1);
        }
        return root;
    }
}
exports.buildTree = buildTree;
// Traverses the entire tree to make a complete deep copy
function deepTreeCopy(root) {
    if (root) {
        var copyRoot = utils_1.deepObjectCopy(root);
        copyRoot.left = deepTreeCopy(root.left);
        copyRoot.right = deepTreeCopy(root.right);
        return copyRoot;
    }
    else {
        return null;
    }
}
exports.deepTreeCopy = deepTreeCopy;
var emptyNode = {
    alpha: Number.NEGATIVE_INFINITY,
    beta: Number.POSITIVE_INFINITY,
    currentValue: null,
    considered: false,
    left: null,
    right: null
};

},{"../utils":4}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.vminToPx = exports.wait = exports.randomIntBetween = exports.deepObjectCopy = void 0;
// Note: this function isn't recursive, so doesn't make a deep copy of nested objects
function deepObjectCopy(object) {
    var copy = {};
    Array.from(Object.keys(object)).forEach(function (key) {
        copy[key] = object[key];
    });
    return copy;
}
exports.deepObjectCopy = deepObjectCopy;
// Generate a random whole number between bounds
function randomIntBetween(lower, upper) {
    return Math.floor(Math.random() * (upper - lower)) + lower;
}
exports.randomIntBetween = randomIntBetween;
// Blocking wait for timeout milliseconds, used for animations
function wait(timeout) {
    return new Promise(function (resolve) { return setTimeout(resolve, timeout); });
}
exports.wait = wait;
function vminToPx(vminVal) {
    return Math.min(window.innerHeight, window.innerWidth) * vminVal / 100;
}
exports.vminToPx = vminToPx;

},{}],5:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.drawTree = exports.animateMinimax = exports.initView = void 0;
var utils_1 = require("../utils");
// Dimensions of canvas in relation to dimensions of the screen
var CANVAS_HEIGHT_VMIN = 50;
var CANVAS_WIDTH_VMIN = 100;
// Dimensions of canvas in pixels
var CANVAS_WIDTH_PX = utils_1.vminToPx(CANVAS_WIDTH_VMIN);
var CANVAS_HEIGHT_PX = utils_1.vminToPx(CANVAS_HEIGHT_VMIN);
// Radius of a node in pixels
var NODE_RADIUS = CANVAS_WIDTH_PX / 130;
// Amount of time we wait between animations, a lower value means faster animations
var ANIMATION_DELAY = 1000;
var colors = {
    considered: "green",
    notConsidered: "pink",
    currentValue: "red",
    alpha: "orange",
    beta: "black"
};
// Map a nodes value onto the string used to display it
var numberToTextContent = new Map([
    [Number.POSITIVE_INFINITY, "∞"],
    [Number.NEGATIVE_INFINITY, "-∞"],
    [null, " "]
]);
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
// Function we use to talk to controller, passed in as a callback through initView()
var notifyController;
function initView(notif) {
    notifyController = notif;
    initCanvas();
    initEventListeners();
    notifyController(1 /* NewTree */);
}
exports.initView = initView;
function animateMinimax(depth, animations) {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hideMenu();
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < animations.length)) return [3 /*break*/, 4];
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    drawBinaryTree(CANVAS_WIDTH_PX / 2, NODE_RADIUS * 2, depth, animations[i]);
                    return [4 /*yield*/, utils_1.wait(ANIMATION_DELAY)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    showMenu();
                    return [2 /*return*/];
            }
        });
    });
}
exports.animateMinimax = animateMinimax;
function drawTree(depth, root) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBinaryTree(CANVAS_WIDTH_PX / 2, NODE_RADIUS * 2, depth, root);
}
exports.drawTree = drawTree;
function initCanvas() {
    canvas.width = CANVAS_WIDTH_PX;
    canvas.height = CANVAS_HEIGHT_PX;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    context.font = NODE_RADIUS * 3 + "px Arial";
}
function initEventListeners() {
    document.getElementById("run").addEventListener("click", function () { return notifyController(0 /* Run */); });
    document.getElementById("new-tree").addEventListener("click", function () { return notifyController(1 /* NewTree */); });
}
function hideMenu() {
    document.getElementById("menu").style.visibility = "hidden";
}
function showMenu() {
    document.getElementById("menu").style.visibility = "visible";
}
// Draw a binary tree dynamically depending on depth
function drawBinaryTree(x, y, depth, gameNode) {
    var root = node(x, y);
    paintNode(x, y, root, gameNode);
    if (depth > 0) {
        var leftChildXCoord = x - NODE_RADIUS * Math.pow(2, depth + 1);
        var rightChildXCoord = x + NODE_RADIUS * Math.pow(2, depth + 1);
        var childYCoord = y + NODE_RADIUS * 14;
        var leftEdge = edge(x, y, leftChildXCoord, childYCoord);
        var rightEdge = edge(x, y, rightChildXCoord, childYCoord);
        context.stroke(leftEdge);
        context.stroke(rightEdge);
        drawBinaryTree(leftChildXCoord, childYCoord, depth - 1, gameNode.left);
        drawBinaryTree(rightChildXCoord, childYCoord, depth - 1, gameNode.right);
    }
}
// Paint a node and its value on the screen
function paintNode(x, y, root, gameNode) {
    paintConsidered(root, gameNode);
    paintCurrentValue(x, y, gameNode.currentValue);
}
// Handle the nodes colour depending on whether it has been considered
function paintConsidered(root, gameNode) {
    context.fillStyle = gameNode.considered ? colors.considered : colors.notConsidered;
    context.fill(root);
}
function paintAlpha(x, y, alpha) {
    var text = valueToStringRepresentation(alpha);
    context.fillStyle = colors.alpha;
    context.fillText(text, x - 4 * NODE_RADIUS, y);
}
function paintBeta(x, y, beta) {
    var text = valueToStringRepresentation(beta);
    context.fillStyle = colors.beta;
    context.fillText(text, x + 2 * NODE_RADIUS, y);
}
function paintCurrentValue(x, y, val) {
    var text = valueToStringRepresentation(val);
    context.fillStyle = colors.currentValue;
    context.fillText(text, x - NODE_RADIUS, y + 5 * NODE_RADIUS);
}
// Convert a value to a string used to display it on the canvas
function valueToStringRepresentation(val) {
    var text = numberToTextContent.get(val);
    if (text === undefined) {
        text = JSON.stringify(val);
    }
    return text;
}
// Draw a line from (xStart, yStart) to (xEnd, yEnd)
function edge(xStart, yStart, xEnd, yEnd) {
    var line = new Path2D();
    line.moveTo(xStart, yStart);
    line.lineTo(xEnd, yEnd);
    return line;
}
// Draw a circle denoting a node
function node(x, y) {
    var shape = new Path2D();
    shape.arc(x, y, NODE_RADIUS, 0, 2 * Math.PI);
    return shape;
}

},{"../utils":4}]},{},[5,2,1]);
