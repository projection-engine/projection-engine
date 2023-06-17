import * as fs from "fs"
import * as path from "path"

export default async function readFile(p, options?:any):Promise<[string,any]> {
	let result, error
	try {
		result = await fs.promises.readFile(path.resolve(p), options)
	} catch (err) {
		error = err
	}
	return [error, result ? result.toString() : undefined]
}