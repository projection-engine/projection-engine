import FS from "../../shared/lib/FS/FS"
import FileTypes from "../../../contants/FileTypes";
import LocalizationEN from "../../../contants/LocalizationEN";


export default async function refreshProjects(path) {

	const res = await FS.readdir(path)
	if (!res)
		return []
	const data = []
	for (let i = 0; i < res.length; i++) {
		const itemPath = path + FS.sep + res[i]
		const stat = await FS.stat(itemPath)

		if(!stat?.isDirectory)
			continue
		const children = await FS.readdir(itemPath)
		if(!children)
			continue
		const metadata = children.find(c => c.includes(FileTypes.PROJECT))

		if(!metadata)
			continue
		const blob = await FS.read(itemPath + FS.sep  + metadata)
		const parts = itemPath.split(FS.sep)
		const parsedMetadata = JSON.parse(blob.toString())

		data.push({
			id: parts.pop(),
			meta: {...parsedMetadata, settings: undefined},
			settings: parsedMetadata?.settings,
			path: itemPath
		})
	}
	return data.filter(e => e !== undefined).map(e => {
		const res = {...e}
		if (!res.meta) res.meta = {name: LocalizationEN.NEW_PROJECT}
		if (!res.settings) res.settings = {}
		if (!res.meta.name) res.meta.name = LocalizationEN.CREATE
		return res
	})
}