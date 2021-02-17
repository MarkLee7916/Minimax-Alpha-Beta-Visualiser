import { newSimulation } from "../models/minimax";
import { animateMinimax, initView, updateTree, ViewMessage } from "../views/view";

window.addEventListener("load", () => {
    initView(messageFromView);
});

// Given a message from the view, return some action
const viewMessageToAction = new Map([
    [ViewMessage.Run, () => animateMinimax()],
    [ViewMessage.NewTree, () => updateTree(newSimulation())]
]);

// Execute an action given a message from the view
function messageFromView(message: ViewMessage) {
    const action = viewMessageToAction.get(message);

    if (action === undefined) {
        throw `Controller doesn't support message: ${message}`
    } else {
        action();
    }
}