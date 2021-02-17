export interface BinaryGameNode {
    alpha: number,
    beta: number,
    currentValue: number,
    considered: boolean
    left: BinaryGameNode,
    right: BinaryGameNode
}
