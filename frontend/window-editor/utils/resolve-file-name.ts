import {getCall} from "../../shared/lib/FS/get-call"
import IPCRoutes from "../../../contants/IPCRoutes";


export default async function resolveFileName(path: string, ext: string): Promise<string> {
	return await getCall(IPCRoutes.RESOLVE_NAME, {path, ext}, false)
}