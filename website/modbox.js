(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["modbox"] = factory();
	else
		root["modbox"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/events.ts":
/*!***********************!*\
  !*** ./src/events.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Event": () => (/* binding */ Event),
/* harmony export */   "default": () => (/* binding */ EventEmitter)
/* harmony export */ });
class EventEmitter {
    constructor() {
        this._callbacks = {};
    }
    on(eventName, callback) {
        if (!this._callbacks[eventName])
            this._callbacks[eventName] = [];
        this._callbacks[eventName].push(callback);
    }
    off(eventName, callback) {
        if (!this._callbacks[eventName])
            return;
        this._callbacks[eventName].forEach((value, index) => {
            if (value === callback)
                this._callbacks[eventName].splice(index, 1);
        });
    }
    once(eventName, callback) {
        this.on(eventName, (...d) => {
            callback(d);
            this.off(eventName, arguments.callee);
        });
    }
    emit(eventName, ...args) {
        if (!this._callbacks[eventName])
            return;
        this._callbacks[eventName].forEach(x => x(...args));
    }
}
class Event {
    constructor(name, data, defaultaction) {
        this.name = name;
        this.data = data;
        this.defaultaction = defaultaction;
        this.defaultPrevented = false;
    }
    ;
    preventDefault() {
        this.defaultPrevented = true;
    }
    run_default(...args) {
        if (!this.defaultPrevented)
            this.defaultaction(...args);
    }
}


/***/ }),

/***/ "./src/mblogger.ts":
/*!*************************!*\
  !*** ./src/mblogger.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Logger": () => (/* binding */ Logger),
/* harmony export */   "default": () => (/* binding */ MBLogger)
/* harmony export */ });
/* harmony import */ var _modapi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modapi */ "./src/modapi.ts");

class MBLogger extends _modapi__WEBPACK_IMPORTED_MODULE_0__.Mod {
    constructor() {
        super(...arguments);
        this.name = "MBLogger";
        this.description = "The default logger for modbox.";
        this.version = "0.0.1";
        this.namespace = "mblogger";
    }
    init() { }
    CreateLogger(name) {
        return new Logger(name);
    }
}
class Logger {
    constructor(name) {
        this.name = name;
    }
    getTime() {
        let d = new Date();
        let hour = d.getHours().toString().padStart(2, "0");
        let minute = d.getMinutes().toString().padStart(2, "0");
        let second = d.getSeconds().toString().padStart(2, "0");
        return `${hour}:${minute}:${second}`;
    }
    log(...args) {
        console.log(`[${this.getTime()}] [${this.name}]`, ...args);
    }
    info(...args) {
        console.info(`[${this.getTime()}] [${this.name}] [INFO]`, ...args);
    }
    warn(...args) {
        console.warn(`[${this.getTime()}] [${this.name}] [WARN]`, ...args);
    }
    error(...args) {
        console.error(`[${this.getTime()}] [${this.name}] [ERROR]`, ...args);
    }
}


/***/ }),

/***/ "./src/modapi.ts":
/*!***********************!*\
  !*** ./src/modapi.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Mod": () => (/* binding */ Mod),
/* harmony export */   "ModAPI": () => (/* binding */ ModAPI)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events */ "./src/events.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/util.ts");


let wino = window;
class Mod {
    constructor() {
        this.name = "no name";
        this.description = "no description";
        this.version = "0.0.0";
        this.namespace = "mod";
    }
    init() { }
}
class ModAPI_C extends Mod {
    constructor() {
        super(...arguments);
        this.name = "ModAPI";
        this.description = "A API for rmtrollbox mods";
        this.version = "0.0.1";
        this.namespace = "modapi";
        this.loaded = [];
        this.hooks = {};
    }
    GetMod(namespace) {
        let a = this.loaded.find(x => x.namespace === namespace);
        if (!a)
            throw new Error(`Mod with namespace ${namespace} not found.`);
        return a;
    }
    GetModByName(name) {
        return this.loaded.find(x => x.name === name);
    }
    GetMods() {
        return this.loaded;
    }
    LoadMod(mod) {
        let lmod = new mod();
        if (this.loaded.find(x => x.name === lmod.name))
            return;
        this.loaded.push(lmod);
        lmod.init();
    }
    ReplaceMod(mod, newmod) {
        let index = this.loaded.findIndex(x => x.name === mod.name);
        if (index === -1)
            return;
        this.loaded[index] = newmod;
    }
    Hook(function_name) {
        if (this.hooks[function_name])
            return this.hooks[function_name];
        let evem = new _events__WEBPACK_IMPORTED_MODULE_0__["default"]();
        let ogfunc = wino[function_name];
        wino[function_name] = (async function (ogfunc, ...fargs) {
            let nargs = _util__WEBPACK_IMPORTED_MODULE_1__.array.deepClone(fargs);
            evem.emit('before_call', nargs); // you can use before call to quickly modify the arguments
            let fevent = new _events__WEBPACK_IMPORTED_MODULE_0__.Event('hooked_function_call', { funcargs: nargs }, ogfunc);
            evem.emit('call', fevent);
            await _util__WEBPACK_IMPORTED_MODULE_1__.sleep(80);
            fevent.run_default(...nargs);
            evem.emit("after_call");
        }).bind(this, ogfunc);
        this.hooks[function_name] = evem;
        return evem;
    }
}
const ModAPI = new ModAPI_C();


