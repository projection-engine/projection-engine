import ENGINE from "../../editor/static/ENGINE"
import AbstractStore from "./AbstractStore"


export default class EngineStore extends AbstractStore{
	constructor() {
		super(ENGINE)
	}
}



