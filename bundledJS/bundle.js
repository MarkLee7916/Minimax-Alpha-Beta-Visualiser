(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var minimax_1 = require("../models/minimax");
var view_1 = require("../views/view");
window.addEventListener("load", function () {
    view_1.initView(messageFromView);
});
// Given a message from the view, return some action
var viewMessageToAction = new Map([
    [0 /* Run */, function () { return view_1.animateMinimax(); }],
    [1 /* NewTree */, function () { return view_1.updateTree(minimax_1.newSimulation()); }]
]);
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

},{"../models/minimax":2,"../views/view":5}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.newSimulation = void 0;
var tree_1 = require("../tree");
function newSimulation() {
    var animations = [];
    var root = tree_1.buildTree();
    max(root, root, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0, animations);
    return animations;
}
exports.newSimulation = newSimulation;
function max(root, node, alpha, beta, depth, animations) {
    node.alpha = alpha;
    node.beta = beta;
    node.considered = true;
    animations.push(tree_1.deepTreeCopy(root));
    if (depth === tree_1.TREE_DEPTH) {
        return node.currentValue;
    }
    else {
        var children = [node.left, node.right];
        node.currentValue = Number.NEGATIVE_INFINITY;
        for (var i = 0; i < children.length; i++) {
            node.currentValue = Math.max(node.currentValue, min(root, children[i], node.alpha, node.beta, depth + 1, animations));
            node.alpha = Math.max(node.alpha, node.currentValue);
            if (node.alpha >= node.beta) {
                break;
            }
        }
        animations.push(tree_1.deepTreeCopy(root));
        return node.currentValue;
    }
}
function min(root, node, alpha, beta, depth, animations) {
    node.alpha = alpha;
    node.beta = beta;
    node.considered = true;
    animations.push(tree_1.deepTreeCopy(root));
    if (depth === tree_1.TREE_DEPTH) {
        return node.currentValue;
    }
    else {
        var children = [node.left, node.right];
        node.currentValue = Number.POSITIVE_INFINITY;
        for (var i = 0; i < children.length; i++) {
            node.currentValue = Math.min(node.currentValue, max(root, children[i], node.alpha, node.beta, depth + 1, animations));
            node.beta = Math.min(node.beta, node.currentValue);
            if (node.alpha >= node.beta) {
                break;
            }
        }
        animations.push(tree_1.deepTreeCopy(root));
        return node.currentValue;
    }
}

},{"../tree":3}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.deepTreeCopy = exports.buildTree = exports.TREE_DEPTH = void 0;
var utils_1 = require("./utils");
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

},{"./utils":4}],4:[function(require,module,exports){
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
exports.animateMinimax = exports.initView = exports.updateTree = void 0;
var tree_1 = require("../tree");
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
    orientation: "orange"
};
// Map a nodes value onto the string used to display it
var numberToTextContent = new Map([
    [Number.POSITIVE_INFINITY, "∞"],
    [Number.NEGATIVE_INFINITY, "-∞"],
    [null, " "]
]);
// Reference to the canvas
var canvas = document.getElementById("canvas");
// Reference to the 2D context of the canvas. This is what we actually work with when we draw things on the canvas
var context = canvas.getContext("2d");
// Function we use to talk to controller, passed in as a callback through initView()
var notifyController;
// The current list of animations we're working with
var animations;
// Keeps track of the current animation we're on
var animationIndex = 0;
function updateTree(anims) {
    animations = anims;
    animationIndex = 0;
    drawTree();
}
exports.updateTree = updateTree;
function initView(notif) {
    notifyController = notif;
    initCanvas();
    initEventListeners();
    notifyController(1 /* NewTree */);
}
exports.initView = initView;
function animateMinimax() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hideMenu();
                    _a.label = 1;
                case 1:
                    if (!(animationIndex < animations.length)) return [3 /*break*/, 3];
                    drawTree();
                    return [4 /*yield*/, utils_1.wait(ANIMATION_DELAY)];
                case 2:
                    _a.sent();
                    animationIndex++;
                    return [3 /*break*/, 1];
                case 3:
                    showMenu();
                    return [2 /*return*/];
            }
        });
    });
}
exports.animateMinimax = animateMinimax;
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
function drawTree() {
    clearCanvas();
    drawBinaryTree(CANVAS_WIDTH_PX / 2, NODE_RADIUS * 2, 0, animations[animationIndex]);
}
// Draw the previous tree in the animation, creating a 'step backward' effect
function drawPrevtree() {
    if (animationIndex > 0) {
        animationIndex--;
        drawTree();
    }
}
// Draw the next tree in the animation, creating a 'step forward' effect
function drawNextTree() {
    if (animationIndex < animations.length - 1) {
        animationIndex++;
        drawTree();
    }
}
function initCanvas() {
    canvas.width = CANVAS_WIDTH_PX;
    canvas.height = CANVAS_HEIGHT_PX;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
}
function initEventListeners() {
    document.getElementById("run").addEventListener("click", function () { return notifyController(0 /* Run */); });
    document.getElementById("new-tree").addEventListener("click", function () { return notifyController(1 /* NewTree */); });
    document.getElementById("step-back").addEventListener("click", drawPrevtree);
    document.getElementById("step-forward").addEventListener("click", drawNextTree);
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
    if (depth < tree_1.TREE_DEPTH) {
        var leftChildXCoord = getChildXCoordinate(x, depth, -1);
        var rightChildXCoord = getChildXCoordinate(x, depth, 1);
        var childYCoord = getChildYCoordinate(y);
        var leftEdge = edge(x, y, leftChildXCoord, childYCoord);
        var rightEdge = edge(x, y, rightChildXCoord, childYCoord);
        paintOrientation(x, y, depth);
        context.stroke(leftEdge);
        context.stroke(rightEdge);
        drawBinaryTree(leftChildXCoord, childYCoord, depth + 1, gameNode.left);
        drawBinaryTree(rightChildXCoord, childYCoord, depth + 1, gameNode.right);
    }
}
function getChildXCoordinate(x, depth, directionOffset) {
    var depthScale = tree_1.TREE_DEPTH - depth;
    return x + (directionOffset * NODE_RADIUS * Math.pow(2, depthScale + 1));
}
function getChildYCoordinate(y) {
    var vertScale = 14;
    return y + NODE_RADIUS * vertScale;
}
// Paint 'MIN' next to a node if it's a minimizer and vice versa
function paintOrientation(x, y, depth) {
    var orientationStr = depth % 2 == 0 ? "MAX" : "MIN";
    var fontScale = 2;
    var horizScale = 7;
    context.font = NODE_RADIUS * fontScale + "px Arial";
    context.fillStyle = colors.orientation;
    context.fillText(orientationStr, x - horizScale * NODE_RADIUS, y);
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
function paintCurrentValue(x, y, val) {
    var text = valueToStringRepresentation(val);
    var fontScale = 3;
    var textYScale = 6;
    context.font = NODE_RADIUS * fontScale + "px Arial";
    context.fillStyle = colors.currentValue;
    context.fillText(text, x - NODE_RADIUS * 1.5, y + textYScale * NODE_RADIUS);
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

},{"../tree":3,"../utils":4}]},{},[5,2,1]);
