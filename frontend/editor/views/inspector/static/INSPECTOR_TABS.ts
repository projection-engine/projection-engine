import PREFERENCES from "../../../../preferences/static/PREFERENCES"
import LocalizationEN from "../../../../../shared/enums/LocalizationEN"

export default [
	PREFERENCES[2],
	PREFERENCES[3],
	{type: "camera", icon: "camera", label: LocalizationEN.EDITOR_CAMERA},
	{divider: true}
]