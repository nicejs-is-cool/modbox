import EventEmitter, { Event } from "./events";
import * as util from './util';
let wino = window as any;

export class Mod {
    public name: string = "no name";
    public description: string = "no description";
    public version: string = "0.0.0";
    public namespace: string = "mod";
    init() {}
}
export class ModAPI_C extends Mod {
    public name: string = "ModAPI";
    public description: string = "A API for rmtrollbox mods";
    public version: string = "0.0.1";
    public namespace: string = "modapi";
    private loaded: Mod[] = [];
    private hooks: {[key: string]: EventEmitter} = {};
    public GetMod<T>(namespace: string) {
        let a = this.loaded.find(x => x.namespace === namespace);
        if (!a) throw new Error(`Mod with namespace ${namespace} not found.`);
        return a as unknown as T;
    }
    public GetModByName(name: string) {
        return this.loaded.find(x => x.name === name);
    }
    public GetMods(): Mod[] {
        return this.loaded;
    }
    public LoadMod(mod: any) {
        let lmod: Mod = new mod();
        if (this.loaded.find(x => x.name === lmod.name)) return;
        this.loaded.push(lmod);
        lmod.init();
    }
    public ReplaceMod(mod: Mod, newmod: Mod) {
        let index = this.loaded.findIndex(x => x.name === mod.name);
        if (index === -1) return;
        this.loaded[index] = newmod;
    }
    public Hook(function_name: string) {
        if (this.hooks[function_name]) return this.hooks[function_name];
        let evem = new EventEmitter();
        let ogfunc = wino[function_name];
        wino[function_name] = (async function (ogfunc: Function, ...fargs: any[]) {
            let nargs = util.array.deepClone(fargs);
            evem.emit('before_call', nargs); // you can use before call to quickly modify the arguments
            let fevent = new Event('hooked_function_call', {funcargs: nargs}, ogfunc);
            evem.emit('call',fevent);
            await util.sleep(80);
            fevent.run_default(...nargs);
            evem.emit("after_call");
        }).bind(this, ogfunc);
        this.hooks[function_name] = evem;
        return evem;
    }
    public FilterMods<T>(prefix: string) {
        return this.loaded.filter(x => x.namespace.startsWith(prefix)) as unknown as T[];
    }
}
export const ModAPI = new ModAPI_C();