import ContextMenuOption from "../templates/ContextMenuOptions"
import getOptionID from "./get-option-id"

export default function findOptions(option: ContextMenuOption, toFind: string, parent: string) {
	if (!option.label)
		return

	if (option.children)
		option.children.forEach(c => findOptions(c, toFind, parent))

	if (toFind === getOptionID(option.label, parent)) {
		if (option.onClick != null)
			option.onClick()
		else if (option.callback)
			option.callback()
	}
}