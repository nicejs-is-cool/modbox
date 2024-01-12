import fs from 'fs';
import EventEmitter from 'events'

export function readdir(path: fs.PathLike): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) return reject(err);
            return resolve(files);
        })
    })
}

export function readFile(path: fs.PathOrFileDescriptor, options: ({ encoding?: null | undefined; flag?: string | undefined; } & EventEmitter.Abortable) | null | undefined): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, options, (err, data) => {
            if (err) return reject(err)
            return resolve(data)
        })
    })
}

export function writeFile(file: fs.PathOrFileDescriptor, data: string | NodeJS.ArrayBufferView, options: fs.WriteFileOptions): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, options, (err) => {
            if (err) return reject(err);
            resolve();
        })
    })
}

export function exists(file: fs.PathLike): Promise<boolean> {
    return new Promise((resolve, reject) => {
        fs.exists(file, exists => {
            resolve(exists);
        })
    })
}

export function mkdir(path: fs.PathLike, options: fs.MakeDirectoryOptions & { recursive: true }): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, options, (err) => {
            if (err) return reject(err);
            return resolve();
        })
    })
}

export function unlink(path: fs.PathLike): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) return reject(err);
            return resolve();
        })
    })
}