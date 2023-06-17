import LocalizationEN from "../../../../../contants/LocalizationEN"
import FileTypes from "../../../../../contants/FileTypes"

export default function getFileTypes() {
	const c = {...FileTypes}
	return Object.keys(c).map(m => m === FileTypes.PROJECT ? undefined : [m, LocalizationEN[m]]).filter(e => e[1] != null)

}