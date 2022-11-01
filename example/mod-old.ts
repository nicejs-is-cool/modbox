/// /<reference path="../src/declarations.d.ts" />
/// <reference path="../src/inject.ts" />
export class EpicMod implements ModBox.Mod {
        name = "epic mod!1";
        author = "your mom";
        description = "fardnite emulator";
        version = "4.2.0";
        updateURL = "https://drugtrafficking.com/rm/mods/epic-release.js";
        id = "epic"
        enable() {
            alert('become chad');
            ModBox.Mods.Get<ModBox.Internal.MixinCore>("mixincore").EnableMixin(this.sendMsg);
            return true;
        }
        disable() {
            alert('you have lost 69 bitches');
            ModBox.Mods.Get<ModBox.Internal.MixinCore>("mixincore").DisableMixin(this.sendMsg);
            return true;
        }
        allowed = ["rmtrollbox" as ModBox.Allowed]

        @ModBox.Mixin(window, "head")
        sendMsg(a: string[]) {
            a[0] = a[0].replace(/fornite/g, "fardnite");
        }
    }