import mitt from 'mitt';

const emitter = mitt();

/** 对象池 **/
const store = new Map()

/**
 * 默认配置
 * @type {{reg: RegExp}} 匹配事件类型
 */
const options = {
    reg: new RegExp(`\{uuid\}`)
}

/**
 * Event Bus
 * @doc 多路事件总线，通过UUID激活事件对象
 */
export class EventBus {
    activatedUUID = null;

    get pool() {
        return store
    }

    constructor(opt = options) {
        this.reg = opt.reg ?? options.reg
    }

    /**
     * 获取对象
     * @param uuid
     * @returns {boolean|*|null}
     */
    fetch(uuid = null) {
        if (uuid === null) return this.getActivated()
        if (!this.pool.has(uuid)) return false
        return this.pool.get(uuid)
    }

    /**
     * 增加事件对象
     * @param uuid
     * @param object
     */
    addPool(uuid, object) {
        this.pool.set(uuid, object)
    }

    /**
     * 获取激活的事件对象
     * @returns {null|any}
     */
    getActivated() {
        if (this.activatedUUID && this.pool.has(this.activatedUUID)) {
            return this.pool.get(this.activatedUUID)
        }
        return null
    }

    /**
     * 设置激活对象
     * @param uuid
     * @param callback
     */
    setActivate(uuid, callback = null) {
        if (this.pool.has(uuid)) {
            this.activatedUUID = uuid
            callback && callback(this.pool.get(uuid))
        }
    }

    /**
     * 获取当前事件
     * @param type
     * @param uuid
     * @returns {*}
     */
    _acType = (type, uuid = null) => {
        if (uuid === null) {
            uuid = this.activatedUUID
        }
        return type.replace(this.reg, uuid)
    }

    /**
     * 添加监听事件
     * @param type 事件类型
     * @param handler 事件方法
     * @param uuid 舞台ID
     */
    on(type, handler, uuid = null) {
        emitter.on(this._acType(type, uuid), e => {
            handler(e, this)
        })
    }

    /**
     * 移除监听事件
     * @param type
     * @param handler
     * @param uuid
     */
    off(type, handler, uuid = null) {
        emitter.off(this._acType(type, uuid), handler)
    }

    /**
     * 触发监听事件
     * @param type 事件类型
     * @param event 事件参数
     * @param uuid 舞台ID
     */
    emit(type, event, uuid = null) {
        emitter.emit(this._acType(type, uuid), event)
    }

    /**
     * 遍历全部事件
     * @param uuid
     * @returns
     */
    all(uuid = null) {
        if (uuid) {
            const events = new Map()
            const reg = new RegExp(uuid + "\:")
            for (let [key, value] of emitter.all) {
                if (key.search(reg) === 0) {
                    events.set(key.replace(reg, ''), value)
                }
            }
            return events
        } else {
            return emitter.all
        }
    }

}
