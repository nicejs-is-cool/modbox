import { Mod, Mods } from './main'
import * as fs from './fs_promises';
import loadModule from './module_loader';

export default class AML implements Mod {
    name = "AutoModLoader";
    id = "aml";
    author = "nicejs-is-cool";
    description = "Automatic mod loading system"
    version = "0.0.1"
    mods: Mod[] = [];
    modIdMap = new Map<string, Mod>();
    enable() {
        (async () => {
            let tarloader;
            const files = await fs.readdir("/mod/");
            console.info('Phase 1: Load mods without dependencies');
            for (let modfile of files) {
                console.log('loading', modfile)
                
                const file = (await fs.readFile(`/mod/${modfile}`, {}))
                let modclass;
                if (modfile.endsWith('.tar.gz')) {
                    if (tarloader) {
                        modclass = await tarloader.loadTar(modfile, file);
                    } else {
                        console.info('Starting tar loader due to a tar-packed mod');
                        tarloader = await import("./tarloader");
                        modclass = await tarloader.loadTar(modfile, file);
                    }
                    //console.log(files)
                } else {
                    //console.log(file)
                    modclass = await loadModule(file.toString('utf-8'))
                    //console.log(modclass);
                }
                //console.log(modclass)
                const modc: Mod = new modclass();
                this.modIdMap.set(modc.id, modc);
                this.mods.push(modc);
                if (modc.depends) {
                    continue;
                }
                Mods.Load(modc);
                Mods.Enable(modc.id);
            }
            console.info('Phase 2: Load mods with dependencies')
            for (let mod of this.mods) {
                if (mod.depends) {
                    let metDependencies = 0;
                    for (let dependency of mod.depends) {
                        if (!this.modIdMap.has(dependency.modId)) {
                            console.error("[%s] Unmet dependency: %s", mod.id, dependency.modId)
                            continue;
                        }
                        metDependencies++;
                    }
                    if (metDependencies != mod.depends.length) {
                        console.error('Skipping %s due to unmet dependencies', mod.id);
                        continue;
                    }
                    Mods.Load(mod);
                    Mods.Enable(mod.id);
                }
            }
            console.info('ModBox initialization complete!');
        })();
        return true;
    }
    disable() {

        return false
    }
}