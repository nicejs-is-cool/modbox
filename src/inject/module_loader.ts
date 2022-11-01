import { Import } from "./main";
export default async function loadModule(text: string) {
    const mainfblob = new Blob([text], {
        type: 'text/javascript'
    });
    const mfburl = URL.createObjectURL(mainfblob);
    const mainfexp = await Import(mfburl);
    return mainfexp.default;
}