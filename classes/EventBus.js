import mitt from 'mitt';

const emitter = mitt(); // 事件监听器
const data = new Map(); // 事件对象池

/** 默认配置 **/
const options = {
    regularUUID: new RegExp(`\{uuid\}`) // 匹配事件对象UUID的规则
}

/**
 * 事件引擎类，可监听多组同质化事件
 * @author LeeNux <@lc7457>
 * @version 1.0.0
 */
export class EventBus {
    activeUUID = null;

    get pool() {
        return data
    }

    /**
     * 创建 Event Bus
     * @param {object} opt
     * @param {RegExp} opt.regularUUID
     */
    constructor(opt = options) {
        this.regularUUID = opt.regularUUID ?? options.regularUUID
    }

    /**
     * 获取对象
     * @param {string,null} uuid
     * @returns {boolean|*|null}
     */
    fetch(uuid = null) {
        if (uuid === null) return this.getActive()
        if (!this.pool.has(uuid)) return false
        return this.pool.get(uuid)
    }

    /**
     * 创建事件对象
     * @param {string} uuid
     * @param {object} object
     */
    createPool(uuid, object) {
        if (this.pool.has(uuid)) return false
        this.pool.set(uuid, object)
    }

    /**
     * 移除事件对象
     * @param {string} uuid
     */
    removePool(uuid) {
        if (!this.pool.has(uuid)) return
        delete this.pool.delete[uuid]
    }

    /**
     * 获取激活的事件对象
     * @returns {null|any}
     */
    getActive() {
        if (this.activeUUID && this.pool.has(this.activeUUID)) {
            return this.pool.get(this.activeUUID)
        }
        return null
    }

    /**
     * 设置激活对象
     * @param {string,null} uuid
     * @param callback
     */
    setActive(uuid, callback = null) {
        if (this.pool.has(uuid)) {
            this.activeUUID = uuid
            callback && callback(this.pool.get(uuid))
        }
    }

    /**
     * 添加监听事件
     * @param {string} type 事件类型
     * @param {function} handler 事件方法
     * @param {string,null} uuid 舞台ID
     */
    on(type, handler, uuid = null) {
        emitter.on(eventType.call(this, type, uuid), e => {
            handler(e, this)
        })
    }

    /**
     * 移除监听事件
     * @param {string} type
     * @param {function} handler
     * @param {string,null} uuid
     */
    off(type, handler, uuid = null) {
        emitter.off(eventType.call(this, type, uuid), handler)
    }

    /**
     * 触发监听事件
     * @param {string} type 事件类型
     * @param {*} event 事件参数
     * @param {string,null} uuid 舞台ID
     */
    emit(type, event, uuid = null) {
        emitter.emit(eventType.call(this, type, uuid), event)
    }

    /**
     * 遍历全部事件
     * @param {string,null} uuid
     * @returns
     */
    all(uuid = null) {
        if (uuid) {
            const events = new Map()
            const reg = new RegExp(uuid + "\:")
            for (let [key, value] of emitter.all) {
                if (key.search(reg) >= 0) {
                    events.set(key, value)
                }
            }
            return events
        } else {
            return emitter.all
        }
    }
}

/**
 * 获取当前事件
 * @private
 * @param {string} type
 * @param {string,null} uuid
 * @returns {*}
 */
function eventType(type, uuid = null) {
    if (uuid === null) {
        uuid = this.activeUUID
    }
    return type.replace(this.regularUUID, uuid)
}