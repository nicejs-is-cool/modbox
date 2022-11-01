//import * as ModBox from '../src/inject/main'
//import { type Mod } from '../src/inject/main'
/// <reference path="../src/declarations.d.ts" />
(function () {
    return class EpicMod {
        constructor() {
            this.name = "epic mod !1";
            this.author = "your mom";
            this.description = "fardnite emualtor";
            this.version = "4.2.0";
            this.id = "epic";
        }
        enable() {
            console.log('hello world!');
            return true;
        }
        disable() {
            return true;
        }
    };
})();