/***/ }),

/***/ "./src/modstorage.ts":
/*!***************************!*\
  !*** ./src/modstorage.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ModStorage)
/* harmony export */ });
/* harmony import */ var _modapi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modapi */ "./src/modapi.ts");

class ModStorage extends _modapi__WEBPACK_IMPORTED_MODULE_0__.Mod {
    constructor() {
        super(...arguments);
        this.name = "ModStorage";
        this.description = "A mod that stores mod data";
        this.version = "0.0.1";
        this.namespace = "storage";
    }
    init() { }
    GetStorage(name) {
        return new StorageData(name);
    }
}
class StorageData {
    constructor(name) {
        this.name = name;
    }
    Get(key) {
        return localStorage.getItem(`${this.name}/${key}`);
    }
    Set(key, value) {
        localStorage.setItem(`${this.name}/${key}`, value);
    }
    Remove(key) {
        localStorage.removeItem(`${this.name}/${key}`);
    }
    List() {
        let keys = Object.keys(localStorage);
        let mods = [];
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].startsWith(this.name + "/")) {
                mods.push(keys[i].replace(`${this.name}/`, ""));
            }
        }
        return mods;
    }
    Clear() {
        this.List().forEach(key => {
            this.Remove(key);
        });
    }
}


/***/ }),

/***/ "./src/rmtrollbox.ts":
/*!***************************!*\
  !*** ./src/rmtrollbox.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rmtrollbox)
/* harmony export */ });
/* harmony import */ var _modapi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modapi */ "./src/modapi.ts");

class rmtrollbox extends _modapi__WEBPACK_IMPORTED_MODULE_0__.Mod {
    constructor() {
        super(...arguments);
        this.name = "rmtrollbox";
        this.description = "rmtrollbox API";
        this.version = "0.0.1";
        this.namespace = "rmtrollbox";
        this.logger = _modapi__WEBPACK_IMPORTED_MODULE_0__.ModAPI.GetMod("mblogger").CreateLogger("rmtrollbox");
        this.registeredCommands = [];
    }
    init() {
        this.logger.log("Initializing rmtrollbox API");
        let sndMsgHook = _modapi__WEBPACK_IMPORTED_MODULE_0__.ModAPI.Hook("sendMsg");
        sndMsgHook.on("call", (ev) => {
            let msg = ev.data.funcargs[0];
            if (msg.startsWith('/')) {
                let args = msg.substr(1).split(' ');
                let cmd = args.shift();
                let namespace = "";
                if (cmd.includes(':')) {
                    namespace = cmd.split(':')[0];
                    cmd = cmd.split(':')[1];
                }
                let cmds = this.registeredCommands.filter(c => {
                    if (namespace) {
                        return c.namespace === namespace && (c.name === cmd || c.aliases.includes(cmd));
                    }
                    else {
                        return c.name == cmd || c.aliases.includes(cmd);
                    }
                });
                if (cmds.length > 0) {
                    ev.preventDefault();
                    cmds[0].execute(args);
                }
            }
        });
        this.logger.info("rmtrollbox api initialized");
    }
    PrintMessage(msg) {
        //@ts-ignore
        window.printMsg(msg);
    }
    RegisterCommand(cmd) {
        this.registeredCommands.push(cmd);
    }
}


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "array": () => (/* binding */ array),
/* harmony export */   "object": () => (/* binding */ object),
/* harmony export */   "sleep": () => (/* binding */ sleep)
/* harmony export */ });
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
;
var array;
(function (array) {
    function deepClone(arr) {
        let newarr = [];
        for (let i = 0; i < arr.length; i++) {
            let data = arr[i];
            if (typeof data === "object")
                data = object.deepClone(data);
            if (Array.isArray(data))
                data = deepClone(data);
            newarr.push(data);
        }
        return newarr;
    }
    array.deepClone = deepClone;
    ;
    function remove(index, arr) {
        return arr.splice(index, 1);
    }
    array.remove = remove;
})(array || (array = {}));
var object;
(function (object) {
    function hasFunctions(obj) {
        for (let item in obj) {
            if (typeof obj[item] === "function")
                return true;
            if (typeof obj[item] === "object")
                return hasFunctions(obj[item]);
        }
        return false;
    }
    object.hasFunctions = hasFunctions;
    function deepClone(obj) {
        if (window.structuredClone)
            return window.structuredClone(obj);
        if (!hasFunctions(obj))
            return JSON.parse(JSON.stringify(obj));
        let newobj = {};
        for (let item in obj) {
            if (typeof obj[item] === "object") {
                newobj[item] = deepClone(obj[item]);
                continue;
            }
            if (Array.isArray(obj[item])) {
                newobj[item] = array.deepClone(obj[item]);
                continue;
            }
            newobj[item] = obj[item];
        }
    }
    object.deepClone = deepClone;
})(object || (object = {}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modapi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modapi */ "./src/modapi.ts");
/* harmony import */ var _mblogger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mblogger */ "./src/mblogger.ts");
/* harmony import */ var _rmtrollbox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rmtrollbox */ "./src/rmtrollbox.ts");
/* harmony import */ var _modstorage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modstorage */ "./src/modstorage.ts");




