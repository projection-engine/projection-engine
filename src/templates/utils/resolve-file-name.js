import {getCall} from "shared-resources/frontend/libs/NodeFS";

export default async function resolveFileName(path, ext){
    const result =await getCall("resolve-name", {path, ext}, false)
    console.trace(result)
    return result
}