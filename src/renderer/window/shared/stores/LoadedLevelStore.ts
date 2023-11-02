import AbstractStore from "./AbstractStore"


export default class LoadedLevelStore extends AbstractStore{
	updateStore(value?:{loadedLevel: string}) {
		super.updateStore(value)
	}
}

