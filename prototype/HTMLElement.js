HTMLElement.prototype.clearAllChildren = clearAllChildren

/**
 * 移除 DOM 对象下所有子节点
 * @example
 * // clearAllChildren.call(DOM)
 *
 */
export function clearAllChildren() {
    while (this.firstChild) {
        let oldNode = this.removeChild(this.firstChild);
        oldNode = null;
    }
}