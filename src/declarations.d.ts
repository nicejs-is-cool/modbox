declare namespace ModBox {
    export type HookWhere = "head" | "tail";
    export type HookWhen = "before" | "after";
    export type Allowed = "rmtrollbox" | "cyio" | "trollboxparty" | "boxkmk" | "ducktb"
    export enum Websites {
        //rmtrollbox = "https://rmtrollbox.eu-gb.mybluemix.net",
        rmtrollbox = "https://sussite.tk",
        cyio = "https://cyio.trollbox.party",
        trollboxparty = "https://trollbox.party",
        boxkmk = "https://box.km.mk",
        strollbox = "https://trollbox.suspc.cf",
        //ducktb = "https://ducktrollbox.paperluigis.repl.co",
        ducktb = "http://chat.auby.duckdns.org/",
        trollbox = "https://www.windows93.net/trollbox/"
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