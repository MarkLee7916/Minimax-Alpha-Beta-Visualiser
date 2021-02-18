import { Node, buildTree, deepTreeCopy, TREE_DEPTH } from "../tree";

export function newSimulation(values: number[]) {
    const animations: Node[] = [];
    const root = buildTree(values);

    max(root, root, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0, animations);

    return animations;
}

function max(root: Node, node: Node, alpha: number, beta: number, depth: number, animations: Node[]) { 
    node.alpha = alpha; 
    node.beta = beta; 
    node.considered = true;

    animations.push(deepTreeCopy(root)); 

    if (depth === TREE_DEPTH) {
        return node.currentValue;
    } else {
        const children = [node.left, node.right];

        node.currentValue = Number.NEGATIVE_INFINITY;

        for (let i = 0; i < children.length; i++) {
            node.currentValue = Math.max(node.currentValue, min(root, children[i], node.alpha, node.beta, depth + 1, animations));
            node.alpha = Math.max(node.alpha, node.currentValue);

            if (node.alpha >= node.beta) {
                break;
            }
        }

        animations.push(deepTreeCopy(root)); 

        return node.currentValue;
    }
}

function min(root: Node, node: Node, alpha: number, beta: number, depth: number, animations: Node[]) {
    node.alpha = alpha; 
    node.beta = beta; 
    node.considered = true;

    animations.push(deepTreeCopy(root)); 

    if (depth === TREE_DEPTH) {
        return node.currentValue;
    } else {
        const children = [node.left, node.right];

        node.currentValue = Number.POSITIVE_INFINITY;

        for (let i = 0; i < children.length; i++) {
            node.currentValue = Math.min(node.currentValue, max(root, children[i], node.alpha, node.beta, depth + 1, animations));
            node.beta = Math.min(node.beta, node.currentValue);
            
            if (node.alpha >= node.beta) {
                break;
            }
        }    

        animations.push(deepTreeCopy(root)); 

        return node.currentValue;
    } 
}

