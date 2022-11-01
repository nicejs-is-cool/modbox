/*export namespace Internal {
    export interface Mixin {
    }
    export interface Mixins {
        OriginalFunctions: Map<string, Function>;
        Chain: {[key: number]: Mixin};
    }
    export class MixinCore implements ModBox.Mod {
        name = "MixinCore"
        description = "Mixin core"
        author = "nicejs-is-cool"
        version = "0.0.1"
        enable() {return false}
        disable() {return false}
        id = "mixincore"
        private mixins: Mixins = {
            OriginalFunctions: new Map<string, Function>(),
            Chain: {}
        }
        EnableMixin(mixin: Function) {
            // todo: implement this
        }
        DisableMixin(mixin: Function) {
            // todo: implement this
        }
        Mixin(obj: any, where: HookWhere) {
            return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
                /*let newIndex = Math.max(...Object.keys(this.mixins.Chain).map(x => parseInt(x)))+1
                target[propertyKey].__mixin_index = newIndex lets figure that out lator*/
                /*const func = obj[propertyKey].toString();
                const old = obj[propertyKey]
                if (where === "head") {
                    obj[propertyKey] = function(...a: any[]) {
                        target[propertyKey](a);
                        old(...a);
                    }
                } else {
                    obj[propertyKey] = function(...a: any[]) {
                        old(...a);
                        target[propertyKey](a);
                    }
                }
                
            }
        }
    }
}*/