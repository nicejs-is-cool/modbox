import { Mod } from "./modapi";
export default class MBLogger extends Mod {
    public name: string = "MBLogger";
    public description: string = "The default logger for modbox.";
    public version: string = "0.0.1";
    public namespace: string = "mblogger";
    public init() {}
    public CreateLogger(name: string) {
        return new Logger(name);
    }
}
export class Logger {
    constructor(public name: string) {}
    private getTime() {
        let d = new Date();
        let hour = d.getHours().toString().padStart(2, "0");
        let minute = d.getMinutes().toString().padStart(2, "0");
        let second = d.getSeconds().toString().padStart(2, "0");
        return `${hour}:${minute}:${second}`;
    }
    public log(...args: any[]) {
        console.log(`[${this.getTime()}] [${this.name}]`, ...args);
    }
    public info(...args: any[]) {
        console.info(`[${this.getTime()}] [${this.name}] [INFO]`, ...args);
    }
    public warn(...args: any[]) {
        console.warn(`[${this.getTime()}] [${this.name}] [WARN]`, ...args);
    }
    public error(...args: any[]) {
        console.error(`[${this.getTime()}] [${this.name}] [ERROR]`, ...args);
    }
}