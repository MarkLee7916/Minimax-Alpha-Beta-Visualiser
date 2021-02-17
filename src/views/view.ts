import { Node, TREE_DEPTH } from "../tree";
import { vminToPx, wait } from "../utils";

// Protocol we use to talk to controller
export const enum ViewMessage {
    Run,
    NewTree
}

// Dimensions of canvas in relation to dimensions of the screen
const CANVAS_HEIGHT_VMIN = 50;
const CANVAS_WIDTH_VMIN = 100;

// Dimensions of canvas in pixels
const CANVAS_WIDTH_PX = vminToPx(CANVAS_WIDTH_VMIN)
const CANVAS_HEIGHT_PX = vminToPx(CANVAS_HEIGHT_VMIN);

// Radius of a node in pixels
const NODE_RADIUS = CANVAS_WIDTH_PX / 130;

// Amount of time we wait between animations, a lower value means faster animations
const ANIMATION_DELAY = 1000;

const colors = {
    considered: "green",
    notConsidered: "pink",
    currentValue: "red",
    orientation: "orange"
}

// Map a nodes value onto the string used to display it
const numberToTextContent = new Map([
    [Number.POSITIVE_INFINITY, "∞"],
    [Number.NEGATIVE_INFINITY, "-∞"],
    [null, " "]
]);

// Reference to the canvas
const canvas = <HTMLCanvasElement>document.getElementById("canvas");

// Reference to the 2D context of the canvas. This is what we actually work with when we draw things on the canvas
const context = canvas.getContext("2d");

// Function we use to talk to controller, passed in as a callback through initView()
let notifyController: (message: ViewMessage) => void;

// The current list of animations we're working with
let animations: Node[];

// Keeps track of the current animation we're on
let animationIndex = 0;

export function updateTree(anims: Node[]) {
    animations = anims;
    animationIndex = 0;

    drawTree();
}

export function initView(notif: (message: ViewMessage) => void) {
    notifyController = notif;

    initCanvas();
    initEventListeners();

    notifyController(ViewMessage.NewTree);
}

export async function animateMinimax() {
    hideMenu();

    while (animationIndex < animations.length) {
        drawTree();

        await wait(ANIMATION_DELAY);

        animationIndex++;
    }

    showMenu();
}

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
    document.getElementById("run").addEventListener("click", () => notifyController(ViewMessage.Run));
    document.getElementById("new-tree").addEventListener("click", () => notifyController(ViewMessage.NewTree));
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
function drawBinaryTree(x: number, y: number, depth: number, gameNode: Node) {
    const root = node(x, y);
    
    paintNode(x, y, root, gameNode);

    if (depth < TREE_DEPTH) {
        const leftChildXCoord = getChildXCoordinate(x, depth, -1);
        const rightChildXCoord = getChildXCoordinate(x, depth, 1);
        const childYCoord = getChildYCoordinate(y);

        const leftEdge = edge(x, y, leftChildXCoord, childYCoord);
        const rightEdge = edge(x, y, rightChildXCoord, childYCoord);

        paintOrientation(x, y, depth);

        context.stroke(leftEdge);
        context.stroke(rightEdge);

        drawBinaryTree(leftChildXCoord, childYCoord, depth + 1, gameNode.left);
        drawBinaryTree(rightChildXCoord, childYCoord, depth + 1, gameNode.right);
    }
}

function getChildXCoordinate(x: number, depth: number, directionOffset: number) {
    const depthScale = TREE_DEPTH - depth;

    return x + (directionOffset *  NODE_RADIUS * Math.pow(2, depthScale + 1));
}

function getChildYCoordinate(y: number) {
    const vertScale = 14;

    return y + NODE_RADIUS * vertScale;
}

// Paint 'MIN' next to a node if it's a minimizer and vice versa
function paintOrientation(x: number, y: number, depth: number) {
    const orientationStr = depth % 2 == 0 ? "MAX" : "MIN";
    const fontScale = 2;
    const horizScale = 7;

    context.font = `${NODE_RADIUS * fontScale}px Arial`;
    context.fillStyle = colors.orientation;
    context.fillText(orientationStr, x - horizScale * NODE_RADIUS, y);
}

// Paint a node and its value on the screen
function paintNode(x: number, y: number, root: Path2D, gameNode: Node) {
    paintConsidered(root, gameNode);
    paintCurrentValue(x, y, gameNode.currentValue);
}

// Handle the nodes colour depending on whether it has been considered
function paintConsidered(root: Path2D, gameNode: Node) {
    context.fillStyle = gameNode.considered ? colors.considered : colors.notConsidered;
    context.fill(root);
}

function paintCurrentValue(x: number, y: number, val: number) {
    const text = valueToStringRepresentation(val);
    const fontScale = 3;
    const textYScale = 6;

    context.font = `${NODE_RADIUS * fontScale}px Arial`;
    context.fillStyle = colors.currentValue;
    context.fillText(text, x - NODE_RADIUS * 1.5, y + textYScale * NODE_RADIUS);
}

// Convert a value to a string used to display it on the canvas
function valueToStringRepresentation(val: number) {
    let text = numberToTextContent.get(val);

    if (text === undefined) {
        text = JSON.stringify(val);
    }

    return text;
}

// Draw a line from (xStart, yStart) to (xEnd, yEnd)
function edge(xStart: number, yStart: number, xEnd: number, yEnd: number) {
    const line = new Path2D();

    line.moveTo(xStart, yStart);
    line.lineTo(xEnd, yEnd);

    return line;
}

// Draw a circle denoting a node
function node(x: number, y: number) {
    const shape = new Path2D();

    shape.arc(x, y, NODE_RADIUS, 0, 2 * Math.PI);

    return shape;
}
