import FileTypes from "../../../../shared/enums/FileTypes"
import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import FileSystemUtil from "../../shared/FileSystemUtil"


export default async function refreshProjects(path) {

	const res = await FileSystemUtil.readdir(path)
	if (!res)
		return []
	const data = []
	for (let i = 0; i < res.length; i++) {
		const itemPath = path + FileSystemUtil.sep + res[i]
		const stat = await FileSystemUtil.stat(itemPath)

		if(!stat?.isDirectory)
			continue
		const children = await FileSystemUtil.readdir(itemPath)
		if(!children)
			continue
		const metadata = children.find(c => c.includes(FileTypes.PROJECT))

		if(!metadata)
			continue
		const blob = await FileSystemUtil.read(itemPath + FileSystemUtil.sep  + metadata)
		const parts = itemPath.split(FileSystemUtil.sep)
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