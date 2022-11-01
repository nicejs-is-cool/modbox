declare namespace ModBox {
    export type HookWhere = "head" | "tail";
    export type HookWhen = "before" | "after";
    export type Allowed = "rmtrollbox" | "cyio" | "trollboxparty" | "boxkmk"
    export enum Trollboxes {
        rmtrollbox = "https://rmtrollbox.eu-gb.mybluemix.net",
        cyio = "https://cyio.trollbox.party",
        trollboxparty = "https://trollbox.party",
        boxkmk = "https://box.km.mk",
        strollbox = "https://vent.suspc.cf"
    }
    export function Depends(modName: string, version?: string): (constructor: any) => void;
    export namespace SocketIO {
        export function Hook(eventName: string, when: HookWhen): () => void;
        export const Socket: any;
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
    }
    class ModManager {
        Get<T>(id: string): T;
        Load(mod: any): void;
        Enable(id: string): void;
        Disable(id: string): void;
    }
    export const Mods: ModManager;
    
}