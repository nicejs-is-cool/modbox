import * as fs from './fs_promises'
import { Buffer } from 'buffer'
import pako from 'pako';
//@ts-ignore
import untar from 'js-untar'
import loadModule from './module_loader';

export async function loadTar(modfile: string, file: any): Promise<any> {
    const uncompressed = await pako.inflate(file)
    await fs.mkdir(`/tmp/${modfile}/`, {recursive: true})
    await untar.default(uncompressed.buffer).progress(async (file: any) => {
        if (file.type === "5") {
            // folder moment
            console.info('Creating folder %s', file.name);
            await fs.mkdir(`/tmp/${modfile}/${file.name}`, {recursive: true});
        }
        if (file.type === "0") { // actual files
            console.info('Read %s', file.name)
            console.info(`/tmp/${modfile}/${file.name}`);
            await fs.writeFile(`/tmp/${modfile}/${file.name}`, Buffer.from(file.buffer), {});
        }
    });
    let mainFolder = (await fs.readdir(`/tmp/${modfile}/`))[0];
    const mainf = (await fs.readFile(`/tmp/${modfile}/${mainFolder}/main.js`, {})).toString('utf-8')
    const modmodule = await loadModule(mainf);
    return modmodule;
}