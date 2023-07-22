import AbstractStore from "./AbstractStore"


export default class ChangesTrackerStore extends AbstractStore{
	updateStore(value?:{changed: boolean}) {
		if(this.data.changed === value.changed)
			return
		super.updateStore(value)
	}
}

