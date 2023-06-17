import ContextMenuOption from "../templates/ContextMenuOptions"
import getOptionID from "./get-option-id"
import MappedOption from "../templates/MappedOption"


export default function buildOptions(options: ContextMenuOption[], id: string|null): MappedOption[]{
	const template: MappedOption[] = []
	options.forEach(option => {
		if (option.divider)
			template.push({type: "separator"})
		else {
			const internalID = getOptionID(option.label, id)
			const cb = option.onClick || option.callback

			if (cb) {

				const temp = <MappedOption>{
					label: option.label,
					id: internalID
				}
				if (option.require) {
					const mapped = option.require.map(r => {
						const lower = r.toLowerCase()
						if (lower.includes("control"))
							return "CmdOrCtrl"
						if (lower.includes("alt"))
							return "Alt"
						if (lower.includes("shift"))
							return "Shift"

						return r.toUpperCase().replace("KEY", "").replace("ARROW", "")
					})
					temp.accelerator = mapped.join("+")
				}
				template.push(temp)
			} else if (Array.isArray(option.children) && option.children.length > 0)
				template.push({
					label: option.label,
					id: internalID,
					submenu: buildOptions(option.children, id)
				})

		}
	})
	return template
}