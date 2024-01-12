//import * as ModBox from '../src/inject/main'
//import { type Mod } from '../src/inject/main'
/// <reference path="../src/declarations.d.ts" />

export default class EpicMod implements ModBox.Mod {
    name = "epic mod !1"
    author = "your mom"
    description = "fardnite emualtor"
    version = "4.2.0"
    id = "epic"
    enable() {
        console.log('hello world!')
    return true;
    }
        disable() {
        return true;
    }
}