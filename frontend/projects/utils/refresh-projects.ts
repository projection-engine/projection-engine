import FileSystemService from "../../shared/lib/FileSystemService"
import FileTypes from "../../../shared/FileTypes";
import LocalizationEN from "../../../shared/LocalizationEN";


export default async function refreshProjects(path) {

	const res = await FileSystemService.getInstance().readdir(path)
	if (!res)
		return []
	const data = []
	for (let i = 0; i < res.length; i++) {
		const itemPath = path + FileSystemService.getInstance().sep + res[i]
		const stat = await FileSystemService.getInstance().stat(itemPath)

		if(!stat?.isDirectory)
			continue
		const children = await FileSystemService.getInstance().readdir(itemPath)
		if(!children)
			continue
		const metadata = children.find(c => c.includes(FileTypes.PROJECT))

		if(!metadata)
			continue
		const blob = await FileSystemService.getInstance().read(itemPath + FileSystemService.getInstance().sep  + metadata)
		const parts = itemPath.split(FileSystemService.getInstance().sep)
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