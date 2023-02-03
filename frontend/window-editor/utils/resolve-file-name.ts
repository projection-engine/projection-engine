import {getCall} from "../../shared/lib/FS/get-call";
import ROUTES from "../../../backend/static/ROUTES";

export default async function resolveFileName(path: string, ext: string) {
    return await getCall(ROUTES.RESOLVE_NAME, {path, ext}, false)
}