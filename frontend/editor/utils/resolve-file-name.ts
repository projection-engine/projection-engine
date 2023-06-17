import {getCall} from "../../shared/util/get-call"
import IPCRoutes from "../../../shared/IPCRoutes";


export default async function resolveFileName(path: string, ext: string): Promise<string> {
	return await getCall(IPCRoutes.RESOLVE_NAME, {path, ext}, false)
}