import * as fs from "fs"
import * as path from "path"

export default async function readdir(p, options) {
	let response, error
	try {
		response = await fs.promises.readdir(path.resolve(p), options)
	} catch (err) {
		error = err
	}
	return [error, response]
}