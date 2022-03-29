import { Mod } from "./modapi";
export default class ModStorage extends Mod {
    public name: string = "ModStorage";
    public description: string = "A mod that stores mod data";
    public version: string = "0.0.1";
    public namespace: string = "storage";
    public init() {}
    public GetStorage(name: string): StorageData {
        return new StorageData(name);
    }
}
class StorageData {
    constructor(public name: string) {}
    public Get(key: string): any {
        return localStorage.getItem(`${this.name}/${key}`);
    }
    public Set(key: string, value: any) {
        localStorage.setItem(`${this.name}/${key}`, value);
    }
    public Remove(key: string) {
        localStorage.removeItem(`${this.name}/${key}`);
    }
    public List() {
        let keys = Object.keys(localStorage);
        let mods = [];
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].startsWith(this.name+"/")) {
                mods.push(keys[i].replace(`${this.name}/`, ""));
            }
        }
        return mods;
    }
    public Clear() {
        this.List().forEach(key => {
            this.Remove(key);
        });
    }
}