import AbstractStore from "./AbstractStore"

export default class WindowChangeStore extends AbstractStore {
	constructor() {
		super({message: undefined, callback: undefined})
	}
}

