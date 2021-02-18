import { deepObjectCopy, randomIntBetween } from "./utils";

export const TREE_DEPTH = 4;

export interface Node {
    alpha: number,
    beta: number,
    currentValue: number,
    considered: boolean
    left: Node,
    right: Node
}

export function buildTree(values: number[]) {
    fillValues(values);

    return buildTreeRecurse(TREE_DEPTH, values);

    function buildTreeRecurse(depth: number, values: number[]) {
        const root = deepTreeCopy(emptyNode);

        if (depth === 0) {
            root.currentValue = values.shift()
        } else {
            root.left = buildTreeRecurse(depth - 1, values);
            root.right = buildTreeRecurse(depth - 1, values);
        }

        return root;
    }

    function fillValues(values: number[]) {
        while (values.length < Math.pow(2, TREE_DEPTH)) {
            values.push(randomIntBetween(1, 100));
        }
    }
}

// Traverses the entire tree to make a complete deep copy
export function deepTreeCopy(root: Node) {
    if (root) {
        const copyRoot = deepObjectCopy(root);

        copyRoot.left = deepTreeCopy(root.left);
        copyRoot.right = deepTreeCopy(root.right);

        return copyRoot;
    } else {
        return null;
    }
}

const emptyNode: Node = {
    alpha: Number.NEGATIVE_INFINITY,
    beta: Number.POSITIVE_INFINITY,
    currentValue: null,
    considered: false,
    left: null,
    right: null
}