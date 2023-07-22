import AbstractStore from "./AbstractStore"
import SelectionTargets from "../../../../shared/enums/SelectionTargets"

export default class SelectionStore extends AbstractStore{
	constructor() {

		super({TARGET: SelectionTargets.ENGINE, array: <string[]>[]})
	}
}
