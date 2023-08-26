import mitt from "mitt";

const pools = new Map(); // 事件池

/**
 * 事件总线
 * @version 1.0
 * @param {?string} uuid
 * @returns {*}
 */
export function useEventBus(uuid = null) {
    let activeUUID = pools.has(uuid) ? uuid : null

    /**
     * 初始化一个事件池
     * @param {string} uuid
     * @param {boolean} force
     * @returns {boolean}
     */
    const initPool = (uuid, force = false) => {
        if (pools.has(uuid) && !force) return false
        this.pool.set(uuid, new mitt())
        return true
    }

    /**
     * 读取一个事件池
     * @param {?string} uuid
     * @returns {any|null}
     */
    const getPool = (uuid = null) => {
        if (uuid === null) return getActivePool()
        if (!pools.has(uuid)) return null
        return pools.get(uuid)
    }

    /**
     * 删除一个事件池
     * @param {string} uuid
     * @returns {boolean}
     */
    const destroyPool = (uuid) => {
        if (pools.has(uuid)) {
            pools.delete(uuid)
            return true
        }
        return false
    }

    /**
     * 获取当前激活的事件池
     * @returns {any|null}
     */
    const getActivePool = () => {
        if (activeUUID && pools.has(activeUUID)) {
            return pools.get(activeUUID)
        }
        return null
    }

    /**
     * 激活一个事件池
     * @param {string} uuid
     * @returns {boolean}
     */
    const setActivePool = (uuid) => {
        if (pools.has(uuid)) {
            activeUUID = uuid
            return true
        }
        return false
    }

    /**
     * 添加事件监听器
     * @param {string} handler 事件类型（名）
     * @param {function} callback 事件回调
     * @param {?string} uuid 事件池ID
     */
    const addListener = (handler, callback, uuid = null) => {
        const p = uuid ? getPool(uuid) : getActivePool()
        if (p) {
            p.on(handler, e => {
                callback && callback(e, this)
            })
        }
    }

    /**
     * 移除事件监听器
     * @param {string} handler 事件类型（名）
     * @param {function} callback 事件回调
     * @param {?string} uuid 事件池ID
     */
    const removeListener = (handler, callback, uuid = null) => {
        const p = uuid ? getPool(uuid) : getActivePool()
        if (p) {
            p.off(handler, callback)
        }
    }

    /**
     * 触发监听事件
     * @param {string} handler 事件类型（名）
     * @param {any} params 事件回调
     * @param {?string} uuid 事件池ID
     */
    const fireEvent = (handler, params, uuid = null) => {
        const p = uuid ? getPool(uuid) : getActivePool()
        p.emit(handler, params)
    }

    /**
     * 遍历当前事件池
     * @param uuid
     * @returns {any}
     */
    const eventList = (uuid = null) => {
        const p = uuid ? getPool(uuid) : getActivePool()
        if (p) {
            return p.all
        }
        return null
    }

    return {
        initPool, destroyPool, getPool, getActivePool, setActivePool,
        addListener, removeListener, fireEvent, eventList
    }
}
