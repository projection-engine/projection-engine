import {getCall} from "../../lib/FS/get-call";

export default async function resolveFileName(path: string, ext: string) {
    return await getCall("resolve-name", {path, ext}, false)
}