class ModLoader extends _modapi__WEBPACK_IMPORTED_MODULE_0__.Mod {
    constructor() {
        super(...arguments);
        this.name = "Mod Loader";
        this.description = "A mod that loads mods";
        this.version = "0.0.1";
        this.namespace = "modloader";
        this.logger = _modapi__WEBPACK_IMPORTED_MODULE_0__.ModAPI.GetMod("mblogger").CreateLogger("modloader");
    }
    init() {
        //@ts-ignore
        window.ModAPI = _modapi__WEBPACK_IMPORTED_MODULE_0__.ModAPI; // expose the ModAPI to the window
        this.logger.info('ModAPI exposed to window');
        //@ts-ignore
        window.Mod = _modapi__WEBPACK_IMPORTED_MODULE_0__.Mod;
        this.logger.info('Mod class exposed to window');
        this.logger.info('Loading mods...');
        let mods = _modapi__WEBPACK_IMPORTED_MODULE_0__.ModAPI.GetMod("storage").GetStorage("mods");
        this.logger.info(`Found ${mods.List().length} mods`);
        for (let i = 0; i < mods.List().length; i++) {
            let mod = mods.Get(mods.List()[i]);
            this.logger.info(`Loading ${mod}`);
            _modapi__WEBPACK_IMPORTED_MODULE_0__.ModAPI.LoadMod(mod);
        }
        this.logger.info(`${_modapi__WEBPACK_IMPORTED_MODULE_0__.ModAPI.GetMods().length} Mods loaded`);
    }
}
_modapi__WEBPACK_IMPORTED_MODULE_0__.ModAPI.LoadMod(_mblogger__WEBPACK_IMPORTED_MODULE_1__["default"]);
_modapi__WEBPACK_IMPORTED_MODULE_0__.ModAPI.LoadMod(_rmtrollbox__WEBPACK_IMPORTED_MODULE_2__["default"]);
_modapi__WEBPACK_IMPORTED_MODULE_0__.ModAPI.LoadMod(_modstorage__WEBPACK_IMPORTED_MODULE_3__["default"]);
_modapi__WEBPACK_IMPORTED_MODULE_0__.ModAPI.LoadMod(ModLoader);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxtREFBYyxFQUFFLENBQUMsTUFBTSxjQUFjLENBQUMsQ0FBQztJQUMvRCxDQUFDO0NBQ0o7QUFDRCxtREFBYyxDQUFDLGlEQUFRLENBQUMsQ0FBQztBQUN6QixtREFBYyxDQUFDLG1EQUFVLENBQUMsQ0FBQztBQUMzQixtREFBYyxDQUFDLG1EQUFVLENBQUMsQ0FBQztBQUMzQixtREFBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbW9kYm94L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9tb2Rib3gvLi9zcmMvZXZlbnRzLnRzIiwid2VicGFjazovL21vZGJveC8uL3NyYy9tYmxvZ2dlci50cyIsIndlYnBhY2s6Ly9tb2Rib3gvLi9zcmMvbW9kYXBpLnRzIiwid2VicGFjazovL21vZGJveC8uL3NyYy9tb2RzdG9yYWdlLnRzIiwid2VicGFjazovL21vZGJveC8uL3NyYy9ybXRyb2xsYm94LnRzIiwid2VicGFjazovL21vZGJveC8uL3NyYy91dGlsLnRzIiwid2VicGFjazovL21vZGJveC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tb2Rib3gvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL21vZGJveC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL21vZGJveC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21vZGJveC8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJtb2Rib3hcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wibW9kYm94XCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiaW50ZXJmYWNlIGNhbGxiYWNrZHVjIHtcclxuICAgIFtrZXk6IHN0cmluZ106IEZ1bmN0aW9uW107XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRFbWl0dGVyIHtcclxuICAgIHB1YmxpYyBfY2FsbGJhY2tzOiBjYWxsYmFja2R1YztcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xyXG4gICAgfVxyXG4gICAgb24oZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xyXG4gICAgICAgIGlmICghdGhpcy5fY2FsbGJhY2tzW2V2ZW50TmFtZV0pIHRoaXMuX2NhbGxiYWNrc1tldmVudE5hbWVdID0gW107XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzW2V2ZW50TmFtZV0ucHVzaChjYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBvZmYoZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xyXG4gICAgICAgIGlmICghdGhpcy5fY2FsbGJhY2tzW2V2ZW50TmFtZV0pIHJldHVybjtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja3NbZXZlbnROYW1lXS5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBjYWxsYmFjaykgdGhpcy5fY2FsbGJhY2tzW2V2ZW50TmFtZV0uc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgb25jZShldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5vbihldmVudE5hbWUsICguLi5kOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhkKTtcclxuICAgICAgICAgICAgdGhpcy5vZmYoZXZlbnROYW1lLCBhcmd1bWVudHMuY2FsbGVlKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgZW1pdChldmVudE5hbWU6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2NhbGxiYWNrc1tldmVudE5hbWVdKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzW2V2ZW50TmFtZV0uZm9yRWFjaCh4ID0+IHgoLi4uYXJncykpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBFdmVudCB7XHJcbiAgICBwdWJsaWMgZGVmYXVsdFByZXZlbnRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGRhdGE6IGFueSwgcHVibGljIGRlZmF1bHRhY3Rpb246IEZ1bmN0aW9uKSB7fTtcclxuICAgIHByZXZlbnREZWZhdWx0KCkge1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFByZXZlbnRlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBydW5fZGVmYXVsdCguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWZhdWx0UHJldmVudGVkKSB0aGlzLmRlZmF1bHRhY3Rpb24oLi4uYXJncyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBNb2QgfSBmcm9tIFwiLi9tb2RhcGlcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTUJMb2dnZXIgZXh0ZW5kcyBNb2Qge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZyA9IFwiTUJMb2dnZXJcIjtcclxuICAgIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nID0gXCJUaGUgZGVmYXVsdCBsb2dnZXIgZm9yIG1vZGJveC5cIjtcclxuICAgIHB1YmxpYyB2ZXJzaW9uOiBzdHJpbmcgPSBcIjAuMC4xXCI7XHJcbiAgICBwdWJsaWMgbmFtZXNwYWNlOiBzdHJpbmcgPSBcIm1ibG9nZ2VyXCI7XHJcbiAgICBwdWJsaWMgaW5pdCgpIHt9XHJcbiAgICBwdWJsaWMgQ3JlYXRlTG9nZ2VyKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBuZXcgTG9nZ2VyKG5hbWUpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge31cclxuICAgIHByaXZhdGUgZ2V0VGltZSgpIHtcclxuICAgICAgICBsZXQgZCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgbGV0IGhvdXIgPSBkLmdldEhvdXJzKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIik7XHJcbiAgICAgICAgbGV0IG1pbnV0ZSA9IGQuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpO1xyXG4gICAgICAgIGxldCBzZWNvbmQgPSBkLmdldFNlY29uZHMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKTtcclxuICAgICAgICByZXR1cm4gYCR7aG91cn06JHttaW51dGV9OiR7c2Vjb25kfWA7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgbG9nKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFske3RoaXMuZ2V0VGltZSgpfV0gWyR7dGhpcy5uYW1lfV1gLCAuLi5hcmdzKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBpbmZvKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKGBbJHt0aGlzLmdldFRpbWUoKX1dIFske3RoaXMubmFtZX1dIFtJTkZPXWAsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHdhcm4oLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oYFske3RoaXMuZ2V0VGltZSgpfV0gWyR7dGhpcy5uYW1lfV0gW1dBUk5dYCwgLi4uYXJncyk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZXJyb3IoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGBbJHt0aGlzLmdldFRpbWUoKX1dIFske3RoaXMubmFtZX1dIFtFUlJPUl1gLCAuLi5hcmdzKTtcclxuICAgIH1cclxufSIsImltcG9ydCBFdmVudEVtaXR0ZXIsIHsgRXZlbnQgfSBmcm9tIFwiLi9ldmVudHNcIjtcclxuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwnO1xyXG5sZXQgd2lubyA9IHdpbmRvdyBhcyBhbnk7XHJcblxyXG5leHBvcnQgY2xhc3MgTW9kIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcgPSBcIm5vIG5hbWVcIjtcclxuICAgIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nID0gXCJubyBkZXNjcmlwdGlvblwiO1xyXG4gICAgcHVibGljIHZlcnNpb246IHN0cmluZyA9IFwiMC4wLjBcIjtcclxuICAgIHB1YmxpYyBuYW1lc3BhY2U6IHN0cmluZyA9IFwibW9kXCI7XHJcbiAgICBcclxuICAgIGluaXQoKSB7fVxyXG59XHJcbmNsYXNzIE1vZEFQSV9DIGV4dGVuZHMgTW9kIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcgPSBcIk1vZEFQSVwiO1xyXG4gICAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSBcIkEgQVBJIGZvciBybXRyb2xsYm94IG1vZHNcIjtcclxuICAgIHB1YmxpYyB2ZXJzaW9uOiBzdHJpbmcgPSBcIjAuMC4xXCI7XHJcbiAgICBwdWJsaWMgbmFtZXNwYWNlOiBzdHJpbmcgPSBcIm1vZGFwaVwiO1xyXG4gICAgcHJpdmF0ZSBsb2FkZWQ6IE1vZFtdID0gW107XHJcbiAgICBwcml2YXRlIGhvb2tzOiB7W2tleTogc3RyaW5nXTogRXZlbnRFbWl0dGVyfSA9IHt9O1xyXG4gICAgcHVibGljIEdldE1vZDxUPihuYW1lc3BhY2U6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBhID0gdGhpcy5sb2FkZWQuZmluZCh4ID0+IHgubmFtZXNwYWNlID09PSBuYW1lc3BhY2UpO1xyXG4gICAgICAgIGlmICghYSkgdGhyb3cgbmV3IEVycm9yKGBNb2Qgd2l0aCBuYW1lc3BhY2UgJHtuYW1lc3BhY2V9IG5vdCBmb3VuZC5gKTtcclxuICAgICAgICByZXR1cm4gYSBhcyB1bmtub3duIGFzIFQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgR2V0TW9kQnlOYW1lKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvYWRlZC5maW5kKHggPT4geC5uYW1lID09PSBuYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBHZXRNb2RzKCk6IE1vZFtdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2FkZWQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgTG9hZE1vZChtb2Q6IGFueSkge1xyXG4gICAgICAgIGxldCBsbW9kOiBNb2QgPSBuZXcgbW9kKCk7XHJcbiAgICAgICAgaWYgKHRoaXMubG9hZGVkLmZpbmQoeCA9PiB4Lm5hbWUgPT09IGxtb2QubmFtZSkpIHJldHVybjtcclxuICAgICAgICB0aGlzLmxvYWRlZC5wdXNoKGxtb2QpO1xyXG4gICAgICAgIGxtb2QuaW5pdCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIFJlcGxhY2VNb2QobW9kOiBNb2QsIG5ld21vZDogTW9kKSB7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5sb2FkZWQuZmluZEluZGV4KHggPT4geC5uYW1lID09PSBtb2QubmFtZSk7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMubG9hZGVkW2luZGV4XSA9IG5ld21vZDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBIb29rKGZ1bmN0aW9uX25hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLmhvb2tzW2Z1bmN0aW9uX25hbWVdKSByZXR1cm4gdGhpcy5ob29rc1tmdW5jdGlvbl9uYW1lXTtcclxuICAgICAgICBsZXQgZXZlbSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgICAgICBsZXQgb2dmdW5jID0gd2lub1tmdW5jdGlvbl9uYW1lXTtcclxuICAgICAgICB3aW5vW2Z1bmN0aW9uX25hbWVdID0gKGFzeW5jIGZ1bmN0aW9uIChvZ2Z1bmM6IEZ1bmN0aW9uLCAuLi5mYXJnczogYW55W10pIHtcclxuICAgICAgICAgICAgbGV0IG5hcmdzID0gdXRpbC5hcnJheS5kZWVwQ2xvbmUoZmFyZ3MpO1xyXG4gICAgICAgICAgICBldmVtLmVtaXQoJ2JlZm9yZV9jYWxsJywgbmFyZ3MpOyAvLyB5b3UgY2FuIHVzZSBiZWZvcmUgY2FsbCB0byBxdWlja2x5IG1vZGlmeSB0aGUgYXJndW1lbnRzXHJcbiAgICAgICAgICAgIGxldCBmZXZlbnQgPSBuZXcgRXZlbnQoJ2hvb2tlZF9mdW5jdGlvbl9jYWxsJywge2Z1bmNhcmdzOiBuYXJnc30sIG9nZnVuYyk7XHJcbiAgICAgICAgICAgIGV2ZW0uZW1pdCgnY2FsbCcsZmV2ZW50KTtcclxuICAgICAgICAgICAgYXdhaXQgdXRpbC5zbGVlcCg4MCk7XHJcbiAgICAgICAgICAgIGZldmVudC5ydW5fZGVmYXVsdCguLi5uYXJncyk7XHJcbiAgICAgICAgICAgIGV2ZW0uZW1pdChcImFmdGVyX2NhbGxcIik7XHJcbiAgICAgICAgfSkuYmluZCh0aGlzLCBvZ2Z1bmMpO1xyXG4gICAgICAgIHRoaXMuaG9va3NbZnVuY3Rpb25fbmFtZV0gPSBldmVtO1xyXG4gICAgICAgIHJldHVybiBldmVtO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjb25zdCBNb2RBUEkgPSBuZXcgTW9kQVBJX0MoKTsiLCJpbXBvcnQgeyBNb2QgfSBmcm9tIFwiLi9tb2RhcGlcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kU3RvcmFnZSBleHRlbmRzIE1vZCB7XHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nID0gXCJNb2RTdG9yYWdlXCI7XHJcbiAgICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZyA9IFwiQSBtb2QgdGhhdCBzdG9yZXMgbW9kIGRhdGFcIjtcclxuICAgIHB1YmxpYyB2ZXJzaW9uOiBzdHJpbmcgPSBcIjAuMC4xXCI7XHJcbiAgICBwdWJsaWMgbmFtZXNwYWNlOiBzdHJpbmcgPSBcInN0b3JhZ2VcIjtcclxuICAgIHB1YmxpYyBpbml0KCkge31cclxuICAgIHB1YmxpYyBHZXRTdG9yYWdlKG5hbWU6IHN0cmluZyk6IFN0b3JhZ2VEYXRhIHtcclxuICAgICAgICByZXR1cm4gbmV3IFN0b3JhZ2VEYXRhKG5hbWUpO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIFN0b3JhZ2VEYXRhIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHt9XHJcbiAgICBwdWJsaWMgR2V0KGtleTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dGhpcy5uYW1lfS8ke2tleX1gKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBTZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLm5hbWV9LyR7a2V5fWAsIHZhbHVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBSZW1vdmUoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShgJHt0aGlzLm5hbWV9LyR7a2V5fWApO1xyXG4gICAgfVxyXG4gICAgcHVibGljIExpc3QoKSB7XHJcbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhsb2NhbFN0b3JhZ2UpO1xyXG4gICAgICAgIGxldCBtb2RzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXlzW2ldLnN0YXJ0c1dpdGgodGhpcy5uYW1lK1wiL1wiKSkge1xyXG4gICAgICAgICAgICAgICAgbW9kcy5wdXNoKGtleXNbaV0ucmVwbGFjZShgJHt0aGlzLm5hbWV9L2AsIFwiXCIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbW9kcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBDbGVhcigpIHtcclxuICAgICAgICB0aGlzLkxpc3QoKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuUmVtb3ZlKGtleSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBNb2QsIE1vZEFQSSB9IGZyb20gXCIuL21vZGFwaVwiO1xyXG5pbXBvcnQgTUJMb2dnZXIgZnJvbSBcIi4vbWJsb2dnZXJcIjtcclxuaW1wb3J0IEV2ZW50RW1pdHRlciwge0V2ZW50fSBmcm9tIFwiLi9ldmVudHNcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2Ugcm1NZXNzYWdlIHtcclxuICAgIG5pY2s6IHN0cmluZztcclxuICAgIGhvbWU6IHN0cmluZztcclxuICAgIG1zZzogc3RyaW5nO1xyXG4gICAgZGF0ZTogbnVtYmVyO1xyXG4gICAgY29sb3I6IHN0cmluZztcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIENvbW1hbmQge1xyXG4gICAgbmFtZXNwYWNlOiBzdHJpbmc7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgdXNhZ2U6IHN0cmluZztcclxuICAgIGFsaWFzZXM6IHN0cmluZ1tdO1xyXG4gICAgZXhlY3V0ZTogKGFyZ3M6IHN0cmluZ1tdKSA9PiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBybXRyb2xsYm94IGV4dGVuZHMgTW9kIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcgPSBcInJtdHJvbGxib3hcIjtcclxuICAgIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nID0gXCJybXRyb2xsYm94IEFQSVwiO1xyXG4gICAgcHVibGljIHZlcnNpb246IHN0cmluZyA9IFwiMC4wLjFcIjtcclxuICAgIHB1YmxpYyBuYW1lc3BhY2U6IHN0cmluZyA9IFwicm10cm9sbGJveFwiO1xyXG4gICAgcHVibGljIGxvZ2dlciA9IE1vZEFQSS5HZXRNb2Q8TUJMb2dnZXI+KFwibWJsb2dnZXJcIikuQ3JlYXRlTG9nZ2VyKFwicm10cm9sbGJveFwiKTtcclxuICAgIHByaXZhdGUgcmVnaXN0ZXJlZENvbW1hbmRzOiBDb21tYW5kW10gPSBbXTtcclxuICAgIHB1YmxpYyBpbml0KCkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZyhcIkluaXRpYWxpemluZyBybXRyb2xsYm94IEFQSVwiKTtcclxuICAgICAgICBsZXQgc25kTXNnSG9vayA9IE1vZEFQSS5Ib29rKFwic2VuZE1zZ1wiKTtcclxuICAgICAgICBzbmRNc2dIb29rLm9uKFwiY2FsbFwiLCAoZXY6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBtc2cgPSBldi5kYXRhLmZ1bmNhcmdzWzBdO1xyXG4gICAgICAgICAgICBpZiAobXNnLnN0YXJ0c1dpdGgoJy8nKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyZ3MgPSBtc2cuc3Vic3RyKDEpLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY21kID0gYXJncy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5hbWVzcGFjZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoY21kLmluY2x1ZGVzKCc6JykpIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBjbWQuc3BsaXQoJzonKVswXTtcclxuICAgICAgICAgICAgICAgICAgICBjbWQgPSBjbWQuc3BsaXQoJzonKVsxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBjbWRzID0gdGhpcy5yZWdpc3RlcmVkQ29tbWFuZHMuZmlsdGVyKGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuYW1lc3BhY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGMubmFtZXNwYWNlID09PSBuYW1lc3BhY2UgJiYgKGMubmFtZSA9PT0gY21kIHx8IGMuYWxpYXNlcy5pbmNsdWRlcyhjbWQpKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjLm5hbWUgPT0gY21kIHx8IGMuYWxpYXNlcy5pbmNsdWRlcyhjbWQpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY21kcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjbWRzWzBdLmV4ZWN1dGUoYXJncyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMubG9nZ2VyLmluZm8oXCJybXRyb2xsYm94IGFwaSBpbml0aWFsaXplZFwiKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBQcmludE1lc3NhZ2UobXNnOiBybU1lc3NhZ2UpIHtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICB3aW5kb3cucHJpbnRNc2cobXNnKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBSZWdpc3RlckNvbW1hbmQoY21kOiBDb21tYW5kKSB7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlcmVkQ29tbWFuZHMucHVzaChjbWQpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKSB7cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpfTtcclxuZXhwb3J0IG5hbWVzcGFjZSBhcnJheSB7XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGVlcENsb25lKGFycjogYW55W10pOiBhbnlbXSB7XHJcbiAgICAgICAgbGV0IG5ld2FycjogYW55W10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IGFycltpXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiKSBkYXRhID0gb2JqZWN0LmRlZXBDbG9uZShkYXRhKTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIGRhdGEgPSBkZWVwQ2xvbmUoZGF0YSk7XHJcbiAgICAgICAgICAgIG5ld2Fyci5wdXNoKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3YXJyO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiByZW1vdmUoaW5kZXg6IG51bWJlciwgYXJyOiBhbnlbXSl7XHJcbiAgICAgICAgcmV0dXJuIGFyci5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBuYW1lc3BhY2Ugb2JqZWN0IHtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBoYXNGdW5jdGlvbnMob2JqOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBmb3IgKGxldCBpdGVtIGluIG9iaikge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9ialtpdGVtXSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmpbaXRlbV0gPT09IFwib2JqZWN0XCIpIHJldHVybiBoYXNGdW5jdGlvbnMob2JqW2l0ZW1dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRlZXBDbG9uZShvYmo6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKCh3aW5kb3cgYXMgYW55KS5zdHJ1Y3R1cmVkQ2xvbmUpIHJldHVybiAod2luZG93IGFzIGFueSkuc3RydWN0dXJlZENsb25lKG9iailcclxuICAgICAgICBpZiAoIWhhc0Z1bmN0aW9ucyhvYmopKSByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcclxuICAgICAgICBsZXQgbmV3b2JqOiBhbnkgPSB7fTtcclxuICAgICAgICBmb3IgKGxldCBpdGVtIGluIG9iaikge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9ialtpdGVtXSA9PT0gXCJvYmplY3RcIikge25ld29ialtpdGVtXSA9IGRlZXBDbG9uZShvYmpbaXRlbV0pOyBjb250aW51ZX1cclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqW2l0ZW1dKSkge25ld29ialtpdGVtXSA9IGFycmF5LmRlZXBDbG9uZShvYmpbaXRlbV0pOyBjb250aW51ZX1cclxuICAgICAgICAgICAgbmV3b2JqW2l0ZW1dID0gb2JqW2l0ZW1dO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgTW9kQVBJLCBNb2QgfSBmcm9tIFwiLi9tb2RhcGlcIjtcclxuaW1wb3J0IE1CTG9nZ2VyIGZyb20gXCIuL21ibG9nZ2VyXCI7XHJcbmltcG9ydCBybXRyb2xsYm94IGZyb20gXCIuL3JtdHJvbGxib3hcIjtcclxuaW1wb3J0IE1vZFN0b3JhZ2UgZnJvbSBcIi4vbW9kc3RvcmFnZVwiO1xyXG5cclxuY2xhc3MgTW9kTG9hZGVyIGV4dGVuZHMgTW9kIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcgPSBcIk1vZCBMb2FkZXJcIjtcclxuICAgIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nID0gXCJBIG1vZCB0aGF0IGxvYWRzIG1vZHNcIjtcclxuICAgIHB1YmxpYyB2ZXJzaW9uOiBzdHJpbmcgPSBcIjAuMC4xXCI7XHJcbiAgICBwdWJsaWMgbmFtZXNwYWNlOiBzdHJpbmcgPSBcIm1vZGxvYWRlclwiO1xyXG4gICAgcHJpdmF0ZSBsb2dnZXIgPSBNb2RBUEkuR2V0TW9kPE1CTG9nZ2VyPihcIm1ibG9nZ2VyXCIpLkNyZWF0ZUxvZ2dlcihcIm1vZGxvYWRlclwiKTtcclxuICAgIHB1YmxpYyBpbml0KCkge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIHdpbmRvdy5Nb2RBUEkgPSBNb2RBUEk7IC8vIGV4cG9zZSB0aGUgTW9kQVBJIHRvIHRoZSB3aW5kb3dcclxuICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKCdNb2RBUEkgZXhwb3NlZCB0byB3aW5kb3cnKTtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICB3aW5kb3cuTW9kID0gTW9kO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLmluZm8oJ01vZCBjbGFzcyBleHBvc2VkIHRvIHdpbmRvdycpO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLmluZm8oJ0xvYWRpbmcgbW9kcy4uLicpO1xyXG4gICAgICAgIGxldCBtb2RzID0gTW9kQVBJLkdldE1vZDxNb2RTdG9yYWdlPihcInN0b3JhZ2VcIikuR2V0U3RvcmFnZShcIm1vZHNcIilcclxuICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBGb3VuZCAke21vZHMuTGlzdCgpLmxlbmd0aH0gbW9kc2ApO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9kcy5MaXN0KCkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IG1vZCA9IG1vZHMuR2V0KG1vZHMuTGlzdCgpW2ldKTtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhgTG9hZGluZyAke21vZH1gKTtcclxuICAgICAgICAgICAgTW9kQVBJLkxvYWRNb2QobW9kKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhgJHtNb2RBUEkuR2V0TW9kcygpLmxlbmd0aH0gTW9kcyBsb2FkZWRgKTtcclxuICAgIH1cclxufVxyXG5Nb2RBUEkuTG9hZE1vZChNQkxvZ2dlcik7XHJcbk1vZEFQSS5Mb2FkTW9kKHJtdHJvbGxib3gpO1xyXG5Nb2RBUEkuTG9hZE1vZChNb2RTdG9yYWdlKTtcclxuTW9kQVBJLkxvYWRNb2QoTW9kTG9hZGVyKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=