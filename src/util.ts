export function sleep(ms: number) {return new Promise(resolve => setTimeout(resolve, ms))};
export namespace array {
    export function deepClone(arr: any[]): any[] {
        let newarr: any[] = [];
        for (let i = 0; i < arr.length; i++) {
            let data = arr[i];
            if (typeof data === "object") data = object.deepClone(data);
            if (Array.isArray(data)) data = deepClone(data);
            newarr.push(data);
        }
        return newarr;
    };
    export function remove(index: number, arr: any[]){
        return arr.splice(index, 1);
    }
}
export namespace object {
    export function hasFunctions(obj: any): boolean {
        for (let item in obj) {
            if (typeof obj[item] === "function") return true;
            if (typeof obj[item] === "object") return hasFunctions(obj[item]);
        }
        return false;
    }
    export function deepClone(obj: any): any {
        if ((window as any).structuredClone) return (window as any).structuredClone(obj)
        if (!hasFunctions(obj)) return JSON.parse(JSON.stringify(obj));
        let newobj: any = {};
        for (let item in obj) {
            if (typeof obj[item] === "object") {newobj[item] = deepClone(obj[item]); continue}
            if (Array.isArray(obj[item])) {newobj[item] = array.deepClone(obj[item]); continue}
            newobj[item] = obj[item];
        }
    }
}