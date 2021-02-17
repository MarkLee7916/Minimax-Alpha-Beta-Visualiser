import { BinaryGameNode } from "../binaryGameNode";
import { buildTree, deepTreeCopy, TREE_DEPTH } from "./tree";

let root: BinaryGameNode;

export function newTree() {
    root = buildTree();

    return root;
}

export function runMinimax() {
    const animations: BinaryGameNode[] = [];

    max(root, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0, animations);

    return animations;
}

function max(gameTreeRoot: BinaryGameNode, alpha: number, beta: number, depth: number, animations: BinaryGameNode[]) { 
    gameTreeRoot.alpha = alpha; 
    gameTreeRoot.beta = beta; 
    gameTreeRoot.considered = true;

    animations.push(deepTreeCopy(root)); 

    if (depth === TREE_DEPTH) {
        return gameTreeRoot.currentValue;
    } else {
        const children = [gameTreeRoot.left, gameTreeRoot.right];

        gameTreeRoot.currentValue = Number.NEGATIVE_INFINITY;

        for (let i = 0; i < children.length; i++) {
            gameTreeRoot.currentValue = Math.max(gameTreeRoot.currentValue, min(children[i], gameTreeRoot.alpha, gameTreeRoot.beta, depth + 1, animations));
            gameTreeRoot.alpha = Math.max(gameTreeRoot.alpha, gameTreeRoot.currentValue);

            if (gameTreeRoot.alpha >= gameTreeRoot.beta) {
                break;
            }
        }

        animations.push(deepTreeCopy(root)); 

        return gameTreeRoot.currentValue;
    }
}

function min(gameTreeRoot: BinaryGameNode, alpha: number, beta: number, depth: number, animations: BinaryGameNode[]) {
    gameTreeRoot.alpha = alpha; 
    gameTreeRoot.beta = beta; 
    gameTreeRoot.considered = true;

    animations.push(deepTreeCopy(root)); 

    if (depth === TREE_DEPTH) {
        return gameTreeRoot.currentValue;
    } else {
        const children = [gameTreeRoot.left, gameTreeRoot.right];

        gameTreeRoot.currentValue = Number.POSITIVE_INFINITY;

        for (let i = 0; i < children.length; i++) {
            gameTreeRoot.currentValue = Math.min(gameTreeRoot.currentValue, max(children[i], gameTreeRoot.alpha, gameTreeRoot.beta, depth + 1, animations));
            gameTreeRoot.beta = Math.min(gameTreeRoot.beta, gameTreeRoot.currentValue);
            
            if (gameTreeRoot.alpha >= gameTreeRoot.beta) {
                break;
            }
        }    

        animations.push(deepTreeCopy(root)); 

        return gameTreeRoot.currentValue;
    } 
}

