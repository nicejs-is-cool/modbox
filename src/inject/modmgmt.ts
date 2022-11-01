import * as ModBox from './main'
export default class ModManager {
    Override(constructor: any) {
        constructor.prototype.override = true;
    }
    private LoadedMods = new Map<string, ModBox.Mod>();
    Get<T>(id: string): T {
        const mod = this.LoadedMods.get(id);
        if (!mod) throw new Error('That mod doesn\'t exist!');
        return mod as unknown as T;
    }
    Load(modc: ModBox.Mod) {
        //const modc: ModBox.Mod = new mod();
        if (modc.allowed) {
            for(let a of modc.allowed) {
                if (location.origin != ModBox.Trollboxes[a]) {
                    throw new Error('Mod not allowed to load in this trollbox!')
                }
            }
        }
        if (modc.depends) {
            for (let dependency of modc.depends) {
                if (!this.LoadedMods.has(dependency.modId)) throw new Error('Missing dependency: ' + dependency.modId + '@' + (dependency.version || "any"))
                if (dependency.version) {
                    if (this.LoadedMods.get(dependency.modId)?.version !== dependency.version) {
                        throw new Error('Dependency has the wrong version! Needs ' + dependency.modId + '@' + dependency.version)
                    }
                }
            }
        }
        //@ts-ignore
        if (this.LoadedMods.has(modc.id) && !modc.override) throw new Error('Found conflicting ids: ' + modc.id)
        this.LoadedMods.set(modc.id, modc);
        return modc;
    }
    Enable(id: string): boolean {
        if (!this.LoadedMods.has(id)) throw new Error(`Mod ${id} doesn't exist!`);
        if (!this.LoadedMods.get(id)?.enable()) {
            console.warn(`Unable to enable mod with the id of ${this.LoadedMods.get(id)?.id}`)
            return false;
        }
        return true;
    }
    Disable(id: string): boolean {
        if (!this.LoadedMods.has(id)) throw new Error(`Mod ${id} doesn't exist!`);
        if (!this.LoadedMods.get(id)?.disable()) {
            console.warn(`Unable to disable mod with the id of ${this.LoadedMods.get(id)?.id}`)
            return false;
        }
        return true;
    }
}