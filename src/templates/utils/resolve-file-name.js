import {getCall} from "shared-resources/frontend/libs/NodeFS";

export default async function resolveFileName(path, ext){
    return await getCall("resolve-name", {path, ext}, false)
}