interface callbackduc {
    [key: string]: Function[];
}
export default class EventEmitter {
    public _callbacks: callbackduc;
    constructor() {
        this._callbacks = {};
    }
    on(eventName: string, callback: Function) {
        if (!this._callbacks[eventName]) this._callbacks[eventName] = [];
        this._callbacks[eventName].push(callback);
    }
    off(eventName: string, callback: Function) {
        if (!this._callbacks[eventName]) return;
        this._callbacks[eventName].forEach((value, index) => {
            if (value === callback) this._callbacks[eventName].splice(index, 1);
        })
    }
    once(eventName: string, callback: Function) {
        this.on(eventName, (...d: any[]) => {
            callback(d);
            this.off(eventName, arguments.callee);
        })
    }
    emit(eventName: string, ...args: any[]) {
        if (!this._callbacks[eventName]) return;
        this._callbacks[eventName].forEach(x => x(...args));
    }
}
export class Event {
    public defaultPrevented: boolean = false;
    constructor(public name: string, public data: any, public defaultaction: Function) {};
    preventDefault() {
        this.defaultPrevented = true;
    }
    run_default(...args: any[]) {
        if (!this.defaultPrevented) this.defaultaction(...args);
    }
}