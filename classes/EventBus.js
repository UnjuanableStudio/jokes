import mitt from 'mitt';

const emitter = mitt(); // 事件监听器
const data = new Map(); // 事件对象池

/** 默认配置 **/
const options = {
    regularUUID: new RegExp(`\{uuid\}`)
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
     * @param {object} opt - 配置
     * @param {RegExp} opt.regularUUID - 匹配事件对象UUID的规则，可以是正则表达式或字符串
     */
    constructor(opt = options) {
        this.regularUUID = opt.regularUUID ?? options.regularUUID
    }

    /**
     * 获取对象
     * @param {string,null} uuid - 事件对象唯一ID
     * @returns {null|*}
     */
    fetch(uuid = null) {
        if (uuid === null) return this.getActive()
        if (!this.pool.has(uuid)) return null
        return this.pool.get(uuid)
    }

    /**
     * 创建事件对象
     * @param {string} uuid - 事件对象唯一ID
     * @param {object} object - 事件对象内容
     * @returns {boolean}
     */
    createPool(uuid, object) {
        if (this.pool.has(uuid)) return false
        this.pool.set(uuid, object)
        return true
    }

    /**
     * 移除事件对象
     * @param {string} uuid - 事件对象唯一ID
     * @returns {boolean}
     */
    removePool(uuid) {
        if (!this.pool.has(uuid)) return false
        delete this.pool.delete[uuid]
        return true
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
     * @param {string,null} uuid - 事件对象唯一ID
     * @param callback
     * @returns {boolean}
     */
    setActive(uuid, callback = null) {
        if (this.pool.has(uuid)) {
            const originUUID = this.activeUUID
            this.activeUUID = uuid
            callback && callback(originUUID)
            return true
        }
        return false
    }

    /**
     * 添加监听事件
     * @param {string} type - 事件类型
     * @param {function} handler -事件回调方法
     * @param {string,null} uuid - 事件对象唯一ID
     */
    on(type, handler, uuid = null) {
        emitter.on(eventType.call(this, type, uuid), e => {
            handler(e, this)
        })
    }

    /**
     * 移除监听事件
     * @param {string} type - 事件类型
     * @param {function} handler -事件回调方法
     * @param {string,null} uuid - 事件对象唯一ID
     */
    off(type, handler, uuid = null) {
        emitter.off(eventType.call(this, type, uuid), handler)
    }

    /**
     * 触发监听事件
     * @param {string} type - 事件类型
     * @param {*} event - 回调参数
     * @param {string,null} uuid - 事件对象唯一ID
     */
    emit(type, event, uuid = null) {
        emitter.emit(eventType.call(this, type, uuid), event)
    }

    /**
     * 遍历全部事件
     * @param {string,null} uuid - 事件对象唯一ID
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
 * @param {string} type - 原始事件类型
 * @param {string,null} uuid - 事件对象唯一ID
 * @returns {*}
 */
function eventType(type, uuid = null) {
    if (uuid === null) {
        uuid = this.activeUUID
    }
    return type.replace(this.regularUUID, uuid)
}
