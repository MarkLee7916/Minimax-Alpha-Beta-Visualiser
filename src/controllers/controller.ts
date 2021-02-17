import { newTree, runMinimax } from "../models/minimax";
import { TREE_DEPTH } from "../models/tree";
import { animateMinimax, drawTree, initView, ViewMessage } from "../views/view";

// Given a message from the view, return some action
const viewMessageToAction = new Map([
    [ViewMessage.Run, () => animateMinimax(TREE_DEPTH, runMinimax())],
    [ViewMessage.NewTree, () => drawTree(TREE_DEPTH, newTree())]
]);

window.addEventListener("load", () => {
    initView(messageFromView);
});

// Execute an action given a message from the view
function messageFromView(message: ViewMessage) {
    const action = viewMessageToAction.get(message);

    if (action === undefined) {
        throw `Controller doesn't support message: ${message}`
    } else {
        action();
    }
}