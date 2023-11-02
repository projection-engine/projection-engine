import ENGINE from "../../editor/static/ENGINE_STORE_STATE"
import AbstractStore from "./AbstractStore"


export default class EngineStore extends AbstractStore<typeof ENGINE>{
	constructor() {
		super(ENGINE)
	}

	static getData(): typeof ENGINE {
		return this.get<AbstractStore>().data as typeof ENGINE
	}
}



