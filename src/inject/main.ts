/// <reference path="../../node_modules/browserfs/dist/browserfs.d.ts"/>
import AML from './aml';
import ModManager from './modmgmt'
import * as BrowserFS from 'browserfs'
import MountableFileSystem from 'browserfs/dist/node/backend/MountableFileSystem';

//export type HookWhere = "head" | "tail";
export type HookWhen = "before" | "after";
export type Allowed = "rmtrollbox" | "cyio" | "trollboxparty" | "boxkmk" | "ducktb"
export enum Trollboxes {
    rmtrollbox = "https://rmtrollbox.eu-gb.mybluemix.net",
    cyio = "https://cyio.trollbox.party",
    trollboxparty = "https://trollbox.party",
    boxkmk = "https://box.km.mk",
    strollbox = "https://trollbox.suspc.cf",
    ducktb = "https://ducktrollbox.paperluigis.repl.co"
}
export interface Dependency {
    modId: string;
    version?: string;
}
//export const Mixin = ModBox.Mods.Get<ModBox.Internal.MixinCore>("mixincore").Mixin;
export function Depends(modName: string, version?: string) {
    return function(constructor: any) {
        if (!constructor.prototype.depends) {
            constructor.prototype.depends = [];
        }
        constructor.depends.push({modName, version})
    }
}
export namespace SocketIO {
    export function Hook(eventName: string, when: HookWhen) {}
    export namespace Socket {
        export function emit(event: string, ...data: any): void {}
        export function on(event: string, cb: any): void {}
        export function once(event: string, cb: any): void {}
        export function off(event: string, func: any): void {}
    }
}
export interface Mod {
    name: string;
    author: string;
    description: string;
    version: string;
    updateURL?: string;
    enable: () => boolean;
    disable: () => boolean;
    allowed?: Allowed[]; // if not specified the mod will be able to be enabled on all trollbox clones
    id: string;
    depends?: Dependency[];
}

export const Mods: ModManager = new ModManager();

export const BFS = {};
export let mfs: MountableFileSystem;
import * as fsp from './fs_promises'
export let fs: typeof fsp;

Mods.Load(new AML())
BrowserFS.install(BFS);

export async function Init() {
    // load the webpack import() bypass
    await new Promise((resolve) => {
        let s = document.createElement('script');
        let self = document.getElementById('modbox_script') as HTMLScriptElement
        if (self) {
            s.src = self.src.slice(0, -14) + "web/dynamic_import.js"
        }
        s.onload = resolve;
        document.body.appendChild(s);
    });

    // why browserfs had to make it so shitty
    BrowserFS.FileSystem.InMemory.Create({}, (e, inmem) => {
        if (e) throw e;
        if (!inmem) return;
        BrowserFS.FileSystem.IndexedDB.Create({}, (e, idb) => {
            if (e) throw e;
            if (!idb) return;
            BrowserFS.FileSystem.LocalStorage.Create({}, (e, ls) => {
                if (e) throw e;
                if (!ls) return;
                BrowserFS.FileSystem.MountableFileSystem.Create({
                    "/tmp": inmem,
                    "/mod": idb,
                    "/config": ls
                }, async (e, mfs) => {
                    if (e) throw e;
                    if (!mfs) return;
                    mfs = mfs;
                    BrowserFS.initialize(mfs);
                    //@ts-ignore
                    fs = await import("./fs_promises");
                    let amlConfig = {
                        enabled: true,
                        override: "" // set to a string pointing to a path in browserfs to override the default automodloader
                    }
                    if (!await fs.exists("/config/aml")) await fs.writeFile("/config/aml", JSON.stringify(amlConfig), {});
                    //@ts-ignore
                    amlConfig = JSON.parse(await fs.readFile("/config/aml", {encoding: 'utf-8'}));
                    //console.log(amlConfig)
                    if (amlConfig.enabled) Mods.Get<AML>('aml').enable();
                    if (amlConfig.override) {
                        let modctmp = Mods.Load(
                            //@ts-ignore
                            eval(await fs.readFile(amlConfig.override, {encoding: 'utf-8'}))
                        )
                        Mods.Get<Mod>(modctmp.id).enable();
                    }
                })
            })
        })
    })
    Import = (window as any).mb_import;
}
export const _BrowserFS = BrowserFS;
//@ts-ignore
SocketIO.Socket = (window.socket as any);
//@ts-ignore
export var Import: any = (window.mb_import as any);

Init();
// funny shortcut
export async function Install(filename: string, url: string) {
    //@ts-ignore
    await ModBox.fs.writeFile(`/mod/${filename}`, await (await fetch(url)).text())
}