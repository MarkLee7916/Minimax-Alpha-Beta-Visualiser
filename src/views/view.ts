import { BinaryGameNode } from "../binaryGameNode";
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
    alpha: "orange",
    beta: "black"
}

// Map a nodes value onto the string used to display it
const numberToTextContent = new Map([
    [Number.POSITIVE_INFINITY, "∞"],
    [Number.NEGATIVE_INFINITY, "-∞"],
    [null, " "]
]);

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const context = canvas.getContext("2d");

// Function we use to talk to controller, passed in as a callback through initView()
let notifyController: (message: ViewMessage) => void;

export function initView(notif: (message: ViewMessage) => void) {
    notifyController = notif;

    initCanvas();
    initEventListeners();

    notifyController(ViewMessage.NewTree);
}

export async function animateMinimax(depth: number, animations: BinaryGameNode[]) {
    hideMenu();

    for (let i = 0; i < animations.length; i++) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        drawBinaryTree(CANVAS_WIDTH_PX / 2, NODE_RADIUS * 2, depth, animations[i]);    
                
        await wait(ANIMATION_DELAY);   
    }

    showMenu();
}

export function drawTree(depth: number, root: BinaryGameNode) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBinaryTree(CANVAS_WIDTH_PX / 2, NODE_RADIUS * 2, depth, root);    
}

function initCanvas() {
    canvas.width = CANVAS_WIDTH_PX;
    canvas.height = CANVAS_HEIGHT_PX;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";

    context.font = `${NODE_RADIUS * 3}px Arial`;
}

function initEventListeners() {
    document.getElementById("run").addEventListener("click", () => notifyController(ViewMessage.Run));
    document.getElementById("new-tree").addEventListener("click", () => notifyController(ViewMessage.NewTree));
}

function hideMenu() {
    document.getElementById("menu").style.visibility = "hidden";
}

function showMenu() {
    document.getElementById("menu").style.visibility = "visible";
}

// Draw a binary tree dynamically depending on depth
function drawBinaryTree(x: number, y: number, depth: number, gameNode: BinaryGameNode) {
    const root = node(x, y);

    paintNode(x, y, root, gameNode);

    if (depth > 0) {
        const leftChildXCoord = x - NODE_RADIUS * Math.pow(2, depth + 1);
        const rightChildXCoord = x + NODE_RADIUS * Math.pow(2, depth + 1);
        const childYCoord = y + NODE_RADIUS * 14;

        const leftEdge = edge(x, y, leftChildXCoord, childYCoord);
        const rightEdge = edge(x, y, rightChildXCoord, childYCoord);

        context.stroke(leftEdge);
        context.stroke(rightEdge);

        drawBinaryTree(leftChildXCoord, childYCoord, depth - 1, gameNode.left);
        drawBinaryTree(rightChildXCoord, childYCoord, depth - 1, gameNode.right);
    }
}

// Paint a node and its value on the screen
function paintNode(x: number, y: number, root: Path2D, gameNode: BinaryGameNode) {
    paintConsidered(root, gameNode);
    paintCurrentValue(x, y, gameNode.currentValue);
}

// Handle the nodes colour depending on whether it has been considered
function paintConsidered(root: Path2D, gameNode: BinaryGameNode) {
    context.fillStyle = gameNode.considered ? colors.considered : colors.notConsidered;
    context.fill(root);
}

function paintAlpha(x: number, y: number, alpha: number) {
    const text = valueToStringRepresentation(alpha);

    context.fillStyle = colors.alpha;
    context.fillText(text, x - 4 * NODE_RADIUS, y);
}

function paintBeta(x: number, y: number, beta: number) {
    const text = valueToStringRepresentation(beta);

    context.fillStyle = colors.beta;
    context.fillText(text, x + 2 * NODE_RADIUS, y);
}

function paintCurrentValue(x: number, y: number, val: number) {
    const text = valueToStringRepresentation(val);

    context.fillStyle = colors.currentValue;
    context.fillText(text, x - NODE_RADIUS, y + 5 * NODE_RADIUS);
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